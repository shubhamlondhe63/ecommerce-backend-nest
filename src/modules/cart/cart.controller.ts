import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@Request() req) {
    return this.cartService.findOrCreate(req.user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(
    @Request() req,
    @Body('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.addItem(req.user.userId, productId, quantity);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update item quantity in cart' })
  updateItemQuantity(
    @Request() req,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(
      req.user.userId,
      productId,
      quantity,
    );
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@Request() req, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.userId);
  }
}
