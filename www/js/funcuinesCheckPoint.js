 var contadorGuiasCapturadas=0;
var concaAgregarLista="";
var valorVecesEntraAjax=1;
 var conn = true;
var contadorGuiasConcatenadas=0;
var contadorGuiasPintadasYatienenCheck=0;
var contadorGuiasPintadassinzzm03=0;
var contadorFallo=0;
var cont=0;

//var ip = "http://173.199.123.51:83/androidwebserviceMEKBetaTESTING/"; //restore 2019
//var ip="http://187.191.44.202:81/androidwebserviceMEKBeta/"; //servidor 2019
//var ip="http://173.199.123.51:83/androidwebserviceMEKBeta/"; //servidor 2020
//var ip="http://192.168.1.173:81/androidwebserviceMEKBeta-remision/";//localhost
//var ip="http://192.168.0.9/androidwebserviceMEKBeta/"; //MY HOME
//var ip="http://34.235.249.54:83/androidwebserviceMEKBeta/"; //servidor 2021
//var ip = "http://34.235.249.54:83/androidwebserviceMEKBetaTESTING/"; //restore2021
var ip="http://187.191.44.202:83/androidwebserviceMEKBeta/"; //servidor NOV-2021

$(document).ready(function(){
    obtenerDatosTbRegistrosFallidos(); 
    var bd=crearBD();  
    leerTablaBD(bd);
    intervalo();
    $("#cantidadGuiasCapturadas").html(contadorGuiasCapturadas);
    btnGuardar();
    btnCancelar();
    // julio 2020
    btnCapturarFirma();
});
//************************************** METODO PARA AGREGAR ELEMENTOS A LA LISTA *************************************
function agregarFilaAlaLista(){
    var contadorentrar=1;
    var numGuia=$("#id_textArea").val();
    numGuia = numGuia.trim();
    
    if(numGuia.length>0){ 
        if(validarInternet()){
            if(validarGuiaExistente(numGuia)){
                swal("Advertecia!", "La guia " + numGuia+ " ya fue capturada", "warning"); 
                $("#id_textArea").val('');
            }else{
                var bd=crearBD();
                crearTable(bd);
                consultaEspecifica3(bd,numGuia);
            } 
        }else{
            var bd=crearBD();
            crearTable(bd);
            consultaEspecifica2(bd,numGuia);
        }
    }else{
    }
    
}
//************************************* FUNCIONES PARA SUMAR Y DESCONTAR EL TOTAL DE GUIAS ********************************************
function obtenerTotalGuiasCapturadas(){
    contadorGuiasCapturadas++;
    return contadorGuiasCapturadas;
}
function descontarTotalGuiasCapturadas(){
    contadorGuiasCapturadas--;
    return contadorGuiasCapturadas;
}
//************************************** FUNCION PARA VALIDAR SI LA GUIA YA FUE CAPTURADA ************************************************

function validarGuiaExistente(guiaCapturada){
    var ban=false;
    $("#listaGuias li").each(function(){
     var valorFila=  $(this).text();
        if(valorFila==guiaCapturada){
            ban=true;
        }else{ 
        }
    });
    return ban;
}
//***************************** FUCNCION PARA CONCATENAR LAS GUIAS *********************************************
function concatenarDatosEntregar(chekPoint, valorQuienRecibe, image){
    var contador=1;
    var concatenarTracknumber="";
    $("#listaGuias li").each(function(){
        var valorLista= $(this).text();
        
        if("Guias Capturadas Total:"+contadorGuiasCapturadas!=valorLista.trim()) {
            if(contador==1){
                concatenarTracknumber=concatenarTracknumber+valorLista; 
                contador++;
            }else{
                concatenarTracknumber=concatenarTracknumber+","+valorLista;
            }
        }else{
        }
    });
    
    var latitud= sessionStorage.getItem("latitud" );
    var longitud=sessionStorage.getItem("longitud");
    enviarDatos(concatenarTracknumber,chekPoint,latitud,longitud,valorQuienRecibe,image);
}

function insertarLocal(bd,guia,chekPoint,valorQuienRecibe,image,nombreUsuarioInicioSesion,idUsuarioInicioSesion){
    var fechal=obtenerFechaYhora();
    bd.transaction(function(texto){
        texto.executeSql('insert into seguimientoRuta (tracknumber,checkPoint,tipoEvidencia,firma,usuarioCreacion,idUsuarioCreacion,fecha) values ("'+guia+'","'+chekPoint+'","'+valorQuienRecibe+'","'+image+'","'+nombreUsuarioInicioSesion+'","'+idUsuarioInicioSesion+'","'+fechal+'")');
    }); 
}

