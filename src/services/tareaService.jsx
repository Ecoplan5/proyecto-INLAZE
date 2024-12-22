import axios from "axios";

const apiUrl = "http://localhost:8093/api/createTarea";
const apiUrl2 = "http://localhost:8093/api/eliminar";

const apiUrl3 = "http://localhost:8093/api/modificarTarea";

// Función para obtener el token del localStorage
const getToken = () => {
    return localStorage.getItem("token");
};

const tareaService = {
    crearTarea: async (newTarea) => {
        try {
            const response = await axios.post(apiUrl, newTarea, {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${getToken()}` 
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear la tarea:', error);
            if (error.response && error.response.data && error.response.data.error) {
                return error.response.data;
            } else {
                throw error;
            }
        }
    },

    modificarTarea: async (id, nuevoEstado) => {
        try {
            const response = await axios.put(`${apiUrl3}/${id}`, nuevoEstado, {
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

    eliminarTarea: async (id_tarea) => {
        try {
            const response = await axios.delete(`${apiUrl2}/${id_tarea}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}` 
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
            if (error.response && error.response.data && error.response.data.error) {
                return error.response.data;
            } else {
                throw error;
            }
        }
    },

    editarTarea: async (id, nuevoEstado) => {
        try {
            const response = await axios.put(`${apiUrl3}/${id}`, nuevoEstado, {
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







export default tareaService;
