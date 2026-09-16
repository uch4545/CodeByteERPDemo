/**
 * CodeByte ERP & Business Management Application Controller
 * Handles Navigation, Charts, Tables, Modals, Dynamic Calculators & Print Previews
 */

document.addEventListener('DOMContentLoaded', () => {
    ERPApp.init();
});

const ERPApp = {
    activeScreen: 'dashboard',
    activeTabs: {},
    charts: {},

    init: function () {
        this.bindThemeToggle();
        this.bindNavigation();
        this.bindSubtabs();
        this.bindModals();
        this.bindSearchAndFilters();
        this.bindQuickActions();

        // Initial Screen Load
        this.renderDashboard();
        this.renderAllScreens();
    },

    // Theme Toggle Handler
    bindThemeToggle: function () {
        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (!themeToggleBtn) return;
        
        const icon = themeToggleBtn.querySelector('i');
        
        const savedTheme = localStorage.getItem('erp-theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('erp-theme', 'light');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('erp-theme', 'dark');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
    },

    // Navigation Handler
    bindNavigation: function () {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetScreen = item.getAttribute('data-screen');
                if (!targetScreen) return;

                // Update active class in sidebar
                navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');

                // Switch visible screen container
                this.switchScreen(targetScreen);
            });
        });

        // Mobile Sidebar Toggle
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const sidebar = document.getElementById('appSidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }
    },

    switchScreen: function (screenId) {
        this.activeScreen = screenId;
        const screens = document.querySelectorAll('.screen-view');
        screens.forEach(s => s.classList.remove('active-screen'));

        const targetEl = document.getElementById(`screen-${screenId}`);
        if (targetEl) {
            targetEl.classList.add('active-screen');
        }

        // Update Header Title
        const titleEl = document.getElementById('headerPageTitle');
        const descEl = document.getElementById('headerPageDesc');
        const titleMap = {
            dashboard: { title: 'Business Executive Dashboard', desc: 'Real-time overview of financial health, cashflow and key operations.' },
            contacts: { title: 'Contacts & Directory', desc: 'Manage your customers, suppliers, and internal company employees.' },
            products: { title: 'Products & Inventory Management', desc: 'Track stock valuations, items list, adjustments and movement audit logs.' },
            purchases: { title: 'Purchases & Procurement', desc: 'Manage supplier bills, purchase returns, payments, and outstanding vendor dues.' },
            sales: { title: 'Sales & Revenue Management', desc: 'Create tax invoices, process customer returns, track payments and receivables.' },
            expenses: { title: 'Expense Tracking & Budgeting', desc: 'Record daily company expenses and track category budget allocations.' },
            reports: { title: 'Financial & Operational Reports', desc: 'In-depth statements including Profit & Loss, Cash Flow, Balances & Stock turnover.' },
            payroll: { title: 'Payroll & Employee Compensation', desc: 'Manage employee salary packages, generate payslips, and process salary runs.' },
            payments: { title: 'Payments (AR & AP Pipeline)', desc: 'Accounts Receivable (Customer Collections) & Accounts Payable (Supplier Dues).' },
            settings: { title: 'System Settings & Masters', desc: 'Configure company profile, chart of accounts, tax rates, financial year, and user roles.' }
        };

        if (titleMap[screenId]) {
            if (titleEl) titleEl.textContent = titleMap[screenId].title;
            if (descEl) descEl.textContent = titleMap[screenId].desc;
        }

        // Render charts or components specific to the screen if needed
        if (screenId === 'dashboard') {
            this.initDashboardCharts();
        }
    },

    // Sub-tabs handling inside screens
    bindSubtabs: function () {
        document.querySelectorAll('.subtabs-bar').forEach(bar => {
            const parentScreen = bar.closest('.screen-view');
            const buttons = bar.querySelectorAll('.subtab-btn');

            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const targetTab = btn.getAttribute('data-tab');
                    if (parentScreen) {
                        parentScreen.querySelectorAll('.subtab-content').forEach(pane => {
                            pane.classList.remove('active-tab-pane');
                        });
                        const activePane = parentScreen.querySelector(`#tab-pane-${targetTab}`);
                        if (activePane) activePane.classList.add('active-tab-pane');
                    }
                });
            });
        });
    },

    // Global Quick Action Buttons
    bindQuickActions: function () {
        // Quick New Invoice
        const qInvoice = document.getElementById('btnQuickInvoice');
        if (qInvoice) {
            qInvoice.addEventListener('click', () => this.openModal('modalNewInvoice'));
        }

        // Quick New Purchase
        const qPurchase = document.getElementById('btnQuickPurchase');
        if (qPurchase) {
            qPurchase.addEventListener('click', () => this.openModal('modalNewPurchase'));
        }

        // Quick New Expense
        const qExpense = document.getElementById('btnQuickExpense');
        if (qExpense) {
            qExpense.addEventListener('click', () => this.openModal('modalNewExpense'));
        }

        // Quick Add Contact
        const qContact = document.getElementById('btnQuickContact');
        if (qContact) {
            qContact.addEventListener('click', () => this.openModal('modalNewCustomer'));
        }

        // Quick Adjust Stock
        const qStock = document.getElementById('btnQuickStock');
        if (qStock) {
            qStock.addEventListener('click', () => this.openModal('modalAdjustStock'));
        }
    },

    // =========================================================================
    // RENDERERS FOR ALL SCREENS
    // =========================================================================
    renderAllScreens: function () {
        this.renderContacts();
        this.renderProducts();
        this.renderPurchases();
        this.renderSales();
        this.renderExpenses();
        this.renderReports();
        this.renderPayroll();
        this.renderPayments();
    },

    // 1. DASHBOARD
    renderDashboard: function () {
        const kpi = AppData.dashboardKPI;
        document.getElementById('dashPurchases').textContent = AppData.formatRs(kpi.totalPurchases);
        document.getElementById('dashPurchaseDue').textContent = AppData.formatRs(kpi.totalPurchaseDue);
        document.getElementById('dashSales').textContent = AppData.formatRs(kpi.totalSales);
        document.getElementById('dashExpenses').textContent = AppData.formatRs(kpi.totalExpenses);
        document.getElementById('dashInvoices').textContent = kpi.totalInvoices.toLocaleString();
        document.getElementById('dashInvoiceDue').textContent = AppData.formatRs(kpi.totalInvoiceDue);
        document.getElementById('dashNetCash').textContent = AppData.formatRs(kpi.netCash);

        // Recent Sales on Dashboard
        const tbody = document.getElementById('dashRecentSalesBody');
        if (tbody) {
            tbody.innerHTML = AppData.salesInvoices.slice(0, 5).map(inv => `
        <tr>
          <td><strong>${inv.id}</strong></td>
          <td>${inv.customer}</td>
          <td>${inv.date}</td>
          <td class="amount">${AppData.formatRs(inv.grandTotal)}</td>
          <td class="amount negative">${inv.dueAmount > 0 ? AppData.formatRs(inv.dueAmount) : 'Rs. 0.00'}</td>
          <td><span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span></td>
          <td>
            <button class="btn-icon-action" title="View Invoice" onclick="ERPApp.viewInvoice('${inv.id}')">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      `).join('');
        }

        // Low Stock Alert on Dashboard
        const stockTbody = document.getElementById('dashLowStockBody');
        if (stockTbody) {
            const lowItems = AppData.products.filter(p => p.stock <= p.reorderLevel);
            stockTbody.innerHTML = lowItems.map(p => `
        <tr>
          <td><strong>${p.sku}</strong></td>
          <td>${p.name}</td>
          <td><span class="badge badge-due">${p.stock} ${p.unit}</span></td>
          <td>${p.reorderLevel} ${p.unit}</td>
          <td><span class="badge badge-danger">${p.status}</span></td>
        </tr>
      `).join('');
        }

        this.initDashboardCharts();
    },

    initDashboardCharts: function () {
        // 1. Revenue vs Purchases vs Expenses Multi-Bar Chart
        const ctxRevenue = document.getElementById('chartRevenueVsExpenses');
        if (ctxRevenue) {
            if (this.charts.revenue) this.charts.revenue.destroy();
            this.charts.revenue = new Chart(ctxRevenue, {
                type: 'bar',
                data: {
                    labels: AppData.monthlyAnalytics.labels,
                    datasets: [
                        {
                            label: 'Sales Revenue (Rs.)',
                            data: AppData.monthlyAnalytics.sales,
                            backgroundColor: '#4f46e5',
                            borderRadius: 6
                        },
                        {
                            label: 'Purchases (Rs.)',
                            data: AppData.monthlyAnalytics.purchases,
                            backgroundColor: '#38bdf8',
                            borderRadius: 6
                        },
                        {
                            label: 'Operating Expenses (Rs.)',
                            data: AppData.monthlyAnalytics.expenses,
                            backgroundColor: '#f43f5e',
                            borderRadius: 6
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => ` ${ctx.dataset.label}: ${AppData.formatRs(ctx.raw)}`
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (val) => 'Rs. ' + (val / 1000000).toFixed(1) + 'M',
                                font: { size: 11 }
                            },
                            grid: { color: '#f1f5f9' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 11 } }
                        }
                    }
                }
            });
        }

        // 2. Expense Breakdown Doughnut Chart
        const ctxExpense = document.getElementById('chartExpenseBreakdown');
        if (ctxExpense) {
            if (this.charts.expenses) this.charts.expenses.destroy();
            this.charts.expenses = new Chart(ctxExpense, {
                type: 'doughnut',
                data: {
                    labels: AppData.expenseCategoriesBreakdown.labels,
                    datasets: [{
                        data: AppData.expenseCategoriesBreakdown.values,
                        backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 10, font: { size: 11 } } },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => ` ${ctx.label}: ${AppData.formatRs(ctx.raw)}`
                            }
                        }
                    },
                    cutout: '65%'
                }
            });
        }
    },

    // 2. CONTACTS (Customers, Suppliers, Employees)
    renderContacts: function () {
        // Customers Table
        const custBody = document.getElementById('tblCustomersBody');
        if (custBody) {
            custBody.innerHTML = AppData.customers.map(c => `
        <tr>
          <td><strong>${c.id}</strong></td>
          <td><strong>${c.name}</strong><br><small class="text-muted">${c.contactPerson}</small></td>
          <td>${c.phone}<br><small class="text-muted">${c.email}</small></td>
          <td>${c.city}</td>
          <td>${c.totalOrders}</td>
          <td class="amount">${AppData.formatRs(c.creditLimit)}</td>
          <td class="amount negative">${AppData.formatRs(c.balance)}</td>
          <td><span class="badge badge-${c.status.toLowerCase()}">${c.status}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn-icon-action" title="Edit Customer" onclick="ERPApp.showToast('Edit mode opened for ${c.name}', 'info')"><i class="fas fa-pencil-alt"></i></button>
              <button class="btn-icon-action" title="View Ledger" onclick="ERPApp.showToast('Customer Ledger loaded for ${c.name}', 'info')"><i class="fas fa-file-invoice-dollar"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
        }

        // Suppliers Table
        const suppBody = document.getElementById('tblSuppliersBody');
        if (suppBody) {
            suppBody.innerHTML = AppData.suppliers.map(s => `
        <tr>
          <td><strong>${s.id}</strong></td>
          <td><strong>${s.company}</strong><br><small class="text-muted">${s.contactPerson}</small></td>
          <td>${s.phone}<br><small class="text-muted">${s.email}</small></td>
          <td>${s.city}</td>
          <td><span class="badge badge-neutral">${s.terms}</span></td>
          <td class="amount negative">${AppData.formatRs(s.payables)}</td>
          <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn-icon-action" title="Pay Supplier" onclick="ERPApp.openSupplierPayModal('${s.company}', ${s.payables})"><i class="fas fa-money-bill-wave"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
        }

        // Employees Table
        const empBody = document.getElementById('tblEmployeesBody');
        if (empBody) {
            empBody.innerHTML = AppData.employees.map(e => `
        <tr>
          <td><strong>${e.id}</strong></td>
          <td><strong>${e.name}</strong></td>
          <td>${e.designation}</td>
          <td><span class="badge badge-neutral">${e.department}</span></td>
          <td>${e.phone}<br><small class="text-muted">${e.email}</small></td>
          <td class="amount">${AppData.formatRs(e.basicSalary)}</td>
          <td><span class="badge badge-${e.status === 'Active' ? 'active' : 'on-leave'}">${e.status}</span></td>
          <td>
            <button class="btn-icon-action" title="View Details" onclick="ERPApp.showToast('Viewing employee profile for ${e.name}', 'info')"><i class="fas fa-user-circle"></i></button>
          </td>
        </tr>
      `).join('');
        }
    },

    // 3. PRODUCTS & INVENTORY
    renderProducts: function () {
        // Product List
        const prdBody = document.getElementById('tblProductsBody');
        if (prdBody) {
            prdBody.innerHTML = AppData.products.map(p => `
        <tr>
          <td><strong>${p.sku}</strong></td>
          <td><strong>${p.name}</strong></td>
          <td><span class="badge badge-neutral">${p.category}</span></td>
          <td>${p.unit}</td>
          <td class="amount">${AppData.formatRs(p.purchasePrice)}</td>
          <td class="amount positive">${AppData.formatRs(p.salePrice)}</td>
          <td><strong>${p.stock}</strong></td>
          <td>${p.reorderLevel}</td>
          <td><span class="badge badge-${p.status === 'In Stock' ? 'paid' : (p.status === 'Low Stock' ? 'due' : 'unpaid')}">${p.status}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn-icon-action" title="Adjust Stock" onclick="ERPApp.openStockAdjustForProduct('${p.name}', '${p.sku}')"><i class="fas fa-sliders-h"></i></button>
            </div>
          </td>
        </tr>
      `).join('');
        }

        // Stock Adjustments
        const adjBody = document.getElementById('tblStockAdjustmentsBody');
        if (adjBody) {
            adjBody.innerHTML = AppData.stockAdjustments.map(a => `
        <tr>
          <td><strong>${a.id}</strong></td>
          <td>${a.date}</td>
          <td><strong>${a.product}</strong><br><small class="text-muted">${a.sku}</small></td>
          <td><span class="badge badge-${a.type.includes('+') ? 'paid' : 'unpaid'}">${a.type}</span></td>
          <td><strong>${a.qty}</strong></td>
          <td>${a.reason}</td>
          <td><small>${a.recordedBy}</small></td>
        </tr>
      `).join('');
        }

        // Current Stock & Valuation
        const curStockBody = document.getElementById('tblCurrentStockBody');
        if (curStockBody) {
            let totalValuation = 0;
            curStockBody.innerHTML = AppData.products.map(p => {
                const itemVal = p.stock * p.purchasePrice;
                totalValuation += itemVal;
                return `
          <tr>
            <td><strong>${p.sku}</strong></td>
            <td><strong>${p.name}</strong></td>
            <td>${p.category}</td>
            <td><strong>${p.stock} ${p.unit}</strong></td>
            <td class="amount">${AppData.formatRs(p.purchasePrice)}</td>
            <td class="amount positive">${AppData.formatRs(itemVal)}</td>
            <td><span class="badge badge-${p.status === 'In Stock' ? 'paid' : (p.status === 'Low Stock' ? 'due' : 'unpaid')}">${p.status}</span></td>
          </tr>
        `;
            }).join('');

            const valEl = document.getElementById('totalInventoryValuation');
            if (valEl) valEl.textContent = AppData.formatRs(totalValuation);
        }

        // Stock History Log
        const histBody = document.getElementById('tblStockHistoryBody');
        if (histBody) {
            histBody.innerHTML = AppData.stockHistory.map(h => `
        <tr>
          <td><strong>${h.id}</strong></td>
          <td>${h.date}</td>
          <td><strong>${h.product}</strong></td>
          <td><span class="badge badge-neutral">${h.action}</span></td>
          <td><small>${h.refNo}</small></td>
          <td><strong class="${h.qtyChange.startsWith('+') ? 'text-success' : 'text-danger'}">${h.qtyChange}</strong></td>
          <td><strong>${h.finalStock}</strong></td>
          <td><small>${h.user}</small></td>
        </tr>
      `).join('');
        }
    },

    // 4. PURCHASES
    renderPurchases: function () {
        // Purchase Invoices
        const purBody = document.getElementById('tblPurchaseInvoicesBody');
        if (purBody) {
            purBody.innerHTML = AppData.purchaseInvoices.map(pi => `
        <tr>
          <td><strong>${pi.id}</strong></td>
          <td><strong>${pi.supplier}</strong></td>
          <td>${pi.date}</td>
          <td>${pi.dueDate}</td>
          <td class="amount">${AppData.formatRs(pi.totalAmount)}</td>
          <td class="amount positive">${AppData.formatRs(pi.paidAmount)}</td>
          <td class="amount negative">${AppData.formatRs(pi.dueAmount)}</td>
          <td><span class="badge badge-${pi.status.toLowerCase()}">${pi.status}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn-icon-action" title="View Purchase Bill" onclick="ERPApp.showToast('Purchase Bill ${pi.id} loaded', 'info')"><i class="fas fa-file-invoice"></i></button>
              ${pi.dueAmount > 0 ? `<button class="btn-icon-action" title="Pay Bill" onclick="ERPApp.openSupplierPayModal('${pi.supplier}', ${pi.dueAmount})"><i class="fas fa-money-bill"></i></button>` : ''}
            </div>
          </td>
        </tr>
      `).join('');
        }

        // Purchase Returns
        const pretBody = document.getElementById('tblPurchaseReturnsBody');
        if (pretBody) {
            pretBody.innerHTML = AppData.purchaseReturns.map(pr => `
        <tr>
          <td><strong>${pr.id}</strong></td>
          <td>${pr.date}</td>
          <td><strong>${pr.supplier}</strong></td>
          <td><small>${pr.refBill}</small></td>
          <td class="amount positive">${AppData.formatRs(pr.returnAmount)}</td>
          <td>${pr.reason}</td>
          <td><span class="badge badge-settled">${pr.status}</span></td>
        </tr>
      `).join('');
        }

        // Supplier Payments
        const spayBody = document.getElementById('tblSupplierPaymentsBody');
        if (spayBody) {
            spayBody.innerHTML = AppData.supplierPayments.map(sp => `
        <tr>
          <td><strong>${sp.id}</strong></td>
          <td>${sp.date}</td>
          <td><strong>${sp.supplier}</strong></td>
          <td><small>${sp.refBill}</small></td>
          <td class="amount">${AppData.formatRs(sp.amount)}</td>
          <td>${sp.method}</td>
          <td><small>${sp.refNo}</small></td>
          <td><span class="badge badge-settled">Processed</span></td>
        </tr>
      `).join('');
        }

        // Outstanding Purchase Due
        const purDueBody = document.getElementById('tblOutstandingPurchaseDueBody');
        if (purDueBody) {
            purDueBody.innerHTML = AppData.outstandingPurchaseDue.map(pd => `
        <tr>
          <td><strong>${pd.supplier}</strong></td>
          <td>${pd.billNo}</td>
          <td>${pd.billDate}</td>
          <td>${pd.dueDate}</td>
          <td class="amount">${AppData.formatRs(pd.total)}</td>
          <td class="amount negative">${AppData.formatRs(pd.due)}</td>
          <td><span class="badge badge-due">${pd.agingDays}</span></td>
          <td>
            <button class="btn-action-primary" onclick="ERPApp.openSupplierPayModal('${pd.supplier}', ${pd.due})">
              <i class="fas fa-check-circle"></i> Settle Bill
            </button>
          </td>
        </tr>
      `).join('');
        }
    },

    // 5. SALES
    renderSales: function () {
        // Sales Invoices
        const salesBody = document.getElementById('tblSalesInvoicesBody');
        if (salesBody) {
            salesBody.innerHTML = AppData.salesInvoices.map(si => `
        <tr>
          <td><strong>${si.id}</strong></td>
          <td><strong>${si.customer}</strong></td>
          <td>${si.date}</td>
          <td>${si.dueDate}</td>
          <td class="amount">${AppData.formatRs(si.grandTotal)}</td>
          <td class="amount positive">${AppData.formatRs(si.paidAmount)}</td>
          <td class="amount negative">${AppData.formatRs(si.dueAmount)}</td>
          <td><span class="badge badge-${si.status.toLowerCase()}">${si.status}</span></td>
          <td>
            <div class="row-actions">
              <button class="btn-icon-action" title="View & Print Invoice" onclick="ERPApp.viewInvoice('${si.id}')"><i class="fas fa-eye"></i></button>
              ${si.dueAmount > 0 ? `<button class="btn-icon-action" title="Receive Payment" onclick="ERPApp.openCustomerPayModal('${si.customer}', '${si.id}', ${si.dueAmount})"><i class="fas fa-hand-holding-usd"></i></button>` : ''}
            </div>
          </td>
        </tr>
      `).join('');
        }

        // Sales Returns
        const sretBody = document.getElementById('tblSalesReturnsBody');
        if (sretBody) {
            sretBody.innerHTML = AppData.salesReturns.map(sr => `
        <tr>
          <td><strong>${sr.id}</strong></td>
          <td>${sr.date}</td>
          <td><strong>${sr.customer}</strong></td>
          <td><small>${sr.refInvoice}</small></td>
          <td class="amount negative">${AppData.formatRs(sr.returnAmount)}</td>
          <td>${sr.reason}</td>
          <td><span class="badge badge-settled">${sr.status}</span></td>
        </tr>
      `).join('');
        }

        // Customer Payments
        const cpayBody = document.getElementById('tblCustomerPaymentsBody');
        if (cpayBody) {
            cpayBody.innerHTML = AppData.customerPayments.map(cp => `
        <tr>
          <td><strong>${cp.id}</strong></td>
          <td>${cp.date}</td>
          <td><strong>${cp.customer}</strong></td>
          <td><small>${cp.refInvoice}</small></td>
          <td class="amount positive">${AppData.formatRs(cp.amount)}</td>
          <td>${cp.method}</td>
          <td><small>${cp.refNo}</small></td>
          <td><span class="badge badge-settled">Received</span></td>
        </tr>
      `).join('');
        }

        // Outstanding Invoice Due
        const invDueBody = document.getElementById('tblOutstandingInvoiceDueBody');
        if (invDueBody) {
            invDueBody.innerHTML = AppData.outstandingInvoiceDue.map(od => `
        <tr>
          <td><strong>${od.customer}</strong></td>
          <td><strong>${od.invoiceNo}</strong></td>
          <td>${od.date}</td>
          <td>${od.dueDate}</td>
          <td class="amount">${AppData.formatRs(od.total)}</td>
          <td class="amount negative">${AppData.formatRs(od.due)}</td>
          <td><span class="badge badge-${od.status.includes('Overdue') ? 'unpaid' : 'due'}">${od.status}</span></td>
          <td>
            <button class="btn-action-primary" onclick="ERPApp.openCustomerPayModal('${od.customer}', '${od.invoiceNo}', ${od.due})">
              <i class="fas fa-dollar-sign"></i> Collect Due
            </button>
          </td>
        </tr>
      `).join('');
        }
    },

    // 6. EXPENSES
    renderExpenses: function () {
        // Expenses Table
        const expBody = document.getElementById('tblExpensesBody');
        if (expBody) {
            expBody.innerHTML = AppData.expenses.map(e => `
        <tr>
          <td><strong>${e.id}</strong></td>
          <td>${e.date}</td>
          <td><strong>${e.title}</strong></td>
          <td><span class="badge badge-neutral">${e.category}</span></td>
          <td>${e.payee}</td>
          <td><small>${e.paymentMode}</small></td>
          <td class="amount negative">${AppData.formatRs(e.amount)}</td>
          <td><span class="badge badge-paid">${e.status}</span></td>
        </tr>
      `).join('');
        }

        // Expense Categories Breakdown
        const catContainer = document.getElementById('expenseCategoriesCards');
        if (catContainer) {
            catContainer.innerHTML = AppData.expenseCategories.map(c => {
                const pct = Math.min(100, Math.round((c.spent / c.budget) * 100));
                return `
          <div class="kpi-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <h4 style="font-weight:700; font-size:14px;">${c.name}</h4>
              <span class="badge ${pct > 90 ? 'badge-unpaid' : (pct > 75 ? 'badge-due' : 'badge-paid')}">${pct}% Used</span>
            </div>
            <p style="font-size:11.5px; color:#64748b; margin-bottom:12px;">${c.description}</p>
            <div style="background:#e2e8f0; height:8px; border-radius:4px; overflow:hidden; margin-bottom:10px;">
              <div style="background:${pct > 90 ? '#ef4444' : (pct > 75 ? '#f59e0b' : '#10b981')}; width:${pct}%; height:100%;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:12px;">
              <span>Spent: <strong>${AppData.formatRs(c.spent)}</strong></span>
              <span class="text-muted">Budget: ${AppData.formatRs(c.budget)}</span>
            </div>
          </div>
        `;
            }).join('');
        }
    },

    // 7. REPORTS (Profit & Loss, Cash Flow, Customer/Supplier Balances, etc.)
    renderReports: function () {
        const pnl = AppData.pnlReport;

        // Profit & Loss Tab
        const pnlEl = document.getElementById('pnlGrossSales');
        if (pnlEl) pnlEl.textContent = AppData.formatRs(pnl.grossSales);
        const pnlRetEl = document.getElementById('pnlReturns');
        if (pnlRetEl) pnlRetEl.textContent = '-' + AppData.formatRs(pnl.salesReturns);
        const pnlRevEl = document.getElementById('pnlNetRevenue');
        if (pnlRevEl) pnlRevEl.textContent = AppData.formatRs(pnl.netRevenue);
        const pnlCogsEl = document.getElementById('pnlCogs');
        if (pnlCogsEl) pnlCogsEl.textContent = '-' + AppData.formatRs(pnl.cogs);
        const pnlGpEl = document.getElementById('pnlGrossProfit');
        if (pnlGpEl) pnlGpEl.textContent = AppData.formatRs(pnl.grossProfit) + ` (${pnl.grossMarginPercent})`;

        const pnlSalEl = document.getElementById('pnlExpSalaries');
        if (pnlSalEl) pnlSalEl.textContent = AppData.formatRs(pnl.operatingExpenses.salaries);
        const pnlRentEl = document.getElementById('pnlExpRent');
        if (pnlRentEl) pnlRentEl.textContent = AppData.formatRs(pnl.operatingExpenses.rent);
        const pnlLogEl = document.getElementById('pnlExpLogistics');
        if (pnlLogEl) pnlExpLogistics.textContent = AppData.formatRs(pnl.operatingExpenses.logistics);
        const pnlUtilEl = document.getElementById('pnlExpUtilities');
        if (pnlUtilEl) pnlUtilEl.textContent = AppData.formatRs(pnl.operatingExpenses.utilities);
        const pnlMktEl = document.getElementById('pnlExpMarketing');
        if (pnlMktEl) pnlMktEl.textContent = AppData.formatRs(pnl.operatingExpenses.marketing);
        const pnlOffEl = document.getElementById('pnlExpOffice');
        if (pnlOffEl) pnlOffEl.textContent = AppData.formatRs(pnl.operatingExpenses.officeMaintenance);

        const pnlTotExpEl = document.getElementById('pnlTotalExpenses');
        if (pnlTotExpEl) pnlTotExpEl.textContent = '-' + AppData.formatRs(pnl.totalOperatingExpenses);
        const pnlNetProfitEl = document.getElementById('pnlNetProfit');
        if (pnlNetProfitEl) pnlNetProfitEl.textContent = AppData.formatRs(pnl.netProfit) + ` (Net Margin: ${pnl.netMarginPercent})`;

        // Cash Flow Table
        const cfBody = document.getElementById('tblCashFlowBody');
        if (cfBody) {
            cfBody.innerHTML = AppData.cashFlowData.map(cf => `
        <tr>
          <td><strong>${cf.month} 2026</strong></td>
          <td class="amount positive">${AppData.formatRs(cf.inflow)}</td>
          <td class="amount negative">${AppData.formatRs(cf.outflow)}</td>
          <td class="amount positive"><strong>${AppData.formatRs(cf.netFlow)}</strong></td>
          <td><span class="badge badge-paid">Positive Surplus</span></td>
        </tr>
      `).join('');
        }

        // Customer Balance Report
        const custBalBody = document.getElementById('tblCustomerBalanceReportBody');
        if (custBalBody) {
            custBalBody.innerHTML = AppData.customers.map(c => `
        <tr>
          <td><strong>${c.name}</strong></td>
          <td>${c.city}</td>
          <td class="amount">${AppData.formatRs(c.creditLimit)}</td>
          <td class="amount negative">${AppData.formatRs(c.balance)}</td>
          <td><span class="badge ${c.balance > 600000 ? 'badge-due' : 'badge-paid'}">${c.balance > 600000 ? 'High Exposure' : 'Normal'}</span></td>
        </tr>
      `).join('');
        }

        // Supplier Balance Report
        const suppBalBody = document.getElementById('tblSupplierBalanceReportBody');
        if (suppBalBody) {
            suppBalBody.innerHTML = AppData.suppliers.map(s => `
        <tr>
          <td><strong>${s.company}</strong></td>
          <td>${s.city}</td>
          <td><span class="badge badge-neutral">${s.terms}</span></td>
          <td class="amount negative">${AppData.formatRs(s.payables)}</td>
          <td><span class="badge ${s.payables > 0 ? 'badge-due' : 'badge-paid'}">${s.payables > 0 ? 'Pending Settlement' : 'Clear'}</span></td>
        </tr>
      `).join('');
        }

        // Sales Report
        const repSalesBody = document.getElementById('tblReportSalesBody');
        if (repSalesBody) {
            repSalesBody.innerHTML = AppData.salesInvoices.map(si => `
        <tr>
          <td><strong>${si.id}</strong></td>
          <td><strong>${si.customer}</strong></td>
          <td>${si.date}</td>
          <td class="amount">${AppData.formatRs(si.subtotal)}</td>
          <td class="amount">${AppData.formatRs(si.tax)}</td>
          <td class="amount positive">${AppData.formatRs(si.grandTotal)}</td>
          <td><span class="badge badge-${si.status.toLowerCase()}">${si.status}</span></td>
        </tr>
      `).join('');
        }

        // Purchase Report
        const repPurBody = document.getElementById('tblReportPurchasesBody');
        if (repPurBody) {
            repPurBody.innerHTML = AppData.purchaseInvoices.map(pi => `
        <tr>
          <td><strong>${pi.id}</strong></td>
          <td><strong>${pi.supplier}</strong></td>
          <td>${pi.date}</td>
          <td><span class="badge badge-neutral">Net 30 Days</span></td>
          <td class="amount">${AppData.formatRs(pi.totalAmount)}</td>
          <td><span class="badge badge-${pi.status.toLowerCase()}">${pi.status}</span></td>
        </tr>
      `).join('');
        }

        // Expense Report
        const repExpBody = document.getElementById('tblReportExpensesBody');
        if (repExpBody) {
            repExpBody.innerHTML = AppData.expenses.map(e => `
        <tr>
          <td><strong>${e.id}</strong></td>
          <td>${e.date}</td>
          <td><span class="badge badge-neutral">${e.category}</span></td>
          <td>${e.payee}</td>
          <td class="amount negative">${AppData.formatRs(e.amount)}</td>
          <td><span class="badge badge-paid">${e.status}</span></td>
        </tr>
      `).join('');
        }

        // Stock Report
        const repStkBody = document.getElementById('tblReportStockBody');
        if (repStkBody) {
            repStkBody.innerHTML = AppData.products.map(p => `
        <tr>
          <td><strong>${p.sku}</strong></td>
          <td><strong>${p.name}</strong></td>
          <td>${p.category}</td>
          <td><strong>${p.stock} ${p.unit}</strong></td>
          <td class="amount">${AppData.formatRs(p.purchasePrice)}</td>
          <td class="amount positive">${AppData.formatRs(p.stock * p.purchasePrice)}</td>
          <td><span class="badge badge-${p.stock > p.reorderLevel ? 'paid' : (p.stock > 0 ? 'due' : 'unpaid')}">${p.stock > p.reorderLevel ? 'Healthy' : (p.stock > 0 ? 'Reorder Needed' : 'Depleted')}</span></td>
        </tr>
      `).join('');
        }

        // Outstanding Purchase Due Report
        const repOutPurBody = document.getElementById('tblReportOutPurchaseBody');
        if (repOutPurBody) {
            repOutPurBody.innerHTML = AppData.outstandingPurchaseDue.map(pd => `
        <tr>
          <td><strong>${pd.supplier}</strong></td>
          <td><strong>${pd.billNo}</strong></td>
          <td>${pd.dueDate}</td>
          <td class="amount">${AppData.formatRs(pd.total)}</td>
          <td class="amount negative">${AppData.formatRs(pd.due)}</td>
          <td><span class="badge badge-due">${pd.agingDays}</span></td>
        </tr>
      `).join('');
        }

        // Outstanding Invoice Due Report
        const repOutInvBody = document.getElementById('tblReportOutInvoiceBody');
        if (repOutInvBody) {
            repOutInvBody.innerHTML = AppData.outstandingInvoiceDue.map(od => `
        <tr>
          <td><strong>${od.customer}</strong></td>
          <td><strong>${od.invoiceNo}</strong></td>
          <td>${od.dueDate}</td>
          <td class="amount">${AppData.formatRs(od.total)}</td>
          <td class="amount negative">${AppData.formatRs(od.due)}</td>
          <td><span class="badge badge-${od.status.includes('Overdue') ? 'unpaid' : 'due'}">${od.status}</span></td>
        </tr>
      `).join('');
        }
    },

    // 8. PAYROLL
    renderPayroll: function () {
        // Employee Salary Packages
        const salBody = document.getElementById('tblEmployeeSalaryBody');
        if (salBody) {
            salBody.innerHTML = AppData.employeeSalaries.map(s => `
        <tr>
          <td><strong>${s.empId}</strong></td>
          <td><strong>${s.name}</strong></td>
          <td><span class="badge badge-neutral">${s.grade}</span></td>
          <td class="amount">${AppData.formatRs(s.basic)}</td>
          <td class="amount positive">${AppData.formatRs(s.allowances)}</td>
          <td class="amount negative">-${AppData.formatRs(s.deductions)}</td>
          <td class="amount"><strong>${AppData.formatRs(s.netSalary)}</strong></td>
          <td>${s.paymentMode}</td>
          <td>
            <button class="btn-icon-action" title="View Breakdown" onclick="ERPApp.showToast('Salary structure details for ${s.name}', 'info')"><i class="fas fa-file-invoice"></i></button>
          </td>
        </tr>
      `).join('');
        }

        // Payslips Table
        const slipBody = document.getElementById('tblPayslipsBody');
        if (slipBody) {
            slipBody.innerHTML = AppData.payslips.map(ps => `
        <tr>
          <td><strong>${ps.slipNo}</strong></td>
          <td><strong>${ps.name}</strong><br><small class="text-muted">${ps.empId}</small></td>
          <td>${ps.designation}</td>
          <td><strong>${ps.month}</strong></td>
          <td class="amount">${AppData.formatRs(ps.basic)}</td>
          <td class="amount positive">${AppData.formatRs(ps.allowances)}</td>
          <td class="amount negative">-${AppData.formatRs(ps.deductions)}</td>
          <td class="amount positive"><strong>${AppData.formatRs(ps.netPay)}</strong></td>
          <td><span class="badge badge-paid">${ps.status}</span></td>
          <td>
            <button class="btn-icon-action" title="Print Payslip" onclick="ERPApp.viewPayslip('${ps.slipNo}')"><i class="fas fa-print"></i></button>
          </td>
        </tr>
      `).join('');
        }

        // Salary Payments Batches
        const batBody = document.getElementById('tblSalaryPaymentsBody');
        if (batBody) {
            batBody.innerHTML = AppData.salaryPayments.map(b => `
        <tr>
          <td><strong>${b.batchId}</strong></td>
          <td><strong>${b.month}</strong></td>
          <td>${b.totalStaff} Employees</td>
          <td class="amount">${AppData.formatRs(b.totalDisbursed)}</td>
          <td>${b.paymentDate}</td>
          <td><small>${b.sourceBank}</small></td>
          <td><span class="badge badge-settled">${b.status}</span></td>
        </tr>
      `).join('');
        }
    },

    // 9. PAYMENTS (Accounts Receivable & Accounts Payable)
    renderPayments: function () {
        // Accounts Receivable
        const arBody = document.getElementById('tblAccountsReceivableBody');
        if (arBody) {
            arBody.innerHTML = AppData.accountsReceivable.map(ar => `
        <tr>
          <td><strong>${ar.customer}</strong></td>
          <td class="amount">${AppData.formatRs(ar.totalInvoiced)}</td>
          <td class="amount positive">${AppData.formatRs(ar.collected)}</td>
          <td class="amount negative"><strong>${AppData.formatRs(ar.balanceDue)}</strong></td>
          <td class="amount">${AppData.formatRs(ar.current)}</td>
          <td class="amount">${AppData.formatRs(ar.days30)}</td>
          <td><span class="badge badge-${ar.risk === 'Low' ? 'paid' : 'due'}">${ar.risk} Risk</span></td>
          <td>
            <button class="btn-action-primary" onclick="ERPApp.openCustomerPayModal('${ar.customer}', 'ACC-REC', ${ar.balanceDue})">
              <i class="fas fa-hand-holding-usd"></i> Collect
            </button>
          </td>
        </tr>
      `).join('');
        }

        // Accounts Payable
        const apBody = document.getElementById('tblAccountsPayableBody');
        if (apBody) {
            apBody.innerHTML = AppData.accountsPayable.map(ap => `
        <tr>
          <td><strong>${ap.supplier}</strong></td>
          <td class="amount">${AppData.formatRs(ap.totalBilled)}</td>
          <td class="amount positive">${AppData.formatRs(ap.paid)}</td>
          <td class="amount negative"><strong>${AppData.formatRs(ap.balanceDue)}</strong></td>
          <td><span class="badge badge-due">${ap.dueInDays}</span></td>
          <td><span class="badge badge-paid">${ap.status}</span></td>
          <td>
            <button class="btn-action-primary" onclick="ERPApp.openSupplierPayModal('${ap.supplier}', ${ap.balanceDue})">
              <i class="fas fa-money-bill-wave"></i> Settle
            </button>
          </td>
        </tr>
      `).join('');
        }
    },

    // =========================================================================
    // MODAL HANDLERS & FORMS
    // =========================================================================
    bindModals: function () {
        // Close modal on close button or overlay click
        document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) modal.classList.remove('show');
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('show');
            });
        });

        // New Customer Form Submit
        const formCustomer = document.getElementById('formNewCustomer');
        if (formCustomer) {
            formCustomer.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('custName').value;
                const contact = document.getElementById('custContactPerson').value;
                const phone = document.getElementById('custPhone').value;
                const city = document.getElementById('custCity').value;
                const credit = parseFloat(document.getElementById('custCreditLimit').value) || 0;

                const newId = `CUST-00${AppData.customers.length + 1}`;
                AppData.customers.unshift({
                    id: newId,
                    name: name,
                    contactPerson: contact,
                    phone: phone,
                    email: `${name.toLowerCase().replace(/\s+/g, '')}@example.pk`,
                    city: city,
                    totalOrders: 0,
                    balance: 0,
                    creditLimit: credit,
                    status: 'Active'
                });

                this.renderContacts();
                this.closeModal('modalNewCustomer');
                this.showToast(`Customer "${name}" added successfully!`, 'success');
                formCustomer.reset();
            });
        }

        // New Supplier Form Submit
        const formSupplier = document.getElementById('formNewSupplier');
        if (formSupplier) {
            formSupplier.addEventListener('submit', (e) => {
                e.preventDefault();
                const company = document.getElementById('suppCompany').value;
                const contact = document.getElementById('suppContactPerson').value;
                const phone = document.getElementById('suppPhone').value;
                const terms = document.getElementById('suppTerms').value;
                const city = document.getElementById('suppCity').value;

                const newId = `SUP-${100 + AppData.suppliers.length + 1}`;
                AppData.suppliers.unshift({
                    id: newId,
                    company: company,
                    contactPerson: contact,
                    phone: phone,
                    email: `orders@${company.toLowerCase().replace(/\s+/g, '')}.pk`,
                    city: city,
                    payables: 0,
                    terms: terms,
                    status: 'Active'
                });

                this.renderContacts();
                this.closeModal('modalNewSupplier');
                this.showToast(`Supplier "${company}" registered successfully!`, 'success');
                formSupplier.reset();
            });
        }

        // New Employee Form Submit
        const formEmployee = document.getElementById('formNewEmployee');
        if (formEmployee) {
            formEmployee.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('empName').value;
                const desig = document.getElementById('empDesig').value;
                const dept = document.getElementById('empDept').value;
                const salary = parseFloat(document.getElementById('empBasicSalary').value) || 0;

                const newId = `EMP-0${AppData.employees.length + 1}`;
                AppData.employees.unshift({
                    id: newId,
                    name: name,
                    designation: desig,
                    department: dept,
                    phone: '+92 300 0000000',
                    email: `${name.toLowerCase().replace(/\s+/g, '.')}@codebyte.com`,
                    basicSalary: salary,
                    allowances: Math.round(salary * 0.15),
                    deductions: Math.round(salary * 0.06),
                    status: 'Active',
                    joinDate: new Date().toISOString().split('T')[0]
                });

                this.renderContacts();
                this.renderPayroll();
                this.closeModal('modalNewEmployee');
                this.showToast(`Employee "${name}" profile created!`, 'success');
                formEmployee.reset();
            });
        }

        // New Product Form Submit
        const formProduct = document.getElementById('formNewProduct');
        if (formProduct) {
            formProduct.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('prdName').value;
                const sku = document.getElementById('prdSku').value;
                const cat = document.getElementById('prdCategory').value;
                const unit = document.getElementById('prdUnit').value;
                const pPrice = parseFloat(document.getElementById('prdPurchasePrice').value) || 0;
                const sPrice = parseFloat(document.getElementById('prdSalePrice').value) || 0;
                const stock = parseInt(document.getElementById('prdInitialStock').value) || 0;

                AppData.products.unshift({
                    id: `PRD-00${AppData.products.length + 1}`,
                    sku: sku,
                    name: name,
                    category: cat,
                    unit: unit,
                    purchasePrice: pPrice,
                    salePrice: sPrice,
                    stock: stock,
                    reorderLevel: 20,
                    status: stock > 20 ? 'In Stock' : (stock > 0 ? 'Low Stock' : 'Out of Stock')
                });

                this.renderProducts();
                this.closeModal('modalNewProduct');
                this.showToast(`Product "${name}" saved in catalog!`, 'success');
                formProduct.reset();
            });
        }

        // Adjust Stock Form Submit
        const formAdjustStock = document.getElementById('formAdjustStock');
        if (formAdjustStock) {
            formAdjustStock.addEventListener('submit', (e) => {
                e.preventDefault();
                const prdName = document.getElementById('adjProductSelect').value;
                const type = document.getElementById('adjType').value;
                const qty = parseInt(document.getElementById('adjQty').value) || 0;
                const reason = document.getElementById('adjReason').value;

                const product = AppData.products.find(p => p.name === prdName);
                if (product) {
                    if (type.includes('+')) {
                        product.stock += qty;
                    } else {
                        product.stock = Math.max(0, product.stock - qty);
                    }
                    product.status = product.stock > product.reorderLevel ? 'In Stock' : (product.stock > 0 ? 'Low Stock' : 'Out of Stock');

                    AppData.stockAdjustments.unshift({
                        id: `ADJ-${1080 + AppData.stockAdjustments.length + 1}`,
                        date: new Date().toISOString().split('T')[0],
                        product: product.name,
                        sku: product.sku,
                        type: type,
                        qty: qty,
                        reason: reason,
                        recordedBy: 'Admin User'
                    });

                    AppData.stockHistory.unshift({
                        id: `LOG-${9920 + AppData.stockHistory.length + 1}`,
                        date: new Date().toISOString().split('T')[0],
                        product: product.name,
                        action: 'Stock Adjustment',
                        refNo: `ADJ-${1080 + AppData.stockAdjustments.length}`,
                        qtyChange: `${type.includes('+') ? '+' : '-'}${qty} ${product.unit}`,
                        finalStock: product.stock,
                        user: 'Admin User'
                    });

                    this.renderProducts();
                    this.renderDashboard();
                    this.closeModal('modalAdjustStock');
                    this.showToast(`Stock adjusted for "${product.name}"!`, 'success');
                    formAdjustStock.reset();
                }
            });
        }

        // Record Expense Form Submit
        const formExpense = document.getElementById('formRecordExpense');
        if (formExpense) {
            formExpense.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('expTitle').value;
                const category = document.getElementById('expCategorySelect').value;
                const payee = document.getElementById('expPayee').value;
                const amount = parseFloat(document.getElementById('expAmount').value) || 0;
                const mode = document.getElementById('expPaymentMode').value;

                AppData.expenses.unshift({
                    id: `EXP-${4010 + AppData.expenses.length + 1}`,
                    date: new Date().toISOString().split('T')[0],
                    title: title,
                    category: category,
                    payee: payee,
                    amount: amount,
                    paymentMode: mode,
                    status: 'Approved'
                });

                // Update category spent
                const cat = AppData.expenseCategories.find(c => c.name === category);
                if (cat) cat.spent += amount;

                AppData.dashboardKPI.totalExpenses += amount;
                AppData.dashboardKPI.netCash -= amount;

                this.renderExpenses();
                this.renderDashboard();
                this.closeModal('modalNewExpense');
                this.showToast(`Expense of ${AppData.formatRs(amount)} recorded!`, 'success');
                formExpense.reset();
            });
        }

        // Settle Supplier Pay Modal Submit
        const formSupplierPay = document.getElementById('formSupplierPay');
        if (formSupplierPay) {
            formSupplierPay.addEventListener('submit', (e) => {
                e.preventDefault();
                const supplier = document.getElementById('spaySupplierName').value;
                const amount = parseFloat(document.getElementById('spayAmount').value) || 0;
                const method = document.getElementById('spayMethod').value;
                const ref = document.getElementById('spayRef').value;

                AppData.supplierPayments.unshift({
                    id: `SPAY-${8010 + AppData.supplierPayments.length + 1}`,
                    date: new Date().toISOString().split('T')[0],
                    supplier: supplier,
                    refBill: 'SETTLE-DUE',
                    amount: amount,
                    method: method,
                    refNo: ref || 'TXN-' + Math.floor(100000 + Math.random() * 900000)
                });

                // Reduce Supplier payable
                const supp = AppData.suppliers.find(s => s.company === supplier);
                if (supp) supp.payables = Math.max(0, supp.payables - amount);

                AppData.dashboardKPI.totalPurchaseDue = Math.max(0, AppData.dashboardKPI.totalPurchaseDue - amount);
                AppData.dashboardKPI.netCash -= amount;

                this.renderPurchases();
                this.renderContacts();
                this.renderDashboard();
                this.renderPayments();
                this.closeModal('modalSupplierPay');
                this.showToast(`Payment of ${AppData.formatRs(amount)} to ${supplier} confirmed!`, 'success');
            });
        }

        // Customer Pay Modal Submit
        const formCustomerPay = document.getElementById('formCustomerPay');
        if (formCustomerPay) {
            formCustomerPay.addEventListener('submit', (e) => {
                e.preventDefault();
                const customer = document.getElementById('cpayCustomerName').value;
                const invId = document.getElementById('cpayInvoiceRef').value;
                const amount = parseFloat(document.getElementById('cpayAmount').value) || 0;
                const method = document.getElementById('cpayMethod').value;
                const ref = document.getElementById('cpayRef').value;

                AppData.customerPayments.unshift({
                    id: `CPAY-${9030 + AppData.customerPayments.length + 1}`,
                    date: new Date().toISOString().split('T')[0],
                    customer: customer,
                    refInvoice: invId,
                    amount: amount,
                    method: method,
                    refNo: ref || 'DEP-' + Math.floor(100000 + Math.random() * 900000)
                });

                // Update invoice if matched
                const inv = AppData.salesInvoices.find(i => i.id === invId);
                if (inv) {
                    inv.paidAmount += amount;
                    inv.dueAmount = Math.max(0, inv.grandTotal - inv.paidAmount);
                    inv.status = inv.dueAmount === 0 ? 'Paid' : 'Partial';
                }

                // Update customer balance
                const cust = AppData.customers.find(c => c.name === customer);
                if (cust) cust.balance = Math.max(0, cust.balance - amount);

                AppData.dashboardKPI.totalInvoiceDue = Math.max(0, AppData.dashboardKPI.totalInvoiceDue - amount);
                AppData.dashboardKPI.netCash += amount;

                this.renderSales();
                this.renderContacts();
                this.renderDashboard();
                this.renderPayments();
                this.closeModal('modalCustomerPay');
                this.showToast(`Payment of ${AppData.formatRs(amount)} received from ${customer}!`, 'success');
            });
        }

        // Interactive Sales Invoice Creator with Dynamic Rows
        this.initInvoiceCalculator();
    },

    initInvoiceCalculator: function () {
        const addRowBtn = document.getElementById('btnInvoiceAddRow');
        const tableBody = document.getElementById('invoiceItemsBody');

        if (addRowBtn && tableBody) {
            addRowBtn.addEventListener('click', () => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>
            <select class="form-control item-select" onchange="ERPApp.onInvoiceItemChanged(this)">
              <option value="">-- Select Product --</option>
              ${AppData.products.map(p => `<option value="${p.name}" data-price="${p.salePrice}">${p.name} (Stock: ${p.stock})</option>`).join('')}
            </select>
          </td>
          <td><input type="number" class="form-control item-qty" value="1" min="1" oninput="ERPApp.calculateInvoiceTotals()"></td>
          <td><input type="number" class="form-control item-price" value="0" min="0" oninput="ERPApp.calculateInvoiceTotals()"></td>
          <td><span class="item-linetotal amount" style="font-weight:700;">Rs. 0.00</span></td>
          <td><button type="button" class="btn-icon-action danger" onclick="this.closest('tr').remove(); ERPApp.calculateInvoiceTotals();"><i class="fas fa-trash"></i></button></td>
        `;
                tableBody.appendChild(row);
            });
        }

        const formNewInvoice = document.getElementById('formNewInvoice');
        if (formNewInvoice) {
            formNewInvoice.addEventListener('submit', (e) => {
                e.preventDefault();
                const custName = document.getElementById('invCustomerSelect').value;
                const invDate = document.getElementById('invDate').value || new Date().toISOString().split('T')[0];
                const dueDate = document.getElementById('invDueDate').value;

                const rows = document.querySelectorAll('#invoiceItemsBody tr');
                const items = [];
                let subtotal = 0;

                rows.forEach(r => {
                    const name = r.querySelector('.item-select').value;
                    const qty = parseFloat(r.querySelector('.item-qty').value) || 0;
                    const price = parseFloat(r.querySelector('.item-price').value) || 0;
                    if (name && qty > 0) {
                        const total = qty * price;
                        items.push({ name, qty, price, total });
                        subtotal += total;
                    }
                });

                if (items.length === 0) {
                    alert('Please add at least one product item to create an invoice.');
                    return;
                }

                const taxRate = parseFloat(document.getElementById('invTaxRate').value) || 0;
                const discount = parseFloat(document.getElementById('invDiscountAmount').value) || 0;
                const taxAmount = (subtotal * taxRate) / 100;
                const grandTotal = subtotal + taxAmount - discount;

                const newInvId = `INV-2026-0${AppData.salesInvoices.length + 90}`;
                const newInvoice = {
                    id: newInvId,
                    customer: custName,
                    date: invDate,
                    dueDate: dueDate,
                    items: items,
                    subtotal: subtotal,
                    tax: taxAmount,
                    discount: discount,
                    grandTotal: grandTotal,
                    paidAmount: 0,
                    dueAmount: grandTotal,
                    status: 'Due'
                };

                AppData.salesInvoices.unshift(newInvoice);
                AppData.outstandingInvoiceDue.unshift({
                    customer: custName,
                    invoiceNo: newInvId,
                    date: invDate,
                    dueDate: dueDate,
                    total: grandTotal,
                    due: grandTotal,
                    status: 'Due in 15 Days'
                });

                // Update customer balance
                const cust = AppData.customers.find(c => c.name === custName);
                if (cust) {
                    cust.balance += grandTotal;
                    cust.totalOrders += 1;
                }

                AppData.dashboardKPI.totalSales += grandTotal;
                AppData.dashboardKPI.totalInvoiceDue += grandTotal;
                AppData.dashboardKPI.totalInvoices += 1;

                this.renderSales();
                this.renderContacts();
                this.renderDashboard();
                this.renderPayments();
                this.closeModal('modalNewInvoice');
                this.showToast(`Invoice ${newInvId} created for ${custName}!`, 'success');

                // Reset Table rows
                if (tableBody) tableBody.innerHTML = '';
                this.addDefaultInvoiceRow();
            });
        }

        // Populate Customer Dropdown
        const custSelect = document.getElementById('invCustomerSelect');
        if (custSelect) {
            custSelect.innerHTML = AppData.customers.map(c => `<option value="${c.name}">${c.name} (${c.city})</option>`).join('');
        }
        const prdSelect = document.getElementById('adjProductSelect');
        if (prdSelect) {
            prdSelect.innerHTML = AppData.products.map(p => `<option value="${p.name}">${p.name} (Stock: ${p.stock})</option>`).join('');
        }

        this.addDefaultInvoiceRow();
    },

    addDefaultInvoiceRow: function () {
        const tableBody = document.getElementById('invoiceItemsBody');
        if (tableBody && tableBody.children.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>
          <select class="form-control item-select" onchange="ERPApp.onInvoiceItemChanged(this)">
            <option value="">-- Select Product --</option>
            ${AppData.products.map(p => `<option value="${p.name}" data-price="${p.salePrice}">${p.name} (Stock: ${p.stock})</option>`).join('')}
          </select>
        </td>
        <td><input type="number" class="form-control item-qty" value="1" min="1" oninput="ERPApp.calculateInvoiceTotals()"></td>
        <td><input type="number" class="form-control item-price" value="0" min="0" oninput="ERPApp.calculateInvoiceTotals()"></td>
        <td><span class="item-linetotal amount" style="font-weight:700;">Rs. 0.00</span></td>
        <td><button type="button" class="btn-icon-action danger" onclick="this.closest('tr').remove(); ERPApp.calculateInvoiceTotals();"><i class="fas fa-trash"></i></button></td>
      `;
            tableBody.appendChild(row);
        }
    },

    onInvoiceItemChanged: function (selectEl) {
        const row = selectEl.closest('tr');
        const selectedOpt = selectEl.selectedOptions[0];
        const price = selectedOpt ? (parseFloat(selectedOpt.getAttribute('data-price')) || 0) : 0;
        const priceInput = row.querySelector('.item-price');
        if (priceInput) priceInput.value = price;
        this.calculateInvoiceTotals();
    },

    calculateInvoiceTotals: function () {
        const rows = document.querySelectorAll('#invoiceItemsBody tr');
        let subtotal = 0;

        rows.forEach(r => {
            const qty = parseFloat(r.querySelector('.item-qty').value) || 0;
            const price = parseFloat(r.querySelector('.item-price').value) || 0;
            const lineTotal = qty * price;
            subtotal += lineTotal;
            const span = r.querySelector('.item-linetotal');
            if (span) span.textContent = AppData.formatRs(lineTotal);
        });

        const taxRate = parseFloat(document.getElementById('invTaxRate').value) || 0;
        const discount = parseFloat(document.getElementById('invDiscountAmount').value) || 0;
        const taxAmount = (subtotal * taxRate) / 100;
        const grandTotal = Math.max(0, subtotal + taxAmount - discount);

        document.getElementById('invSubtotalDisplay').textContent = AppData.formatRs(subtotal);
        document.getElementById('invTaxDisplay').textContent = AppData.formatRs(taxAmount);
        document.getElementById('invDiscountDisplay').textContent = '-' + AppData.formatRs(discount);
        document.getElementById('invGrandTotalDisplay').textContent = AppData.formatRs(grandTotal);
    },

    // View & Print Invoice Modal
    viewInvoice: function (invId) {
        const inv = AppData.salesInvoices.find(i => i.id === invId);
        if (!inv) return;

        const paper = document.getElementById('invoicePaperContent');
        if (paper) {
            paper.innerHTML = `
        <div class="invoice-header-block">
          <div class="company-brand-details">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
              <img src="logo.png" style="width:48px; height:48px; border-radius:8px; object-fit:cover;" alt="CodeByte Logo">
              <h2 style="font-size:22px; font-weight:800; color:#4f46e5;">CODEBYTE TECHNOLOGIES (PVT) LTD</h2>
            </div>
            <p style="font-size:12px; color:#64748b;">Industrial Area Sector I-9, Islamabad, Pakistan</p>
            <p style="font-size:12px; color:#64748b;">NTN / Sales Tax Reg: 7489201-9 | Phone: +92 51 2891000 | Email: billing@codebyte.com</p>
          </div>
          <div class="invoice-meta-block">
            <h1>TAX INVOICE</h1>
            <p><strong>Invoice #:</strong> ${inv.id}</p>
            <p><strong>Issue Date:</strong> ${inv.date}</p>
            <p><strong>Due Date:</strong> ${inv.dueDate}</p>
            <p><strong>Status:</strong> <span class="badge badge-${inv.status.toLowerCase()}">${inv.status}</span></p>
          </div>
        </div>

        <div class="invoice-parties">
          <div class="party-box">
            <h4>Billed To (Customer):</h4>
            <p style="font-size:15px; font-weight:700; color:#0f172a;">${inv.customer}</p>
            <p>NTN: 8829104-1</p>
            <p>Commercial Market, Pakistan</p>
          </div>
          <div class="party-box" style="text-align:right;">
            <h4>Payment Terms & Bank:</h4>
            <p><strong>Bank:</strong> Meezan Bank Ltd</p>
            <p><strong>IBAN:</strong> PK89MEZN0001092837461902</p>
            <p><strong>Branch:</strong> Corporate Islamic Banking</p>
          </div>
        </div>

        <table class="data-table" style="margin-bottom:20px; border:1px solid #e2e8f0;">
          <thead>
            <tr>
              <th>#</th>
              <th>Description / Item</th>
              <th>Quantity</th>
              <th>Unit Price (Rs.)</th>
              <th style="text-align:right;">Total Amount (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${inv.items.map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td><strong>${item.name}</strong></td>
                <td>${item.qty}</td>
                <td class="amount">${AppData.formatRs(item.price)}</td>
                <td class="amount" style="text-align:right;">${AppData.formatRs(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="width:50%;">
            <p style="font-size:11.5px; color:#64748b;"><strong>Notes & Declarations:</strong><br>
            All goods are supplied under standard commercial terms. Goods once sold under custom fabrication cannot be returned after 7 days.</p>
          </div>
          <div class="invoice-summary-box" style="width:300px;">
            <div class="invoice-summary-row">
              <span>Subtotal:</span>
              <strong class="amount">${AppData.formatRs(inv.subtotal)}</strong>
            </div>
            <div class="invoice-summary-row">
              <span>Sales Tax (18%):</span>
              <strong class="amount">${AppData.formatRs(inv.tax)}</strong>
            </div>
            <div class="invoice-summary-row">
              <span>Discount:</span>
              <strong class="amount negative">-${AppData.formatRs(inv.discount)}</strong>
            </div>
            <div class="invoice-summary-row total-row">
              <span>Grand Total:</span>
              <span class="amount" style="font-size:16px;">${AppData.formatRs(inv.grandTotal)}</span>
            </div>
            <div class="invoice-summary-row" style="color:#10b981; font-weight:700;">
              <span>Paid Amount:</span>
              <span>${AppData.formatRs(inv.paidAmount)}</span>
            </div>
            <div class="invoice-summary-row" style="color:#ef4444; font-weight:800; border-top:1px dashed #cbd5e1; padding-top:4px;">
              <span>Balance Due:</span>
              <span>${AppData.formatRs(inv.dueAmount)}</span>
            </div>
          </div>
        </div>
      `;
        }

        this.openModal('modalViewInvoice');
    },

    // View & Print Payslip Modal
    viewPayslip: function (slipNo) {
        const ps = AppData.payslips.find(s => s.slipNo === slipNo);
        if (!ps) return;

        const paper = document.getElementById('payslipPaperContent');
        if (paper) {
            paper.innerHTML = `
        <div class="invoice-header-block">
          <div class="company-brand-details">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
              <img src="logo.png" style="width:44px; height:44px; border-radius:8px; object-fit:cover;" alt="CodeByte Logo">
              <h2 style="font-size:20px; font-weight:800; color:#4f46e5;">CODEBYTE TECHNOLOGIES (PVT) LTD</h2>
            </div>
            <p style="font-size:12px; color:#64748b;">Monthly Employee Salary Payslip & Compensation Statement</p>
          </div>
          <div class="invoice-meta-block">
            <h2 style="font-weight:800; color:#0f172a;">PAYSLIP</h2>
            <p><strong>Payslip #:</strong> ${ps.slipNo}</p>
            <p><strong>Period:</strong> ${ps.month}</p>
            <p><strong>Disbursement Date:</strong> ${ps.issueDate}</p>
          </div>
        </div>

        <div class="invoice-parties" style="background:#f8fafc; padding:16px; border-radius:8px;">
          <div class="party-box">
            <p><strong>Employee ID:</strong> ${ps.empId}</p>
            <p><strong>Employee Name:</strong> <span style="font-size:15px; font-weight:700;">${ps.name}</span></p>
            <p><strong>Designation:</strong> ${ps.designation}</p>
          </div>
          <div class="party-box" style="text-align:right;">
            <p><strong>Payment Mode:</strong> Bank Direct Transfer</p>
            <p><strong>Account:</strong> Meezan Bank Ltd</p>
            <p><strong>Status:</strong> <span class="badge badge-paid">${ps.status}</span></p>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px; margin-bottom:20px;">
          <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <h4 style="color:#10b981; margin-bottom:10px; font-size:13px; text-transform:uppercase;">Earnings & Allowances</h4>
            <div class="invoice-summary-row" style="padding:6px 0;"><span>Basic Salary:</span><strong>${AppData.formatRs(ps.basic)}</strong></div>
            <div class="invoice-summary-row" style="padding:6px 0;"><span>House Rent Allowance:</span><strong>${AppData.formatRs(ps.allowances * 0.5)}</strong></div>
            <div class="invoice-summary-row" style="padding:6px 0;"><span>Medical & Conveyance:</span><strong>${AppData.formatRs(ps.allowances * 0.5)}</strong></div>
            <div class="invoice-summary-row total-row" style="margin-top:10px; color:#10b981;">
              <span>Total Earnings:</span><span>${AppData.formatRs(ps.basic + ps.allowances)}</span>
            </div>
          </div>

          <div style="border:1px solid #e2e8f0; border-radius:8px; padding:16px;">
            <h4 style="color:#ef4444; margin-bottom:10px; font-size:13px; text-transform:uppercase;">Deductions & Taxes</h4>
            <div class="invoice-summary-row" style="padding:6px 0;"><span>Income Tax Withholding:</span><strong>${AppData.formatRs(ps.deductions * 0.7)}</strong></div>
            <div class="invoice-summary-row" style="padding:6px 0;"><span>EOBI / Provident Contribution:</span><strong>${AppData.formatRs(ps.deductions * 0.3)}</strong></div>
            <div class="invoice-summary-row total-row" style="margin-top:10px; color:#ef4444;">
              <span>Total Deductions:</span><span>-${AppData.formatRs(ps.deductions)}</span>
            </div>
          </div>
        </div>

        <div style="background:#eef2ff; border:1px solid rgba(79,70,229,0.2); padding:16px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:13px; color:#4338ca; font-weight:600;">Net Payable Salary Amount:</span>
            <p style="font-size:11px; color:#64748b;">(Deposited directly into authorized salary account)</p>
          </div>
          <h2 style="font-size:24px; font-weight:800; color:#4f46e5; font-family:var(--font-mono);">${AppData.formatRs(ps.netPay)}</h2>
        </div>
      `;
        }

        this.openModal('modalViewPayslip');
    },

    // Open modals helper
    openModal: function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('show');
    },

    closeModal: function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('show');
    },

    openSupplierPayModal: function (supplier, dueAmount) {
        document.getElementById('spaySupplierName').value = supplier;
        document.getElementById('spayAmount').value = dueAmount || 0;
        this.openModal('modalSupplierPay');
    },

    openCustomerPayModal: function (customer, invoiceId, dueAmount) {
        document.getElementById('cpayCustomerName').value = customer;
        document.getElementById('cpayInvoiceRef').value = invoiceId;
        document.getElementById('cpayAmount').value = dueAmount || 0;
        this.openModal('modalCustomerPay');
    },

    openStockAdjustForProduct: function (prdName, sku) {
        const select = document.getElementById('adjProductSelect');
        if (select) select.value = prdName;
        this.openModal('modalAdjustStock');
    },

    // Instant Client-side Search on tables
    bindSearchAndFilters: function () {
        document.querySelectorAll('.table-search-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const tableCard = e.target.closest('.table-card');
                if (!tableCard) return;

                const rows = tableCard.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(query) ? '' : 'none';
                });
            });
        });
    },

    // Toast Notification System
    showToast: function (message, type = 'info') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icon = type === 'success' ? 'check-circle' : (type === 'error' ? 'exclamation-circle' : 'info-circle');
        toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
};
