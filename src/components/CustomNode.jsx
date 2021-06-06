import React, {useEffect, useState} from 'react';
import {Handle} from "react-flow-renderer";
import {usePopper} from "react-popper";
import styled from 'styled-components';

const customNodeStyles = {
    background: '#9CA8B3',
    color: '#FFF',
    padding: 10,
};


const Block = styled.div`
  width: 300px;
  color: #fff;
  background-color: #8888e9;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
`

const CustomNode = ({data}) => {

    const [referenceElement, setReferenceElement] = useState(null);
    const [popperElement, setPopperElement] = useState(null);
    const [arrowElement, setArrowElement] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const {styles, attributes} = usePopper(referenceElement, popperElement, {
        modifiers: [{name: 'arrow', options: {element: arrowElement}}],
    });

    useEffect(() => {

    }, [isOpen])

    const enter = (event) => {
        event.target.click();
        setIsOpen(true);
        referenceElement.focus();
    }

    return (
        <div>
            <div onMouseEnter={enter} onMouseLeave={() => setIsOpen(false)} ref={setReferenceElement}
                 style={{
                     ...data.style,
                     width: '150px',
                     height: '40px',
                 }
                 }>
                <Handle type="target" position="top" style={{borderRadius: 0}}/>
                <div
                ><p style={{
                    textAlign: 'center',
                    paddingTop: '5%'
                }}>{data.def.name}</p></div>
                <Handle
                    type="source"
                    position="bottom"

                />


            </div>
            {
                data?.def?.actionBy &&
                <div ref={setPopperElement} style={{
                    ...styles.popper,
                    display: isOpen ? 'block' : 'none',
                    zIndex: '9999'
                }} {...attributes.popper}>
                    <Block>
                        <p>Thực hiện: {data?.def?.actionBy?.fullname}</p>
                        <p>Bắt đầu: {data?.def?.created_at}</p>
                        <p>Cập nhật: {data?.def?.updated_at}</p>
                        {data?.def?.time_execute && <p>Deadline: {data?.def?.time_execute} </p>}
                    </Block>
                    <div ref={setArrowElement} style={styles.arrow}/>
                </div>
            }

        </div>

    );
}
;

export default CustomNode;