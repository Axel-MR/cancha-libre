"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { db, collection, addDoc } from '../../firebase/firebaseConfig'; // Importar Firebase
import Footer from '@/components/ui/Footer';

const DEPORTES_DISPONIBLES = [
  "Basquétbol",
  "Fútbol Profesional",
  "Fútbol Rápido", 
  "Frontón",
  "Voleibol",
  "Tenis", 
  "Beisbol"
];

const CrearCentros = () => {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [imagen, setImagen] = useState('');
  const [deportes, setDeportes] = useState<string[]>([]);
  const [nuevoDeporte, setNuevoDeporte] = useState('');
  const [success, setSuccess] = useState(false);

  const agregarDeporte = () => {
    if (nuevoDeporte && !deportes.includes(nuevoDeporte)) {
      setDeportes([...deportes, nuevoDeporte]);
      setNuevoDeporte('');
    }
  };

  const eliminarDeporte = (deporteAEliminar) => {
    setDeportes(deportes.filter(deporte => deporte !== deporteAEliminar));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar los datos del centro deportivo
    const centroDeportivo = {
      Nombre: nombre,
      Ubicacion: ubicacion,
      Imagen: imagen,
      Deportes: deportes
    };

    try {
      // Agregar el nuevo centro deportivo a la colección en Firestore
      await addDoc(collection(db, "CentroDeportivo"), centroDeportivo);
      
      // Limpiar formulario
      setNombre('');
      setUbicacion('');
      setImagen('');
      setDeportes([]);

      // Mostrar mensaje de éxito
      setSuccess(true);

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error al agregar el centro deportivo: ", error);
    }
  };

  return (
    <div>
    <div className="container mx-auto p-4">
      {success && (
        <Alert className="mb-4 bg-green-50">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Centro Deportivo Creado</AlertTitle>
          <AlertDescription>
            El centro deportivo se ha guardado exitosamente.
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Crear Nuevo Centro Deportivo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block mb-2">Nombre del Centro</label>
              <Input 
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa el nombre del centro deportivo"
                required
              />
            </div>

            <div>
              <label htmlFor="ubicacion" className="block mb-2">Ubicación</label>
              <Input 
                id="ubicacion"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="Dirección completa del centro"
                required
              />
            </div>

            <div>
              <label htmlFor="imagen" className="block mb-2">URL de la Imagen</label>
              <Input 
                id="imagen"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                placeholder="URL de la imagen del centro deportivo"
                required
              />
            </div>

            <div>
              <label htmlFor="deportes" className="block mb-2">Deportes Disponibles</label>
              <div className="flex">
                <Select 
                  value={nuevoDeporte} 
                  onValueChange={setNuevoDeporte}
                >
                  <SelectTrigger className="mr-2">
                    <SelectValue placeholder="Selecciona un deporte" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPORTES_DISPONIBLES
                      .filter(deporte => !deportes.includes(deporte))
                      .map((deporte) => (
                        <SelectItem key={deporte} value={deporte}>
                          {deporte}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  onClick={agregarDeporte}
                  disabled={!nuevoDeporte}
                  variant="outline"
                >
                  Agregar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {deportes.map((deporte, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="flex items-center"
                  >
                    {deporte}
                    <X 
                      className="ml-2 cursor-pointer" 
                      size={16} 
                      onClick={() => eliminarDeporte(deporte)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Guardar Centro Deportivo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    <Footer />
    </div>
  );
};

export default CrearCentros;
