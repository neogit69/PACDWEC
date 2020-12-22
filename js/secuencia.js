function creaTabla(resultados){//un array de arrays con los valores de fila

    var tabla=document.createElement("table");//creamos la tabla

    for(var f=0;f<resultados.length;f++){//para todo el array bidimensional
        var fila=document.createElement("tr");//crea una fila en la tabla
        var jugada=resultados[f];//jugada es un array con cada jugada 
        for(var c=0;c<jugada.length;c++){//para cada valor de jugada
            var columna=document.createElement("td");//crea una celda
            var textocol=document.createTextNode(resultados[f][c]);//carga el contenido 
            columna.appendChild(textocol); //añade el valor a imprimir a la columna
            fila.appendChild(columna);//añade la columna a la fila
        }

        tabla.appendChild(fila);//añade la fila a la tabla
    }
    //opcionalmente añade la tabla a otro contenedor
    micontenedor.appendChild(tabla);
}

//ejemplo de array resultados
var resultados=[];
var registrodeunajugada=[];
//durante el ciclo de jugada
registrodeunajugada=[variable1, variable2,variable3, etc];
resultados.push(registrodeunajugada);
