import nodemailer from 'nodemailer'
import config from "config"

export async function sendMail(to_email, activationLink) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: 'mail@mail.ru',
            pass: 'password'
        }
    })
    const info = await transporter.sendMail({
        from: 'Активация аккаунта<mail@mail.ru>',
        to: to_email,
        subject: 'Активация аккаунта',
        // text: 'Просто текст',
        html: 
        `
            <div>
                <h1>Для активации необходимо перейти по ссылке</h1>
                <a href="${config.get('SERVER_URL')}api/auth/activate/${activationLink}">${config.get('SERVER_URL')}api/auth/activate/${activationLink}</a>
            </div>
        `
    })
}
