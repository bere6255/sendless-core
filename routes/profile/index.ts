import { Router } from 'express';
import profileRout from '../../controllers/profile';
import isAuth from '../../middleware/isAuth';

const profile = Router()
profile.use(isAuth)
profile.get('/', profileRout.getUser)
profile.post('/update', profileRout.update)
profile.post('/verify', profileRout.verify)
profile.post('/add-phone', profileRout.addPhone)
profile.get('/sumsub', profileRout.sumsub)
profile.post('/address', profileRout.address)
profile.post('/update-avater', profileRout.avatar_base_64)
profile.post('/change-password', profileRout.changePassword)

export default profile