import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Registarse from "./components/Registros";
import Login from "./components/Login";
import Layout from './Layout';
import DetallesProyectos from './components/detallesProyectos';
import Proyecto from './components/Proyecto';
import Detalles from './components/detalles';
import RutaProtegida from './components/protecRutas'; // Importa el componente

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Ruta para el login */}
                <Route path="/login" element={<Login />} />
                
                {/* Ruta para el registro */}
                <Route path="/register" element={<Registarse />} />
                
                {/* Rutas protegidas */}
                <Route
                    path="/*"
                    element={
                        <RutaProtegida>
                            <Layout>
                                <Routes>
                                    <Route path="/Proyecto" element={<Proyecto />} />
                                    <Route path="/detalles-proyectos" element={<DetallesProyectos />} />
                                    <Route path="/detalle" element={<Detalles />} />
                                    <Route path="/tarea/:id_tarea" element={<Layout />} />

                                </Routes>
                            </Layout>
                        </RutaProtegida>
                    }
                />
                
                {/* Redirección a login si se accede a "/" */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
