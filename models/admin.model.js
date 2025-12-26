// models/Admin.js
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['admin', 'account', 'incharge'],
  },
  // role: [{
  //   type: String
  // }],
}, { timestamps: true });

export default mongoose.model('Admin', AdminSchema);