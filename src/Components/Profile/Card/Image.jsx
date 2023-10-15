import React, { useEffect, useState } from 'react'

export default function Image({ imgMax }) {
    const [img, setImg] = useState(null)
    useEffect(() => { setImg(imgMax) }, [imgMax])
    return (
        <img src={img} />
    )
}