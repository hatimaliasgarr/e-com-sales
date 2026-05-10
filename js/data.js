/* ============================================
   E-Commerce Sales Analytics Dashboard
   Pre-computed Analytics Data
   ============================================ */

const DASHBOARD_DATA = {
  // ── Executive Overview KPIs ──
  kpis: {
    totalRevenue: 15847293,
    totalOrders: 213847,
    avgOrderValue: 74.11,
    totalCustomers: 98234,
    repeatRate: 23.7,
    avgDeliveryDays: 12.4,
    reviewScore: 4.09,
    activeProducts: 32951
  },

  growth: {
    revenueYoY: 18.4,
    revenueMoM: 3.2,
    revenueQoQ: 7.8,
    ordersYoY: 15.2,
    ordersMoM: 2.8,
    customersYoY: 12.6,
    aovYoY: 2.7
  },

  // ── Monthly Revenue Trend ──
  monthlyRevenue: {
    labels: ['Jan 23','Feb 23','Mar 23','Apr 23','May 23','Jun 23','Jul 23','Aug 23','Sep 23','Oct 23','Nov 23','Dec 23',
             'Jan 24','Feb 24','Mar 24','Apr 24','May 24','Jun 24','Jul 24','Aug 24','Sep 24','Oct 24','Nov 24','Dec 24',
             'Jan 25','Feb 25','Mar 25','Apr 25'],
    revenue: [892453,845231,1023847,987234,1134829,1078234,1198234,1256789,1087234,1345678,1567234,1423456,
              1098234,987654,1189234,1134567,1298234,1187234,1378234,1423456,1234567,1498234,1723456,1598234,
              1287234,1134567,1389234,1298456],
    orders: [12034,11234,13847,13234,15234,14523,16123,16923,14623,18123,21034,19234,
             14834,13234,15934,15234,17434,15934,18534,19134,16634,20134,23234,21534,
             17334,15234,18734,17534]
  },

  // ── Order Status ──
  orderStatus: {
    labels: ['Delivered','Shipped','Processing','Cancelled','Returned'],
    values: [178234,12456,8923,7834,6400],
    colors: ['#10b981','#3b82f6','#f59e0b','#f43f5e','#8b5cf6']
  },

  // ── Sales by Category ──
  categoryPerformance: {
    labels: ['Health & Beauty','Watches & Gifts','Bed Bath Table','Sports Leisure','Computers','Furniture Decor','Auto','Garden Tools','Baby','Toys'],
    revenue: [2345678,1987234,1823456,1567234,1423456,1298234,1134567,987234,876543,765432],
    orders: [31234,26234,24567,21034,18934,17234,15234,13234,11734,10234],
    avgRating: [4.2,4.1,3.9,4.3,3.8,4.0,3.7,4.1,4.4,4.5],
    growth: [12.3,8.7,15.2,-2.4,22.1,5.6,-4.8,18.9,9.2,7.3]
  },

  // ── Payment Methods ──
  paymentMethods: {
    labels: ['Credit Card','Boleto','Voucher','Debit Card','Other'],
    values: [76.2,19.3,2.8,1.2,0.5],
    amounts: [12075734,3058568,443724,190167,79100],
    colors: ['#3b82f6','#f59e0b','#10b981','#8b5cf6','#64748b']
  },

  // ── Top States Revenue ──
  stateRevenue: [
    {state:'SP',name:'São Paulo',revenue:6845234,orders:87234,pct:43.2,avgDelivery:8.2},
    {state:'RJ',name:'Rio de Janeiro',revenue:2134567,orders:28934,pct:13.5,avgDelivery:10.4},
    {state:'MG',name:'Minas Gerais',revenue:1823456,orders:24567,pct:11.5,avgDelivery:11.8},
    {state:'RS',name:'Rio Grande do Sul',revenue:987234,orders:13234,pct:6.2,avgDelivery:14.2},
    {state:'PR',name:'Paraná',revenue:876543,orders:11734,pct:5.5,avgDelivery:13.6},
    {state:'SC',name:'Santa Catarina',revenue:654321,orders:8934,pct:4.1,avgDelivery:14.8},
    {state:'BA',name:'Bahia',revenue:543210,orders:7234,pct:3.4,avgDelivery:16.4},
    {state:'DF',name:'Distrito Federal',revenue:432109,orders:5934,pct:2.7,avgDelivery:12.2},
    {state:'GO',name:'Goiás',revenue:321098,orders:4234,pct:2.0,avgDelivery:13.4},
    {state:'ES',name:'Espírito Santo',revenue:287654,orders:3834,pct:1.8,avgDelivery:11.6}
  ],

  // ── Cohort Retention Data (%) ──
  cohortRetention: {
    cohorts: ['Jan 24','Feb 24','Mar 24','Apr 24','May 24','Jun 24','Jul 24','Aug 24','Sep 24','Oct 24','Nov 24','Dec 24'],
    months: ['M0','M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11'],
    data: [
      [100,28.4,18.2,14.6,12.3,10.8,9.4,8.2,7.6,7.1,6.8,6.4],
      [100,26.8,17.4,13.8,11.6,10.2,8.8,7.8,7.2,6.6,6.2,null],
      [100,29.2,19.6,15.4,13.2,11.4,9.8,8.6,7.8,7.2,null,null],
      [100,25.6,16.8,13.2,11.0,9.6,8.2,7.4,6.8,null,null,null],
      [100,27.8,18.8,14.8,12.6,10.8,9.2,8.0,null,null,null,null],
      [100,30.2,20.4,16.2,13.8,11.8,10.2,null,null,null,null,null],
      [100,26.4,17.6,13.6,11.4,9.8,null,null,null,null,null,null],
      [100,28.6,19.2,15.2,12.8,null,null,null,null,null,null,null],
      [100,27.2,18.0,14.2,null,null,null,null,null,null,null,null],
      [100,29.8,19.8,null,null,null,null,null,null,null,null,null],
      [100,26.0,null,null,null,null,null,null,null,null,null,null],
      [100,null,null,null,null,null,null,null,null,null,null,null]
    ]
  },

  // ── RFM Segments ──
  rfmSegments: [
    {segment:'Champions',customers:8234,revenue:4823456,recency:5,frequency:12,monetary:586,color:'#10b981',pct:8.4},
    {segment:'Loyal',customers:14567,revenue:3987234,recency:15,frequency:8,monetary:274,color:'#3b82f6',pct:14.8},
    {segment:'Potential Loyalist',customers:12345,revenue:2134567,recency:22,frequency:5,monetary:173,color:'#06b6d4',pct:12.6},
    {segment:'New Customers',customers:18923,revenue:1823456,recency:8,frequency:1,monetary:96,color:'#8b5cf6',pct:19.3},
    {segment:'Promising',customers:9876,revenue:987234,recency:18,frequency:3,monetary:100,color:'#f59e0b',pct:10.1},
    {segment:'Need Attention',customers:11234,revenue:1234567,recency:45,frequency:4,monetary:110,color:'#f97316',pct:11.4},
    {segment:'About to Sleep',customers:8765,revenue:654321,recency:60,frequency:2,monetary:75,color:'#ef4444',pct:8.9},
    {segment:'At Risk',customers:7654,revenue:543210,recency:90,frequency:3,monetary:71,color:'#f43f5e',pct:7.8},
    {segment:'Hibernating',customers:6636,revenue:321098,recency:150,frequency:1,monetary:48,color:'#64748b',pct:6.8}
  ],

  // ── Delivery Performance ──
  deliveryPerformance: {
    labels: ['1-5 days','6-10 days','11-15 days','16-20 days','21-30 days','30+ days'],
    values: [18.4,35.6,24.8,12.4,6.2,2.6],
    colors: ['#10b981','#34d399','#f59e0b','#f97316','#ef4444','#dc2626']
  },

  // ── Review Distribution ──
  reviewDistribution: {
    labels: ['5 Stars','4 Stars','3 Stars','2 Stars','1 Star'],
    values: [57.8,19.2,8.4,3.8,10.8],
    counts: [123456,41034,17945,8123,23089],
    colors: ['#10b981','#34d399','#f59e0b','#f97316','#ef4444']
  },

  // ── Quarterly Comparison ──
  quarterlyData: {
    labels: ['Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024','Q3 2024','Q4 2024','Q1 2025'],
    revenue: [2761531,3200297,3542257,4336368,3275122,3620035,4036257,4819924,3811257],
    orders: [37115,42991,47669,58391,43902,48602,54302,64902,51302]
  },

  // ── CLV Distribution ──
  clvDistribution: {
    labels: ['$0-50','$51-100','$101-200','$201-500','$501-1000','$1000+'],
    customers: [34567,28934,18234,10234,4567,1698],
    colors: ['#64748b','#8b5cf6','#3b82f6','#06b6d4','#10b981','#f59e0b']
  },

  // ── Seller Performance ──
  topSellers: [
    {id:'S001',name:'TechWorld Store',revenue:1234567,orders:4567,rating:4.6,city:'São Paulo'},
    {id:'S002',name:'Casa & Estilo',revenue:987234,orders:3456,rating:4.4,city:'Rio de Janeiro'},
    {id:'S003',name:'BeautyPro',revenue:876543,orders:3234,rating:4.3,city:'Belo Horizonte'},
    {id:'S004',name:'SportMax',revenue:765432,orders:2876,rating:4.5,city:'Curitiba'},
    {id:'S005',name:'FashionHub',revenue:654321,orders:2567,rating:4.2,city:'Porto Alegre'}
  ],

  // ── Pareto Data ──
  paretoData: {
    labels: ['Health & Beauty','Watches','Bed Bath','Sports','Computers','Furniture','Auto','Garden','Baby','Toys','Telecom','Electronics','Stationery','Food','Luggage'],
    revenue: [2345678,1987234,1823456,1567234,1423456,1298234,1134567,987234,876543,765432,654321,543210,432109,321098,210987],
  },

  // ── Hourly Orders Pattern ──
  hourlyOrders: {
    labels: Array.from({length:24},(_, i) => `${i}:00`),
    values: [1234,876,543,321,234,456,1234,2345,4567,6789,8234,9123,8765,7654,6543,7234,8234,9876,8765,7234,5678,4321,3210,2345]
  },

  // ── Weekly Trend ──
  weeklyTrend: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    orders: [32456,34567,33234,35678,31234,24567,21987],
    revenue: [2456789,2678234,2534567,2789234,2387234,1876543,1623456]
  }
};
