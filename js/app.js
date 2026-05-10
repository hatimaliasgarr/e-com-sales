/* ============================================
   E-Commerce Sales Analytics Dashboard
   Core App Logic — Navigation, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  initChartDefaults();
  initSidebar();
  initAnimations();
  initCounters();
  initFilterBtns();
  setCurrentDate();
  if (typeof initPageCharts === 'function') initPageCharts();
});

// ── Sidebar Navigation ──
function initSidebar() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// ── Scroll Animations via IntersectionObserver ──
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// ── Animated Number Counters ──
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimals || '0');
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = target * eased;
    
    if (target >= 1000000) {
      el.textContent = prefix + (current / 1000000).toFixed(decimals > 0 ? decimals : 2) + 'M' + suffix;
    } else if (target >= 1000) {
      el.textContent = prefix + (current / 1000).toFixed(decimals > 0 ? decimals : 1) + 'K' + suffix;
    } else {
      el.textContent = prefix + current.toFixed(decimals) + suffix;
    }

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Filter Buttons ──
function initFilterBtns() {
  document.querySelectorAll('.filter-bar').forEach(bar => {
    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

// ── Set Current Date ──
function setCurrentDate() {
  const el = document.querySelector('.date-display');
  if (el) {
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

// ── Build Custom Legend ──
function buildLegend(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="legend-item" style="--dot-color: ${item.color}">
      <span class="legend-dot" style="background: ${item.color}"></span>
      <span>${item.label}</span>
      ${item.value ? `<span class="legend-value">${item.value}</span>` : ''}
      ${item.tooltip ? `<div class="legend-tooltip">${item.tooltip}</div>` : ''}
    </div>
  `).join('');
}

// ── Build Stat Rows ──
function buildStatRows(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="stat-row">
      <span class="stat-label">
        <span class="stat-dot" style="background: ${item.color || 'var(--accent-blue)'}"></span>
        ${item.label}
      </span>
      <span class="stat-value">${item.value}</span>
    </div>
  `).join('');
}

// ── Build Data Table ──
function buildTable(containerId, headers, rows) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const headerHtml = headers.map(h => `<th>${h}</th>`).join('');
  const rowsHtml = rows.map(row => 
    `<tr>${row.map((cell, i) => `<td${i === 0 ? ' class="primary"' : ''}>${cell}</td>`).join('')}</tr>`
  ).join('');

  container.innerHTML = `
    <div class="data-table-wrapper">
      <table class="data-table">
        <thead><tr>${headerHtml}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </div>
  `;
}

// ── Create Sparkline SVG ──
function createSparkline(values, color, width = 80, height = 30) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="kpi-sparkline">
    <defs><linearGradient id="spark-${color.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${width},${height} 0,${height} ${points}" fill="url(#spark-${color.replace('#','')})"/>
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5"/>
  </svg>`;
}
