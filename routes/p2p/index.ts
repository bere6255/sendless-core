import { Router } from 'express';
import p2pRout from '../../controllers/p2p';
import isAuth from '../../middleware/isAuth';
import verifyPin from '../../middleware/verifyPin';

const p2p = Router()
p2p.use(isAuth)
p2p.post('/', verifyPin, p2pRout.send)
p2p.post('/name-enquiry', p2pRout.nameEnquiry)


export default p2p