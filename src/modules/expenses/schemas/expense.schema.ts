import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({
    type: String,
    enum: [
      'food',
      'transport',
      'entertainment',
      'shopping',
      'bills',
      'health',
      'education',
      'travel',
      'other',
    ],
    required: true,
  })
  category: string;

  @Prop({
    type: String,
    enum: [
      'cash',
      'credit_card',
      'debit_card',
      'bank_transfer',
      'upi',
      'wallet',
      'other',
    ],
    required: true,
  })
  paymentMethod: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Boolean, default: false })
  isRecurring: boolean;

  @Prop({
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: false,
  })
  recurringFrequency?: string;

  @Prop({ type: String })
  location?: string;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export type ExpenseDocument = Expense & Document;
export const ExpenseSchema = SchemaFactory.createForClass(Expense);
