# Refactor de Login

Para esta entrega se generó la posibilidad de realizar un login y signup por medio de github, gracias al generador de estrategias de autenticación y autorización Passport.

## Ejecución del proyecto

Para iniciar el proyecto es necesario ejecutar este comando para levantar el servidor:

```bash
npm start
```

## Rutas para visualizar el front 

Para ingresar a la home, y rutas principales, del proyecto se precisa de las siguientes ruta:

[Home](http://localhost:8080/). (http://localhost:8080/)

[Login](http://localhost:8080/login). (http://localhost:8080/login)

[SignUp](http://localhost:8080/signup). (http://localhost:8080/signup)

## Rutas para el funcionamiento interno

Ahora se adjuntará las rutas que nos permiten el funcionamiento de nuestro login y signup:

[Ruta para la autenticación local gracias a Passport](http://localhost:8080/api/mongo/users/signup). (http://localhost:8080/api/mongo/users/signup)

[Ruta para la autorización local gracias a Passport](http://localhost:8080/api/mongo/users/login). (http://localhost:8080/api/mongo/users/login)

[Ruta que nos permite ingresar a github y solicitar datos del usuario en cuestión](http://localhost:8080/api/mongo/users/auth/github). (http://localhost:8080/api/mongo/users/auth/github)

[Ruta de retorno luego de la obtención de datos de usuario desde github](http://localhost:8080/api/mongo/users/callback). (http://localhost:8080/api/mongo/users/callback)

## Coderhouse - Backend - 47315