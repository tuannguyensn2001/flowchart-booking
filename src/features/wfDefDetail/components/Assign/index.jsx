import React, {Fragment, useEffect, useState} from 'react';
import {Radio, Steps, Row, Col, Checkbox, Select} from "antd";
import styled from "styled-components";
import Position from "../Position";
import Department from "../Department";
import AssignContext from "../../Context/AssignContext";
import {AssignProvider} from "../../Context/AssignContext";
import useLocalization from "../../../../hooks/useLocalization";
import Team from "../Team";
import {useQuery} from "react-query";
import bookingAPI from "../../../../network/bookingAPI";


const {Step} = Steps;


const SelectWrapper = styled(Select)`
  width: 100%;
`

const {Option} = Select;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  &:first-child {
    margin-top: 0;
  }
`

const assignTo = [
    {
        value: 1,
        text: 'Dựa vào chức vụ'
    },
    {
        value: 2,
        text: 'Xác định nhân viên cụ thể'
    }
]

function Assign({hooks, show}) {

    const {assign, changeState, changeAssign, def} = hooks;
    const {trans} = useLocalization();
    const [state, setState] = useState({
        // isUnique: null,
        isTeam: null,
    });
    const [step, setStep] = useState(0);
    const [detail, setDetail] = useState(null);
    const [userTeam, setUserTeam] = useState(null);

    const {data} = useQuery(['teams', assign.department], async () => {
        if (!assign.department) return null;
        const response = await bookingAPI.get(`/teams?department_group=${assign.department}`);
        return response.data.data;
    })

    const {data: departments, isLoading, isSuccess} = useQuery('deparments', async () => {
        const response = await bookingAPI.get('/departments');
        return response.data.data;
    })

    const {
        data: positions,
        isSuccess: isSuccessPosition,
        isLoading: isLoadingPosition
    } = useQuery('positions', async () => {
        const response = await bookingAPI.get('/positions');
        return response.data.data;
    })

    // const {data: users} = useQuery(['users', assign.team_id], async () => {
    //     const response = await bookingAPI.get(`/teams/${assign.team_id}?user=department`);
    //     return response.data.data;
    // })

    const {data: users} = useQuery(['users', assign.department], async () => {
        if (!assign.department) return null;
        const response = await bookingAPI.get(`/departments/${assign.department}?user=true`);
        return response.data.data;
    })

    // useEffect(() => {
    //     console.log('change');
    // }, [assign]);

    useEffect(() => {


        if (typeof def === 'string' && def.includes('undefined')) {
            setState({
                ...{...state},
                isTeam: null
            });
            setDetail(null);
            setUserTeam(null);
            return;
        }
        ;
        const wfDefObject = def?.wf_def_object;
        if (!wfDefObject) return;
        const {position, department, user_id, team_id, assignTo, is_lead_team, is_unique_dept} = wfDefObject;

        if (assignTo - 0 === 1) {
            changeAssign({
                target: {
                    value: 1
                }
            });
        } else {
            changeAssign({
                target: {
                    value: 2
                }
            });
        }


        if (!!position) {
            changeState().position(position);
        }

        if (!!department) {
            changeState().department(department)
        }


        //vi tri la duy nhat

        // if (is_unique_dept === true) {
        //     // setState(prevState => {
        //     //     return {
        //     //         ...prevState,
        //     //         isUnique: true
        //     //     }
        //     // })
        //     changeState().unique(true);
        //     return;
        // }


        //co team co user
        if (!!user_id && !!team_id) {

            setState(prevState => ({
                ...prevState,
                isTeam: true
            }));
            changeState().team(parseInt(team_id));
            if (is_lead_team) {
                setUserTeam('LEAD')
            } else {
                setUserTeam('ONE');
                changeState().user(parseInt(user_id));
            }
            return;
        }


        //co team k co user
        if (!!team_id && user_id === null) {
            setState({
                ...state,
                isTeam: true
            })
            changeState().team(team_id);
            setUserTeam('ALL');
            return;
        }

        //khong co team
        if (team_id === null) {
            setState(prevState => {
                return {
                    ...prevState,
                    isTeam: false
                }
            })

            if (!!user_id) {
                setDetail('ONE');
                changeState().user(parseInt(user_id));
            } else setDetail('ALL');

        }


    }, [def])

    useEffect(() => {
        if (assign.is_unique_dept === true) {
            changeState().team(null);
            changeState().user(null);
        }
    }, [assign.is_unique_dept])

    useEffect(() => {
        if (assign.assignTo === 2) {
            setState({
                ...state,
                isTeam: null
            })
        }
    }, [assign.assignTo])

    useEffect(() => {
        if (assign.team_id === null) setUserTeam(null);
    }, [assign.team_id])

    useEffect(() => {
        if (!data) return;
        if (data.length === 0) setState({
            ...{...state},
            isTeam: null,
        })
    }, [data])


    const handleChangeAssign = event => {
        const value = event.target.value;

        if (value === 1) {
            changeState().position(null);
            changeState().department(null);
        } else {
            changeState().team(null);
            changeState().user(null)
        }

        changeAssign(event);

    }

    const changeTeam = (event) => {

        if (event.target.value === false) {
            changeState().team(null);
        }

        setState(prevState => ({
            ...prevState,
            isTeam: event.target.value
        }))
    }

    const changeDetail = event => {
        changeState().user(null);
        setDetail(event.target.value);
    }

    const changeUser = value => {
        changeState().user(value);
    }


    return (

        <Fragment>
            <AssignProvider value={{
                assign,
                changeState
            }
            }>
                <FormGroup>
                    <label htmlFor="">{trans('wfDefDetail.assign')}</label>

                    <Radio.Group onChange={handleChangeAssign} value={assign.assignTo}>
                        {assignTo.map(item => <Radio key={item.value} value={item.value}>{item.text}</Radio>)}
                    </Radio.Group>
                </FormGroup>


                <Row gutter={16}>
                    {assign.assignTo === 1 &&
                    <Col className={'gutter-row'} span={12}> <Position
                        stateAssign={changeState}
                        positions={positions}
                        isSuccess={isSuccessPosition}
                        isLoading={isLoadingPosition}
                        change={changeState().position}/></Col>}

                    {!!assign.position && assign.assignTo === 1 &&
                    <Col className={'gutter-row'} span={12}><Department
                        departments={departments}
                        isLoading={isLoading}
                        change={changeState().department}
                        isSuccess={isSuccess}
                    /></Col>}
                </Row>

                {isSuccess &&
                <div>
                    <Row>
                        {!assign.is_unique_dept && !!assign.position && !!assign.department &&
                        <Radio.Group onChange={changeTeam} value={state.isTeam}>
                            {data?.length !== 0 && <Radio value={true}>Chia team</Radio>}
                            <Radio value={false}>Khác</Radio>
                        </Radio.Group>}
                    </Row>


                    {!assign.is_unique_dept && assign.assignTo === 1 && state.isTeam !== null && state.isTeam === true &&
                    <Team state={state} setUserTeam={setUserTeam} userTeam={userTeam} data={data}/>
                    }

                    {state.isTeam !== null && state.isTeam === false && !assign.is_unique_dept && !!assign.position &&

                    <div>
                        <Radio.Group value={detail} onChange={changeDetail}>
                            <Radio value={'ALL'}>Show cho cả phòng</Radio>
                            <Radio value={'ONE'}>1 người cụ thể</Radio>
                        </Radio.Group>

                        {detail === 'ONE' && !state.isTeam &&
                        <SelectWrapper
                            onChange={changeUser}
                            value={assign.user_id}
                            showSearch
                            optionFilterProp={'children'}
                            placeholder={'Chọn người'}
                        >
                            {users?.map(item => (
                                <Option key={item.id} value={item.id}>{`${item.fullname}-${item.email}`}</Option>
                            ))}
                        </SelectWrapper>
                        }
                    </div>
                    }
                </div>
                }


            </AssignProvider>

        </Fragment>


    )
}

export default Assign;