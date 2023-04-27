var contadorGuiasCapturadas = 0;
var concaAgregarLista = "";
var valorVecesEntraAjax = 1;
var contadorRemision = 0;
var bandRemision = 0;
var numGuiaRemsion = "";
var remisionMovimientos="";
var conn = true;

//var ip = "http://173.199.123.51:83/androidwebserviceMEKBetaTESTING/"; //restore 2019
//var ip="http://187.191.44.202:81/androidwebserviceMEKBeta/";//servidor 2019
//var ip="http://173.199.123.51:83/androidwebserviceMEKBeta/";//servidor 2020
//var ip="http://192.168.1.173:81/androidwebserviceMEKBeta-remision/";//localhost
//var ip="http://192.168.0.9/androidwebserviceMEKBeta/"; //MY HOME
//var ip="http://34.235.249.54:83/androidwebserviceMEKBeta/"; //servidor 2021
//var ip = "http://34.235.249.54:83/androidwebserviceMEKBetaTESTING/"; //restore2021
var ip="http://187.191.44.202:83/androidwebserviceMEKBeta/"; //servidor NOV-2021

$(document).ready(function () {
    obtenerDatosTbRegistrosFallidos();
    //intervalo();
    $("#cantidadGuiasCapturadas").html(contadorGuiasCapturadas);
    btnGuardar();
    btnCapturarFirma();
    btnCancelar();
});
//************************************** METODO PARA AGREGAR ELEMENTOS A LA LISTA *************************************
function agregarFilaAlaLista(v) {
    var contadorentrar = 1;
    var numGuia = $("#id_textArea").val();
    numGuia = numGuia.trim();
    
    if (numGuia.length > 0) {

        if (validarInternet()) {
                if (validarGuiaExistente(numGuia)) {
                    swal("Advertencia", "este num guia " + numGuia + " ya fue capturada", "warning");
                    $("#id_textArea").val('');
                } else {
                    var bd = crearBD();
                    crearTable(bd);
                    consultaEspecifica3(bd, numGuia);

                }
        } else {
            var bd = crearBD();
            crearTable(bd);
            consultaEspecifica2(bd, numGuia);
        }
    } else {
    }

}
//************************************* FUNCIONES PARA SUMAR Y DESCONTAR EL TOTAL DE GUIAS ********************************************
function obtenerTotalGuiasCapturadas() {
    contadorGuiasCapturadas++;
    return contadorGuiasCapturadas;
}
function descontarTotalGuiasCapturadas() {
    contadorGuiasCapturadas--;
    return contadorGuiasCapturadas;
}
//************************************** FUNCION PARA VALIDAR SI LA GUIA YA FUE CAPTURADA ************************************************
function validarGuiaExistente(guiaCapturada) {
    var ban = false;
    $("#listaGuias li").each(function () {
        var valorFila = $(this).text();
        if (valorFila == guiaCapturada) {

            ban = true;
        } else {

        }
    });
    return ban;
}
//***************************** FUCNCION PARA CONCATENAR LAS GUIAS *********************************************
function concatenarDatosEntregar(valorQuienRecibe, image, txtimgevidencia) {
    var contador = 1;
    var concatenarTracknumber = "";
    //RECORREMOS TODA LA LISTA Y OBTENEMOS SU VALOR Y LO VAMOS CONCATENANDO
    $("#listaGuias li").each(function () {
        var valorLista = $(this).text();
        if ("Guias Capturadas Total:" + contadorGuiasCapturadas != valorLista.trim()) {
            if (contador == 1) {
                concatenarTracknumber = concatenarTracknumber + valorLista;
                contador++;
            } else {
                concatenarTracknumber = concatenarTracknumber + "," + valorLista;
            }
        } else {

        }
    });
    enviarDatos(concatenarTracknumber, valorQuienRecibe, image, txtimgevidencia);
}
//**************************************** FUNCION PARA ENVIAR LOS DATOS A NUESTRO PHP Y REGISTRARLOS EN LA BD ***********************

