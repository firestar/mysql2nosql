import {TableData} from "./Table";
import {JsonClassType, JsonProperty} from "jackson-js";
import { v4 as uuidv4 } from 'uuid';

export interface RelationshipInterface{
    connections: Map<string, any>
}

export class TableRelationship implements RelationshipInterface{

    constructor(target: TableData) {
        this.target = target;
    }

    @JsonProperty() @JsonClassType({type: () => [String]})
    key: string = uuidv4();

    @JsonProperty() @JsonClassType({type: () => [TableData]})
    target: TableData;

    @JsonProperty() @JsonClassType({type: () => [Map]})
    connections: Map<string, any> = new Map<string, any>();

}


export class ObjectRelationship implements RelationshipInterface{

    constructor(target: string) {
        this.target = target;
    }

    @JsonProperty() @JsonClassType({type: () => [String]})
    key: string = uuidv4();

    @JsonProperty() @JsonClassType({type: () => [String]})
    projection: string = "";

    @JsonProperty() @JsonClassType({type: () => [String]})
    target: string; // key

    @JsonProperty() @JsonClassType({type: () => [Map]})
    connections: Map<string, any> = new Map<string, any>();

    @JsonProperty() @JsonClassType({type: () => [Boolean]})
    multiple: boolean = true;

}
