import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../imagen/imagen1.webp'; // Asegúrate de colocar el logo en una carpeta accesible
import { FaProjectDiagram, FaList, FaClipboardList, FaInfoCircle } from 'react-icons/fa'; // Iconos de Font Awesome

const Sidebar = () => {
    const categories = [
        { name: 'CREAR PROYECTOS Y ASIGNAR TAREAS', path: '/Proyecto', icon: <FaProjectDiagram /> },
        { name: 'CREAR TAREAS A PROYECTOS', path: '/detalles-proyectos', icon: <FaInfoCircle /> },
        { name: ' LISTA DE PROYECTOS Y TAREAS', path: '/detalle', icon: <FaClipboardList /> },

    ];

    return (
        <div className="sidebar bg-gray-800 text-white h-full p-6">
            <div className="flex items-center justify-center mb-2">
                <img src={logo} alt="Inlaze Logo" className="w-50" />
            </div>
            <ul className="space-y-4">
                {categories.map((category, index) => (
                    <li key={index}>
                        <Link
                            to={category.path}
                            className="flex items-center gap-3 p-2 text-sm font-bold rounded hover:bg-gray-700 transition-colors"
                        >
                            {category.icon} {/* Icono de la categoría */}
                            <span>{category.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
