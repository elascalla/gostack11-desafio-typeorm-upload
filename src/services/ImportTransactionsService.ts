import csv from 'csvtojson';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  importFilePath: string;
}

interface RequestTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ importFilePath }: Request): Promise<Transaction[]> {
    const transactionsCSV: RequestTransaction[] = await csv().fromFile(
      importFilePath,
    );

    const createTransactions = new CreateTransactionService();

    const resultTransactions: Transaction[] = [];

    for (const transaction of transactionsCSV) {
      const transactionCreated = await createTransactions.execute({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: transaction.category,
      });

      resultTransactions.push(transactionCreated);
    }

    return resultTransactions;
  }
}

export default ImportTransactionsService;
