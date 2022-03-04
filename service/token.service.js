import jwt from 'jsonwebtoken'
import { Token } from "../models/token.model.js"

// Генерация Token
export function generateToken(id, secret, expiresIn) {
    const token = jwt.sign(
        {
            userId: id
        },
        secret,
        {
            expiresIn: expiresIn
        }
    )
    return token
}

// Записываем в БД Token
export async function tokenSaveDB(id, JWTtoken) {
    const token = new Token({
        user: id,
        refreshToken: JWTtoken
    })
    await token.save()
}