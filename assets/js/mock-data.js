// 🏥 PRO — Mock Data & Storage Management
// Gerencia todos os dados simulados da demo via localStorage

// ==================== CONSTANTES ====================

const STORAGE_KEYS = {
  AGENTS: 'pro.agents',
  LINKS: 'pro.links',
  TICKETS: 'pro.tickets',
  FLAGS: 'pro.flags',
  CURRENT_AGENT: 'pro.currentAgent'
};

const LINK_STATUS = {
  NAO_ABERTO: 'NAO_ABERTO',
  EM_PROGRESSO: 'EM_PROGRESSO',
  CONCLUIDO: 'CONCLUIDO',
  VENCEU: 'VENCEU'
};

const RISK_LEVELS = {
  CRITICO: 'CRITICO',
  ALTO: 'ALTO',
  MODERADO: 'MODERADO',
  BAIXO: 'BAIXO'
};

const TOKEN_EXPIRY_HOURS = 72; // 3 dias
const MAX_LINKS = 100; // Limite para evitar estouro do localStorage

// ==================== UBS MOCK ====================

const UBS_LIST = [
  { id: 'UBS-CENTRO', nome: 'UBS Centro', cidade: 'Dourados' },
  { id: 'UBS-JARDIM', nome: 'UBS Jardim Clímax', cidade: 'Dourados' },
  { id: 'UBS-VILA-NOVA', nome: 'UBS Vila Nova', cidade: 'Dourados' },
  { id: 'UBS-PARQUE', nome: 'UBS Parque das Nações', cidade: 'Dourados' },
  { id: 'UBS-ITAHUM', nome: 'UBS Itahum', cidade: 'Dourados' }
];

// ==================== HELPERS DE STORAGE ====================

function getFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Erro ao ler ${key}:`, e);
    return null;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Erro ao salvar ${key}:`, e);
    return false;
  }
}

// ==================== GESTÃO DE AGENTES ====================

function getCurrentAgent() {
  return getFromStorage(STORAGE_KEYS.CURRENT_AGENT);
}

function setCurrentAgent(agentData) {
  saveToStorage(STORAGE_KEYS.CURRENT_AGENT, agentData);
}

function loginAgent(nome, ubsId) {
  const agentId = 'AG' + Date.now();
  const ubs = UBS_LIST.find(u => u.id === ubsId);
  
  const agent = {
    id: agentId,
    nome: nome,
    ubsId: ubsId,
    ubsNome: ubs?.nome || 'UBS',
    loginAt: Date.now()
  };
  
  // Salva na lista de agentes
  let agents = getFromStorage(STORAGE_KEYS.AGENTS) || [];
  agents.push(agent);
  saveToStorage(STORAGE_KEYS.AGENTS, agents);
  
  // Define como agente atual
  setCurrentAgent(agent);
  
  return agent;
}

function logoutAgent() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_AGENT);
}

// ==================== GESTÃO DE TOKENS/LINKS ====================

function generateToken() {
  return 'TK' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generateGestanteHash(nomeOpc) {
  // Simula hash para deduplicação (na real seria SHA256 de CPF ou nome da mãe)
  if (!nomeOpc) return 'ANONIMO_' + Date.now();
  return 'HASH_' + nomeOpc.replace(/\s/g, '').substring(0, 8).toUpperCase();
}

function createLink(nomeOpc, canal = 'whatsapp') {
  const agent = getCurrentAgent();
  if (!agent) {
    throw new Error('Agente não autenticado');
  }
  
  const token = generateToken();
  const gestanteHash = generateGestanteHash(nomeOpc);
  
  // Verifica se já existe link ativo para esta gestante
  const links = getAllLinks();
  const existingActive = links.find(l => 
    l.gestanteHash === gestanteHash && 
    l.status !== LINK_STATUS.CONCLUIDO &&
    l.status !== LINK_STATUS.VENCEU
  );
  
  if (existingActive) {
    // Desativa o link anterior
    existingActive.isActive = false;
    existingActive.supersededBy = token;
    updateLink(existingActive.token, existingActive);
  }
  
  const link = {
    token: token,
    gestanteHash: gestanteHash,
    ubsId: agent.ubsId,
    ubsNome: agent.ubsNome,
    agenteId: agent.id,
    agenteNome: agent.nome,
    nomeOpc: nomeOpc || '',
    canal: canal,
    createdAt: Date.now(),
    status: LINK_STATUS.NAO_ABERTO,
    attempts: 1,
    lastEvent: 'LINK_GERADO',
    isActive: true,
    events: [
      { type: 'LINK_GERADO', timestamp: Date.now() }
    ]
  };
  
  // Salva o link
  let links_updated = getAllLinks();
  
  // LRU: remove links antigos se ultrapassar limite
  if (links_updated.length >= MAX_LINKS) {
    links_updated = links_updated
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, MAX_LINKS - 1);
  }
  
  links_updated.push(link);
  saveToStorage(STORAGE_KEYS.LINKS, links_updated);
  
  return link;
}

