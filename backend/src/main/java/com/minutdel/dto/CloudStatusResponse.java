package com.minutdel.dto;

import java.time.LocalDateTime;

public class CloudStatusResponse {

    private String appName;
    private String environment;
    private String databaseType;
    private boolean awsS3Enabled;
    private String s3Bucket;
    private String hostName;
    private String serverTime;
    private String cloudTierInfo;
    
    // Cloud JVM & Health Telemetry
    private long totalMemoryMb;
    private long freeMemoryMb;
    private long usedMemoryMb;
    private int availableProcessors;
    private int activeThreads;

    public CloudStatusResponse() {}

    public CloudStatusResponse(String appName, String environment, String databaseType, boolean awsS3Enabled,
                               String s3Bucket, String hostName, String cloudTierInfo,
                               long totalMemoryMb, long freeMemoryMb, long usedMemoryMb,
                               int availableProcessors, int activeThreads) {
        this.appName = appName;
        this.environment = environment;
        this.databaseType = databaseType;
        this.awsS3Enabled = awsS3Enabled;
        this.s3Bucket = s3Bucket;
        this.hostName = hostName;
        this.serverTime = LocalDateTime.now().toString();
        this.cloudTierInfo = cloudTierInfo;
        this.totalMemoryMb = totalMemoryMb;
        this.freeMemoryMb = freeMemoryMb;
        this.usedMemoryMb = usedMemoryMb;
        this.availableProcessors = availableProcessors;
        this.activeThreads = activeThreads;
    }

    public String getAppName() { return appName; }
    public String getEnvironment() { return environment; }
    public String getDatabaseType() { return databaseType; }
    public boolean isAwsS3Enabled() { return awsS3Enabled; }
    public String getS3Bucket() { return s3Bucket; }
    public String getHostName() { return hostName; }
    public String getServerTime() { return serverTime; }
    public String getCloudTierInfo() { return cloudTierInfo; }
    public long getTotalMemoryMb() { return totalMemoryMb; }
    public long getFreeMemoryMb() { return freeMemoryMb; }
    public long getUsedMemoryMb() { return usedMemoryMb; }
    public int getAvailableProcessors() { return availableProcessors; }
    public int getActiveThreads() { return activeThreads; }
}
