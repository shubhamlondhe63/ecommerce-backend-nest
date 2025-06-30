import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory, PaymentMethod } from '../schemas/expense.schema';

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

  @ApiProperty({ example: 150.5, description: 'Amount of the expense' })
  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiProperty({
    enum: ExpenseCategory,
    example: ExpenseCategory.FOOD,
    description: 'Category of the expense',
  })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
    description: 'Payment method used',
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    example: '2024-01-15',
    description: 'Date of the expense (YYYY-MM-DD format)',
  })
  @IsDateString()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @ApiProperty({
    example: ['grocery', 'weekly'],
    description: 'Tags for the expense',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    example: false,
    description: 'Whether this is a recurring expense',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isRecurring?: boolean;

  @ApiProperty({
    example: 'monthly',
    description: 'Frequency of recurring expense',
    required: false,
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
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}