function enviarDatos(tracknumber, valorQuienRecibe, image, txtimgevidencia) {
    habilitarloading();
    var latitud1 = sessionStorage.getItem("latitud");
    var longitud1 = sessionStorage.getItem("longitud");
    var idUsuarioInicioSesion = sessionStorage.getItem("idusuario");
    var nombreUsuarioInicioSesion = sessionStorage.getItem("nombreuser");

    $.ajax({
        type: "POST",
        url: ip + "registro_entrega1.php",
        data: {tracknumber: tracknumber,
            valorQuienRecibe: valorQuienRecibe,
            image: image,
            nombreUsuarioInicioSesion: nombreUsuarioInicioSesion,
            latitud: latitud1,
            longitud: longitud1,
            txtimgevidencia: txtimgevidencia},
        error: function () {
            inabilitarloading();
            swal("Advertecia!", "Sin conexión al servidor los datos se almacenaron localmente", "warning");   
            var bd = crearBD();
            crearTable(bd);
            registrarDatos(bd, tracknumber, valorQuienRecibe, image, nombreUsuarioInicioSesion, txtimgevidencia);
            js_limpiar_canvas();
            vaciarLista();
            contadorGuiasCapturadas = 0;
            $("#id_textArea").val('');
            $("#txtnombrerecibe").val('');
            $("#cantidadGuiasCapturadas").html(contadorGuiasCapturadas);
            $("#btnCamara").css("display", "none");
            $("#btnCamara").css("border-color", "#dbdbdb");
            $("#id_btnScan").attr("disabled", false);
            $("#id_textArea").attr("disabled", false);
            document.getElementById("txtimgevidencia").value = "";
            document.getElementById('smallImage').src = "";
            var canvas = document.getElementById("flexBox");
            canvas.width = canvas.width;
            document.getElementById("theimage").src = null;
            document.getElementById("largeImage").src = "";
            $("#btnGuardarEntregar").attr("disabled", false);
            intervalo();

        }, success: function (resultado) {

            inabilitarloading();

            var datos = resultado.trim();
            var exito = 'true';
            var ban1 =datos.indexOf("Entregas");
            if(ban1 > -1){
                swal(datos);
                
                setTimeout(function(){
                    location.href = "servicios.html"; 
                }, 7000);
                
            }else{
                swal("Advertencia!", "Error en la conexión", "warning");
            }
            inabilitarloading();
        }
    });
}
//**************************************** FUNCION PARA ENVIAR LOS DATOS A NUESTRO PHP Y REGISTRARLOS EN LA BD ***********************
function  enviarDatosSinRegistrarEnBDInterna(tracknumber, valorQuienRecibe, image, fecha, valorUsuarioCreacion, fotoEvidencia) {

    $.ajax({
        type: "POST",
        url: ip + "registro_entrega2.php",
        data: {tracknumber: tracknumber,
            valorQuienRecibe: valorQuienRecibe,
            image: image,
            fecha: fecha,
            valorUsuarioCreacion: valorUsuarioCreacion,
            fotoEvidencia: fotoEvidencia},
        error: function () {
            swal("Advertecia!", "Sin conexion al servidor, los datos siguen almacenados localmente", "warning");
        }, success: function (resultado) {
            var datos = resultado.trim();
            var exito = 'true';

            if (datos.trim() == exito.trim()) {
                swal("Exito!", "Se registro correctamente la entrega, almacenada localmente", "success");
                var bd = crearBD();
                eliminarRegistrosBD(bd, tracknumber);

            } else if (datos.trim() == '"la guia ya existe en registros fallidos"') {
                var bd = crearBD();
                eliminarRegistrosBD(bd, tracknumber);
            } else if (datos.trim() == '"la guia ya esta registrada"') {
                swal("Advertecia!", "La guia  guardada localmente ya esta registrada", "warning");
                var bd = crearBD();
                eliminarRegistrosBD(bd, tracknumber);
            } else {
                swal("Error!", "No se guardaron los datos,almacenados localmente " + resultado, "error");
            }
            inabilitarloading();
        }
    });
}
//**************************************** FUNCION PARA ENVIAR LOS DATOS A NUESTRO PHP Y REGISTRARLOS EN LA BD

