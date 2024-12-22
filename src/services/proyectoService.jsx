import axios from "axios";

const apiUrl = "http://localhost:8092/api/createProyecto";
const apiUrl1 = "http://localhost:8092/api/proyectos";
const apiUrl12 = "http://localhost:8092/api/modificar";

// Función para obtener el token del localStorage
const getToken = () => {
    return localStorage.getItem("token");
};

const proyectoService = {

    crearProyecto: async (data) => {
        try {
            const response = await axios.post(`${apiUrl}`, data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            return response.data; // Asegúrate de devolver el cuerpo de la respuesta
        } catch (error) {
            console.error("Error al crear proyecto:", error);
            throw error; // Lanzar el error para manejarlo en el componente
        }
    },


    getAllProyectos: async () => {
        try {
            const response = await axios.get(apiUrl1, {
                headers: {
                    'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
                }
            });
            return response.data.proyectos; // Devolvemos solo los proyectos
        } catch (error) {
            console.error('Error al obtener los proyectos:', error);
            throw error;
        }
    },


    modificarProyecto: async (id_proyecto, proyectoEditable) => {
        try {
            const response = await axios.put(`${apiUrl12}/${id_proyecto}`, proyectoEditable, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al modificar la tarea:', error);
            if (error.response && error.response.data && error.response.data.error) {
                return error.response.data;
            } else {
                throw error;
            }
        }
    },

};

export default proyectoService;
