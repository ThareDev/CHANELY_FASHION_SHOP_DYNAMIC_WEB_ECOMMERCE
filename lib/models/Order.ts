import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema({
  customerName:  { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  address: {
    line1:    { type: String, required: true },
    line2:    { type: String },
    city:     { type: String, required: true },
    province: { type: String, required: true },
    postal:   { type: String, required: true },
  },
  items: [{
    id: String, name: String, size: String,
    quantity: Number, price: Number, image: String,
  }],
  total:  { type: Number, required: true },
  note:   { type: String },
  status: { type: String, default: "pending" },
}, { timestamps: true });

export const Order = models.Order ?? model("Order", OrderSchema);