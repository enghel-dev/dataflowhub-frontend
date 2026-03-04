import { useState, useEffect } from 'react';

function App() {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = 'https://dataflowhubapi-ghfqbhh6ergjb5az.centralus-01.azurewebsites.net/api/Classroms/ListClassroom';

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) throw new Error("Error en la red");
        return response.json();
      })
      .then(data => {
        setClassrooms(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Hubo un problema conectando a la API:", error);
        setLoading(false);
      });
  }, []); // El array vacío asegura que esto se ejecute solo 1 vez al cargar la página

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🎓 DataFlowHub - Frontend Básico</h1>
      <hr />
      
      <h2>Listado de Aulas (Desde Azure ☁️)</h2>
      
      {loading ? (
        <p>Cargando datos...</p>
      ) : classrooms.length === 0 ? (
        <p>No hay datos o la base de datos está vacía.</p>
      ) : (
        <ul>
          {classrooms.map(classroom => (
            <li key={classroom.id} style={{ marginBottom: '10px' }}>
              <strong>{classroom.name}</strong> - Edificio: {classroom.location} - Capacidad: {classroom.capacity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;