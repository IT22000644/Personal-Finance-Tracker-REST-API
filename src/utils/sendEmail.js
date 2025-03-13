import nodemailer from 'nodemailer'
import logger from './logger.js'
import { EMAIL_PASS, EMAIL_USER } from '../config/index.js'

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
})

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: EMAIL_USER,
            to,
            subject,
            text,
        }

        await transporter.sendMail(mailOptions)
        logger.info(`Email sent to ${to}`)
    } catch (error) {
        logger.error(`Error sending email to ${to}:`, error)
    }
}

export default sendEmail
