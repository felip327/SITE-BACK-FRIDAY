// ================================================
// Arquivo: script.js
// Objetivo: controlar animações, contador e carregamento de produtos.
// Fluxo principal de dados: Supabase -> Fallback para mock.
// Linguagem simples e didática para alunos.
// ================================================

// ------------------------------
// Contador regressivo (Countdown)
// Define uma data futura (3 dias a partir de agora) e
// atualiza os números na tela a cada segundo.
const countdownDate = new Date();
countdownDate.setDate(countdownDate.getDate() + 3);
countdownDate.setHours(23, 59, 59, 999);

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownDate - now;

  const days = Math.floor(distance / (100 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

  if (distance < 0) {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ------------------------------
// Animação de partículas (visual de fundo)
// Usamos um <canvas> para desenhar pontos e linhas que se movimentam.
// Isso é puramente estético para deixar a página mais atrativa.
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
}

resizeCanvas();

const particles = [];
const particleCount = 120;

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(init = false) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : -(Math.random() * 20 + 5);
    this.radius = Math.random() * 3 + 1.5;
    this.vy = Math.random() * 0.6 + 0.3; 
    this.angle = Math.random() * Math.PI * 2; 
    this.angularSpeed = Math.random() * 0.02 + 0.005;
    this.sway = Math.random() * 0.6 + 0.4;
  }

  update() {
    // balanço horizontal suave e queda vertical
    this.angle += this.angularSpeed;
    this.x += Math.sin(this.angle) * this.sway;
    this.y += this.vy;

    // reaparecer no topo quando sair embaixo
    if (this.y - this.radius > canvas.height) {
      this.reset(false);
    }

    // manutenção dentro dos limites horizontais
    if (this.x < -50) this.x = canvas.width + 50;
    if (this.x > canvas.width + 50) this.x = -50;
  }

  draw() {
    // floco principal: círculo branco suave
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.shadowColor = 'rgba(255,255,255,0.6)';
    ctx.shadowBlur = Math.max(0, this.radius * 2);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // detalhe em forma de cruz para lembrar flocos
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-this.radius * 1.5, 0);
    ctx.lineTo(this.radius * 1.5, 0);
    ctx.moveTo(0, -this.radius * 1.5);
    ctx.lineTo(0, this.radius * 1.5);
    ctx.stroke();
    ctx.restore();
  }
}

for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  // sem conexão entre partículas — são flocos de neve
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', resizeCanvas);
// Update canvas height when content changes
const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(document.body);

// Also update on scroll to ensure full coverage
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(resizeCanvas, 100);
});

function formatBRL(value) {
  // Formata um número para moeda brasileira (R$)
  const num = Number(value);
  if (Number.isNaN(num)) return 'R$ 0,00';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function escapeHtml(str) {
  // Evita problemas de segurança ao inserir texto no HTML,
  // convertendo caracteres especiais em entidades.
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(message) {
  // Exibe uma mensagem de feedback temporária no canto da tela.
  const messageDiv = document.createElement('div');
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f1c40f;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, 2000);
}

function attachBuyButtonHandlers() {
  // Adiciona comportamento ao botão "Comprar Agora" de cada produto.
  // Aqui apenas mostramos um toast simulando a adição ao carrinho.
  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function() {
      const productName = this.closest('.product-card').querySelector('.product-name').textContent;
      showToast(`${productName} adicionado ao carrinho!`);
    });
  });
}

function renderProducts(products) {
  // Recebe uma lista de produtos e cria os cartões na grade.
  // Cada cartão mostra imagem (emoji), nome, preços e botão.
  const grid = document.querySelector('.products-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const items = products;

  items.forEach(p => {
    const discountCalc = (p && p.old_price && p.new_price)
      ? Math.max(0, Math.round(100 - (Number(p.new_price) / Number(p.old_price)) * 100))
      : (p && typeof p.discount === 'number' ? p.discount : 0);

    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image">
        <span>${escapeHtml(p?.emoji || '🛍️')}</span>
        <div class="discount-badge">-${discountCalc}%</div>
      </div>
      <div class="product-info">
        <h3 class="product-name">${escapeHtml(p?.name || 'Produto')}</h3>
        <div class="price-container">
          <span class="old-price">${formatBRL(p?.old_price)}</span>
          <span class="new-price">${formatBRL(p?.new_price)}</span>
        </div>
        <button class="buy-button">Comprar Agora</button>
      </div>
    `;
    grid.appendChild(card);
  });

  attachBuyButtonHandlers();
}

async function loadProducts() {
  // ---------------------------------
  // Carregamento de produtos (Supabase -> mock)
  // 1) Tenta buscar no Supabase usando as credenciais de index.html
  // 2) Se der erro ou vier vazio, usa uma lista mock para não quebrar a página
  // ---------------------------------

  // Produtos de demonstração (fallback)
  const mockProducts = [
    { name: 'Smartphone Premium', old_price: 3999, new_price: 1199, emoji: '📱' },
    { name: 'Notebook Ultra', old_price: 5999, new_price: 2399, emoji: '💻' },
    { name: 'Fone Bluetooth', old_price: 899, new_price: 314, emoji: '🎧' }
  ];

  // Consultar diretamente do Supabase
  // Explicação:
  // - `window.supabase` vem do SDK carregado no index.html
  // - `createClient(url, anonKey)` cria um cliente para acessar o banco
  // - A consulta usa `.from('products').select('*')` para pegar todos os campos
  // - Ordenamos por `created_at` desc e limitamos a 3 itens mais recentes
  try {
    const { createClient } = window.supabase || {};
    const cfg = window.__SUPABASE || {};
    if (typeof createClient === 'function' && cfg.url && cfg.anonKey) {
      const client = createClient(cfg.url, cfg.anonKey);
      const { data, error } = await client
        .from('natal')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error;
      if (Array.isArray(data) && data.length) {
        // Se deu certo e veio conteúdo, exibimos os produtos reais
        renderProducts(data);
        return;
      }
    }
  } catch (errSupabase) {
    // Em caso de falha (sem internet, sem RLS, chave inválida...),
    // seguimos para o fallback.
    console.warn('Falha ao consultar Supabase:', errSupabase);
  }

  // Fallback para mock
  // Mostra a lista de demonstração para manter a experiência do aluno.
  renderProducts(mockProducts);
  showToast('Exibindo produtos de demonstração.');
}

document.addEventListener('DOMContentLoaded', () => {
  // Quando o HTML terminar de carregar, iniciamos a busca de produtos.
  loadProducts();
});

// keyframes para toasts
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(toastStyle);