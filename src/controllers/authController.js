import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { translateToEnglish } from '../constants/translations.js';

export const register = async (req, res) => {
  try {
    const { 
      nome, 
      email, 
      senha, 
      role: cargo,
      hourBank: bancoHoras,
      skills: habilidades 
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const role = translateToEnglish('roles', cargo);
    
    // Traduz o plano do banco de horas se existir
    const hourBank = bancoHoras ? {
      ...bancoHoras,
      plan: translateToEnglish('plans', bancoHoras.plan)
    } : undefined;

    const newUser = new User({ 
      name: nome, 
      email, 
      password: senha,
      role,
      hourBank,
      skills: habilidades
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
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(senha);
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
