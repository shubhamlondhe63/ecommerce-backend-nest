import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  create(@Request() req, @Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(req.user.userId, createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses for the current user' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'paymentMethod',
    required: false,
    description: 'Filter by payment method',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by end date',
  })
  findAll(@Request() req, @Query() query: any) {
    return this.expensesService.findAll(req.user.userId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get expense statistics' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date for stats',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date for stats',
  })
  getStats(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.expensesService.getExpenseStats(req.user.userId, start, end);
  }

  @Get('stats/monthly/:year/:month')
  @ApiOperation({ summary: 'Get monthly expense statistics' })
  getMonthlyStats(
    @Request() req,
    @Param('year') year: string,
    @Param('month') month: string,
  ) {
    return this.expensesService.getMonthlyStats(
      req.user.userId,
      parseInt(year),
      parseInt(month),
    );
  }

  @Get('stats/yearly/:year')
  @ApiOperation({ summary: 'Get yearly expense statistics' })
  getYearlyStats(@Request() req, @Param('year') year: string) {
    return this.expensesService.getYearlyStats(req.user.userId, parseInt(year));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific expense by ID' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.expensesService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(req.user.userId, id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  remove(@Request() req, @Param('id') id: string) {
    return this.expensesService.remove(req.user.userId, id);
  }
}
