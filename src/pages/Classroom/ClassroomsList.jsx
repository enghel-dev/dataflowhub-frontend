import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  Edit2, Trash2, Plus, Search, RefreshCw, 
  AlertCircle, X, CheckCircle2, HelpCircle 
} from 'lucide-react';

const ClassroomsList = () => {
  // --- ESTADOS DE DATOS ---
  const [classrooms, setClassrooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- ESTADOS DEL MODAL (CREAR/EDITAR) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', capacity: '' });

  // --- ESTADO DEL MODAL DE BORRADO (NUEVO) ---
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, name: '' });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // --- 1. GET (LEER) ---
  const fetchClassrooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/Classroms/ListClassroom`);
      if (!response.ok) throw new Error(`Error del servidor: ${response.status}`);
      const data = await response.json();
      setClassrooms(data);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      toast.error('Error de conexión con la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  // --- 2. DELETE (ELIMINAR) ---
  const handleDelete = async () => {
    const { id } = deleteModal;
    try {
      const response = await fetch(`${API_BASE_URL}/Classroms/DeleteClassroom?id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error();
      
      toast.success('Aula eliminada correctamente');
      setDeleteModal({ isOpen: false, id: null, name: '' });
      fetchClassrooms();
    } catch (error) {
      toast.error('No se pudo eliminar el aula');
    }
  };

  // --- CONTROLADORES DE MODAL ---
  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentId(null);
    setFormData({ name: '', location: '', capacity: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (classroom) => {
    setModalMode('edit');
    setCurrentId(classroom.id);
    setFormData({
      name: classroom.name,
      location: classroom.location,
      capacity: classroom.capacity
    });
    setIsModalOpen(true);
  };

  // --- 3. POST / PUT (GUARDAR) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEdit = modalMode === 'edit';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = {
      name: formData.name,
      location: formData.location,
      capacity: parseInt(formData.capacity)
    };
    
    if (isEdit) payload.id = parseInt(currentId);

    const endpoint = isEdit 
      ? `/Classroms/UpdateClassroom?id=${currentId}` 
      : '/Classroms/NewClassroom';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.msj || "Error en la petición");
      }
      
      setIsModalOpen(false);
      fetchClassrooms(); 
      toast.success(isEdit ? '¡Aula actualizada con éxito!' : '¡Aula registrada correctamente!');

    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const filteredClassrooms = classrooms.filter((classroom) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      classroom.location.toLowerCase().includes(searchLower) ||
      classroom.name.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6 relative">
      {/* Sistema de notificaciones elegante */}
      <Toaster position="top-right" richColors closeButton />

      {/* --- BARRA SUPERIOR --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Buscar por nombre o ubicación..."
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={fetchClassrooms} className="p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin text-blue-500' : ''}`} />
          </button>
          <button 
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="h-5 w-5" />
            Nueva Aula
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* --- TABLA --- */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacidad</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-500" />
                    <p>Sincronizando con Azure...</p>
                  </td>
                </tr>
              ) : filteredClassrooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'No hay coincidencias para tu búsqueda.' : 'No hay registros disponibles.'}
                  </td>
                </tr>
              ) : (
                filteredClassrooms.map((classroom) => (
                  <tr key={classroom.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{classroom.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{classroom.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{classroom.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{classroom.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(classroom)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, id: classroom.id, name: classroom.name })}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE FORMULARIO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                {modalMode === 'edit' ? 'Editar Aula' : 'Nueva Aula'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Aula</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Laboratorio de Redes" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                  <input type="text" name="location" required value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej. Edificio B, Piso 2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                  <input type="number" name="capacity" required min="1" value={formData.capacity} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-70 flex items-center gap-2">
                  {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Guardando...' : (modalMode === 'edit' ? 'Actualizar' : 'Registrar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO (REEMPLAZA AL CONFIRM) --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <HelpCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">¿Confirmar eliminación?</h3>
              <p className="text-sm text-gray-500">
                Estás a punto de eliminar <strong>{deleteModal.name}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col gap-2">
              <button onClick={handleDelete} className="w-full py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors">
                Sí, eliminar para siempre
              </button>
              <button onClick={() => setDeleteModal({ isOpen: false, id: null, name: '' })} className="w-full py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                No, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomsList;