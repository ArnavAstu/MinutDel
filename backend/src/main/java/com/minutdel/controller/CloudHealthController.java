package com.minutdel.controller;

import com.minutdel.dto.CloudStatusResponse;
import com.minutdel.service.AwsS3Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.InetAddress;
import java.util.Arrays;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CloudHealthController {

    private final Environment env;
    private final AwsS3Service awsS3Service;
    private final com.minutdel.service.AwsEmailService awsEmailService;

    @Value("${spring.application.name:MinutDel}")
    private String appName;

    public CloudHealthController(Environment env, AwsS3Service awsS3Service, com.minutdel.service.AwsEmailService awsEmailService) {
        this.env = env;
        this.awsS3Service = awsS3Service;
        this.awsEmailService = awsEmailService;
    }

    @GetMapping("/cloud-info")
    public ResponseEntity<CloudStatusResponse> getCloudInfo() {
        String[] activeProfiles = env.getActiveProfiles();
        boolean isAws = Arrays.asList(activeProfiles).contains("aws");

        String hostName = "localhost";
        try {
            hostName = InetAddress.getLocalHost().getHostName();
        } catch (Exception ignored) {}

        String database = isAws ? "Amazon RDS (PostgreSQL db.t3.micro)" : "H2 Embedded In-Memory SQL (ACID Compliant)";
        String environment = isAws ? "AWS Cloud (EC2 t2.micro/t3.micro)" : "Local Development Environment";
        String cloudTier = "AWS Free Tier Architecture (Compute: EC2, Storage: S3, Email: SES, DB: RDS)";

        Runtime runtime = Runtime.getRuntime();
        long totalMemoryMb = runtime.totalMemory() / (1024 * 1024);
        long freeMemoryMb = runtime.freeMemory() / (1024 * 1024);
        long usedMemoryMb = totalMemoryMb - freeMemoryMb;
        int processors = runtime.availableProcessors();
        int activeThreads = Thread.activeCount();

        CloudStatusResponse response = new CloudStatusResponse(
                appName,
                environment,
                database,
                awsS3Service.isS3Enabled(),
                awsS3Service.getBucketName(),
                awsEmailService.isSesEnabled(),
                awsEmailService.getFromEmail(),
                hostName,
                cloudTier,
                totalMemoryMb,
                freeMemoryMb,
                usedMemoryMb,
                processors,
                activeThreads
        );

        return ResponseEntity.ok(response);
    }
}
