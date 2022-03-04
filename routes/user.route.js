import { Router } from "express"
import config from "config"
import bcrypt from 'bcryptjs'

import { v4 as uuidv4 } from 'uuid'

import { User } from '../models/user.model.js'

import { sendMail } from "../service/mail.service.js"
import { generateToken, tokenSaveDB } from "../service/token.service.js"
import { findUser, userSaveDB } from "../service/user.service.js"

export const routerUser = Router()

routerUser.post('/f', async (req, res) => {
    try {
        const usf = await User.find({email: 'alexsmith_proff@mail.ru'})
        console.log(usf)
        const {password} = usf[0]
        res.status(200).json(password)
    } catch (error) {
        console.log(error)
    }
    
    
})

routerUser.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body

        // Ищем в БД email в поле email
        const condidate = await findUser('email', email)
        
        // Проверка на существование пользователя
        if (condidate) {
            return res.status(400).json({
                message: 'Такой пользователь существует'
            })
        }

        // Генерируем activationLink
        const activationLink = uuidv4()

        //Отправляем письмо на почту для активациии
        await sendMail(email, activationLink)        

        // Хешируем password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Запись user в БД
        const user = await userSaveDB( {...req.body, password:hashedPassword}, activationLink )

        // Генерируем accessToken
        const accessToken = generateToken(user.id, config.get('JWT_ACCESS_SECRET'), '30m')

        // Генерируем refreshToken
        const refreshToken = generateToken(user.id, config.get('JWT_REFRESH_SECRET'), '30d')
        
        // Записываем в БД refreshToken
        await tokenSaveDB(user.id, refreshToken)

        // refreshToken будем хранить в cookie
        // res.cookie('refreshToken', refreshToken, {
        //     // Время жизни 30д
        //     maxAge: 30 * 24 * 60 * 60 * 1000,
        //     // Cookie нельзя изменять
        //     httpOnly: true
        // })

        // Ответ клиенту
        res.status(201).json({
            email,
            accessToken,
            refreshToken
        })
    } catch (error) {
        res.status(500).json({
            message: 'Ошибка регистрации'
        })        
    }
})

routerUser.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body

        // Ищем зарегистрированного user в БД по email
        const user = await User.findOne({
            email: email
        })
        // Проверка на существование пользователя
        if (!user) {
            return res.status(400).json({
                message: 'Логин или пароль неверный'
            })
        }

        // Проверка совпадения пароля
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(500).json({
                message: 'Логин или пароль неверный Password'
            })
        }

        // авторизация через JWT Token
        const tokenJWT = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            // Срок действия tokenJWT - 1 час
            {expiresIn: '1h'}
        )

        // Ответ клиенту status по умолчанию 200
        res.json({
            userId: user.id,
            token: tokenJWT
        })




        

    } catch (error) {
        res.status(500).json({
            message: 'Ошибка регистрации'
        })        
    }
})

routerUser.get('/activate/:link', async (req, res) => {
    try {
        // console.log('link')
        const user = await User.findOne({
            activationLink: req.params.link
        }) 
        if(!user) {
            return res.status(400).json({
                message: 'Некорректная ссылка активации'
            })
        } 
        user.isActivated = true
        await user.save()  
        return res.redirect(config.get('CLIENT_URL'))    
    } catch (error) {
        res.status(400).json({
            message: 'Ошибка активации'
        })                
    }
    
})