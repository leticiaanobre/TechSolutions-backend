export const USER_ROLES = {
  client: 'cliente',
  developer: 'desenvolvedor',
  admin: 'administrador'
};

export const TASK_STATUS = {
  pending: 'pendente',
  in_progress: 'em_andamento',
  completed: 'concluída',
  rejected: 'rejeitada'
};

export const TASK_PRIORITY = {
  low: 'baixa',
  medium: 'média',
  high: 'alta',
  urgent: 'urgente'
};

export const HOUR_BANK_PLANS = {
  basic: 'básico',
  premium: 'premium',
  enterprise: 'empresarial'
};

export const translateToEnglish = (category, value) => {
  const dictionary = {
    roles: Object.entries(USER_ROLES).find(([key, val]) => val === value)?.[0],
    status: Object.entries(TASK_STATUS).find(([key, val]) => val === value)?.[0],
    priority: Object.entries(TASK_PRIORITY).find(([key, val]) => val === value)?.[0],
    plans: Object.entries(HOUR_BANK_PLANS).find(([key, val]) => val === value)?.[0]
  };
  
  return dictionary[category] || value;
};

export const translateToPortuguese = (category, value) => {
  const dictionary = {
    roles: USER_ROLES[value],
    status: TASK_STATUS[value],
    priority: TASK_PRIORITY[value],
    plans: HOUR_BANK_PLANS[value]
  };
  
  return dictionary[category] || value;
};
