import { getUser } from './getUser.js'
import { nextPhotoBatch } from './nextPhotoBatch.js'
import { nextFamiliarsBatch } from './nextFamiliarsBatch.js'
// Получить основную информацию о пользователе, фото и друзей

export const getUserFullInfo = async ({params: {id: user_ids}}) => {
    const user = await getUser(user_ids)
    const info = {user}
    const { access, id } = user
    if (access) {
        const genPhoto = nextPhotoBatch(id)
        const genFamiliars = nextFamiliarsBatch(id)
        const [
          {value: {photoMax, end}}, 
          {value: {familiarsBatch}}
        ] = await Promise.all([genPhoto.next(), genFamiliars.next()])
  
        info.photos = {generator: genPhoto, photoMax: [user.photo_max, ...photoMax], end}
        info.peoples = {generator: genFamiliars, friends: familiarsBatch, familiars: []}
    }
    return info
  }