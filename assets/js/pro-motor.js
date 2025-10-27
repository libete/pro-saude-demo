// 🧠 PRO — Motor de Classificação de Risco Obstétrico
// Simula a lógica de inteligência que prioriza casos

const ProMotor = {
  
  // ==================== CLASSIFICAÇÃO DE RISCO ====================
  
  classificarRisco(triagemData) {
    const {
      idadeGestacional,
      idadeGestante,
      sintomas = [],
      historico = []
    } = triagemData;
    
    // Critérios de risco CRÍTICO (qualquer um = crítico)
    const sintomasCriticos = [
      'sangramento',
      'dor_intensa',
      'perda_liquido'
    ];
    
    const temSintomasCriticos = sintomas.some(s => sintomasCriticos.includes(s));
    
    // Critérios de risco ALTO
    const sintomasAltos = [
      'cefaleia',
      'febre',
      'contracao',
      'movimento_reduzido'
    ];
    
    const temSintomasAltos = sintomas.some(s => sintomasAltos.includes(s));
    
    // Fatores de risco do histórico
    const temPreEclampsia = historico.includes('pre_eclampsia');
    const temHipertensao = historico.includes('hipertensao');
    const temDiabetes = historico.includes('diabetes');
    const temGemelar = historico.includes('gemelar');
    
    // Idade gestacional prematura
    const prematura = idadeGestacional < 37;
    const muitoPrematura = idadeGestacional < 34;
    
    // Idade materna
    const idadeRisco = idadeGestante === '>40' || idadeGestante === '<18';
    
    // ==================== LÓGICA DE CLASSIFICAÇÃO ====================
    
    // CRÍTICO
    if (temSintomasCriticos) {
      return {
        risco: 'CRITICO',
        pontuacao: 10,
        justificativa: this.gerarJustificativa(triagemData, 'CRITICO'),
        mensagem: this.gerarMensagem('CRITICO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_IMEDIATA'
      };
    }
    
    if (muitoPrematura && temSintomasAltos) {
      return {
        risco: 'CRITICO',
        pontuacao: 9,
        justificativa: 'Gestação muito prematura (<34s) com sintomas de alarme',
        mensagem: this.gerarMensagem('CRITICO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_IMEDIATA'
      };
    }
    
    if (temPreEclampsia && sintomas.includes('cefaleia')) {
      return {
        risco: 'CRITICO',
        pontuacao: 9,
        justificativa: 'Histórico de pré-eclâmpsia com cefaleia intensa',
        mensagem: this.gerarMensagem('CRITICO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_IMEDIATA'
      };
    }
    
    // ALTO
    if (temSintomasAltos) {
      return {
        risco: 'ALTO',
        pontuacao: 7,
        justificativa: this.gerarJustificativa(triagemData, 'ALTO'),
        mensagem: this.gerarMensagem('ALTO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_PRIORITARIA'
      };
    }
    
    if (prematura && (temHipertensao || temDiabetes || temGemelar)) {
      return {
        risco: 'ALTO',
        pontuacao: 6,
        justificativa: 'Gestação prematura com comorbidades',
        mensagem: this.gerarMensagem('ALTO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_PRIORITARIA'
      };
    }
    
    if ((temHipertensao || temPreEclampsia) && idadeGestacional > 34) {
      return {
        risco: 'ALTO',
        pontuacao: 6,
        justificativa: 'Hipertensão/pré-eclâmpsia prévia - monitoramento intensivo',
        mensagem: this.gerarMensagem('ALTO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_PRIORITARIA'
      };
    }
    
    // MODERADO
    if (idadeRisco || temDiabetes || temHipertensao || temGemelar) {
      return {
        risco: 'MODERADO',
        pontuacao: 4,
        justificativa: this.gerarJustificativa(triagemData, 'MODERADO'),
        mensagem: this.gerarMensagem('MODERADO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_PROGRAMADA'
      };
    }
    
    if (prematura) {
      return {
        risco: 'MODERADO',
        pontuacao: 4,
        justificativa: 'Gestação prematura (37-34 semanas)',
        mensagem: this.gerarMensagem('MODERADO', sintomas, idadeGestacional),
        recomendacao: 'REGULACAO_PROGRAMADA'
      };
    }
    
    // BAIXO (padrão)
    return {
      risco: 'BAIXO',
      pontuacao: 2,
      justificativa: 'Gestação de baixo risco - acompanhamento de rotina',
      mensagem: this.gerarMensagem('BAIXO', sintomas, idadeGestacional),
      recomendacao: 'ACOMPANHAMENTO_UBS'
    };
  },
  
  // ==================== JUSTIFICATIVAS ====================
  
  gerarJustificativa(data, risco) {
    const { sintomas = [], historico = [], idadeGestacional } = data;
    
    const partes = [];
    
    if (risco === 'CRITICO') {
      if (sintomas.includes('sangramento')) {
        partes.push('Sangramento ativo');
      }
      if (sintomas.includes('dor_intensa')) {
        partes.push('Dor abdominal intensa');
      }
      if (sintomas.includes('perda_liquido')) {
        partes.push('Suspeita de ruptura de bolsa');
      }
    }
    
    if (risco === 'ALTO') {
      if (sintomas.includes('cefaleia')) {
        partes.push('Cefaleia intensa');
      }
      if (sintomas.includes('contracao')) {
        partes.push('Contrações regulares');
      }
      if (sintomas.includes('movimento_reduzido')) {
        partes.push('Movimentação fetal reduzida');
      }
    }
    
    if (historico.includes('pre_eclampsia')) {
      partes.push('Histórico de pré-eclâmpsia');
    }
    
    if (historico.includes('hipertensao')) {
      partes.push('Hipertensão');
    }
    
    if (idadeGestacional < 34) {
      partes.push(`IG ${idadeGestacional}s (prematura)`);
    }
    
    return partes.length > 0 ? partes.join(', ') : 'Avaliação clínica conforme protocolo';
  },
  
  // ==================== MENSAGENS PERSONALIZADAS ====================
  
  gerarMensagem(risco, sintomas = [], idadeGestacional) {
    const mensagens = {
      'CRITICO': `
        <strong style="color: var(--critical);">🚨 Atenção: Situação que requer avaliação médica IMEDIATA</strong>
        <br><br>
        Sua triagem indica sinais de alerta importantes. Um regulador da central obstétrica 
        está sendo notificado AGORA para priorizar seu atendimento.
        <br><br>
        <strong>O que fazer agora:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          <li>Aguarde o contato da equipe de regulação (em até 30 minutos)</li>
          <li>Mantenha seu telefone disponível</li>
          <li>Se os sintomas piorarem, procure a emergência mais próxima</li>
        </ul>
        <br>
        📞 Em caso de urgência, ligue 192 (SAMU)
      `,
      
      'ALTO': `
        <strong style="color: var(--high);">⚠️ Atenção: Situação que requer avaliação prioritária</strong>
        <br><br>
        Sua triagem indica fatores que precisam de atenção médica em breve. 
        Sua solicitação foi registrada com prioridade na central de regulação obstétrica.
        <br><br>
        <strong>Próximos passos:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          <li>Aguarde o contato da equipe (em até 4 horas)</li>
          <li>Continue monitorando seus sintomas</li>
          <li>Se houver piora, entre em contato novamente</li>
        </ul>
        <br>
        📞 Dúvidas? Entre em contato com sua UBS
      `,
      
      'MODERADO': `
        <strong style="color: var(--moderate);">⚡ Gestação de risco moderado</strong>
        <br><br>
        Sua triagem indica fatores que requerem acompanhamento mais frequente. 
        Sua solicitação foi registrada e será avaliada pelo regulador dentro do prazo adequado.
        <br><br>
        <strong>Recomendações:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          <li>Aguarde o contato da equipe (em até 24 horas)</li>
          <li>Continue seu pré-natal regularmente</li>
          <li>Anote qualquer sintoma novo</li>
        </ul>
        <br>
        💡 Mantenha seus exames em dia e compareça às consultas
      `,
      
      'BAIXO': `
        <strong style="color: var(--low);">✅ Gestação de baixo risco</strong>
        <br><br>
        Sua triagem indica que sua gestação está dentro dos padrões esperados. 
        Continue o acompanhamento de pré-natal na sua UBS.
        <br><br>
        <strong>Recomendações:</strong>
        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
          <li>Mantenha suas consultas regulares de pré-natal</li>
          <li>Realize os exames solicitados pelo seu médico</li>
          <li>Procure a UBS se surgirem sintomas novos</li>
        </ul>
        <br>
        💚 Parabéns por cuidar da sua saúde e do seu bebê!
      `
    };
    
    return mensagens[risco];
  },
  
  // ==================== SUGESTÃO DE UNIDADE ====================
  
  sugerirUnidade(ticket) {
    // Mock simples - na prática, consideraria:
    // - Proximidade geográfica
    // - Disponibilidade de leitos
    // - Capacidade de UTI neonatal (se prematura)
    // - Especialidades necessárias
    
    const { risco, idadeGestacional } = ticket;
    
    if (risco === 'CRITICO') {
      return {
        unidade: 'Hospital Regional',
        tipo: 'URGENCIA',
        motivacao: 'UTI obstétrica + equipe 24h'
      };
    }
    
    if (risco === 'ALTO') {
      if (idadeGestacional < 34) {
        return {
          unidade: 'Maternidade Alto Risco',
          tipo: 'ALTA_COMPLEXIDADE',
          motivacao: 'UTI neonatal disponível'
        };
      }
      return {
        unidade: 'Hospital Materno-Infantil',
        tipo: 'MEDIA_ALTA_COMPLEXIDADE',
        motivacao: 'Equipe obstétrica especializada'
      };
    }
    
    if (risco === 'MODERADO') {
      return {
        unidade: 'Maternidade Municipal',
        tipo: 'MEDIA_COMPLEXIDADE',
        motivacao: 'Acompanhamento adequado'
      };
    }
    
    return {
      unidade: 'UBS de origem',
      tipo: 'ATENCAO_BASICA',
      motivacao: 'Pré-natal de rotina'
    };
  },
  
  // ==================== PRIORIZAÇÃO PARA FILA ====================
  
  calcularPrioridade(ticket) {
    // Quanto menor o número, maior a prioridade
    const riskScores = {
      'CRITICO': 1,
      'ALTO': 2,
      'MODERADO': 3,
      'BAIXO': 4
    };
    
    const baseScore = riskScores[ticket.risco] || 4;
    
    // Adiciona peso pelo tempo de espera (minutos)
    const minutosEspera = (Date.now() - ticket.createdAt) / (1000 * 60);
    const tempoScore = Math.floor(minutosEspera / 10); // +1 a cada 10 min
    
    // Prioridade = risco base + bônus de tempo
    return (baseScore * 1000) - tempoScore;
  },
  
  // ==================== ORDENAÇÃO DE FILA ====================
  
  ordenarFila(tickets) {
    return tickets
      .map(t => ({
        ...t,
        priority: this.calcularPrioridade(t)
      }))
      .sort((a, b) => a.priority - b.priority);
  },
  
  // ==================== ESTATÍSTICAS ====================
  
  calcularEstatisticas(tickets) {
    const total = tickets.length;
    
    const porRisco = {
      CRITICO: tickets.filter(t => t.risco === 'CRITICO').length,
      ALTO: tickets.filter(t => t.risco === 'ALTO').length,
      MODERADO: tickets.filter(t => t.risco === 'MODERADO').length,
      BAIXO: tickets.filter(t => t.risco === 'BAIXO').length
    };
    
    // Tempo médio de espera por risco
    const temposPorRisco = {};
    ['CRITICO', 'ALTO', 'MODERADO', 'BAIXO'].forEach(risco => {
      const ticketsRisco = tickets.filter(t => t.risco === risco);
      if (ticketsRisco.length > 0) {
        const tempos = ticketsRisco.map(t => Date.now() - t.createdAt);
        const media = tempos.reduce((a, b) => a + b, 0) / tempos.length;
        temposPorRisco[risco] = Math.round(media / (1000 * 60)); // em minutos
      } else {
        temposPorRisco[risco] = 0;
      }
    });
    
    return {
      total,
      porRisco,
      temposPorRisco
    };
  }
};

// Exporta globalmente
window.ProMotor = ProMotor;
