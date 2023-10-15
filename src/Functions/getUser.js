import { getAge } from './getAge.js'
// Получить основную информацию о пользователе

export const getUser = async (user_ids) => {
    const getUserInfo = () => new Promise(resolve => VK.Api.call('users.get', {user_ids, v: 5.89,
        fields: 'bdate, status, screen_name, city, home_town, sex, photo_max, can_access_closed'}, resolve))
  
    const { response: [{ can_access_closed: access, id, screen_name = '', sex, bdate = '', first_name, last_name,
        photo_max, home_town = '', city: { title: home = '' } = '', status = '' }] } = await getUserInfo()
  
    return {
        id, status, access, photo_max, screen_name,
        sex: `${sex}`, 
        age: getAge(bdate), 
        city: home || home_town,
        fullname: `${first_name} ${last_name}`, 
        link: `https://vk.com/${screen_name}`
    }
  }