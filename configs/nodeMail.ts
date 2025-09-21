require("dotenv").config();
import nodemailer from "nodemailer";
const EMAIL_HOST = process.env.EMAIL_HOST || '1234';
const EMAIL_USER = process.env.EMAIL_USER || '1234';
const EMAIL_PASS = process.env.EMAIL_PASS || '1234';
const EMAIL_FROM = process.env.EMAIL_FROM;
type email = {
	to: string
	subject: string
	message: string
}
export default async ({to, subject, message}: email) => {
	try {
		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			host: EMAIL_HOST,
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: EMAIL_USER, // generated ethereal user
				pass: EMAIL_PASS, // generated ethereal password
			},
		});
		console.log("Message sent: %s To", to, subject);
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: EMAIL_FROM, // sender address
			to, // list of receivers
			subject, // Subject line
			html: message, // html body
		});

		console.log("Message sent: %s", info);

		return true

	} catch (error: any) {
		console.log(error);
		
		console.log("email sending error ===> ", error.message, error.stack);
		return false
	}
}