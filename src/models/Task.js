import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model('Task', taskSchema);
