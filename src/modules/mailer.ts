import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'

import { host, port, user, pass } from '@config/mail.json'

const transport = nodemailer.createTransport({
    host: host,
    port: port,
    auth: { user, pass }
})

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: false
    },
    viewPath: path.resolve('./src/resources/mail'),
    extName: '.html'
}))
export default transport