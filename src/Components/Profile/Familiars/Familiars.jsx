import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ScrollContainer } from 'react-indiana-drag-scroll'

import Peoples from './Peoples'
import Filters from './Filters/Filters'

import useScrollPeople from './useScrollPeople'
import usePushPeople from './usePushPeople'
import useApplyFilters from './useApplyFilters'

export default function Familiars() {
    const emptyFilters = { access: true, fullname: '', home: '', sex: '', minAge: '', maxAge: '' }
    const [filters, setFilters] = useState(emptyFilters)

    const { peoples } = useLoaderData()
    const [people, pushPeople] = useState(peoples)

    useEffect(() => { pushPeople(peoples) }, [peoples])

    const { friends, familiars, generator } = people

    const [filterFriends, setFilterFriends] = useState(friends)
    const [filterFamiliars, setFilterFamiliars] = useState(familiars)
    const [loading, setLoading] = useState(false)

    useApplyFilters(filters, friends, setFilterFriends, familiars, setFilterFamiliars)
    useEffect(() => { setFilters(emptyFilters) }, [generator])
    useScrollPeople(loading, setLoading)
    usePushPeople(loading, people, pushPeople)

    return (
        <div className="familiars">
            <Filters filters={filters} setFilters={setFilters}/>
            <ScrollContainer className="people-grid">
                <Peoples people={filterFriends} text={'Друзья'} />
                {filterFamiliars.length !== 0 && <Peoples people={filterFamiliars} text={'Знакомые'} />}
            </ScrollContainer>
        </div>
    )
}