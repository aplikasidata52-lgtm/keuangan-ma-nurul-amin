import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Users,
  FileSpreadsheet,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Printer,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  UserPlus,
  Building,
  Upload,
  UserCheck,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Filter,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

// --- DATA SIMULASI AWAL ---
const initialStudents = [
  { id: '1', nisn: '0051234567', name: 'Ahmad Fauzi', class: 'X IPA 1', phone: '081234567890', status: 'Lunas', totalPaid: 1500000, totalBill: 1500000 },
  { id: '2', nisn: '0051234568', name: 'Siti Nurhaliza', class: 'XI IPS 2', phone: '081234567891', status: 'Belum Lunas', totalPaid: 750000, totalBill: 1500000 },
  { id: '3', nisn: '0051234569', name: 'Budi Santoso', class: 'XII IPA 2', phone: '081234567892', status: 'Belum Lunas', totalPaid: 500000, totalBill: 1500000 },
  { id: '4', nisn: '0051234570', name: 'Dewi Lestari', class: 'X IPS 1', phone: '081234567893', status: 'Lunas', totalPaid: 1500000, totalBill: 1500000 },
];

const initialCategoriesIncome = ['SPP Bulanan', 'Uang Gedung', 'Infaq / Sedekah', 'Bantuan Pemerintah', 'Lain-lain'];
const initialCategoriesExpense = ['Gaji Guru & Staf', 'Operasional Kantor', 'Listrik & Air', 'Kegiatan Siswa', 'Pemeliharaan'];

const initialBills = [
  { id: 'b1', name: 'SPP Semester Ganjil', amount: 1500000, type: 'Cicilan' },
  { id: 'b2', name: 'Uang Seragam', amount: 850000, type: 'Sekali Bayar' },
];

const initialIncomes = [
  { id: 'inc-1', date: '2026-07-20', category: 'SPP Bulanan', amount: 750000, studentName: 'Siti Nurhaliza', note: 'Pembayaran Cicilan ke-1 SPP', createdBy: 'Staff Admin' },
  { id: 'inc-2', date: '2026-07-21', category: 'SPP Bulanan', amount: 1500000, studentName: 'Ahmad Fauzi', note: 'Pelunasan SPP Ganjil', createdBy: 'Administrator' },
];

