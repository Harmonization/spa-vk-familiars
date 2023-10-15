import React from 'react'

export default function Input({ value, filters, setFilters, handleFilter, ...props }) {
    

    return (
    <input 
        type="text" 
        onChange={(e) => { handleFilter(e, value ) }} 
        value={filters[value]} 
        {...props} />
    )
}
