import { useEffect } from 'react'
// Скролл знакомых

export default function useScrollPeople(loading, setLoading) {
    const scrollHandler = ({target: {scrollHeight, scrollTop, offsetHeight}}) => {
        const val = scrollHeight - (scrollTop + offsetHeight)
        if (200 < val & val < 400) {
            setLoading(false)
        }
        else if (val < 100 & !loading) {
            setLoading(true)
        }
    }
    useEffect(() => {
        const scrollContainer = document.querySelector('.people-grid')
        scrollContainer.addEventListener('scroll', scrollHandler)
        return () => {scrollContainer.removeEventListener('scroll', scrollHandler)}
    }, [])
}