/**
 * CodeByte ERP & Business Management Demo - Mock Dataset & State Store
 * All currencies strictly formatted with "Rs."
 */

const AppData = {
    // Utility Currency Formatter
    formatRs: function (amount) {
        if (isNaN(amount) || amount === null || amount === undefined) amount = 0;
        return 'Rs. ' + Number(amount).toLocaleString('en-PK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    // 1. Dashboard KPI Data
    dashboardKPI: {
        totalPurchases: 14850000,
        totalPurchaseDue: 1850000,
        totalSales: 28950000,
        totalExpenses: 4250000,
        totalInvoices: 1420,
        totalInvoiceDue: 2480000,
        netCash: 11450000
    },

    // Monthly Trend Chart Data
    monthlyAnalytics: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        sales: [2100000, 2450000, 2800000, 2300000, 3100000, 2900000, 3400000, 3150000, 3600000, 3850000, 4100000, 4500000],
        purchases: [1200000, 1350000, 1500000, 1100000, 1650000, 1400000, 1800000, 1750000, 1900000, 2050000, 2200000, 2400000],
        expenses: [320000, 350000, 410000, 380000, 420000, 390000, 450000, 430000, 470000, 490000, 520000, 560000]
    },

    // Expense Split
    expenseCategoriesBreakdown: {
        labels: ['Warehouse Rent', 'Staff Salaries', 'Logistics & Fuel', 'Marketing & Ads', 'Utilities & Power', 'Office Supplies'],
        values: [850000, 1950000, 420000, 380000, 390000, 260000]
    },

    // 2. Contacts Data
    customers: [
        { id: 'CUST-001', name: 'Al-Madina Traders', contactPerson: 'Bilal Farooq', phone: '+92 300 1234567', email: 'bilal@almadina.pk', city: 'Lahore', totalOrders: 42, balance: 450000, creditLimit: 1000000, status: 'Active' },
        { id: 'CUST-002', name: 'Apex Engineering Corp', contactPerson: 'Hamza Sheikh', phone: '+92 321 9876543', email: 'hamza@apexeng.com', city: 'Karachi', totalOrders: 28, balance: 820000, creditLimit: 1500000, status: 'Active' },
        { id: 'CUST-003', name: 'Prime Mega Store', contactPerson: 'Ayesha Malik', phone: '+92 333 4567890', email: 'ayesha@primestore.com', city: 'Islamabad', totalOrders: 65, balance: 0, creditLimit: 2000000, status: 'Active' },
        { id: 'CUST-004', name: 'Zenith Logistics Ltd', contactPerson: 'Usman Ghani', phone: '+92 345 6789012', email: 'usman@zenith.pk', city: 'Faisalabad', totalOrders: 19, balance: 640000, creditLimit: 800000, status: 'Active' },
        { id: 'CUST-005', name: 'Haidery Auto Spares', contactPerson: 'Tariq Haider', phone: '+92 301 2345678', email: 'tariq@haidery.com', city: 'Rawalpindi', totalOrders: 31, balance: 570000, creditLimit: 900000, status: 'Active' },
        { id: 'CUST-006', name: 'Crescent Mart', contactPerson: 'Nasir Iqbal', phone: '+92 312 8765432', email: 'nasir@crescentmart.pk', city: 'Multan', totalOrders: 12, balance: 0, creditLimit: 500000, status: 'Inactive' }
    ],

    suppliers: [
        { id: 'SUP-101', company: 'Pak Steel Rolling Mills', contactPerson: 'Zubair Butt', phone: '+92 302 5551234', email: 'orders@paksteel.pk', city: 'Lahore', payables: 850000, terms: 'Net 30 Days', status: 'Active' },
        { id: 'SUP-102', company: 'Indus Polychem Industries', contactPerson: 'Khalid Mehmood', phone: '+92 322 4449876', email: 'khalid@induschem.com', city: 'Karachi', payables: 420000, terms: 'Net 15 Days', status: 'Active' },
        { id: 'SUP-103', company: 'Global Electronic Parts', contactPerson: 'Suleman Khan', phone: '+92 334 3334567', email: 'sales@globalelec.pk', city: 'Islamabad', payables: 580000, terms: 'Net 45 Days', status: 'Active' },
        { id: 'SUP-104', company: 'National Packaging Ltd', contactPerson: 'Farhan Zaidi', phone: '+92 315 2226789', email: 'farhan@natpack.com', city: 'Gujranwala', payables: 0, terms: 'Cash on Delivery', status: 'Active' },
        { id: 'SUP-105', company: 'Crown Allied Hardware', contactPerson: 'Rehan Qureshi', phone: '+92 346 1118901', email: 'rehan@crownhardware.pk', city: 'Sialkot', payables: 0, terms: 'Net 30 Days', status: 'Active' }
    ],

    employees: [
        { id: 'EMP-01', name: 'Muhammad Ali', designation: 'Senior Accountant', department: 'Finance', phone: '+92 300 7771234', email: 'ali.finance@codebyte.com', basicSalary: 145000, allowances: 25000, deductions: 12000, status: 'Active', joinDate: '2023-02-15' },
        { id: 'EMP-02', name: 'Sara Kamran', designation: 'Operations Lead', department: 'Operations', phone: '+92 321 8882345', email: 'sara.k@codebyte.com', basicSalary: 175000, allowances: 30000, deductions: 15000, status: 'Active', joinDate: '2022-06-01' },
        { id: 'EMP-03', name: 'Kashif Mehmood', designation: 'Inventory Supervisor', department: 'Warehouse', phone: '+92 333 9993456', email: 'kashif.m@codebyte.com', basicSalary: 95000, allowances: 15000, deductions: 6500, status: 'Active', joinDate: '2023-08-10' },
        { id: 'EMP-04', name: 'Zainab Fatima', designation: 'Sales Executive', department: 'Sales', phone: '+92 345 1114567', email: 'zainab.f@codebyte.com', basicSalary: 110000, allowances: 35000, deductions: 9000, status: 'Active', joinDate: '2024-01-15' },
        { id: 'EMP-05', name: 'Omer Rasheed', designation: 'Supply Chain Officer', department: 'Procurement', phone: '+92 312 2225678', email: 'omer.r@codebyte.com', basicSalary: 125000, allowances: 20000, deductions: 10500, status: 'Active', joinDate: '2023-11-20' },
        { id: 'EMP-06', name: 'Rana Noman', designation: 'Field Technician', department: 'Maintenance', phone: '+92 301 3336789', email: 'noman@codebyte.com', basicSalary: 75000, allowances: 12000, deductions: 4000, status: 'On Leave', joinDate: '2024-03-01' }
    ],

    // 3. Products & Stock Data
    products: [
        { id: 'PRD-001', sku: 'ALU-PRO-40', name: 'Heavy Duty Aluminum Beam 40mm', category: 'Raw Materials', unit: 'Pcs', purchasePrice: 4200, salePrice: 6500, stock: 240, reorderLevel: 50, status: 'In Stock' },
        { id: 'PRD-002', sku: 'VAL-SS-02', name: 'Stainless Steel Gate Valve 2-Inch', category: 'Hardware', unit: 'Pcs', purchasePrice: 2800, salePrice: 4500, stock: 115, reorderLevel: 30, status: 'In Stock' },
        { id: 'PRD-003', sku: 'HYD-OIL-20L', name: 'Industrial Hydraulic Oil ISO 68 (20L)', category: 'Lubricants', unit: 'Bucket', purchasePrice: 9500, salePrice: 13800, stock: 18, reorderLevel: 25, status: 'Low Stock' },
        { id: 'PRD-004', sku: 'COP-WIR-100M', name: 'Pure Copper Wiring Coil 100M', category: 'Electrical', unit: 'Roll', purchasePrice: 14000, salePrice: 19500, stock: 45, reorderLevel: 20, status: 'In Stock' },
        { id: 'PRD-005', sku: 'FAS-HEX-M12', name: 'High-Tensile Hex Bolt M12 Box (100pc)', category: 'Fasteners', unit: 'Box', purchasePrice: 1800, salePrice: 3200, stock: 8, reorderLevel: 15, status: 'Low Stock' },
        { id: 'PRD-006', sku: 'CIR-BRK-3P', name: 'Industrial 3-Phase Circuit Breaker 63A', category: 'Electrical', unit: 'Pcs', purchasePrice: 6800, salePrice: 11200, stock: 62, reorderLevel: 15, status: 'In Stock' },
        { id: 'PRD-007', sku: 'PVC-PIP-4IN', name: 'Reinforced PVC Schedule 40 Pipe (4")', category: 'Plumbing', unit: 'Length', purchasePrice: 3100, salePrice: 4900, stock: 0, reorderLevel: 20, status: 'Out of Stock' }
    ],

    stockAdjustments: [
        { id: 'ADJ-1081', date: '2026-08-08', product: 'Industrial Hydraulic Oil ISO 68 (20L)', sku: 'HYD-OIL-20L', type: 'Reduction (-)', qty: 2, reason: 'Damaged in transit', recordedBy: 'Kashif Mehmood' },
        { id: 'ADJ-1080', date: '2026-08-05', product: 'High-Tensile Hex Bolt M12 Box', sku: 'FAS-HEX-M12', type: 'Addition (+)', qty: 5, reason: 'Physical recount surplus', recordedBy: 'Kashif Mehmood' },
        { id: 'ADJ-1079', date: '2026-07-28', product: 'Heavy Duty Aluminum Beam 40mm', sku: 'ALU-PRO-40', type: 'Addition (+)', qty: 10, reason: 'Found during warehouse audit', recordedBy: 'Sara Kamran' },
        { id: 'ADJ-1078', date: '2026-07-15', product: 'Stainless Steel Gate Valve 2-Inch', sku: 'VAL-SS-02', type: 'Reduction (-)', qty: 3, reason: 'Defective seal batch', recordedBy: 'Kashif Mehmood' }
    ],

    stockHistory: [
        { id: 'LOG-9921', date: '2026-08-10', product: 'Pure Copper Wiring Coil 100M', action: 'Sales Dispatch', refNo: 'INV-2026-089', qtyChange: '-15 Roll', finalStock: 45, user: 'Zainab Fatima' },
        { id: 'LOG-9920', date: '2026-08-09', product: 'Industrial Hydraulic Oil ISO 68 (20L)', action: 'Purchase Received', refNo: 'PUR-2026-044', qtyChange: '+20 Bucket', finalStock: 20, user: 'Omer Rasheed' },
        { id: 'LOG-9919', date: '2026-08-08', product: 'Industrial Hydraulic Oil ISO 68 (20L)', action: 'Stock Adjustment', refNo: 'ADJ-1081', qtyChange: '-2 Bucket', finalStock: 18, user: 'Kashif Mehmood' },
        { id: 'LOG-9918', date: '2026-08-07', product: 'Heavy Duty Aluminum Beam 40mm', action: 'Sales Dispatch', refNo: 'INV-2026-088', qtyChange: '-30 Pcs', finalStock: 240, user: 'Zainab Fatima' },
        { id: 'LOG-9917', date: '2026-08-06', product: 'Stainless Steel Gate Valve 2-Inch', action: 'Purchase Received', refNo: 'PUR-2026-043', qtyChange: '+50 Pcs', finalStock: 115, user: 'Omer Rasheed' }
    ],

    // 4. Purchases Data
    purchaseInvoices: [
        { id: 'PUR-2026-044', supplier: 'Indus Polychem Industries', date: '2026-08-09', dueDate: '2026-08-24', totalAmount: 420000, paidAmount: 0, dueAmount: 420000, status: 'Due' },
        { id: 'PUR-2026-043', supplier: 'Pak Steel Rolling Mills', date: '2026-08-06', dueDate: '2026-09-05', totalAmount: 1850000, paidAmount: 1000000, dueAmount: 850000, status: 'Partial' },
        { id: 'PUR-2026-042', supplier: 'Global Electronic Parts', date: '2026-08-01', dueDate: '2026-09-15', totalAmount: 580000, paidAmount: 0, dueAmount: 580000, status: 'Due' },
        { id: 'PUR-2026-041', supplier: 'National Packaging Ltd', date: '2026-07-25', dueDate: '2026-07-25', totalAmount: 340000, paidAmount: 340000, dueAmount: 0, status: 'Paid' },
        { id: 'PUR-2026-040', supplier: 'Crown Allied Hardware', date: '2026-07-18', dueDate: '2026-08-17', totalAmount: 760000, paidAmount: 760000, dueAmount: 0, status: 'Paid' }
    ],

    purchaseReturns: [
        { id: 'PRET-2026-06', date: '2026-08-02', supplier: 'Pak Steel Rolling Mills', refBill: 'PUR-2026-039', returnAmount: 95000, reason: 'Thickness specification mismatch', status: 'Settled' },
        { id: 'PRET-2026-05', date: '2026-07-12', supplier: 'Global Electronic Parts', refBill: 'PUR-2026-036', returnAmount: 48000, reason: 'Damaged terminal casing', status: 'Settled' }
    ],

    supplierPayments: [
        { id: 'SPAY-8012', date: '2026-08-07', supplier: 'Pak Steel Rolling Mills', refBill: 'PUR-2026-043', amount: 1000000, method: 'Bank Transfer (Meezan Bank)', refNo: 'TXN-998822' },
        { id: 'SPAY-8011', date: '2026-07-25', supplier: 'National Packaging Ltd', refBill: 'PUR-2026-041', amount: 340000, method: 'Pay Order (HBL)', refNo: 'PO-774411' },
        { id: 'SPAY-8010', date: '2026-07-18', supplier: 'Crown Allied Hardware', refBill: 'PUR-2026-040', amount: 760000, method: 'Online Banking (Alfalah)', refNo: 'TXN-554433' }
    ],

    outstandingPurchaseDue: [
        { supplier: 'Pak Steel Rolling Mills', billNo: 'PUR-2026-043', billDate: '2026-08-06', dueDate: '2026-09-05', total: 1850000, due: 850000, agingDays: '6 Days' },
        { supplier: 'Global Electronic Parts', billNo: 'PUR-2026-042', billDate: '2026-08-01', dueDate: '2026-09-15', total: 580000, due: 580000, agingDays: '10 Days' },
        { supplier: 'Indus Polychem Industries', billNo: 'PUR-2026-044', billDate: '2026-08-09', dueDate: '2026-08-24', total: 420000, due: 420000, agingDays: '2 Days' }
    ],

    // 5. Sales Data
    salesInvoices: [
        {
            id: 'INV-2026-089',
            customer: 'Al-Madina Traders',
            date: '2026-08-10',
            dueDate: '2026-08-25',
            items: [
                { name: 'Heavy Duty Aluminum Beam 40mm', qty: 30, price: 6500, total: 195000 },
                { name: 'Pure Copper Wiring Coil 100M', qty: 15, price: 19500, total: 292500 }
            ],
            subtotal: 487500,
            tax: 87750,
            discount: 25250,
            grandTotal: 550000,
            paidAmount: 100000,
            dueAmount: 450000,
            status: 'Partial'
        },
        {
            id: 'INV-2026-088',
            customer: 'Apex Engineering Corp',
            date: '2026-08-07',
            dueDate: '2026-08-22',
            items: [
                { name: 'Industrial 3-Phase Circuit Breaker 63A', qty: 25, price: 11200, total: 280000 },
                { name: 'Stainless Steel Gate Valve 2-Inch', qty: 40, price: 4500, total: 180000 },
                { name: 'Reinforced PVC Schedule 40 Pipe (4")', qty: 80, price: 4900, total: 392000 }
            ],
            subtotal: 852000,
            tax: 153360,
            discount: 35360,
            grandTotal: 970000,
            paidAmount: 150000,
            dueAmount: 820000,
            status: 'Partial'
        },
        {
            id: 'INV-2026-087',
            customer: 'Prime Mega Store',
            date: '2026-08-03',
            dueDate: '2026-08-18',
            items: [
                { name: 'Heavy Duty Aluminum Beam 40mm', qty: 50, price: 6500, total: 325000 },
                { name: 'Pure Copper Wiring Coil 100M', qty: 20, price: 19500, total: 390000 }
            ],
            subtotal: 715000,
            tax: 128700,
            discount: 23700,
            grandTotal: 820000,
            paidAmount: 820000,
            dueAmount: 0,
            status: 'Paid'
        },
        {
            id: 'INV-2026-086',
            customer: 'Zenith Logistics Ltd',
            date: '2026-07-29',
            dueDate: '2026-08-13',
            items: [
                { name: 'Industrial Hydraulic Oil ISO 68 (20L)', qty: 30, price: 13800, total: 414000 },
                { name: 'High-Tensile Hex Bolt M12 Box', qty: 60, price: 3200, total: 192000 }
            ],
            subtotal: 606000,
            tax: 109080,
            discount: 25080,
            grandTotal: 690000,
            paidAmount: 50000,
            dueAmount: 640000,
            status: 'Due'
        },
        {
            id: 'INV-2026-085',
            customer: 'Haidery Auto Spares',
            date: '2026-07-20',
            dueDate: '2026-08-04',
            items: [
                { name: 'Stainless Steel Gate Valve 2-Inch', qty: 50, price: 4500, total: 225000 },
                { name: 'Industrial Hydraulic Oil ISO 68 (20L)', qty: 25, price: 13800, total: 345000 }
            ],
            subtotal: 570000,
            tax: 102600,
            discount: 22600,
            grandTotal: 650000,
            paidAmount: 80000,
            dueAmount: 570000,
            status: 'Overdue'
        }
    ],

    salesReturns: [
        { id: 'SRET-2026-11', date: '2026-08-04', customer: 'Al-Madina Traders', refInvoice: 'INV-2026-084', returnAmount: 65000, reason: 'Excess quantity returned in sealed pack', status: 'Approved' },
        { id: 'SRET-2026-10', date: '2026-07-16', customer: 'Apex Engineering Corp', refInvoice: 'INV-2026-079', returnAmount: 45000, reason: 'Customer client cancelation', status: 'Approved' }
    ],

    customerPayments: [
        { id: 'CPAY-9031', date: '2026-08-10', customer: 'Al-Madina Traders', refInvoice: 'INV-2026-089', amount: 100000, method: 'Direct Bank Deposit (Meezan)', refNo: 'DEP-449911' },
        { id: 'CPAY-9030', date: '2026-08-07', customer: 'Apex Engineering Corp', refInvoice: 'INV-2026-088', amount: 150000, method: 'Online Transfer (Habib Metro)', refNo: 'FT-776622' },
        { id: 'CPAY-9029', date: '2026-08-03', customer: 'Prime Mega Store', refInvoice: 'INV-2026-087', amount: 820000, method: 'Cheque Cleared (MCB)', refNo: 'CHQ-009182' },
        { id: 'CPAY-9028', date: '2026-07-29', customer: 'Zenith Logistics Ltd', refInvoice: 'INV-2026-086', amount: 50000, method: 'Cash Deposit', refNo: 'CSH-1082' }
    ],

    outstandingInvoiceDue: [
        { customer: 'Apex Engineering Corp', invoiceNo: 'INV-2026-088', date: '2026-08-07', dueDate: '2026-08-22', total: 970000, due: 820000, status: 'Due in 11 Days' },
        { customer: 'Zenith Logistics Ltd', invoiceNo: 'INV-2026-086', date: '2026-07-29', dueDate: '2026-08-13', total: 690000, due: 640000, status: 'Due in 2 Days' },
        { customer: 'Haidery Auto Spares', invoiceNo: 'INV-2026-085', date: '2026-07-20', dueDate: '2026-08-04', total: 650000, due: 570000, status: 'Overdue by 7 Days' },
        { customer: 'Al-Madina Traders', invoiceNo: 'INV-2026-089', date: '2026-08-10', dueDate: '2026-08-25', total: 550000, due: 450000, status: 'Due in 14 Days' }
    ],

    // 6. Expenses Data
    expenses: [
        { id: 'EXP-4011', date: '2026-08-10', title: 'Office Fiber Internet & Dedicated IP', category: 'Utilities & Power', payee: 'StormFiber Enterprise', amount: 35000, paymentMode: 'Online Bank', status: 'Approved' },
        { id: 'EXP-4010', date: '2026-08-08', title: 'Forklift Hydraulic Cylinder Repair', category: 'Maintenance & Repairs', payee: 'Master Heavy Repairs', amount: 48000, paymentMode: 'Cash Voucher', status: 'Approved' },
        { id: 'EXP-4009', date: '2026-08-05', title: 'Monthly Warehouse Facility Lease (Lahore)', category: 'Warehouse Rent', payee: 'Sultan Properties Trust', amount: 450000, paymentMode: 'Pay Order (HBL)', status: 'Approved' },
        { id: 'EXP-4008', date: '2026-08-03', title: 'Industrial Diesel Fuel for Delivery Fleet', category: 'Logistics & Fuel', payee: 'PSO Service Station #4', amount: 142000, paymentMode: 'Fleet Card', status: 'Approved' },
        { id: 'EXP-4007', date: '2026-08-01', title: 'Q3 Google & Facebook Lead Generation Ads', category: 'Marketing & Ads', payee: 'Digital Boost Agency', amount: 180000, paymentMode: 'Credit Card', status: 'Approved' },
        { id: 'EXP-4006', date: '2026-07-28', title: 'Office Stationery, Cartridges & Paper Reams', category: 'Office Supplies', payee: 'Paper Mart Cantt', amount: 28500, paymentMode: 'Petty Cash', status: 'Approved' }
    ],

    expenseCategories: [
        { name: 'Warehouse Rent', budget: 500000, spent: 450000, description: 'Lease and facility rent for main storehouses' },
        { name: 'Staff Salaries', budget: 2200000, spent: 1950000, description: 'Monthly payroll, bonuses and staff overtime' },
        { name: 'Logistics & Fuel', budget: 500000, spent: 420000, description: 'Diesel, toll taxes, delivery driver allowances' },
        { name: 'Utilities & Power', budget: 450000, spent: 390000, description: 'LESCO commercial electricity, gas and internet' },
        { name: 'Marketing & Ads', budget: 400000, spent: 380000, description: 'Digital advertising, print brochures, client gifts' },
        { name: 'Maintenance & Repairs', budget: 300000, spent: 175000, description: 'Machinery servicing, electrical repairs, painting' },
        { name: 'Office Supplies', budget: 200000, spent: 120000, description: 'Stationery, refreshments, toner and cleaning' }
    ],

    // 7. Reports Data
    pnlReport: {
        period: 'Current Fiscal Year (2026)',
        grossSales: 28950000,
        salesReturns: 110000,
        netRevenue: 28840000,
        cogs: 16200000,
        grossProfit: 12640000,
        grossMarginPercent: '43.8%',
        operatingExpenses: {
            salaries: 1950000,
            rent: 850000,
            logistics: 420000,
            utilities: 390000,
            marketing: 380000,
            officeMaintenance: 260000
        },
        totalOperatingExpenses: 4250000,
        operatingIncome: 8390000,
        taxProvision: 839000,
        netProfit: 7551000,
        netMarginPercent: '26.2%'
    },

    cashFlowData: [
        { month: 'Jan', inflow: 2450000, outflow: 1650000, netFlow: 800000 },
        { month: 'Feb', inflow: 2780000, outflow: 1850000, netFlow: 930000 },
        { month: 'Mar', inflow: 3100000, outflow: 2100000, netFlow: 1000000 },
        { month: 'Apr', inflow: 2600000, outflow: 1700000, netFlow: 900000 },
        { month: 'May', inflow: 3450000, outflow: 2300000, netFlow: 1150000 },
        { month: 'Jun', inflow: 3200000, outflow: 2050000, netFlow: 1150000 },
        { month: 'Jul', inflow: 3800000, outflow: 2450000, netFlow: 1350000 },
        { month: 'Aug', inflow: 3600000, outflow: 2200000, netFlow: 1400000 }
    ],

    // 8. Payroll Data
    employeeSalaries: [
        { empId: 'EMP-01', name: 'Muhammad Ali', grade: 'Grade A-2', basic: 145000, allowances: 25000, deductions: 12000, netSalary: 158000, paymentMode: 'Bank Transfer' },
        { empId: 'EMP-02', name: 'Sara Kamran', grade: 'Grade M-1', basic: 175000, allowances: 30000, deductions: 15000, netSalary: 190000, paymentMode: 'Bank Transfer' },
        { empId: 'EMP-03', name: 'Kashif Mehmood', grade: 'Grade B-1', basic: 95000, allowances: 15000, deductions: 6500, netSalary: 103500, paymentMode: 'Bank Transfer' },
        { empId: 'EMP-04', name: 'Zainab Fatima', grade: 'Grade S-2', basic: 110000, allowances: 35000, deductions: 9000, netSalary: 136000, paymentMode: 'Bank Transfer' },
        { empId: 'EMP-05', name: 'Omer Rasheed', grade: 'Grade P-1', basic: 125000, allowances: 20000, deductions: 10500, netSalary: 134500, paymentMode: 'Bank Transfer' },
        { empId: 'EMP-06', name: 'Rana Noman', grade: 'Grade T-3', basic: 75000, allowances: 12000, deductions: 4000, netSalary: 83000, paymentMode: 'Cheque' }
    ],

    payslips: [
        { slipNo: 'PS-2026-0801', empId: 'EMP-01', name: 'Muhammad Ali', designation: 'Senior Accountant', month: 'July 2026', basic: 145000, allowances: 25000, deductions: 12000, netPay: 158000, issueDate: '2026-08-01', status: 'Disbursed' },
        { slipNo: 'PS-2026-0802', empId: 'EMP-02', name: 'Sara Kamran', designation: 'Operations Lead', month: 'July 2026', basic: 175000, allowances: 30000, deductions: 15000, netPay: 190000, issueDate: '2026-08-01', status: 'Disbursed' },
        { slipNo: 'PS-2026-0803', empId: 'EMP-03', name: 'Kashif Mehmood', designation: 'Inventory Supervisor', month: 'July 2026', basic: 95000, allowances: 15000, deductions: 6500, netPay: 103500, issueDate: '2026-08-01', status: 'Disbursed' },
        { slipNo: 'PS-2026-0804', empId: 'EMP-04', name: 'Zainab Fatima', designation: 'Sales Executive', month: 'July 2026', basic: 110000, allowances: 35000, deductions: 9000, netPay: 136000, issueDate: '2026-08-01', status: 'Disbursed' },
        { slipNo: 'PS-2026-0805', empId: 'EMP-05', name: 'Omer Rasheed', designation: 'Supply Chain Officer', month: 'July 2026', basic: 125000, allowances: 20000, deductions: 10500, netPay: 134500, issueDate: '2026-08-01', status: 'Disbursed' }
    ],

    salaryPayments: [
        { batchId: 'BATCH-PAY-2607', month: 'July 2026', totalStaff: 6, totalDisbursed: 805000, paymentDate: '2026-08-01', sourceBank: 'Meezan Bank - Corporate A/C', status: 'Completed' },
        { batchId: 'BATCH-PAY-2606', month: 'June 2026', totalStaff: 6, totalDisbursed: 795000, paymentDate: '2026-07-01', sourceBank: 'Meezan Bank - Corporate A/C', status: 'Completed' },
        { batchId: 'BATCH-PAY-2605', month: 'May 2026', totalStaff: 5, totalDisbursed: 720000, paymentDate: '2026-06-01', sourceBank: 'Meezan Bank - Corporate A/C', status: 'Completed' }
    ],

    // 9. Payments (Accounts Receivable & Accounts Payable)
    accountsReceivable: [
        { customer: 'Apex Engineering Corp', totalInvoiced: 2450000, collected: 1630000, balanceDue: 820000, current: 820000, days30: 0, days60Plus: 0, risk: 'Low' },
        { customer: 'Zenith Logistics Ltd', totalInvoiced: 1890000, collected: 1250000, balanceDue: 640000, current: 640000, days30: 0, days60Plus: 0, risk: 'Low' },
        { customer: 'Haidery Auto Spares', totalInvoiced: 1540000, collected: 970000, balanceDue: 570000, current: 0, days30: 570000, days60Plus: 0, risk: 'Medium' },
        { customer: 'Al-Madina Traders', totalInvoiced: 3200000, collected: 2750000, balanceDue: 450000, current: 450000, days30: 0, days60Plus: 0, risk: 'Low' }
    ],

    accountsPayable: [
        { supplier: 'Pak Steel Rolling Mills', totalBilled: 3850000, paid: 3000000, balanceDue: 850000, dueInDays: '26 Days', status: 'On Schedule' },
        { supplier: 'Global Electronic Parts', totalBilled: 1420000, paid: 840000, balanceDue: 580000, dueInDays: '36 Days', status: 'On Schedule' },
        { supplier: 'Indus Polychem Industries', totalBilled: 980000, paid: 560000, balanceDue: 420000, dueInDays: '15 Days', status: 'Upcoming' }
    ]
};