function getAllLinks() {
  return getFromStorage(STORAGE_KEYS.LINKS) || [];
}

function getLinkByToken(token) {
  const links = getAllLinks();
  return links.find(l => l.token === token);
}

function getAgentLinks(agentId) {
  const links = getAllLinks();
  return links.filter(l => l.agenteId === agentId);
}

function updateLink(token, updates) {
  const links = getAllLinks();
  const index = links.findIndex(l => l.token === token);
  
  if (index === -1) {
    throw new Error('Link não encontrado');
  }
  
  links[index] = { ...links[index], ...updates };
  saveToStorage(STORAGE_KEYS.LINKS, links);
  
  return links[index];
}

function addLinkEvent(token, eventType) {
  const link = getLinkByToken(token);
  if (!link) return;
  
  const event = {
    type: eventType,
    timestamp: Date.now()
  };
  
  link.events = link.events || [];
  link.events.push(event);
  link.lastEvent = eventType;
  
  updateLink(token, link);
}

function resendLink(token) {
  const link = getLinkByToken(token);
  if (!link) throw new Error('Link não encontrado');
  
  link.attempts += 1;
  link.lastEvent = `REENVIO_${link.attempts - 1}`;
  
  addLinkEvent(token, link.lastEvent);
  
  // Alerta se muitos reenvios
  if (link.attempts >= 3) {
    console.warn(`⚠️ Link ${token} teve ${link.attempts} tentativas - baixo engajamento`);
  }
  
  updateLink(token, link);
  return link;
}

function checkTokenExpiry(link) {
  const elapsed = Date.now() - link.createdAt;
  const hours = elapsed / (1000 * 60 * 60);
  
  if (hours > TOKEN_EXPIRY_HOURS && 
      link.status !== LINK_STATUS.CONCLUIDO && 
      link.status !== LINK_STATUS.VENCEU) {
    return LINK_STATUS.VENCEU;
  }
  
  return link.status;
}

function updateExpiredLinks() {
  const links = getAllLinks();
  let updated = false;
  
  links.forEach(link => {
    const newStatus = checkTokenExpiry(link);
    if (newStatus === LINK_STATUS.VENCEU && link.status !== LINK_STATUS.VENCEU) {
      link.status = LINK_STATUS.VENCEU;
      link.lastEvent = 'TOKEN_EXPIRADO';
      addLinkEvent(link.token, 'TOKEN_EXPIRADO');
      updated = true;
    }
  });
  
  if (updated) {
    saveToStorage(STORAGE_KEYS.LINKS, links);
  }
}

// ==================== GESTÃO DE TICKETS (REGULAÇÃO) ====================

function createTicket(triagemData) {
  const tickets = getAllTickets();
  
  const ticket = {
    id: 'TCK' + Date.now(),
    token: triagemData.token,
    gestanteHash: triagemData.gestanteHash,
    nomeInicial: triagemData.nomeOpc || 'Gestante',
    risco: triagemData.risco,
    idadeGestacional: triagemData.idadeGestacional,
    sintomas: triagemData.sintomas,
    ubsOrigem: triagemData.ubsId,
    createdAt: Date.now(),
    status: 'AGUARDANDO_REGULACAO',
    priority: calculatePriority(triagemData.risco, Date.now())
  };
  
  tickets.push(ticket);
  saveToStorage(STORAGE_KEYS.TICKETS, tickets);
  
  return ticket;
}

