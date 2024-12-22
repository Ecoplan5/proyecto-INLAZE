import axios from "axios";


const apiUrl = "http://localhost:8095/api/createUsuario";

// Función para obtener el token del localStorage
const getToken = () => {
    return localStorage.getItem("token");
};

const registroService = {
    registro: async (credentials) => {
        try {
            // Realiza la solicitud de inicio de sesión
                const response = await axios.post(apiUrl, credentials, {
                    headers: {
                        Authorization: `Bearer ${getToken() || ""}`, // Si no hay token, se envía vacío
                    },
                });
            return response.data;
        } catch (error) {
            console.error("Error al registrarse:", error);
            throw error; 
        }
    },
};

export default registroService;
