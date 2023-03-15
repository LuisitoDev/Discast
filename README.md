**Programadores.**

1846296 - Cortés Madriz Derek Jafet

1941435 - Figón Muñoz Derek Bryan

1875580 - Daniel Sánchez Luis Angel

1843737 - Lara Sanchez Félix Leopoldo

**Explicación**

El siguiente repositorio pertenece al proyecto de la materia de Programación Web 2.
Nuestro proyecto es acerca de una Página Web dedicada a la creación de Podcast, en la cuál los usuarios podrán registrarse y escuchar los podcast creados por la comunidad. Además, todos podrán interactuar con los podcast mandando sus respuestas en audio, para que así, el autor del podcast elija los mejores clips y los agregue al podcast definitivo, creando así conversaciones entre diferentes personas.

El proyecto encuentra dividido en dos áreas, la de Frontend y la de Backend, para acceder a los archivos del Frontend se tiene que estar localizado en la rama "Front" del repositorio, de la misma manera, para acceder al Backend se tiene que localizarse en la rama "Back".

El área de Frontend consiste en la creación de páginas web diseñadas a partir de los lenguajes HTML, CSS y Javascript, utilizando el framework React para tener una mejor organización del código.
Las carpetas del area de Frontend se encuentran divididas de la siguiente manera:

- front : carpeta raíz del área de front-end, contiene los package.json con las dependencias que usa el proyecto
    - project/front: contiene los archivos html, css, scss, js en su forma nativa ademas de imagenes que se usarán en la aplicación.
		- css: anida las carpetas que contienen los archivos de estilizado css de cada una de las vistas.
			- addOpinion: contiene el css de la vista addOpinion.
			- createPodcast: contiene el css de la vista createPodcast.
			- header: contiene el css del componente header.
			- index: contiene el css de la vista index.
			- login: contiene el css de la vista login.
			- main: contiene el archivo css y el map.css procesado del scss main que controla el diseño base del portal web.
			- modals: contiene los css de los modales.
			- podcast: contiene los css de la vista de detalle de podcast.
		- images: contiene las imágenes que se usan en las vistas del proyecto, ademas se divide en subcarpetas con el nombre de vistas específicas.
			- index: contiene las imágenes de la vista index.
			- login: contiene las imágenes de la vista login.
			- podcast: contiene las imágenes de la vista de detalle de podcast.
		- js: contiene el archivo que manipula el prototipo de interactividad de la vista de detalle de podcast.
		- pages: contiene los archivos html nativo que estructuriza cada elemento en la vistas del proyecto.
		- scss: contiene el archivo scss que manipula el diseño inicial de bootstrap a uno mas personalizado para la visión del proyecto.
    - public: son los archivos que inicialmente contiene una aplicación de react, en este caso el más importante es el archivo de index.html, en 		donde se renderiza cada uno de los componentes del proyecto.
    - src: la carpeta núcleo del proyecto, en ella se encuentran subcarpetas como la de lo componentes de la aplicación, incluyendo el archivo App.		js que manipula el ruteo de la aplicación, además contiene el archivo index.js que maneja los contextos usados en el proyecto y el rederizado 		de todos los componentes.
    	- components: contiene subcarpetas de cada uno de los componentes de la aplicación.
			- Account: contiene el componente padre del login y el registro, adicionalmente anida lo relacionado con la cuenta de un usuario.
				- Login: contiene el componente del login y su archivo css.
				- ModalEditProfile: contiene los componentes relacionados al modal de editar perfil y su archivo css.
				- Register: contiene el componente de registro.
			- Dashboard: contiene el componente padre del dashboard donde el usuario puede ver sus analíticas.
			- Home: contiene el componente padre que manipula la página principal.
				- Discover: contiene el componente que trae todos los podcast en la categoría de descubrimiento.
				- Followed: contiene el componente que trae todos los podcast de la gente que sigue el usuario.
				- Topliked: contiene el componente que trae todos los podcast que han sido mas aceptados en la comunidad manifestado a través de un 				like.
			- Podcast: contiene el componente padre de detalle de podcast.
				- AudioTimelineCard: contiene el componente que renderiza la tarjeta del reproductor de audio.
				- HeaderPodcast: contiene el componente de la cabecera del detalle de podcast.
				- Inbox: contiene el componente del buzón de repuestas de audio.
				- Timeline: contiene el componente que anida todas las respuestas de audio aceptadas.
				- Comments: contiene el componente padre de la zona de comentarios y la carta del comentario.	
			- UI: contiene las subcarpetas con los componentes esenciales para la interfaz.
				- Header: contiene el componente de la cabecera de la aplicación que se presenta en la mayoría de las páginas.
				- LandingHeader: contiene el componente que se presentá en la página principal, esta manipula la navegación a través de las 						píldoras. 
				- Modal: contiene el componente que maneja las animaciones y la funcionalidad principal de los modales.
				- ModalUpload: contiene el modal para subir un archivo.
				- Timer: contiene el componente que renderiza un contador para el momento en que el usuario empiece a grabar.
				- AudioRecorder: contiene el componente de grabadora de audio.
				- FileUploader: contiene el componente del uploader de archivos.
				- Popup: contiene el componente replicable del popup.
			- UploadPodcast: contiene el componente padre para crear un podcast.
				- UploadFirstOpinion: contiene el componente para subir un audio para el podcast.
				- UploadInfoPodcast: contiene el componente para declarar todos los datos del podcast a crear.
			- Utils: contiene algunos archivos js que se necesitan para el funcionamiento de la aplicación.
       - images: contiene las imágenes utilizadas en el proyecto.
       - scss: contiene el scss que manipula el diseño general de la aplicación cambiando la base del diseño inicial de bootstrap.

El área de Backend consiste en el desarrollo de una API, la cuál se encargará de manejar las distintas peticiones recibidas para mandar y/o conseguir información de la base de datos. Esta API será el puente de comunicación entre la aplicación web y MongoDB. Y podremos acceder a la API a través de distintos "endpoints", por los cuales podremos ingresar o recibir información de las diferentes tablas.
Las carpetas del area de  Backend se ecnuentran divididas de la siguiente maneras:
- back : carpeta padre del proyecto, contiene los "package.json", archivo de configuración ".babelrc", el archivo de variables .env
    - src: contiene el archivo "index.js" donde inicia el proyecto, el conexion a la base de datos "database.js", y el archivo "app.js" donde se configura la aplicación
        - controllers: son los controladores donde se exportan todas las funciones que serán ejecutadas en los routes
        - libs: archivos generales que son utilizados en el proyecto, entre ellos, el archivo "initialSetup.js" donde se inicializan los registros de la tabla "Privacies" y "States"
        - midddlewares: archivos que contienen funciones donde se realizan distintas validaciones y son llamados en los routes antes de ejecutar las funciones de los "Controllers"
        - models: modelos de cada tabla de la base de datos, son inicializados y llamados por medio de los "Controllers" para insertar y recibir información a la base de datos
        - routes: contiene los archivos de enrutamiento de cada entidad, se establece cuál será el verbo a usar, si tendrá "middlewares", y que función o funciones del "Controller" ejecutar
