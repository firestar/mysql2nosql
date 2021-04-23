import {JsonClassType, JsonProperty} from "jackson-js";

export interface ColumDataInterface{
    name: string
    type: string
    index: boolean
    primary: boolean
}

export class ColumnData implements ColumDataInterface{
    constructor(index: boolean, name: string, primary: boolean, type: string) {
        this.index = index;
        this.name = name;
        this.primary = primary;
        this.type = type;
    }

    @JsonProperty() @JsonClassType({type: () => [Boolean]})
    index: boolean;

    @JsonProperty() @JsonClassType({type: () => [String]})
    name: string;

    @JsonProperty() @JsonClassType({type: () => [Boolean]})
    primary: boolean;

    @JsonProperty() @JsonClassType({type: () => [String]})
    type: string;

}
