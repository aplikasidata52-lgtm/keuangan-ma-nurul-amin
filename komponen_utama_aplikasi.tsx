import React, { useState, useMemo } from 'react';
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
  AlertCircle,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

// --- DATA AWAL SIMULASI ---
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

export default function App() {
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

        {/* UTAMA */}
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
            <PaymentReportView students={students} formatRupiah={formatRupiah} />
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

// DASHBOARD VIEW
function DashboardView({ schoolInfo, totalStudentsCount, lunasPercentage, lunasCount, belumLunasPercentage, belumLunasCount, netBalance, setActiveTab, incomes, students, formatRupiah }) {
  return (
    <div className="space-y-8 animate-morph">
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
    </div>
  );
}

// VIEW PEMBAYARAN
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
    <div className="space-y-6 animate-morph">
      <h2 className="text-2xl font-black text-slate-900">Input Pembayaran Siswa</h2>
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
            <button type="submit" className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold shadow-lg flex items-center justify-center space-x-2">
              <Printer size={18} />
              <span>Bayar & Cetak Kwitansi</span>
            </button>
          </form>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-3 border-b pb-2">Ringkasan Tagihan Siswa</h3>
          {selectedStudent ? (
            <div className="space-y-2 text-xs">
              <p>Nama: <strong>{selectedStudent.name}</strong></p>
              <p>Total Tagihan: <strong>{formatRupiah(selectedStudent.totalBill)}</strong></p>
              <p>Sudah Dibayar: <strong className="text-emerald-600">{formatRupiah(selectedStudent.totalPaid)}</strong></p>
            </div>
          ) : <p className="text-xs text-slate-400">Pilih siswa untuk melihat info.</p>}
        </div>
      </div>
    </div>
  );
}

// VIEW LAINNYA (DUMMY PLACEHOLDER AGARLENGKAP DAN TIDAK ERROR)
function IncomeView() { return <div className="p-4 bg-white rounded-3xl">Menu Pemasukan Aktif</div>; }
function ExpenseView() { return <div className="p-4 bg-white rounded-3xl">Menu Pengeluaran Aktif</div>; }
function StudentInputView() { return <div className="p-4 bg-white rounded-3xl">Menu Input Siswa Aktif</div>; }
function FinancialReportView() { return <div className="p-4 bg-white rounded-3xl">Menu Laporan Keuangan Aktif</div>; }
function PaymentReportView() { return <div className="p-4 bg-white rounded-3xl">Menu Laporan Pembayaran Aktif</div>; }
function SettingsView() { return <div className="p-4 bg-white rounded-3xl">Menu Pengaturan Aktif</div>; }

// KWITANSI MODAL
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

// LOGIN SCREEN
function LoginScreen({ onLogin, schoolInfo }) {
  const [role, setRole] = useState('administrator');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ username, name: role === 'administrator' ? 'H. Moh. Ridwan' : 'Siti Aisyah', role });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 space-y-6 shadow-2xl">
        <div className="text-center">
          <h1 className="text-xl font-black">{schoolInfo.name}</h1>
          <p className="text-xs text-orange-600 font-bold">LOGIN KEUANGAN</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="flex gap-2">
            <button type="button" onClick={() => { setRole('administrator'); setUsername('admin'); }} className={`flex-1 py-2 rounded-xl font-bold ${role === 'administrator' ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>Admin</button>
            <button type="button" onClick={() => { setRole('staff'); setUsername('staff'); }} className={`flex-1 py-2 rounded-xl font-bold ${role === 'staff' ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>Staff</button>
          </div>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 border" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 border" />
          <button type="submit" className="w-full py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg">Masuk Aplikasi</button>
        </form>
      </div>
    </div>
  );
}