//**************************************** FUNCION PARA ENVIAR LOS DATOS A NUESTRO PHP Y REGISTRARLOS EN LA BD ***********************
function enviarDatos(tracknumber,chekPoint,latitud,longitud,valorQuienRecibe,image){
    habilitarloading();
    var idUsuarioInicioSesion= sessionStorage.getItem("idusuario"); 
    var nombreUsuarioInicioSesion=sessionStorage.getItem("nombreuser"); 
    $.ajax({
        type:"POST",
        url:ip+"registrar_check4.php",	
        data:{tracknumber:tracknumber,
             chekPoint:chekPoint,
             valorQuienRecibe: valorQuienRecibe,
            image: image,
             iduser: idUsuarioInicioSesion,
             nombreUsuarioInicioSesion:nombreUsuarioInicioSesion,
             latitud:latitud,
             longitud:longitud},
        error:function(){
            inabilitarloading();
            $("#id_textArea").val('');
            if (validarInternet()){
            }else{
                var bd= crearBD();
                crearTable(bd);
                var obtenerLista=obtenerListaGuia();
                var arreobtenerLista=obtenerLista.split(",");
                
                for(var i=0;i<arreobtenerLista.length;i++){
                    var guia=arreobtenerLista[i];
                    insertarLocal(bd,guia,chekPoint,valorQuienRecibe,image,nombreUsuarioInicioSesion,idUsuarioInicioSesion);
                }
                
                swal("Advertecia!","Sin conexión al servidor los datos se almacenaron localmente" , "warning");
                $("#btnGuardarEntregar").attr("disabled",false);
                intervalo(); 
            }
        },success:function(resultado){
            inabilitarloading();
            if(resultado.trim()=='true'){
                pintarTracknumberExito();
                swal("Exito!","Se registro correctamente el CheckPoint", "success");
                $("#btnGuardarEntregar").attr("disabled",false);
            }else{
                var valorResultado=resultado.split(",");
                var sinzzm03=valorResultado[0];
                var conguia=valorResultado[1];
                var fallo=valorResultado[2];
                var registroExitoso=valorResultado[3];
                var valorRegistro=valorResultado[4];
                var arresinzzm03=sinzzm03.split("-");
                var arreconguia=conguia.split("-");
                var arrefallo=fallo.split("-");
                var arreregistroExitoso=registroExitoso.split("-");
                
                if(arresinzzm03.length>0){
                    for(var i=1;i<arresinzzm03.length;i++){
                        var guiaSinZZM03=arresinzzm03[i];
                        pintarTracknumbersinzzm03(guiaSinZZM03);
                    }
                }else{
                }
                
                if(arreconguia.length>0){
                    for(var i=1;i<arreconguia.length;i++){
                        var guiaSinZZM03=arreconguia[i];
                        pintarTracknumber(guiaSinZZM03);
                    }
                }else{
                }
                
                if(arrefallo.length>0){
                    for(var i=1;i<arrefallo.length;i++){
                        var guiaSinZZM03=arrefallo[i];
                        pintarTracknumberFallo(guiaSinZZM03);
                    } 
                }else{  
                }
                
                var mensajeResultado="";
                if(contadorGuiasPintadasYatienenCheck>0){
                    var soloDescripcion=chekPoint.substring(6);
                    mensajeResultado=mensajeResultado+"Las guias color Amarrillo ya tienen el check "+ soloDescripcion;
                }else{
                }
                
                if(contadorGuiasPintadassinzzm03>0){
                    mensajeResultado=mensajeResultado+"Las guias color Naranja, debe registrarle un CheckPoint Recoleción de paquete antes de en Ruta";
                }else{  
                }
                
                if(contadorFallo>0){
                    mensajeResultado=mensajeResultado+"Las guias color Rojo, se registraron en fallidos";
                }else{
                }
                
                $("#btnGuardarEntregar").attr("disabled",false);
                
                if(valorRegistro.trim()=='1"'){
                    contadorFallo=0;
                    contadorGuiasPintadassinzzm03=0;
                    contadorGuiasPintadasYatienenCheck=0;
                    swal("Exito!","Registro exitoso "+mensajeResultado,"success"); 
                    
                    if(arreregistroExitoso.length>0){
                        for(var i=1;i<arreregistroExitoso.length;i++){
                            var guiaSinZZM03=arreregistroExitoso[i];
                            pintarTracknumberRegistroExitoso(guiaSinZZM03);
                        }
                    }else{
                    }
                }else{
                    contadorFallo=0;
                    contadorGuiasPintadassinzzm03=0;
                    contadorGuiasPintadasYatienenCheck=0;
                    swal("Advertencia!",mensajeResultado,"warning");
                }
            }
            
            inabilitarloading();
        }
    });
}

