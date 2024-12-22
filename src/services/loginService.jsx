import axios from "axios";


const apiUrl = "http://localhost:8091/api/login";

// Función para obtener el token del localStorage
const getToken = () => {
    return localStorage.getItem("token");
};

const loginService = {
    inicioSesion: async (credentials) => {
        try {
            // Realiza la solicitud de inicio de sesión
            const response = await axios.post(apiUrl, credentials, {
                headers: {
                    Authorization: `Bearer ${getToken() || ""}`, // Si no hay token, se envía vacío
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            throw error; // Lanza el error para manejarlo en el componente que llame este servicio
        }
    },
};

export default loginService;
