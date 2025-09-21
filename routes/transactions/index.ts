import { Router } from 'express';
import transactionRout from '../../controllers/transactions'
import isAuth from '../../middleware/isAuth';

const transactions = Router()
transactions.use(isAuth)
transactions.get('/', transactionRout.allTransaction)
transactions.get('/:reference', transactionRout.single)

export default transactions