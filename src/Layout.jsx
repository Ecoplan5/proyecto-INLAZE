import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaBell } from "react-icons/fa";
import Sidebar from "./components/Sidebar";
import comentarioService from "./services/comentariosService";

const Layout = ({ children }) => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [notificacionesLeidas, setNotificacionesLeidas] = useState(false);

    const nombreUsuario = localStorage.getItem("nombre_usuario") || "Usuario";
    const iniciales = nombreUsuario
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const nuevosComentarios = await comentarioService.obtenerComentarios();
                setComentarios(nuevosComentarios);
            } catch (error) {
                console.error("Error al obtener comentarios:", error);
            }
        };

        fetchComentarios();

        const interval = setInterval(fetchComentarios, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se cerrará tu sesión actual.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("token");
                localStorage.removeItem("id_usuario");
                localStorage.removeItem("nombre_usuario");

                Swal.fire(
                    "Sesión cerrada",
                    "Tu sesión se ha cerrado correctamente.",
                    "success"
                ).then(() => {
                    navigate("/login");
                });
            }
        });
    };

    const toggleNotifications = (e) => {
        e.stopPropagation(); // Previene conflictos al hacer clic
        setIsNotificationsOpen((prev) => !prev);
        if (!notificacionesLeidas) setNotificacionesLeidas(true);
    };

    // Cerrar notificaciones si se hace clic fuera de ellas
    useEffect(() => {
        const handleClickOutside = () => {
            if (isNotificationsOpen) setIsNotificationsOpen(false);
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isNotificationsOpen]);

    return (
        <div className="layout flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <header className="w-full bg-white shadow-md p-4 flex justify-end items-center gap-6 relative">
                    <div className="relative" onClick={toggleNotifications}>
                        <FaBell className="text-2xl text-gray-600 cursor-pointer" />
                        {!notificacionesLeidas && comentarios.length > 0 && (
                            <span
                                className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                                onClick={toggleNotifications}
                            >
                                {comentarios.length}
                            </span>
                        )}
                        {isNotificationsOpen && (
                            <div className="absolute top-8 right-0 w-64 bg-white shadow-md rounded-md p-4 z-50">
                                <h4 className="text-sm font-bold text-gray-800 mb-2">
                                    Notificaciones
                                </h4>
                                {comentarios.length > 0 ? (
                                    <ul className="space-y-2">
                                        {comentarios.map((comentario, index) => (
                                            <li
                                                key={index}
                                                className="text-sm text-gray-700 border-b pb-2"
                                            >
                                                <p>
                                                    <strong>
                                                        {comentario.Usuario?.nombre_usuario || "Usuario desconocido"}
                                                    :</strong>{" "}
                                                    {comentario.contenido || "Sin contenido"}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No hay nuevas notificaciones.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <div
                        className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold text-white cursor-pointer"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {iniciales}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-900">{nombreUsuario}</p>
                    </div>
                    {isMenuOpen && (
                        <div className="absolute top-16 right-4 bg-white shadow-md rounded-md p-2">
                            <button
                                className="block text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </header>
                <div className="content flex-1 bg-gray-100 p-4">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
