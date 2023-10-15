import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

import ScrollUp from '../ScrollUp'
import Familiars from './Familiars/Familiars'
import Card from './Card/Card'

export default function User() {
    const [animation, setAnimation] = useState(0)
    const {id} = useParams()
    const ref = useRef(null)
    useEffect(() => {setAnimation(0); ref.current.scrollTo({ left: 0 })}, [id])
    return (
        <>
            <ScrollUp />
            {
                <div className="profile" animation={animation}>
                    <Card innerRef={ref} id={id} animation={animation} setAnimation={setAnimation}/>
                    <Familiars />
                </div>
            }
        </>
    )
}