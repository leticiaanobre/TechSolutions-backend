import User from '../models/User.js';
import Task from '../models/Task.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    const user = await User.findByPk(userId);
    const task = await Task.findByPk(taskId);

    if (!user || !task) {
      return res.status(404).json({ message: 'User or task not found' });
    }

    await user.addTask(task);
    res.json({ message: 'Task assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const rejectTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.update({ status: 'rejected' });
    res.json({ message: 'Task rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
