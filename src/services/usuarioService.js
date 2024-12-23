import axios from "axios";

const apiUrl1 ='http://localhost:8095/api/usuarios'
// Función para obtener el token del localStorage
const getToken = () => {
    return localStorage.getItem("token");
};


const usuarioService ={

obtenerUsuarios: async () => {
    try {
        const response = await axios.get(apiUrl1, {
            headers: {
                'Authorization': `Bearer ${getToken()}` // Añadir el token al encabezado Authorization
            }
        });
        return response.data.usuarios; // Devolvemos solo los proyectos
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    }
},

};

export default usuarioService;