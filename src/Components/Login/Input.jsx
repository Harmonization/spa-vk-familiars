import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntry } from './useEntry.js'
import { useExit } from './useExit.js'

export default function Input() {
    const [userAccess, setAccess] = useState(false) // Вошел ли пользователь
    const [userId, setId] = useState('')
    const navigate = useNavigate()
    const loginStatus = (time = 300) => new Promise(resolve => setTimeout(() => VK.Auth.getLoginStatus(resolve), time))

    const inputKeyDown = ({ key }) => {
        if (key === 'Enter')
            navigate(`../spa-vk-familiars/${userId}`)
    }

    return (
        <div className="entry-exit">
            <input 
                autoFocus type="text" 
                placeholder='Введите id страницы VK' 
                onChange={({ target: { value } }) => { setId(value) }}
                onClick={() => useEntry(userAccess, setAccess, loginStatus)} 
                onKeyDown={inputKeyDown} value={userId} className='nickname'/>

            {userAccess && <button className='exit' onClick={() => useExit(setAccess, loginStatus, setId)}>Выйти</button>}
        </div>
    )
}