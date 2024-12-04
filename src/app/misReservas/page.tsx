"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Footer from "@/components/ui/Footer";
import AnunciosCarousel from "@/components/ui/AnuncioCarousel";
import { motion, AnimatePresence } from "framer-motion";

// Definimos los tipos para las reservas y centros deportivos
interface Reserva {
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  deporte: string;
  canchaId?: string;
}

interface Centro {
  nombre: string;
  imagen: string;
}

const MisReservas = () => {
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
        const reservasQuery = query(
          collection(db, "Reservas"),
          where("userId", "==", user.uid)
        );
        const reservasSnapshot = await getDocs(reservasQuery);
        const reservasData: Reserva[] = reservasSnapshot.docs.map((doc) =>
          doc.data() as Reserva
        );

        const today = new Date();
        const reservasFuturas = reservasData.filter((reserva) => {
          const reservaFecha = new Date(reserva.fecha);
          return reservaFecha >= today;
        });

        const centroData: Record<string, Centro> = {};
        for (const reserva of reservasFuturas) {
          const canchaId = reserva.canchaId;
          if (canchaId && !centroData[canchaId]) {
            const centroRef = doc(db, "CentroDeportivo", canchaId);
            const centroSnapshot = await getDoc(centroRef);
            if (centroSnapshot.exists()) {
              const centro = centroSnapshot.data();
              centroData[canchaId] = {
                nombre: centro.Nombre,
                imagen: centro.Imagen,
              };
            }
          }
        }

        setCentros(centroData);
        setReservas(reservasFuturas);
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.p
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-xl font-semibold text-gray-600"
        >
          Cargando tus reservas...
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </motion.div>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-100 p-4"
      >
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-4xl font-bold text-center mb-8 text-gray-800"
        >
          Mis Reservas
        </motion.h1>
        <AnimatePresence>
          {reservas.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center p-8 bg-white shadow-lg rounded-xl"
            >
              <p className="text-gray-500 text-center">No hay reservas</p>
              <p className="text-2xl font-semibold text-gray-700 mb-2 text-center">
                ¡Aún no tienes reservas futuras o para hoy!
              </p>
              <p className="text-gray-500 text-center">
                Cuando hagas tus reservas de canchas, aparecerán aquí.
                <br />¡Anímate a hacer tu una reserva ;) !
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition duration-300"
                onClick={() => router.push("/reservas")}
              >
                Hacer una reserva
              </motion.button>
            </motion.div>
          ) : (
            <motion.ul
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reservas.map((reserva, index) => {
                const centro = centros[reserva.canchaId || ""];
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition duration-300"
                  >
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      {reserva.deporte}
                    </h3>
                    <p className="text-gray-600">
                      <strong>Fecha:</strong> {reserva.fecha}
                    </p>
                    <p className="text-gray-600">
                      <strong>Hora:</strong> {reserva.hora_inicio} -{" "}
                      {reserva.hora_fin}
                    </p>
                    {centro && (
                      <>
                        <p className="text-gray-600 mt-2">
                          <strong>Centro Deportivo:</strong> {centro.nombre}
                        </p>
                        {centro.imagen && (
                          <motion.img
                            src={centro.imagen}
                            alt={`Imagen de ${centro.nombre}`}
                            className="w-full h-48 object-cover rounded-lg mt-4"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          />
                        )}
                      </>
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
      <Footer />
    </div>
  );
};

export default MisReservas;
