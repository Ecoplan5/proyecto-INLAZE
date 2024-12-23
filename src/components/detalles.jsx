import React, { useState, useEffect } from "react";
import { FaPencilAlt } from 'react-icons/fa';

import proyectoService from "../services/proyectoService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/global1Styles.css"; // Importa el archivo CSS

const Detalle = () => {
    const [proyectos, setProyectos] = useState([]);
    const [filteredProyectos, setFilteredProyectos] = useState([]);
    const [mostrarTareas, setMostrarTareas] = useState(true);
    const [proyectoEditable, setProyectoEditable] = useState(null);
    const [nombreProyecto, setNombreProyecto] = useState("");
    const [descripcionProyecto, setDescripcionProyecto] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterState, setFilterState] = useState("todos");
    const [filterDate, setFilterDate] = useState("");

    // Función para obtener proyectos
    const obtenerProyectos = async () => {
        try {
            const proyectos = await proyectoService.getAllProyectos();
            setProyectos(proyectos);
        } catch (error) {
            toast.error("Error al obtener proyectos");
            console.error("Error al obtener proyectos:", error);
        }
    };

    useEffect(() => {
        obtenerProyectos();
    }, []);

    useEffect(() => {
        const filterData = () => {
            let filtered = proyectos;

            if (searchKeyword) {
                filtered = filtered.filter(
                    (proyecto) =>
                        proyecto.nombre_proyecto.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        proyecto.descripcion.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        proyecto.Usuario.nombre_usuario.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        proyecto.Tareas.some((tarea) =>
                            tarea.titulo.toLowerCase().includes(searchKeyword.toLowerCase())
                        )
                );
            }

            if (filterState !== "todos") {
                filtered = filtered.filter((proyecto) =>
                    proyecto.Tareas.some((tarea) => tarea.estado === filterState)
                );
            }

            if (filterDate) {
                filtered = filtered.filter((proyecto) =>
                    proyecto.Tareas.some((tarea) => tarea.fecha_limite === filterDate)
                );
            }

            setFilteredProyectos(filtered);
        };

        filterData();
    }, [searchKeyword, filterState, filterDate, proyectos]);

    // Función para abrir el modal de edición
    const manejarEdicion = (proyecto) => {
        setProyectoEditable(proyecto);
        setNombreProyecto(proyecto.nombre_proyecto);
        setDescripcionProyecto(proyecto.descripcion);
    };

    const guardarCambios = async () => {
        try {
            await proyectoService.modificarProyecto(proyectoEditable.id_proyecto, {
                nombre_proyecto: nombreProyecto,
                descripcion: descripcionProyecto,
            });

            setProyectos((prevProyectos) =>
                prevProyectos.map((proyecto) =>
                    proyecto.id_proyecto === proyectoEditable.id_proyecto
                        ? { ...proyecto, nombre_proyecto: nombreProyecto, descripcion: descripcionProyecto }
                        : proyecto
                )
            );

            toast.success("Proyecto actualizado con éxito");
            setProyectoEditable(null);
        } catch (error) {
            toast.error("Error al actualizar el proyecto");
            console.error("Error al actualizar el proyecto:", error);
        }
    };

    return (
        <div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

            <div className="mb-4">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setMostrarTareas((prev) => !prev)}
                >
                    {mostrarTareas ? "Ocultar Tareas" : "Mostrar Tareas"}
                </button>
            </div>


            <div className="rounded-lg p-3 mb-4">
                <h6 className="text-xl font-bold">Búsquedas y Filtros</h6>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por palabra clave o usuario..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="p-2 border border-gray-400 rounded"
                    />
                    <select
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                        className="p-2 border border-gray-400 rounded"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="por_hacer">Por hacer</option>
                        <option value="en_progreso">En progreso</option>
                        <option value="completada">Completada</option>
                    </select>
                </div>
                <div className="rounded-lg p-3">
                    <h6 className="text-xl font-bold">LISTA DE PROYECTOS</h6>
                </div>
            </div>

            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">ID Proyecto</th>
                        <th className="border border-gray-300 px-4 py-2">Nombre Proyecto</th>
                        <th className="border border-gray-300 px-4 py-2">Descripción</th>
                        <th className="border border-gray-300 px-4 py-2">Usuario Creador</th>
                        <th className="border border-gray-300 px-4 py-2">Tareas</th>
                        <th className="border border-gray-300 px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProyectos.length > 0 ? (
                        filteredProyectos.map((proyecto) => (
                            <React.Fragment key={proyecto.id_proyecto}>
                                <tr>
                                    {/* Datos del proyecto */}
                                    <td className="border border-gray-300 px-4 py-2">{proyecto.id_proyecto}</td>
                                    <td className="border border-gray-300 px-4 py-2">{proyecto.nombre_proyecto}</td>
                                    <td className="border border-gray-300 px-4 py-2">{proyecto.descripcion}</td>
                                    <td className="border border-gray-300 px-4 py-2">{proyecto.usuario_creador.nombre_usuario}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {mostrarTareas && (
                                            <table className="table-auto w-full border-collapse border border-gray-200">
                                                <thead>
                                                    <tr>
                                                        <th className="border border-gray-300 px-4 py-2">Título</th>
                                                        <th className="border border-gray-300 px-4 py-2">Descripción</th>
                                                        <th className="border border-gray-300 px-4 py-2">Fecha Límite</th>
                                                        <th className="border border-gray-300 px-4 py-2">Estado</th>
                                                        <th className="border border-gray-300 px-4 py-2">Asignados</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {proyecto.tareas.map((tarea) => (
                                                        <tr key={tarea.id_tarea}>
                                                            {/* Datos de la tarea */}
                                                            <td className="border border-gray-300 px-4 py-2">{tarea.titulo}</td>
                                                            <td className="border border-gray-300 px-4 py-2">{tarea.descripcion}</td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {new Date(tarea.fecha_limite).toLocaleDateString()}
                                                            </td>
                                                            <td className="border border-gray-300 px-4 py-2">{tarea.estado}</td>
                                                            <td className="border border-gray-300 px-4 py-2">
                                                                {tarea.usuarios.length > 0 ? (
                                                                    <ul className="list-disc pl-5">
                                                                        {tarea.usuarios.map((usuario) => (
                                                                            <li key={usuario.id_usuario}>{usuario.nombre_usuario}</li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <span className="text-gray-500">No asignados</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex flex-col items-center text-center">
                                            <button
                                                className="text-yellow-500 hover:text-yellow-600"
                                                onClick={() => manejarEdicion(proyecto)}
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <p className="text-xs text-gray-600 mt-1">Proyecto</p>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                                No hay proyectos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>



            {proyectoEditable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-xl font-bold mb-4">Editar Proyecto</h2>
                        <label className="block mb-2">
                            <strong>Nombre</strong>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded mt-1"
                                value={nombreProyecto}
                                onChange={(e) => setNombreProyecto(e.target.value)}
                            />
                        </label>
                        <label className="block mb-4">
                            <strong>Descripción</strong>
                            <textarea
                                className="w-full border px-3 py-2 rounded mt-1"
                                value={descripcionProyecto}
                                onChange={(e) => setDescripcionProyecto(e.target.value)}
                            ></textarea>
                        </label>
                        <div className="flex justify-end gap-4">
                            <button
                                className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                                onClick={() => setProyectoEditable(null)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                onClick={guardarCambios}
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Detalle;
