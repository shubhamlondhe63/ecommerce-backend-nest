import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop([
    {
      product: { type: MongooseSchema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ])
  items: Array<{
    product: string;
    quantity: number;
  }>;

  @Prop({ type: Number, default: 0 })
  totalAmount: number;
}

export type CartDocument = Cart & Document;
export const CartSchema = SchemaFactory.createForClass(Cart);
