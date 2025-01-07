import Task from '../models/Task.js';
import User from '../models/User.js';
import { translateToEnglish } from '../constants/translations.js';

export const createTask = async (req, res) => {
  try {
    const { 
      nome, 
      descricao, 
      prioridade,
      horasEstimadas,
      dataVencimento 
    } = req.body;

    // Traduz a prioridade se fornecida
    const priority = prioridade ? translateToEnglish('priority', prioridade) : 'medium';

    const newTask = new Task({ 
      name: nome,
      description: descricao,
      priority,
      estimatedHours: horasEstimadas,
      dueDate: dataVencimento,
      clientId: req.userId,
      status: 'pending'
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
  res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ clientId: req.userId })
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const getTaskHistory = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { clientId: req.userId };
    
    if (status) {
      query.status = translateToEnglish('status', status);
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task history' });
  }
};

export const getHourBank = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.hourBank) {
      return res.status(404).json({ message: 'Hour bank not found' });
    }

    // Busca todas as tarefas concluídas do cliente
    const completedTasks = await Task.find({
      clientId: req.userId,
      status: 'completed'
    });

    // Calcula o total de horas utilizadas
    const hoursUsed = completedTasks.reduce((total, task) => total + (task.actualHours || 0), 0);

    // Prepara a resposta
    const response = {
      plano: user.hourBank.plan,
      horasContratadas: user.hourBank.total,
      horasUtilizadas: hoursUsed,
      horasDisponiveis: user.hourBank.total - hoursUsed,
      tarefasConcluidas: completedTasks.length,
      detalhamentoHoras: completedTasks.map(task => ({
        tarefa: task.name,
        horasGastas: task.actualHours || 0,
        dataFinalizacao: task.completedAt
      }))
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching hour bank' });
  }
};
