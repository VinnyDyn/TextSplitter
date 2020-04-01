import * as React from "react";
import ReactDOM = require("react-dom");

export interface ISplittedButtonProps {
    id: string,
    value : string
}

export interface ISplittedButtonState extends React.ComponentState, ISplittedButtonProps {
}

export class SplittedButtonTSX extends React.Component<ISplittedButtonProps, ISplittedButtonState> {

    constructor(props : ISplittedButtonProps){
        super(props);
        this.state = {
            id: this.props.id,
            value : this.props.value
          };
      }

    render() : JSX.Element {
        return <button key={this.state.id} id={this.state.id} onClick={this.copy}>
                {this.state.value}
                <input key={this.state.id+"_i"} id={this.state.id + "_i"} value={this.state.value} readOnly hidden></input>
               </button>
    };

    componentWillReceiveProps(props : ISplittedButtonProps) {
        this.state = {
            id: this.props.id,
            value : this.props.value,
        }
    }

    componentDidMount() {
        this.setState({}, this.resize);
    }

    resize = () =>
    {
        //TO-DO
    }

    copy = () =>
    {
        let input = document.getElementById(this.state.id + "_i") as HTMLInputElement;
        input!.hidden = false;
        input!.select();
		input!.setSelectionRange(0, 99999);
        document.execCommand("copy");
		alert(input.value + " copied to clipboard.")
        input!.hidden = true;
    }
}