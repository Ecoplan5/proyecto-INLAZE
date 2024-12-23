import React, { useState, useEffect } from 'react';
import { FaEye, FaPencilAlt, FaTrash } from 'react-icons/fa';
import usuarioService from "../services/usuarioService"; // Servicio para obtener los usuarios
import Select from "react-select";

import proyectoService from '../services/proyectoService';
import comentarioService from '../services/comentariosService';
import tareaService from '../services/tareaService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../css/global1Styles.css";

const ProyectoList = () => {
    const [proyectos, setProyectos] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [mostrarTarea, setMostrarTarea] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [mostrarComentarios, setMostrarComentarios] = useState(null);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [comentarioEditable, setComentarioEditable] = useState(null);
    const [contenidoEditado, setContenidoEditado] = useState("");
    const [filteredProyectos, setFilteredProyectos] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterState, setFilterState] = useState("todos");
    const [filterDate, setFilterDate] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuarios, setSelectedUsuarios] = useState([]);

    const userId = parseInt(localStorage.getItem("id_usuario"), 10);
    const userRole = parseInt(localStorage.getItem("id_rol"), 10);
    const userName = localStorage.getItem("nombre_usuario");


    const [tareaData, setTareaData] = useState({
        titulo: '',
        descripcion: '',
        fecha_limite: '',
    });
    //aqui obtengo el id del usuario logueado

    // Función para obtener proyectos
    const obtenerProyectos = async () => {
        try {
            const proyectos = await proyectoService.getAllProyectos();
            setProyectos(proyectos);
        } catch (error) {
            toast.error('Error al obtener proyectos');
            console.error('Error al obtener proyectos:', error);
        }
    };

    useEffect(() => {
        obtenerProyectos();

    }, []);

    useEffect(() => {
        console.log('Estado actual de comentarios:', comentarios);
    }, [comentarios]);


    // Manejo de cambios en los campos de la tarea
    const handleTareaChange = (e) => {
        const { name, value } = e.target;
        setTareaData({ ...tareaData, [name]: value });
    };

    // Obtener usuarios disponibles al cargar el componente
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await usuarioService.obtenerUsuarios(); // Obtén usuarios del backend
                const opcionesUsuarios = response
                    .filter(usuario => usuario.id_usuario !== 1) // Excluir usuario con ID 1
                    .map(usuario => ({
                        value: usuario.id_usuario,
                        label: usuario.nombre_usuario,
                    }));
                setUsuarios(opcionesUsuarios);
            } catch (error) {
                toast.error("Error al cargar los usuarios.");
                console.error("Error al cargar usuarios:", error);
            }
        };

        fetchUsuarios();
    }, []);


    const handleUsuarioSelect = (selectedOptions) => {
        setSelectedUsuarios(selectedOptions);
    };
    // Crear tarea asociada al proyecto seleccionado
    const crearTarea = async () => {
        if (!mostrarTarea) return;
        try {
            const nuevaTarea = {
                ...tareaData,
                id_proyecto: mostrarTarea,
                id_usuario: userId,
                usuarios: selectedUsuarios.map(usuario => usuario.value), // IDs de usuarios seleccionados

            };
            await tareaService.crearTarea(nuevaTarea);
            toast.success('Tarea creada exitosamente');
            setTareaData({ titulo: '', descripcion: '', fecha_limite: '' });
            setMostrarTarea(null);
            obtenerProyectos(); // Refrescar lista de proyectos
        } catch (error) {
            toast.error('Error al crear tarea. Verifica los datos.');
            console.error('Error al crear tarea:', error);
        }
    };

    // Función para actualizar el estado de una tarea
    const actualizarEstadoTarea = async (id, nuevoEstado) => {
        try {
            await tareaService.editarTarea(id, { estado: nuevoEstado });
            toast.success('Estado actualizado exitosamente');
            obtenerProyectos();
        } catch (error) {
            toast.error('Error al actualizar el estado');
            console.error('Error al actualizar el estado:', error);
        }
    };

    // Función para eliminar una tarea
    const eliminarTarea = async (id_tarea) => {
        try {
            await tareaService.eliminarTarea(id_tarea);
            toast.success('Tarea eliminada exitosamente');
            obtenerProyectos();
        } catch (error) {
            toast.error('Error al eliminar tarea');
            console.error('Error al eliminar tarea:', error);
        }
    };

    // Función para manejar la edición de tareas
    const [editarTareaId, setEditarTareaId] = useState(null);
    const manejarEdicion = (tarea) => {
        setEditarTareaId(tarea.id_tarea); // Guardamos el ID de la tarea que se está editando
        setTareaData({
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            fecha_limite: new Date(tarea.fecha_limite).toISOString().split('T')[0], // Asegura el formato yyyy-mm-dd
        });
    };



    const actualizarTarea = async () => {
        try {
            // Actualizar datos de la tarea incluyendo usuarios seleccionados
            const tareaActualizada = {
                ...tareaData,
                usuarios: selectedUsuarios.map(usuario => usuario.value), // IDs de usuarios seleccionados
            };

            // Log para verificar los datos enviados
            console.log("Datos enviados para actualizar la tarea:", tareaActualizada);

            await tareaService.modificarTarea(editarTareaId, tareaActualizada);
            toast.success('Tarea editada exitosamente');
            setTareaData({ titulo: '', descripcion: '', fecha_limite: '' });
            setSelectedUsuarios([]); // Limpiar usuarios seleccionados
            setEditarTareaId(null); // Cerrar el modal
            obtenerProyectos(); // Refrescar lista de proyectos
        } catch (error) {
            toast.error('Error al editar tarea');
            console.error('Error al editar tarea:', error);
        }
    };



    const [comentariosPorTarea, setComentariosPorTarea] = useState({}); // Estado para comentarios por tarea
    const obtenerComentarios = async (id_tarea) => {
        if (!id_tarea) {
            console.warn("No se proporcionó id_tarea");
            return;
        }

        try {
            const comentarios = await comentarioService.obtenerComentarios(id_tarea);
            console.log("Comentarios obtenidos para tarea:", id_tarea, comentarios);

            setComentariosPorTarea((prev) => ({
                ...prev,
                [id_tarea]: comentarios,
            }));

            setMostrarComentarios(id_tarea); // Mostrar los comentarios para esta tarea
        } catch (error) {
            toast.error("Error al obtener comentarios");
            console.error("Error al obtener comentarios:", error);
        }
    };


    // Función para manejar la edición de un comentario
    const manejarEdicionComentario = (comentario) => {
        setComentarioEditable(comentario.id_comentario);
        setContenidoEditado(comentario.contenido);
    };

    const actualizarComentario = async (idComentario) => {
        try {
            await comentarioService.modificarComentario(idComentario, {
                contenido: contenidoEditado,
            });
            toast.success("Comentario editado exitosamente");
            setComentarioEditable(null);
            setContenidoEditado("");
            obtenerComentarios(mostrarComentarios);
        } catch (error) {
            toast.error("Error al editar comentario");
            console.error("Error al editar comentario:", error);
        }
    };




    // Función para agregar un nuevo comentario
    const agregarComentario = async (idTarea) => {
        if (!nuevoComentario.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }
        try {
            await comentarioService.crearComentario({
                contenido: nuevoComentario,
                id_tarea: idTarea,
                id_usuario: userId,
            });
            toast.success('Comentario agregado');
            setNuevoComentario('');
            obtenerComentarios(idTarea); // Refresca la lista de comentarios
        } catch (error) {
            toast.error('Error al agregar comentario');
            console.error('Error al agregar comentario:', error);
        }
    };


    useEffect(() => {
        const filterData = () => {
            let filtered = proyectos;

            // Filtrar por palabra clave y usuario
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

            // Filtrar por estado de tareas
            if (filterState !== "todos") {
                filtered = filtered.filter((proyecto) =>
                    proyecto.Tareas.some((tarea) => tarea.estado === filterState)
                );
            }

            // Filtrar por fecha
            if (filterDate) {
                filtered = filtered.filter((proyecto) =>
                    proyecto.Tareas.some((tarea) => tarea.fecha_limite === filterDate)
                );
            }

            setFilteredProyectos(filtered);
        };

        filterData();
    }, [searchKeyword, filterState, filterDate, proyectos]);




    return (
        <div>


            <div className="rounded-lg p-3 mb-4">
                <h6 className="text-xl font-bold">Búsquedas y Filtros</h6>
            </div>

            {/* Filtros */}
            <div className="mb-4 flex justify-between items-center">
                {/* Bloque de filtros */}
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
                    <h6 className="text-xl font-bold">PROYECTOS Y TAREAS</h6>
                </div>
            </div>


            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-error">{error}</div>}



            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Nombre Proyecto</th>
                        <th className="border border-gray-300 px-4 py-2">Descripción</th>
                        <th className="border border-gray-300 px-4 py-2">Usuario</th>
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
                                    <td className="border border-gray-300 px-4 py-2">{proyecto.nombre_proyecto}</td>
                                    <td className="border border-gray-300 px-4 py-2">{proyecto.descripcion}</td>
                                    <td className="border border-gray-300 px-4 py-2">{proyecto.usuario_creador.nombre_usuario}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <table className="table-auto w-full border-collapse border border-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="border border-gray-300 px-4 py-2">Título</th>
                                                    <th className="border border-gray-300 px-4 py-2">Descripción</th>
                                                    <th className="border border-gray-300 px-4 py-2">Fecha Límite</th>
                                                    <th className="border border-gray-300 px-4 py-2">Estado</th>
                                                    <th className="border border-gray-300 px-4 py-2">Asingnados</th>
                                                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {proyecto.tareas && proyecto.tareas.length > 0 ? (
                                                    proyecto.tareas
                                                        .filter(
                                                            (tarea) => !filterDate || tarea.fecha_limite === filterDate
                                                        )
                                                        .map((tarea) => (
                                                            <React.Fragment key={tarea.id_tarea}>
                                                                <tr>
                                                                    <td className="border border-gray-300 px-4 py-2">
                                                                        <strong>{tarea.titulo}</strong>
                                                                    </td>
                                                                    <td className="border border-gray-300 px-4 py-2">{tarea.descripcion}</td>
                                                                    <td className="border border-gray-300 px-4 py-2">
                                                                        {new Date(tarea.fecha_limite).toLocaleDateString()}
                                                                    </td>

                                                                    <td className="border border-gray-300 px-4 py-2">
                                                                        <select
                                                                            value={tarea.estado}
                                                                            onChange={(e) => actualizarEstadoTarea(tarea.id_tarea, e.target.value)}
                                                                            className="p-1 border border-gray-300 rounded"
                                                                        >
                                                                            <option value="por_hacer">Por hacer</option>
                                                                            <option value="en_progreso">En progreso</option>
                                                                            <option value="completada">Completada</option>
                                                                        </select>
                                                                    </td>
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

                                                                    <td className="border border-gray-300 px-4 py-2">
                                                                        <div className="flex flex-row items-center gap-8">
                                                                            {/* Editar */}
                                                                            <div className="flex flex-col items-center text-center">
                                                                                <button
                                                                                    className="text-yellow-500 hover:text-yellow-600"
                                                                                    onClick={() => manejarEdicion(tarea)}
                                                                                >
                                                                                    <FaPencilAlt />
                                                                                </button>
                                                                                <p className="text-xs text-gray-600 mt-1">Tareas</p>
                                                                            </div>

                                                                            {/* Eliminar */}
                                                                            <div className="flex flex-col items-center text-center">
                                                                                <button
                                                                                    className="text-red-500 hover:text-red-600"
                                                                                    onClick={() => eliminarTarea(tarea.id_tarea)}
                                                                                >
                                                                                    <FaTrash />
                                                                                </button>
                                                                                <p className="text-xs text-gray-600 mt-1">Tareas</p>
                                                                            </div>

                                                                            {/* Ver comentarios */}
                                                                            <div className="flex flex-col items-center text-center">
                                                                                <button
                                                                                    className="text-blue-500 hover:text-blue-600"
                                                                                    onClick={() => {
                                                                                        if (mostrarComentarios === tarea.id_tarea) {
                                                                                            setMostrarComentarios(null); // Ocultar comentarios
                                                                                        } else {
                                                                                            obtenerComentarios(tarea.id_tarea); // Mostrar comentarios
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <FaEye />
                                                                                </button>
                                                                                <p className="text-xs text-gray-600 mt-1">
                                                                                    {mostrarComentarios === tarea.id_tarea ? "Ocultar comentarios" : "Ver y crear comentarios"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                {mostrarComentarios === tarea.id_tarea && (
                                                                    <tr>
                                                                        <td colSpan="6" className="border border-gray-300 px-4 py-2">
                                                                            <div>
                                                                                <h2 className="text-lg font-semibold mb-4">Comentarios</h2>

                                                                                {comentariosPorTarea[tarea.id_tarea]?.length > 0 ? (
                                                                                    <ul className="space-y-2">
                                                                                        {comentariosPorTarea[tarea.id_tarea].map((comentario) => (
                                                                                            <li
                                                                                                key={comentario.id_comentario}
                                                                                                className="p-2 border flex justify-between items-center"
                                                                                            >
                                                                                                {comentarioEditable === comentario.id_comentario ? (
                                                                                                    <div className="flex items-center gap-2 w-full">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            value={contenidoEditado}
                                                                                                            onChange={(e) => setContenidoEditado(e.target.value)}
                                                                                                            className="border p-1 w-64"
                                                                                                        />
                                                                                                        <button
                                                                                                            className="bg-blue-500 text-white px-2 rounded"
                                                                                                            onClick={() =>
                                                                                                                actualizarComentario(comentario.id_comentario)
                                                                                                            }
                                                                                                        >
                                                                                                            Guardar
                                                                                                        </button>
                                                                                                        <button
                                                                                                            className="bg-gray-500 text-white px-2 rounded"
                                                                                                            onClick={() => {
                                                                                                                setComentarioEditable(null);
                                                                                                                setContenidoEditado("");
                                                                                                            }}
                                                                                                        >
                                                                                                            Cancelar
                                                                                                        </button>
                                                                                                    </div>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        <span>
                                                                                                            <strong>{comentario.Usuario.nombre_usuario}:</strong> {comentario.contenido}
                                                                                                        </span>
                                                                                                        {(userName === comentario.Usuario.nombre_usuario ||
                                                                                                            userRole === 1) && (
                                                                                                                <div className="flex flex-col items-center ml-2">
                                                                                                                    <button
                                                                                                                        className="flex items-center justify-center w-10 h-10 bg-black rounded-full text-yellow-500 hover:bg-gray-800"
                                                                                                                        onClick={() =>
                                                                                                                            manejarEdicionComentario(comentario)
                                                                                                                        }
                                                                                                                    >
                                                                                                                        <FaPencilAlt />
                                                                                                                    </button>
                                                                                                                    <span className="text-sm text-gray-500 mt-1">Editar Comentario</span>
                                                                                                                </div>
                                                                                                            )}
                                                                                                    </>
                                                                                                )}

                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                ) : (
                                                                                    <p className="text-gray-500">No hay comentarios disponibles para esta tarea.</p>
                                                                                )}
                                                                                <div className="mt-4 flex gap-2">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={nuevoComentario}
                                                                                        onChange={(e) => setNuevoComentario(e.target.value)}
                                                                                        placeholder="Escribe un comentario"
                                                                                        className="w-full p-2 border border-gray-300 rounded"
                                                                                    />
                                                                                    <button
                                                                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                                                                                        onClick={() => agregarComentario(tarea.id_tarea)}
                                                                                    >
                                                                                        Agregar Comentario
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )}
                                                            </React.Fragment>
                                                        ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">
                                                            No hay tareas asociadas.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>

                                        </table>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    setMostrarTarea(
                                                        mostrarTarea === proyecto.id_proyecto ? null : proyecto.id_proyecto
                                                    )
                                                }
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                {mostrarTarea === proyecto.id_proyecto ? 'Cancelar' : 'Agregar tarea'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {mostrarTarea === proyecto.id_proyecto && (
                                    <tr>
                                        <td colSpan="6" className="border border-gray-300 px-4 py-2">
                                            <div className="space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="flex-1">
                                                        <label
                                                            htmlFor="titulo"
                                                            className="block text-gray-700 font-semibold mb-2"
                                                        >
                                                            Título de la tarea
                                                        </label>
                                                        <input
                                                            id="titulo"
                                                            type="text"
                                                            name="titulo"
                                                            value={tareaData.titulo}
                                                            onChange={handleTareaChange}
                                                            placeholder="Título de la tarea"
                                                            required
                                                            className="w-full p-2 border border-gray-300 rounded"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <label
                                                            htmlFor="fecha_limite"
                                                            className="block text-gray-700 font-semibold mb-2"
                                                        >
                                                            Fecha Límite
                                                        </label>
                                                        <input
                                                            id="fecha_limite"
                                                            type="date"
                                                            name="fecha_limite"
                                                            value={tareaData.fecha_limite}
                                                            onChange={handleTareaChange}
                                                            required
                                                            className="w-full p-2 border border-gray-300 rounded"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="descripcion"
                                                        className="block text-gray-700 font-semibold mb-2"
                                                    >
                                                        Descripción de la tarea
                                                    </label>
                                                    <textarea
                                                        id="descripcion"
                                                        name="descripcion"
                                                        value={tareaData.descripcion}
                                                        onChange={handleTareaChange}
                                                        placeholder="Descripción de la tarea"
                                                        required
                                                        rows="4"
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    ></textarea>
                                                </div>
                                                <button
                                                    onClick={crearTarea}
                                                    className="bg-green-500 text-white px-6 py-2 rounded mt-4"
                                                >
                                                    Crear tarea
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center">
                                No hay proyectos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>



            </table>
            {editarTareaId && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-xl mb-4">Editar tarea</h3>
                        <input
                            type="text"
                            name="titulo"
                            value={tareaData.titulo}
                            onChange={handleTareaChange}
                            placeholder="Título de la tarea"
                            required
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <input
                            type="text"
                            name="descripcion"
                            value={tareaData.descripcion}
                            onChange={handleTareaChange}
                            placeholder="Descripción de la tarea"
                            required
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />
                        <input
                            type="date"
                            name="fecha_limite"
                            value={tareaData.fecha_limite}
                            onChange={handleTareaChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        />

                        <td className="flex flex-col w-full ">
                            <label className="text-sm font-medium text-gray-700 mb-2">
                                Agregar miembros a la tarea:</label>
                            <Select
                                isMulti
                                options={usuarios} // Usuarios no seleccionados
                                value={selectedUsuarios}
                                onChange={handleUsuarioSelect}
                                placeholder="Seleccione usuarios"
                                className="basic-multi-select"
                                styles={{
                                    container: (provided) => ({
                                        ...provided,
                                        width: '100%',
                                    }),
                                }}
                            />

                        </td>
                        <br></br>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={actualizarTarea}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Actualizar
                            </button>
                            <button
                                onClick={() => setEditarTareaId(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default ProyectoList;
