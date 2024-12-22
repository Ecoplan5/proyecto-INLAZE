import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import registroService from "../services/registroService";
import "../css/loginStyles.css"; // Importa el archivo CSS

const Registarse = () => {
    const [formData, setFormData] = useState({
        id_rol: 2,
        nombre_usuario: "",
        correo: "",
        contrasena: "",
    });
    const navigate = useNavigate(); // Para navegación entre rutas

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await registroService.registro(formData);
            console.log("Respuesta de la API:", data);

            toast.success("Registro exitoso, redirigiendo al login...");
            setTimeout(() => {
                navigate("/login"); // Redirige al login después de 3 segundos
            }, 3000);
        } catch (error) {
            console.error("Error al registrar:", error);
            toast.error("Error al registrar. Verifica los datos.");
        }
    };

    return (
        <div className="login-container">
            {/* Flecha para regresar al login */}


            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Crea tu cuenta</h2>
                <div className="back-to-login" onClick={() => navigate("/login")} style={{ textAlign: 'right' }}>
                    ← Volver
                </div>

                <div className="form-group">
                   <strong><label>Nombre de usuario</label></strong>
                    <input
                        type="text"
                        name="nombre_usuario"
                        value={formData.nombre_usuario}
                        onChange={handleInputChange}
                        placeholder="Nombre de usuario"
                        required
                    />
                </div>
                <div className="form-group">
                    <strong><label>Correo electrónico</label></strong>
                    <input
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="Correo electrónico"
                        required
                    />
                </div>
                <div className="form-group">
                   <strong><label>Contraseña</label></strong> 
                    <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        placeholder="Crea una contraseña"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Registrarse</button>

            </form>
            <ToastContainer />
        </div>
    );
};

export default Registarse;
