import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from './Category';
import ColumnNumericTransformer from '../utils/ColumnNumericTransformer';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('decimal', {
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  value: number;

  @Column()
  type: 'income' | 'outcome';

  @Column()
  category_id: string;

  @ManyToOne(() => Category, { cascade: ['insert'] })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}

export default Transaction;
