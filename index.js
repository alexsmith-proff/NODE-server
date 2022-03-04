import config from 'config'
import cookieParser from 'cookie-parser'
import express from "express"
import mongoose from 'mongoose'
import { routerUser } from './routes/user.route.js'

const PORT = 3000
// const DB_URL = 'mongodb+srv://mydb:d07m03y1984@cluster0.08z8f.mongodb.net/todos'
const DB_URL = 'mongodb://localhost/mydb'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', routerUser)


async function startApp() {
    try {
        await mongoose.connect(config.get('DB_URL'))
        console.log('База данных подключена')
        app.listen(config.get('PORT'), () => console.log(`Сервер запущен на PORT = ${config.get('PORT')}`))
    } catch (e) {
        console.log(e)
    }
}

startApp()
