import { getAge } from './getAge.js'
// Получить список друзей (count штук, начиная с offset)

export async function* nextFriendsBatch(user_id) {
    let [offset, count, maxFriends] = [0, 200]
    const getUserFriends = () => new Promise(resolve => VK.Api.call('friends.get', {
        user_id, count, offset, v: 5.89, fields: 'bdate, sex, city, photo_200, screen_name'
    }, resolve))
    do {
        const { response: { items, count: countFriends } } = await getUserFriends(offset)
        const friendsBatch = items.map(({
            can_access_closed: access, id, sex, city: { title: home = '' } = '', first_name, last_name, photo_200, bdate = '',
            deactivated = '', screen_name}) => ({
                id, sex: `${sex}`, home, photo_200, age: getAge(bdate), fullname: `${first_name} ${last_name}`,
                access: access && !deactivated, screen_name, link: `https://vk.com/${screen_name}`
            }))
  
        maxFriends = countFriends
        offset += count
  
        yield friendsBatch
    } while (offset < maxFriends)
  }