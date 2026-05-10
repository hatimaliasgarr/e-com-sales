// API Layer for fetching from Supabase

// Global data object that replaces the static data.js
window.DASHBOARD_DATA = {};

/**
 * Helper to fetch data from a Supabase view
 */
async function fetchView(viewName) {
  if (window.SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') return null; // Not configured
  
  const { data, error } = await window.supabaseClient.from(viewName).select('*');
  if (error) {
    console.error(`Error fetching view ${viewName}:`, error);
    return [];
  }
  return data;
}

/**
 * Loads all data required for the Executive Overview dashboard
 */
async function loadExecutiveData() {
  const [kpis, monthly, status, payment] = await Promise.all([
    fetchView('v_kpi_metrics'),
    fetchView('v_monthly_trend'),
    fetchView('v_order_status'),
    fetchView('v_payment_methods')
  ]);

  if (!kpis) return false; // Handle mock state

  // Format KPIs
  window.DASHBOARD_DATA.kpiMetrics = kpis[0] || {
    totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, activeCustomers: 0
  };

  // Format Monthly Trend
  window.DASHBOARD_DATA.monthlyTrend = {
    labels: monthly.map(m => m.month_label),
    revenue: monthly.map(m => m.revenue),
    orders: monthly.map(m => m.orders)
  };

  // Format Order Status
  const statusColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#64748b'];
  window.DASHBOARD_DATA.orderStatus = {
    labels: status.map(s => s.status),
    values: status.map(s => s.percentage),
    colors: statusColors.slice(0, status.length)
  };

  // Format Payments
  const paymentColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  window.DASHBOARD_DATA.paymentMethods = {
    labels: payment.map(p => p.payment_type),
    amounts: payment.map(p => p.total_amount),
    values: payment.map(p => p.percentage),
    colors: paymentColors.slice(0, payment.length)
  };
  
  // Add some static/mock data for metrics that don't have views yet to prevent errors
  window.DASHBOARD_DATA.growthMetrics = {
    revenueGrowth: 18.4, orderGrowth: 15.2, aovGrowth: 2.7, customerGrowth: 12.6
  };
  
  window.DASHBOARD_DATA.quarterlyPerformance = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    currentYear: [3.2, 3.8, 4.1, 4.7],
    previousYear: [2.8, 3.1, 3.5, 3.9]
  };

  window.DASHBOARD_DATA.timeDistribution = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    hours: ['00', '04', '08', '12', '16', '20'],
    heatmapData: Array(7).fill(0).map(() => Array(6).fill(0).map(() => Math.random() * 100))
  };

  return true;
}

/**
 * Loads all data required for the Customer Insights dashboard
 */
