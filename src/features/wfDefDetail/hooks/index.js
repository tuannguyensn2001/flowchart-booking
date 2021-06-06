import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {Modal, notification} from "antd";
import constants from "../../../contants";
import {editWfDefDetails, getWfDefDetails} from "../services";
import {handleResponseNodeConnection} from "../../../helpers/handleAPIReponseGraph";
import {addEdge, isNode, removeElements} from "react-flow-renderer";
import Node from "./node";
import Edge from "./edge";

const {confirm} = Modal;

export default function useFlow() {
    const {id} = useParams();

    const [elements, setElements] = useState([]);
    const [currentNode, setCurrentNode] = useState({});
    const [currentEdge, setCurrentEdge] = useState({});
    const [propNode, setPropNode] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenEdge, setIsOpenEdge] = useState(false);
    const [reactFlow, setReactFlow] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [location, setLocation] = useState({x: null, y: null})


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleInitAPI = async () => {
        const response = await getWfDefDetails(id);
        const data = response.data;

        setElements(() => {
            const [node, connection] = handleResponseNodeConnection(data);
            return [...node, ...connection];
        });
    }

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

    useEffect(() => {
        window.addEventListener('keydown', event => {
            console.log(event);
        })
    }, [])


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
        if (isNode(element)) {
            setCurrentNode(() => element);
            return;
        }

        setCurrentEdge(() => element);
        setIsOpenEdge(true);

    }

    const handleOnDoubleClick = (event) => {
        const {id} = event.target.dataset;
        setCurrentNode(() => {
            return elements.find(element => element.id === id)
        });

        setPropNode(() => {
            return elements.find(element => element.id === id)
        })
        setIsOpen(true);

    }

    const {
        addNode,
        editNode,
        saveNode,
        saveDialog,
        cancelDialog
    } = Node({
        setPropNode,
        setIsOpen,
        currentNode,
        reactFlow,
        elements,
        setElements,
        id,
        setCurrentNode,
        setIsEdit,
        location,
        setLocation
    })

    const {
        onConnect,
        cancelDialogEdge,
        saveDialogEdge
    } = Edge({
        setElements,
        setIsOpenEdge,
        elements
    })


    return {
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
        cancelDialogEdge,
        currentEdge,
        saveDialogEdge,
        isEdit,
        handleOnDoubleClick
    }
}