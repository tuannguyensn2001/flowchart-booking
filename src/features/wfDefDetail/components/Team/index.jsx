import React, {useContext, useEffect, useState} from 'react';
import AssignContext from "../../Context/AssignContext";
import {useQuery} from "react-query";
import bookingAPI from "../../../../network/bookingAPI";
import {Select, Row, Radio, Empty} from "antd";
import styled from "styled-components";


const {Option} = Select;


const SelectWrapper = styled(Select)`
  width: 100%;
`


function Team({data, userTeam, setUserTeam, state}) {
    const {assign, changeState} = useContext(AssignContext);
    const [detail, setDetail] = useState(null);
    const [detailTeam, setDetailTeam] = useState(null);


    //
    // const {data: users} = useQuery(['users', assign.team_id], async () => {
    //     const response = await bookingAPI.get(`/teams/${assign.team_id}?user=true`);
    //     return response.data.data;
    // })

    const {data: usersTeam} = useQuery(['users', assign.team_id], async () => {
        if (!assign.team_id) return null;
        const response = await bookingAPI.get(`/teams/${assign.team_id}?user=team&lead=true`);
        return response.data.data;
    });


    useEffect(() => {
        if (detail !== null) {
            changeState().team(null)
        }
    }, [detail])

    useEffect(() => {
        if (assign.team_id !== null) {
            setDetail(null)
        }
    }, [assign.team_id])

    useEffect(() => {
        if (detail === 'ONE') setUserTeam(null);
    }, [detail])


    const changeTeam = (value) => {
        changeState().team(value);
    }

    const changeDetail = event => {
        changeState().user(null);
        setDetail(event.target.value);
    }

    const changeUser = value => {
        changeState().user(value);
    }

    const changeUserTeam = event => {
        const value = event.target.value;
        if (value === 'ALL') changeState().user(null);
        if (value === 'LEAD') {
            changeState().lead(true);
            changeState().user(usersTeam?.lead - 0);
            // changeState().user(37);
            // bookingAPI.get(`/teams/${assign.team_id}?lead=true`)
            //     .then(response => {
            //         const {data} = response.data;
            //         changeState().user(parseInt(data));
            //     })
            //     .catch(err => console.log(err));
        }
        setUserTeam(value);

    }

    return (
        <div>
            {state.isTeam === true &&
            <Row>

                {/*<Radio.Group value={detail} onChange={changeDetail}>*/}
                {/*    <Radio value={'ALL'}>Show cho cả phòng</Radio>*/}
                {/*    <Radio value={'ONE'}>1 người cụ thể</Radio>*/}
                {/*</Radio.Group>*/}


                <SelectWrapper onChange={changeTeam} placeholder={'Chọn team'} value={assign.team_id}>
                    {data?.map(item => (
                        <Option key={item.id} value={item.id}>{item.name_team}</Option>
                    ))}
                </SelectWrapper>


                {/*{detail === 'ONE' &&*/}
                {/*<SelectWrapper*/}
                {/*    onChange={changeUser}*/}
                {/*    value={assign.user_id}*/}
                {/*    showSearch*/}
                {/*    optionFilterProp={'children'}*/}
                {/*    placeholder={'Chọn người'}*/}
                {/*>*/}
                {/*    {users?.map(item => (*/}
                {/*        <Option key={item.id} value={item.id}>{`${item.fullname}-${item.email}`}</Option>*/}
                {/*    ))}*/}
                {/*</SelectWrapper>*/}
                {/*}*/}

                {assign.team_id !== null &&
                <Radio.Group value={userTeam} onChange={changeUserTeam}>
                    <Radio value={'LEAD'}>Giao cho trưởng nhóm</Radio>
                    <Radio value={'ALL'}>Cả nhóm làm</Radio>
                    <Radio value={'ONE'}>Chỉ định người làm</Radio>
                </Radio.Group>
                }

                {userTeam === 'ONE' &&
                <SelectWrapper
                    notFoundContent={
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span>
                                    Không tìm thấy gì cả
                                </span>
                            }

                        />}
                    onChange={changeUser}
                    value={assign.user_id}
                    showSearch
                    optionFilterProp={'children'}
                    placeholder={'Chọn người'}
                >
                    {usersTeam?.users?.map(item => (
                        <Option key={item.id} value={item.id}>{`${item.fullname}-${item.email}`}</Option>
                    ))}
                </SelectWrapper>
                }


            </Row>
            }
        </div>
    )
}

export default Team;