import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {getJobDetailThread} from "./services";
import ReactFlow, {
    ReactFlowProvider,
    Background,
    MiniMap,
    Controls

} from "react-flow-renderer";
import {handleResponseNodeConnection} from "../../helpers/handleAPIReponseGraph";
import {useQuery} from "../../hooks";

function Main() {
    const {id} = useParams();
    const [elements, setElements] = useState([]);
    const thread_id = useQuery().get('thread');

    useEffect(() => {

        getJobDetailThread(id)
            .then(response => {
                const data = response.data;

                setElements(() => {
                    const [node, connection] = handleResponseNodeConnection(data);

                    const mapConnection = connection.map(item => {
                        if (!item.isThread) return {...item};
                        return {
                            ...item,
                            animated: true,
                        }
                    })

                    const mapNode = node.map(item => {
                        const def = item.data.def;

                        const actions = ['START','COMPLETE'];



                        let color;
                        let backgroundColor;
                        let type;

                        if (def.actions === 'START'){
                            type = 'input';
                        } else if(def.actions === 'COMPLETE'){
                            type = 'output';
                        }

                        if (def.state === 'APPROVED') {
                            color = '#fff';
                            backgroundColor = '#21A843';
                        } else if(def.state === 'IN_REVIEW'){
                            color = '#fff';
                            backgroundColor = '#FF851B';
                        }
                        else if(def.state === 'REJECT') {
                            color = '#fff';
                            backgroundColor = '#DD4B39';
                        } else if (def.state === 'NEED_UPDATE'){
                            color = '#fff';
                            backgroundColor = '#FF851B';
                        } else if (def.state === 'PENDING'){
                            color =  '#fff';
                            backgroundColor = '#7F7F7F';
                        }
                        else {
                            backgroundColor = '#fff';
                            color = '#000';
                        }
                        return {
                            ...item,
                            style: {
                                color,
                                backgroundColor,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                                borderRadius: '2px',
                                border: 'none',
                            },
                            type,
                            animated: true,
                        }
                    })

                    return [...mapNode, ...mapConnection];
                });
            })
            .catch(err => console.log(err))
    }, [id])

    return (
        <div>
            <ReactFlowProvider>
                <ReactFlow
                    onNodeMouseEnter={() => console.log('hover')}
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