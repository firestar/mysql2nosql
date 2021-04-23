import {JsonClassType, JsonProperty} from "jackson-js";

export interface TableStatusInterface {
    name: string
    engine: string,
    version: string,
    rowFormat: string,
    rows: number,
    avgRowLength: number,
    dataLength: number,
    maxDataLength: number,
    indexLength: number,
    dataFree: number,
    autoIncrement: number,
    createTime: number,
    updateTime: number,
    checkTime: string,
    collation: string,
    checksum: string,
    createOptions: string,
    comment: string
}
export class TableStatus implements TableStatusInterface {

    constructor(autoIncrement: number, avgRowLength: number, checkTime: string, checksum: string, collation: string, comment: string, createOptions: string, createTime: number, dataFree: number, dataLength: number, engine: string, indexLength: number, maxDataLength: number, name: string, rowFormat: string, rows: number, updateTime: number, version: string) {
        this.autoIncrement = autoIncrement;
        this.avgRowLength = avgRowLength;
        this.checkTime = checkTime;
        this.checksum = checksum;
        this.collation = collation;
        this.comment = comment;
        this.createOptions = createOptions;
        this.createTime = createTime;
        this.dataFree = dataFree;
        this.dataLength = dataLength;
        this.engine = engine;
        this.indexLength = indexLength;
        this.maxDataLength = maxDataLength;
        this.name = name;
        this.rowFormat = rowFormat;
        this.rows = rows;
        this.updateTime = updateTime;
        this.version = version;
    }

    @JsonProperty() @JsonClassType({type: () => [Number]})
    autoIncrement: number;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    avgRowLength: number;

    @JsonProperty() @JsonClassType({type: () => [String]})
    checkTime: string;

    @JsonProperty() @JsonClassType({type: () => [String]})
    checksum: string;

    @JsonProperty() @JsonClassType({type: () => [String]})
    collation: string;

    @JsonProperty() @JsonClassType({type: () => [String]})
    comment: string;

    @JsonProperty() @JsonClassType({type: () => [String]})
    createOptions: string;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    createTime: number;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    dataFree: number;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    dataLength: number;

    @JsonProperty() @JsonClassType({type: () => [String]})
    engine: string;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    indexLength: number;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    maxDataLength: number;

    @JsonProperty() @JsonClassType({type: () => [String]})
    name: string;

    @JsonProperty() @JsonClassType({type: () => [String]})
    rowFormat: string;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    rows: number;

    @JsonProperty() @JsonClassType({type: () => [Number]})
    updateTime: number;

    @JsonProperty() @JsonClassType({type: () => [String]})
    version: string;

}