const initialExpenses = [
  { id: 'exp-1', date: '2026-07-15', category: 'Operasional Kantor', amount: 350000, note: 'Pembelian Kertas A4 & Alat Tulis', createdBy: 'Administrator' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [students, setStudents] = useState(initialStudents);
  const [incomes, setIncomes] = useState(initialIncomes);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [billTypes, setBillTypes] = useState(initialBills);
  const [incomeCategories, setIncomeCategories] = useState(initialCategoriesIncome);
  const [expenseCategories, setExpenseCategories] = useState(initialCategoriesExpense);
  
  const [schoolInfo, setSchoolInfo] = useState({
    name: 'MA NURUL AMIN',
    address: 'Jl. Pendidikan No. 45, Kebonagung, Jawa Timur',
    logoUrl: null,
    phone: '(0331) 889211',
  });

  const [receiptModalData, setReceiptModalData] = useState(null);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(number);
  };

  const totalStudentsCount = students.length;
  const lunasCount = students.filter((s) => s.status === 'Lunas').length;
  const belumLunasCount = students.filter((s) => s.status === 'Belum Lunas').length;
  const lunasPercentage = totalStudentsCount > 0 ? Math.round((lunasCount / totalStudentsCount) * 100) : 0;
  const belumLunasPercentage = 100 - lunasPercentage;

  const totalIncomeAmount = useMemo(() => incomes.reduce((sum, item) => sum + Number(item.amount), 0), [incomes]);
  const totalExpenseAmount = useMemo(() => expenses.reduce((sum, item) => sum + Number(item.amount), 0), [expenses]);
  const netBalance = totalIncomeAmount - totalExpenseAmount;

  const handleAddPayment = (paymentData) => {
    const { studentId, billName, category, amount, paymentType, note } = paymentData;
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const numAmount = Number(amount);
    const newPaidTotal = student.totalPaid + numAmount;
    const isNowLunas = newPaidTotal >= student.totalBill;

    setStudents((prev) =>
      prev.map((s) => s.id === studentId ? { ...s, totalPaid: newPaidTotal, status: isNowLunas ? 'Lunas' : 'Belum Lunas' } : s)
    );

    const newIncomeRecord = {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: category || billName || 'Pembayaran Siswa',
      amount: numAmount,
      studentName: student.name,
      note: `${billName} (${paymentType}) - ${note}`,
      createdBy: currentUser?.name || 'Petugas',
    };

    setIncomes((prev) => [newIncomeRecord, ...prev]);

    setReceiptModalData({
      receiptNo: `KWT/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      studentName: student.name,
      studentNisn: student.nisn,
      studentClass: student.class,
      billName: billName,
      paymentType: paymentType,
      amount: numAmount,
      note: note || 'Pembayaran telah diterima dengan sah.',
      cashier: currentUser?.name || 'Petugas Kasir',
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pembayaran', label: 'Pembayaran', icon: CreditCard },
    { id: 'pemasukan', label: 'Pemasukan', icon: TrendingUp },
    { id: 'pengeluaran', label: 'Pengeluaran', icon: TrendingDown },
    { id: 'siswa', label: 'Input Data Siswa', icon: Users },
    { id: 'laporan-keuangan', label: 'Laporan Keuangan', icon: FileSpreadsheet },
    { id: 'laporan-pembayaran', label: 'Laporan Pembayaran', icon: FileText },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(user) => { setCurrentUser(user); setIsLoggedIn(true); }} schoolInfo={schoolInfo} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800 flex flex-col font-sans antialiased">
      {/* HEADER MOBILE */}
      <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          {schoolInfo.logoUrl ? (
            <img src={schoolInfo.logoUrl} alt="Logo" className="w-9 h-9 rounded-xl object-contain border" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold shadow-md">
              MA
            </div>
          )}
          <div>
            <h1 className="font-extrabold text-xs tracking-tight text-slate-900 leading-none">{schoolInfo.name}</h1>
            <span className="text-[10px] font-medium text-orange-600">Sistem Keuangan</span>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-xl bg-slate-100 text-slate-700">
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* SIDEBAR */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} ${isMobileMenuOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className={`flex items-center space-x-3 overflow-hidden ${isSidebarCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
              {schoolInfo.logoUrl ? (
                <img src={schoolInfo.logoUrl} alt="Logo" className="w-10 h-10 rounded-2xl object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black">
                  MA
                </div>
              )}
              {(!isSidebarCollapsed || isMobileMenuOpen) && (
                <div>
                  <h2 className="font-black text-sm text-slate-900 leading-tight">{schoolInfo.name}</h2>
                  <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mt-0.5">ADMINISTRASI</p>
                </div>
              )}
            </div>
            <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="hidden lg:flex p-1.5 rounded-lg border text-slate-400 hover:text-orange-600">
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-2xl font-semibold text-sm transition-all ${isActive ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'} ${isSidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
                >
                  <Icon size={20} />
                  {(!isSidebarCollapsed || isMobileMenuOpen) && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between p-2">
              <div className={`flex items-center space-x-3 ${isSidebarCollapsed ? 'lg:hidden' : ''}`}>
                <div className="w-9 h-9 rounded-full bg-orange-400 text-white font-bold flex items-center justify-center text-xs">
                  {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name}</p>
                  <span className="text-[10px] font-semibold text-orange-600 uppercase bg-orange-100 px-2 py-0.5 rounded-full">{currentUser?.role}</span>
                </div>
              </div>
              <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }} className="p-2 text-slate-400 hover:text-red-500">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </aside>

        {/* AREA UTAMA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              incomes={incomes}
              totalStudentsCount={totalStudentsCount}
              lunasCount={lunasCount}
              belumLunasCount={belumLunasCount}
              lunasPercentage={lunasPercentage}
              belumLunasPercentage={belumLunasPercentage}
              netBalance={netBalance}
              setActiveTab={setActiveTab}
              formatRupiah={formatRupiah}
              schoolInfo={schoolInfo}
            />
          )}

          {activeTab === 'pembayaran' && (
            <PaymentView
              students={students}
              billTypes={billTypes}
              incomeCategories={incomeCategories}
              onAddPayment={handleAddPayment}
              formatRupiah={formatRupiah}
            />
          )}

          {activeTab === 'pemasukan' && (
            <IncomeView
              incomes={incomes}
              incomeCategories={incomeCategories}
              setIncomes={setIncomes}
              currentUser={currentUser}
              formatRupiah={formatRupiah}
            />
          )}

          {activeTab === 'pengeluaran' && (
            <ExpenseView
              expenses={expenses}
              expenseCategories={expenseCategories}
              setExpenses={setExpenses}
              currentUser={currentUser}
              formatRupiah={formatRupiah}
            />
          )}

          {activeTab === 'siswa' && (
            <StudentInputView students={students} setStudents={setStudents} formatRupiah={formatRupiah} />
          )}

          {activeTab === 'laporan-keuangan' && (
            <FinancialReportView incomes={incomes} expenses={expenses} totalIncomeAmount={totalIncomeAmount} totalExpenseAmount={totalExpenseAmount} netBalance={netBalance} formatRupiah={formatRupiah} schoolInfo={schoolInfo} />
          )}

          {activeTab === 'laporan-pembayaran' && (
            <PaymentReportView students={students} formatRupiah={formatRupiah} schoolInfo={schoolInfo} />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView schoolInfo={schoolInfo} setSchoolInfo={setSchoolInfo} billTypes={billTypes} setBillTypes={setBillTypes} incomeCategories={incomeCategories} setIncomeCategories={setIncomeCategories} expenseCategories={expenseCategories} setExpenseCategories={setExpenseCategories} currentUser={currentUser} formatRupiah={formatRupiah} />
          )}
        </main>
      </div>

      {receiptModalData && (
        <ReceiptModal data={receiptModalData} schoolInfo={schoolInfo} onClose={() => setReceiptModalData(null)} formatRupiah={formatRupiah} />
      )}
    </div>
  );
}

// 1. DASHBOARD VIEW
function DashboardView({ schoolInfo, totalStudentsCount, lunasPercentage, lunasCount, belumLunasPercentage, belumLunasCount, netBalance, setActiveTab, formatRupiah }) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase mb-3">
              <Sparkles size={14} />
              <span>Sistem Administrasi Modern</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{schoolInfo.name}</h1>
            <p className="text-orange-100 text-sm mt-1">Monitor arus kas dan verifikasi tagihan siswa secara transparan.</p>
          </div>
          <button onClick={() => setActiveTab('pembayaran')} className="bg-white text-orange-600 font-bold px-5 py-3 rounded-2xl shadow-lg text-sm flex items-center space-x-2">
            <CreditCard size={18} />
            <span>Input Pembayaran</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase">Total Siswa</p>
          <h3 className="text-3xl font-black mt-2">{totalStudentsCount}</h3>
          <p className="text-xs text-blue-100 mt-1">Siswa Terdaftar</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase">Status Lunas</p>
          <h3 className="text-3xl font-black mt-2">{lunasPercentage}%</h3>
          <p className="text-xs text-emerald-100 mt-1">{lunasCount} Siswa Lunas</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase">Belum Lunas</p>
          <h3 className="text-3xl font-black mt-2">{belumLunasPercentage}%</h3>
          <p className="text-xs text-amber-100 mt-1">{belumLunasCount} Menunggak</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-5 text-white shadow-lg">
          <p className="text-xs font-semibold uppercase">Saldo Kas Bersih</p>
          <h3 className="text-xl sm:text-2xl font-black mt-2 truncate">{formatRupiah(netBalance)}</h3>
          <p className="text-xs text-purple-100 mt-1">Total Kas Sekolah</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Sparkles size={18} className="text-orange-500" />
          <span>Akses Cepat Fitur Utama</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <button onClick={() => setActiveTab('pembayaran')} className="p-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold border border-orange-200 flex flex-col items-center">
            <CreditCard size={24} className="mb-2 text-orange-500" />
            <span>Input Bayar</span>
          </button>
          <button onClick={() => setActiveTab('siswa')} className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 flex flex-col items-center">
            <UserPlus size={24} className="mb-2 text-blue-500" />
            <span>Data Siswa</span>
          </button>
          <button onClick={() => setActiveTab('laporan-keuangan')} className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 flex flex-col items-center">
            <FileSpreadsheet size={24} className="mb-2 text-emerald-500" />
            <span>Laporan Kas</span>
          </button>
          <button onClick={() => setActiveTab('pengaturan')} className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold border border-purple-200 flex flex-col items-center">
            <Settings size={24} className="mb-2 text-purple-500" />
            <span>Pengaturan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. VIEW PEMBAYARAN
function PaymentView({ students, billTypes, incomeCategories, onAddPayment, formatRupiah }) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedBill, setSelectedBill] = useState(billTypes[0]?.name || '');
  const [category, setCategory] = useState(incomeCategories[0] || '');
  const [paymentType, setPaymentType] = useState('Cicilan');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudentId || !amount) return;
    onAddPayment({ studentId: selectedStudentId, billName: selectedBill, category, amount: Number(amount), paymentType, note });
    setAmount('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Input Pembayaran Siswa</h2>
        <p className="text-xs text-slate-500">Pencatatan transaksi pembayaran siswa terintegrasi dengan kwitansi cetak.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold mb-1">Pilih Siswa</label>
              <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} required className="w-full p-3 rounded-2xl bg-slate-50 border">
                <option value="">-- Pilih Siswa --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.class}) - Status: {s.status}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Jenis Tagihan</label>
                <select value={selectedBill} onChange={(e) => setSelectedBill(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 border">
                  {billTypes.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Jumlah Dibayar (Rp)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="Contoh: 500000" className="w-full p-3 rounded-2xl bg-slate-50 border" />
              </div>
            </div>
            <div>
              <label className="block font-bold mb-1">Keterangan / Catatan</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Catatan opsional..." className="w-full p-3 rounded-2xl bg-slate-50 border" />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold shadow-lg flex items-center justify-center space-x-2">
              <Printer size={18} />
              <span>Bayar & Cetak Kwitansi</span>
            </button>
          </form>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-3 border-b pb-2 text-xs">Ringkasan Tagihan Siswa</h3>
          {selectedStudent ? (
            <div className="space-y-2 text-xs">
              <p>Nama: <strong>{selectedStudent.name}</strong></p>
              <p>Kelas: <strong>{selectedStudent.class}</strong></p>
              <p>Total Tagihan: <strong>{formatRupiah(selectedStudent.totalBill)}</strong></p>
              <p>Sudah Dibayar: <strong className="text-emerald-600">{formatRupiah(selectedStudent.totalPaid)}</strong></p>
              <p>Sisa: <strong className="text-amber-600">{formatRupiah(Math.max(0, selectedStudent.totalBill - selectedStudent.totalPaid))}</strong></p>
            </div>
          ) : <p className="text-xs text-slate-400">Pilih siswa untuk melihat rincian.</p>}
        </div>
      </div>
    </div>
  );
}

// 3. VIEW PEMASUKAN
function IncomeView({ incomes, incomeCategories, setIncomes, currentUser, formatRupiah }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ category: incomeCategories[0] || 'Lain-lain', amount: '', studentName: '-', note: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.amount) return;
    const newRecord = {
      id: `inc-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
      amount: Number(formData.amount),
      studentName: formData.studentName || '-',
      note: formData.note,
      createdBy: currentUser?.name || 'Petugas',
    };
    setIncomes([newRecord, ...incomes]);
    setShowAddModal(false);
    setFormData({ category: incomeCategories[0] || 'Lain-lain', amount: '', studentName: '-', note: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Data Pemasukan Kas</h2>
          <p className="text-xs text-slate-500">Pencatatan dana masuk operasional dan SPP.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1">
          <Plus size={16} /> <span>Tambah Pemasukan</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b font-bold text-slate-500 uppercase">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Sumber / Nama</th>
              <th className="p-4">Keterangan</th>
              <th className="p-4">Jumlah (Rp)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {incomes.map((inc) => (
              <tr key={inc.id}>
                <td className="p-4">{inc.date}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">{inc.category}</span></td>
                <td className="p-4 font-bold">{inc.studentName}</td>
                <td className="p-4">{inc.note || '-'}</td>
                <td className="p-4 font-black text-emerald-600">+{formatRupiah(inc.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm">Tambah Pemasukan Kas</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-2xl border bg-slate-50">
                {incomeCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <input type="text" placeholder="Sumber / Nama Donatur" value={formData.studentName} onChange={(e) => setFormData({ ...formData, studentName: e.target.value })} className="w-full p-3 rounded-2xl border bg-slate-50" />
              <input type="number" placeholder="Nominal Rp" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required className="w-full p-3 rounded-2xl border bg-slate-50" />
              <input type="text" placeholder="Keterangan" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full p-3 rounded-2xl border bg-slate-50" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. VIEW PENGELUARAN
function ExpenseView({ expenses, expenseCategories, setExpenses, currentUser, formatRupiah }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ category: expenseCategories[0] || 'Operasional Kantor', amount: '', note: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.amount) return;
    const newRecord = {
      id: `exp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
      amount: Number(formData.amount),
      note: formData.note,
      createdBy: currentUser?.name || 'Petugas',
    };
    setExpenses([newRecord, ...expenses]);
    setShowAddModal(false);
    setFormData({ category: expenseCategories[0] || 'Operasional Kantor', amount: '', note: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Data Pengeluaran Kas</h2>
          <p className="text-xs text-slate-500">Pencatatan pengeluaran beban operasional sekolah.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-red-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1">
          <Plus size={16} /> <span>Catat Pengeluaran</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b font-bold text-slate-500 uppercase">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Rincian Pengeluaran</th>
              <th className="p-4">Jumlah (Rp)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td className="p-4">{exp.date}</td>
                <td className="p-4"><span className="px-2 py-1 rounded-full bg-red-100 text-red-800 font-bold">{exp.category}</span></td>
                <td className="p-4">{exp.note}</td>
                <td className="p-4 font-black text-red-600">-{formatRupiah(exp.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm">Catat Pengeluaran Kas</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 rounded-2xl border bg-slate-50">
                {expenseCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Nominal Rp" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required className="w-full p-3 rounded-2xl border bg-slate-50" />
              <input type="text" placeholder="Keterangan Pengeluaran" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} required className="w-full p-3 rounded-2xl border bg-slate-50" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. VIEW INPUT DATA SISWA
function StudentInputView({ students, setStudents, formatRupiah }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ nisn: '', name: '', class: 'X IPA 1', phone: '', totalBill: '1500000' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.nisn) return;
    const newStudent = {
      id: `std-${Date.now()}`,
      nisn: formData.nisn,
      name: formData.name,
      class: formData.class,
      phone: formData.phone || '-',
      status: 'Belum Lunas',
      totalPaid: 0,
      totalBill: Number(formData.totalBill) || 1500000,
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
    setFormData({ nisn: '', name: '', class: 'X IPA 1', phone: '', totalBill: '1500000' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Data Siswa</h2>
          <p className="text-xs text-slate-500">Kelola daftar siswa terdaftar dan status kewajiban tagihan.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-orange-500 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1">
          <UserPlus size={16} /> <span>Tambah Siswa</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b font-bold text-slate-500 uppercase">
            <tr>
              <th className="p-4">NISN</th>
              <th className="p-4">Nama Siswa</th>
              <th className="p-4">Kelas</th>
              <th className="p-4">Kontak Wali</th>
              <th className="p-4">Total Kewajiban</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="p-4 font-mono">{s.nisn}</td>
                <td className="p-4 font-bold">{s.name}</td>
                <td className="p-4">{s.class}</td>
                <td className="p-4">{s.phone}</td>
                <td className="p-4 font-bold">{formatRupiah(s.totalBill)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-bold text-sm">Tambah Siswa Baru</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" placeholder="NISN" value={formData.nisn} onChange={(e) => setFormData({ ...formData, nisn: e.target.value })} required className="w-full p-3 rounded-2xl border bg-slate-50" />
              <input type="text" placeholder="Nama Lengkap" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full p-3 rounded-2xl border bg-slate-50" />
              <input type="text" placeholder="No. HP Wali" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 rounded-2xl border bg-slate-50" />
              <input type="number" placeholder="Total Kewajiban Rp" value={formData.totalBill} onChange={(e) => setFormData({ ...formData, totalBill: e.target.value })} required className="w-full p-3 rounded-2xl border bg-slate-50" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-orange-500 text-white font-bold rounded-xl">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 6. VIEW LAPORAN KEUANGAN
function FinancialReportView({ incomes, expenses, totalIncomeAmount, totalExpenseAmount, netBalance, formatRupiah }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Laporan Keuangan</h2>
          <p className="text-xs text-slate-500">Rekapitulasi pemasukan, pengeluaran, dan saldo kas.</p>
        </div>
        <button onClick={() => window.print()} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1">
          <Printer size={16} /> <span>Cetak Laporan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
          <p className="text-xs font-bold text-emerald-700">TOTAL PEMASUKAN</p>
          <h3 className="text-xl font-black text-emerald-800 mt-1">{formatRupiah(totalIncomeAmount)}</h3>
        </div>
        <div className="bg-red-50 border border-red-200 p-4 rounded-2xl">
          <p className="text-xs font-bold text-red-700">TOTAL PENGELUARAN</p>
          <h3 className="text-xl font-black text-red-800 mt-1">{formatRupiah(totalExpenseAmount)}</h3>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
          <p className="text-xs font-bold text-blue-700">SALDO KAS NETTO</p>
          <h3 className="text-xl font-black text-blue-800 mt-1">{formatRupiah(netBalance)}</h3>
        </div>
      </div>
    </div>
  );
}

// 7. VIEW LAPORAN PEMBAYARAN
function PaymentReportView({ students, formatRupiah }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Laporan Pembayaran Siswa</h2>
          <p className="text-xs text-slate-500">Rekapitulasi status pembayaran per siswa.</p>
        </div>
        <button onClick={() => window.print()} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-2xl text-xs flex items-center space-x-1">
          <Printer size={16} /> <span>Cetak Rekap</span>
        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b font-bold text-slate-500 uppercase">
            <tr>
              <th className="p-4">NISN</th>
              <th className="p-4">Nama</th>
              <th className="p-4">Kelas</th>
              <th className="p-4">Total Tagihan</th>
              <th className="p-4">Dibayar</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="p-4 font-mono">{s.nisn}</td>
                <td className="p-4 font-bold">{s.name}</td>
                <td className="p-4">{s.class}</td>
                <td className="p-4">{formatRupiah(s.totalBill)}</td>
                <td className="p-4 text-emerald-600 font-bold">{formatRupiah(s.totalPaid)}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${s.status === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 8. VIEW PENGATURAN
function SettingsView({ schoolInfo, setSchoolInfo, currentUser }) {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSchoolInfo((prev) => ({ ...prev, logoUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-900">Pengaturan Sistem</h2>
      <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4 max-w-xl text-xs">
        <h3 className="font-bold text-sm">Identitas Sekolah</h3>
        <div>
          <label className="block font-bold mb-1">Nama Sekolah</label>
          <input type="text" value={schoolInfo.name} onChange={(e) => setSchoolInfo({ ...schoolInfo, name: e.target.value })} className="w-full p-3 rounded-2xl border bg-slate-50 font-bold" />
        </div>
        <div>
          <label className="block font-bold mb-1">Upload Logo Sekolah</label>
          <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full p-2 border rounded-2xl bg-slate-50" />
        </div>
        <div className="p-3 bg-slate-100 rounded-2xl">
          <p className="font-bold">Akun Aktif saat ini:</p>
          <p>{currentUser?.name} ({currentUser?.role})</p>
        </div>
      </div>
    </div>
  );
}

// MODAL KWITANSI
function ReceiptModal({ data, schoolInfo, onClose, formatRupiah }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div id="printable-receipt" className="p-6 border-2 border-orange-200 rounded-2xl space-y-3 text-xs">
          <div className="flex justify-between border-b pb-2">
            <h3 className="font-bold">{schoolInfo.name}</h3>
            <span className="font-bold text-orange-600">{data.receiptNo}</span>
          </div>
          <p>Terima Dari: <strong>{data.studentName}</strong></p>
          <p>Jumlah: <strong className="text-emerald-600 text-sm">{formatRupiah(data.amount)}</strong></p>
          <p>Untuk: {data.billName}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">Tutup</button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold">Cetak</button>
        </div>
      </div>
    </div>
  );
}

// LOGIN SCREEN MULTI-ROLE
function LoginScreen({ onLogin, schoolInfo }) {
  const [role, setRole] = useState('administrator');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, name: role === 'administrator' ? 'H. Moh. Ridwan, S.Pd.I' : 'Siti Aisyah (Staff)', role });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-xl font-black">{schoolInfo.name}</h1>
          <p className="text-xs text-orange-600 font-bold uppercase mt-1">Sistem Keuangan & Administrasi</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl">
            <button type="button" onClick={() => { setRole('administrator'); setUsername('admin'); }} className={`flex-1 py-2 rounded-xl font-bold ${role === 'administrator' ? 'bg-orange-500 text-white shadow' : 'text-slate-600'}`}>Admin</button>
            <button type="button" onClick={() => { setRole('staff'); setUsername('staff'); }} className={`flex-1 py-2 rounded-xl font-bold ${role === 'staff' ? 'bg-orange-500 text-white shadow' : 'text-slate-600'}`}>Staff</button>
          </div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 border font-bold" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 border" />
          <button type="submit" className="w-full py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600">Masuk Aplikasi</button>
        </form>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
