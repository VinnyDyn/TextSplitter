import * as React from "react";
import ReactDOM = require("react-dom");
import { SplittedButtonTSX } from "./SplittedButtonTSX";
import { Util } from "../util/Util";
import { TextSplitterData } from "../util/TextSplitterData";

export interface ITextSplitterProps {
    id : string,
    value : string,
    separator : string
}

export interface ITextSplitterState extends React.ComponentState, ITextSplitterProps {
    rows : number
}

export class TextSplitterTSX extends React.Component<ITextSplitterProps, ITextSplitterState> {

    private splittedDivs : any[];
    public value : string;
    public separator : string;
    constructor(props : ITextSplitterProps){
        super(props);

        this.value = this.props.value;
        this.separator = this.props.separator;

        this.splittedDivs = new Array();
        this.state = {
            id : this.props.id,
            value : this.props.value,
            separator : this.props.separator,
            rows : 5
          };

          this.handleChange = this.handleChange.bind(this);
          this.splitText();
      }

    render() : JSX.Element {
    return <div key={this.props.id} id="mainContainer">
            <div id="headerContainer">
                <div id="inputContainer">
                    <textarea rows={this.state.rows} className="inputText" placeholder="--" value={this.state.value} onChange={this.onChangeInputValue}/>
                </div>
                <div id="separatorContainer">
                    <input className="inputText" placeholder="--" value={this.state.separator} onChange={this.onChangeSeparator}/>
                </div>
            </div>
            <div id="splittedContainer">
                {this.splittedDivs}
            </div>
            </div>;
    }

    splitText = () =>
    {
        this.clear();
        let tempValue = this.value;
        let tempseparator = this.separator;

        if(tempValue)
        {
            let split = tempValue.split(tempseparator);
            if(split.length > 1 && this.separator)
            {
                for (let index = 0; index < split.length; index++) {
                    const element = split[index];
                    this.renderSplitButton(element);	
                }
            }
        }
        
        this.setState({
            SplittedDivs : this.splittedDivs
          });
    }

    renderSplitButton = (value : string) =>
    {
        if(value && value != "")
        {
            let id = Util.NewGuid();
            let splittedDiv = React.createElement(SplittedButtonTSX,
            {
                id: id,
                value : value
            });
            this.splittedDivs.push(splittedDiv);
        }
    }

    clear = () =>
    {
        if(this.splittedDivs)
        {
            this.splittedDivs = new Array();
            // this.splittedDivs.forEach(splitedDiv_ => {
            //     document.getElementById(splitedDiv_!.props.id)?.remove();
            // });
        }
    }

    onChangeInputValue = (e : any) =>
    {
        this.value = e.target.value;
        this.splitText();
        this.setState(
        {
            value : this.value,
        });
        TextSplitterData.UpdateValue(this.props.id, this.value);
    }

    onChangeSeparator = (e : any) =>
    {
        this.separator = e.target.value;
        this.splitText();
        this.setState(
        {
            separator : this.separator,
        });
    }

    handleChange = (e : any) => {
        let getTextAreaValue = e.target.value;
        this.setState({
          postVal :getTextAreaValue
        })
      }
}