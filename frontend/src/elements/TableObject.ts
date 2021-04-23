import {TableData} from "./Table";
import {ObjectRelationship, TableRelationship} from "./Relationship";
import {JsonClassType, JsonProperty} from "jackson-js";
import {v4 as uuidv4} from "uuid";

export interface TableObjectInterface{
    main: TableData
    name: string
    key: string
    projections: Map<string, any>
}

const prefixWithUnderscore = (propertyName: string) => `_${propertyName}`;

export class TableObject implements TableObjectInterface {

    constructor(tables: TableRelationship[], key: string, main: TableData, name: string, projections: Map<string, any>) {
        this.tables = tables;
        this.key = key;
        this.main = main;
        this.name = name;
        this.projections = projections;
    }
    @JsonProperty() @JsonClassType({type: () => [Array, [TableRelationship]]})
    tables: TableRelationship[] = [];

    @JsonProperty() @JsonClassType({type: () => [Array, [ObjectRelationship]]})
    objects: ObjectRelationship[] = [];

    @JsonProperty() @JsonClassType({type: () => [String]})
    key: string = uuidv4();

    @JsonProperty() @JsonClassType({type: () => [TableData]})
    main: TableData = new TableData([], {});

    @JsonProperty() @JsonClassType({type: () => [String]})
    name: string = "";

    @JsonProperty() @JsonClassType({type: () => [Map]})
    projections: Map<string, any> = new Map<string, any>();

    getFields(){
        let fields: string[] = [];
        this.main.columns.forEach(c=>{
            fields.push(this.main.tableStatus.name+"."+c.name);
        });
        this.tables.forEach(t=> {
            t.target.columns.forEach(c=>{
                fields.push(t.target.tableStatus.name+"."+c.name);
            });
        });
        return fields;
    }


}
