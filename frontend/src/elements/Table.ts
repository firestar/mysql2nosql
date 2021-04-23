import {JsonClassType, JsonProperty} from "jackson-js";
import {TableRelationship} from "./Relationship";
import {ColumnData} from "./ColumnData";
import {TableStatus} from "./TableStatus";

export interface TableInterface {
    columns: ColumnData[]
    tableStatus: any
}

const prefixWithUnderscore = (propertyName: string) => `_${propertyName}`
export class TableData implements TableInterface{

    constructor(columns: any[], tableStatus: any) {
        this.columns = columns;
        this.tableStatus = tableStatus;
    }


    @JsonProperty() @JsonClassType({type: () => [Array, [ColumnData]]})
    columns: ColumnData[] = [];

    @JsonProperty() @JsonClassType({type: () => [TableStatus]})
    tableStatus: TableStatus;

}
