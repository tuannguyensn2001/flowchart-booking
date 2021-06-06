import React, {useState, useEffect} from 'react';
import {Checkbox, Modal, Radio} from "antd";
import styled from "styled-components";


const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }
`


function DialogEdge(props) {
    const {edge, listEdges} = props;
    const [currentEdge, setCurrentEdge] = useState({});

    useEffect(() => {
        setCurrentEdge(() => edge)
    }, [edge]);

    const onChange = (properties, value) => {
        console.log(properties, value)
        setCurrentEdge((prevState) => {
            return {
                ...prevState,
                data: {
                    ...prevState.data,
                    [properties]: value,
                }
            }
        })
    }

    const onOk = () => {
        props.onSave(currentEdge);
    }

    const checkConditionNeedMerge = () => {
        const target = currentEdge.target;

        return listEdges.filter(edge => edge.target === target).length > 1;
    };

    return (
        <div>
            <Modal onOk={onOk} title={'Chỉnh sửa điều kiện'} onCancel={props.onCancel} visible={props.show}>
                <FormGroup>
                    <label htmlFor="fwd_type">Bắt buộc rẽ nhánh</label>
                    <Radio.Group
                        onChange={event => onChange('fwd_type', event.target.value)}
                        value={currentEdge?.data?.fwd_type}
                        id={'fwd_type'}>
                        <Radio value={'GROUP'}>Có</Radio>
                        <Radio value={'OR'}>Không</Radio>
                    </Radio.Group>
                </FormGroup>

                {currentEdge?.data?.fwd_type === 'GROUP' && <FormGroup>
                    <Checkbox
                        checked={!!parseInt(currentEdge?.data?.priority)}
                        onChange={event => onChange('priority', event.target.checked ? 1 : 0)}

                    >Nhánh chính</Checkbox>
                </FormGroup>}

                {checkConditionNeedMerge() &&
                <FormGroup>
                    <label htmlFor="fwd_type">Đợi nhánh khác</label>
                    <Radio.Group
                        onChange={event => onChange('waiting_type', event.target.value)}
                        value={currentEdge?.data?.waiting_type}
                        id={'waiting_type'}>
                        <Radio value={'GROUP'}>Có</Radio>
                        <Radio value={'OR'}>Không</Radio>
                    </Radio.Group>
                </FormGroup>}
            </Modal>
        </div>
    )
}

export default DialogEdge;