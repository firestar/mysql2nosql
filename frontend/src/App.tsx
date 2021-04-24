import React, {CSSProperties} from 'react';
import logo from './logo.svg';
import './App.css';
import {TableObject} from "./elements/TableObject";
import Container from '@material-ui/core/Container';
import {ObjectEditor} from "./component/ObjectEditor";
import {createStyles, Theme, withStyles} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {string} from "prop-types";
import { v4 as uuidv4 } from 'uuid';
import {TableData} from "./elements/Table";
import { ObjectMapper } from 'jackson-js';
import {Autocomplete} from "@material-ui/lab";
import {SQLBuilder} from "./component/SQLBuilder";

interface State {
    objects: TableObject[]
    tables: string[]
    mainTable: any
    objectName: any
    buildSQLTarget: string
}

interface Prop {
    classes: any
}

const objectMapper = new ObjectMapper();

const useStyles = createStyles((theme:Theme)=>({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 300,
        textAlign: "left"
    },
    button: {
        margin: theme.spacing(2),
    },
    content:{
        marginTop: theme.spacing(10)
    },
    caption:{
        marginLeft: theme.spacing(2)
    }
}));

// @ts-ignore
@withStyles(useStyles, {withTheme:true})
class App extends React.Component<Prop, State> {
    constructor(props: Prop) {
        super(props);
        let objects = window.localStorage.getItem("objects");
        let savedObjectsArray: TableObject[] = [];
        if(objects){
            let savedObjects: string[] = JSON.parse(objects);
            savedObjectsArray = savedObjects.filter(objKey=>window.localStorage.getItem(objKey)).map(objKey=>{
                // @ts-ignore
                let tableObject: TableObject = objectMapper.parse<TableObject>(window.localStorage.getItem(objKey), {mainCreator: ()=>[TableObject]});
                return tableObject;
            });
        }
        this.state = {objects: savedObjectsArray, tables: [], mainTable: "", objectName: "", buildSQLTarget:""};
        fetch(this.getURL()+"/tables").then(body => body.json()).then(tableData => this.setState({tables: tableData.tables}));
    }

    saveObjectToStorage(){
        let objects: TableObject[] = this.state.objects;
        window.localStorage.setItem("objects", JSON.stringify(objects.map(obj=>obj.key)));
        objects.forEach(obj=>window.localStorage.setItem(obj.key, objectMapper.stringify<TableObject>(obj)));
    }
    saveObject(idx: number, table: TableObject){
        if(table){
            let objects: TableObject[] = this.state.objects;
            objects[idx] = table;
            this.setState({objects: objects}, ()=>this.saveObjectToStorage());
        }
    }

    saveNewObject(object: TableObject){
        let objects: TableObject[] = this.state.objects;
        objects.push(object);
        this.setState({objects: objects}, ()=>this.saveObjectToStorage());
    }

    getURL():string {
        return ""
    }

    buildSQLPage(target: string){
        this.setState({buildSQLTarget: target});
    }

    renderObjects() {
        return this.state.objects.map((obj, idx) => <ObjectEditor key={obj.key} classes={null} app={this} delete={()=>this.deleteObject(idx, obj)} save={(table: TableObject)=>this.saveObject(idx, table)} object={obj}/>);
    }

    getObjects() : TableObject[]{
        return this.state.objects;
    }

    getObject(key: string) : TableObject | undefined{
        let foundObject = this.state.objects.filter(o=>o.key===key);
        if(foundObject.length>0) {
            return foundObject[0];
        }
        return undefined;
    }
    getTables() : string[]{
        return this.state.tables;
    }
    deleteObject(idx: number, object: TableObject){
        let objects = this.state.objects;
        objects = objects.filter((x, y)=>y!==idx);
        localStorage.removeItem(object.key);
        for(let x=0;objects.length;x++){
            objects[x].objects = objects[x].objects.filter(objRel=>objRel.key!==object.key);
        };
        this.setState({objects: objects}, ()=>this.saveObjectToStorage());
    }

    createObject(){
        const objectName:string = this.state.objectName;
        const mainTable:string = this.state.mainTable;
        if(objectName.length>0 && mainTable.length>0) {
            this.setState({mainTable: "", objectName: ""});
            fetch(this.getURL()+"/table/" + mainTable).then(tableInfo => tableInfo.json()).then(tableInfo => {
                let object: TableObject = new TableObject([], uuidv4(), new TableData(tableInfo.columns, tableInfo.tableStatus), objectName, new Map<string, any>());
                this.saveNewObject(object);
            });
        }
    }
    render() {
        return (
            <div className="App">
                <header>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6">
                                MySQL Tables 2 Object
                            </Typography>
                            <Typography variant="caption" className={this.props.classes.caption}>
                                 By Nathaniel Davidson
                            </Typography>
                        </Toolbar>
                    </AppBar>
                </header>
                <Container>
                    {(this.state.buildSQLTarget)?(
                        <Box className={this.props.classes.content} style={{width:"100%"}}>
                            <SQLBuilder app={this} target={this.state.buildSQLTarget} key={"sql"} classes={null}/>
                        </Box>
                    ):
                        [
                            <Box width="100%">
                                <Card variant="outlined" square className={this.props.classes.content}>
                                    <p>
                                        <TextField className={this.props.classes.formControl} value={this.state.objectName} onChange={(e)=>this.setState({objectName: e.target.value})} id="standard-basic" label="Object Name"/>
                                        <FormControl className={this.props.classes.formControl}>
                                            <Autocomplete
                                                id="table-chooser-root"
                                                options={this.getTables()}
                                                getOptionLabel={(option) => option}
                                                style={{ width: 300 }}
                                                onChange={(e, value) => this.setState({mainTable: value})}
                                                value={this.state.mainTable}
                                                renderInput={(params) => <TextField {...params}  label="Table" />}
                                            />
                                        </FormControl>
                                        <Button className={this.props.classes.button} variant="contained" onClick={()=>this.createObject()} color="primary">Create Object</Button>
                                    </p>
                                </Card>
                            </Box>,
                            this.renderObjects()
                        ]
                    }
                </Container>
            </div>
        );
    }
}

export default App;
