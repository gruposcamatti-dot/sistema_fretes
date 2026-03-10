import { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  BarChart3, 
  LogOut,
  Menu,
  Bell,
  Search,
  MapPin,
  Users,
  ChevronRight,
  PackageCheck,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export const Layout = ({ children, activeMenu = 'dashboard', onMenuChange }: { children: ReactNode, activeMenu?: string, onMenuChange?: (id: string) => void }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { id: 'viagens', label: 'Viagens', icon: Truck },
    { id: 'rotas', label: 'Rotas & Destinos', icon: MapPin },
    { id: 'motoristas', label: 'Motoristas', icon: Users },
    { id: 'frotas', label: 'Gestão de Frota', icon: PackageCheck },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Sidebar - Premium Dark Theme */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-[260px]' : 'w-[80px]'
        } bg-[#0A0F1C] text-slate-400 flex flex-col hidden md:flex border-r border-slate-800/60 relative z-20 transition-all duration-300 ease-in-out`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-amber-600 hover:border-amber-500 hover:scale-110 active:scale-95 transition-all duration-200 z-30 shadow-sm"
        >
          {isSidebarOpen ? <ChevronsLeft className="w-3.5 h-3.5" /> : <ChevronsRight className="w-3.5 h-3.5" />}
        </button>

        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center px-4 border-b border-slate-800/60">
          <div className={`flex items-center ${isSidebarOpen ? 'gap-3 w-full px-2' : 'justify-center'}`}>
            <div className="w-10 h-10 min-w-[40px] bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 ring-1 ring-white/10 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Truck className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden cursor-pointer group">
                <span className="text-lg font-display font-bold text-white tracking-tight leading-tight truncate group-hover:text-amber-100 transition-colors">LogisticsPro</span>
                <span className="text-[10px] font-medium text-amber-400 uppercase tracking-widest truncate group-hover:text-amber-300 transition-colors">Enterprise</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
          {isSidebarOpen && (
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Principal</p>
          )}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onMenuChange && onMenuChange(item.id)}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl transition-all duration-200 ease-out group relative ${
                    isActive 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20 shadow-inner' 
                      : 'hover:bg-slate-800/50 hover:text-slate-200 text-slate-400 hover:translate-x-1'
                  }`}
                >
                  <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
                    <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-300'}`} />
                    {isSidebarOpen && (
                      <span className={`font-medium text-sm transition-colors duration-200 ${isActive ? 'text-amber-300' : ''}`}>{item.label}</span>
                    )}
                  </div>
                  {isActive && isSidebarOpen && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse"></div>
                  )}
                  {/* Tooltip for collapsed state */}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-800/60 bg-[#0A0F1C]">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center flex-col gap-4'}`}>
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} cursor-pointer group`}>
              <div className="w-10 h-10 min-w-[40px] bg-gradient-to-tr from-slate-700 to-slate-600 rounded-full flex items-center justify-center text-white font-semibold shadow-sm ring-2 ring-slate-800 group-hover:ring-amber-500/50 transition-all duration-300">
                AD
              </div>
              {isSidebarOpen && (
                <div className="flex flex-col overflow-hidden">
                  <p className="text-sm font-semibold text-slate-200 leading-tight truncate group-hover:text-white transition-colors">Admin User</p>
                  <p className="text-xs text-slate-500 font-medium truncate group-hover:text-slate-400 transition-colors">admin@logistics.com</p>
                </div>
              )}
            </div>
            
            <button 
              className={`p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 group ${!isSidebarOpen ? 'w-full flex justify-center' : ''}`}
              title="Sair"
            >
              <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-slate-50">
        {/* Header - Hidden to remove top space as requested */}
        <header className="hidden md:flex h-0 bg-transparent items-center justify-between px-8 sticky top-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-4 md:hidden">
            <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-amber-600 transition-colors active:scale-95">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-display font-bold text-slate-800 tracking-tight">LogisticsPro</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center relative w-[400px] group">
            {/* Search bar removed as requested */}
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Notification icon removed as requested */}
          </div>
        </header>

        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-4 sticky top-0 z-10">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-md flex items-center justify-center shadow-sm">
              <Truck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-display font-bold text-slate-800 tracking-tight">LogisticsPro</span>
          </div>
          <div className="w-9"></div> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto px-6 pb-6 pt-6 md:px-8 md:pb-8 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
};