function pintarTracknumber(tracknumber){
    if (tracknumber.length>0){
        $("#listaGuias li").each(function(){
            var valorLista= $(this).text();
            
            if("Guias Capturadas Total:"+contadorGuiasCapturadas!=valorLista.trim()) {
                if(valorLista.trim()==tracknumber.trim()){
                    $("#listaGuias #"+tracknumber+"").css({"background":"#E8FF00","color":"#000","border-bottom-left-radius": "inherit","border-bottom-right-radius": "inherit"});
                    contadorGuiasPintadasYatienenCheck++;
                }else{
                }
            }else{
            }
        });
    }else{
    }  
}

function pintarTracknumbersinzzm03(tracknumber){
    if (tracknumber.length>0){
        $("#listaGuias li").each(function(){
            var valorLista= $(this).text();
            if("Guias Capturadas Total:"+contadorGuiasCapturadas!=valorLista.trim()) {
                if(valorLista.trim()==tracknumber.trim()){
                    $("#listaGuias #"+tracknumber+"").css({"background":"orange","color":"#000","border-bottom-left-radius": "inherit","border-bottom-right-radius": "inherit"});
                    contadorGuiasPintadassinzzm03++;
                }else{
                }
            }else{
            }
        });
    }else{
    } 
}

function pintarTracknumberFallo(tracknumber){
    if (tracknumber.length>0){
        $("#listaGuias li").each(function(){
            var valorLista= $(this).text();
            if("Guias Capturadas Total:"+contadorGuiasCapturadas!=valorLista.trim()) {
                if(valorLista.trim()==tracknumber.trim()){
                    $("#listaGuias #"+tracknumber+"").css({"background":"red","color":"#fff","border-bottom-left-radius": "inherit","border-bottom-right-radius": "inherit"});
                    contadorFallo++;
                }else{
                }
            }else{
            }
        });
    }else{
    }
}

function pintarTracknumberRegistroExitoso(tracknumber){
    if (tracknumber.length>0){
        $("#listaGuias li").each(function(){
            var valorLista= $(this).text();
            if("Guias Capturadas Total:"+contadorGuiasCapturadas!=valorLista.trim()) {
                if(valorLista.trim()==tracknumber.trim()){
                    $("#listaGuias #"+tracknumber+"").css({"background":"#e1f4e8","color":"#000","border-bottom-left-radius": "inherit","border-bottom-right-radius": "inherit"});
                }else{
                }
            }else{
            }
        });
    }else{
    }
}
 
function pintarTracknumberExito(){
    $("#listaGuias li").each(function(){
        var valorLista= $(this).text();
        if("Guias Capturadas Total:"+contadorGuiasCapturadas!=valorLista.trim()) {
            $("#listaGuias #"+valorLista+"").css({"background":"#e1f4e8","color":"#000"});
        }else{
        }
    });     
}

//**************************************** FUNCION PARA ENVIAR LOS DATOS A NUESTRO PHP Y REGISTRARLOS EN LA BD ***********************
function enviarDatosSinRegistrarEnBDInterna(tracknumber,checkPoint,valorQuienRecibe,image,nombreUsuarioInicioSesion,valorIdUduario,fecha){
    
    $.ajax({
        type:"POST",
        url:ip+"registrar_check5.php",	
        data:{tracknumber:tracknumber,
             chekPoint:checkPoint,
              valorQuienRecibe: valorQuienRecibe,
            image: image,
             fecha:fecha,
              iduser:valorIdUduario,
              nombreUsuarioInicioSesion:nombreUsuarioInicioSesion },
        error:function(){
            
        },success:function(resultado){
            if(resultado.trim()=='true'){
                var soloCheck=checkPoint.substring(6);
                swal("Exito!","Se registro el Chekpoint "+soloCheck + " almacenado localmente", "success");
                var bd=crearBD();
                eliminarRegistrosBD(bd,tracknumber);
            }else{
                swal("Advertecia!",""+resultado.trim() , "warning");
                //navigator.notification.alert(resultado.trim());
                var bd=crearBD();
                eliminarRegistrosBD(bd,tracknumber);
                inabilitarloading();  
            }
        }
    });   
}

