"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Roboto } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import nubesNaranjas from "../../images/nubes_naranjas.png";
import { useRouter } from "next/navigation";
import CanchaLibreTittle from "@/components/ui/CanchaLibreTittle";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase/firebaseConfig';  // Asegúrate de importar auth correctamente

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export default function LoginForm() {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-])*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(formData.correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (formData.contrasena.trim() === "") {
      setError("Por favor, ingresa una contraseña.");
      return;
    }

    setError("");
    setIsAnimating(true);

    try {
      await signInWithEmailAndPassword(auth, formData.correo, formData.contrasena);
      
      // Si la autenticación es exitosa, redirigir después de la animación
      setTimeout(() => {
        router.push("/home");
      }, 1000);
    } catch (error) {
      setIsAnimating(false);
    
      if (error instanceof Error && 'code' in error) {
        switch ((error as any).code) { // Si 'code' es específico de FirebaseAuth, puedes usar 'any'.
          case 'auth/user-not-found':
            setError('No existe una cuenta con este correo electrónico.');
            break;
          case 'auth/wrong-password':
            setError('Contraseña incorrecta.');
            break;
          default:
            setError('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.');
        }
      } else {
        setError('Ocurrió un error inesperado.');
      }
    }
    
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <motion.div
        className="flex-grow flex flex-col items-center p-4 overflow-y-auto"
        initial={{ opacity: 1, y: 0 }}
        animate={isAnimating ? { opacity: 0, y: -50 } : { opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-md space-y-4 mb-4">
          <div className="flex flex-col items-center space-y-2">
            <CanchaLibreTittle />
          </div>

          <Card className="border-none shadow-none">
            <CardHeader>
              <h2 className="text-xl sm:text-2xl text-center text-blue-600">Iniciar Sesión</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>
                    Correo Electrónico
                  </div>
                  <Input
                    type="email"
                    name="correo"
                    placeholder="ejemplo@email.com"
                    className="w-full px-3 py-2 bg-blue-50/50 border-0 rounded-md"
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>
                    Contraseña
                  </div>
                  <Input
                    type="password"
                    name="contrasena"
                    placeholder="Ingresa tu contraseña"
                    className="w-full px-3 py-2 bg-blue-50/50 border-0 rounded-md"
                    onChange={handleInputChange}
                  />
                  <p className="mt-2 text-sm text-center text-gray-600">
                    ¿Aún no tienes una cuenta?{" "}
                    <a
                      href="/registro"
                      className="text-blue-500 font-bold hover:underline"
                    >
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <Button
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white rounded-md py-2"
                  onClick={handleSubmit}
                >
                  INICIAR
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ opacity: 1, y: 0 }}
        animate={isAnimating ? { opacity: 0, y: -50 } : { opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Image src={nubesNaranjas} alt="Nubes Naranjas" className="w-full" priority />
      </motion.div>
    </div>
  );
}
