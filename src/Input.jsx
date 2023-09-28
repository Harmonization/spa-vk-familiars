import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'react-indiana-drag-scroll/dist/style.css'
import './css_styles/style.css'

export const Input = () => {
    const [userAccess, setAccess] = useState(false) // Вошел ли пользователь

    const [userId, setId] = useState('')

    const navigate = useNavigate()

    const loginStatus = (time = 300) => new Promise(resolve => setTimeout(() => VK.Auth.getLoginStatus(resolve), time))

    const entry = async () => {
        if (!userAccess) {
            const vkAuth = () => new Promise(resolve => setTimeout(() => VK.Auth.login(resolve, 2 + 4 + 64 + 1024), 300))
            const accessReceived = (message) => {
                console.log(message)
                setAccess(true)
            }

            const { session } = await loginStatus()
            if (!session) {
                console.log('Авторизация...')
                const { session } = await vkAuth()
                if (session) {
                    accessReceived('Пользователь вошел')
                }
                else {
                    console.log(`Пользователь НЕ вошел (${session})`)
                    return
                }
            }
            else {
                accessReceived('Пользователь уже совершил вход')
            }
        }
    }

    const exit = async () => {
        const vkExit = () => new Promise(resolve => setTimeout(() => VK.Auth.logout(resolve), 300))
        const { session } = await loginStatus()
        if (session) {
            const { session } = await vkExit()

            if (!session) {
                console.log('Пользователь вышел')
                setAccess(false)
                navigate('../')
                setId('')
            }
        }
    }

    const inputKeyDown = ({ key }) => {
        if (key === 'Enter') {
            navigate(`../spa-vk-familiars/${userId}`)
        }
    }

    return (
        <>
            <div className="entry-exit">
                <input autoFocus type="text" placeholder='Введите id страницы VK' onChange={({ target: { value } }) => { setId(value) }}
                    onClick={entry} onKeyDown={inputKeyDown} value={userId} className='nickname'/>

                {userAccess && <button className='exit' onClick={exit}>Выйти</button>}
            </div>
        </>
    )
}