// Получить возраст пользователя

export const getAge = bDate => {
    const array = bDate.split('.')
    if (array.slice(-1)[0].length < 4) { return ''}
    const date = new Date(array.reverse().join('-'))
    const curDate = new Date()
    const diff = new Date(curDate - date.getTime())
    const years = `${Math.abs(diff.getUTCFullYear() - 1970)}`
    const lastNumber = +years.slice(-1)[0]
    return years + (lastNumber === 1 ? ' год' : [2, 3, 4].includes(lastNumber) ? ' года' : ' лет')
  }