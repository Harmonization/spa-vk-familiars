import { nextFriendsBatch } from './nextFriendsBatch.js'
// Получить список друзей, а после знакомых (друзей-друзей)

export async function* nextFamiliarsBatch(user_id) {
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