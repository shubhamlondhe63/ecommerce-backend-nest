import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../modules/products/products.module';
import { OrdersModule } from '../modules/orders/orders.module';

@Module({
  imports: [UsersModule, ProductsModule, OrdersModule],
  controllers: [AdminController],
})
export class AdminModule {}
