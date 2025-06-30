import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(
    userId: string,
    createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    const expense = new this.expenseModel({
      ...createExpenseDto,
      date: new Date(createExpenseDto.date),
      user: userId,
    });
    return expense.save();
  }

  async findAll(userId: string, query: any = {}): Promise<Expense[]> {
    const filter: any = { user: userId };

    // Handle date filtering
    if (query.startDate || query.endDate) {
      filter.date = {};
      if (query.startDate) {
        filter.date.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        filter.date.$lte = new Date(query.endDate);
      }
    }

    // Handle other filters
    if (query.category) {
      filter.category = query.category;
    }
    if (query.paymentMethod) {
      filter.paymentMethod = query.paymentMethod;
    }

    return this.expenseModel.find(filter).sort({ date: -1 }).exec();
  }

  async findOne(userId: string, id: string): Promise<Expense> {
    const expense = await this.expenseModel
      .findOne({ _id: id, user: userId })
      .exec();
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async update(
    userId: string,
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const updateData: any = { ...updateExpenseDto };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const expense = await this.expenseModel
      .findOneAndUpdate({ _id: id, user: userId }, updateData, {
        new: true,
      })
      .exec();
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await this.expenseModel
      .deleteOne({ _id: id, user: userId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }

  async getExpenseStats(userId: string, startDate?: Date, endDate?: Date) {
    const filter: any = { user: userId };

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await this.expenseModel.find(filter).exec();

    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const categoryStats = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const paymentMethodStats = expenses.reduce((acc, expense) => {
      acc[expense.paymentMethod] =
        (acc[expense.paymentMethod] || 0) + expense.amount;
      return acc;
    }, {});

    return {
      totalExpenses: expenses.length,
      totalAmount,
      categoryStats,
      paymentMethodStats,
      averageAmount: expenses.length > 0 ? totalAmount / expenses.length : 0,
    };
  }

  async getMonthlyStats(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.getExpenseStats(userId, startDate, endDate);
  }

  async getYearlyStats(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    return this.getExpenseStats(userId, startDate, endDate);
  }
}
