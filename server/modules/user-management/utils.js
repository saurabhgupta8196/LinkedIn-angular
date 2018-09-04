const crypto = require('crypto')
const sgMail = require('@sendgrid/mail')

class Utils {
    constructor() {
        this._secret = '4a66f657d19b6a1d02df9ca6436091e94a3002e6bfd7a991e20c48220f8112c6'
        this.BASE_URL = process.env.BASE_URL
        sgMail.setApiKey(process.env.SG_API_KEY)
    }
    
    encrypt(data) {
       let hash = crypto.createHmac('sha256', this._secret)
                    .update(data).digest('hex')
        return hash
    }

    encryptPassword(password) {
        return this.encrypt(password)
    }

    generateVerificationCode() {
        let date = new Date()
        return this.encrypt(date.toString())
    }

    generateVerificationLink(userName, verificationCode, isCompany) {
        if(isCompany)
            return this.BASE_URL + `/rest-api/orgs/activate/${userName}/${verificationCode}`
        return this.BASE_URL + `/rest-api/users/activate/${userName}/${verificationCode}`
    }

    sendVerificationLink(userName, email, verificationCode, isCompany) {
        verificationLink = this.generateVerificationLink(userName, verificationCode, isCompany)
        let subject = 'Activate Your Account'
        let to = email
        let from = 'support@capmesh.com'
        let text = 'Activate your Account'
        let html = `Click the link <a href='${verificationLink}>${verificationLink}</a> to activate your account`
        
        this.sendMail(to, from, subject, text, html)
    }

    sendMail(to, from, subject, text, html) {
        let msg = {
            to: to,
            from: from,
            subject: subject,
            text: text,
            html: html
        }
        sgMail.send(msg)
    }
}

module.exports = Utils