import {  Router } from 'express';
import authRout from '../../controllers/auth'
import isAuth from '../../middleware/isAuth';

const auth = Router()
auth.post('/login', authRout.login)
auth.get('/logout', isAuth, authRout.logout)
auth.get('/countries', authRout.countries)
auth.post('/register', authRout.register)
auth.post('/reset-password-token', authRout.restPasswordToken)
auth.post('/send-otp', authRout.sendOTP)
auth.post('/reset-password', authRout.postForgot)

export default auth