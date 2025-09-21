import {  Router } from 'express';
import notifications from '../../controllers/notifications'
import isAuth from '../../middleware/isAuth';

const notification = Router()
notification.use(isAuth)
notification.get('/', notifications.all)

export default notification;