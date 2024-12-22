import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import proyectoService from "../services/proyectoService";
import tareaService from "../services/tareaService";
import "../css/global1Styles.css"; // Importa los estilos proporcionados

const id_usuario = localStorage.getItem("id_usuario");

const Proyecto = () => {
    const [formData, setFormData] = useState({
        id_usuario: id_usuario,
        nombre_proyecto: "",
        descripcion: "",
    });

    const [mostrarTarea, setMostrarTarea] = useState(false);

    const [tareaData, setTareaData] = useState({
        titulo: "",
        descripcion: "",
        fecha_limite: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTareaChange = (e) => {
        const { name, value } = e.target;
        setTareaData({ ...tareaData, [name]: value });
    };

    const crearTarea = async (idProyecto) => {
        if (!idProyecto) {
            toast.error("El ID del proyecto no está disponible.");
            return;
        }

        const nuevaTarea = {
            ...tareaData,
            id_proyecto: idProyecto, // Asegurar que se incluye el id_proyecto
            id_usuario: id_usuario, // Asegurar que se incluye el id_usuario
        };

        console.log("Datos de la tarea enviados al backend:", nuevaTarea); // Depuración

        try {
            await tareaService.crearTarea(nuevaTarea);
            toast.success("Tarea creada exitosamente");
            setTareaData({ titulo: "", descripcion: "", fecha_limite: "" });
        } catch (error) {
            toast.error("Error al crear tarea. Verifica los datos.");
            console.error("Error al crear tarea:", error.response || error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Datos del proyecto enviados al backend:", formData); // Depuración

        try {
            // Crear el proyecto primero
            const proyectoData = await proyectoService.crearProyecto(formData);

            console.log("Respuesta del backend al crear proyecto:", proyectoData); // Depuración

            if (!proyectoData.id_proyecto) {
                throw new Error("No se pudo obtener el ID del proyecto.");
            }

            toast.success("Proyecto creado con éxito");

            // Si se activa el formulario de tareas, crea la tarea
            if (mostrarTarea) {
                const nuevaTarea = {
                    ...tareaData,
                    id_proyecto: proyectoData.id_proyecto, // Asigna el ID del proyecto recién creado
                    id_usuario: id_usuario, // Incluye el ID del usuario
                };

                await tareaService.crearTarea(nuevaTarea);
                toast.success("Tarea creada exitosamente");
                setTareaData({ titulo: "", descripcion: "", fecha_limite: "" });
            }

            // Resetea los formularios
            setFormData({
                id_usuario: id_usuario,
                nombre_proyecto: "",
                descripcion: "",
            });
            setTareaData({
                titulo: "",
                descripcion: "",
                fecha_limite: "",
            });
            setMostrarTarea(false);

            // Redirigir después de un tiempo
            setTimeout(() => {
                window.location.href = "/detalles-proyectos";
            }, 3000);
        } catch (error) {
            toast.error("Error al crear proyecto o tarea. Verifica los datos.");
            console.error("Error al crear proyecto o tarea:", error.response || error);
        }
    };


    return (

        <div className="content">
            <form onSubmit={handleSubmit} className="project-form">
                <h2 className="form-title">Crear Proyecto</h2>

                <table className="table-auto">
                    <table className="table-auto w-full">
                        <tbody>
                            {/* Nombre del proyecto */}
                            <tr>
                                <td colSpan="1" className="flex flex-col w-6/12">
                                    <label className="text-sm font-medium text-gray-700 mb-2">
                                        Nombre del proyecto:
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre_proyecto"
                                        value={formData.nombre_proyecto}
                                        onChange={handleInputChange}
                                        placeholder="Ingrese el nombre del proyecto"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>

                            </tr>

                            {/* Descripción */}
                            <tr>
                                <td colSpan="2" className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-2">
                                        Descripción:
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleInputChange}
                                        placeholder="Ingrese la descripción"
                                        required
                                        rows="2"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    ></textarea>
                                </td>
                            </tr>

                            {/* Botones */}
                            <tr>
                                <td colSpan="2" className="pt-4">
                                    <div className="button-container flex gap-4">
                                        <button type="submit" className="button-primary px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                            Crear Proyecto {mostrarTarea && "y Tarea"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setMostrarTarea(!mostrarTarea)}
                                            className="button-secondary px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        >
                                            {mostrarTarea ? "Ocultar" : "Agregar tarea"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </table>

                {mostrarTarea && (
                    <table className="table-auto mt-4 w-full">
                        <tbody>
                            {/* Título y Fecha límite en la misma fila */}
                            <tr className="flex justify-between">
                                <td className="flex flex-col w-6/12 pr-2">
                                    <label className="text-sm font-medium text-gray-700 mb-2">
                                        Título de la tarea:
                                    </label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={tareaData.titulo}
                                        onChange={handleTareaChange}
                                        placeholder="Ingrese el título de la tarea"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>
                                <td className="flex flex-col w-6/12 pl-2">
                                    <label className="text-sm font-medium text-gray-700 mb-2">
                                        Fecha límite:
                                    </label>
                                    <input
                                        type="date"
                                        name="fecha_limite"
                                        value={tareaData.fecha_limite}
                                        onChange={handleTareaChange}
                                        required
                                        className="w-full p-2 border border-gray-300 rounded"
                                    />
                                </td>
                            </tr>
                            {/* Descripción en una fila completa */}
                            <tr>
                                <td colSpan="2" className="flex flex-col w-full mt-4">
                                    <label className="text-sm font-medium text-gray-700 mb-2">
                                        Descripción de la tarea:
                                    </label>
                                    <textarea
                                        name="descripcion"
                                        value={tareaData.descripcion}
                                        onChange={handleTareaChange}
                                        placeholder="Ingrese la descripción de la tarea"
                                        required
                                        rows="4"
                                        className="w-full p-2 border border-gray-300 rounded"
                                    ></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                )}

            </form>
            <ToastContainer />
        </div>
    );
};

export default Proyecto;