function enviarDatos2(tracknumber, valorQuienRecibe, image, idRegistrosFallidos, usuarioCreacion, longitud, latitud, fotoEvidencia) {
    
    $.ajax({
        type: "POST",
        url: ip + "registrarANDeliminarRegistrosFallidos.php",
        data: {tracknumber: tracknumber,
            valorQuienRecibe: valorQuienRecibe,
            image: image,
            idRegistrosFallidos: idRegistrosFallidos,
            usuarioCreacion: usuarioCreacion,
            longitud: longitud,
            latitud: latitud,
            fotoEvidencia: fotoEvidencia},

        error: function () {
            swal("Error!", "Error con conexion al servidor, No se pudieron registrar los servicios almacenados en registros fallidos", "error");
        }, success: function (resultado) {
            var datos = resultado.trim();
            var exito = 'true';

            if (datos.trim() == exito.trim()) {
                swal("Exito!", "Se registraron los servicios almacenados en registros fallidos", "success");
            } else {

            }
            inabilitarloading();
        }
    });
}

function btnGuardar() {

    $("#btnGuardarEntregar").click(function () {

        if (contadorGuiasCapturadas > 0) {

            var valorQuienRecibe = $("#txtnombrerecibe").val();
            if (valorQuienRecibe.length > 0) {
                $("#btnGuardarEntregar").css("disabled", true);

                var canvas = document.getElementById("flexBox");
                var image = canvas.toDataURL(); 
                var img1 = document.getElementById("theimage").src = image;
                var img2 = document.getElementById('base64').value = image;
                var img = document.getElementById('base64').value;
                
                if (contadorGuiasCapturadas == 1) {
                    var txtimgevidencia = document.getElementById("txtimgevidencia").value;
                    if (txtimgevidencia != '') {
                        $("#btnGuardarEntregar").attr("disabled", true);
                        concatenarDatosEntregar(valorQuienRecibe, image, txtimgevidencia);
                    } else {
                        swal("Advertecia!", "Debe tomar una foto de evidencia", "warning");
                        $("#btnCamara").focus();
                        $("#btnCamara").css("border-color", "red");
                    }
                } else {
                    $("#btnGuardarEntregar").attr("disabled", true);
                    var imageNull = "";
                    concatenarDatosEntregar(valorQuienRecibe, image, imageNull);
                }
            } else {
                $("#txtnombrerecibe").focus();
                swal("Advertecia!", "Debe colocar el nombre de la persona que recibe", "warning");
                $("#txtnombrerecibe").focus();
            }
        } else {
            swal("Advertecia!", "Necesita capturar al menos una guia", "warning");

        }

    });
}

function btnCapturarFirma() {
    
    $("#id_btnScanFirma1").click(function () {
        if (contadorGuiasCapturadas > 0) {
            var valorQuienRecibe = $("#txtnombrerecibe").val();
            if (valorQuienRecibe.length > 0) {
            } else {
                $("#txtnombrerecibe").focus();
                swal("Advertecia!", "Debe colocar el nombre de la persona que recibe", "warning");
                document.location = $("#btnCancelar2").attr("href");
                $("#txtnombrerecibe").focus();
            }
        } else {
            swal("Advertecia!", "Necesita capturar al menos una guia", "warning");
            document.location = $("#btnCancelar2").attr("href");
        }
    });
}

function btnCancelar() {
    
    $("#btnCancelar").click(function () {
        var canvas = document.getElementById("flexBox");
        canvas.width = canvas.width;
        document.getElementById("theimage").src = null;
        document.getElementById("txtnombrerecibe").value = "";
        document.getElementById("id_textArea").value = "";
        document.getElementById("txtnumservicio").value = "";
        document.getElementById("txtnombrerecibe").value = "";
        document.getElementById('base64').value = "";
        removerLista();
        location.href = 'servicios.html';
    });

}

