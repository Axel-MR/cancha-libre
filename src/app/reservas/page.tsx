"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc} from "firebase/firestore";
import { format, parseISO, compareAsc } from "date-fns";
import { es } from "date-fns/locale";
import Footer from "@/components/ui/Footer";
import AnunciosCarousel from "@/components/ui/AnuncioCarousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Reserva {
  id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  deporte: string;
  canchaId: string;
  estado: boolean;
  userId: string;
}

interface CentroDeportivo {
  id: string;
  Nombre: string;
  Imagen: string;
}

interface ReservasAgrupadas {
  [fecha: string]: {
    [deporte: string]: {
      [centroId: string]: Reserva[];
    };
  };
}

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [centrosDeportivos, setCentrosDeportivos] = useState<{
    [key: string]: CentroDeportivo;
  }>({});
  const [reservasAgrupadas, setReservasAgrupadas] = useState<ReservasAgrupadas>({});
  const [loading, setLoading] = useState(true);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener centros deportivos
        const centrosSnapshot = await getDocs(collection(db, "CentroDeportivo"));
        const centrosData: { [key: string]: CentroDeportivo } = {};
        centrosSnapshot.forEach((doc) => {
          centrosData[doc.id] = { id: doc.id, ...doc.data() } as CentroDeportivo;
        });
        setCentrosDeportivos(centrosData);
  
        const reservasSnapshot = await getDocs(collection(db, "Reservas"));
        const now = new Date();
        
        const reservasData: Reserva[] = [];
        reservasSnapshot.forEach((docRef) => {
          const data = docRef.data() as Reserva;
          const fecha = parseISO(data.fecha);
          const horaInicio = data.hora_inicio.split(":");
          const horaInicioDate = new Date(fecha);
          horaInicioDate.setHours(Number(horaInicio[0]), Number(horaInicio[1]), 0, 0);
        
          if (
            horaInicioDate >= now && 
            data.userId === "" && 
            data.estado === true
          ) {
            reservasData.push({
              ...data,
              id: docRef.id,
              fecha: fecha.toISOString(),
            });
          }
        });
  
        setReservas(reservasData);
  
        // Agrupar reservas
        const agrupadas: ReservasAgrupadas = {};
        reservasData.forEach((reserva) => {
          if (!agrupadas[reserva.fecha]) {
            agrupadas[reserva.fecha] = {};
          }
          if (!agrupadas[reserva.fecha][reserva.deporte]) {
            agrupadas[reserva.fecha][reserva.deporte] = {};
          }
          if (!agrupadas[reserva.fecha][reserva.deporte][reserva.canchaId]) {
            agrupadas[reserva.fecha][reserva.deporte][reserva.canchaId] = [];
          }
          agrupadas[reserva.fecha][reserva.deporte][reserva.canchaId].push(reserva);
        });
        setReservasAgrupadas(agrupadas);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        alert("No se pudieron cargar las reservas. Por favor, intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handleReservaClick = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setIsModalOpen(true);
  };

  const handleConfirmReserva = async () => {
    if (!selectedReserva || !auth.currentUser) return;

    try {
      const reservaRef = doc(db, "Reservas", selectedReserva.id);
      await updateDoc(reservaRef, {
        userId: auth.currentUser.uid,
      });

      alert("Reserva confirmada exitosamente.");

      // Actualizar el estado local
      setReservas((prevReservas) => prevReservas.filter((r) => r.id !== selectedReserva.id));
      setReservasAgrupadas((prevAgrupadas) => {
        const newAgrupadas = { ...prevAgrupadas };
        const { fecha, deporte, canchaId } = selectedReserva;
        newAgrupadas[fecha][deporte][canchaId] = newAgrupadas[fecha][deporte][canchaId].filter(
          (r) => r.id !== selectedReserva.id
        );
        // Limpiar objetos vacíos
        if (newAgrupadas[fecha][deporte][canchaId].length === 0) {
          delete newAgrupadas[fecha][deporte][canchaId];
        }
        if (Object.keys(newAgrupadas[fecha][deporte]).length === 0) {
          delete newAgrupadas[fecha][deporte];
        }
        if (Object.keys(newAgrupadas[fecha]).length === 0) {
          delete newAgrupadas[fecha];
        }
        return newAgrupadas;
      });
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
      alert("No se pudo confirmar la reserva. Por favor, intenta de nuevo.");
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div>
      <header>
      <AnunciosCarousel
  images={[
    "/images/inkober_2024_02_Vegeta_01.png",
    "/images/pedos_Faye_Valentine.png",
    "/images/Uzumaki_practica_01_color.png",
    "/images/nubes_naranjas.png",
  ]}
/>
      </header>
      <div className="min-h-screen bg-gray-100 p-4">
        {Object.entries(reservasAgrupadas)
          .sort(([fechaA], [fechaB]) => compareAsc(parseISO(fechaA), parseISO(fechaB)))
          .map(([fecha, deportes]) => (
            <div key={fecha} className="mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">
                {format(parseISO(fecha), "d 'de' MMMM", { locale: es })}
              </h2>

              {Object.entries(deportes).map(([deporte, centros]) => (
                <div key={deporte} className="mb-6">
                  <h3 className="text-xl font-semibold text-blue-700 mb-3">{deporte}</h3>

                  {Object.entries(centros).map(([centroId, reservasCentro]) => (
                    <div key={centroId} className="bg-white rounded-lg shadow-lg p-4 mb-4">
                      <div className="flex items-start gap-4">
                        {centrosDeportivos[centroId]?.Imagen && (
                          <div className="w-48 h-32 relative rounded-lg overflow-hidden">
                            <img
                              src={centrosDeportivos[centroId].Imagen}
                              alt={centrosDeportivos[centroId].Nombre || "Centro Deportivo"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-2">
                            {centrosDeportivos[centroId]?.Nombre || "Centro Deportivo"}
                          </h4>

                          <div className="flex flex-wrap gap-2">
                            {reservasCentro
                              .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                              .map((reserva) => (
                                <button
                                  key={reserva.id}
                                  onClick={() => handleReservaClick(reserva)}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors"
                                >
                                  {reserva.hora_inicio}
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

        {Object.keys(reservasAgrupadas).length === 0 && (
          <div className="text-center text-gray-500 mt-8">No hay reservas disponibles</div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            {selectedReserva && (
              <DialogDescription>
                <p>Detalles de la reserva:</p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {format(parseISO(selectedReserva.fecha), "d 'de' MMMM yyyy", { locale: es })}
                </p>
                <p>
                  <strong>Hora:</strong> {selectedReserva.hora_inicio} -{" "}
                  {selectedReserva.hora_fin}
                </p>
                <p>
                  <strong>Deporte:</strong> {selectedReserva.deporte}
                </p>
                <p>
                  <strong>Cancha:</strong> {centrosDeportivos[selectedReserva.canchaId]?.Nombre || selectedReserva.canchaId}
                </p>
              </DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-100 hover:bg-gray-200"
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmReserva} className="bg-blue-500 text-white">
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}