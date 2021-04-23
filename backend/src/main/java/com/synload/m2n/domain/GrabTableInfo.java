package com.synload.m2n.domain;

import com.synload.m2n.M2N;
import com.synload.m2n.domain.structure.ColumnInformation;
import com.synload.m2n.domain.structure.TableStatus;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Nathaniel on 1/1/2017.
 */
public class GrabTableInfo {
    public List<ColumnInformation> columns = new ArrayList<ColumnInformation>();
    public TableStatus tableStatus = null;
    public GrabTableInfo(String tablename){
        try{
            PreparedStatement statement = M2N.connect.prepareStatement("SHOW COLUMNS FROM `"+tablename+"`");
            ResultSet resultSet = statement.executeQuery();
            while (resultSet.next()) {
                columns.add(
                    new ColumnInformation(
                        resultSet.getString(1),
                        resultSet.getString(2),
                        (resultSet.getString(4).equals(""))?false:true,
                        (resultSet.getString(4).equals("PRI"))?true:false
                    )
                );
            }
            statement = M2N.connect.prepareStatement("SHOW TABLE STATUS WHERE Name=?");
            statement.setString(1, tablename);
            resultSet = statement.executeQuery();
            while (resultSet.next()) {
                tableStatus = new TableStatus(
                    resultSet.getString("Name"),
                    resultSet.getString("Engine"),
                    resultSet.getString("Version"),
                    resultSet.getString("Row_format"),
                    resultSet.getLong("Rows"),
                    resultSet.getLong("Avg_row_length"),
                    resultSet.getLong("Data_length"),
                    resultSet.getLong("Max_data_length"),
                    resultSet.getLong("Index_length"),
                    resultSet.getLong("Data_free"),
                    resultSet.getLong("Auto_increment"),
                    resultSet.getTimestamp("Create_time"),
                    resultSet.getTimestamp("Update_time"),
                    resultSet.getTimestamp("Check_time"),
                    resultSet.getString("Collation"),
                    resultSet.getString("Checksum"),
                    resultSet.getString("Create_options"),
                    resultSet.getString("Comment")
                );
            }
        }catch(Exception e){
            e.printStackTrace();
        }
    }

    public List<ColumnInformation> getColumns() {
        return columns;
    }

    public void setColumns(List<ColumnInformation> columns) {
        this.columns = columns;
    }

    public TableStatus getTableStatus() {
        return tableStatus;
    }

    public void setTableStatus(TableStatus tableStatus) {
        this.tableStatus = tableStatus;
    }
}
