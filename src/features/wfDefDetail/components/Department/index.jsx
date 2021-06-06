import React, {useState, useEffect, Fragment, useContext} from "react";
import bookingAPI from "../../../../network/bookingAPI";
import {Select, Row, Radio, Skeleton} from "antd";
import styled from "styled-components";
import AssignContext from "../../Context/AssignContext";
import {useQuery} from "react-query";

const {Option} = Select;


const SelectWrapper = styled(Select)`
  width: 100%;
`

function Department({change, departments, isLoading, isSuccess}) {

    const {assign} = useContext(AssignContext);

    const value = Number(assign.department) || null;

    useEffect(() => {
        console.log(Number(assign.department))
    }, [assign.department])


    return (
        <Fragment>

            {isLoading && <Skeleton title={{width: '100%'}} paragraph={{rows: 0}}/>}

            {isSuccess && <SelectWrapper defaultValue={null} value={value} onChange={change}
                                         placeholder={'Chọn phòng ban'}>
                {departments.map(item => {
                    return <Option value={item.id} key={item.id}>{item.name}</Option>
                })}
            </SelectWrapper>}

            {/*{assign.department === 1 &&*/}
            {/*    <div>*/}
            {/*        <Radio.Group onChange={onChangeRadio}>*/}
            {/*            <Radio value={'import'}>Nhập</Radio>*/}
            {/*            <Radio value={'export'}>Xuất</Radio>*/}
            {/*        </Radio.Group>*/}
            {/*    </div>*/}
            {/*}*/}

        </Fragment>
    )
}

export default Department;