function getAllTickets() {
  return getFromStorage(STORAGE_KEYS.TICKETS) || [];
}

function getTicketById(id) {
  const tickets = getAllTickets();
  return tickets.find(t => t.id === id);
}

function updateTicket(id, updates) {
  const tickets = getAllTickets();
  const index = tickets.findIndex(t => t.id === id);
  
  if (index === -1) throw new Error('Ticket não encontrado');
  
  tickets[index] = { ...tickets[index], ...updates };
  saveToStorage(STORAGE_KEYS.TICKETS, tickets);
  
  return tickets[index];
}

function calculatePriority(risco, createdAt) {
  // Maior prioridade = número menor (para ordenação)
  const riskScore = {
    [RISK_LEVELS.CRITICO]: 1,
    [RISK_LEVELS.ALTO]: 2,
    [RISK_LEVELS.MODERADO]: 3,
    [RISK_LEVELS.BAIXO]: 4
  };
  
  const timeScore = Date.now() - createdAt; // tempo de espera
  
  return riskScore[risco] * 1000 + timeScore / 1000;
}

// ==================== KPIs / MÉTRICAS ====================

function calculateKPIs(agentId = null) {
  const links = agentId ? getAgentLinks(agentId) : getAllLinks();
  
  const total = links.length;
  const abertos = links.filter(l => 
    l.status === LINK_STATUS.EM_PROGRESSO || 
    l.status === LINK_STATUS.CONCLUIDO
  ).length;
  const concluidos = links.filter(l => l.status === LINK_STATUS.CONCLUIDO).length;
  
  const taxaAbertura = total > 0 ? ((abertos / total) * 100).toFixed(1) : 0;
  const taxaConversao = abertos > 0 ? ((concluidos / abertos) * 100).toFixed(1) : 0;
  const taxaEfetividade = total > 0 ? ((concluidos / total) * 100).toFixed(1) : 0;
  
  // Tempo médio de conclusão
  const concluidosComTempo = links.filter(l => 
    l.status === LINK_STATUS.CONCLUIDO && l.events
  );
  
  let tempoMedio = 0;
  if (concluidosComTempo.length > 0) {
    const tempos = concluidosComTempo.map(l => {
      const inicio = l.createdAt;
      const fim = l.events.find(e => e.type === 'TRIAGEM_CONCLUIDA')?.timestamp || Date.now();
      return fim - inicio;
    });
    tempoMedio = tempos.reduce((a, b) => a + b, 0) / tempos.length;
    tempoMedio = Math.round(tempoMedio / (1000 * 60)); // em minutos
  }
  
  // Reenvios médios
  const reenviosMedio = total > 0 
    ? (links.reduce((sum, l) => sum + (l.attempts - 1), 0) / total).toFixed(1)
    : 0;
  
  return {
    total,
    abertos,
    concluidos,
    taxaAbertura,
    taxaConversao,
    taxaEfetividade,
    tempoMedio,
    reenviosMedio
  };
}

// ==================== POPULAÇÃO DE DADOS MOCK ====================

