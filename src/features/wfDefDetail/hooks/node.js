import {Modal, notification} from "antd";
import constants from "../../../contants";
import {editWfDefDetails} from "../services";
import {handleResponseNodeConnection} from "../../../helpers/handleAPIReponseGraph";

const {confirm} = Modal;

export default function Node(params) {
    const {
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
    } = params;

    const addNode = (event) => {

        const lastest = elements.reverse().find(element => !!element.position);

        setLocation(() => {
            return {
                x: lastest.position.x,
                y: lastest.position.y
            }
        })
        setIsEdit(false);
        setPropNode(() => {
            return {}
        });
        setIsOpen(() => true);
    }

    const editNode = () => {
        if (!currentNode?.data?.def) {
            notification['warning']({
                message: constants.error.unPickWfDef,
                placement: 'bottomLeft'
            })
            return;
        }
        setIsEdit(true);
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
                            placement: 'bottomLeft'
                        })
                    })
                    .catch(err => {
                        notification['error']({
                            message: constants.error.saveFailed,
                            description: constants.error.saveFailedDescription,
                            placement: 'bottomLeft'
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

    const saveDialog = (data, status) => {
        if (status === 'EDIT') {


            const index = elements.findIndex(item => {
                return item?.data?.def?.id === data.id;
            })



            setElements((elements) => {
                const clone = [...elements];
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


            let fake_id = elements.reverse().find(element => !!element?.data?.def)?.id - 0 + 1 + '';


            fake_id = elements.reverse().find(element => !!element?.data?.def)?.id - 0 + 1 + '';


            // if (isNaN(parseInt(fake_id))) fake_id = '1';

            // data.actions = data.actions.join('|');
            data.id = fake_id;


            console.log(fake_id);

            const newNode = {
                id: fake_id,
                data: {
                    label: `${data.name}`,
                    def: {...data},
                    fake_id: fake_id,
                },
                position: {
                    x: location.x,
                    y: location.y,
                }
            }


            setElements(els => [...els, newNode]);

        }

        setCurrentNode(() => {
            return {};
        });
        setPropNode(() => data);
        setIsOpen(() => false);
    }

    const cancelDialog = () => setIsOpen(() => false);


    return {
        addNode,
        editNode,
        saveNode,
        saveDialog,
        cancelDialog
    }
}