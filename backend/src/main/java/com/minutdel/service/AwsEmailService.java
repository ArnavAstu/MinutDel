package com.minutdel.service;

import com.minutdel.model.Order;
import com.minutdel.model.OrderItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AwsEmailService {

    private static final Logger log = LoggerFactory.getLogger(AwsEmailService.class);

    @Value("${aws.region:ap-south-1}")
    private String region;

    @Value("${aws.ses.from-email:orders@minutdel.com}")
    private String fromEmail;

    @Value("${aws.ses.access-key:}")
    private String accessKey;

    @Value("${aws.ses.secret-key:}")
    private String secretKey;

    @Value("${aws.ses.enabled:false}")
    private boolean sesEnabled;

    private SesClient sesClient;

    // Cache of recent generated invoices so customers & evaluators can view/verify them directly
    private final Map<Long, String> generatedInvoices = new ConcurrentHashMap<>();

    public void initializeClient() {
        if (sesEnabled && !accessKey.isBlank() && !secretKey.isBlank()) {
            try {
                this.sesClient = SesClient.builder()
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        ))
                        .build();
                log.info("AWS SES Client connected successfully. Sender: {} in region: {}", fromEmail, region);
            } catch (Exception e) {
                log.warn("Failed to initialize live AWS SES client: {}. Falling back to simulation mode.", e.getMessage());
                this.sesEnabled = false;
            }
        } else {
            log.info("AWS SES is in simulation mode (no AWS SES credentials provided).");
        }
    }

    public boolean isSesEnabled() {
        return sesEnabled;
    }

    public String getFromEmail() {
        return fromEmail;
    }

    /**
     * Asynchronously sends the tax invoice & bill email to the customer using AWS SES
     */
    @Async
    public void sendOrderInvoiceEmail(Order order) {
        if (order == null || order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) {
            log.warn("Cannot send email: Order or customer email is null");
            return;
        }

        String recipientEmail = order.getCustomerEmail().trim();
        String subject = "MinutDel Order #" + order.getId() + " Confirmed - Your 10-Minute Grocery Tax Invoice & Bill";
        String htmlBody = generateHtmlInvoice(order);
        String textBody = generatePlainTextInvoice(order);

        // Store generated invoice for instant preview & auditing
        generatedInvoices.put(order.getId(), htmlBody);

        log.info("Preparing AWS SES order bill for Order #{} to recipient: {}", order.getId(), recipientEmail);

        if (sesEnabled && sesClient != null) {
            try {
                SendEmailRequest emailRequest = SendEmailRequest.builder()
                        .destination(Destination.builder()
                                .toAddresses(recipientEmail)
                                .build())
                        .message(Message.builder()
                                .subject(Content.builder().data(subject).charset("UTF-8").build())
                                .body(Body.builder()
                                        .html(Content.builder().data(htmlBody).charset("UTF-8").build())
                                        .text(Content.builder().data(textBody).charset("UTF-8").build())
                                        .build())
                                .build())
                        .source(fromEmail)
                        .build();

                SendEmailResponse response = sesClient.sendEmail(emailRequest);
                log.info("AWS SES successfully dispatched order tax invoice to {}! MessageId: {}", recipientEmail, response.messageId());
            } catch (Exception e) {
                log.error("AWS SES dispatch failed for Order #{} to {}: {}", order.getId(), recipientEmail, e.getMessage());
            }
        } else {
            log.info("AWS SES (Simulation Mode): Formatted Tax Invoice & Bill generated for Order #{} to customer {}", order.getId(), recipientEmail);
        }
    }

    public String getInvoiceHtml(Long orderId) {
        return generatedInvoices.get(orderId);
    }

    private String generateHtmlInvoice(Order order) {
        String formattedDate = order.getCreatedAt() != null 
                ? order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))
                : "Just now";

        StringBuilder itemsRows = new StringBuilder();
        int itemIndex = 1;

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                String prodName = item.getProduct() != null ? item.getProduct().getName() : "Grocery Item";
                String unit = item.getProduct() != null && item.getProduct().getUnit() != null ? item.getProduct().getUnit() : "";
                BigDecimal unitPrice = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal subtotal = item.getSubtotal() != null ? item.getSubtotal() : BigDecimal.ZERO;

                itemsRows.append("<tr>")
                        .append("<td style='padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155;'>").append(itemIndex++).append("</td>")
                        .append("<td style='padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a;'>")
                        .append(prodName)
                        .append("<span style='display:block; font-size: 11px; color: #64748b; font-weight: normal;'>").append(unit).append("</span>")
                        .append("</td>")
                        .append("<td style='padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center; color: #334155;'>").append(item.getQuantity()).append("</td>")
                        .append("<td style='padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; color: #334155;'>₹").append(unitPrice.setScale(2)).append("</td>")
                        .append("<td style='padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; text-align: right; color: #0f172a;'>₹").append(subtotal.setScale(2)).append("</td>")
                        .append("</tr>");
            }
        }

        BigDecimal itemsTotal = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
        BigDecimal handlingFee = new BigDecimal("2.00");
        BigDecimal finalTotal = itemsTotal.add(handlingFee);

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head><meta charset='UTF-8'><title>MinutDel Tax Invoice</title></head>"
                + "<body style='font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #0f172a;'>"
                + "<div style='max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;'>"
                
                // Header
                + "<div style='background: #0f172a; padding: 24px; color: #ffffff; text-align: left; border-bottom: 4px solid #f8cb46;'>"
                + "  <div style='display: flex; justify-content: space-between; align-items: center;'>"
                + "    <div>"
                + "      <h1 style='margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;'>Minut<span style='color: #0c831f;'>Del</span></h1>"
                + "      <p style='margin: 4px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8;'>Superfast 10-Minute Quick Commerce • AWS Cloud Platform</p>"
                + "    </div>"
                + "  </div>"
                + "</div>"

                // Invoice Status Banner
                + "<div style='background: #e8f5e9; padding: 14px 24px; border-bottom: 1px solid #c8e6c9; display: flex; justify-content: space-between; align-items: center;'>"
                + "  <span style='color: #0c831f; font-weight: 800; font-size: 13px;'>⚡ Order #" + order.getId() + " Confirmed</span>"
                + "  <span style='background: #0c831f; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 6px;'>ETA: 10 MINS</span>"
                + "</div>"

                // Customer & Delivery Details
                + "<div style='padding: 24px;'>"
                + "  <h3 style='margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;'>Customer & Delivery Details</h3>"
                + "  <div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;'>"
                + "    <table style='width: 100%; border-collapse: collapse; font-size: 13px;'>"
                + "      <tr><td style='padding: 4px 0; color: #64748b; width: 140px;'>Customer Name:</td><td style='padding: 4px 0; font-weight: 700; color: #0f172a;'>" + (order.getCustomerName() != null ? order.getCustomerName() : "Valued Customer") + "</td></tr>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Email Address:</td><td style='padding: 4px 0; font-weight: 600; color: #0284c7;'>" + order.getCustomerEmail() + "</td></tr>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Contact Number:</td><td style='padding: 4px 0; font-weight: 600; color: #0f172a;'>" + (order.getContactNumber() != null ? order.getContactNumber() : "N/A") + "</td></tr>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Delivery Address:</td><td style='padding: 4px 0; font-weight: 600; color: #0f172a;'>" + (order.getDeliveryAddress() != null ? order.getDeliveryAddress() : "N/A") + "</td></tr>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Dark Store Hub:</td><td style='padding: 4px 0; font-weight: 600; color: #0c831f;'>" + (order.getDarkStoreLocation() != null ? order.getDarkStoreLocation() : "Hub #07") + "</td></tr>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Order Date & Time:</td><td style='padding: 4px 0; color: #334155;'>" + formattedDate + "</td></tr>"
                + "    </table>"
                + "  </div>"

                // Itemized Bill Table
                + "  <h3 style='margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;'>Itemized Grocery Bill</h3>"
                + "  <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>"
                + "    <thead>"
                + "      <tr style='background: #f1f5f9; text-align: left;'>"
                + "        <th style='padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #475569;'>#</th>"
                + "        <th style='padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #475569;'>Product Item</th>"
                + "        <th style='padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: center;'>Qty</th>"
                + "        <th style='padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: right;'>Price</th>"
                + "        <th style='padding: 8px 12px; font-size: 11px; text-transform: uppercase; color: #475569; text-align: right;'>Subtotal</th>"
                + "      </tr>"
                + "    </thead>"
                + "    <tbody>"
                + itemsRows
                + "    </tbody>"
                + "  </table>"

                // Bill Summary
                + "  <div style='background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-left: auto; max-width: 280px;'>"
                + "    <table style='width: 100%; border-collapse: collapse; font-size: 13px;'>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Items Subtotal:</td><td style='padding: 4px 0; text-align: right; font-weight: 600;'>₹" + itemsTotal.setScale(2) + "</td></tr>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Delivery Charge:</td><td style='padding: 4px 0; text-align: right; color: #0c831f; font-weight: 700;'><span style='text-decoration: line-through; color: #94a3b8; font-size: 11px; margin-right: 4px;'>₹15.00</span>FREE</td></tr>"
                + "      <tr><td style='padding: 4px 0; color: #64748b;'>Handling Fee:</td><td style='padding: 4px 0; text-align: right; font-weight: 600;'>₹" + handlingFee.setScale(2) + "</td></tr>"
                + "      <tr style='border-top: 2px solid #cbd5e1;'><td style='padding: 8px 0 0; font-size: 15px; font-weight: 900; color: #0f172a;'>Total Paid:</td><td style='padding: 8px 0 0; text-align: right; font-size: 16px; font-weight: 900; color: #0c831f;'>₹" + finalTotal.setScale(2) + "</td></tr>"
                + "    </table>"
                + "  </div>"

                // Footer
                + "  <div style='margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.6;'>"
                + "    <p style='margin: 0 0 4px;'>This is a computer-generated tax invoice delivered directly via <strong>Amazon Web Services (AWS SES)</strong>.</p>"
                + "    <p style='margin: 0;'>MinutDel Quick Commerce Platform • Cloud Computing Class Demonstration Project</p>"
                + "  </div>"
                + "</div>"

                + "</div>"
                + "</body>"
                + "</html>";
    }

    private String generatePlainTextInvoice(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("====================================================\n");
        sb.append("   MINUTDEL 10-MINUTE QUICK COMMERCE TAX INVOICE   \n");
        sb.append("====================================================\n\n");
        sb.append("Order ID: #").append(order.getId()).append("\n");
        sb.append("Customer: ").append(order.getCustomerName()).append("\n");
        sb.append("Email: ").append(order.getCustomerEmail()).append("\n");
        sb.append("Phone: ").append(order.getContactNumber()).append("\n");
        sb.append("Delivery Address: ").append(order.getDeliveryAddress()).append("\n");
        sb.append("Dispatched from: ").append(order.getDarkStoreLocation()).append("\n\n");
        sb.append("----------------------------------------------------\n");
        sb.append("ITEMS ORDERED:\n");

        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                String name = item.getProduct() != null ? item.getProduct().getName() : "Item";
                sb.append(" - ").append(name)
                        .append(" x ").append(item.getQuantity())
                        .append(" = ₹").append(item.getSubtotal())
                        .append("\n");
            }
        }

        sb.append("----------------------------------------------------\n");
        sb.append("Handling Fee: ₹2.00\n");
        sb.append("Delivery Fee: FREE (₹15 promo applied)\n");
        sb.append("TOTAL AMOUNT PAID: ₹").append(order.getTotalAmount() != null ? order.getTotalAmount().add(new BigDecimal("2.00")) : "0.00").append("\n");
        sb.append("====================================================\n");
        sb.append("Estimated Delivery: 10 minutes at your doorstep!\n");
        sb.append("Dispatched via AWS Cloud Infrastructure\n");
        return sb.toString();
    }
}
