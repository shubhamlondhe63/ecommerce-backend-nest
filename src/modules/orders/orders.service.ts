import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: any): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(query: any = {}): Promise<Order[]> {
    return this.orderModel
      .find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('user', 'name email')
      .populate('items.product')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async getTotalOrders(): Promise<number> {
    return this.orderModel.countDocuments().exec();
  }

  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    return this.orderModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .populate('items.product')
      .exec();
  }
}
