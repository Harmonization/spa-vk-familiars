import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
// Скролл наверх при переходе от страницы к странице

export default function ScrollUp() {
    const { pathname } = useLocation()
    useEffect(() => { window.scrollTo(0, 0) }, [pathname])
    return null
}