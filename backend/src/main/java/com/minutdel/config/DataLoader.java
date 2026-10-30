package com.minutdel.config;

import com.minutdel.model.Category;
import com.minutdel.model.Product;
import com.minutdel.model.User;
import com.minutdel.repository.CategoryRepository;
import com.minutdel.repository.ProductRepository;
import com.minutdel.repository.UserRepository;
import com.minutdel.service.AwsEmailService;
import com.minutdel.service.AwsS3Service;
import com.minutdel.service.SecurityTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataLoader.class);

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final AwsS3Service awsS3Service;
    private final AwsEmailService awsEmailService;
    private final UserRepository userRepository;
    private final SecurityTokenService securityTokenService;

    public DataLoader(CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      AwsS3Service awsS3Service,
                      AwsEmailService awsEmailService,
                      UserRepository userRepository,
                      SecurityTokenService securityTokenService) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.awsS3Service = awsS3Service;
        this.awsEmailService = awsEmailService;
        this.userRepository = userRepository;
        this.securityTokenService = securityTokenService;
    }

    @Override
    public void run(String... args) {
        awsS3Service.initializeClient();
        awsEmailService.initializeClient();

        // Seed users if not present
        if (userRepository.count() == 0) {
            String adminPass = securityTokenService.hashPassword("admin123");
            User admin = new User("admin@minutdel.com", adminPass, "Store Administrator", "+91 99999-00000", "ROLE_ADMIN");

            String customerPass = securityTokenService.hashPassword("customer123");
            User customer = new User("customer@minutdel.com", customerPass, "Rahul Sharma", "+91 98765-43210", "ROLE_CUSTOMER");

            userRepository.saveAll(List.of(admin, customer));
            log.info("Seeded default users: admin@minutdel.com and customer@minutdel.com");
        }

        if (categoryRepository.count() > 0) {
            log.info("Catalog database already initialized.");
            return;
        }

        log.info("Seeding Quick Commerce categories and products for MinutDel...");

        // Categories
        Category dairy = new Category("Dairy, Bread & Eggs", "dairy", "🥛", 1);
        Category snacks = new Category("Snacks & Munchies", "snacks", "🍟", 2);
        Category drinks = new Category("Cold Drinks & Juices", "drinks", "🥤", 3);
        Category instant = new Category("Instant Food", "instant", "🍜", 4);
        Category fresh = new Category("Fruits & Vegetables", "fresh", "🍎", 5);

        categoryRepository.saveAll(List.of(dairy, snacks, drinks, instant, fresh));

        // Products
        List<Product> products = List.of(
                new Product("Amul Taaza Toned Milk", "Pasteurized toned fresh milk packet",
                        new BigDecimal("28.00"), "500 ml", 45,
                        "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop", 4.9, dairy),

                new Product("Harvest Gold White Bread", "Soft sliced sandwich bread enriched with vitamins",
                        new BigDecimal("42.00"), "400 g", 30,
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop", 4.7, dairy),

                new Product("Farm Fresh Eggs (Pack of 6)", "Table eggs with high protein content",
                        new BigDecimal("55.00"), "6 pcs", 25,
                        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop", 4.8, dairy),

                new Product("Lay's India's Magic Masala", "Crispy spicy crinkle potato chips",
                        new BigDecimal("20.00"), "50 g", 60,
                        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop", 4.8, snacks),

                new Product("Haldiram's Bhujia Sev", "Classic crunchy spicy gram flour noodles",
                        new BigDecimal("55.00"), "200 g", 40,
                        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&auto=format&fit=crop", 4.6, snacks),

                new Product("Cadbury Dairy Milk Silk", "Rich and creamy smooth chocolate bar",
                        new BigDecimal("90.00"), "60 g", 35,
                        "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&auto=format&fit=crop", 4.9, snacks),

                new Product("Coca-Cola Soft Drink Can", "Refreshing classic sparkling beverage",
                        new BigDecimal("40.00"), "300 ml", 50,
                        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop", 4.8, drinks),

                new Product("Tropicana 100% Orange Juice", "Fresh squeezed orange juice with no added sugar",
                        new BigDecimal("125.00"), "1 L", 20,
                        "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop", 4.7, drinks),

                new Product("Maggi 2-Minute Masala Noodles", "India's favorite instant spiced noodles",
                        new BigDecimal("58.00"), "Pack of 4", 55,
                        "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop", 4.9, instant),

                new Product("Nescafe Classic Coffee Jar", "100% pure instant coffee granules",
                        new BigDecimal("190.00"), "50 g", 18,
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop", 4.8, instant),

                new Product("Fresh Cavendish Bananas", "Naturally ripened sweet bananas",
                        new BigDecimal("60.00"), "1 kg", 30,
                        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop", 4.6, fresh),

                new Product("Fresh Red Hybrid Tomatoes", "Firm, juicy, farm-fresh cooking tomatoes",
                        new BigDecimal("38.00"), "1 kg", 40,
                        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop", 4.5, fresh)
        );

        productRepository.saveAll(products);
        log.info("Successfully seeded {} categories and {} quick commerce products!", categoryRepository.count(), productRepository.count());
    }
}
