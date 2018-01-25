//funciones y ayudas del del mapa de galerias

// con esta estructura de datos, manejaremos el control de posiciones
function galeria(nombre, direccion, geografia, tipologia, web, latitud, longitud)
{
    this.nombre=nombre;
    this.direccion=direccion;
    // pendiente, cargar this.latitud y this.longitud con la API de geocoding
    this.geografia=geografia;
    this.tipologia=tipologia;
    this.web=web;
    this.latitud=latitud;
    this.longitud=longitud;
}

function mapa_galerias(titulo, descripcion, latitud, longitud, listaGalerias)
{
    this.titulo=titulo;
    this.descripcion=descripcion;
    this.latitud=latitud; //centro del paseo
    this.longitud=longitud; //centro del paseo
    this.listaGalerias=listaGalerias;
    this.cLatitud=latitud;// punto central del mapa
    this.cLongitud=longitud; //punto central del mapa
}

function construyeMapa(xml) 
{
    console.log("construyeMapa");
    //Esta función de volcado incorpora la semantica del GeoRSS.
    // por el momento voy a volcar los siguientes elementos
    // <mapa_arte_periferico> 
    // ---<title>
    // ---<description>
    // ---<georss:point> latitud, longitud de centrado
    // ---<galeria>
    // ------<nombre>  
    // ------<direccion>
    // ------<geografia>
    // ------<tipologia>
    // ------<web>

    var xmlDoc = xml.responseXML;
    var titulo;
    var descripcion;
    var lat_long;
    var latitud;
    var longitud; 
    var x = xmlDoc.getElementsByTagName("mapa_arte_periferico");
    for (i = 0; i <x.length; i++) {  
      titulo=x[i].getElementsByTagName("titulo")[0].childNodes[0].nodeValue;
      descripcion=x[i].getElementsByTagName("descripcion")[0].childNodes[0].nodeValue; 
      lat_long=x[i].getElementsByTagName("georss:point")[0].childNodes[0].nodeValue;
      var arr = lat_long.split(" ");
      latitud=arr[0]/1; // con esto fuerzo la conversion numerica
      longitud=arr[1]/1; // con esto fuerzo la conversion numerica
      console.log("\nlatitud:"+latitud+"longitud:"+longitud);                          
    }//for  -- en realidad solo deber�amos tener un channel

    var galeriaNombre;
    var galeriaDireccion;
    var galeriaLatitud;
    var galeriaLongitud;
    var galeriaTipologia;
    var galeriaWeb;
    var galeriaGeografia;
    var galeriaLatitud;
    var galeriaLongitud;
    //ahora voy a recorrer los items   
    x=xmlDoc.getElementsByTagName("galeria");
    console.log("\nGalerias: " + x.length);
    var listaGalerias=new Array();
  
    for (i = 0; i <x.length; i++) {   
       galeriaNombre=galeriaDireccion=galeriaLatitud=galeriaLongitud=galeriaTipologia=galeriaWeb=galeriaGeografia=null;          
      if (x[i].getElementsByTagName("nombre").length>0) galeriaNombre=x[i].getElementsByTagName("nombre")[0].childNodes[0].nodeValue;
      if (x[i].getElementsByTagName("direccion").length>0) galeriaDireccion=x[i].getElementsByTagName("direccion")[0].childNodes[0].nodeValue;
      if (x[i].getElementsByTagName("geografia").length>0) galeriaGeografia=x[i].getElementsByTagName("geografia")[0].childNodes[0].nodeValue;
      if (x[i].getElementsByTagName("web").length>0) galeriaWeb=x[i].getElementsByTagName("web")[0].childNodes[0].nodeValue;
      if (x[i].getElementsByTagName("tipologia").length>0) galeriaTipologia=x[i].getElementsByTagName("tipologia")[0].childNodes[0].nodeValue;
      if (x[i].getElementsByTagName("longitud").length>0) galeriaLongitud=x[i].getElementsByTagName("longitud")[0].childNodes[0].nodeValue;
        if (x[i].getElementsByTagName("latitud").length>0) galeriaLatitud=x[i].getElementsByTagName("latitud")[0].childNodes[0].nodeValue;
        var tempGaleria=new galeria(galeriaNombre, galeriaDireccion, galeriaGeografia, galeriaTipologia, galeriaWeb, galeriaLatitud, galeriaLongitud);
        console.log(tempGaleria);

      listaGalerias.push(tempGaleria);
      }//for
      return new mapa_galerias(titulo, descripcion, latitud, longitud, listaGalerias);
     
}//construyeMapa

///////////////////////////////////
function distanciaHarvesine(lat1, lon1, lat2, lon2)
{
    var R = 6378137; // metros
    var dLat = (lat2-lat1)*Math.PI/180;
    var dLon = (lon2-lon1)*Math.PI/180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var d = R * c;
    return d;
}
  
function distanciaAngular(lat1, lat2)
{
    var d = 6378137 * (lat2-lat1)*Math.PI/180;
    return d;//metros
}

function puntoEnCirculo(puntoLat, puntoLong, circuloLat, circuloLong, circuloRadio)
{
  //est�n dentro del circulo todos aquellos puntos cuya distancia al centro es menor que el radio.
  // eso lo calculamos con la funcion de Harvesine
  // Pero como en la mayor�a de las consultas van a estar fuera, aceleramos los calculos los que esten fuera del
  // cuadros excrito
  if (distanciaAngular(puntoLat, circuloLat)>=circuloRadio) return false;
  if (distanciaAngular(puntoLong, circuloLong)>=circuloRadio) return false;

  if (distanciaHarvesine(puntoLat, puntoLong, circuloLat, circuloLong)>=circuloRadio) return false;
  else return true; 
  // si hay problemas de rendimiento, se pude simplificar y usar las dos distacias angulares
  // como si fueran cartesianas -->distancia=raiz(distanciaLat*distanciaLat + distanciaLon*distanciaLon);
  // porque los circulos van a ser siempre muy peque�os en esta aplicaci�n.
}

