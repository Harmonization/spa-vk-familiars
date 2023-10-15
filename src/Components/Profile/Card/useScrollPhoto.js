import { useEffect } from 'react'
// Горизонтальный бесконечный скролл фотографий

export default function useScrollPhoto(animation, loading, setLoading) {
    const scrollHandler = ({target: {scrollLeft, scrollWidth, offsetHeight}}) => {        
        const val = Math.abs(scrollWidth - (scrollLeft + (animation ? offsetHeight : offsetHeight * 2)))
        if (200 < val & val < 400) {
            setLoading(false)
        }
        else if (val < 100 & !loading) {
            setLoading(true)
        }
    }

    useEffect(() => {
        const scrollContainer = document.querySelector('.photo')
        scrollContainer.addEventListener('scroll', scrollHandler)
        return () => {scrollContainer.removeEventListener('scroll', scrollHandler)}
    }, [])
}