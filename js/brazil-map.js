/* ============================================
   Interactive Brazil SVG Map
   ============================================ */

function renderBrazilMap(containerId, stateData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Simplified Brazil state paths (approximate)
  const states = {
    'AC': { d:'M80,340 L110,330 L120,360 L90,370Z', cx:95, cy:350 },
    'AM': { d:'M100,240 L220,220 L240,280 L200,320 L120,330 L80,300Z', cx:160, cy:275 },
    'RR': { d:'M160,160 L200,150 L220,190 L190,220 L150,210Z', cx:180, cy:185 },
    'PA': { d:'M220,220 L360,200 L380,260 L340,300 L240,280Z', cx:300, cy:250 },
    'AP': { d:'M280,160 L320,150 L340,190 L310,210 L280,200Z', cx:305, cy:180 },
    'MA': { d:'M360,200 L420,210 L430,260 L380,260Z', cx:400, cy:235 },
    'TO': { d:'M340,300 L380,290 L400,370 L360,380Z', cx:370, cy:340 },
    'PI': { d:'M420,210 L460,220 L450,300 L410,280Z', cx:435, cy:255 },
    'CE': { d:'M460,220 L510,210 L500,250 L470,260Z', cx:485, cy:235 },
    'RN': { d:'M510,210 L540,215 L535,240 L505,235Z', cx:525, cy:225 },
    'PB': { d:'M505,240 L540,240 L535,260 L500,255Z', cx:520, cy:250 },
    'PE': { d:'M470,260 L540,260 L530,280 L460,275Z', cx:500, cy:270 },
    'AL': { d:'M530,280 L550,280 L545,300 L525,295Z', cx:538, cy:290 },
    'SE': { d:'M525,300 L545,300 L540,315 L520,310Z', cx:533, cy:305 },
    'BA': { d:'M410,280 L520,310 L510,400 L420,420 L380,380Z', cx:450, cy:350 },
    'MT': { d:'M240,310 L340,300 L360,400 L300,440 L240,400Z', cx:295, cy:370 },
    'GO': { d:'M360,380 L420,380 L430,440 L370,450Z', cx:395, cy:415 },
    'DF': { d:'M410,405 L425,400 L430,415 L415,420Z', cx:418, cy:410 },
    'MS': { d:'M280,440 L340,430 L350,500 L290,510Z', cx:315, cy:475 },
    'MG': { d:'M420,400 L510,390 L520,470 L440,480Z', cx:475, cy:440 },
    'ES': { d:'M520,410 L550,405 L545,445 L520,450Z', cx:535, cy:425 },
    'RJ': { d:'M490,475 L530,460 L535,485 L495,495Z', cx:513, cy:480 },
    'SP': { d:'M370,460 L450,465 L460,520 L380,530Z', cx:415, cy:495 },
    'PR': { d:'M350,520 L420,515 L430,560 L360,565Z', cx:390, cy:540 },
    'SC': { d:'M380,565 L430,560 L435,595 L390,600Z', cx:410, cy:580 },
    'RS': { d:'M350,595 L410,595 L400,660 L340,650Z', cx:375, cy:630 }
  };

  // Revenue lookup
  const revenueMap = {};
  let maxRevenue = 0;
  stateData.forEach(s => {
    revenueMap[s.state] = s;
    if (s.revenue > maxRevenue) maxRevenue = s.revenue;
  });

  let svg = `<svg viewBox="60 130 520 560" class="brazil-map-svg" style="width:100%;max-height:420px">
    <defs>
      <filter id="map-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="map-grad-high" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#6366f1"/></linearGradient>
    </defs>`;

  Object.entries(states).forEach(([code, st]) => {
    const data = revenueMap[code];
    let fill = 'rgba(255,255,255,0.03)';
    let strokeColor = 'rgba(255,255,255,0.1)';
    
    if (data) {
      const intensity = Math.pow(data.revenue / maxRevenue, 0.6);
      const r = Math.round(10 + (59 - 10) * intensity);
      const g = Math.round(20 + (130 - 20) * intensity);
      const b = Math.round(40 + (246 - 40) * intensity);
      fill = `rgba(${r},${g},${b},${0.2 + intensity * 0.6})`;
      strokeColor = `rgba(${r},${g},${b},0.5)`;
    }

    svg += `<path d="${st.d}" fill="${fill}" stroke="${strokeColor}" stroke-width="1.5" 
      class="map-state" data-state="${code}"
      style="cursor:pointer;transition:all 0.2s ease"/>`;
    
    svg += `<text x="${st.cx}" y="${st.cy}" text-anchor="middle" dominant-baseline="middle" 
      fill="rgba(255,255,255,0.6)" font-size="9" font-weight="600" font-family="Inter" 
      pointer-events="none">${code}</text>`;
  });

  svg += '</svg>';
  container.innerHTML = svg;

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'map-tooltip';
  tooltip.style.cssText = 'position:absolute;background:rgba(15,18,35,0.96);border:1px solid rgba(255,255,255,0.12);border-radius:12px;padding:14px 18px;font-size:12px;color:#94a3b8;pointer-events:none;opacity:0;transition:all 0.15s;z-index:100;min-width:200px;box-shadow:0 15px 35px rgba(0,0,0,0.5)';
  container.style.position = 'relative';
  container.appendChild(tooltip);

  container.querySelectorAll('.map-state').forEach(path => {
    path.addEventListener('mouseenter', function(e) {
      this.style.filter = 'url(#map-glow)';
      this.style.strokeWidth = '2.5';
      const code = this.dataset.state;
      const data = revenueMap[code];
      if (data) {
        tooltip.innerHTML = `
          <div style="font-weight:700;color:#f1f5f9;font-size:14px;margin-bottom:8px">${data.name} (${code})</div>
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Revenue</span><span style="color:#3b82f6;font-weight:600">$${(data.revenue/1e6).toFixed(2)}M</span></div>
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Orders</span><span style="color:#10b981;font-weight:600">${data.orders.toLocaleString()}</span></div>
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Share</span><span style="color:#f59e0b;font-weight:600">${data.pct}%</span></div>
          <div style="display:flex;justify-content:space-between;margin:4px 0"><span>Avg Delivery</span><span style="color:#94a3b8;font-weight:600">${data.avgDelivery} days</span></div>
        `;
        tooltip.style.opacity = '1';
      }
    });

    path.addEventListener('mousemove', function(e) {
      const rect = container.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 15) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 10) + 'px';
    });

    path.addEventListener('mouseleave', function() {
      this.style.filter = 'none';
      this.style.strokeWidth = '1.5';
      tooltip.style.opacity = '0';
    });
  });
}
