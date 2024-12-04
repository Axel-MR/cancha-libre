"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, DocumentData } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Footer from "@/components/ui/Footer";
import AnunciosCarousel from "@/components/ui/AnuncioCarousel";
import { motion } from "framer-motion";

// Define an interface for the Reserva type
interface Reserva {
  userId: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  deporte: string;
  canchaId: string;
}

// Define an interface for the Centro type
interface Centro {
  nombre: string;
  imagen: string;
}

const MisActividades = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [centros, setCentros] = useState<Record<string, Centro>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        // Obtener reservas del usuario
        const reservasQuery = query(
          collection(db, "Reservas"),
          where("userId", "==", user.uid)
        );
        const reservasSnapshot = await getDocs(reservasQuery);
        const reservasData: Reserva[] = reservasSnapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            userId: data.userId || "",
            fecha: data.fecha || "",
            hora_inicio: data.hora_inicio || "",
            hora_fin: data.hora_fin || "",
            deporte: data.deporte || "",
            canchaId: data.canchaId || "",
          };
        });

        // Filtrar las reservas para fechas pasadas
        const today = new Date();
        const reservasPasadas = reservasData.filter((reserva) => {
          const reservaFecha = new Date(reserva.fecha);
          return reservaFecha < today;
        });

        // Obtener centros deportivos basados en canchaId
        const centroData: Record<string, Centro> = {};
        for (const reserva of reservasPasadas) {
          const canchaId = reserva.canchaId;
          if (canchaId && !centroData[canchaId]) {
            const centroRef = doc(db, "CentroDeportivo", canchaId);
            const centroSnapshot = await getDoc(centroRef);
            if (centroSnapshot.exists()) {
              const centro = centroSnapshot.data() as DocumentData;
              centroData[canchaId] = {
                nombre: centro.Nombre || "",
                imagen: centro.Imagen || "",
              };
            }
          }
        }

        // Guardar los datos de las reservas y centros deportivos
        setCentros(centroData);
        setReservas(reservasPasadas);
      } catch (error) {
        console.error("Error obteniendo las reservas: ", error);
        setError("Hubo un error al cargar las reservas.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Cargando tus actividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <AnunciosCarousel
  images={[
    "/images/inkober_2024_02_Vegeta_01.png",
    "/images/pedos_Faye_Valentine.png",
    "/images/Uzumaki_practica_01_color.png",
    "/images/nubes_naranjas.png",
  ]}
/>
      <div className="min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Mis Actividades</h1>
        {reservas.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-xl"
          >
            <p className="text-gray-500 text-center">No hay actividades</p> 
            <p className="text-2xl font-semibold text-gray-700 mb-2 text-center">¡Aún no has cumplido ninguna reserva!</p>
            <p className="text-gray-500 text-center">
              Cuando completes tus primeras actividades, aparecerán aquí.
              <br />¡Anímate a hacer tu primera reserva!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300"
              onClick={() => router.push('/reservas')}
            >
              Hacer una reserva
            </motion.button>
          </motion.div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservas.map((reserva, index) => {
              const centro = centros[reserva.canchaId];
              return (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300"
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{reserva.deporte}</h3>
                  <p className="text-gray-600"><strong>Fecha:</strong> {reserva.fecha}</p>
                  <p className="text-gray-600"><strong>Hora:</strong> {reserva.hora_inicio} - {reserva.hora_fin}</p>
                  {centro && (
                    <>
                      <p className="text-gray-600 mt-2"><strong>Centro Deportivo:</strong> {centro.nombre}</p>
                      {centro.imagen && (
                        <img
                          src={centro.imagen}
                          alt={`Imagen de ${centro.nombre}`}
                          className="w-full h-48 object-cover rounded-lg mt-4"
                        />
                      )}
                    </>
                  )}
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MisActividades;
