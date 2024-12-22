import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa Link
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginService from "../services/loginService";
import "../css/loginStyles.css"; // Importa el archivo CSS

const Login = () => {
    const [formData, setFormData] = useState({ nombre_usuario: "", contrasena: "" });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit event triggered");
        console.log("Form data:", formData);

        try {
            const data = await loginService.inicioSesion(formData);
            console.log("Response data:", data);

            // Extrae el token, id_usuario, nombre_usuario, y rol de la respuesta
            const { token, usuario } = data;
            const { id_usuario, nombre_usuario, rol } = usuario;

            if (token && id_usuario && rol?.id_rol) {
                // Guarda token, id_usuario, nombre_usuario y id_rol en localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("id_usuario", id_usuario);
                localStorage.setItem("nombre_usuario", nombre_usuario);
                localStorage.setItem("id_rol", rol.id_rol); // Almacena el rol

                toast.success("Inicio de sesión exitoso");
                navigate("/Proyecto"); // Redirige directamente
            } else {
                toast.error("Credenciales inválidas.");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            toast.error("Error al iniciar sesión. Verifica tus credenciales.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Inicio Sesión</h2>
                <div className="form-group">
                    <strong>
                        <label>Nombre Usuario</label>
                    </strong>
                    <input
                        type="text"
                        name="nombre_usuario"
                        value={formData.nombre_usuario}
                        onChange={handleInputChange}
                        placeholder="Nombre Usuario"
                        required
                    />
                </div>
                <div className="form-group">
                    <strong>
                        <label>Contraseña</label>
                    </strong>
                    <input
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        placeholder="Contraseña"
                        required
                    />
                </div>
                <div className="form-options">
                    <Link to="/register" className="forgot-password">
                        Registrate
                    </Link>
                </div>
                <button type="submit" className="login-button">
                    Ingresar
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
