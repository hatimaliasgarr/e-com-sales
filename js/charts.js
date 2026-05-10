/* ============================================
   E-Commerce Sales Analytics Dashboard
   Chart.js Configurations & Factories
   ============================================ */

// ── Chart.js Global Defaults ──
function initChartDefaults() {
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.legend.display = false;
  Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 18, 35, 0.96)';
  Chart.defaults.plugins.tooltip.titleColor = '#f1f5f9';
  Chart.defaults.plugins.tooltip.bodyColor = '#94a3b8';
  Chart.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 10;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 4;
  Chart.defaults.plugins.tooltip.usePointStyle = true;
  Chart.defaults.animation = { duration: 1200, easing: 'easeOutQuart' };
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
}

// ── Tooltip Callbacks ──
const tooltipCallbacks = {
  currency: {
    label: function(ctx) {
      return ` ${ctx.dataset.label || ''}: $${ctx.parsed.y?.toLocaleString() || ctx.parsed?.toLocaleString() || 0}`;
    }
  },
  percentage: {
    label: function(ctx) {
      return ` ${ctx.dataset.label || ''}: ${ctx.parsed.y?.toFixed(1) || ctx.parsed?.toFixed(1) || 0}%`;
    }
  },
  number: {
    label: function(ctx) {
      return ` ${ctx.dataset.label || ''}: ${(ctx.parsed.y || ctx.parsed || 0).toLocaleString()}`;
    }
  }
};

// ── Create Area Chart ──
function createAreaChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const defaultDatasetProps = {
    fill: true,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverBorderWidth: 3,
    pointHoverBorderColor: '#fff',
    borderWidth: 2.5,
  };

  const chartDatasets = datasets.map(ds => ({
    ...defaultDatasetProps,
    ...ds,
    pointHoverBackgroundColor: ds.borderColor,
  }));

  return new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: chartDatasets },
    options: {
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: options.maxXTicks || 12, font: { size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            callback: options.yFormat === 'currency'
              ? v => '$' + (v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'K' : v)
              : options.yFormat === 'percentage' ? v => v + '%'
              : v => v >= 1000 ? (v/1000).toFixed(0)+'K' : v,
            font: { size: 11 }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: tooltipCallbacks[options.yFormat || 'number'] || {}
        },
        legend: { display: false }
      },
      ...options.chartOptions
    }
  });
}

// ── Create Bar Chart ──
function createBarChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const chartDatasets = datasets.map(ds => ({
    borderRadius: 6,
    borderSkipped: false,
    maxBarThickness: options.maxBarThickness || 40,
    ...ds,
  }));

  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: chartDatasets },
    options: {
      indexAxis: options.horizontal ? 'y' : 'x',
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          grid: { display: options.horizontal ? true : false, color: 'rgba(255,255,255,0.04)' },
          ticks: { font: { size: 11 }, callback: options.horizontal && options.yFormat === 'currency' ? v => '$'+(v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'K':v) : undefined }
        },
        y: {
          grid: { color: options.horizontal ? 'transparent' : 'rgba(255,255,255,0.04)' },
          ticks: {
            font: { size: 11 },
            callback: !options.horizontal && options.yFormat === 'currency'
              ? v => '$'+(v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'K':v)
              : !options.horizontal && options.yFormat === 'percentage' ? v => v+'%' : undefined
          }
        }
      },
      plugins: {
        tooltip: { callbacks: tooltipCallbacks[options.yFormat || 'number'] || {} },
        legend: { display: false }
      }
    }
  });
}

// ── Create Doughnut Chart ──
function createDoughnutChart(canvasId, labels, data, colors, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: 'rgba(5,5,16,0.8)',
        borderWidth: 3,
        hoverBorderColor: '#fff',
        hoverBorderWidth: 2,
        hoverOffset: 8,
      }]
    },
    options: {
      cutout: options.cutout || '72%',
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const val = ctx.parsed;
              const total = ctx.dataset.data.reduce((a,b) => a+b, 0);
              const pct = ((val/total)*100).toFixed(1);
              return options.format === 'currency'
                ? ` ${ctx.label}: $${val.toLocaleString()} (${pct}%)`
                : ` ${ctx.label}: ${val.toLocaleString()} (${pct}%)`;
            }
          }
        },
        legend: { display: false }
      }
    }
  });
}

// ── Create Radar Chart ──
function createRadarChart(canvasId, labels, datasets) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: datasets.map(ds => ({
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        ...ds
      }))
    },
    options: {
      scales: {
        r: {
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          grid: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { font: { size: 11 }, color: '#94a3b8' },
          ticks: { display: false }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ── Create Mixed Chart (Bar + Line for Pareto) ──
function createParetoChart(canvasId, labels, values) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const total = values.reduce((a,b) => a+b, 0);
  let cumulative = 0;
  const cumulativePct = values.map(v => { cumulative += v; return (cumulative/total*100); });

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Revenue',
          data: values,
          backgroundColor: values.map((_, i) => cumulativePct[i] <= 80 ? 'rgba(59,130,246,0.7)' : 'rgba(100,116,139,0.4)'),
          borderRadius: 6,
          borderSkipped: false,
          yAxisID: 'y',
          order: 2
        },
        {
          type: 'line',
          label: 'Cumulative %',
          data: cumulativePct,
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: '#f59e0b',
          pointHoverRadius: 6,
          fill: false,
          yAxisID: 'y1',
          order: 1
        }
      ]
    },
    options: {
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } },
        y: {
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: v => '$'+(v>=1e6?(v/1e6).toFixed(1)+'M':v>=1e3?(v/1e3).toFixed(0)+'K':v), font: { size: 11 } }
        },
        y1: {
          position: 'right',
          min: 0, max: 100,
          grid: { display: false },
          ticks: { callback: v => v+'%', font: { size: 11 } }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(ctx) {
              if (ctx.datasetIndex === 0) return ` Revenue: $${ctx.parsed.y.toLocaleString()}`;
              return ` Cumulative: ${ctx.parsed.y.toFixed(1)}%`;
            }
          }
        }
      }
    }
  });
}

// ── Utility: Format Currency ──
function formatCurrency(value) {
  if (value >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return '$' + (value / 1e3).toFixed(1) + 'K';
  return '$' + value.toFixed(2);
}

function formatNumber(value) {
  if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
  return value.toLocaleString();
}
