import { Router } from 'express';
import auth from './auth'
import users from './users'
import pin from './pin'
import webhooks from './webhooks'
import profile from './profile'
import notification from './notifications';
import walletCoreRoute from './wallet@core';
import p2p from './p2p';
import assets from './assets';
import transactions from './transactions';


const routes = Router()
routes.use('/auth/', auth)
routes.use('/user/', users)
routes.use('/pin/', pin)
routes.use('/notification/', notification)
routes.use('/profile/', profile)
routes.use('/assets/', assets)
routes.use('/p2p/', p2p)
routes.use('/transactions/', transactions)
routes.use('/webhooks/', webhooks)

// wallet core service


routes.use('/core/', walletCoreRoute)

routes.get('/', (req, res) => {
  res.status(200).send({ status: true, data: {}, message: "Welcome to Tencoin! We’re excited to have you onboard.  🚀🚀🛰🛰" });
})

export default routes