## Ejercicio ListingTracker

Este proyecto es una API para trackear las ventas de publicaciones (**listings** en inglés) de MercadoLibre.  
Las publicaciónes de MercadoLibre tienen la propiedad `sold_quantity` que representa el total de ventas que tuvo la publicación
desde que fue creada. Ejemplo de una [publicación](https://api.mercadolibre.com/items/MLM586197228).  
Sin embargo, en este proyecto lo que interesa son las ventas que tiene una publicación desde que se empieza a monitorear.

Para comenzar a monitorear una publicación primero hay que crearla en listing-tracker. Se crea haciendo un POST a `/listings` enviando
en el body un JSON con las siguientes propiedades:  
```
listing_id: id de la publicación en MercadoLibre  
title: título  
seller_id: id del usuario de MercadoLibre dueño de la publicación  
sold_quantity: cantidad vendida acumulada desde que se creó la publicación  
```
Al crearse la publicación el valor de **sold_quantity** enviado se guarda en la propiedad **initial_sold_quantity** y
se inicializa la propiedadad **quantity** en cero.  
Luego, cada vez que se actualice la publicación con nuevos valores, se actualiza la propiedad **quantity** con la diferencia
entre el valor inicial y el valor actual.

#### Endpoints:

**GET** `/listings`  
Devuelve todas las publicaciones que están siendo trackeadas  
  
**GET** `/listings/:listing_id`  
Devuelve los valores almacenados de la publicación con id _listing_id_  
  
**POST** `/listings`  
Crea una nueva publicación a monitorear inicializando `quantity` en cero.  
  
**PUT** `/listings/:listing_id`  
Actualiza la publicación con id _listing_id_ con los nuevos valores de `sold_quantity`  

### Objetivo

1) Crear un nuevo endpoint **GET** `/listings/ranking` que devuelva las publicaciones ordenadas por la cantidad vendida desde que se empezo a monitorear. Además debe aceptar por query param decir cuantos elementos nos queremos traer, por defecto serán 3.

1) Crear un nuevo endpoint **POST** `/listings/upsert` que reciba en el body un array de hasta 50 publicaciones, que cree las publicaciones
nuevas y actualice las existentes. Además, no deberá responder hasta que todas las listings se hayan creado o actualizado según corresponda.

1) Crear un servicio llamado **SellerListingsUpdater** que se corre de forma independiente a esta API cuya función es actualizar las publicaciones de un vendedor.
Para realizarlo, debe hacer los siguiente:

- Obtener las primeras 1000 publicaciones del seller con id **154901871** de la API de MercadoLibre
- Crear en ListingTracker todas las publicaciones nuevas y actualizar los valores de las publicaciones exisitentes utilizando el
endpoint creado en el punto 1).
  
Este servicio iría en la carpeta `jobs/sellerListingsUpdater`
  
Request para obtener las publicaciones del seller 154901871 de la API de MercadoLibre:
**GET** `https://api.mercadolibre.com/sites/MLM/search?seller_id=154901871&offset=`
Esta request no devuelve más de 50 publicaciones a la vez. Dado que el usuario 154901871 tiene muchas más que 50 publicaciones hay que traerlas página por página.
Para eso enviar el parámetro **offset** por querystring.
  
#### Requisitos

- Desarrollar la funcionalidad pedida.
- Desarrollar los tests que considere en cada caso.
- No utilizar async/await para las operaciones asincrónicas
- **Bonus**: Utilizar nock para los tests del SellerListingsUpdater.
- **Bonus**: Al desarrollar el SellerListingsUpdater, suponer que MercadoLibre no admite más de 5 requests en simultáneo.


## Uso del proyecto

* `npm run dev`: levanta el servidor
* `npm test`: ejecuta los test unitarios


## Arquitectura actual del proyecto

| API |  ----> | Mongo |
