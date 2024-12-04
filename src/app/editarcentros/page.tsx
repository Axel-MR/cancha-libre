"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import Footer from "@/components/ui/Footer";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

// Define una interfaz para el tipo de centro deportivo
interface CentroDeportivo {
  id: string;
  Nombre: string;
  Ubicacion: string;
  Imagen: string;
  Deportes: string[];
}

const EditarCentrosPage = () => {
  const [centrosDeportivos, setCentrosDeportivos] = useState<CentroDeportivo[]>([]);
  const [editandoCentro, setEditandoCentro] = useState<CentroDeportivo | null>(null);
  const [formData, setFormData] = useState<CentroDeportivo>({
    id: "",
    Nombre: "",
    Ubicacion: "",
    Imagen: "",
    Deportes: [],
  });
  const [actualizacionExitosa, setActualizacionExitosa] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCentrosDeportivos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "CentroDeportivo"));
        const centros = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CentroDeportivo[];
        setCentrosDeportivos(centros);
      } catch (error) {
        console.error("Error al obtener los centros deportivos:", error);
      }
    };

    fetchCentrosDeportivos();
  }, []);

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Maneja la actualización del centro
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editandoCentro) return;

    const centroRef = doc(db, "CentroDeportivo", editandoCentro.id);
    try {
      await updateDoc(centroRef, formData as { [key: string]: any });
      alert("Centro actualizado correctamente");
      setActualizacionExitosa(true); // Usamos la función correctamente
      setTimeout(() => setActualizacionExitosa(false), 3000);
      setEditandoCentro(null);
      setFormData({
        id: "",
        Nombre: "",
        Ubicacion: "",
        Imagen: "",
        Deportes: [],
      });

      // Refrescar los centros deportivos
      const querySnapshot = await getDocs(collection(db, "CentroDeportivo"));
      const centros = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CentroDeportivo[];
      setCentrosDeportivos(centros);
    } catch (error) {
      // Verificación de tipo para manejar el error de tipo unknown
      if (error instanceof Error) {
        // Maneja el error cuando es una instancia de Error
        console.error("Error al actualizar el centro:", error.message);
      } else if (error && typeof error === "object" && "code" in error) {
        // Verifica que 'code' exista en el error
        console.error("Error desconocido con código:", (error as any).code);
      } else {
        console.error("Error desconocido:", error);
      }
    }
  };

  // Muestra el formulario de edición cuando se hace clic en un centro
  const handleEditClick = (centro: CentroDeportivo) => {
    setEditandoCentro(centro);
    setFormData({
      id: centro.id,
      Nombre: centro.Nombre,
      Ubicacion: centro.Ubicacion,
      Imagen: centro.Imagen,
      Deportes: centro.Deportes,
    });
  };

  // Función para redirigir a la página de registro
  const handleRegistrarNuevoCentro = () => {
    router.push("/registrarCentros");
  };

  return (
    <div className="container mx-auto p-4">
      {/* Muestra los centros deportivos obtenidos desde Firestore */}
      {centrosDeportivos.map((centro) => (
        <Card key={centro.id} className="max-w-2xl mx-auto mb-4">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {centro.Nombre}
            </CardTitle>
            <button
              onClick={() => handleEditClick(centro)}
              className="text-blue-500 mt-2"
            >
              Editar
            </button>
          </CardHeader>
          <CardContent>
            {/* Imagen del Centro Deportivo */}
            <div className="mb-4">
              <img
                src={centro.Imagen} // Usa la imagen almacenada en Firestore
                alt={centro.Nombre}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Ubicación */}
            <div className="flex items-center mb-4">
              <MapPin className="mr-2 text-gray-600" />
              <span>{centro.Ubicacion}</span>
            </div>

            {/* Deportes Disponibles */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Deportes Disponibles
              </h3>
              <div className="flex flex-wrap gap-2">
                {centro.Deportes.map((deporte, index) => (
                  <Badge key={index} variant="secondary">
                    {deporte}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Formulario para editar */}
      {editandoCentro && (
        <div className="max-w-2xl mx-auto mt-4">
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label htmlFor="Nombre" className="block text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="Nombre"
                id="Nombre"
                value={formData.Nombre}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Ubicacion" className="block text-gray-700">
                Ubicación
              </label>
              <input
                type="text"
                name="Ubicacion"
                id="Ubicacion"
                value={formData.Ubicacion}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Imagen" className="block text-gray-700">
                Imagen
              </label>
              <input
                type="text"
                name="Imagen"
                id="Imagen"
                value={formData.Imagen}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md"
              >
                Actualizar Centro
              </button>
            </div>
            <div className="container mx-auto p-4">
              {/* Mostrar mensaje de éxito si la actualización fue exitosa */}
              {actualizacionExitosa && (
                <div className="bg-green-500 text-white p-4 rounded-md mb-4">
                  Centro actualizado correctamente.
                </div>
              )}

              {/* Resto de tu código */}
            </div>
          </form>
        </div>
      )}

      {/* Botón para registrar un nuevo centro */}
      <div className="mt-8 mb-8 text-center">
        <button
          onClick={handleRegistrarNuevoCentro}
          className="bg-blue-500 text-white py-2 px-6 rounded-md shadow-lg hover:bg-green-600"
        >
          Registrar Nuevo Centro Deportivo
        </button>
      </div>

      <Footer />
    </div>
  );
};

export default EditarCentrosPage;
