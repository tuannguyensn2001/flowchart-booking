import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Select} from "antd";
import useParams from "./hooks/useParams";
import formatTimeProcess from "../../../../helpers/formatTimeProcess";
import useAssign from "../../hooks/useAssign";
import Assign from "../Assign";

const {Option} = Select;

const {useForm} = Form;

function Dialog(props) {

    // const def = props?.node?.data?.def || `undefined ${Math.random()}`;
    const [def, setDef] = useState(null);
    const {actions: originAction} = useParams();
    const [form] = useForm(null);
    const [wfDef, setWfDef] = useState([]);
    const {assign, setAssign, changeState, changeAssign, reset} = useAssign();

    const [actions,setActions] = useState([]);

    useEffect(() => {

        form.resetFields();
        setDef(props?.node?.data?.def || `undefined ${Math.random()}`);


        if (Object.keys(props.node).length === 0) {
            reset();
            setWfDef((prevState) => {
                return [
                    // ...prevState,
                    {
                        name: 'name',
                        value: null
                    },
                    {
                        name: 'actions',
                        value: []
                    },
                    {
                        name: 'time_process',
                        value: null
                    }
                ]
            })
            setAssign((prevState) => {
                const clone = {...prevState};
                Object.keys(clone).forEach(item => clone[item] = null);
                return clone;
            })
            return;
        }

        const data = props?.node?.data?.def;

        if (!data) return;

        let {name, actions, time_process} = data;

        if (!Array.isArray(actions)) actions = actions.split('|').map(item => item.trim());

        setWfDef((prevState) => {
            return [
                // ...prevState,
                {
                    name: 'name',
                    value: name
                },
                {
                    name: 'actions',
                    value: actions
                },
                {
                    name: 'time_process',
                    value: formatTimeProcess.convertTime(time_process)
                }
            ]
        })

        // setAssign(props.node.data.def.wf_def_object);


    }, [props.node, setAssign]);

    useEffect(() => {

        const filter = originAction.filter(item => {
            if (item.trim() === 'START' && props.isUniqueAction.start === true) {
                return false;
            }
            return !(item.trim() === 'COMPLETE' && props.isUniqueAction.complete === true);

        })

        setActions(filter);


    }, [props.isUniqueAction])

    const submitForm = value => {
        const status = !props.node.data ? 'CREATE' : 'EDIT';
        props.onSave({
            ...props?.node?.data?.def,
            ...value,
            time_process: formatTimeProcess.validateTime(value.time_process),
            actions: value.actions.join('|'),
            wf_def_object: {
                ...assign
            }
        }, status)
    }


    return (
        <div>
            <Modal maskClosable={false} onCancel={props.onCancel} onOk={form.submit} visible={props.show}>
                <Form form={form}
                      layout={'vertical'}
                      name={'wfDefDetail'}
                      fields={wfDef}
                      onFinish={submitForm}
                >
                    <Form.Item
                        label={'Tên'}
                        name={'name'}
                        rules={[
                            {
                                required: true,
                                message: 'Tên không được để trống'
                            }
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label={'Hành động'}
                        name={'actions'}
                        rules={[
                            {
                                required: true,
                                message: 'Hành động không được để trống'
                            }
                        ]}
                    >
                        <Select
                            mode='multiple'
                        >
                            {actions.map(action => <Option value={action} key={action}>{action}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        required={true}
                        label={'Thời gian thực hiện'}
                        name={'time_process'}
                        rules={[
                            {
                                validator(_, value) {
                                    console.log(value);
                                    if (!value) value = '';
                                    if (!!formatTimeProcess.validateTime(value)) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Thời gian không đúng định dạng'))
                                }
                            },

                        ]}
                    >
                        <Input/>

                    </Form.Item>

                    <Assign show={props.show} hooks={{
                        assign, setAssign, changeState, changeAssign, def
                    }}/>

                </Form>
            </Modal>

        </div>
    )
}

export default Dialog;