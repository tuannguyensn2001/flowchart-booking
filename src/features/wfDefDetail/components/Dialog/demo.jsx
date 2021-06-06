import React from 'react';
import {Modal, Form, Input, Select, InputNumber, Radio} from 'antd';
import styled from 'styled-components';
import Assign from "../Assign";


import useDialog from "./hooks";


const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }
`


const {Option} = Select;
const {TextArea} = Input;



const Dialog = (props) => {

    const {
        checkTitle,
        onOk,
        onCancel,
        onChangeInput,
        format,
        render,
        assign
    } = useDialog(props);


    return (
        <div>

            <Modal width={900} style={{top: 0}} title={checkTitle()} visible={props.show}
                   onOk={onOk}
                   onCancel={onCancel}
            >

                <FormGroup>
                    <label htmlFor="">Tên</label>
                    <Input
                        placeholder="Nhập tên"
                        onChange={(event) => onChangeInput('name', event.target.value)}
                        value={format.name()}/>
                </FormGroup>

                <FormGroup>
                    <label htmlFor="">Hành động</label>
                    <Select
                        placeholder="Chọn hành động"
                        mode="multiple"
                        onChange={value => onChangeInput('actions', value)}
                        value={format.action()}>
                        {render.action()}
                    </Select>
                </FormGroup>

                <FormGroup>
                    <label htmlFor="">Bàn giao</label>
                    <Select
                        placeholder="Chọn bàn giao"
                        onChange={value => onChangeInput('object', value)}
                        defaultValue={format.object()}
                    >
                        {render.object()}
                    </Select>
                </FormGroup>


                <FormGroup>
                    <label htmlFor="">Thời gian thực hiện</label>
                    <Input
                        placeholder="Chọn thời gian thực hiện"
                        onChange={(event) => onChangeInput('time_process', event.target.value)}
                        value={format.timeProcess()}/>
                </FormGroup>

                <Assign hooks={assign} />



            </Modal>
        </div>
    );
};

export default Dialog;