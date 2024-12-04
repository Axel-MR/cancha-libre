"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Footer from "@/components/ui/Footer";


interface CentroDeportivo {
  id: string;
  Nombre: string;
  Deportes: string[];
  Imagen: string;
  Ubicacion: string;
}

const CrearReservaPage = () => {
  const [centrosDeportivos, setCentrosDeportivos] = useState<CentroDeportivo[]>([]);
  const [centroDeportivo, setCentroDeportivo] = useState("");
  const [deporte, setDeporte] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [deportesDisponibles, setDeportesDisponibles] = useState<string[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargandoCentros, setCargandoCentros] = useState(true);
  const [fecha, setFecha] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchCentrosDeportivos = async () => {
      try {
        const centrosCollection = collection(db, "CentroDeportivo");
        const centrosSnapshot = await getDocs(centrosCollection);
        const centrosData = centrosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as CentroDeportivo));
        setCentrosDeportivos(centrosData);
      } catch (error) {
        console.error("Error al obtener centros deportivos:", error);
        toast.error("Error al cargar los centros deportivos");
      } finally {
        setCargandoCentros(false);
      }
    };

    fetchCentrosDeportivos();
  }, []);

  const manejarCentroDeportivo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const centroSeleccionado = e.target.value;
    setCentroDeportivo(centroSeleccionado);

    const centro = centrosDeportivos.find(
      (centro) => centro.id === centroSeleccionado
    );
    if (centro) {
      setDeportesDisponibles(centro.Deportes);
      setDeporte("");
    }
  };

  const crearReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
  
    try {
      if (!centroDeportivo || !deporte || !fecha || !horaInicio || !horaFin) {
        throw new Error("Todos los campos son obligatorios");
      }
  
      const reservasCollection = collection(db, "Reservas");
  
      const nuevaReserva = {
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        deporte,
        canchaId: centroDeportivo,
        estado: true,
        userId: "" // Dejamos esto vacío como en tu ejemplo
      };
  
      const docRef = await addDoc(reservasCollection, nuevaReserva);
  
      if (docRef.id) {
        console.log("Documento creado con ID: ", docRef.id);
        toast.success("Reserva creada exitosamente");
        setTimeout(() => {
          // Redirige al perfil después de crear la reserva
          router.refresh();  // Ajusta la ruta de acuerdo a tu proyecto
        }, 1500);
      } else {
        throw new Error("No se pudo crear la reserva");
      }
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      toast.error(error instanceof Error ? error.message : "Error al crear la reserva");
    } finally {
      setCargando(false);
    }
  };
  

  if (cargandoCentros) {
    return <div className="min-h-screen flex justify-center items-center">Cargando centros deportivos...</div>;
  }

  return (
    <div> 
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h1 className="text-2xl font-semibold text-center mb-6">Crear Reserva</h1>

        <form onSubmit={crearReserva}>
          <div className="mb-4">
            <label htmlFor="centroDeportivo" className="block text-gray-700 mb-2">
              Selecciona el Centro Deportivo
            </label>
            <select
              id="centroDeportivo"
              value={centroDeportivo}
              onChange={manejarCentroDeportivo}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Selecciona un centro deportivo</option>
              {centrosDeportivos.map((centro) => (
                <option key={centro.id} value={centro.id}>
                  {centro.Nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="deporte" className="block text-gray-700 mb-2">
              Selecciona el deporte
            </label>
            <select
              id="deporte"
              value={deporte}
              onChange={(e) => setDeporte(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={!centroDeportivo}
              required
            >
              <option value="">Selecciona un deporte</option>
              {deportesDisponibles.map((deporte, index) => (
                <option key={index} value={deporte}>
                  {deporte}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="fecha" className="block text-gray-700 mb-2">
              Fecha de la reserva
            </label>
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="horaInicio" className="block text-gray-700 mb-2">
              Hora de inicio
            </label>
            <input
              type="time"
              id="horaInicio"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="horaFin" className="block text-gray-700 mb-2">
              Hora de fin
            </label>
            <input
              type="time"
              id="horaFin"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md w-full transition-colors"
              disabled={cargando || !deporte || !fecha || !horaInicio || !horaFin}
            >
              {cargando ? "Creando reserva..." : "Crear Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default CrearReservaPage;

