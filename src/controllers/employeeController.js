import Task from '../models/Task.js';
import { translateToEnglish } from '../constants/translations.js';

export const getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ 
      assignedTo: req.userId,
      status: { $in: ['in_progress', 'pending'] }  // Apenas tarefas ativas
    })
    .populate('clientId', 'name email')
    .sort({ dueDate: 1 }); // Ordena por data de vencimento

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar tarefas atribuídas' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status, horasGastas } = req.body;

    // Traduz o status se fornecido em português
    const englishStatus = translateToEnglish('status', status);

    // Verifica se a tarefa existe e pertence ao desenvolvedor
    const task = await Task.findOne({ 
      _id: taskId,
      assignedTo: req.userId
    });

    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não atribuída a você' });
    }

    // Atualiza o status e outras informações relevantes
    task.status = englishStatus;
    
    if (englishStatus === 'completed') {
      task.completedAt = new Date();
      task.actualHours = horasGastas;
    }

    await task.save();

    res.json({
      message: 'Status da tarefa atualizado com sucesso',
      task: {
        id: task._id,
        name: task.name,
        status: task.status,
        completedAt: task.completedAt,
        actualHours: task.actualHours
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar status da tarefa' });
  }
};
