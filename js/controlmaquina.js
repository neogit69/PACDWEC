window.onload = function(){//hasta que no cargue la página no se inicializa el juego
    manejoEventos();
    resetMaquina();
    
    
}
function manejoEventos(){//asignamos funciones a los botones
    document.getElementById("insertarmonedas").onclick = insertarMonedas;
    // document.getElementById("tb-premios").onclick = tablaPremios;
    // document.getElementById("tb-estadisticas").onclick = estadisticas;
    document.getElementById("terminar-ronda").onclick = finRonda;
    document.getElementById("bajar-apuesta").onclick = bajarApuesta;
    document.getElementById("jugar").onclick = jugar;
    document.getElementById("subir-apuesta").onclick = subirApuesta;
}

function resetMaquina(){
    cambiaEstadoBoton("jugar","desactivar");
    cambiaEstadoBoton("bajar-apuesta","desactivar");
    cambiaEstadoBoton("subir-apuesta","desactivar");
    cambiaEstadoBoton("terminar-ronda","desactivar");
    // cambiaEstadoBoton("tb-estadisticas","desactivar");
}
//variables globales
var rutaimg=    ["img/frutas/aguacate.png",
                  "img/frutas/ajo.png",
                  "img/frutas/cebolla.png",
                  "img/frutas/pepino.png",
                  "img/frutas/puerro.png",
                  "img/frutas/tomate.png",
                  "img/frutas/zanahoria.png"
                ];
var rangoAleatorio=rutaimg.length;//cantidad de imagenes de frutas disponibles.

var credito=0;//indica el numero de monedas cargadas en la tragaperras
var premios=0;//premios recibidos en cada jugada
var saldojugada=0;//indica la ganancia o perdida producida en cada jugada
var numjugada=0;//numero de jugada en esta ronda
var apuesta=1; //cantidad apostada en cada jugada
var ronda=0;//numero de ronda de tiradas
var creditoinicial=0;//almacena el dinero con el que se inicia una ronda
var totaljugadas=0;//jugadas totales en todas las rondas revisar
var totalpremios=0;//premios acumulados en todas las rondas revisar
var ganancias=0;//saldo final de dinero ganado o perdido
var registrojugada=[];//almacena todos los resultados de una jugada
var tablaresultados=[];//almacena todos los registrojugada[] datos de todas las jugadas y rondas
var nummonedas=1;//por si actualizo a poder insertar distinto numero de monedas
var bonus=1;//por si implemento un bonus aleatorio que multiplique el premio

