import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class TextSplitter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container : HTMLDivElement;
	private _textbox : HTMLInputElement;
	private _notifyOutputChanged: () => void;
	private _refreshData : EventListener;
	private _containerSplittedDiv : HTMLDivElement;
	public _separator : string;
	public _value : string;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

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
		this._container.id = "MainContainer";
		this._separator = context.parameters.separator.raw!;
		this._value = context.parameters.attribute.raw!;
		this._notifyOutputChanged = notifyOutputChanged;
		this._refreshData = this.UpdateData.bind(this);
		this.RenderInputText();
		this.RenderSplittedDiv();
		this.UpdateData();
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
		this._textbox.removeEventListener("input", this._refreshData);
	}

	private RenderSplittedDiv() : void
	{
		this._containerSplittedDiv = document.createElement("div");
		this._containerSplittedDiv.id = "SplittedContainer";
		this._container.append(this._containerSplittedDiv);
	}

	private RenderInputText() : void
	{
		this._textbox = document.createElement("input");
		this._textbox.setAttribute("type","text");
		this._textbox.id = "MainInputText";
		this._textbox.value = this._value;
		this._textbox.addEventListener("input", this._refreshData);
		this._container.append(this._textbox);
	}
	
	private RenderSplittedLabel(index : number, value : string) : void
	{
		let splittedInput: HTMLInputElement;
		splittedInput = document.createElement("input");
		splittedInput.readOnly = true;
		splittedInput.setAttribute("type","text");
		splittedInput.addEventListener("click", this.Copy.bind(this, splittedInput));
		splittedInput.id = index.toString();
		splittedInput.value = value;
		this._containerSplittedDiv.append(splittedInput);
	}

	private Copy(input : HTMLInputElement) : void
	{
		input.select();
		input.setSelectionRange(0, 99999);
		document.execCommand("copy");
	}

	public UpdateData()
	{
		this._value = this._textbox.value;
		this.Clear();
		let textValues = this._textbox.value.split(this._separator);
		if(textValues.length > 1)
		{
			for (let index = 0; index < textValues.length; index++) {
				const element = textValues[index];
				this.RenderSplittedLabel(index, element);	
			}
		}
		this._notifyOutputChanged();
	}

	private Clear()
	{
		while (this._containerSplittedDiv.firstChild) {
			this._containerSplittedDiv.removeChild(this._containerSplittedDiv.firstChild);
		}
	}
}