function populateMockData() {
  const agent = getCurrentAgent();
  if (!agent) {
    alert('Faça login primeiro');
    return;
  }
  
  const nomes = [
    'Ana Silva', 'Maria Santos', 'Joana Costa', 'Paula Lima',
    'Rita Souza', 'Carla Oliveira', 'Lucia Alves', 'Mariana Rocha',
    'Fernanda Dias', 'Beatriz Ferreira', 'Juliana Martins', 'Camila Pereira',
    'Gabriela Nunes', 'Larissa Campos', 'Natalia Barbosa', 'Rafaela Monteiro',
    'Tatiana Ribeiro', 'Vanessa Cardoso', 'Patricia Mendes', 'Simone Castro'
  ];
  
  const statuses = [
    LINK_STATUS.NAO_ABERTO,
    LINK_STATUS.NAO_ABERTO,
    LINK_STATUS.EM_PROGRESSO,
    LINK_STATUS.EM_PROGRESSO,
    LINK_STATUS.CONCLUIDO,
    LINK_STATUS.CONCLUIDO,
    LINK_STATUS.CONCLUIDO,
    LINK_STATUS.VENCEU
  ];
  
  const canais = ['whatsapp', 'whatsapp', 'whatsapp', 'sms'];
  
  // Gera 20 links variados
  for (let i = 0; i < 20; i++) {
    const nome = nomes[i];
    const canal = canais[Math.floor(Math.random() * canais.length)];
    const horasAtras = Math.floor(Math.random() * 168); // até 7 dias atrás
    
    const link = createLink(nome, canal);
    
    // Ajusta timestamp para simular histórico
    link.createdAt = Date.now() - (horasAtras * 60 * 60 * 1000);
    
    // Define status aleatório
    link.status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Adiciona tentativas para alguns
    if (Math.random() > 0.7) {
      link.attempts = Math.floor(Math.random() * 3) + 1;
      link.lastEvent = `REENVIO_${link.attempts - 1}`;
    }
    
    updateLink(link.token, link);
  }
  
  console.log('✅ 20 registros mock criados');
}

// ==================== RESET DA DEMO ====================

function resetDemo() {
  if (confirm('⚠️ Isso vai apagar TODOS os dados da demo. Continuar?')) {
    localStorage.clear();
    console.log('🔄 Demo resetada');
    window.location.reload();
  }
}

// ==================== FORMATAÇÃO ====================

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // Menos de 1 hora
  if (diff < 60 * 60 * 1000) {
    const mins = Math.floor(diff / (60 * 1000));
    return `${mins}min atrás`;
  }
  
  // Menos de 24 horas
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}h atrás`;
  }
  
  // Menos de 7 dias
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}d atrás`;
  }
  
  // Data completa
  return date.toLocaleDateString('pt-BR');
}

function formatDateTime(timestamp) {
  return new Date(timestamp).toLocaleString('pt-BR');
}

function formatStatus(status) {
  const labels = {
    [LINK_STATUS.NAO_ABERTO]: '⏳ Não aberto',
    [LINK_STATUS.EM_PROGRESSO]: '🔄 Em progresso',
    [LINK_STATUS.CONCLUIDO]: '✅ Concluído',
    [LINK_STATUS.VENCEU]: '⏰ Venceu'
  };
  return labels[status] || status;
}

function getStatusBadgeClass(status) {
  const classes = {
    [LINK_STATUS.NAO_ABERTO]: 'badge-gray',
    [LINK_STATUS.EM_PROGRESSO]: 'badge-info',
    [LINK_STATUS.CONCLUIDO]: 'badge-success',
    [LINK_STATUS.VENCEU]: 'badge-warning'
  };
  return classes[status] || 'badge-gray';
}

// ==================== UTILITÁRIOS ====================

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('✅ Link copiado!');
  }).catch(() => {
    // Fallback para navegadores antigos
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('✅ Link copiado!');
  });
}

function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function openWhatsApp(phone, message) {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, '_blank');
}

// ==================== INICIALIZAÇÃO ====================

// Atualiza links expirados ao carregar
window.addEventListener('DOMContentLoaded', () => {
  updateExpiredLinks();
});

// Exporta para uso global
window.ProData = {
  // Storage
  STORAGE_KEYS,
  LINK_STATUS,
  RISK_LEVELS,
  UBS_LIST,
  
  // Agentes
  getCurrentAgent,
  setCurrentAgent,
  loginAgent,
  logoutAgent,
  
  // Links
  createLink,
  getAllLinks,
  getLinkByToken,
  getAgentLinks,
  updateLink,
  addLinkEvent,
  resendLink,
  
  // Tickets
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
  
  // KPIs
  calculateKPIs,
  
  // Mock
  populateMockData,
  resetDemo,
  
  // Formatação
  formatDate,
  formatDateTime,
  formatStatus,
  getStatusBadgeClass,
  
  // Utils
  copyToClipboard,
  showToast,
  openWhatsApp
};