//TODO crear un objeto que contenga todos los contadores
//var contadores={credito:0 , premios : 0 , etc etc}
//resultara mas incomodo tener que llamar contadores.credito etc cada vez
//finalmente decido no implementar los contadores en un objeto.

    function resetContadores(){
        credito=0;
        premios=0;
        saldojugada=0;
        numjugada=0;
        apuesta=1;
        creditoinicial=0;
    }            

    // function tablaPremios(){//visualiza informacion de combinaciones premiadas al usuario
    //     alert("no implementado");
    // }   
    function finRonda(){
        
        cambiaEstadoBoton("jugar","desactivar");
        cambiaEstadoBoton("insertarmonedas","activar");
        cambiaEstadoBoton("subir-apuesta","desactivar");
        cambiaEstadoBoton("bajar-apuesta","desactivar");
        cambiaEstadoBoton("terminar-ronda","desactivar");
        genera_tabla(tablaresultados,ronda);//inicialmente invisible
        // cambiaEstadoBoton("tb-estadisticas","activar");
        resetContadores();
        setBotonJugar(apuesta);
        document.getElementById("credito-actual").innerHTML=credito;
        ronda++;
        //genera tabla de ronda
        //reset
        //comprueba estado de botones
    }
    function bajarApuesta(){
        apuesta-=1;
        setBotonJugar(apuesta);//indica apuesta en botón jugar
        if(apuesta==1){//impide apostar una cantidad menor que 1$
            cambiaEstadoBoton("bajar-apuesta","desactivar");
        }
        if(credito>apuesta){
            cambiaEstadoBoton("subir-apuesta","activar");
            
        }
        if(credito>=apuesta){
    
            cambiaEstadoBoton("jugar","activar");
        }

    }   
    function subirApuesta(){
        apuesta+=1;
        setBotonJugar(apuesta) ;//indica la apuesta en botón jugar
        if(apuesta==credito){//impide apostar mas dinero que el credito actual
            cambiaEstadoBoton("subir-apuesta","desactivar");
        }
        if(apuesta>1){//se activa el botón bajar apuesta
            cambiaEstadoBoton("bajar-apuesta","activar");
        }
    }  
    function setBotonJugar(apuesta){
        document.getElementById("apuesta").innerHTML=apuesta;//indica la apuesta en botón jugar
    }       
    
    function insertarMonedas(){
        credito+=nummonedas;//el credito se incrementa segun el numero de monedas añadidas default 1
        creditoinicial=credito;
        // console.log(credito);
        if(ronda==0){
            ronda++;
        }
        actualizaContadores(credito,numjugada,premios,0,saldojugada,
            creditoinicial,ronda,totalpremios,bonus,ganancias);
        if(credito>=apuesta){
            cambiaEstadoBoton("jugar","activar");
        }
        if(credito>1){
            cambiaEstadoBoton("subir-apuesta","activar");
        }
        // return credito;//no necesario de momento
    }
    
    function cambiaEstadoBoton(idboton,estado){//estado true o false. boton ="idboton" string
        var miboton=document.getElementById(idboton);
        if(estado=="activar"){
            miboton.disabled=false;//el atributo disabled del boton se anula y el botón se activa
        }
        else if(estado=="desactivar"){
            miboton.disabled=true;//el atributo se activa y el botón queda deshabilitado
        }
    }
    
    function jugar(){
        cambiaEstadoBoton("insertarmonedas","desactivar");//al empezar a jugar ya no se admiten monedas
        cambiaEstadoBoton("terminar-ronda","activar");//se activa por si el usuario quiere terminar
        numjugada++;//actualiza contador de jugada en curso
        totaljugadas++;//actualiza el numero total de jugadas
        var combinacion=generarCombinacion(3);//un array con 3 numeros comprendidos entre 0 y rangoAleatorio-1
        //------visualizacion de la jugada
        visualizaCombinacion(combinacion);
        //comprobar si hay premio y actualizar contadores
        premios=compruebaPremios(combinacion);
        // console.log("premio obtenido= " +premios);
        //si hay premio indicarlo y actualizar credito(saldo)
        credito=credito-apuesta+premios;
        totalpremios+=premios;
        saldojugada=premios-apuesta;
        ganancias=ganancias+saldojugada;//acumula todas las perdidas o ganancias
        actualizaContadores(credito,numjugada,premios,apuesta,saldojugada,
            creditoinicial,ronda,totalpremios,bonus,ganancias);
        //actualizar historial de juagadas array registrojugadas
        registrojugada=[ronda,numjugada,combinacion,apuesta,premios,bonus,saldojugada,ganancias];//agregar datos TODO
        tablaresultados.push(registrojugada);//añade el registro a la tabla general
        
        //actualizamos el estado de la maquina en funcion de los resultados
        if(credito==0){//la ronda termina automaticamente y reiniciamos maquina
            //desactivar boton jugar y activar insertar monedas desactiva terminar ronda
            //genera la tabla de ronda
            finRonda();
        }
        if(credito>1){
            cambiaEstadoBoton("subir-apuesta","activar");
        }
        if(credito>0 && apuesta>credito){//no permite jugar mas de lo que se tiene
            cambiaEstadoBoton("jugar","desactivar");//impide jugar 
            alert("La apuesta es superior al crédito, bájela");
        }
    }
    
    function visualizaCombinacion(combinacion){
        //visualiza las imagenes seleccionadas aleatoriamente en sus slots correspondientes
        var slot1=document.getElementById("slot1");
        slot1.innerHTML="<img src="+rutaimg[combinacion[0]]+">";
        var slot2=document.getElementById("slot2");
        slot2.innerHTML="<img src="+rutaimg[combinacion[1]]+">";
        var slot3=document.getElementById("slot3");
        slot3.innerHTML="<img src="+rutaimg[combinacion[2]]+">";
    }
    
    
    function aleatorio(rango){
        var numero=Math.floor(Math.random() * rango);//devuelve numero entre 0 y (rango-1)
         //como rango es un arraylenght es 7 devuelve valores 0 a 6
        return numero;
    }
    
    function generarCombinacion(longitud){//genera un array de longitud "longitud"
        var combinacion=[]
        for(var i=0;i<longitud;i++)
        {
            combinacion[i]=aleatorio(rangoAleatorio);//carga array con numeros aleatorios en rango
        }
        return combinacion;//en nuestro caso es un array con tres numeros del 0 al 6(las frutas)
    }
    
    function actualizaContadores(credito,numjugada,premios,apuesta,saldojugada,
        creditoinicial,ronda,totalpremios,bonus,ganancias){
        //se actualiza el html con los valores de la jugada en curso
        document.getElementById("credito-actual").innerHTML=credito;
        document.getElementById("jugadas-ronda").innerHTML=numjugada;
        document.getElementById("premio-jugada").innerHTML=premios;
        document.getElementById("apostado").innerHTML=apuesta;
        document.getElementById("saldo-jugada").innerHTML=saldojugada;
        document.getElementById("credito-inicial").innerHTML=creditoinicial;
        document.getElementById("ronda-actual").innerHTML=ronda;
        document.getElementById("premios-totales").innerHTML=totalpremios;
        document.getElementById("bonus-extra").innerHTML=bonus;
        document.getElementById("saldo-neto").innerHTML=ganancias;
    }
    
    
    function compruebaPremios(combinacion){
        
        //convertir array combinacion en un string tipo 666 153 333 etc y usar expresiones regulares
        var sl1=combinacion[0].toString();
        var sl2=combinacion[1].toString();
        var sl3=combinacion[2].toString();
        var combi=sl1+sl2+sl3;
        var premio;
        
        if(/666/.test(combi)){
            premio=10;
            console.log("tres zanahorias");
            // Si salen tres zanahorias, se ganan diez monedas.
        }
        else if(/66.|6.6|.66/.test(combi)){
            premio=4;
            console.log("dos zanahorias");
            // Si salen dos zanahorias, se ganan cuatro monedas.
        }
        else if(/000|111|222|333|444|555/.test(combi)){
            premio=5;
            console.log("tres iguales");
            // Si salen tres hortalizas iguales que no sean zanahorias, se ganan cinco monedas.
        }
        else if(/600|611|622|633|644|655|060|161|262|363|464|565|006|116|226|336|446|556/.test(combi)){
            premio=3;
            console.log("dos iguales y una zanahoria");
            // Si sale una zanahoria y dos hortalizas iguales, se ganan tres monedas.
        }
        else if(/[^6]00|[^6]11|[^6]22|[^6]33|[^6]44|[^6]55|0[^6]0|1[^6]1|2[^6]2|3[^6]3|4[^6]4|5[^6]5|00[^6]|11[^6]|22[^6]|33[^6]|44[^6]|55[^6]/.test(combi)){
            premio=2;
            console.log("dos iguales sin zanahorias");
            // Si sale una zanahoria y dos hortalizas iguales, se ganan tres monedas.
        }
        else if(/6/.test(combi)){
            premio=1;
            console.log("una zanaahoria");
            // Si sale una zanahoria, se gana una moneda.   
        }
        // Si salen dos hortalizas iguales que no sean zanahorias, se ganan dos monedas.
        else{
            premio=0;
            console.log("nada pringao");
        }
        
        return premio*apuesta*bonus;//el premio en funcion de lo apostado y si hay bonus
        
    }
    
    
    // //ver estadisticas. no es lo mismo que generar las tablas
    // function estadisticas(){
    //    // var elemento=document.getElementById("historico");
    //     //no tengo ni puta idea de que hacer ahora
    //     tablaresultados.forEach(recorrer);
    //    cambiaEstadoBoton("tb-estadisticas","desactivar"); 
    // //    genera_tabla(tablaresultados);//la tabla se genera al terminar ronda o credito 0
    //     // alert("no implementado");    
    // }
    // function recorrer(value,index,array){//para depuracion
    //     console.log(index+"---"+value);
    // }
    
    function genera_tabla(tablaresultados,ronda) {
        var mironda=ronda;//depuracion genera 1 tabla filtrando las rondas
        // Obtener la referencia del elemento contenedor
        var micontenedor = document.getElementById("historico");//visible o invisible segun caso
        // Crea un elemento <table> y un elemento <tbody>
        var tabla   = document.createElement("table");
        var titulotabla=document.createElement("caption");
        var textotitulo=document.createTextNode("RONDA "+mironda);
        titulotabla.appendChild(textotitulo);
        tabla.appendChild(titulotabla);

        //generamos el encabezado de la tabla
         var cabecera=document.createElement("tr");
         tabla.appendChild(cabecera);
         var titulos=["JUGADA","COMBINACION",
                        "APUESTA","PREMIO","BONUS",
                        "SALDO JUGADA","SALDO TOTAL"];
        for(var i=0;i<titulos.length;i++){
            var celdacab=document.createElement("th");
            var dato=document.createTextNode(titulos[i]);
            celdacab.appendChild(dato);
            cabecera.appendChild(celdacab);
        }
        //finaliza la generacion del encabezado de la tabla
        
        var tblBody = document.createElement("tbody");
       
        // Crea las celdas del tbody
        for (var i = 0; i<tablaresultados.length; i++) {//OJO MOD
          // Crea las hileras de la tabla
          //si ronda es distinta de ronda no crear
          if(tablaresultados[i][0]==ronda){

              var fila = document.createElement("tr");
          }
          else{
              continue;
          }
       
          for (var j = 0; j <tablaresultados[i].length; j++) {
            // Crea un elemento <td> y un nodo de texto, haz que el nodo de
            // texto sea el contenido de <td>, ubica el elemento <td> al final
            // de la fila de la tabla
            if(j==0){
                continue;
            }
            if(j==2){
                //el array de combinacion que salió
                var combi=tablaresultados[i][j];
                var img0=combi[0];
                var img1=combi[1];
                var img2=combi[2];
                var celda = document.createElement("td");
                // var textoCelda = document.createTextNode(tablaresultados[i][j]);
                var img1celda=document.createElement("img");
                img1celda.src= rutaimg[combi[0]];                 
                var img2celda=document.createElement("img");
                img2celda.src= rutaimg[combi[1]];                 
                var img3celda=document.createElement("img");
                img3celda.src= rutaimg[combi[2]];                 
                // celda.appendChild(textoCelda);
                celda.appendChild(img1celda);
                celda.appendChild(img2celda);
                celda.appendChild(img3celda);
                //celda.appendChild("<img src="+rutaimg[combi[0]]+">");
                celda.className="combis";//para posterior tratamiento con css
                fila.appendChild(celda);//añade td al tr
            }else{
                var celda = document.createElement("td");
                var textoCelda = document.createTextNode(tablaresultados[i][j]);
                celda.appendChild(textoCelda);
                fila.appendChild(celda);
            }
          }
       
          // agrega la fila al final de la tabla (al final del elemento tblbody)
          tblBody.appendChild(fila);
        }
       
        // posiciona el <tbody> debajo del elemento <table>
        tabla.appendChild(tblBody);
        tabla.className="estadisticas";//para ajustes con el css
        // appends <table> into <body>
        
        micontenedor.appendChild(tabla);//RESTAURAR ESTO
        // micontenedor.appendChild("<br/>");
        console.log(tabla);
        //  micontenedor.innerHTML=tabla;
        // modifica el atributo "border" de la tabla y lo fija a "2";
        // tabla.setAttribute("border", "2");
      }







