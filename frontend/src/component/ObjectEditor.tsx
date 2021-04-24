import {TableObject} from "../elements/TableObject";
import * as React from "react";
import {createStyles, Paper, Theme, withStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {isType} from "@babel/types";
import {ColumnData} from "../elements/ColumnData";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import App from "../App";
import {TableData} from "../elements/Table";
import {ObjectRelationship, TableRelationship} from "../elements/Relationship";
import {Autocomplete} from "@material-ui/lab";

interface State{
    object: TableObject
    accordionState: Map<string, any>
    relatedTable: any
    relatedObject: any
}
interface Props{
    object: TableObject
    save: Function
    delete: Function
    app: App
    classes: any | null
}


const useStyles = createStyles((theme:Theme)=>({
    tableInformation:{
        marginTop: theme.spacing(2),
        textAlign: "left",
        padding: theme.spacing(1)
    },
    padding:{
        margin: theme.spacing(3),
        display: "block",
        width: "100%"
    },
    textField:{
        minWidth: "150px"
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: theme.typography.pxToRem(15),
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    }
}));

// @ts-ignore
@withStyles(useStyles, {withTheme:true})
export class ObjectEditor extends React.Component<Props, State>{
    constructor(props: Props){
        super(props);
        this.state = {object: props.object, accordionState: new Map<string, any>(), relatedTable: "", relatedObject: ""};

    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if(JSON.stringify(this.state.object) !==  JSON.stringify(this.props.object)){
            this.setState({object: this.props.object});
        }
    }

    changeProjection(columnKey:string, columnName: string) : boolean{
        let object = this.state.object;
        if(object.projections){
            if(!object.projections.has(columnKey)){
                object.projections.set(columnKey, columnName);
            }else{
                if(columnName!=="") {
                    object.projections.set(columnKey, columnName);
                }else{
                    object.projections.delete(columnKey);
                }
            }
            this.setState({object: object}, ()=>this.save());
        }

        return true;
    }
    renderTableProjections(table:string, columns: ColumnData[], elements: Function[]){
        return columns.map(column => {
            const columnKey = table + "." + column.name;
            let projectionVal: string = this.state.object.projections.get(columnKey);
            const hasProjection: boolean = this.state.object.projections.has(columnKey);
            return <TableRow key={table + "" + column.name}>
                <TableCell align="right">{column.name}</TableCell>
                <TableCell align="right">{(column.index)?<CheckIcon/>:<ClearIcon/>}</TableCell>
                <TableCell align="right">{(column.primary)?<CheckIcon/>:<ClearIcon/>}</TableCell>
                <TableCell align="right">{column.type}</TableCell>
                <TableCell align="center">
                    <FormControlLabel
                        control={<Checkbox checked={hasProjection}
                                           onChange={(e) => (!hasProjection)?this.changeProjection(columnKey, column.name):this.changeProjection(columnKey, "")}
                                           name="include"/>}
                        label="Include"
                    />
                </TableCell>
                <TableCell align="left">
                    {(hasProjection)? <TextField value={projectionVal} onChange={(e)=>this.changeProjection(columnKey, e.target.value)} className={this.props.classes.textField}/> : ""}
                </TableCell>
                {elements.map(f=>f(column))}
            </TableRow>
        });
    }
    timeout: any;
    save(){
        if(this.timeout){
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(()=>this.props.save(this.state.object), 900);
    }
    changeObjectName(name:string){
        let object = this.state.object;
        object.name = name;
        this.setState({object: object},()=>this.save());
    }
    accordianState(acc: string){
        let accordianState = this.state.accordionState;
        if(!accordianState.has(acc)){
            accordianState.set(acc, true);
        }else{
            accordianState.set(acc, !accordianState.get(acc));
        }
        this.setState({accordionState: accordianState});
    }
    deleteTableRelationship(name:string){
        let object = this.state.object;
        object.tables = object.tables.filter(table=>table.target.tableStatus.name!==name);
        this.state.accordionState.delete(name);
        // @ts-ignore
        [...object.projections.keys()].filter((x)=>x.startsWith(name+".")).forEach(key=>object.projections.delete(key));
        this.setState({object: object},()=>this.save());
    }
    renderTableOptions(idx: number, tableRelationship: TableRelationship){
        if(tableRelationship.target!==undefined){
            let objects: any[][] = [[],[],[]];
            objects[0].push(<Button color={"secondary"} onClick={()=>this.deleteTableRelationship(tableRelationship.target.tableStatus.name)} variant={"contained"}>Delete</Button>);
            objects[1].push((column: ColumnData)=><TableCell>
                <Autocomplete
                    size={"small"}
                    options={this.state.object.main.columns.map(g=>g.name)}
                    getOptionLabel={(option) => option}
                    style={{ width: 300 }}
                    onChange={(e, value) => {
                        let object = this.state.object;
                        object.tables[idx].connections.set(column.name, value);
                        this.setState({object: object}, ()=>this.save())
                    }}
                    value={(tableRelationship.connections.has(column.name)?tableRelationship.connections.get(column.name):"")}
                    renderInput={(params) => <TextField {...params} label="Main Table Column" variant="outlined" />}
                />
            </TableCell>);
            objects[2].push("Main table relation");
            return this.renderTable(tableRelationship.target, objects);
        }
        return <div/>;
    }
    changeRelationship(idx: number, remoteField: string, localField:string){
        let object = this.state.object;
        object.objects[idx].connections.set(remoteField, localField);
        this.setState({object: object},()=>this.save());
    }
    deleteRelationshipField(idx: number, remoteField: string){
        let object = this.state.object;
        object.objects[idx].connections.delete(remoteField);
        this.setState({object: object},()=>this.save());
    }
    changeRelationshipMultipleChange(idx: number){
        let object = this.state.object;
        object.objects[idx].multiple = !object.objects[idx].multiple;
        this.setState({object: object},()=>this.save());
    }
    changeRelationshipDepthChange(idx: number, depth:number){
        let object = this.state.object;
        object.objects[idx].depth = depth;
        this.setState({object: object},()=>this.save());
    }
    deleteRelationship(idx: number){
        let object = this.state.object;
        object.objects = object.objects.filter((obj, x)=>x!==idx);
        this.setState({object: object},()=>this.save());
    }
    renderObjectOptions(idx: number, objectRelationship: ObjectRelationship){
        let object: TableObject | undefined = this.props.app.getObject(objectRelationship.target);
        const expanded = this.state.accordionState.has(objectRelationship.key);
        if(object!==undefined) {
            let localFields = this.state.object.getFields();
            let remoteFields = object.getFields();
            return <Accordion style={{marginTop:"5px"}} square variant={"outlined"} expanded={(expanded)?this.state.accordionState.get(objectRelationship.key):false} onChange={()=>this.accordianState(objectRelationship.key)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                >
                    <Typography className={this.props.classes.heading}>
                        {object.name} <Chip size="small" label={objectRelationship.projection}/>
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {(expanded)?[
                        <Box>
                            <Box style={{textAlign:"left", marginRight:"10px"}}>
                                <p>
                                    <TextField value={objectRelationship.projection} onChange={(e)=>{
                                        let object = this.state.object;
                                        object.objects[idx].projection = e.target.value;
                                        this.setState({object: object}, ()=>this.save());
                                    }} label={"Projection"}/>
                                </p>
                                <p>
                                    <TextField
                                        id="filled-number"
                                        label="Max Depth"
                                        type="number"
                                        onChange={(e)=>this.changeRelationshipDepthChange(idx, parseInt(e.target.value))}
                                        value={objectRelationship.depth}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </p>
                                <FormControlLabel
                                    value="end"
                                    control={<Checkbox onChange={()=>this.changeRelationshipMultipleChange(idx)} checked={objectRelationship.multiple} color="primary" />}
                                    label="Multiple Objects"
                                    labelPlacement="end"
                                />
                                <br/>
                                <Button variant={"contained"} onClick={()=>this.deleteRelationship(idx)} color={"secondary"}>Remove</Button>
                            </Box>
                        </Box>,
                        <Box flexGrow={1}>
                            <Box>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">{object.name} Field</TableCell>
                                                <TableCell align="left">{this.state.object.name} Field</TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell align="left">
                                                    <Autocomplete
                                                        size={"small"}
                                                        id={"remote-object-create-"+object.key}
                                                        options={remoteFields}
                                                        style={{width: 300}}
                                                        onChange={(e, value) => {
                                                            if(value)
                                                                this.changeRelationship(idx, value, "");
                                                        }}
                                                        value={""}
                                                        renderInput={(params) => <TextField {...params} label="Remote Object" variant="outlined"/>}
                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    Enter Remote Column first
                                                </TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                            {[...objectRelationship.connections].sort().map((entry: string[]) => {
                                                return <TableRow>
                                                    <TableCell align="left">
                                                        {entry[0]}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <Autocomplete
                                                            size={"small"}
                                                            id="combo-box-demo"
                                                            options={localFields}
                                                            style={{width: 300}}
                                                            onChange={(e, value) => {
                                                                if(value) {
                                                                    this.changeRelationship(idx, entry[0], value);
                                                                }
                                                            }}
                                                            value={entry[1]}
                                                            renderInput={(params) => <TextField {...params} label="Local Object" variant="outlined"/>}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button color={"secondary"} onClick={()=>this.deleteRelationshipField(idx, entry[0])} variant={"contained"}>Remove</Button>
                                                    </TableCell>
                                                </TableRow>
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                    ]:""}
                </AccordionDetails>
            </Accordion>
        }
    }
    renderTable(object: TableData, innerElements: any[][]){


        const expanded = this.state.accordionState.has(object.tableStatus.name);

        // @ts-ignore
        const projectionsRelated = [...this.state.object.projections.keys()].filter(k=>(k as string).startsWith(object.tableStatus.name+"."));
        return <Accordion style={{marginTop:"5px"}} square variant={"outlined"} expanded={(expanded)?this.state.accordionState.get(object.tableStatus.name):false} onChange={()=>this.accordianState(object.tableStatus.name)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
            >
                <Typography className={this.props.classes.heading}>
                    {object.tableStatus.name} <Chip size="small" label={projectionsRelated.length}/>
                </Typography>
                <Typography className={this.props.classes.secondaryHeading}>
                    <Chip size="small" color="primary" label={object.tableStatus.rows.toLocaleString()+" rows"}  />
                    <Chip size="small" label={"Collation "+object.tableStatus.collation}/>
                    <Chip size="small" label={object.tableStatus.engine}/>
                    <Chip size="small" label={object.tableStatus.dataLength/1024/1024 + "MB"}/>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {(expanded)?(
                <Box width={"100%"} display={"block"}>
                    {(innerElements.length>0)?
                        <Box>
                            {innerElements[0]}
                        </Box>
                    :""}
                    <Box>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Column Name</TableCell>
                                        <TableCell align="center">Indexed</TableCell>
                                        <TableCell align="center">Primary</TableCell>
                                        <TableCell align="center">Type</TableCell>
                                        <TableCell align="center">Options</TableCell>
                                        <TableCell align="left">Projection</TableCell>
                                        {(innerElements[2])?innerElements[2].map(text=><TableCell align="left">{text}</TableCell>):""}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.renderTableProjections(object.tableStatus.name, object.columns, (innerElements[1])?innerElements[1]:[])}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>) :""}
            </AccordionDetails>
        </Accordion>;
    }
    addTableRelation(){
        if(typeof this.state.relatedTable == "string")
        {
            let name: string = this.state.relatedTable;
            this.setState({relatedTable: ""},()=>{
                fetch(this.props.app.getURL()+"/table/" + name).then(tableInfo => tableInfo.json()).then(tableInfo => {
                    let object = this.state.object;
                    object.tables.push(new TableRelationship(tableInfo));
                    this.setState({object: object},()=>this.save());
                });
            });
        }

    }
    addObjectRelation(){
        let objectKey: string = this.state.relatedObject.key;
        if(objectKey) {
            this.setState({relatedObject: ""}, () => {
                let object = this.state.object;
                object.objects.push(new ObjectRelationship(objectKey));
                this.setState({object: object}, () => this.save());
            });
        }
    }
    render() : JSX.Element {
        if(!this.state || !this.state.object){
            return <div/>;
        }
        const addedTables: string[] = this.state.object.tables.map(table=>table.target.tableStatus.name);
        return <Box width="100%">
            <Paper square elevation={4} className={this.props.classes.tableInformation}>
                <Box width="100%" display={"flex"}>
                    <Box flex={1}>
                        <Typography variant="h5" gutterBottom> {this.state.object.name} <Chip size="small" label={this.state.object.projections.size}/></Typography>
                    </Box>
                    <Box flex={1} style={{textAlign:"right"}}>
                        <Button size="small" onClick={()=>this.props.app.buildSQLPage(this.state.object.key)} variant={"contained"} color={"primary"}>Build SQL</Button>
                        &nbsp;<Button size="small" onClick={()=>this.props.delete()} variant={"contained"} color={"secondary"}>Remove</Button>
                    </Box>
                </Box>
                <Box width="100%" display={"flex"} style={{padding:"10px"}}>
                    <Box flex={1}><Typography variant="overline" gutterBottom>Main Table</Typography></Box>
                </Box>
                {this.renderTable(this.state.object.main, [])}
                <Paper square elevation={2} style={{marginTop:"5px"}}>
                    <Box width="100%" display={"flex"} style={{padding:"10px"}}>
                        <Box flex={1}><Typography variant="h5" gutterBottom>Related Tables</Typography></Box>
                        <Box flex={1}>
                            <Autocomplete
                                size={"small"}
                                id="combo-box-demo"
                                options={this.props.app.getTables().filter(t=>!addedTables.includes(t) && t!==this.state.object.main.tableStatus.name)}
                                getOptionLabel={(option) => option}
                                style={{ width: 300 }}
                                onChange={(e, value) => this.setState({relatedTable: value})}
                                value={this.state.relatedTable}
                                renderInput={(params) => <TextField {...params} label="Related Table" variant="outlined" />}
                            />
                        </Box>
                        <Box flex={1} style={{textAlign:"center"}}>
                            <Button onClick={()=>this.addTableRelation()} variant={"contained"} color={"primary"}>Add </Button>
                        </Box>
                    </Box>
                </Paper>
                {this.state.object.tables.map((table, idx)=>this.renderTableOptions(idx, table))}
                <Paper square  elevation={2} style={{marginTop:"5px"}}>
                    <Box width="100%" display={"flex"} style={{padding:"10px"}}>
                        <Box flex={1}><Typography variant="overline" gutterBottom>Related Objects</Typography></Box>
                        <Box flex={1}>
                            <Autocomplete
                                size={"small"}
                                id="combo-box-demo"
                                options={this.props.app.getObjects().filter(t=>t.key!==this.state.object.key)}
                                getOptionLabel={(option) => option.name}
                                style={{ width: 300 }}
                                onChange={(e, value) => this.setState({relatedObject: value})}
                                value={this.state.relatedObject}
                                renderInput={(params) => <TextField {...params} label="Related Object" variant="outlined" />}
                            />
                        </Box>
                        <Box flex={1} style={{textAlign:"center"}}>
                            &nbsp;<Button onClick={()=>this.addObjectRelation()} variant={"contained"} color={"primary"}>Add </Button>
                        </Box>
                    </Box>
                </Paper>
                {this.state.object.objects.map((object, idx)=>this.renderObjectOptions(idx, object))}
            </Paper>
        </Box>;
    }
}
