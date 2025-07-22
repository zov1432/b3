import React, { useState } from 'react';
import { FOMOAlert } from './components/AddictionUI';

const TestFOMO = () => {
  const [fomoHidden, setFomoHidden] = useState(false);

  const testFOMOData = [
    {
      id: "test-fomo-1",
      title: "¿Quién ganó el mejor outfit de la semana?",
      urgency_level: 4,
      expires_at: new Date(Date.now() + 3.5 * 60 * 60 * 1000).toISOString(),
      current_participants: 472,
      max_participants: 1363,
      is_trending: true,
      poll_id: "test-poll-1"
    }
  ];

  const handleFOMOAction = (fomoItem) => {
    alert(`¡Participación exitosa en: ${fomoItem.title}!`);
    setFomoHidden(true);
  };

  const handleFOMOClose = () => {
    alert('Modal cerrado exitosamente!');
    setFomoHidden(true);
  };

  const resetModal = () => {
    setFomoHidden(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Test del Modal FOMO
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Estado del Modal</h2>
          <p className="mb-4">
            <strong>Estado:</strong> {fomoHidden ? 'Oculto' : 'Visible'}
          </p>
          
          <div className="space-x-4">
            <button
              onClick={resetModal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Mostrar Modal
            </button>
            
            <button
              onClick={() => setFomoHidden(true)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Ocultar Modal
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Instrucciones de Prueba</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Haga clic en "Mostrar Modal" para ver el modal FOMO</li>
            <li>Pruebe el botón "¡Participar Ahora!" - debe mostrar una alerta</li>
            <li>Pruebe el botón "X" (cerrar) - debe mostrar una alerta</li>
            <li>Ambos botones deben ocultar el modal después de hacer clic</li>
          </ol>
        </div>

        {/* Modal FOMO */}
        {!fomoHidden && (
          <FOMOAlert
            fomoContent={testFOMOData}
            onTakeAction={handleFOMOAction}
            onClose={handleFOMOClose}
          />
        )}
      </div>
    </div>
  );
};

export default TestFOMO;