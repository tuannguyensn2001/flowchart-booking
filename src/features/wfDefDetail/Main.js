import React, {useState, useEffect} from 'react';
import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    Background,
    MiniMap,
    Controls,
    addEdge, isNode,
} from "react-flow-renderer";
import {Button, Modal, notification} from 'antd';
import styled from 'styled-components';
import Dialog from "./components/Dialog";
import {useParams} from 'react-router-dom';
import {handleResponseNodeConnection} from "../../helpers/handleAPIReponseGraph";
import {getWfDefDetails, editWfDefDetails} from "./services";
import constants from '../../contants';

const Menu = styled.div`

`

const ButtonMenu = styled(Button)`
  margin-left: 20px;
`

const {confirm} = Modal;


function Main() {
    const {id} = useParams();

    const [elements, setElements] = useState([]);
    const [currentNode, setCurrentNode] = useState({});
    const [propNode, setPropNode] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [reactFlow, setReactFlow] = useState({});


    useEffect(() => {

        try {
            handleInitAPI().then(r => {
            });
        } catch (e) {
            notification['error']({
                message: constants.error.error,
                description: constants.error.error_description,
            })
        }
    }, [])

    const handleInitAPI = async () => {
        const response = await getWfDefDetails(id);
        const data = response.data;

        setElements(() => {
            const [node, connection] = handleResponseNodeConnection(data);
            return [...node, ...connection];
        });
    }


    const onConnect = (params) => setElements((els) => {
        params.arrowHeadType = 'arrow';
        return addEdge(params, els);
    });

    const onElementsRemove = (elementsToRemove) => {
        confirm({
            label: constants.action.delete,
            okText: constants.confirm.ok,
            cancelText: constants.confirm.cancel,
            content: constants.confirm.confirmDelete,
            onOk() {
                setElements((els) => removeElements(elementsToRemove, els));
            }
        })
    }

    const onClickElement = (event, element) => {
        setCurrentNode(() => element);
    }

    const cancelDialog = () => setIsOpen(() => false);

    const saveDialog = (data, status) => {
        if (status === 'EDIT') {
            console.log(elements);
            const index = elements.findIndex(item => {
                return item.data.def.id === data.id;
            })


            setElements((elements) => {
                const clone = [...elements];
                data.actions = data.actions.join('|');
                const cloneIndex = {...clone[index]};
                clone[index] = {
                    id: cloneIndex.id,
                    data: {
                        label: `${data.name}`,
                        def: {...data},

                    },
                    position: cloneIndex.position
                }
                return clone;
            })
        }

        if (status === 'CREATE') {

            let fake_id = elements.reverse().find(element => isNode(element))?.id - 0 + 1 + '' ;

            if (isNaN(parseInt(fake_id))) fake_id = '1';

            data.actions = data.actions.join('|');
            data.id = fake_id;

            const newNode = {
                id: fake_id,
                data: {
                    label: `${data.name}`,
                    def: {...data},
                    fake_id: fake_id,
                },
                position: {
                    x: Math.random() * 500,
                    y: Math.random() * 500,
                }
            }

            setElements(els => [...els, newNode]);

        }

        setCurrentNode(() => {
            return {};
        });
        setIsOpen(() => false);
    }

    const addNode = () => {
        setPropNode(() => {
            return {}
        });
        setIsOpen(() => true);
    }

    const editNode = () => {
        if (!currentNode?.data?.def) {
            notification['warning']({
                message: constants.error.unPickWfDef,
            })
            return;
        }
        setPropNode(() => currentNode);


        setIsOpen(() => true);

    }

    const saveNode = () => {
        confirm({
            onOk() {
                const request = {
                    node: [],
                    connection: [],
                };

                request.node = reactFlow.toObject().elements.filter(element => !element.source).map(def => {
                    return {
                        ...def.data.def,
                        location: JSON.stringify({
                            x: def.position.x,
                            y: def.position.y,
                        }),
                        category_input_id: def.data.def.category_input_id || null,
                        'fake_id': def.data.fake_id || null,
                    }
                });


                request.connection = elements.filter(element => !!element.source);

                editWfDefDetails(id, {
                    data: request,
                })
                    .then(response => {

                        const data = response.data;
                        const [node, connection] = handleResponseNodeConnection(data);
                        setElements(() => {
                            return [...node, ...connection];
                        });

                        notification['success']({
                            message: constants.notifications.saveSuccessful,
                            description: constants.notifications.saveSuccessfulDescription,
                        })
                    })
                    .catch(err => {
                        notification['error']({
                            message: constants.error.saveFailed,
                            description: constants.error.saveFailedDescription,
                        })
                    });
            },
            onCancel() {
            },
            content: constants.confirm.save,
            okText: constants.confirm.ok,
            cancelText: constants.confirm.cancel,
        })
    }

    return (
        <div style={{height: 300}}>
            <Menu>
                <Dialog node={propNode} onSave={saveDialog} onCancel={cancelDialog} show={isOpen}/>
                <Button onClick={addNode} type="primary">{constants.action.add}</Button>
                <ButtonMenu onClick={editNode} type="primary">{constants.action.edit}</ButtonMenu>
                <ButtonMenu onClick={saveNode} type="primary">{constants.action.save}</ButtonMenu>
            </Menu>
            <ReactFlowProvider>
                <ReactFlow
                    onLoad={(instance) => {
                        instance.fitView();
                        setReactFlow(instance);
                    }}
                    onElementClick={onClickElement}
                    onConnect={onConnect}
                    onElementsRemove={onElementsRemove}
                    onSelectionContextMenu={() => console.log('click ne')}
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