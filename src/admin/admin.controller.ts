import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../modules/products/products.service';
import { OrdersService } from '../modules/orders/orders.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  // User Management
  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (Admin only)' })
  updateUserStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean,
  ) {
    return this.usersService.updateStatus(id, isActive);
  }

  // Product Management
  @Post('products')
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  createProduct(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  updateProduct(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // Order Management
  @Get('orders')
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  getAllOrders(@Query() query: any) {
    return this.ordersService.findAll(query);
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  // Dashboard Statistics
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics (Admin only)' })
  getDashboardStats() {
    return {
      totalUsers: this.usersService.getTotalUsers(),
      totalOrders: this.ordersService.getTotalOrders(),
      totalProducts: this.productsService.getTotalProducts(),
      recentOrders: this.ordersService.getRecentOrders(),
      // Add more statistics as needed
    };
  }
}
