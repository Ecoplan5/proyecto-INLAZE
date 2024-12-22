# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


Hola!!

Este proyecto es una aplicación web diseñada para gestionar tareas de manera colaborativa y eficiente. Permite a los usuarios crear proyectos, asignar tareas y colaborar con otros miembros del equipo. A continuación, te explico cómo puedes iniciar y utilizar el proyecto, incluyendo todos los comandos necesarios.

Para comenzar, asegúrate de estar posicionado en la carpeta principal del proyecto llamada front-inlaze. Si no estás en esa ubicación, usa el siguiente comando para navegar a ella: cd front-inlaze

Una vez dentro, es importante instalar las dependencias necesarias para que el proyecto funcione correctamente. Para ello, ejecuta:
npm install

Cuando las dependencias se hayan instalado, ya puedes ejecutar el proyecto utilizando el comando: npm run dev


Al iniciar el proyecto, ya hay un usuario administrador configurado por defecto, lo que te permitirá acceder de inmediato a todas las funcionalidades principales. Los datos de inicio de sesión para este usuario son:

Nombre de Usuario: Admin
Contraseña: 12345678
Si prefieres no usar este usuario preconfigurado, también puedes registrarte y crear tu propia cuenta para explorar el sistema.

Una vez dentro de la aplicación, te encontrarás con una interfaz que te permitirá gestionar proyectos y tareas de manera sencilla. Desde la página inicial, podrás el componente principal donde . Puedes crear nuevos proyectos y agregar tareas al mismo  luego  de esto el sistema te llevara a proyectos donde podrás ver los proyectos creados y las tareas asocidas, puedes editar los detalles de los que ya están creados directamente desde el listado. Además, tienes la opción de ocultar las tareas asociadas a un proyecto, dejando visibles únicamente los nombres de los proyectos si necesitas una visión más general.

 Dentro de cada proyecto, puedes gestionar las tareas asociadas. Puedes crear nuevas tareas especificando su título, descripción, fecha límite, estado (por hacer, en progreso, completada) y asignarlas a un usuario
 También puedes editar las tareas para modificar su información, marcar una tarea como completada o incluso revertirla a su estado anterior si es necesario. Si alguna tarea deja de ser relevante, tienes la opción de eliminarla. pero tambien se eliminan los comentarios asociados a la tarea.


Para fomentar la colaboración, cada tarea cuenta con un espacio de comentarios. Aquí, los miembros del equipo pueden discutir detalles, realizar preguntas o proporcionar actualizaciones. Si realizaste un comentario, puedes editarlo, pero con ciertas restricciones:

Si eres un miembro del equipo, solo puedes editar tus propios comentarios.
Si eres administrador, puedes editar cualquier comentario.
Además, el sistema notifica automáticamente a los involucrados cada vez que se realiza un comentario en una tarea, manteniendo a todos informados en tiempo real.

Si trabajas con muchas tareas y necesitas encontrar algo rápidamente, puedes filtrar las tareas por estado,  o incluso buscar directamente por palabras clave para localizar tareas específicas.

El sistema de autenticación está diseñado para garantizar la seguridad de los datos. Utiliza tokens JWT para gestionar el acceso de los usuarios y roles específicos para definir los permisos:

Los administradores tienen acceso completo a todas las funcionalidades, incluyendo la edición de comentarios de cualquier usuario.
Los miembros del equipo tienen un acceso restringido según su rol asignado.

para finalizar para cerrar sesion solo basta con hacer clic en la inicial de tu nombre que aparece en la parte superior derecha de la pantalla y seleccionar la opcion de cerrar sesion.
Espero que esta información te haya sido útil. Si tienes más preguntas o necesitas más detalles, no dudes en preguntar. ¡Estoy aquí para ayudarte!
En resumen, esta aplicación ofrece un conjunto de herramientas completas para gestionar proyectos y tareas de forma colaborativa, priorizando la usabilidad, la eficiencia y la comunicación entre los usuarios. Para empezar, simplemente sigue los pasos mencionados arriba, inicia sesión con el usuario administrador o crea tu cuenta, y explora todas las funcionalidades que esta herramienta tiene para ofrecer.




