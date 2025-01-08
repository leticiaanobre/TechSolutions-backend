import Task from '../models/Task.js';
import { translateToEnglish, translateToPortuguese } from '../constants/translations.js';

export const createTask = async (req, res) => {
  try {
    const {
      nome,
      descricao,
      prioridade,
      horasEstimadas,
      dataVencimento,
      atribuirDesenvolvedor
    } = req.body;

    const priority = translateToEnglish('priority', prioridade);

    const task = new Task({
      name: nome,
      description: descricao,
      priority,
      estimatedHours: horasEstimadas,
      dueDate: dataVencimento,
      clientId: req.user.id,
      assignedTo: atribuirDesenvolvedor
    });

    await task.save();

    // Traduz os campos de volta para português antes de enviar a resposta
    const response = {
      id: task._id,
      nome: task.name,
      descricao: task.description,
      prioridade: translateToPortuguese('priority', task.priority),
      status: translateToPortuguese('status', task.status),
      horasEstimadas: task.estimatedHours,
      dataVencimento: task.dueDate,
      dataCriacao: task.createdAt,
      desenvolvedorAtribuido: task.assignedTo
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao criar tarefa' });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ clientId: req.user.id });

    // Traduz os campos para português
    const response = tasks.map(task => ({
      id: task._id,
      nome: task.name,
      descricao: task.description,
      prioridade: translateToPortuguese('priority', task.priority),
      status: translateToPortuguese('status', task.status),
      horasEstimadas: task.estimatedHours,
      horasReais: task.actualHours,
      dataVencimento: task.dueDate,
      dataCriacao: task.createdAt,
      desenvolvedorAtribuido: task.assignedTo
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: novoStatus } = req.body;

    // Traduz o status do português para inglês
    const status = translateToEnglish('status', novoStatus);

    const task = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ mensagem: 'Tarefa não encontrada' });
    }

    // Traduz os campos para português na resposta
    const response = {
      id: task._id,
      nome: task.name,
      status: translateToPortuguese('status', task.status),
      mensagem: 'Status atualizado com sucesso'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao atualizar status da tarefa' });
  }
};
