import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({
    example: 'Grocery Shopping',
    description: 'Title of the expense',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Bought groceries for the week',
    description: 'Description of the expense',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 150.5,
    description: 'Amount of the expense',
    type: Number,
  })
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
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
    example: 'food',
    description: 'Category of the expense',
  })
  @IsEnum([
    'food',
    'transport',
    'entertainment',
    'shopping',
    'bills',
    'health',
    'education',
    'travel',
    'other',
  ])
  category: string;

  @ApiProperty({
    enum: [
      'cash',
      'credit_card',
      'debit_card',
      'bank_transfer',
      'upi',
      'wallet',
      'other',
    ],
    example: 'credit_card',
    description: 'Payment method used',
  })
  @IsEnum([
    'cash',
    'credit_card',
    'debit_card',
    'bank_transfer',
    'upi',
    'wallet',
    'other',
  ])
  paymentMethod: string;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date of the expense (YYYY-MM-DD format)',
    type: String,
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: ['grocery', 'weekly'],
    description: 'Tags for the expense',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: false,
    description: 'Whether this is a recurring expense',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return value;
  })
  isRecurring?: boolean;

  @ApiProperty({
    example: 'monthly',
    description: 'Frequency of recurring expense',
    required: false,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
  })
  @IsOptional()
  @IsString()
  recurringFrequency?: string;

  @ApiProperty({
    example: 'Walmart',
    description: 'Location where expense occurred',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: ['receipt.jpg'],
    description: 'File attachments',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
