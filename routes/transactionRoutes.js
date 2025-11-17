const express = require('express');
const router = express.Router();
const { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize('admin'), getAllTransactions);
router.get('/:id', authenticate, authorize('admin'), getTransactionById);
router.post('/', authenticate, createTransaction);
router.put('/:id', authenticate, authorize('admin'), updateTransaction);
router.delete('/:id', authenticate, authorize('admin'), deleteTransaction);

module.exports = router;

