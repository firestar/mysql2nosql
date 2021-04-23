package com.synload.m2n.domain.structure;

import java.sql.Timestamp;

public class TableStatus {
    String name;
    String engine;
    String version;
    String rowFormat;
    long rows;
    long avgRowLength;
    long dataLength;
    long maxDataLength;
    long indexLength;
    long dataFree;
    long autoIncrement;
    Timestamp createTime;
    Timestamp updateTime;
    Timestamp checkTime;
    String collation;
    String checksum;
    String createOptions;
    String comment;

    public TableStatus(String name, String engine, String version, String rowFormat, long rows, long avgRowLength, long dataLength, long maxDataLength, long indexLength, long dataFree, long autoIncrement, Timestamp createTime, Timestamp updateTime, Timestamp checkTime, String collation, String checksum, String createOptions, String comment) {
        this.name = name;
        this.engine = engine;
        this.version = version;
        this.rowFormat = rowFormat;
        this.rows = rows;
        this.avgRowLength = avgRowLength;
        this.dataLength = dataLength;
        this.maxDataLength = maxDataLength;
        this.indexLength = indexLength;
        this.dataFree = dataFree;
        this.autoIncrement = autoIncrement;
        this.createTime = createTime;
        this.updateTime = updateTime;
        this.checkTime = checkTime;
        this.collation = collation;
        this.checksum = checksum;
        this.createOptions = createOptions;
        this.comment = comment;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEngine() {
        return engine;
    }

    public void setEngine(String engine) {
        this.engine = engine;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getRowFormat() {
        return rowFormat;
    }

    public void setRowFormat(String rowFormat) {
        this.rowFormat = rowFormat;
    }

    public long getRows() {
        return rows;
    }

    public void setRows(long rows) {
        this.rows = rows;
    }

    public long getAvgRowLength() {
        return avgRowLength;
    }

    public void setAvgRowLength(long avgRowLength) {
        this.avgRowLength = avgRowLength;
    }

    public long getDataLength() {
        return dataLength;
    }

    public void setDataLength(long dataLength) {
        this.dataLength = dataLength;
    }

    public long getMaxDataLength() {
        return maxDataLength;
    }

    public void setMaxDataLength(long maxDataLength) {
        this.maxDataLength = maxDataLength;
    }

    public long getIndexLength() {
        return indexLength;
    }

    public void setIndexLength(long indexLength) {
        this.indexLength = indexLength;
    }

    public long getDataFree() {
        return dataFree;
    }

    public void setDataFree(long dataFree) {
        this.dataFree = dataFree;
    }

    public long getAutoIncrement() {
        return autoIncrement;
    }

    public void setAutoIncrement(long autoIncrement) {
        this.autoIncrement = autoIncrement;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Timestamp updateTime) {
        this.updateTime = updateTime;
    }

    public Timestamp getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(Timestamp checkTime) {
        this.checkTime = checkTime;
    }

    public String getCollation() {
        return collation;
    }

    public void setCollation(String collation) {
        this.collation = collation;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public String getCreateOptions() {
        return createOptions;
    }

    public void setCreateOptions(String createOptions) {
        this.createOptions = createOptions;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
