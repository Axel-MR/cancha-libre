'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Roboto } from 'next/font/google';
import Image from 'next/image';
import nubesNaranjas from '../../images/nubes_naranjas.png';
import Select from 'react-select';
import CanchaLibreTittle from "@/components/ui/CanchaLibreTittle";
import { setDoc, doc } from 'firebase/firestore';
import { db } from "@/firebase/firebaseConfig";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const auth = getAuth();

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const sexoOptions = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'null', label: 'Prefiero no decirlo' }
];

const practicasEjercicioOptions = [
  { value: 'nunca', label: 'Nunca' },
  { value: '1-2_veces_semana', label: '1-2 veces por semana' },
  { value: '3-4_veces_semana', label: '3-4 veces por semana' },
  { value: '5_o_mas_veces_semana', label: '5 o más veces por semana' }
];

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  password: string;
  edad: string;
  estatura: string;
  sexo: string;
  peso: string;
  practicas_ejercicio: string;
}

export default function UnifiedRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    password: "",
    edad: '',
    estatura: '',
    sexo: '',
    peso: '',
    practicas_ejercicio: '',
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let validatedValue = value;

    switch(name) {
      case 'edad':
        validatedValue = value.replace(/\D/g, '').slice(0, 3);
        break;
      case 'estatura':
      case 'peso':
        validatedValue = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        break;
      case 'telefono':
        validatedValue = value.replace(/\D/g, "").slice(0, 10);
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: validatedValue,
    }));
  };

  const handleSelectChange = (name: keyof FormData, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value || '',
    }));
  };

  const handleFirstStepSubmit = () => {
    setCurrentStep(2);
  };

  const handleFinalSubmit = async () => {
    try {
      if (!formData.correo || !formData.password) {
        throw new Error('El correo electrónico y la contraseña son obligatorios');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.correo, formData.password);
      const user = userCredential.user;

      const fullName = `${formData.nombre} ${formData.apellido}`;

      const userData = {
        Nombre: fullName,
        Correo: formData.correo,
        Telefono: formData.telefono,
        Edad: formData.edad ? parseInt(formData.edad) : null,
        Estatura: formData.estatura ? parseFloat(formData.estatura) : null,
        Peso: formData.peso ? parseFloat(formData.peso) : null,
        Sexo: formData.sexo || null,
        CantidadEjercicio: formData.practicas_ejercicio || null,
        Role: "normal"
      };

      await setDoc(doc(db, "usuarios", user.uid), userData);

      router.push('/login');
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('Este correo electrónico ya está en uso. Por favor, utiliza otro.');
            break;
          case 'auth/operation-not-allowed':
            alert('La autenticación por correo electrónico y contraseña no está habilitada. Por favor, contacta al administrador.');
            break;
          case 'auth/weak-password':
            alert('La contraseña es demasiado débil. Por favor, usa una contraseña más fuerte.');
            break;
          default:
            alert('Hubo un error al registrar tus datos. Por favor, intenta de nuevo.');
        }
      } else {
        alert('Hubo un error inesperado. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="flex-grow flex flex-col items-center p-4 overflow-y-auto">
        <div className="w-full max-w-md space-y-4 mb-4">
          <div className="flex flex-col items-center space-y-2">
            <CanchaLibreTittle />
          </div>

          <Card className="border-none shadow-none">
            <CardContent className="space-y-4">
              {currentStep === 1 ? (
                <div className="space-y-3">
                  {[
                    { label: "Nombre", name: "nombre", placeholder: "Ingresa tu nombre o nombres", maxLength: 50 },
                    { label: "Apellido", name: "apellido", placeholder: "Ingresa tus apellidos", maxLength: 50 },
                    { label: "Correo electrónico", name: "correo", placeholder: "ejemplo@email.com", type: "email" },
                    { label: "Número telefónico", name: "telefono", placeholder: "XX-XX-XX-XX-XX", type: "tel" },
                    { label: "Contraseña", name: "password", placeholder: "Ingresa tu contraseña", type: "password" }
                  ].map(({ label, name, placeholder, maxLength, type = "text" }) => (
                    <div key={name}>
                      <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>
                        {label}
                      </div>
                      <Input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={formData[name as keyof FormData]}
                        className="w-full px-3 py-2 bg-blue-50/50 border-0 rounded-md"
                        onChange={handleInputChange}
                        maxLength={maxLength}
                      />
                    </div>
                  ))}

                  <div className="flex justify-end mt-4">
                    <Button
                      className="w-32 bg-blue-400 hover:bg-blue-500 text-white rounded-md py-2"
                      onClick={handleFirstStepSubmit}
                    >
                      CONTINUAR
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>Estos datos son opcionales</div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>Edad</div>
                      <Input
                        type="text"
                        name="edad"
                        placeholder="Ingresa tu edad"
                        value={formData.edad}
                        className="w-full px-3 py-2 bg-blue-50/50 border-0 rounded-md"
                        onChange={handleInputChange}
                        maxLength={3}
                      />
                    </div>
                    <div>
                      <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>Estatura</div>
                      <div className="flex items-center">
                        <Input
                          type="text"
                          name="estatura"
                          placeholder="Ingresa tu estatura"
                          value={formData.estatura}
                          className="w-full px-3 py-2 bg-blue-50/50 border-0 rounded-md"
                          onChange={handleInputChange}
                        />
                        <span className="ml-2 text-blue-600">m</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative z-20">
                      <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>Sexo</div>
                      <Select
                        name="sexo"
                        options={sexoOptions}
                        value={sexoOptions.find((option) => option.value === formData.sexo)}
                        onChange={(option) => handleSelectChange('sexo', option?.value ?? '')}
                        className="w-full"
                        placeholder="Selecciona tu sexo"
                        styles={{
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    </div>
                    <div>
                      <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>Peso</div>
                      <div className="flex items-center">
                        <Input
                          type="text"
                          name="peso"
                          placeholder="Ingresa tu peso"
                          value={formData.peso}
                          className="w-full px-3 py-2 bg-blue-50/50 border-0 rounded-md"
                          onChange={handleInputChange}
                        />
                        <span className="ml-2 text-blue-600">Kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 relative z-10">
                    <div className={`${roboto.className} text-blue-600 font-bold mb-1`}>
                      Cantidad de veces en las que practicas ejercicio
                    </div>
                    <Select
                      name="practicas_ejercicio"
                      options={practicasEjercicioOptions}
                      value={practicasEjercicioOptions.find(
                        (option) => option.value === formData.practicas_ejercicio
                      )}
                      onChange={(option) => handleSelectChange('practicas_ejercicio', option?.value ?? '')}
                      className="w-full"
                      placeholder="Selecciona una opción"
                      styles={{
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),
                      }}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      className="w-32 bg-blue-400 hover:bg-blue-500 text-white rounded-md py-2"
                      onClick={handleFinalSubmit}
                    >
                      ¡REGÍSTRATE!
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <Image src={nubesNaranjas} alt="Nubes Naranjas" className="w-full" priority />
      </div>
    </div>
  );
}

