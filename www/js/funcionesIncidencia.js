var contadorGuiasCapturadas=0;
var concaAgregarLista="";
var valorVecesEntraAjax=1;
var conn = true;
var contadorGuiasConcatenadas=0;
var contadorGuiasPintadasYatienenCheck=0;

//var ip = "http://173.199.123.51:83/androidwebserviceMEKBetaTESTING/"; //restore 2019
//var ip="http://187.191.44.202:81/androidwebserviceMEKBeta/"; //servidor 2019
//var ip="http://173.199.123.51:83/androidwebserviceMEKBeta/"; //servidor 2020
//var ip="http://192.168.1.173:81/androidwebserviceMEKBeta-remision/";//localhost
//var ip="http://192.168.0.9/androidwebserviceMEKBeta/"; //MY HOME
//var ip = "http://34.235.249.54:83/androidwebserviceMEKBeta/"; //servidor2021
//var ip = "http://34.235.249.54:83/androidwebserviceMEKBetaTESTING/"; //restore2021
var ip = "http://187.191.44.202:83/androidwebserviceMEKBeta/"; //servidor NOV-2021

$(document).ready(function(){
    obtenerDatosTbRegistrosFallidos();    
    $("#cantidadGuiasCapturadas").html(contadorGuiasCapturadas);
    btnGuardar();
    btnCancelar();
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
function concatenarDatosEntregar(chekPoint,imgEvidencia){
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
   
    enviarDatos(concatenarTracknumber,chekPoint,imgEvidencia);
}

//OBTENER UBICACIONES    
var onSuccess = function(position) {
   sessionStorage.setItem("latitud", position.coords.latitude);
   sessionStorage.setItem("longitud", position.coords.longitude);
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}  

//**************************************** FUNCION PARA ENVIAR LOS DATOS A NUESTRO PHP Y REGISTRARLOS EN LA BD ***********************
function enviarDatos(tracknumber,chekPoint,imgEvidencia){
    habilitarloading();
    var latitud1= sessionStorage.getItem("latitud");
    var longitud1=sessionStorage.getItem("longitud");                                       
    var idUsuarioInicioSesion= sessionStorage.getItem("idusuario");            
    var nombreUsuarioInicioSesion=sessionStorage.getItem("nombreuser"); 
    
    $.ajax({
        type:"POST",
        url:ip+"registrar_incidencia2.php",	
        data:{tracknumber:tracknumber,
             chekPoint:chekPoint,
             imgEvidencia:imgEvidencia,
             nombreUsuarioInicioSesion:nombreUsuarioInicioSesion,
             latitud:latitud1,
             longitud:longitud1                      
    },error:function(){
            inabilitarloading();
            swal("Advertecia!","Sin conexión al servidor los datos se almacenaron localmente", "warning");  
            $("#id_textArea").val('');   
            var bd = crearBD();
            crearTable(bd);
            registrarDatos(bd,tracknumber,chekPoint,imgEvidencia,nombreUsuarioInicioSesion);
            limpiarCamposExito();
            pintarTracknumberExito();
            $("#btnGuardarEntregar").attr("disabled",false);
            //intervalo(); Cambio Aldo 16 Oct 2019
        },success:function(resultado){
          inabilitarloading();
           if(resultado.trim()=='true'){
                pintarTracknumberExito();
                limpiarCamposExito();
                //vaciarLista();
                swal("Exito!","Se registro correctamente el CheckPoint", "success");  
                $("#btnGuardarEntregar").attr("disabled",false);
            }else{
                var valorResultado=resultado.split(",");
                var mensaje=valorResultado[0];
                if(mensaje.trim() =='"La guia'){
                    var numGuias=valorResultado[1];
                    var arreNumguias=numGuias.split("-");
                    for(var i=0;i<arreNumguias.length;i++){
                         var valornumguia=arreNumguias[(i)];
                         pintarTracknumber(valornumguia);
                    }
                     
                     if(contadorGuiasCapturadas==(arreNumguias.length-1)){
                          swal("Advertecia!","Las guias color Amarillo ya tienen el CheckPoint seleccionado ", "warning");  
                     }else{
                         swal("Advertecia!","Los CheckPoint se registraron correctamente, Las guias color Amarillo ya tienen el CheckPoint seleccionado ", "warning");  
                     }
                    
                     limpiarCamposExito(); 
                 }else if(mensaje.trim()== '"Checkpoint registrados'){
                       var numGuias=valorResultado[2];
                       var arreNumguias=numGuias.split("-");
                       for(var i=0;i<arreNumguias.length;i++){
                        var valornumguia=arreNumguias[(i)];
                        pintarTracknumber(valornumguia);
                      }
                      limpiarCamposExito();
                      swal("Advertecia!","Los CheckPoint se registraron correctamente,Posiblemente alguno fallo y se registro en fallidos,Las guias color Amarillo ya tienen el CheckPoint seleccionado", "warning");  
                 }else if(resultado.trim()=='"Registro exitoso, pero algun registro fallo"'){
                      limpiarCamposExito();
                      swal("Advertecia!","Los CheckPoint se regestriraon correctamente, pero alguno fallo y se registro en fallidos", "warning");
                 }else{
                     limpiarCamposExito(); 
                     swal("Error!","Error al registrar Checkpoint " + resultado, "error");  
                } 
                $("#btnGuardarEntregar").attr("disabled",false);
            }  
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
function  enviarDatosSinRegistrarEnBDInterna(tracknumber,checkPoint,imgEvidencia,usuarioCreacion,fecha){    
    $.ajax({
        type:"POST",
        url:ip+"registrar_incidencia3.php",	
        data:{tracknumber:tracknumber,
             checkPoint:checkPoint,
             imgEvidencia:imgEvidencia,
             fecha:fecha,
             usuarioCreacion:usuarioCreacion
        },error:function(){
        },success:function(resultado){
            if(resultado.trim()=='true'){
                 var soloCheck=checkPoint.substring(6);
                 swal("Exito!","Se registro el Chekpoint "+soloCheck + " almacenado localmente", "success");  
                 var bd=crearBD();
                 eliminarRegistrosBD(bd,tracknumber);
            }else{
                var valorResultado=resultado.split(",");
                var mensaje=valorResultado[0];
                var soloCheck=checkPoint.substring(6);
                var pruebaMsn='"La guia';
                if(mensaje.trim() == '"La guia'){
                    var valorNumGuia=valorResultado[1];
                    desahogarguiaConchekPoint(valorNumGuia,soloCheck,tracknumber);
                }else if(mensaje.trim()=='"Checkpoint registrados'){
                    var valorNumGuia=valorResultado[2];
                    var arreGuias=valorNumGuia.split("-");
                    for(var i=0;i<arreGuias.length;i++){
                        if(arreGuias[i]==''){
                        }else{
                             swal("Advertecia!","La guia " + arreGuias[i] + " ya esta registrada con el CheckPoint "+ soloCheck, "warning");  
                        }
                    }
                    var bd=crearBD();
                    eliminarRegistrosBD(bd,tracknumber);
                }else if(resultado.trim()=='"Registro exitoso, pero algun registro fallo"'){
                    swal("Advertecia!","Registro exitoso, pero algun registro fallo y se registro en fallidos", "warning"); 
                    var bd=crearBD();
                    eliminarRegistrosBD(bd,tracknumber);
                }else{  
                }
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
                 var txtimgevidencia=document.getElementById("txtimgevidencia").value; 
                 if(txtimgevidencia != ''){
                     $("#btnGuardarEntregar").attr("disabled",true);
                     navigator.geolocation.getCurrentPosition(onSuccess, onError);   
                     concatenarDatosEntregar(chekPoint,txtimgevidencia); 
                }else {
                    swal("Advertecia!", "Debe tomar una foto de evidencia", "warning");
                    $("#btnCamara").focus();
                    $("#btnCamara").css("border-color", "red");
                }
             }else{ 
               swal("Advertecia!","Selecciona un CheckPoint", "warning");  
               document.getElementById("txtincidencia").focus();
            }
        }else{
            swal("Advertecia!","Necesita capturar al menos una guia", "warning");  
            $("#btnEscanear").focus();
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
    var vc=ip+"consulta_check2.php?Tracknumber="+tracknumber.trim();
    $.ajax({
        type:"POST",
         url:ip+"consulta_check2.php?Tracknumber="+tracknumber.trim(),	
        data:{tracknumber:tracknumber.trim()},
        error:function(){
          inabilitarloading();
          swal("Advertecia!","Error con conexion al servidor", "warning");  
        },
        success:function(resultado){
         inabilitarloading();
         if( resultado.trim()=='"Guia Finalizada"'){
          swal("Advertecia!","La guia "+ tracknumber+" ya fue entregada", "warning");  
         }else if(resultado.trim()=='"no tiene el zzm04"'){
          swal("Advertecia!","Debe registrar un CheckPoint en Ruta a la guia "+ tracknumber+", para poder registrar una incidencia", "warning"); 
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
            $("#cantidadGuiasCapturadas").html(totalGuias); 
        }else if( resultado.trim()=='"Error"'){ 
             swal("Advertecia!","La guia "+tracknumber+ " no existe", "warning");  
        }else{
             swal("Error!","Ocurrio un error, contacte al administrador "  + resultado, "error");  
        } 
        $("#id_textArea").val(''); 
     }   
  });
}

function validarInternet() {
    var ban = false;
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    
    if (states[networkState] == 'No network connection' || states[networkState] == 'Unknown connection') {

    } else {
        ban = true;
    }

    return ban;
}

 function mensaje() {
    /*if (validarInternet()) {
        var bd = crearBD();
        leerTablaBD(bd);
        clearInterval(intervalo);
    } else { 
    }*/
    var bd = crearBD();
    leerTablaBD(bd);
    clearInterval(intervalo);
}

function intervalo() {
    intervalo = setInterval(mensaje(), 1000);
}

//********************************************** BASE DE DATOS LOCAL *******************************************    
function crearBD() {
    var bd = window.openDatabase('mydb3', '1.0', 'testdb3', 2 * 1024 * 1024);
    return bd;
}
    
function crearTable(bd){    
    bd.transaction(function(texto){
        texto.executeSql('CREATE TABLE IF NOT EXISTS incidencias (tracknumber,checkPoint,imgEvidencia,usuarioCreacion,fecha)');
    });
 }
    
function registrarDatos(bd,tracknumber,checkPoint,imgEvidencia,usuarioCreacion){
    var fecha = obtenerFechaYhora();
    bd.transaction(function(texto){
        texto.executeSql('INSERT INTO incidencias (tracknumber, checkPoint, imgEvidencia, usuarioCreacion, fecha) VALUES ("' + tracknumber + '","' + checkPoint + '","' + imgEvidencia + '","' + usuarioCreacion + '","' + fecha + '")');
    });    
} 

function leerTablaBD(bd){
    bd.transaction(function (texto) {
       texto.executeSql('SELECT * FROM incidencias', [], function (texto, result) {
           //var tamaño = result.rows.length, i;
           var tamaño = result.rows.length;
           var mensaje = "<p> encontramos " + tamaño + " cantidad registros";
           for (var i = 0; i < tamaño; i++) {
                var valorTracknumber = result.rows.item(i).tracknumber;
                if (valorTracknumber.length == 0) {
                    break;
               }else{
                   var valorEstatusCheck=result.rows.item(i).checkPoint;
                   var valorImgEvidencia=result.rows.item(i).imgEvidencia;
                   var valorFecha=result.rows.item(i).fecha;
                   var valorUsuarioCreacion=result.rows.item(i).usuarioCreacion;
                   if (validarInternet()) {
                       enviarDatosSinRegistrarEnBDInterna(valorTracknumber, valorEstatusCheck, valorImgEvidencia, valorUsuarioCreacion, valorFecha);
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

//*************************************** function solo para ver los registros que existen en bd *******************************
function eliminarRegistrosBD(bd,tracknumber){
    bd.transaction(function(texto){
        texto.executeSql('delete from incidencias where tracknumber="'+tracknumber+'"');
    });
}
    
//*********************************** FUNCION PARA CHECAR SI EN LA TABLA REGISTROS FALLIDOS HAY ALGUN REGISTRO *******************
function obtenerDatosTbRegistrosFallidos(){
    $.ajax({
       type:"POST",
        url:ip+"buscarRegistrosFallidosTipoIncidencia.php",
         success:function(resultado){
            if (resultado.trim()=='"sin registro"'){
            }else if(resultado.trim()=='"fallo hacer la consulta"'){
            }else if(resultado.trim()=='"eliminado y registrado"'){
                swal("Exito!","Se registro el CheckPoint registrado en fallidos", "success");  
            }else if(resultado.trim()=='"eliminado"'){
                 swal("Exito!","Se registro el CheckPoint registrado en fallidos", "success");
            }else{
            }
        }
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

//********************* function llenar lista sin internet *********************************************************
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

//****************** function obtener fecha y hora actual ************************
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

function limpiarCamposExito(){
    //$("#txtincidencia").val("");
    $("#txtincidencia").val("").change();//Cambio Aldo 16 Oct 2019
    document.getElementById("txtimgevidencia").value = "";
    //document.getElementById("txtimgevidencia").value = "";
    $("#btnCamara").css("border-color","#dbdbdb");
    document.getElementById('smallImage').src="";
}

function desahogarguiaConchekPoint(tracknumber,soloCheck,traknumberEliminar){
    var arreGuias=tracknumber.split("-");
    for(var i=0;i<arreGuias.length;i++){
        if(arreGuias[i]==''){
        }else{
            swal("Advertecia!","La guia " + arreGuias[i] + " ya esta registrada con el CheckPoint "+ soloCheck, "warning");
        }
    }
    var bd=crearBD();
    eliminarRegistrosBD(bd,traknumberEliminar);
}