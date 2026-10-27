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

    public CloudStatusResponse() {}

    public CloudStatusResponse(String appName, String environment, String databaseType, boolean awsS3Enabled, String s3Bucket, String hostName, String cloudTierInfo) {
        this.appName = appName;
        this.environment = environment;
        this.databaseType = databaseType;
        this.awsS3Enabled = awsS3Enabled;
        this.s3Bucket = s3Bucket;
        this.hostName = hostName;
        this.serverTime = LocalDateTime.now().toString();
        this.cloudTierInfo = cloudTierInfo;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getDatabaseType() {
        return databaseType;
    }

    public void setDatabaseType(String databaseType) {
        this.databaseType = databaseType;
    }

    public boolean isAwsS3Enabled() {
        return awsS3Enabled;
    }

    public void setAwsS3Enabled(boolean awsS3Enabled) {
        this.awsS3Enabled = awsS3Enabled;
    }

    public String getS3Bucket() {
        return s3Bucket;
    }

    public void setS3Bucket(String s3Bucket) {
        this.s3Bucket = s3Bucket;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getServerTime() {
        return serverTime;
    }

    public void setServerTime(String serverTime) {
        this.serverTime = serverTime;
    }

    public String getCloudTierInfo() {
        return cloudTierInfo;
    }

    public void setCloudTierInfo(String cloudTierInfo) {
        this.cloudTierInfo = cloudTierInfo;
    }
}
