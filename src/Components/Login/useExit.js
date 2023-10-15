export const useExit = async (setAccess, loginStatus, setId) => {
    const vkExit = () => new Promise(resolve => setTimeout(() => VK.Auth.logout(resolve), 300))
    const { session } = await loginStatus()
    if (session) {
        const { session } = await vkExit()

        if (!session) {
            console.log('Пользователь вышел')
            setAccess(false)
            // navigate('../')
            setId('')
        }
    }
}