function btnGuardar(){
    
    $("#btnGuardarEntregar").click(function(){
        if(contadorGuiasCapturadas>0){
            var chekPoint=$("#txtincidencia").val();
            if (chekPoint.length>0){
                var valorQuienRecibe = $("#txtnombrerecibe").val();
                if ((valorQuienRecibe.length > 0 && chekPoint=="ZZM03-Recoleccion de Paquete.") || (valorQuienRecibe.length == 0 && chekPoint!="ZZM03-Recoleccion de Paquete.")) {
                    $("#btnGuardarEntregar").attr("disabled",true);
                    var canvas = document.getElementById("flexBox");
                    var image = canvas.toDataURL(); 
                    concatenarDatosEntregar(chekPoint, valorQuienRecibe, image);
                } else {
                    $("#txtnombrerecibe").focus();
                    swal("Advertecia!", "Debe colocar el nombre de la persona que recolecta", "warning");
                    $("#txtnombrerecibe").focus();
                }
            }else{
                swal("Advertecia!","Selecciona un CheckPoint", "warning");
                document.getElementById("txtincidencia").focus();
            }
        }else{
            swal("Advertecia!","Necesita capturar al menos una guia", "warning"); 
        }
    });
}

function btnCancelar(){
    $("#btnCancelar").click(function(){
        location.href='servicios.html';
    });
}

//**************************************** FUNCION PARA VALIDAR SI LA GUIA CAPTURADA ESTA EN LA TB MOVIMIENTO *************************
function validarTracknumberEnBD(tracknumber){
   habilitarloading();
    var ban=false;
    var vc=ip+"consulta_check_seguimiento.php?Tracknumber="+tracknumber.trim();
    $.ajax({
        type:"POST",
         url:ip+"consulta_check_seguimiento.php?Tracknumber="+tracknumber.trim(),	
        data:{tracknumber:tracknumber.trim()},
        error:function(){
            inabilitarloading();
            swal("Advertecia!","Error con conexion al servidor", "warning");
        },
        success:function(resultado){
            inabilitarloading();
            if( resultado.trim()=='"Guia Finalizada"'){
                swal("Advertecia!","La guia "+ tracknumber+" ya fue entregada", "warning");
            }else if(resultado.trim()=='"guia no finalizada"'){
                var listaConcatenada=concatenar(tracknumber);
                var arreDatos=listaConcatenada.split(",");
                vaciarLista();
                var contador=1;
                
                for (var i = 0; i <arreDatos.length; i++) {
                    var valorListaConca=arreDatos[i];
                    if (contador==3) {
                        $("#listaGuias").append("<li style='display:none' id='"+valorListaConca+"' data-icon='delete'><a href='#' id='" +valorListaConca+ "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>"+valorListaConca+"</a></li>");
                    }else{
                        $("#listaGuias").append("<li style='border-bottom-left-radius: inherit;'  id='"+valorListaConca+"' data-icon='delete'><a href='#' id='" +valorListaConca+ "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>"+valorListaConca+"</a></li>");
                        valorVecesEntraAjax++;
                    }
                }
                
                $("#id_textArea").val('');
                var totalGuias =obtenerTotalGuiasCapturadas();
                $("#cantidadGuiasCapturadas").html(  totalGuias);
            }else if( resultado.trim()=='"Error"'){
                swal("Advertecia!","La guia "+tracknumber+ " no existe", "warning");
            }else{
                swal("Error!","Ocurrio un error, contacte al administrador "  + resultado, "error");
            }
            
            $("#id_textArea").val('');
        }
    });
}

function validarInternet(){
    var ban =false;
    var networkState = navigator.connection.type;
    
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    
    if(states[networkState]=='No network connection' ||  states[networkState]=='Unknown connection'){
    }else{
        ban=true;
    }
    return ban;
}

 function mensaje() {
     if (validarInternet()) {
         var bd= crearBD();
         leerTablaBD(bd);
         clearInterval(intervalo);
     }else{
     }
 }

function intervalo() {
    intervalo=setInterval(mensaje,1000);
 }

function crearBD(){
    var bd=window.openDatabase('mydb2','1.0','testdb2',2*1024*1024);
    return bd;
}
    
function crearTable(bd){
    bd.transaction(function(texto){
        texto.executeSql('create table if not exists seguimientoRuta (tracknumber,checkPoint,tipoEvidencia,firma,usuarioCreacion,idUsuarioCreacion,fecha)');
    });
}
    
