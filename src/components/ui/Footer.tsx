"use client";
import React, { useState, useEffect } from "react";
import { FaEnvelope, FaHome, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { auth } from "../../firebase/firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Footer = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(getFirestore(), "usuarios", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            const nombre = userData.nombre || "";
            const firstTwoWords = nombre.split(" ").slice(0, 2).join(" ");
            setUserName(firstTwoWords);
          }
        } catch (error) {
          console.error("Error obteniendo los datos del usuario: ", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-[#F4A261] text-white py-6">
      <div className="container mx-auto grid grid-cols-5 gap-4 justify-items-center">
        {/* Icono de contacto */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <a href="/contacto" className="text-2xl hover:text-blue-600">
            <FaEnvelope />
          </a>
        </motion.div>

        {/* Icono de Mi Actividad */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <a href="/miActividad" className="text-2xl hover:text-blue-600">
            <FontAwesomeIcon icon={faPersonRunning} />
          </a>
        </motion.div>

        {/* Icono de Home */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <a href="/home" className="text-2xl hover:text-blue-600">
            <FaHome />
          </a>
        </motion.div>

        {/* Icono de Mis Reservas */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <a href="/misReservas" className="text-2xl hover:text-blue-600">
            <FaCalendarAlt />
          </a>
        </motion.div>

        {/* Ícono de Perfil */}
        <motion.div
          className="flex justify-center items-center relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <a href="/perfil" className="text-2xl hover:text-blue-600">
            <FaUserCircle />
          </a>

          {/* Mostrar nombre del usuario debajo del ícono */}
          {userName && (
            <div className="absolute top-10 text-center text-sm font-semibold text-white">
              {userName}
            </div>
          )}
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