async function loadCustomerData() {
  const [rfm] = await Promise.all([
    fetchView('v_rfm_segments')
  ]);

  if (!rfm) return false;

  const segmentColors = {
    'Champions': '#10b981', 'Loyal': '#3b82f6', 'Potential Loyalist': '#06b6d4',
    'New Customers': '#8b5cf6', 'Need Attention': '#f59e0b', 'At Risk': '#ef4444',
    'Hibernating': '#64748b'
  };

  window.DASHBOARD_DATA.rfmSegments = rfm.map(r => ({
    ...r,
    color: segmentColors[r.segment] || '#64748b'
  }));

  // Add mock cohort retention and clv for now 
  window.DASHBOARD_DATA.cohortRetention = {
    months: Array.from({length: 12}, (_, i) => `M${i}`),
    cohorts: [
      { cohort: 'Jan 24', size: 1200, values: [100, 25, 20, 18, 15, 12, 10, 9, 8, 7, 7, 6] }
    ]
  };
  
  window.DASHBOARD_DATA.clvDistribution = {
    labels: ['<$50', '$50-100', '$100-200', '$200-500', '$500+'],
    customers: [35000, 28000, 18000, 11000, 6265],
    colors: ['#64748b', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
  };

  return true;
}

/**
 * Loads all data required for the Product Performance dashboard
 */
async function loadProductData() {
  const [category] = await Promise.all([
    fetchView('v_category_performance')
  ]);

  if (!category) return false;

  window.DASHBOARD_DATA.categoryPerformance = {
    labels: category.map(c => c.category),
    revenue: category.map(c => c.revenue),
    orders: category.map(c => c.orders),
    growth: category.map(() => (Math.random() * 40) - 10), // Mock growth
    rating: category.map(c => c.rating)
  };

  // Calculate pareto
  let cumSum = 0;
  const total = category.reduce((sum, c) => sum + c.revenue, 0);
  window.DASHBOARD_DATA.paretoData = {
    labels: category.map(c => c.category),
    revenue: category.map(c => c.revenue),
    cumulativePct: category.map(c => {
      cumSum += c.revenue;
      return (cumSum / total) * 100;
    })
  };

  return true;
}

/**
 * Loads all data required for the Regional Analysis dashboard
 */
async function loadRegionalData() {
  const [states] = await Promise.all([
    fetchView('v_state_revenue')
  ]);

  if (!states) return false;

  window.DASHBOARD_DATA.stateRevenue = states.map(s => ({
    state: s.state,
    name: s.state, // Would normally join with state names
    revenue: s.revenue,
    orders: s.orders,
    pct: s.pct,
    avgDelivery: s.avg_delivery
  }));

  return true;
}

/**
 * Loads all data required for the Operational Metrics dashboard
 */
async function loadOperationsData() {
  const [delivery, review, sellers, payment] = await Promise.all([
    fetchView('v_delivery_performance'),
    fetchView('v_review_distribution'),
    fetchView('v_top_sellers'),
    fetchView('v_payment_methods')
  ]);

  if (!delivery) return false;

  window.DASHBOARD_DATA.deliveryPerformance = {
    labels: delivery.map(d => d.delivery_bucket),
    values: delivery.map(d => d.percentage),
    colors: ['#10b981', '#f59e0b', '#ef4444']
  };

  window.DASHBOARD_DATA.reviewDistribution = {
    labels: review.map(r => `${r.review_score} Stars`),
    values: review.map(r => r.percentage),
    counts: review.map(r => r.count),
    colors: ['#10b981', '#34d399', '#f59e0b', '#f97316', '#ef4444']
  };

  window.DASHBOARD_DATA.topSellers = sellers;

  const paymentColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  window.DASHBOARD_DATA.paymentMethods = {
    labels: payment.map(p => p.payment_type),
    amounts: payment.map(p => p.total_amount),
    values: payment.map(p => p.percentage),
    colors: paymentColors.slice(0, payment.length)
  };

  return true;
}

/**
 * General initializer that picks the correct loader based on the current page
 */
async function initDashboardData() {
  const path = window.location.pathname;
  let success = false;
  
  if (window.SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE') {
    // If not configured, inject fallback mock data immediately to prevent page crash
    console.warn("Injecting fallback mock data because Supabase is not configured.");
    injectFallbackData();
    return true;
  }

  try {
    if (path.includes('customers.html')) success = await loadCustomerData();
    else if (path.includes('products.html')) success = await loadProductData();
    else if (path.includes('regional.html')) success = await loadRegionalData();
    else if (path.includes('operations.html')) success = await loadOperationsData();
    else success = await loadExecutiveData(); // Default to index
  } catch (error) {
    console.error("Failed to load data from Supabase:", error);
    injectFallbackData();
  }
  
  return success;
}

// Fallback data generator for when Supabase is not connected
function injectFallbackData() {
  window.DASHBOARD_DATA = {
    kpiMetrics: { totalRevenue: 15800000, totalOrders: 213000, avgOrderValue: 74, activeCustomers: 98000 },
    growthMetrics: { revenueGrowth: 18.4, orderGrowth: 15.2, aovGrowth: 2.7, customerGrowth: 12.6 },
    monthlyTrend: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      revenue: [1.2e6, 1.3e6, 1.4e6, 1.35e6, 1.5e6, 1.6e6],
      orders: [15000, 16000, 17500, 16800, 18000, 19500]
    },
    orderStatus: { labels: ['Delivered','Shipped','Canceled'], values: [85, 10, 5], colors: ['#10b981', '#3b82f6', '#ef4444'] },
    quarterlyPerformance: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], currentYear: [3.2, 3.8, 4.1, 4.7], previousYear: [2.8, 3.1, 3.5, 3.9] },
    paymentMethods: { labels: ['Credit', 'Boleto'], amounts: [12e6, 3.8e6], values: [76, 24], colors: ['#3b82f6', '#f59e0b'] },
    timeDistribution: { days: ['Mon'], hours: ['00'], heatmapData: [[10]] },
    rfmSegments: [
      { segment: 'Champions', customers: 8500, pct: 8.4, revenue: 4.8e6, recency: 12, frequency: 4.5, monetary: 560, color: '#10b981' }
    ],
    cohortRetention: { months: ['M0'], cohorts: [{cohort: 'Jan', size: 100, values: [100]}] },
    clvDistribution: { labels: ['<$50'], customers: [35000], colors: ['#64748b'] },
    categoryPerformance: { labels: ['Health & Beauty'], revenue: [2.35e6], orders: [35000], growth: [12], rating: [4.2] },
    paretoData: { labels: ['Health'], revenue: [2.35e6], cumulativePct: [15] },
    stateRevenue: [ { state: 'SP', name: 'São Paulo', revenue: 6.8e6, orders: 92000, pct: 43.2, avgDelivery: 8.2 } ],
    deliveryPerformance: { labels: ['Fast'], values: [54], colors: ['#10b981'] },
    reviewDistribution: { labels: ['5 Stars'], values: [57.8], counts: [120000], colors: ['#10b981'] },
    topSellers: [ { name: 'Seller A', city: 'SP', orders: 1200, revenue: 1.5e6, rating: 4.8 } ]
  };
}
