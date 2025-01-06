import User from '../models/User.js';
import Task from '../models/Task.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { userId, taskId } = req.body;
    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).json({ message: 'User or task not found' });
    }

    // Atualiza a tarefa com o ID do desenvolvedor
    task.assignedTo = userId;
    task.status = 'in_progress';
    await task.save();

    res.json({ message: 'Task assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const rejectTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = 'rejected';
    await task.save();

    res.json({ message: 'Task rejected successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
