import { useEffect } from 'react'
// Монтирование новых фото после скролла

export default async function usePushPhoto(loading, photo, pushPhoto) {
    const nextPhoto = async () => {
        if (photo.end) { return }
        const { value: { photoMax: batchMax, end } } = await photo.generator.next()
        pushPhoto(({ generator, photoMax }) => ({
            generator, 
            photoMax: [...photoMax, ...batchMax], 
            end
        }))
    }
    
    useEffect(() => {
        if (loading) {
            nextPhoto()
        }
    }, [loading])
}