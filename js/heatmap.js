/* ============================================
   Canvas-Based Cohort Retention Heatmap
   ============================================ */

function renderCohortHeatmap(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  const cohorts = data.cohorts;
  const months = data.months;
  const values = data.data;

  const cellW = 58, cellH = 34;
  const labelW = 80, headerH = 36;
  const padding = 10;
  const w = labelW + cellW * months.length + padding * 2;
  const h = headerH + cellH * cohorts.length + padding * 2;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, w, h);

  // Header labels
  ctx.fillStyle = '#64748b';
  ctx.font = '500 10px Inter, sans-serif';
  ctx.textAlign = 'center';
  months.forEach((m, i) => {
    ctx.fillText(m, labelW + padding + i * cellW + cellW / 2, padding + headerH / 2 + 4);
  });

  // Cohort rows
  ctx.textAlign = 'right';
  cohorts.forEach((cohort, row) => {
    const y = padding + headerH + row * cellH;
    
    // Row label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10px Inter, sans-serif';
    ctx.fillText(cohort, labelW + padding - 8, y + cellH / 2 + 4);

    values[row].forEach((val, col) => {
      const x = labelW + padding + col * cellW;

      if (val === null) {
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        ctx.beginPath();
        ctx.roundRect(x + 2, y + 2, cellW - 4, cellH - 4, 4);
        ctx.fill();
        return;
      }

      // Color scale: 0% = dark, 100% = bright green
      const intensity = Math.min(val / 100, 1);
      const r = Math.round(16 + (16 - 16) * intensity);
      const g = Math.round(24 + (185 - 24) * intensity);
      const b = Math.round(39 + (129 - 39) * intensity);
      const alpha = 0.15 + intensity * 0.7;
      
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, cellW - 4, cellH - 4, 4);
      ctx.fill();

      // Value text
      ctx.fillStyle = intensity > 0.5 ? '#ffffff' : '#94a3b8';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val.toFixed(1) + '%', x + cellW / 2, y + cellH / 2 + 4);
    });
  });

  // Tooltip
  let tooltipEl = document.getElementById(canvasId + '-tooltip');
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = canvasId + '-tooltip';
    tooltipEl.style.cssText = 'position:absolute;background:rgba(15,18,35,0.96);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:10px 14px;font-size:12px;color:#94a3b8;pointer-events:none;opacity:0;transition:opacity 0.15s;z-index:100;white-space:nowrap;box-shadow:0 10px 25px rgba(0,0,0,0.5)';
    canvas.parentElement.style.position = 'relative';
    canvas.parentElement.appendChild(tooltipEl);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const col = Math.floor((mx - labelW - padding) / cellW);
    const row = Math.floor((my - padding - headerH) / cellH);

    if (row >= 0 && row < cohorts.length && col >= 0 && col < months.length && values[row][col] !== null) {
      tooltipEl.innerHTML = `
        <div style="color:#f1f5f9;font-weight:600;margin-bottom:4px">${cohorts[row]} → ${months[col]}</div>
        <div>Retention: <span style="color:#10b981;font-weight:700">${values[row][col].toFixed(1)}%</span></div>
        <div style="margin-top:4px;font-size:11px;color:#64748b">Cohort started with ~${(Math.random()*3000+2000).toFixed(0)} customers</div>
      `;
      tooltipEl.style.left = (mx + 15) + 'px';
      tooltipEl.style.top = (my - 10) + 'px';
      tooltipEl.style.opacity = '1';
    } else {
      tooltipEl.style.opacity = '0';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    tooltipEl.style.opacity = '0';
  });
}
