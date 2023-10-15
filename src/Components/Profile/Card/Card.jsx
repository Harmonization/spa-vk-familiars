import React from 'react'
import { useLoaderData } from 'react-router-dom'
import Photo from './Photo'

export default function Card({ innerRef, animation, setAnimation }) {
  const { user } = useLoaderData()
  const { fullname, age, status, link, city } = user

  return (
    <div className="card">
        <h2 className="fullname">
            <a href={link} target='_blank'>
                {age ? `${fullname}, ${age}` : fullname}
            </a>
        </h2>
        {city && <h2 className="city">{city}</h2>}
        {status && <h3 className='status'>{status}</h3>}

        <Photo innerRef={innerRef} animation={animation} setAnimation={setAnimation}/>
    </div>
  )
}
