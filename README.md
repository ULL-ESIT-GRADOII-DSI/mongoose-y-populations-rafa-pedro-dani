#ETSII ULL Grado de Informatica 
#Práctica: AJAX, ECMA6, ficheros y Node.js modules

##Bagdes
[![David](https://img.shields.io/david/ULL-ESIT-GRADOII-DSI/ajax-ecma6-ficheros-rafa-pedro-dani.svg?style=flat-square)](https://david-dm.org/ULL-ESIT-GRADOII-DSI/ajax-ecma6-ficheros-rafa-pedro-dani#info=dependencies&view=table)
[![David](https://img.shields.io/david/dev/ULL-ESIT-GRADOII-DSI/ajax-ecma6-ficheros-rafa-pedro-dani.svg?style=flat-square)](https://david-dm.org/ULL-ESIT-GRADOII-DSI/ajax-ecma6-ficheros-rafa-pedro-dani#info=devDependencies&view=table)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://p8dsi.herokuapp.com)
##Descripción de la práctica

Siguiendo el guión de la práctica anterior, realizaremos el mismo ejemplo, pero ahora haremos uso de AJAX para que sea el servidor el que nos devuelva un JSON con la información de la tabla. También usaremos algunas de las técnicas incluidas en el nuevo estándar de JavaScript, el ECMA6 o JavaScript v6.

##For more information look at:

* La sección *Práctica: CSV usando Ajax* de los [apuntes](http://crguezl.github.io/pl-html/node12.html)
* La [descripción de la práctica](https://casianorodriguezleon.gitbooks.io/pl1516/content/practicas/practicaajaxcsv.html)
* See it working at [CSV en Heroku](https://cvsajax.herokuapp.com/)
* See also [CSV](http://en.wikipedia.org/wiki/Comma-separated_values) at Wikipedia.

Dependencias globales:
* `gulp`
* `bower`
* `jshint`
* `jscs`

Hay que tener instaladas las gemas `sass` y `scss-lint`
##Anotación sobre Heroku.
* Heroku sólo realiza el deploy en la rama master, cualquier archivo subido a otra rama (Ejemplo de este proyecto rama Heroku) al realizar git push heroku master no funcionará. Importante también que se debe realizar el npm install de node.js para instalar las dependencias del proyecto.

##Enlace de tutorial de Heroku:
[Tutorial Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

##Comandos más importantes de Heroku:
* heroku login
* heroku create
* heroku apps
* heroku logs
* `heroku config:set NPM_CONFIG_PRODUCTION=false` .Para que heroku instale las dependencias en devdependencies de [package.json] (package.json)
* `heroku apps:destroy --app nombre_app` . Para eliminar una aplicación de tu cuenta de heroku.
* `heroku git:remote -a nombre_app` . Para añadir un git remote de heroku

###Repositorio GitHuB

* [Repositorio](https://github.com/ULL-ESIT-GRADOII-DSI/localstorage-jquery-underscore-express-sass-heroku-rafa-pedro-dani)

###Página de la práctica en Heroku

* [Web](http://p8dsi.herokuapp.com/)

###Página del campus de la asignatura
* [Campus Virtual DSI](https://campusvirtual.ull.es/1516/course/view.php?id=144)

###Página de la descripción de la práctica
* [Descripción Práctica desde el campus](https://campusvirtual.ull.es/1516/mod/page/view.php?id=189370)

###Páginas de los autores

* [Rafa Herrero](http://rafaherrero.github.io/)
* [Daniel Ramos](http://danielramosacosta.github.io/#/)
* [Pedro Ramos](http://alu0100505078.github.io/)