function registrarDatos(bd,tracknumber,checkPoint,usuarioCreacion,idUsuarioInicioSesion){
    var fecha=obtenerFechaYhora();
    bd.transaction(function(texto){
        texto.executeSql('insert into seguimientoRuta (tracknumber,checkPoint,usuarioCreacion,idUsuarioCreacion,fecha) values ("'+tracknumber+'","'+checkPoint+'","'+usuarioCreacion+'","'+idUsuarioInicioSesion+'","'+fecha+'")'); 
    });
} 

function leerTablaBD(bd){ 
    bd.transaction(function(texto){
        texto.executeSql('select * from seguimientoRuta order by checkPoint asc',[],function(texto,result){
            var tamaño=result.rows.length,i;
            for(var i=0;i<tamaño;i++){
                var valorTracknumber=result.rows.item(i).tracknumber;
                if(valorTracknumber.length==0){
                    break;
                }else{
                    var valorEstatusCheck=result.rows.item(i).checkPoint;
                    var tipoEvidencia=result.rows.item(i).tipoEvidencia;
                    var firma=result.rows.item(i).firma;
                    var valorFecha=result.rows.item(i).fecha;
                    var valorUsuarioCreacion=result.rows.item(i).usuarioCreacion;
                    var valorIdUduario=result.rows.item(i).idUsuarioCreacion;
                    
                    if(validarInternet){
                        enviarDatosSinRegistrarEnBDInterna(valorTracknumber,valorEstatusCheck,tipoEvidencia,firma,valorUsuarioCreacion,valorIdUduario,valorFecha);
                    }else{
                    }
                }
            }
        });
    });
}

function consultaEspecifica2(bd,tracknumber){
    if(validarGuiaExistente(tracknumber)){
        swal("Advertencia", "La guia " + tracknumber+ " ya fue capturada", "warning");
        $("#id_textArea").val('');
    }else{
        llenarListaSinInternet(tracknumber);
    } 
}

function consultaEspecifica3(bd,tracknumber){
    if(validarGuiaExistente(tracknumber)){
        swal("Advertencia", "La guia " + tracknumber+ " ya fue capturada", "warning");
        $("#id_textArea").val('');
    }else{
        validarTracknumberEnBD(tracknumber);
    }
}

function soloLeerTablaBD(bd){
    bd.transaction(function(texto){
        texto.executeSql('select * from seguimientoRuta',[],function(texto,result){
            var tamaño=result.rows.length,i;
            if(tamaño>0){
                for(var i=0;i<tamaño;i++){
                    var valorTracknumber=result.rows.item(i).tracknumber;
                    if(valorTracknumber.length==0){
                        alert("No hay registros");
                        break;
                    }else{
                        var valorChekPoint=result.rows.item(i).checkPoint;
                        var fecha = result.rows.item(i).fecha;
                    }
                }   
            }else{
            }
        });
    });
}
function eliminarRegistrosBD(bd,tracknumber){
    bd.transaction(function(texto){
        texto.executeSql('delete from seguimientoRuta where tracknumber="'+tracknumber+'"');
    });
}
    
//*********************************** FUNCION PARA CHECAR SI EN LA TABLA REGISTROS FALLIDOS HAY ALGUN REGISTRO *******************
function obtenerDatosTbRegistrosFallidos(){
    $.ajax({
       type:"POST",
        url:ip+"buscarRegistrosFallidosTipoSeguimientoruta.php",
         success:function(resultado){
            if (resultado.trim()=='"sin registro"'){
            }else if(resultado.trim()=='"fallo hacer la consulta"'){

            }else if(resultado.trim()=='"eliminado y registrado"'){
                 swal("Exito!","Se registro el CheckPoint registrado en fallidos", "success");  
            }else if(resultado.trim()=='"eliminado"'){
                 swal("Exito!","Se registro el CheckPoint registrado en fallidos", "success");
            }else{
            }
         },
    });
}
   

//******************************* METODOS HABILITAR E INABILITAR LOADING ***************************************
function habilitarloading(){
    document.getElementById("loading").style.display="block";
}
function inabilitarloading(){
    document.getElementById("loading").style.display="none";  
}
    
