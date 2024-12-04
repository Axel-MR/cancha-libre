"use client";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import Footer from "@/components/ui/Footer";
import AnunciosCarousel from "@/components/ui/AnuncioCarousel";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
  Nombre?: string;
  Correo?: string;
  Sexo?: string;
  Telefono?: string;
  CantidadEjercicio?: string;
  Edad?: number;
  Estatura?: number;
  Peso?: number;
  Role?: string;
}


const Perfil = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const db = getFirestore();
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData); // Asegúrate de hacer un cast explícito
        } else {
          console.log("No se encontró el documento de usuario.");
        }
      } catch (error) {
        console.error("Error obteniendo los datos del usuario: ", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleEditCenters = () => {
    router.push("/editarcentros");
  };

  const handleHorarios = () => {
    router.push("/crearReserva");
  };

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
        >
          Cargando...
        </motion.p>
      </motion.div>
    );
  }

  if (!userData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center"
      >
        <p>No se han encontrado datos del usuario.</p>
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
        className="min-h-screen flex flex-col items-center justify-between p-4 bg-gray-100"
      >
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-md space-y-8 bg-white shadow-lg rounded-lg p-6"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <FaUserCircle className="text-6xl text-gray-600" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-[#F4A261] text-center"
            >
              Perfil de {userData.Nombre || userData.Correo}
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence>
                {userData.Correo && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <FaEnvelope />
                      <p className="text-lg">{userData.Correo}</p>
                    </div>
                  </motion.div>
                )}

                {userData.Sexo && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-lg">Sexo: {userData.Sexo}</p>
                  </motion.div>
                )}

                {userData.Telefono && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-lg">Teléfono: {userData.Telefono}</p>
                  </motion.div>
                )}

                {userData.CantidadEjercicio && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-lg">Hago ejercicio cada: {userData.CantidadEjercicio}</p>
                  </motion.div>
                )}

                {userData.Edad && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-lg">Edad: {userData.Edad} años</p>
                  </motion.div>
                )}

                {userData.Estatura && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-lg">Estatura: {userData.Estatura} m</p>
                  </motion.div>
                )}

                {userData.Peso && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-lg">Peso: {userData.Peso} kg</p>
                  </motion.div>
                )}

                {userData.Role === "admin" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    <p className="text-lg">Role: admin</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {userData.Role === "admin" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditCenters}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                >
                  Editar Centros Deportivos
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleHorarios}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
                >
                  Agregar Horarios
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="mt-8 mb-4 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300 flex items-center justify-center space-x-2"
        >
          <FaSignOutAlt />
          <span>Cerrar Sesión</span>
        </motion.button>
      </motion.div>
      <Footer />
    </div>
  );
};

export default Perfil;

