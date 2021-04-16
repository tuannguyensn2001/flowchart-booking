import React,{useState,useEffect} from 'react';
import ReactFlow,{
    ReactFlowProvider,
    Background,
    MiniMap,
    Controls,
} from "react-flow-renderer";
import {useParams} from 'react-router-dom'
import {getWfDefDetailFromProcess} from "./services";
import {handleResponseNodeConnection} from "../../helpers/handleAPIReponseGraph";


function Main()
{
    const {id} = useParams();
    const [elements,setElements] = useState([]);

    useEffect(() => {
        try {
            handleInitAPI().then(() => {});
        } catch (e) {
        }

    },[])

    const handleInitAPI = async () => {
        const response = await getWfDefDetailFromProcess(id);
        const data = response.data;

        setElements(() => {
            const [node, connection] = handleResponseNodeConnection(data);
            return [...node, ...connection];
        });
    }


    return (
        <div>
            <ReactFlowProvider>
                <ReactFlow
                    style={{height: 500, width: '100%'}}
                    elements={elements}>
                    <Background
                        variant="dots"
                    />
                    <MiniMap
                        nodeColor={(node) => {
                            switch (node.type) {
                                case 'input':
                                    return 'red';
                                case 'default':
                                    return '#00ff00';
                                case 'output':
                                    return 'rgb(0,0,255)';
                                default:
                                    return '#eee';
                            }
                        }}
                        nodeStrokeWidth={3}
                    />
                    <Controls/>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    )
}

export default Main;