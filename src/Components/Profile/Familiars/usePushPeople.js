import { useEffect } from 'react'
// Монтирование новых знакомых после скролла

export default function usePushPeople(loading, people, pushPeople) {
    const nextPeople = async () => {
        const { value: { type, familiarsBatch } } = await people.generator.next()
        pushPeople(people => ({ ...people, [type]: [...people[type], ...familiarsBatch] }))
    }
    useEffect(() => {
        if (loading) {
            nextPeople()
        }
    }, [loading])
}