import { useEffect } from "react"
// Применить фильтры к знакомым

export default function useApplyFilters(filters, friends, setFilterFriends, familiars, setFilterFamiliars) {
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
}