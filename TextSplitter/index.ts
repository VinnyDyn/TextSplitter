import {IInputs, IOutputs} from "./generated/ManifestTypes";
import ReactDOM = require("react-dom");
import React = require("react");
import { TextSplitterTSX } from "./tsx/TextSplitterTSX";
import { Util } from "./util/Util";
import { TextSplitterData } from "./util/TextSplitterData";

export class TextSplitter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container : HTMLDivElement;
	private _notifyOutputChanged: () => void;
	private _refreshData : EventListener;
	public _id : string;
	public _value : string;

	/**
	 * Empty constructor.
	 */
	constructor()
	{
		this._id = Util.NewGuid();
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement)
	{
		this._container = container;
		this._notifyOutputChanged = notifyOutputChanged;
		this._refreshData = this.UpdateData.bind(this, this._value);
		TextSplitterData.Handler(this);
		ReactDOM.render(
			React.createElement(TextSplitterTSX,{
				id : this._id,
				value : context.parameters.attribute.raw!,
				separator : context.parameters.separator.raw!
			}),
			this._container
			);
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return { attribute: this._value as string };
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
	}

		/**
	 * Método chamado pelo React para notificar a atualização dos valores
	 */
	public UpdateData(value : string)
	{
		this._value = value;
		this._notifyOutputChanged();
	}
}