function removerLista() {
    var cantidadFilasLista = $("#listaGuias li").length;
    for (var i = 1; i < cantidadFilasLista; i++) {
        var va = $("#listaGuias li:last").val();
        $("#listaGuias li:last").remove();
        cantidadFilasLista--;
        i--;
    }
}
//**************************************** FUNCION PARA VALIDAR SI LA GUIA CAPTURADA ESTA EN LA TB MOVIMIENTO *************************
function validarTracknumberEnBD(tracknumber) {
    habilitarloading();
    var ban = false;
    $.ajax({
        type: "POST",
        url: ip + "validarTracknumber.php",
        data: {
                tracknumber: tracknumber.trim(),
                versionApp: "MEK V3.2"
              },
        error: function () {
            inabilitarloading();
            swal("Error!", "Error con conexion al servidor", "error");
        },
        success: function (resultado) {
               var arreDatos=resultado.split("-");
               var mensaje=arreDatos[0];
               var remision=arreDatos[1];
          
            inabilitarloading();
            if (resultado.trim() == '"Esta guia esta registrada en fallidos"') {
                swal("Advertecia!", "La guia " + tracknumber + " esta en proceso, para registrarse", "warning");
            } else if (resultado.trim() == '"no existe en movimientos"') {
                swal("Advertecia!", "La guia " + tracknumber + " no existe ", "warning");
            } else if (resultado.trim() == '"no tiene el zzm04"') {
                swal("Advertecia!", "Debe registrar primero el CheckPoint en Ruta de la guia " + tracknumber + " para poder realizar la entrega", "warning");
            } else if (resultado.trim() == '"existe en estatuscheckpoint"') {
                swal("Advertecia!", "Contacte al administrador la guia" + tracknumber + " ya tiene un estatus chekPoint", "warning");
            } else if (resultado.trim() == '"existe en frimaEntrega"') {
                swal("Advertecia!", "Contacte al administrador la guia" + tracknumber + " ya tiene una firma", "warning");
            } else if (mensaje.trim() == '"todo bien') {
                //************************ AQUI ********************************
                var listaConcatenada = concatenar(tracknumber);
                var arreDatos = listaConcatenada.split(",");
                vaciarLista();
                var contador = 1;

                for (var i = 0; i < arreDatos.length; i++) {
                    var valorListaConca = arreDatos[i];
                    if (contador == 3) {
                        $("#listaGuias").append("<li style='display:none' id='" + valorListaConca + "' data-icon='delete'><a href='#' id='" + valorListaConca + "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>" + valorListaConca + "</a></li>");
                    } else {
                        $("#listaGuias").append("<li  id='" + valorListaConca + "' data-icon='delete'><a href='#' id='" + valorListaConca + "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>" + valorListaConca + "</a></li>");
                        valorVecesEntraAjax++;

                    }

                }
                
                $("#id_textArea").val('');
                var totalGuias = obtenerTotalGuiasCapturadas();
                $("#cantidadGuiasCapturadas").html(totalGuias);

                if (contadorGuiasCapturadas > 8) {
                    $("#divInput .ui-input-text ").css("border-color", "blue");
                } else {
                    $("#divInput .ui-input-text").css("border-color", "#c7faf1");
                }

                //el btn camara solo va estar activo para cuado nuestro contador sea 1, que solo se tenga una guia en la lista
                if (contadorGuiasCapturadas > 1) {
                    $("#btnCamara").css("display", "none");
                    document.getElementById("txtimgevidencia").value = "";
                    document.getElementById('smallImage').src = "";
                    $("#btnCamara").css("border-color", "#dbdbdb");
                    document.getElementById('smallImage').src = "";
                    $("#btnCamara").css("border-color", "#dbdbdb");
                } else {
                }
                var remi2=remision.replace('"','');
                
                 /***************MODIFICACIÓN 27/03/2019**************/
                if(contadorGuiasCapturadas<=1){
                    $("#btnCamara").css("display", "block");
                }
                intervalo2();
            } else if (resultado.trim() == '"la guia ya esta registrada en todo"') {
                swal("Advertecia!", "La guia " + tracknumber + " ya esta registrada ", "warning");
            } else {

            }

            $("#id_textArea").val('');

        }

    });


}

//******************** metodo para poder respaldar la informacion no enviada
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
    if (validarInternet()) {
        var bd = crearBD();
        leerTablaBD(bd);
        clearInterval(intervalo);
    } else { 
    }
}

function intervalo() {
    intervalo = setInterval(mensaje, 1000);
}

