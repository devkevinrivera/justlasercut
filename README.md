
ARQUETYPE FRONTEND VISUAL LIMES

**INSTALACION:**

1.Descargar la ultima versión de node.
2.Descargar el proyecto y posicionarse en el.
3.Ejecutar: npm install
4.Ejecutar: 
    - npm run dev: Para ejecutar el proyecto en modo desarrollo.
    - npm run start: Para ejecutar el proyecto pre-renderizado.
    - npm run build: Para ejecutar la compilación del proyecto en archivos estaticos.
5. Ir a http://localhost:3000


> Estrutura del proyecto:

**components**: En esta carpeta se guardan todos aquellos componentes que pertencen de manera directa al proyecto que se este creando. Se deberia llevar una estructura para llevar un orden. Ejemplo:

=> components (Folder)
=========> ExampleComponent (Folder)
==============> index.js : Se usara para indexar automaticamente el componente.
==============> ExampleComponent.js => Codigo del componente.
==============> ExampleComponent.scss => Estilos del componente.
==============> ExampleComponent.stories.js => Fichero encargado de cargar el componente en el storybook.

=> constants (Folder): En el guardaremos todos aquello ficheros responsables de definir constantes dentro de la aplicación.

=> locale (Folder): En esta carpeta se cargaran todos aquellos ficheros json encargados de mantener las traducciónes dentro de la aplicación.

=> Pages (Folder): En el se define tanto como las páginas de nuestra aplicación, así como toda aquella configuración relacionada con la api.

=> Redux (Folder): En esta carpeta se ubican todos los archivos relacionos a la configuración del store de nuestra aplicación. En el crearemos los reducers, actions y todo lo necesario para el funcionamiento del mismo.

=> Services (Folder): Aqui se guardan todos aquellos ficheros relacionados con las peticiones al servidor.

=> Styles (Folder): En ella encontramos todos los ficheros relacionados a los estilos y clases scss, relacionadas con la aplicación.


