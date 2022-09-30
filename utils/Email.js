import nodemailer from 'nodemailer'
import path from 'path'
import hbs from 'nodemailer-express-handlebars';

const sendEmail = async values =>{
    
    const transporter= nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    });

    const handlebarOptions= {
        viewEngine: {
            extName: ".handlebars",
            partialsDir: path.resolve('./utils/email_templates'),
            defaultLayout: false
        },
        viewPath: path.resolve('./utils/email_templates'),
        extName: ".handlebars"
    }

    transporter.use('compile', hbs(handlebarOptions))

    const mailOptions= {
        from: `Some User`,
        to: values.email,
        subject: values.subject,
        template:'forgotPassword',
        context:{
            mainText:values.body
        }
    };

    await transporter.sendMail(mailOptions)
}

export default sendEmail;