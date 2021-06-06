import {addEdge} from "react-flow-renderer";

export default function Edge(params) {
    const {
        elements,
        setElements,
        setIsOpenEdge
    } = params;

    const onConnect = (params) => setElements((els) => {
        params.arrowHeadType = 'arrow';
        return addEdge(params, els);
    });

    const cancelDialogEdge = () => {
        setIsOpenEdge(() => false);
    }

    const saveDialogEdge = (edge) => {
        const index = elements.findIndex(element => element.id === edge.id);
        elements[index] = edge;
        setElements(() => [...elements]);
        setIsOpenEdge(() => false);
    }

    return {
        onConnect,
        cancelDialogEdge,
        saveDialogEdge
    }
}