//********************************************** BASE DE DATOS LOCAL *******************************************    
function crearBD() {
    var bd = window.openDatabase('mydb1', '1.0', 'testdb1', 2 * 1024 * 1024);
    return bd;
}

function crearTable(bd) {
    bd.transaction(function (texto) {
        texto.executeSql('create table if not exists cliente (tracknumber,quienrecibe,firma,usuarioCreacion,fotoEvidencia,fecha)');
    });
}

function registrarDatos(bd, tracknumber, quienRecibe, firma, usuarioCreacion, fotoEvidencia) {
    var fecha = obtenerFechaYhora();
    bd.transaction(function (texto) {
        texto.executeSql('insert into cliente (tracknumber,quienrecibe,firma,usuarioCreacion,fotoEvidencia,fecha) values ("' + tracknumber + '","' + quienRecibe + '","' + firma + '","' + usuarioCreacion + '","' + fotoEvidencia + '","' + fecha + '")');
    });
}

function leerTablaBD(bd) {
    bd.transaction(function (texto) {
        texto.executeSql('select * from cliente', [], function (texto, result) {
            var tamaño = result.rows.length, i;
            var mensaje = "<p> encontramos " + tamaño + " cantidad registros";
            for (var i = 0; i < tamaño; i++) {
                var valorTracknumber = result.rows.item(i).tracknumber;
                if (valorTracknumber.length == 0) {
                    break;
                } else {
                    var valorquienRecibe = result.rows.item(i).quienrecibe;
                    var valorFirma = result.rows.item(i).firma;
                    var valorFecha = result.rows.item(i).fecha;
                    var valorUsuarioCreacion = result.rows.item(i).usuarioCreacion;
                    var valorFotoEvidencia = result.rows.item(i).fotoEvidencia;

                    if (validarInternet()) {
                        enviarDatosSinRegistrarEnBDInterna(valorTracknumber, valorquienRecibe, valorFirma, valorFecha, valorUsuarioCreacion, valorFotoEvidencia);
                    } else {
                    }
                }
            }
        });
    });
}

//****************** CONSULTA ESPECIFICA,VALIDAMOS SI EL TRACKNUMBER YA ESTA REGISTRADO NO VOLVERLO A REGISTRAR ******
function consultaEspecifica(bd, tracknumber, quienRecibe, firma) {
    
    var ban = false;
    bd.transaction(function (texto) {
        texto.executeSql('select * from cliente', [], function (texto, result) {
            var tamaño = result.rows.length, i;
            var mensaje = "<p> encontramos " + tamaño + " cantidad registros";
            for (var i = 0; i < tamaño; i++) {
                var valorTracknumber = result.rows.item(i).tracknumber;
                var arreDatos = valorTracknumber.split(",");
                for (var j = 0; j < arreDatos.length; j++) {
                    var valorArreDatos = arreDatos[j];
                    if (valorArreDatos.trim() == tracknumber.trim()) {
                        ban = true;
                        j = arreDatos.length;
                        i = tamaño;
                    } else {
                    }
                }
            }
            if (ban) {
            } else {
                registrarDatos(bd, tracknumber, quienRecibe, firma);
            }
        });
    });
    
    return ban;
}

function consultaEspecifica2(bd, tracknumber) {

    var ban = false;
    bd.transaction(function (texto) {
        texto.executeSql('select * from cliente', [], function (texto, result) {
            var tamaño = result.rows.length, i;
            var mensaje = "<p> encontramos " + tamaño + " cantidad registros";
            if (tamaño == 0) {
                if (validarGuiaExistente(tracknumber)) {
                    swal("Advertencia", "este num guia " + tracknumber + " ya fue capturada", "warning");
                    $("#id_textArea").val('');
                } else { 
                    llenarListaSinInternet(tracknumber);
                }
            } else {
                for (var i = 0; i < tamaño; i++) {
                    var valorTracknumber = result.rows.item(i).tracknumber;
                    var arreDatos = valorTracknumber.split(",");
                    for (var j = 0; j < arreDatos.length; j++) {
                        var valorArreDatos = arreDatos[j];
                        if (valorArreDatos.trim() == tracknumber.trim()) {
                            ban = true;
                            j = arreDatos.length;
                            i = tamaño;
                            $("#id_textArea").val('');
                            swal("Advertecia!", "La guia " + tracknumber + " esta registrada localmente", "warning");
                            $("#id_textArea").val('');
                            $("# txtnombrerecibe").val('');
                        } else {
                        }
                    }
                }
                if (ban) {
                } else {
                    if (validarGuiaExistente(tracknumber)) {
                        swal("Advertencia", "este num guia " + tracknumber + " ya fue capturada", "warning");
                        $("#id_textArea").val('');
                    } else {
                        llenarListaSinInternet(tracknumber);
                    }
                }
            }
        });
    });
    
    return ban;
}

