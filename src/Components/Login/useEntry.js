export const useEntry = async (userAccess, setAccess, loginStatus) => {
    if (!userAccess) {
        const vkAuth = () => new Promise(resolve => setTimeout(() => VK.Auth.login(resolve, 2 + 4 + 64 + 1024), 300))
        const accessReceived = (message) => {
            console.log(message)
            setAccess(true)
        }

        const { session } = await loginStatus()
        if (!session) {
            console.log('Авторизация...')
            const { session } = await vkAuth()
            if (session) {
                accessReceived('Пользователь вошел')
            }
            else {
                console.log(`Пользователь НЕ вошел (${session})`)
                return
            }
        }
        else {
            accessReceived('Пользователь уже совершил вход')
        }
    }
}