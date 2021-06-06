import {Input, notification, Select} from "antd";
import {useState, useEffect, useRef} from 'react';
import bookingAPI from "../../../../../network/bookingAPI";
import formatTimeProcess from "../../../../../helpers/formatTimeProcess";
import useAssign from "../../../hooks/useAssign";

const {Option} = Select;
const {TextArea} = Input;

export default function useDialog(props) {
    const [wfDef, setWfDef] = useState({});
    const [data, setData] = useState({});
    const {assign, setAssign, changeState, changeAssign} = useAssign();


    useEffect(() => {
        bookingAPI.get('/wf-def-details?action=true&object=true&more=true')
            .then(response => setData(response.data.data))
            .catch(err => console.log(err));
    }, [])

    useEffect(() => {

        console.log('nghe');

        setWfDef(() => {
            let actions;
            try {
                actions = props?.node?.data?.def?.actions?.split('|');
            } catch (e) {
                actions = ['START'];
            }
            return {
                ...props?.node?.data?.def,
                actions,
                time_process: formatTimeProcess.convertTime(props?.node?.data?.def?.time_process)
            }
        })

        if (!!props?.node?.data?.def.wf_def_object)
            setAssign(() => {
                return props?.node?.data?.def.wf_def_object
            });
        else {
            setAssign((prevState) => {
                const result = {};
                Object.keys(prevState).forEach(item => {
                    result[item] = null;
                })
                return result;
            })
        }


    }, [props?.node?.data])


    const render = {
        action() {
            const response = [];

            for (let item in data.action) {
                response.push(
                    <Option key={item} value={item}>{data.action[item]}</Option>
                )
            }
            return response;
        },
        object() {
            const response = [];


            for (let item in data.object) {

                response.push(
                    <Option key={item} value={data.object[item].trim()}>{data.object[item]}</Option>
                )
            }
            return response;
        },
        more() {
            const response = [];
            for (let item in data.more) {
                response.push(
                    <Option key={item} value={item}>{data.more[item]}</Option>
                )
            }

            return response;
        }
    };

    const onOk = () => {

        const timeProcess = formatTimeProcess.validateTime(wfDef.time_process || '');


        if (!wfDef.name) {
            notification['error']({
                message: 'Thông tin không hợp lệ',
                description: 'Tên không được để trống'
            })
            return;
        }

        if (!timeProcess) {
            notification['error']({
                message: 'Thông tin không hợp lệ',
                description: 'Vui lòng kiểm tra lại định dạng thời gian'
            })
            return;
        }

        wfDef.actions = wfDef.actions || [];
        wfDef.time_process = timeProcess;
        wfDef.wf_def_object = assign;
        const status = !props.node.data ? 'CREATE' : 'EDIT';
        props.onSave(wfDef, status);
    }

    const onCancel = () => {
        props.onCancel();
    }

    const checkTitle = () => {
        if (!props.node.data) return 'Thêm mới quy trình';

        return 'Chỉnh sửa quy trình';
    }

    const onChangeInput = (selector, value) => {

        if (selector === 'object') {
            setWfDef((prev) => {
                return {
                    ...prev,
                    'wf_def_object': {
                        ...wfDef['wf_def_object'],
                        condition: value,
                    }
                }
            })
            return;
        }


        setWfDef((prev) => {
            return {
                ...prev,
                [selector]: value,
            }
        })
    }

    const format = {
        name() {
            return wfDef?.name
        },
        object() {
            return wfDef?.wf_def_object?.condition;
        },
        action() {
            return wfDef?.actions;
        },
        order() {
            return wfDef?.order;
        },
        timeProcess() {
            return wfDef['time_process'];
        },
        description() {
            return wfDef?.description;
        },
        more() {
            return wfDef?.category_input_id;
        }
    }

    return {
        checkTitle,
        onOk,
        onCancel,
        onChangeInput,
        format,
        render,
        assign: {
            assign,
            changeState,
            changeAssign
        }
    }

}