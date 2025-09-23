import {  Router } from 'express';
import webhooksRoute from '../../controllers/webhooks';
const webhooks = Router()
webhooks.post('/fincra', webhooksRoute.fincra)
webhooks.post('/sumsub', webhooksRoute.sumsub)
export default webhooks