//******************** METODOS DE PRUEBA PARA LISTAR ORDE *********************
function concatenar(numGuia){
    var concatenarGuias="";
	var contador=0;
    
    $("#listaGuias li").each(function(){
        var valorLista=$(this).text();
        if (valorLista.trim()=="Guias Capturadas Total:"+contadorGuiasCapturadas) {
        }else if(valorLista.trim()==numGuia){
        }else{
            if (contador==0) {
                concatenarGuias=concatenarGuias+valorLista;
				contador++;
            }else{
				concatenarGuias=concatenarGuias+","+valorLista;
            }
        }
    });

	if (numGuia.length==0) {
	}else{
        if (contador==0) {
            concatenarGuias=numGuia+concatenarGuias;
        }else{
            concatenarGuias=numGuia+","+concatenarGuias;
        }
    }
    return concatenarGuias;
}

function vaciarLista(){
    var cantidadLista=$("#listaGuias li").length;
    for(var i=1;i<cantidadLista;i++){
        $("#listaGuias li:last").remove();
    }
}

function eliminarElemento(elemento){
    var id=elemento.id;
    swal({
           title: "¿Esta seguro de eliminar la guia "+id+" de la lista?",
       
           icon: "info",
           buttons: true,
           dangerMode: true,
         })
         .then((willDelete) => {
         if (willDelete) {
             $("#"+id+"").remove();
             var  guis='';
             var totalGuias =descontarTotalGuiasCapturadas();
             $("#cantidadGuiasCapturadas").html('');
             $("#cantidadGuiasCapturadas").html(  totalGuias);
             if(totalGuias==0){
             }else{
                 agregarALista(guis);
             }
             swal("Se elimino correctamente!", {
                 icon: "success",
             });
         } else {
         }
    });
}

function agregarALista(numGuia){
    var listaConcatenada=concatenar(numGuia);
    var arreDatos=listaConcatenada.split(",");
    vaciarLista();
    var contador=1;
    for (var i = 0; i <arreDatos.length; i++) {
        var valorListaConca=arreDatos[i];
        if (contador==3) {
            $("#listaGuias").append("<li style='display:none' id='"+valorListaConca+"' data-icon='delete' class='ui-last-child'><a href='#' id='"+valorListaConca+"' onclick=eliminarElemento(this) class='ui-btn ui-btn-icon-right ui-icon-delete'>"+valorListaConca+"</a></li>");
        }else{
            $("#listaGuias").append("<li style='border-bottom-left-radius: inherit;' id='"+valorListaConca+"' data-icon='delete' class='ui-last-child'><a href='#' id='"+valorListaConca+"' onclick=eliminarElemento(this) class='ui-btn ui-btn-icon-right ui-icon-delete'>"+valorListaConca+"</a></li>");
        }
    }
}

function llenarListaSinInternet(tracknumber){
    var listaConcatenada=concatenar(tracknumber);
    var arreDatos=listaConcatenada.split(",");
    vaciarLista();
    var contador=1;
    
    for (var i = 0; i <arreDatos.length; i++) {
        var valorListaConca=arreDatos[i];
        if (contador==3) {
            $("#listaGuias").append("<li style='display:none' id='"+valorListaConca+"' data-icon='delete'><a href='#' id='" +valorListaConca+ "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>"+valorListaConca+"</a></li>");
        }else{
            $("#listaGuias").append("<li style='border-bottom-left-radius: inherit;'  id='"+valorListaConca+"' data-icon='delete'><a href='#' id='" +valorListaConca+ "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>"+valorListaConca+"</a></li>");
        }
    }
    
    $("#id_textArea").val(''); 
    var totalGuias =obtenerTotalGuiasCapturadas();
    $("#cantidadGuiasCapturadas").html(  totalGuias);
  
}

function obtenerFechaYhora(){
    var hoy= new Date();
    var mesBien=(hoy.getMonth()+1);
    var diaBien= hoy.getDate();
    var minutosBien= hoy.getMinutes();
    var horaBien=hoy.getHours();
    var segundoBien= hoy.getSeconds();
    
    if((hoy.getMonth()+1) <10 ){
        mesBien='0'+(hoy.getMonth()+1);
    }else{  
    }
    if(hoy.getDate() <10 ){
        diaBien='0'+ hoy.getDate();
    }else{
    } 
    if(hoy.getHours() <10 ){
      horaBien='0'+ hoy.getHours();
    }else{   
    } 
    if(hoy.getMinutes() <10 ){
       minutosBien='0'+hoy.getMinutes();
    }else{   
    } 
    if(hoy.getSeconds() <10 ){
        segundoBien='0'+ hoy.getSeconds();
    }else{ 
    } 
    
    var fecha=hoy.getFullYear()+"-"+mesBien+"-"+ diaBien;
    var hora=horaBien+":"+minutosBien+":"+segundoBien;
    var enviarFecha=fecha+" "+hora;
    
    return enviarFecha;
}

