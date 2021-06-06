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
import Dialog from "./components/Dialog/index";
import {useParams} from 'react-router-dom';
import {handleResponseNodeConnection} from "../../helpers/handleAPIReponseGraph";
import {getWfDefDetails, editWfDefDetails} from "./services";
import constants from '../../contants';
import DialogEdge from "./components/DialogEdge";
import useFlow from "./hooks";

const Menu = styled.div`

`

const ButtonMenu = styled(Button)`
  margin-left: 20px;
`

function Main() {
    const {
        propNode,
        saveDialog,
        cancelDialog,
        isOpen,
        addNode,
        editNode,
        saveNode,
        setReactFlow,
        onClickElement,
        onConnect,
        onElementsRemove,
        elements,
        isOpenEdge,
        currentEdge,
        cancelDialogEdge,
        saveDialogEdge,
        isEdit,
        handleOnDoubleClick
    } = useFlow();

    const [isUniqueAction, setIsUniqueAction] = useState({
        start: false,
        complete: false,
    });

    useEffect(() => {

        setIsUniqueAction(prevState => {
            return {
                start: false,
                complete: false
            }
        })

        elements.forEach(item => {
            const actions = item?.data?.def?.actions;
            if (!actions) return;

            if (actions.trim().includes('START')) setIsUniqueAction(prevState => {
                return {
                    ...prevState,
                    start: true,
                }
            })

            if (actions.trim().includes('COMPLETE')) setIsUniqueAction(prevState => {
                return {
                    ...prevState,
                    complete: true,
                }
            })


        })

    }, [elements])


    return (
        <div style={{height: 300}}>
            <Menu>
                <DialogEdge
                    listEdges={elements.filter(element => !!element.source)}
                    show={isOpenEdge}
                    onSave={saveDialogEdge}
                    onCancel={cancelDialogEdge}
                    edge={currentEdge}/>
                {/*<Dialog node={propNode} onSave={saveDialog} onCancel={cancelDialog} show={isOpen}/>*/}
                <Dialog isUniqueAction={isUniqueAction} onSave={saveDialog} node={propNode} onCancel={cancelDialog}
                        show={isOpen}/>
                <Button onClick={addNode} type="primary">{constants.action.add}</Button>
                {/*<ButtonMenu onClick={editNode} type="primary">{constants.action.edit}</ButtonMenu>*/}
                <ButtonMenu onClick={saveNode} type="primary">{constants.action.save}</ButtonMenu>
            </Menu>
            <ReactFlowProvider>
                <ReactFlow
                    onLoad={(instance) => {
                        instance.fitView();
                        setReactFlow(instance);
                    }}
                    onDoubleClickCapture={addNode}
                    onDoubleClick={handleOnDoubleClick}
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