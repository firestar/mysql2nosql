import * as React from "react";
import {TableObject} from "../elements/TableObject";
import App from "../App";
import {createStyles, Paper, Theme, withStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {ObjectRelationship} from "../elements/Relationship";

interface State{
    target: string
}
interface Props{
    app: App
    target: string
    classes: any | null
}

const useStyles = createStyles((theme:Theme)=>({
    tableInformation:{
        padding: theme.spacing(2)
    },
}));

// @ts-ignore
@withStyles(useStyles, {withTheme:true})
export class SQLBuilder extends React.Component<Props, State> {
    constructor(props: Props){
        super(props);
        this.state = {target: props.target};
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        if(this.props.target !== prevProps.target){
            this.setState({target: this.props.target})
        }
    }
    generateSQLInner(objectRelation: ObjectRelationship, tabs: number){
        let object: TableObject | undefined= this.props.app.getObject(objectRelation.target);
        if(object) {
            const obj: TableObject = object;
            let tabString = "\t".repeat(tabs);
            let SQL = "(\n";
            SQL += tabString + "\tSELECT \n";
            let tabsStringProjection = tabString;
            if(objectRelation.multiple) {
                SQL += tabString + "\t\tJSON_ARRAYAGG(\n";
                tabsStringProjection = "\t".repeat(tabs+1);
            }
            SQL += tabsStringProjection + "\t\tJSON_OBJECT(\n";
            let projectionsSQL: string[] = [];
            obj.projections.forEach((val, key)=>{
                projectionsSQL.push(tabsStringProjection + "\t\t\t'"+val+"', `"+key.split(".").join("`.`")+"`");
            });
            obj.objects.forEach(object=>{
                projectionsSQL.push(tabsStringProjection+"\t\t\t'"+object.projection+"', "+this.generateSQLInner(object, tabs+((objectRelation.multiple)?4:3))+"");
            });
            projectionsSQL.sort();
            SQL += projectionsSQL.join(",\n")+"\n";
            if(objectRelation.multiple) {
                SQL += tabsStringProjection + "\t\t)\n";
            }
            SQL += tabString+"\t\t) as ONLY\n";

            SQL += tabString+"\tFROM\n";
            SQL += tabString+"\t\t`"+obj.main.tableStatus.name+"`\n";
            obj.tables.forEach(table=>{
                let connectionSQL: string[] = [];
                table.connections.forEach((val, key)=>{
                    if(val && key) {
                        connectionSQL.push("`" + table.target.tableStatus.name + "`.`" + key + "`=`" + obj.main.tableStatus.name + "`.`" + val + "`");
                    }
                });
                SQL += tabString+"\tLEFT JOIN `"+table.target.tableStatus.name+"` ON \n ";
                SQL += tabString+"\t\t"+connectionSQL.join("\n\t AND ") + "\n";
            });
            SQL += tabString+"\tWHERE \n";
            let whereSQL: string[] = [];
            objectRelation.connections.forEach((val, key)=>{
                whereSQL.push("`" + key.split(".").join("`.`") + "`=`" + val.split(".").join("`.`") + "`")
            });
            SQL += tabString+"\t\t"+whereSQL.join("\n\t\t\t\tAND ") + "\n";
            if(!objectRelation.multiple) {
                SQL += tabString+"\tLIMIT 1\n";
            }
            SQL += tabString+")";
            return SQL;
        }
    }
    generateSQLRoot(){
        let object: TableObject | undefined= this.props.app.getObject(this.state.target);
        if(object){
            const obj: TableObject = object;
            let SQL = "SELECT \n";
            SQL += "\tJSON_OBJECT(\n";
            let projectionsSQL: string[] = [];
            obj.projections.forEach((val, key)=>{
                projectionsSQL.push("\t\t'"+val+"', `"+key.split(".").join("`.`")+"`");
            });

            obj.objects.forEach(object=>{
                projectionsSQL.push("\t\t'"+object.projection+"', "+this.generateSQLInner(object, 2)+"");
            });
            projectionsSQL.sort();
            SQL += projectionsSQL.join(",\n")+"\n";
            SQL += "\t) as documents\n";
            SQL += "FROM\n";
            SQL += "\t`"+obj.main.tableStatus.name+"`\n";
            obj.tables.forEach(table=>{
                let connectionSQL: string[] = [];
                table.connections.forEach((val, key)=>{
                    if(val && key) {
                        connectionSQL.push("`" + obj.main.tableStatus.name + "`.`" + val + "`=`" + table.target.tableStatus.name + "`.`" + key + "`");
                    }
                });
                SQL += "LEFT JOIN `"+table.target.tableStatus.name+"` ON (\n ";
                SQL += "\t"+connectionSQL.join("\n\t AND ") + "\n";
                SQL += ")\n";
            });

            return SQL;
        }
    }

    render() : JSX.Element {
        let obj = this.props.app.getObject(this.state.target);
        if(obj){
            return (
                <Paper square variant={"outlined"} className={this.props.classes.tableInformation}>
                    <Box width="100%" flexDirection="row" display={"flex"} >
                        <Box width="50%" style={{textAlign: "left"}}>
                            <Typography variant="h5" gutterBottom>{obj.name}</Typography>
                        </Box>
                        <Box width="50%" style={{textAlign: "right"}}>
                            <Button size="small" onClick={()=>this.props.app.buildSQLPage("")} variant={"contained"} color={"secondary"}>Close</Button>
                        </Box>
                    </Box>
                    <Box width="100%" display="flex">
                        <TextField style={{width:"100%"}} value={this.generateSQLRoot()} multiline />
                    </Box>
                </Paper>
            );
        }
        return <div/>
    }
}
