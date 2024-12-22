import axios from "axios";

const apiUrl1 = "http://localhost:8090/api/createComentario";
const apiUrl2 = "http://localhost:8090/api/comentarios";
const apiUrl3 = "http://localhost:8090/api/modificarComentario";
const getToken = () => {
    return localStorage.getItem("token");
};

const comentarioService = {
    obtenerComentarios: async (id_tarea) => {
    
        try {
          const response = await axios.get(`${apiUrl2}/${id_tarea}`, {
            headers: {
              Authorization: `Bearer ${getToken()}`, // Agrega el token si es necesario
            },
          });
    
          return response.data.comentarios || [];
        } catch (error) {
          if (error.response?.status === 404) {
            console.warn("No se encontraron comentarios.");
            return [];
          }
          console.error("Error al obtener los comentarios:", error);
          throw error;
        }
      },
    

    crearComentario: async (nuevoComentario) => {
        try {
            const response = await axios.post(apiUrl1, nuevoComentario, {
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
    

    modificarComentario: async (id_comentario, contenidoEditado) => {
        try {
            const response = await axios.put(`${apiUrl3}/${id_comentario}`, contenidoEditado, {
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
export default comentarioService;
