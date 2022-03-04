import { User } from '../models/user.model.js'

// Поиск в БД email в поле email
export async function findUser(field, value) {
    const user = await User.findOne({
        [field]: value
    })
    return user
}



export async function userSaveDB(userData, link) {
    const user = new User({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        middlename: userData.middlename,
        surname: userData.surname,
        activationLink: link
    })
    // Записываем в БД, Создаем пользователя в БД
    await user.save()

    return user
}