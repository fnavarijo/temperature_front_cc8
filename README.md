# Temperature Project (FrontEnd)
Este es el webserver para registrar y consultar el estatus de todos los dispositivos.

Para poder correr el proyecto es necesario solamente tener instalado [docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04). De preferencia si es en Ubuntu (Presenta menos problemas).

## Ejecucion
---
Para poder levantar el proyecto, se debe correr el siguiente comando dentro de la carpeta.
```
yarn temp:start
```

## Documentacion
---
La aplicación cuenta con tres rutas.

#### POST /info/
Para obtener todos los estados de la temperatura almacenada.

#### POST /search/
Para insertar un nuevo registro de temperatura. Los parametros serian los siguientes:
```
{
    fecha: 'fecha',
    temperature: 25
}
```
#### GET /change
Retorna la ultima temperature registrada.

### Pruebas
Para hacer las pruebas, se recomienda instalar [postman](https://www.getpostman.com/)


### Dudas
---
* Puede ser necesaria la instalacion de [yarn](https://yarnpkg.com/lang/en/docs/install/)