function obtenerListaGuia(){
    var concatenarGuias="";
	var contador=0;
    
    $("#listaGuias li").each(function(){
        var valorLista=$(this).text();
        if (valorLista.trim()=="Guias Capturadas Total:"+contadorGuiasCapturadas) {
            
        }else{
            if (contador==0) {
                concatenarGuias=concatenarGuias+valorLista;
				contador++;
			}else{
				concatenarGuias=concatenarGuias+","+valorLista;
			}
		}
    });
    
    return concatenarGuias;
}

var concatenarsinzzm03="";
function validarGuiasBDLocal(bd,tracknumber,checkpoint,nombreUsuarioInicioSesion,idUsuarioInicioSesion){
    var banzzm04=false;
    var banYatieneCheckPoint=false;
    var banYaseRegistro=false;
    var soloCheckpoint=checkpoint.substring(0,5);
    
    bd.transaction(function(texto){
        texto.executeSql('select * from seguimientoRuta',[],function(texto,result){
            var tamaño=result.rows.length,i;
            var mensaje="<p> encontramos "+ tamaño + " cantidad registros";
            
            if(tamaño==0){
                if(soloCheckpoint.trim()=='ZZM04'){
                    quitarGuiasBDLocal(tracknumber);
                    pintarTracknumbersinzzm03(tracknumber);
                 }else{
                     $("#btnGuardarEntregar").attr("disabled",false);
                     banYaseRegistro=true;
                 }
            }else{
                for(var i=0;i<tamaño;i++){
                    var valorTracknumber=result.rows.item(i).tracknumber;
                    var valorCheckpoint=result.rows.item(i).checkPoint;
                    var arreDatos=valorTracknumber.split(",");
                    var soloCheckpointBD=valorCheckpoint.substring(0,5);
                    
                    for(var j=0;j<arreDatos.length;j++){
                        var valorArreDatos=arreDatos[j];
                        
                        if(soloCheckpoint.trim()=='ZZM04'){
                            if(valorArreDatos.trim()==tracknumber.trim() && soloCheckpointBD.trim()== 'ZZM03'){
                                j=arreDatos.length;
                                i=tamaño;
                                bansinzzm03=true;
                                
                                for(var l=0;l<tamaño;l++){
                                    var valorTracknumber=result.rows.item(l).tracknumber;
                                    var valorCheckpoint=result.rows.item(l).checkPoint;
                                    var arreDatos=valorTracknumber.split(",");
                                    var soloCheckpointBD=valorCheckpoint.substring(0,5);
                                    
                                    for(var k=0;k<arreDatos.length;k++){
                                        var valorArreDatos=arreDatos[k];
                                        if(valorArreDatos.trim()==tracknumber.trim() && soloCheckpointBD.trim()== 'ZZM04'){
                                            banzzm04=true;
                                            quitarGuiasBDLocal(tracknumber);
                                            pintarTracknumber(tracknumber);
                                            k=arreDatos.length;
                                            banYaseRegistro=false;
                                            k=arreDatos.length;
                                            l=tamaño;
                                        }else{
                                            banYaseRegistro=true;
                                        }
                                    }
                                }
                            }else{
                            }
                        }else{
                            if(valorArreDatos.trim()==tracknumber.trim() && soloCheckpointBD.trim()== 'ZZM03' ){
                                banYatieneCheckPoint=true;
                                j=arreDatos.length;
                                i=tamaño;
                                banYaseRegistro=false;
                                quitarGuiasBDLocal(tracknumber);
                                pintarTracknumber(tracknumber);
                            }else{
                                banYaseRegistro =true; 
                            }
                        }
                    }
                }
                
                if(soloCheckpoint.trim()=='ZZM04'){
                    if(bansinzzm03 && banzzm04==false){
                        
                    }else if(bansinzzm03==false ){
                        quitarGuiasBDLocal(tracknumber);
                        pintarTracknumbersinzzm03(tracknumber);
               }else{
               }
                }else{
                }
            }
            
            if(banYaseRegistro){
                banYaseRegistro=false;
                bansinzzm03=false;
                var fecha=obtenerFechaYhora();
                bd.transaction(function(texto){
                    texto.executeSql('insert into seguimientoRuta (tracknumber,checkPoint,usuarioCreacion,idUsuarioCreacion,fecha) values ("'+tracknumber+'","'+checkpoint+'","'+nombreUsuarioInicioSesion+'","'+idUsuarioInicioSesion+'","'+fecha+'")');
                }); 
                pintarTracknumberRegistroExitoso(tracknumber);
                var recojerMesnaje='';
                if(contadorGuiasPintadassinzzm03>0){
                    recojerMesnaje=recojerMesnaje+'Las guias color Naranja deben registrarse primero un CheckPoint en Recolección';
                }else{ 
                }
                
                if(contadorGuiasPintadasYatienenCheck>0){
                    recojerMesnaje=recojerMesnaje+' Las guias color Amarillo ya tienen el CheckPoint seleccionado';
                }else{
                }
                
                if(recojerMesnaje==''){
                    bansinzzm03=false;
                    swal("Advertecia!","Sin conexión al servidor los datos se almacenaron localmente" , "warning"); 
                }else{
                    bansinzzm03=false;
                    swal("Advertecia!","Sin conexión al servidor los datos se almacenaron localmente, " + recojerMesnaje, "warning");
                }
            }else{
                var recojerMesnaje='';
                if(contadorGuiasPintadassinzzm03>0){
                    recojerMesnaje=recojerMesnaje+'Las guias color Naranja deben registrarse primero un CheckPoint en Recoleccón';
                }else{
                }
                
                if(contadorGuiasPintadasYatienenCheck>0){
                    recojerMesnaje=recojerMesnaje+' Las guias color Amarillo ya tienen el CheckPoint seleccionado';
                }else{
                    swal("Exito!","Sin conexión al servidor, los datos se guardaron localmente" ,"success");
                }
                var guia="";
                var nuevaLista="";
                nuevaLista=obtenerNuevaLista();
                if(nuevaLista.length>0){
                    registrarDatos(bd,nuevaLista,chekPoint,nombreUsuarioInicioSesion,idUsuarioInicioSesion);
                }else{
                }
                
                $("#btnGuardarEntregar").attr("disabled",false);
                if(recojerMesnaje==''){
                    bansinzzm03=false;
                    swal("Advertecia!","Sin conexión al servidor los datos se almacenaron localmente" , "warning"); 
                }else{
                    bansinzzm03=false;
                    swal("Advertecia!","Sin conexión al servidor los datos se almacenaron localmente, " + recojerMesnaje, "warning");
                }
            }
            
            $("#btnGuardarEntregar").attr("disabled",false);
        });
    });
    
    contadorFallo=0;
    contadorGuiasPintadassinzzm03=0;
    contadorGuiasPintadasYatienenCheck=0;
}

