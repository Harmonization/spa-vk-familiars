import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLoaderData, useLocation, useParams } from 'react-router-dom'
import { ScrollContainer } from 'react-indiana-drag-scroll';
import 'react-indiana-drag-scroll/dist/style.css'
import './style.css'


const Image = ({ imgMax }) => {
    const [img, setImg] = useState(null)

    useEffect(() => { setImg(imgMax) }, [imgMax])

    return (
        <img src={img} />
    )
}

const Photo = ({ innerRef, setAnimation }) => {

    const { photos } = useLoaderData()
    const [photo, pushPhoto] = useState(photos)
    const [loading, setLoading] = useState(false)

    const nextPhoto = async () => {
        if (photo.end) {return}
        const { value: { photoMax: batchMax, end } } = await photo.generator.next()
        pushPhoto(({ generator, photoMax }) => ({
            generator, photoMax: [...photoMax, ...batchMax], end
        }))
    }

    useEffect(() => { pushPhoto(photos) }, [photos])

    useEffect(() => {
        const scrollContainer = document.querySelector('.photo')
        scrollContainer.addEventListener('scroll', scrollHandler)
        return () => {scrollContainer.removeEventListener('scroll', scrollHandler)}
    }, [])

    const scrollHandler = ({target: {scrollLeft, scrollWidth}}) => {
        const val = Math.abs(scrollWidth - (scrollLeft + window.innerWidth))
        if (300 < val & val < 600) {
            setLoading(false)
        }

        else if (val < 200 & !loading) {
            setLoading(true)
        }
    }

    useEffect(() => {
        if (loading) {
            nextPhoto()
        }
    }, [loading])

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

const Peoples = ({ people, text }) => {
    return (
        <>
            {people.map((element, index) => {
                const { photo_200, screen_name, fullname, age } = element
                return (
                    <div className={`people-item ${text}`} peoplename={`${fullname} ${age} (${text})`} key={`${text}${index}`}>
                        <Link to={`../spa-vk-familiars/${screen_name}`}>
                            <img src={photo_200} alt={index} />
                        </Link>
                    </div>
                )
            })}
        </>
    )
}

const Filters = () => {
    const emptyFilters = { access: true, fullname: '', home: '', sex: '', minAge: '', maxAge: '' }
    const [filters, setFilters] = useState(emptyFilters)

    const { peoples } = useLoaderData()
    const [people, pushPeople] = useState(peoples)

    useEffect(() => { pushPeople(peoples) }, [peoples])

    const { friends, familiars, generator } = people

    const [filterFriends, setFilterFriends] = useState(friends)
    const [filterFamiliars, setFilterFamiliars] = useState(familiars)
    const [loading, setLoading] = useState(false)

    const handleFilter = ({ target: { value } }, filterName) => {
        setFilters(filters => ({ ...filters, [filterName]: value }))
    }

    const applyFilters = () => {
        let friendsArray = [...friends]
        let familiarsArray = [...familiars]
        let filterFunction = (k, v, element) => {
            const age = element['age'] ? element['age'].split(' ')[0] : false
            switch (k) {
                case 'minAge':
                    const minAge = v !== '' ? v : 0
                    return age ? minAge <= age : true
                case 'maxAge':
                    const maxAge = v !== '' ? v : 100
                    return age ? maxAge >= age : true
                default:
                    return `${element[k]}`.toLowerCase().indexOf(`${v}`.toLowerCase()) !== -1
            }
        }

        for (let [k, v] of Object.entries(filters)) {
            const curFilterFunction = filterFunction.bind(null, k, v)
            friendsArray = friendsArray.filter(curFilterFunction)
            familiarsArray = familiarsArray.filter(curFilterFunction)
        }

        setFilterFriends(friendsArray)
        setFilterFamiliars(familiarsArray)
    }

    useEffect(() => { applyFilters() }, [filters, friends, familiars])
    useEffect(() => { setFilters(emptyFilters) }, [generator])

    useEffect(() => {
        const scrollContainer = document.querySelector('.people-grid')
        scrollContainer.addEventListener('scroll', scrollHandler)
        return () => {scrollContainer.removeEventListener('scroll', scrollHandler)}
    }, [])

    const scrollHandler = ({target: {scrollHeight, scrollTop}}) => {
        const val = scrollHeight - (scrollTop + window.innerHeight)
        if (300 < val & val < 600) {
            setLoading(false)
        }

        else if (val < 200 & !loading) {
            setLoading(true)
        }
    }

    useEffect(() => {
        if (loading) {
            nextPeople()
        }
    }, [loading])

    const nextPeople = async () => {
        const { value: { type, familiarsBatch } } = await people.generator.next()
        pushPeople(people => ({ ...people, [type]: [...people[type], ...familiarsBatch] }))
    }

    return (

        <div className="familiars">
            <div className="filters">
                {/* <Input /> */}
                <input type="text" onChange={(e) => { handleFilter(e, 'fullname') }} value={filters.fullname} placeholder='Имя' />
                <input type="text" onChange={(e) => { handleFilter(e, 'home') }} value={filters.home} placeholder='Город' />
                <select name="" id="sex" onChange={(e) => { handleFilter(e, 'sex') }} value={filters.sex}>
                    <option value=''>Любой пол</option>
                    <option value='1'>Женский</option>
                    <option value='2'>Мужской</option>
                </select>
                {/* <label htmlFor="age">Возраст</label> */}
                <input id='age' type="number" onChange={(e) => { handleFilter(e, 'minAge') }} value={filters.minAge} placeholder='Возраст от' />
                <input type="number" onChange={(e) => { handleFilter(e, 'maxAge') }} value={filters.maxAge} placeholder='Возраст до' />
            </div>

            <ScrollContainer className="people-grid">
                <Peoples people={filterFriends} text={'Друзья'} />
                {filterFamiliars.length !== 0 && <Peoples people={filterFamiliars} text={'Знакомые'} />}
            </ScrollContainer>
        </div>

    )
}

const ScrollUp = () => {
    const { pathname } = useLocation()
    useEffect(() => { window.scrollTo(0, 0) }, [pathname])
    return null
}

export const User = () => {
    const { user } = useLoaderData()

    const [animation, setAnimation] = useState(0)
    const {id} = useParams()
    const ref = useRef(null)

    useEffect(() => {setAnimation(0); ref.current.scrollTo({ left: 0 })}, [id])

    const { fullname, age, status, link, city } = user
    return (
        <>
            <ScrollUp />
            {
                user !== null &&
                <div className="profile" animation={animation}>
                    <div className="card">
                        <h2 className="fullname">
                            <a href={link} target='_blank'>
                                {age ? `${fullname}, ${age}` : fullname}
                            </a>
                        </h2>
                        <h2 className="city">{city}</h2>
                        {status && <h3 className='status'>{status}</h3>}

                        <Photo innerRef={ref} setAnimation={setAnimation}/>
                    </div>

                    <Filters />
                </div>
            }
        </>
    )
}

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