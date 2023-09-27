import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import {Input, User} from './Input.jsx'

const getAge = bDate => {
  const array = bDate.split('.')
  if (array.slice(-1)[0].length < 4) { return ''}
  const date = new Date(array.reverse().join('-'))
  const curDate = new Date()
  const diff = new Date(curDate - date.getTime())
  const years = `${Math.abs(diff.getUTCFullYear() - 1970)}`
  const lastNumber = +years.slice(-1)[0]
  return years + (lastNumber === 1 ? ' год' : [2, 3, 4].includes(lastNumber) ? ' года' : ' лет')
}

const getUser = async (user_ids) => {
  const getUserInfo = () => new Promise(resolve => VK.Api.call('users.get', {user_ids, v: 5.89,
      fields: 'bdate, status, screen_name, city, home_town, sex, photo_max, can_access_closed'}, resolve))

  const { response: [{ can_access_closed: access, id, screen_name = '', sex, bdate = '', first_name, last_name,
      photo_max, home_town = '', city: { title: home = '' } = '', status = '' }] } = await getUserInfo()

  return {
      id, sex: `${sex}`, age: getAge(bdate), status, access, photo_max, screen_name, fullname: `${first_name} ${last_name}`, 
      link: `https://vk.com/${screen_name}`, city: home || home_town
  }
}

async function* nextPhotoBatch(owner_id) {
  // Получить набор фото пользователя (count штук, начиная с offset) максимального разрешения
  let [offset, count, maxPhotos] = [0, 20]
  const getUserPhotos = () => new Promise(resolve => VK.Api.call('photos.getAll', {
      owner_id, count, offset, v: 5.89
  }, resolve))

  do {
      const { response: { items, count: countPhotos } } = await getUserPhotos()
      const photoMax = items.map(({ sizes }) =>
          sizes.reduce(({ prevH, prevW, prevUrl }, { height, width, url }) =>
              prevH + prevW > height + width ? { prevH, prevW, prevUrl } : { prevH: height, prevW: width, prevUrl: url }
          ).prevUrl)

      // const photo604 = items.map(({sizes}) => sizes.filter(({type}) => type == 'x')[0].url)
      maxPhotos = countPhotos
      offset += count

      yield {photoMax, end: offset >= maxPhotos}
  } while (offset < maxPhotos)
}

async function* nextFriendsBatch(user_id) {
  // Получить список друзей (count штук, начиная с offset)
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

async function* nextFamiliarsBatch(user_id) {
  // Получить список друзей, а после знакомых (друзей-друзей)
  let peopleArray = [{ access: true, id: user_id }] // Сначала получить друзей теущего пользователя
  for (let { access, id } of peopleArray) {
      if (access) {
          const genFamiliars = nextFriendsBatch(id)
          const type = id === user_id ? 'friends' : 'familiars'
          let i = 0
          for await (let familiarsBatch of genFamiliars) {
              if (type === 'friends') { // Список друзей исходного юзера добавляется в цикл
                  peopleArray.push(...familiarsBatch)
              } else { // Друзья друга
                  i++
                  if (i > 3) { break } // если у друга более 600 друзей, то остальных не смотрим
              }
              yield {type, familiarsBatch}
          }
      }

  }
}

const getUserFullInfo = async ({params: {id: user_ids}}) => {
  // Получить основную информацию о пользователе, фото и друзей
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Input/>,
  },
  {
    path: '/:id',
    element: <User/>,
    loader: getUserFullInfo
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)