function consultaEspecifica3(bd, tracknumber) {
        
    var ban = false;
    bd.transaction(function (texto) {
        texto.executeSql('select * from cliente', [], function (texto, result) {
            var tamaño = result.rows.length, i;
            var mensaje = "<p> encontramos " + tamaño + " cantidad registros";
            if (tamaño == 0) {
                validarTracknumberEnBD(tracknumber);
            } else {
                for (var i = 0; i < tamaño; i++) {
                    var valorTracknumber = result.rows.item(i).tracknumber;
                    var arreDatos = valorTracknumber.split(",");
                    for (var j = 0; j < arreDatos.length; j++) {
                        var valorArreDatos = arreDatos[j];
                        if (valorArreDatos.trim() == tracknumber.trim()) {
                            ban = true;
                            j = arreDatos.length;
                            i = tamaño;
                            swal("Advertecia!", "La guia " + tracknumber + " esta registrada localmente", "warning");
                            $("#id_textArea").val('');
                            $("# txtnombrerecibe").val('');
                        } else {
                        }
                    }
                }
                if (ban) {
                } else {
                    if (validarGuiaExistente(tracknumber)) {
                        swal("Advertencia", "este num guia " + tracknumber + " ya fue capturada", "warning");
                        $("#id_textArea").val('');
                    } else {
                        validarTracknumberEnBD(tracknumber);
                    }
                }
            }
        });
    });
    
    return ban;
}

function soloLeerTablaBD(bd) {
    bd.transaction(function (texto) {
        texto.executeSql('select * from cliente', [], function (texto, result) {
            var tamaño = result.rows.length, i;
            var mensaje = "<p> encontramos " + tamaño + " cantidad registros";
            if (tamaño > 0) {
                for (var i = 0; i < tamaño; i++) {
                    var valorTracknumber = result.rows.item(i).tracknumber;
                    if (valorTracknumber.length == 0) {
                        alert("No hay registros");
                        break;
                    } else {
                        var valorquienRecibe = result.rows.item(i).quienrecibe;
                        var valorFirma = result.rows.item(i).firma;
                        var fecha = result.rows.item(i).fecha;
                        alert("valores de la tabla track " + valorTracknumber + "fecha " + fecha + " quienRecibe " + valorquienRecibe + " firma " + valorFirma);
                    }
                }
            } else {
            }

        });
    });
}

function eliminarRegistrosBD(bd, tracknumber) {
    bd.transaction(function (texto) {
        texto.executeSql('delete from cliente where tracknumber="' + tracknumber + '"');
    });
}

//*********************************** FUNCION PARA CHECAR SI EN LA TABLA REGISTROS FALLIDOS HAY ALGUN REGISTRO *******************
function obtenerDatosTbRegistrosFallidos() {
    $.ajax({
        type: "POST",
        url: ip + "buscarRegistrosFallidos.php",
        success: function (resultado) {
            if (resultado == '0') {
            } else {
                var datosBd = JSON.parse(resultado);
                var cantidadDatos = datosBd.servicios_fallidos.length;
                for (var i = 0; i < cantidadDatos; i++) {
                    var idRegistrosFallidos = datosBd.servicios_fallidos[i].idRegistrosFallidos;
                    var tracknumber = datosBd.servicios_fallidos[i].tracknumber;
                    var quienRecibe = datosBd.servicios_fallidos[i].quienRecibe;
                    var firma = datosBd.servicios_fallidos[i].firma;
                    var usuarioCreacion = datosBd.servicios_fallidos[i].usuarioCreacion;
                    var latitud = datosBd.servicios_fallidos[i].latitud;
                    var longitud = datosBd.servicios_fallidos[i].longitud;
                    var fotoEvidencia = datosBd.servicios_fallidos[i].fotoEvidencia;
                    enviarDatos2(tracknumber, quienRecibe, firma, idRegistrosFallidos, usuarioCreacion, longitud, latitud, fotoEvidencia);
                }
            }

        },

    });
}

