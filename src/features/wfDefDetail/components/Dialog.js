// import React, {useState, useRef, useEffect} from 'react';
// import {Modal, Form, Input, Select, InputNumber, Radio} from 'antd';
// import bookingAPI from "../../../network/bookingAPI";
// import styled from 'styled-components';
// import formatTimeProcess from "../../../helpers/formatTimeProcess";
// import {notification} from "antd";
//
// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-top: 20px;
//
//   &:first-child {
//     margin-top: 0;
//   }
// `
//
//
// const {Option} = Select;
// const {TextArea} = Input;
//
// const Dialog = (props) => {
//     const [wfDef, setWfDef] = useState({});
//     const [isMore, setIsMore] = useState(false);
//     const [data, setData] = useState({});
//
//
//     useEffect(() => {
//         bookingAPI.get('/wf-def-details?action=true&object=true&more=true')
//             .then(response => setData(response.data.data))
//             .catch(err => console.log(err));
//     }, [])
//
//     useEffect(() => {
//
//
//         setWfDef(() => {
//             let actions;
//             try {
//                 actions = props?.node?.data?.def?.actions?.split('|');
//             } catch (e) {
//                 actions = ['START'];
//             }
//             return {
//                 ...props?.node?.data?.def,
//                 actions,
//                 time_process: formatTimeProcess.convertTime(props?.node?.data?.def?.time_process)
//             }
//         })
//
//         setIsMore(!!props?.node?.data?.def?.category_input_id);
//
//
//     }, [props.node.data])
//
//     const render = {
//         action() {
//             const response = [];
//
//             for (let item in data.action) {
//                 response.push(
//                     <Option key={item} value={item}>{data.action[item]}</Option>
//                 )
//             }
//             return response;
//         },
//         object() {
//             const response = [];
//
//
//             for (let item in data.object) {
//
//                 response.push(
//                     <Option key={item} value={data.object[item].trim()}>{data.object[item]}</Option>
//                 )
//             }
//             return response;
//         },
//         more() {
//             const response = [];
//             for (let item in data.more) {
//                 response.push(
//                     <Option key={item} value={item}>{data.more[item]}</Option>
//                 )
//             }
//
//             return response;
//         }
//     };
//
//     const onOk = () => {
//         const timeProcess = formatTimeProcess.validateTime(wfDef.time_process || '');
//
//
//         if (!wfDef.name) {
//             notification['error']({
//                 message: 'Th??ng tin kh??ng h???p l???',
//                 description: 'T??n kh??ng ???????c ????? tr???ng'
//             })
//             return;
//         }
//
//         if (!timeProcess) {
//             notification['error']({
//                 message: 'Th??ng tin kh??ng h???p l???',
//                 description: 'Vui l??ng ki???m tra l???i ?????nh d???ng th???i gian'
//             })
//             return;
//         }
//
//         wfDef.actions = wfDef.actions || [];
//         wfDef.time_process = timeProcess;
//         const status = !props.node.data ? 'CREATE' : 'EDIT';
//         props.onSave(wfDef, status);
//     }
//
//     const onCancel = () => {
//         props.onCancel();
//     }
//
//     const checkTitle = () => {
//         if (!props.node.data) return 'Th??m m???i quy tr??nh';
//
//         return 'Ch???nh s???a quy tr??nh';
//     }
//
//     const onChangeInput = (selector, value) => {
//
//         if (selector === 'object') {
//             setWfDef((prev) => {
//                 return {
//                     ...prev,
//                     'wf_def_object': {
//                         ...wfDef['wf_def_object'],
//                         condition: value,
//                     }
//                 }
//             })
//             return;
//         }
//
//
//         setWfDef((prev) => {
//             return {
//                 ...prev,
//                 [selector]: value,
//             }
//         })
//     }
//
//     const format = {
//         name() {
//             return wfDef?.name
//         },
//         object() {
//             return wfDef?.wf_def_object?.condition;
//         },
//         action() {
//             return wfDef?.actions
//         },
//         order() {
//             return wfDef?.order;
//         },
//         timeProcess() {
//             return wfDef['time_process'];
//         },
//         description() {
//             return wfDef?.description;
//         },
//         more() {
//             return wfDef?.category_input_id;
//         }
//     }
//
//
//     return (
//         <div>
//
//             <Modal width={900} style={{top: 0}} title={checkTitle()} visible={props.show}
//                    onOk={onOk}
//                    onCancel={onCancel}
//             >
//
//                 <FormGroup>
//                     <label htmlFor="">T??n</label>
//                     <Input
//                         placeholder="Nh???p t??n"
//                         onChange={(event) => onChangeInput('name', event.target.value)}
//                         value={format.name()}/>
//                 </FormGroup>
//
//                 <FormGroup>
//                     <label htmlFor="">H??nh ?????ng</label>
//                     <Select
//                         placeholder="Ch???n h??nh ?????ng"
//                         mode="multiple"
//                         onChange={value => onChangeInput('actions', value)}
//                         value={format.action()}>
//                         {render.action()}
//                     </Select>
//                 </FormGroup>
//
//                 <FormGroup>
//                     <label htmlFor="">B??n giao</label>
//                     <Select
//                         placeholder="Ch???n b??n giao"
//                         onChange={value => onChangeInput('object', value)}
//                         defaultValue={format.object()}
//                     >
//                         {render.object()}
//                     </Select>
//                 </FormGroup>
//
//
//
//                 <FormGroup>
//                     <label htmlFor="">Th???i gian th???c hi???n</label>
//                     <Input
//                         placeholder="Ch???n th???i gian th???c hi???n"
//                         onChange={(event) => onChangeInput('time_process', event.target.value)}
//                         value={format.timeProcess()}/>
//                 </FormGroup>
//
//
//                 <FormGroup>
//                     <label htmlFor="">B??n giao</label>
//                 </FormGroup>
//
//
//             </Modal>
//         </div>
//     );
// };
//
// export default Dialog;