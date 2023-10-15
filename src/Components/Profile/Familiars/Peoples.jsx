import { Link } from 'react-router-dom'

export default function Peoples({ people, text }) {
    return (
        <>
            {people.map((element, index) => {
                const { photo_200, screen_name, fullname, age } = element
                return (
                    <div 
                        className={`people-item ${text}`} 
                        peoplename={`${fullname} ${age} (${text})`} 
                        key={`${text}${index}`}>
                        <Link to={`../spa-vk-familiars/${screen_name}`}>
                            <img src={photo_200} alt={index} peoplename={`${fullname} ${age} (${text})`}/>
                        </Link>
                    </div>
                )
            })}
        </>
    )
}