//******************************* METODOS HABILITAR E INABILITAR LOADING ***************************************
function habilitarloading() {
    document.getElementById("loading").style.display = "block";
}

function inabilitarloading() {
    document.getElementById("loading").style.display = "none";
}

//******************** METODOS DE PRUEBA PARA LISTAR ORDE *********************
function concatenar(numGuia) {
    var concatenarGuias = "";
    var contador = 0;
    $("#listaGuias li").each(function () {
        var valorLista = $(this).text();
        if (valorLista.trim() == "Guias Capturadas Total:" + contadorGuiasCapturadas) {
        } else if (valorLista.trim() == numGuia) {
        } else {
            if (contador == 0) {
                concatenarGuias = concatenarGuias + valorLista;
                contador++;
            } else {
                concatenarGuias = concatenarGuias + "," + valorLista;
            }
        }
    });

    if (numGuia.length == 0) {
    } else {
        if (contador == 0) {
            concatenarGuias = numGuia + concatenarGuias;
        } else {
            concatenarGuias = numGuia + "," + concatenarGuias;
        }
    }

    return concatenarGuias;
}

function vaciarLista() {
    var cantidadLista = $("#listaGuias li").length;
    for (var i = 1; i < cantidadLista; i++) {
        $("#listaGuias li:last").remove();
    }
}

function eliminarElemento(elemento) {
    var id = elemento.id;
    swal({
        title: "¿Esta seguro de eliminar la guia " + id + " de la lista?",

        icon: "info",
        buttons: true,
        dangerMode: true,
    })
            .then((willDelete) => {
                if (willDelete) {
                    $("#"+id).remove();
                     $("#id_btnScan").attr("disabled", false);
                    var totalGuias = descontarTotalGuiasCapturadas();
                    $("#cantidadGuiasCapturadas").html('');
                    $("#cantidadGuiasCapturadas").html(totalGuias);
                    
                    if (contadorGuiasCapturadas == 1) {
                        $("#btnCamara").css("display", "block");
                    } else if (contadorGuiasCapturadas == 0) {
                        $("#btnCamara").css("display", "none");
                        $("#btnCamara").css("border-color", "#dbdbdb");
                        $("#id_btnScan").attr("disabled", false);
                        $("#id_textArea").attr("disabled", false);
                        document.getElementById("txtimgevidencia").value = "";
                        document.getElementById('smallImage').src = "";
                        $("#txtnombrerecibe").val("");
                        var canvas = document.getElementById("flexBox");
                        canvas.width = canvas.width;
                        document.getElementById("theimage").src = null;
                        document.getElementById("largeImage").src = "";
                        bandRemision=0;
                    } else if (contadorGuiasCapturadas == 1){
                        bandRemision=0;
                    }
                    if (totalGuias == 0) {
                    } else {
                        agregarALista(guis);
                    }
                    swal("Se elimino correctamente!", {
                        icon: "success",
                    });
                } else {
                }
            });
}

function agregarALista(numGuia) {
    var listaConcatenada = concatenar(numGuia);
    var arreDatos = listaConcatenada.split(",");
    vaciarLista();
    var contador = 1;

    for (var i = 0; i < arreDatos.length; i++) {
        var valorListaConca = arreDatos[i];
        
        if (contador == 3) {    
            $("#listaGuias").append("<li style='display:none' id='" + valorListaConca + "' data-icon='delete' class='ui-last-child'><a href='#' id='" + valorListaConca + "' onclick=eliminarElemento(this) class='ui-btn ui-btn-icon-right ui-icon-delete'>" + valorListaConca + "</a></li>");
        } else {
            $("#listaGuias").append("<li id='" + valorListaConca + "' data-icon='delete' class='ui-last-child'><a href='#' id='" + valorListaConca + "' onclick=eliminarElemento(this) class='ui-btn ui-btn-icon-right ui-icon-delete'>" + valorListaConca + "</a></li>");
        }

    }

    if (contadorGuiasCapturadas > 8) {
        $("#divInput .ui-input-text ").css("border-color", "blue");
    } else {
        $("#divInput .ui-input-text").css("border-color", "#c7faf1");
    }
}

