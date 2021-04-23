package com.synload.m2n.controllers;

import com.synload.m2n.domain.GrabTableInfo;
import com.synload.m2n.domain.GrabTables;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Nathaniel on 1/1/2017.
 */
@RestController
@EnableAutoConfiguration
@CrossOrigin("*")
@RequestMapping("/")
public class TableInfo {
    @RequestMapping("/tables")
    public GrabTables list() {
        GrabTables gt = new GrabTables();
        return gt;
    }
    @RequestMapping("/table/{name}")
    public GrabTableInfo table(@PathVariable("name") String name){
        GrabTableInfo gti = new GrabTableInfo(name);
        return gti;
    }
}
