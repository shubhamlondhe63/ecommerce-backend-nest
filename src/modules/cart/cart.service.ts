import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private productsService: ProductsService,
  ) {}

  async findOrCreate(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ user: userId }).exec();
    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
    }
    return cart;
  }

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.findOrCreate(userId);
    const product = await this.productsService.findOne(productId);

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await this.updateCartTotal(cart);
    return cart.save();
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.findOrCreate(userId);
    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    item.quantity = quantity;
    await this.updateCartTotal(cart);
    return cart.save();
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.findOrCreate(userId);
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    await this.updateCartTotal(cart);
    return cart.save();
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.findOrCreate(userId);
    cart.items = [];
    cart.totalAmount = 0;
    return cart.save();
  }

  private async updateCartTotal(cart: Cart): Promise<void> {
    let total = 0;
    for (const item of cart.items) {
      const product = await this.productsService.findOne(
        item.product.toString(),
      );
      total += product.price * item.quantity;
    }
    cart.totalAmount = total;
  }
}
