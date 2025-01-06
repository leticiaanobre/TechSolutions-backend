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
    const tasks = await Task.find();
    res.json(tasks);
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
      // Assuming you have a way to calculate hours spent on a task
      const hoursSpent = calculateHoursSpent(task); // Replace with your actual logic
      totalHours += hoursSpent;
    });
    res.json({ userId, totalHours });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateHoursSpent = (task) => {
  // Replace with your actual logic to calculate hours spent on a task
  // This is a placeholder
  return Math.random() * 8; // Returns a random number of hours between 0 and 8
};
