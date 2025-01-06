import Task from '../models/Task.js';

export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assigned tasks' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task status' });
  }
};
