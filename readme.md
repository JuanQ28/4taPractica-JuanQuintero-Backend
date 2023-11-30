# Práctica de integración sobre tu ecommerce

Para esta entrega se comenzó con la implementación de JWT como método de autenticación. Aún se trabaja con sessions, para las verificaciones con terceros.

## Ejecución del proyecto

Para iniciar el proyecto es necesario ejecutar este comando para levantar el servidor:

```bash
npm start
```

## Rutas para visualizar el front 

Desde esta ruta se podrá ver el usuario actual, obteniendo el token JWT por medio de cookies.

[Current User](http://localhost:8080/api/mongo/users/cookies). (http://localhost:8080/api/mongo/users/cookies)

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