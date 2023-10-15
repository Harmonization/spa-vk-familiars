import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ScrollContainer } from 'react-indiana-drag-scroll'

import Image from './Image'
import useScrollPhoto from './useScrollPhoto'
import usePushPhoto from './usePushPhoto'

export default function Photo({ innerRef, animation, setAnimation }) {
    const { photos } = useLoaderData()
    const [photo, pushPhoto] = useState(photos)
    const [loading, setLoading] = useState(false)

    useEffect(() => { pushPhoto(photos) }, [photos])
    useScrollPhoto(animation, loading, setLoading)
    usePushPhoto(loading, photo, pushPhoto)

    const { photoMax } = photo
    return (
        <ScrollContainer ref={innerRef} className="photo" onClick={() => { setAnimation(1) }} >
            {photoMax.map((element, index) => (
                <div className="photo-item" key={index} id={`photo-${index}`}>
                    <Image imgMax={element} />
                </div>
            ))}
        </ScrollContainer>
    )
}
