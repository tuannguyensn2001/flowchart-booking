import {useState, useEffect} from "react";

export default function useAssign() {
    const [assign, setAssign] = useState({
        assignTo: null,
        position: null,
        department: null,
        isAssign: false,
        team_id: null,
        user_id: null,
        is_unique_dept: null,
        is_lead_team: null,
    })

    const changeAssign = event => {
        setAssign(prevState => {
            if (event.target.value === 2) {
                return {
                    ...prevState,
                    assignTo: event.target.value,
                    position: null,
                    department: null,
                }
            }

            return {
                ...prevState,
                assignTo: event.target.value,
            }
        })
    }

    const changeState = () => {
        return {
            position(value) {
                setAssign(prevState => {
                    return {
                        ...prevState,
                        position: value
                    }
                })
            },
            department(value) {
                setAssign(prevState => {
                    return {
                        ...prevState,
                        department: value
                    }
                })
            },
            isAssign(event) {
                setAssign(prevState => {
                    return {
                        ...prevState,
                        isAssign: event.target.checked
                    }
                })
            },
            team(value) {
                setAssign(prevState => {
                    return {
                        ...prevState,
                        team_id: Number(value) || null
                    }
                })
                // setAssign({
                //     ...assign,
                //     team_id: value
                // })
            },
            user(value) {
                setAssign(prevState => {
                    return {
                        ...prevState,
                        user_id: Number(value) || null
                    }
                })
                // setAssign({
                //     ...assign,
                //     user_id: value
                // })
            },
            unique(value) {


                setAssign(prevState => {

                    return {
                        ...prevState,
                        is_unique_dept: value
                    }
                })
                // setAssign({
                //     ...assign,
                //     is_unique_dept: value
                // })
            },
            lead(value) {
                setAssign(prevState => {
                    return {
                        ...prevState,
                        is_lead_team: value
                    }
                })
            }
        }
    };

    const reset = () => {
        const clone = {...assign};

        Object.keys(clone).forEach(item => clone[item] = null);

        setAssign(clone);
    }


    return {
        assign,
        setAssign,
        changeAssign,
        changeState,
        reset
    }

}
