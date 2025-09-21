import { Router } from 'express';
import assetsRout from '../../controllers/assets';
import isAuth from '../../middleware/isAuth';

const assets = Router()
// assets.use(isAuth)
assets.get('/', assetsRout.get)


export default assets