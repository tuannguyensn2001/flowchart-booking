import React, {useState, useEffect} from 'react';
import bookingAPI from "../../../../../network/bookingAPI";

export default function useParams() {

    const [actions, setActions] = useState([]);

    useEffect(() => {
        bookingAPI.get('/wf-def-details?action=true&object=true&more=true')
            .then(response => {
                const {action} = response.data.data;
                const convertAction = [];
                Object.keys(action).forEach(item => {
                    convertAction.push(item);
                });

                setActions(convertAction);
            })
            .catch(err => console.log(err));
    }, [])

    return {actions, setActions};

}