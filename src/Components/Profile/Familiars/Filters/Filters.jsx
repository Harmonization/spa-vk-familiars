import React from 'react'
import Input from './Input'

export default function Filters( { filters, setFilters }) {
    const handleFilter = ({ target: { value } }, filterName) => {
        setFilters(filters => ({ ...filters, [filterName]: value }))
    }
    return (
        <div className="filters">
            <Input value={'fullname'} placeholder={'Имя'} filters={filters} setFilters={setFilters} handleFilter={handleFilter}/>
            <Input value={'home'} placeholder={'Город'} filters={filters} setFilters={setFilters} handleFilter={handleFilter}/>
            <select name="" onChange={(e) => { handleFilter(e, 'sex') }} value={filters.sex}>
                <option value=''>Любой пол</option>
                <option value='1'>Женский</option>
                <option value='2'>Мужской</option>
            </select>

            <Input value={'minAge'} placeholder={'Возраст от'} filters={filters} setFilters={setFilters} type="number" handleFilter={handleFilter}/>
            <Input value={'maxAge'} placeholder={'Возраст до'} filters={filters} setFilters={setFilters} type="number" handleFilter={handleFilter}/>
        </div>
    )
}