var nuevaConcatenacion="";
var listaguias="";
function quitarGuiasBDLocal(tracknumber){
    if (tracknumber.length>0){
        if(listaguias.length>0){
            
        } else{
            listaguias=obtenerListaGuia();
        }
        
        var arrelistaguias=listaguias.split(",");
        var listaconcatenada="";
        
        for (var i=0;i<arrelistaguias.length;i++){
            var guia=arrelistaguias[i];
            
            if(guia.trim()==tracknumber.trim()){
                arrelistaguias.splice(i, 1);
                i=arrelistaguias.length;
                nuevaConcatenacion=arrelistaguias;
                listaguias=obtenerNuevaLista();
            }else{
            }
        }
    }else{
    }
    
   return listaconcatenada; 
}

function obtenerNuevaLista(){
    var listaconcatenada="";
    if(nuevaConcatenacion.length>0){
        for(var j=0;j<nuevaConcatenacion.length;j++){
             var guia=nuevaConcatenacion[j];
             if (j==0){
                 listaconcatenada=listaconcatenada+guia;
             }else{
                 listaconcatenada=listaconcatenada+','+guia;
             }
         }
    }else{  
    }
     return listaconcatenada;
}

//JULIO 2020
function btnCapturarFirma() {
    
    $("#id_btnScanFirma1").click(function () {
        if (contadorGuiasCapturadas > 0) {
            var check = $( "#txtincidencia" ).val();
            if(check=="ZZM03-Recoleccion de Paquete."){
                var valorQuienRecibe = $("#txtnombrerecibe").val();
                if (valorQuienRecibe.length > 0) {
                } else {
                    $("#txtnombrerecibe").focus();
                    swal("Advertecia!", "Debe colocar el nombre de la persona que recolecta", "warning");
                    document.location = $("#btnCancelar2").attr("href");
                    $("#txtnombrerecibe").focus();
                }
            }
        } else {
            swal("Advertecia!", "Necesita capturar al menos una guia", "warning");
            document.location = $("#btnCancelar2").attr("href");
        }
    });
}
    