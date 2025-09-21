import {  Router } from 'express';
import pinRout from '../../controllers/pin'
import isAuth from '../../middleware/isAuth';

const pin = Router()
pin.use(isAuth)
pin.post('/set-pin', pinRout.setPin)
pin.post('/update', pinRout.updatePin)
pin.get('/get-token', pinRout.sendPinOTPP)

export default pin