package com.synload.m2n.domain.structure;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Nathaniel on 1/1/2017.
 */
public class ColumnInformation {
    public String name;
    public String type;
    public boolean index;
    public boolean primary;
    public ColumnInformation(String name, String type, boolean index, boolean primary){
        this.name = name;
        this.primary = primary;
        this.type = type;
        this.index = index;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isIndex() {
        return index;
    }

    public void setIndex(boolean index) {
        this.index = index;
    }

    public boolean isPrimary() {
        return primary;
    }

    public void setPrimary(boolean primary) {
        this.primary = primary;
    }
}
