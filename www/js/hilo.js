//var ip = "http://173.199.123.51:83/androidwebserviceMEKBetaTESTING/"; //restore 2019
//var ip="http://187.191.44.202:81/androidwebserviceMEKBeta/";//servidor 2019
//var ip="http://173.199.123.51:83/androidwebserviceMEKBeta/";//servidor 2020
//var ip="http://192.168.1.173:81/androidwebserviceMEKBeta-remision/";//localhost
//var ip="http://192.168.0.9/androidwebserviceMEKBeta/"; //MY HOME
//var ip="http://34.235.249.54:83/androidwebserviceMEKBeta/"; //servidor 2021
//var ip = "http://34.235.249.54:83/androidwebserviceMEKBetaTESTING/"; //restore2021
var ip="http://187.191.44.202:83/androidwebserviceMEKBeta/"; //servidor NOV-2021

function mensaje_hilo() {
    var bd = crearBD_hilo();
    leerTablaBD_hilo(bd);
    var bdr = crearBD_Express();
    leerTablaBD_Express(bdr);
    clearInterval(intervalo);
}

function intervalo_hilo() {
    intervalo = setInterval(mensaje_hilo(), 1000);
}
function crearBD_hilo() {
    var bd = window.openDatabase('mydb1', '1.0', 'testdb1', 2 * 1024 * 1024);
    return bd;
}
function leerTablaBD_hilo(bd) {
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
                    
                    if (validarInternet_hilo()) {
                        enviarDatosSinRegistrarEnBDInterna_hilo(valorTracknumber, valorquienRecibe, valorFirma, valorFecha, valorUsuarioCreacion, valorFotoEvidencia);
                    } else {
                    }
                }
            }
        });
    });
}

function  enviarDatosSinRegistrarEnBDInterna_hilo(tracknumber, valorQuienRecibe, image, fecha, valorUsuarioCreacion, fotoEvidencia) {
    
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
            var ban1 =datos.indexOf("Entregas");
            if(ban1 > -1){
                swal(datos);
                var bd = crearBD_hilo();
                eliminarRegistrosBD_hilo(bd, tracknumber);
                js_limpiar_canvas(); 
            }else{
                swal("Advertencia!", "Error en la conexión: "+ban1, "warning");
            }
            
            inabilitarloading_hilo();
        }
    });
}

function eliminarRegistrosBD_hilo(bd, tracknumber) {
    bd.transaction(function (texto) {
        texto.executeSql('delete from cliente where tracknumber="' + tracknumber + '"');
    });
}
function inabilitarloading_hilo() {
    document.getElementById("loading").style.display = "none";
}

function validarInternet_hilo() {
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

function crearBD_Express() {
    var bdr=window.openDatabase('mydb7','1.0','testdb7',2*1024*1024);
    return bdr;
}

function leerTablaBD_Express(bd) {
    bd.transaction(function (texto) {
        texto.executeSql('select * from seguimientoRutaExpress', [], function (texto, result) {
            var tamaño = result.rows.length, i;
            var mensaje = "<p> encontramos " + tamaño + " cantidad registros";
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
                    
                    if(validarInternet_hilo){  enviarDatosLocales(valorTracknumber,valorEstatusCheck,tipoEvidencia,firma,valorUsuarioCreacion,valorIdUduario,valorFecha);
                    }else{
                    }
                }
            }
        });
    });
}

function enviarDatosLocales(valorTracknumber,valorEstatusCheck,tipoEvidencia,firma,valorUsuarioCreacion,valorIdUduario,valorFecha){
    var latitud="";
    var longitud="";
            $.ajax({
                type: "POST",
                url: ip + "cambiar_estatus_servicio2.php",
                data: {tracknumber: valorTracknumber,
                        valorQuienRecibe: tipoEvidencia,
                        image: firma,
                        idUsuario: valorIdUduario,
                        latitud: latitud,
                        longitud: longitud
                      },
                error: function () {
                    swal("Advertecia!", "Sin conexion al servidor, los datos siguen almacenados localmente", "warning");      
                }, success: function (resultado) {
                    inabilitarloading();
                    swal("Exito!","Se registro correctamente el CheckPoint de la guia: "+valorTracknumber, "success");
                    var bdr = crearBD_Express();
                    eliminarRegistrosBD_Express(bdr, valorTracknumber);
                    /*var latini = sessionStorage.getItem("latitud");
                    var longini = sessionStorage.getItem("longitud");
                    setTimeout( function() {
                        location.href="servicios.html";        
                    }, 2000);*/
                }
            });
}

function eliminarRegistrosBD_Express(bd, tracknumber) {
    bd.transaction(function (texto) {
        texto.executeSql('delete from seguimientoRutaExpress where tracknumber="' + tracknumber + '"');
    });
}