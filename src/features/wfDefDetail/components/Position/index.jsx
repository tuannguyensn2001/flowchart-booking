import React, {Fragment, useEffect, useState, useContext} from 'react';
import bookingAPI from "../../../../network/bookingAPI";
import {Row, Select, Skeleton} from "antd";
import styled from "styled-components";
import AssignContext from "../../Context/AssignContext";
import {useQuery} from "react-query";


const {Option} = Select;

const SelectWrapper = styled(Select)`
  width: 100%;
`


function Position({change, stateAssign, positions, isSuccess, isLoading}) {

    // const [positions, setPositions] = useState([]);
    const {assign} = useContext(AssignContext);
    // const {data: positions, isSuccess, isLoading} = useQuery('positions', async () => {
    //     const response = await bookingAPI.get('/positions');
    //     return response.data.data;
    // })

    useEffect(() => {
        if (!positions) return;

        // stateAssign(prevState => {
        //     const position = positions.find(item => item.id === assign.position);
        //     return {
        //         ...prevState,
        //         isUnique: !!position?.unique_in_dept,
        //     }
        // })
        const position = positions.find(item => item.id == assign.position);

        stateAssign().unique(position?.unique_in_dept == '1');


    }, [assign.position, positions])


    return (
        <Fragment>
            {isLoading && <Skeleton title={{width: '100%'}} paragraph={{rows: 0}}/>}
            {isSuccess && <SelectWrapper defaulutValue={1} value={Number(assign.position) || null} onChange={change}
                                         placeholder={'Chọn chức vụ'}>
                {positions.map(position => {
                    return <Option key={position.id} value={position.id}>{position.name}</Option>
                })}
            < /SelectWrapper>}

        </Fragment>
    )


}

export default Position;