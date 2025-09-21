import {  Router } from 'express';
import userRout from '../../controllers/users'
import isAuth from '../../middleware/isAuth';
import verifyPin from '../../middleware/verifyPin';

const user = Router()
user.use(isAuth)
user.post('/verify-email-phone', userRout.verify)
user.post('/create-tag', userRout.createTag)
user.get('/check-tag/:tag', userRout.checkTag)
user.get('/referrals', userRout.referrals)
user.post('/delete-account', verifyPin, userRout.deleteAccount)

export default user