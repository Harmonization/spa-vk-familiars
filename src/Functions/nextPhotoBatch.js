// Получить набор фото пользователя (count штук, начиная с offset) максимального разрешения
export async function* nextPhotoBatch(owner_id) {
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