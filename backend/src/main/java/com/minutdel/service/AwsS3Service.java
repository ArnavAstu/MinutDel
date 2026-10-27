package com.minutdel.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Service
public class AwsS3Service {

    private static final Logger log = LoggerFactory.getLogger(AwsS3Service.class);

    @Value("${aws.region:ap-south-1}")
    private String region;

    @Value("${aws.s3.bucket-name:minutdel-product-assets}")
    private String bucketName;

    @Value("${aws.s3.access-key:}")
    private String accessKey;

    @Value("${aws.s3.secret-key:}")
    private String secretKey;

    @Value("${aws.s3.enabled:false}")
    private boolean s3Enabled;

    private S3Client s3Client;

    public void initializeClient() {
        if (s3Enabled && !accessKey.isBlank() && !secretKey.isBlank()) {
            try {
                this.s3Client = S3Client.builder()
                        .region(Region.of(region))
                        .credentialsProvider(StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(accessKey, secretKey)
                        ))
                        .build();
                log.info("AWS S3 Client connected successfully to bucket: {} in region: {}", bucketName, region);
            } catch (Exception e) {
                log.warn("Failed to initialize live AWS S3 client: {}. Falling back to local mode.", e.getMessage());
                this.s3Enabled = false;
            }
        } else {
            log.info("AWS S3 is in local simulation mode (no AWS credentials provided).");
        }
    }

    public boolean isS3Enabled() {
        return s3Enabled;
    }

    public String getBucketName() {
        return bucketName;
    }

    public String getRegion() {
        return region;
    }

    public String resolveImageUrl(String imageNameOrUrl) {
        if (imageNameOrUrl == null || imageNameOrUrl.isBlank()) {
            return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop";
        }
        // If it's already a full HTTP URL (Unsplash or external CDN), return as-is
        if (imageNameOrUrl.startsWith("http://") || imageNameOrUrl.startsWith("https://")) {
            return imageNameOrUrl;
        }
        // If S3 is active, construct AWS S3 URL: https://bucket-name.s3.region.amazonaws.com/imageName
        if (s3Enabled) {
            return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, imageNameOrUrl);
        }
        // Local fallback
        return imageNameOrUrl;
    }
}
