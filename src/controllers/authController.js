import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { translateToEnglish } from '../constants/translations.js';

export const register = async (req, res) => {
  try {
    const { 
      // Campos em inglês (prioritários)
      name,
      email,
      password,
      role,
      hourBank,
      skills,
      // Campos alternativos em português
      nome,
      senha,
      cargo,
      bancoHoras,
      habilidades
    } = req.body;

    // Verifica usuário existente
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Processa banco de horas
    let processedHourBank;
    if (hourBank) {
      processedHourBank = {
        ...hourBank,
        plan: hourBank.plan // Assume que já está em inglês
      };
    } else if (bancoHoras) {
      processedHourBank = {
        total: bancoHoras.total,
        used: bancoHoras.used || 0,
        plan: translateToEnglish('plans', bancoHoras.plan)
      };
    }

    // Processa role/cargo
    const processedRole = role || (cargo ? translateToEnglish('roles', cargo) : 'client');

    // Cria o usuário
    const newUser = new User({
      name: name || nome,
      email,
      password: password || senha,
      role: processedRole,
      hourBank: processedHourBank,
      skills: skills || habilidades
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.status(201).json({ 
      token, 
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        hourBank: newUser.hourBank,
        skills: newUser.skills
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { 
      email,
      password,
      senha 
    } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password || senha);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hourBank: user.hourBank,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
