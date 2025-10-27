/**
 * PRO Demo - Interações e Animações
 * Comportamentos sutis para melhorar UX
 */

(function() {
  'use strict';

  // ================================
  // Smooth Scroll com offset do header
  // ================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignora se for apenas "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ================================
  // Header com sombra ao scroll
  // ================================
  
  const header = document.querySelector('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 8px 20px rgba(0,0,0,0.03)';
    }
    
    lastScroll = currentScroll;
  });

  // ================================
  // Animação de entrada dos cards
  // ================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Aplica aos cards com delay escalonado
  document.querySelectorAll('.card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });

  // ================================
  // Feedback visual ao copiar link
  // ================================
  
  window.mostrarFeedbackCopia = function(mensagem = '✓ Copiado!') {
    const toast = document.createElement('div');
    toast.textContent = mensagem;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, var(--salvia), var(--verde-agua));
      color: white;
      padding: 14px 24px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: 600;
      font-size: 15px;
      animation: slideInUp 0.3s ease, fadeOut 0.3s ease 2.5s forwards;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  // Animações CSS inline
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
  `;
  document.head.appendChild(style);

  // ================================
  // Navegação entre personas
  // ================================
  
  window.navegarParaPersona = function(url, persona) {
    // Analytics mock (pode integrar com GA4)
    console.log(`[Analytics] Navegando para persona: ${persona}`);
    
    // Adiciona classe de loading no botão clicado
    event.target.classList.add('loading');
    
    // Navega após breve delay (UX)
    setTimeout(() => {
      window.location.href = url;
    }, 200);
  };

  // ================================
  // Validação de formulários (se houver)
  // ================================
  
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = this.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = 'var(--accent)';
          field.classList.add('shake');
          
          setTimeout(() => {
            field.style.borderColor = '';
            field.classList.remove('shake');
          }, 600);
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        mostrarFeedbackCopia('⚠️ Preencha todos os campos obrigatórios');
      }
    });
  });

  // ================================
  // Easter egg: Konami Code
  // ================================
  
  let konamiCode = [];
  const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  
  document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
      document.body.style.filter = 'hue-rotate(180deg)';
      mostrarFeedbackCopia('🎉 Modo Arco-Íris ativado!');
      
      setTimeout(() => {
        document.body.style.filter = '';
      }, 5000);
    }
  });

  // ================================
  // Detecção de preferências do usuário
  // ================================
  
  // Respeitar prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.querySelectorAll('.card').forEach(card => {
      card.style.transition = 'none';
    });
  }

  // ================================
  // Log de inicialização
  // ================================
  
  console.log('%c🩺 PRO Demo', 'font-size: 20px; font-weight: bold; color: #2c5aa0;');
  console.log('%cPlataforma de Regulação Obstétrica Otimizada', 'font-size: 12px; color: #6c757d;');
  console.log('%cAmbiente de demonstração com dados simulados', 'font-size: 11px; color: #999;');

  // ================================
  // Performance: Lazy loading de imagens
  // ================================
  
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback para navegadores antigos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // ================================
  // Acessibilidade: Skip link
  // ================================
  
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Pular para o conteúdo principal';
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 4px 0;
    z-index: 10001;
    transition: top 0.3s;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  document.body.insertBefore(skipLink, document.body.firstChild);

})();