//********************* function llenar lista sin internet *********************************************************
function llenarListaSinInternet(tracknumber) {
    var listaConcatenada = concatenar(tracknumber);
    var arreDatos = listaConcatenada.split(",");
    vaciarLista();
    var contador = 1;

    for (var i = 0; i < arreDatos.length; i++) {
        var valorListaConca = arreDatos[i];
        if (contador == 3) {
            $("#listaGuias").append("<li style='display:none' id='" + valorListaConca + "' data-icon='delete'><a href='#' id='" + valorListaConca + "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>" + valorListaConca + "</a></li>");
        } else {
            $("#listaGuias").append("<li  id='" + valorListaConca + "' data-icon='delete'><a href='#' id='" + valorListaConca + "'  onclick=eliminarElemento(this)  class='ui-btn ui-btn-icon-right ui-icon-delete'>" + valorListaConca + "</a></li>");
        }
    }
    
    $("#id_textArea").val('');
    var totalGuias = obtenerTotalGuiasCapturadas();
    $("#cantidadGuiasCapturadas").html(totalGuias);
    if (contadorGuiasCapturadas > 8) {
        $("##divInput .ui-input-text").css("border-color", "blue");
    } else {
        $("#divInput .ui-input-text").css("border-color", "#c7faf1");
    }

    //el btn camara solo va estar activo para cuado nuestro contador sea 1, que solo se tenga una guia en la lista
    if (contadorGuiasCapturadas > 1) {
        $("#btnCamara").css("display", "none");
        document.getElementById("txtimgevidencia").value = "";
        document.getElementById('smallImage').src = "";
        $("#btnCamara").css("border-color", "#dbdbdb");
        document.getElementById('smallImage').src = "";
        $("#btnCamara").css("border-color", "#dbdbdb");
    } else {
        $("#btnCamara").css("display", "block");
    }
    intervalo2();
}

//****************** function obtener fecha y hora actual ************************
function obtenerFechaYhora() {
    var hoy = new Date();
    var mesBien = (hoy.getMonth() + 1);
    var diaBien = hoy.getDate();
    var minutosBien = hoy.getMinutes();
    var horaBien = hoy.getHours();
    var segundoBien = hoy.getSeconds();

    if ((hoy.getMonth() + 1) < 10) {
        mesBien = '0' + (hoy.getMonth() + 1);
    } else {
    }
    if (hoy.getDate() < 10) {
        diaBien = '0' + hoy.getDate();
    } else {
    }
    if (hoy.getHours() < 10) {
        horaBien = '0' + hoy.getHours();
    } else {
    }
    if (hoy.getMinutes() < 10) {
        minutosBien = '0' + hoy.getMinutes();
    } else {
    }
    if (hoy.getSeconds() < 10) {
        segundoBien = '0' + hoy.getSeconds();
    } else {
    }
    var fecha = hoy.getFullYear() + "-" + mesBien + "-" + diaBien;
    var hora = horaBien + ":" + minutosBien + ":" + segundoBien;
    var enviarFecha = fecha + " " + hora;
    
    return enviarFecha;
}

function quitarBordeBtnCamara() {
    if (contadorGuiasCapturadas == 1) {
        var txtimgevidencia = document.getElementById("txtimgevidencia").value;
        if (txtimgevidencia.length != '') {
            $("#btnCamara").css("border-color", "#dbdbdb");
            //$("#id_btnScan").attr("disabled", true);
            $("#id_textArea").attr("disabled", true);
            clearInterval(intervalo2);
        } else {
        }
    } else {
        clearInterval(intervalo2);
    }
}
//************** valida que el usuario ya alla tomado una foto *****************************
function intervalo2() {
    setInterval(quitarBordeBtnCamara, 1000);
}

var mostrarMensaje=false;