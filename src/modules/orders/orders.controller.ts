import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  create(@Request() req, @Body() createOrderDto: any) {
    return this.ordersService.create({
      ...createOrderDto,
      user: req.user.userId,
    });
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  findAll(@Query() query: any) {
    return this.ordersService.findAll(query);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Get current user orders' })
  findMyOrders(@Request() req) {
    return this.ordersService.findAll({ user: req.user.userId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by id' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }
}
