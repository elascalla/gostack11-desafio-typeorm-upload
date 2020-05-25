import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import Transaction from '../models/Transaction';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions: Transaction[] = await transactionRepository.find({
    relations: ['category'],
  });

  if (transactions) {
    transactions.map(transaction => delete transaction.category_id);
  }

  const balance = await transactionRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id });

  response.status(204).send();
});

transactionsRouter.post('/import', async (request, response) => {
  const importTransactions = new ImportTransactionsService();

  const importFilePath = path.resolve(
    __dirname,
    '..',
    '__tests__',
    'import_template.csv',
  );

  const transactions = await importTransactions.execute({
    importFilePath,
  });

  response.status(200).json(transactions);
});

export default transactionsRouter;
