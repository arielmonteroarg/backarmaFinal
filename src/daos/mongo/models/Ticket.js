import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // ID único
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  quantity: { type: Number, required: true }, // cantidad total de productos
  purchaser: { type: String, required: true } // Email
});

export default mongoose.model('Ticket', ticketSchema);