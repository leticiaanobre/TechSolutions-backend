import Task from '../models/Task.js';
import User from '../models/User.js';

export const createTask = async (req, res) => {
  try {
    const { name, description, userId, dueDate, status } = req.body;
    const newTask = new Task({ name, description, userId, dueDate, status });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTaskHistory = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { userId: req.user._id };
    
    // Se um status específico foi solicitado
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 }); // Ordena do mais recente para o mais antigo

    // Agrupa as tarefas por status
    const groupedTasks = {
      completed: tasks.filter(task => task.status === 'completed'),
      in_progress: tasks.filter(task => task.status === 'in_progress'),
      pending: tasks.filter(task => task.status === 'pending'),
      rejected: tasks.filter(task => task.status === 'rejected')
    };

    res.json(groupedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHourBank = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const tasks = await Task.find({ userId });
    let totalHours = 0;
    tasks.forEach(task => {
      const hoursSpent = calculateHoursSpent(task);
      totalHours += hoursSpent;
    });
    res.json({ userId, totalHours });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateHoursSpent = (task) => {
  return Math.random() * 8; // Placeholder
};
