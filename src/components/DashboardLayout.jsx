import { useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  ClipboardList, 
  Wallet, 
  Library, 
  CalendarDays, 
  Clock, 
  UserCircle, 
  Settings 
} from 'lucide-react';

// Mapeamos tus DTOs a opciones visuales del menú
const MENU_ITEMS = [
  { id: 'students', label: 'Estudiantes', icon: Users, dto: 'StudentDTOs' },
  { id: 'teachers', label: 'Docentes', icon: UserCircle, dto: 'TeacherDTOs' },
  { id: 'majors', label: 'Carreras', icon: Library, dto: 'MajorDTOs' },
  { id: 'courses', label: 'Cursos', icon: BookOpen, dto: 'CourseDTOs' },
  { id: 'classrooms', label: 'Aulas', icon: Building2, dto: 'ClassroomDTOs' },
  { id: 'schoolTerms', label: 'Períodos Lectivos', icon: Clock, dto: 'SchoolTermDTOs' },
  { id: 'schedules', label: 'Horarios', icon: CalendarDays, dto: 'ScheduleDTOs' },
  { id: 'enrollments', label: 'Matrículas', icon: ClipboardList, dto: 'EnrollmentDTOs' },
  { id: 'grades', label: 'Calificaciones', icon: GraduationCap, dto: 'GradeDTOs' },
  { id: 'financials', label: 'Finanzas', icon: Wallet, dto: 'FinancialTransactionDTOs' },
  { id: 'users', label: 'Usuarios del Sistema', icon: Settings, dto: 'UserDTOs' },
];

const DashboardLayout = () => {
  // Estado para controlar qué vista estamos renderizando (luego lo cambiaremos por React Router)
  const [activeTab, setActiveTab] = useState('students');

  // Buscamos la información de la pestaña activa para mostrarla en el header
  const currentTabInfo = MENU_ITEMS.find(item => item.id === activeTab);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* SIDEBAR (Menú Lateral) */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
        {/* Logo / Header del Sidebar */}
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
              DF
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              DataFlow<span className="text-blue-500">Hub</span>
            </span>
          </div>
        </div>

        {/* Lista de Navegación */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gestión Universitaria
            </p>
          </div>
          <ul className="space-y-1 px-2">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del Sidebar (Usuario actual) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin Usuario</span>
              <span className="text-xs text-slate-500">admin@dataflowhub.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header Superior (Top bar) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentTabInfo?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Aquí luego podemos poner notificaciones, botón de logout, etc. */}
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-mono">
              Entidad: {currentTabInfo?.dto}
            </span>
          </div>
        </header>

        {/* Contenedor dinámico donde inyectaremos las tablas/formularios */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50">
          {/* Tarjeta de contenido (Card) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[500px]">
            <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4 mt-20">
              {currentTabInfo && <currentTabInfo.icon className="w-16 h-16 text-gray-300" />}
              <p className="text-lg">
                Aquí construiremos el CRUD (Tabla y Formularios) para la entidad 
                <strong className="text-gray-600 ml-1">{currentTabInfo?.label}</strong>.
              </p>
              <button className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-md font-medium hover:bg-blue-100 transition-colors">
                + Crear Nuevo Registro
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default DashboardLayout;