import { TextSplitter } from "..";

let components : TextSplitter[] = new Array<TextSplitter>();
export class TextSplitterData
{
    /**
     * Handler de associação
     * @param component Componente
     */
    public static Handler(component : TextSplitter)
    {
        components.push(component);
    }

    /**
     * Método chamado pelo TextSplitterTSX para notificar o componente (TextSplitter)
     */
    public static UpdateValue(id: string, value : string) {
        let nf = components.find(f => f._id == id);
        if(nf) { 
            nf.UpdateData(value);
        };
    }
}