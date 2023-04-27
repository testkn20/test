//sessionStorage.setItem("urlconex", "http://187.191.44.202:81/androidwebserviceMEKBeta/"); //SERVIDOR 2019
//sessionStorage.setItem("urlconex", "http://173.199.123.51:83/androidwebserviceMEKBeta/"); //SERVIDOR 2020
//sessionStorage.setItem("urlconex", "http://173.199.123.51:83/androidwebserviceMEKBetaTESTING/"); //restore 2019
//sessionStorage.setItem("urlconex", "http://192.168.1.173:81/androidwebserviceMEKBeta-remision/"); //local
//sessionStorage.setItem("urlconex", "http://192.168.1.183/androidwebserviceMEKBeta-remision/"); //apunta lenovo
//sessionStorage.setItem("urlconex", "http://192.168.100.6/androidwebserviceMEKBeta/"); //MY HOME
//sessionStorage.setItem("urlconex", "http://34.235.249.54:83/androidwebserviceMEKBeta/"); //SERVIDOR 2021
//sessionStorage.setItem("urlconex", "http://34.235.249.54:83/androidwebserviceMEKBetaTESTING/"); //RESTORE 2021
sessionStorage.setItem("urlconex", "http://187.191.44.202:83/androidwebserviceMEKBeta/"); //SERVIDOR NOV-2021
 
function push(){
    
     
}

//$(document).ready(function () {
    //var bd = crearBDlogeo();
    //crearTablelogeo(bd);
//});



//inicio de sesion real
function iniciarSesion(){ 
    permisoCamara();
    habilitarloading();
                    sessionStorage.setItem("imei","");
                    document.addEventListener('deviceready', function () {
                        
                        window.plugins.OneSignal.getIds( function ( ids ) {
                             
                            var ed = ids.userId;
                            sessionStorage.setItem("idCelular",ids.userId);
                            var urlconex = sessionStorage.getItem("urlconex");
                            var usuario=$("#textUsuario").val();
                            var contra=$("#passUsuario").val(); 
                            var imei=sessionStorage.getItem("imei").trim();
                            var clave=sessionStorage.getItem("idCelular");
                            var versionApp='3.6.1';
                            dataString="correo="+usuario+"&contra="+contra+"&imei="+sessionStorage.getItem("imei")+"&clave="+sessionStorage.getItem("idCelular")+"&versionApp="+versionApp;
                            
                            if($.trim(usuario).length>0 & $.trim(contra).length>0){
                                
                                $.ajax({
                                    type : "GET",
                                    url : urlconex+"logeoPedido.php?"+dataString,                                  
                                    error : function() {                                                   
                                        inabilitarloading();
                                        swal("Error!", "Error con conexion al servidor.", "error");
                                    },
                                    success: function(data) {
                                        var dato=data;
                                        dato=dato.trim();//quitamos espacios en blanco 
                                        var cortar = dato.split("-");
                                        var estatuss=cortar[0];
                                        var idusuario=cortar[1];            
                                        var nombreuser=cortar[2];
                                        sessionStorage.setItem("idusuario", idusuario);            
                                        sessionStorage.setItem("nombreuser", nombreuser);
                                        if(estatuss=="ok"){
                                            //alert("entra ok");
                                            //var estatusBD = cortar[3];
                                            BackgroundGeolocation.start();
                                            var estatusBD = "1";
                                            sessionStorage.setItem("estatusSession", estatusBD);
                                            sessionStorage.setItem("entraAPagina", "");
                                            push();  
                                            //Obtiene la geolocalizacion del usuario y lo deja entrar hasta que sean valores diferentes a NULL
                                            navigator.geolocation.getCurrentPosition(onSuccess, onError); 
                                            var bandUbicacion = 0;
                                            var intervaloPosicion = setInterval(function(){
                                                var lat = sessionStorage.getItem("latitud");
                                                var long = sessionStorage.getItem("longitud");
                                                if (lat==null && long==null) {
                                                    if(bandUbicacion==5){
                                                      swal("Advertecia!","Por Favor, enciende GPS", "warning"); 
                                                      clearInterval(intervaloPosicion);
                                                      bandUbicacion = 0;
                                                      inabilitarloading();
                                                    }
                                                     navigator.geolocation.getCurrentPosition(onSuccess, onError);    
                                                 }else{
                                                    sinLogeoRegistro(sessionStorage.getItem("imei"),estatusBD,idusuario,nombreuser);
                                                    clearInterval(intervaloPosicion);
                                                    location.href="servicios.html"; 
                                                 }
                                                bandUbicacion = bandUbicacion+1;
                                            }, 500);
                                        }else{
                                            if(nombreuser=="no"){
                                                inabilitarloading();
                                                swal("Advertencia!", "El usuario o el password son incorrectos", "warning");
                                                    document.getElementById("textUsuario").focus();
                                            }else{
                                                if(nombreuser=="denied"){
                                                    inabilitarloading();
                                                    swal("Advertecia!","Hay una sesión activa con el Usuario: "+usuario+" en otro dispositivo", "warning"); 
                                                     document.getElementById("textUsuario").focus(); 
                                                }else{
                                                }
                                            }
                                        }
                                        
                                        document.getElementById("textUsuario").value="";
                                        document.getElementById("passUsuario").value="";
                                    }
                                });
                            }else{ 
                                inabilitarloading();
                                swal("Advertecia!","El usuario o el password no deben ir vacios", "warning"); 
                                    document.getElementById("textUsuario").focus();
                            }
                        });
                    }, false);
}


//inicio de sesion para las pruebas
/*function iniciarSesion(){ 
    habilitarloading();
    var deviceID = device.uuid; 
    var seri = device.serial;
    var model = device.model;
    var version = device.version;
    //alert(model);
    //alert(version);
    //alert(deviceID); 
    //alert(sessionStorage.getItem("imei"));
         
    //alert("got imei: " + imei);
    //sessionStorage.setItem("imei","359944077595524");
    //sessionStorage.setItem("imei","352171100568669");//aldo
    sessionStorage.setItem("imei","352171100568669");//danni
    //sessionStorage.setItem("imei","869401020141263");
    document.addEventListener('deviceready', function () {
        // Enable to debug issues.
        // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});


        //"d347aca2-724b-4b2a-b925-f44f6acddd08"
        // Call syncHashedEmail anywhere in your app if you have the user's email.
        // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
        // window.plugins.OneSignal.syncHashedEmail(userEmail);


        sessionStorage.setItem("idCelular","30220000-bcfa-4a63-9f9e-d57319760076");
        var urlconex = sessionStorage.getItem("urlconex");
        var usuario=$("#textUsuario").val();
        var contra=$("#passUsuario").val(); 
        var dataString="correo="+usuario+"&contra="+contra+"&imei="+sessionStorage.getItem("imei").trim()+"&clave="+sessionStorage.getItem("idCelular")+"&versionApp=3.5.8";
        if($.trim(usuario).length>0 & $.trim(contra).length>0){
            $.ajax({
                type : "GET",
                url : urlconex+"logeoPedido.php?"+dataString,		        
                error : function() {            
                    navigator.notification.alert('Error con conexion al servidor',function(){
                        inabilitarloading();
                    },'Error','Aceptar');
                },
                success: function(data) {
                    var dato=data;
                    dato=dato.trim();//quitamos espacios en blanco  
                    //alert("dat "+dato);
                    var cortar = dato.split("-");
                    var estatuss=cortar[0];
                    var idusuario=cortar[1];            
                    var nombreuser=cortar[2];                                        
                    sessionStorage.setItem("idusuario", idusuario);            
                    sessionStorage.setItem("nombreuser", nombreuser); 
                    //alert("dato de login: "+dato);
                    if(estatuss=="ok"){ 
                        //var estatusBD = cortar[3];
                        var estatusBD = "1";
                        sessionStorage.setItem("estatusSession", estatusBD);
                        //alert("Login-objSession: " + estatusBD);
                        sessionStorage.setItem("entraAPagina", "");     
                        sinLogeoRegistro(sessionStorage.getItem("imei"),estatusBD,idusuario,nombreuser);
                        push();
                        //navigator.notification.alert('Accesando al sistema',function(){},'OK','Aceptar');
                        location.href="servicios.html";                
                    }else{
                        if(nombreuser=="no"){
                            navigator.notification.alert('El usuario o el password son incorrectos',function(){
                                inabilitarloading();
                                document.getElementById("textUsuario").focus();                    
                            },'Error','Aceptar');
                        }else{
                            if(nombreuser=="denied"){
                                navigator.notification.alert('Hay una sesión activa con el Usuario: "'+usuario+'" en otro dispositivo',function(){
                                    inabilitarloading();
                                    document.getElementById("textUsuario").focus();                    
                                },'Error','Aceptar');
                            }
                        }
                    }
                    document.getElementById("textUsuario").value="";
                    document.getElementById("passUsuario").value="";
                    //navigator.geolocation.getCurrentPosition(onSuccess, onError);  //obtiene la ubicacion
                }
            });
        }else{     
            navigator.notification.alert('El usuario o el password no deben ir vacios',function(){
                inabilitarloading();
                document.getElementById("textUsuario").focus();          
            },'Error','Aceptar');
        }
    }, false);                     
}*/



function permisoCamara(){
    var permissions = cordova.plugins.permissions;
    permissions.checkPermission(permissions.CAMERA, function( status ){
        if ( status.hasPermission ) {
            permissions.checkPermission(permissions.WRITE_EXTERNAL_STORAGE, function( status ){
                if ( status.hasPermission ) {
                }else{
                    permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, successPhoneStorage,errorPhoneStorage);
                }
            });
        }else {
            permissions.requestPermission(permissions.CAMERA, successPhoneCamara, errorPhoneCamara);
        }
    });
}
                                
function errorPhoneCamara() {
    alert('Favor de Otorgar Permisos de "Camara" a la Aplicación');
}
 
function successPhoneCamara( status ) {
    if( !status.hasPermission ) errorPhoneCamara();
}

function errorPhoneStorage() {
    alert('Favor de Otorgar Permisos de "Almacenamiento" a la Aplicación');
} 
 
function successPhoneStorage( status ) {
    if( !status.hasPermission ) errorPhoneStorage();
}
function descargarVersion(){
    var url="https://us.123rf.com/450wm/naddya/naddya1507/naddya150700026/43367609-ilustraci%C3%B3n-vectorial-de-una-casa-de-dibujos-animados-aislado-en-un-fondo-blanco-.jpg?ver=6";
    
}


function errorPhone() {
    swal("Advertecia!","Favor de Otorgar Permisos de Telefono a la Aplicación", "warning"); 
    inabilitarloading();
}
 
function successPhone( status ) {
    if( !status.hasPermission ) errorPhone();
    else iniciarSesion();
}

function habilitarloading(){
    document.getElementById("loading").style.display="block";
}
function inabilitarloading(){
    document.getElementById("loading").style.display="none"; 
}

// funcion real
function cerrarSession(){
    //var urlconex = sessionStorage.getItem("urlconex");
    //var aux=sessionStorage.getItem("idusuario");
    //$.ajax({
		//type : "GET",
		//url : urlconex+"cerrarSesion.php?id="+aux,		        
        //success: function(data) {  
            //sessionStorage.setItem("idusuario", "");
            //location.href="login.html";   
        //}
	//});
    BackgroundGeolocation.stop();
    sessionStorage.setItem("idusuario", "");            
    sessionStorage.setItem("nombreuser", "");
    eliminarLogeo();  
    sessionStorage.setItem("estatusSession", "");
    location.href="login.html";
}

//funcion prueba
/*function cerrarSession(){
    sessionStorage.setItem("idusuario", "");            
    sessionStorage.setItem("nombreuser", "");
    eliminarLogeo();  
    sessionStorage.setItem("estatusSession", "");
    location.href="login.html";
}*/

//OBTENER UBICACIONES    
var x = setInterval(function() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
}, 5000); 
  

var onSuccess = function(position) {
    var urlconex = sessionStorage.getItem("urlconex");
    var idafiliado = sessionStorage.getItem("idusuario");  
    var lati = position.coords.latitude;
    var long = position.coords.longitude;
    if(lati!=null && long!=null){
        sessionStorage.setItem("latitudAnterior",sessionStorage.getItem("latitud"));
        sessionStorage.setItem("longitudAnterior",sessionStorage.getItem("longitud"));
        sessionStorage.setItem("latitud", position.coords.latitude);
        sessionStorage.setItem("longitud", position.coords.longitude);
        
        var dataString="idafiliado="+idafiliado+"&lat="+position.coords.latitude+"&long="+position.coords.longitude+"";

        $.ajax({
            type : "GET",
            url : urlconex+"actualizar_localizacion.php?"+dataString,		        
            error : function() {
            },
            success: function(data) {                              
            }
        });   
    }else{
        swal("Advertecia!","Por Favor, enciende GPS para Continuar...", "warning"); 
    }
};

function onError(error) {
    /*alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');*/
}


//FUNCIONES AGREGADAS PARA OBTENER UBICACION EN SEGUNDO PLANO
//el parametro "debug" es que realiza sonido cada que cambia la posicion
function onDeviceReady() {
    var urlconex = sessionStorage.getItem("urlconex");
    var idafiliado = sessionStorage.getItem("idusuario");  
    var lati = sessionStorage.getItem("latitud");
    var long = sessionStorage.getItem("longitud");
    var dataString="idafiliado="+idafiliado+"&lat="+lati+"&long="+long+"";
  BackgroundGeolocation.configure({
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50, 
    notificationTitle: 'Geolocalización',
    notificationText: 'Geolocalización Activa',
    debug: false,
    stopOnTerminate: false,
    interval: 20000,
    fastestInterval: 20000, 
    activitiesInterval: 20000,
    url: urlconex+"actualizar_localizacion.php?"+dataString,
    // customize post properties
    postTemplate: {
      lat: '@latitude',
      lon: '@longitude',
      foo: 'bar' // you can also add your own properties
    }
  });
 
  BackgroundGeolocation.on('location', function(location) {
      sessionStorage.setItem("latitudAnterior",sessionStorage.getItem("latitud"));
        sessionStorage.setItem("longitudAnterior",sessionStorage.getItem("longitud"));
        sessionStorage.setItem("latitud", location.coords.latitude);
        sessionStorage.setItem("longitud", location.coords.longitude);
      
    // handle your locations here
    // to perform long running operation on iOS
    // you need to create background task
    BackgroundGeolocation.startTask(function(taskKey) {
      // execute long running task
      // eg. ajax post location
      // IMPORTANT: task has to be ended by endTask
      BackgroundGeolocation.endTask(taskKey);
    });
  });
 
  BackgroundGeolocation.on('stationary', function(stationaryLocation) {
    // handle stationary locations here
  });
 
  BackgroundGeolocation.on('error', function(error) {
    console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
  });
 
  BackgroundGeolocation.on('start', function() {
    console.log('[INFO] BackgroundGeolocation service has been started');
  });
 
  BackgroundGeolocation.on('stop', function() {
    console.log('[INFO] BackgroundGeolocation service has been stopped');
      BackgroundGeolocation.configure({ debug: false }); 
      BackgroundGeolocation.configure({ stopOnTerminate: true });
      BackgroundGeolocation.setState({ isRunning: false });
      BackgroundGeolocation.finish();
  });
 
  BackgroundGeolocation.on('authorization', function(status) {
    console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
    if (status !== BackgroundGeolocation.AUTHORIZED) {
      // we need to set delay or otherwise alert may not be shown
      setTimeout(function() {
        var showSettings = confirm('App requires location tracking permission. Would you like to open app settings?');
        if (showSetting) {
          return BackgroundGeolocation.showAppSettings();
        }
      }, 20000);
    }
  });
 
  BackgroundGeolocation.on('background', function() {
    console.log('[INFO] App is in background');
    // you can also reconfigure service (changes will be applied immediately)
    BackgroundGeolocation.configure({ debug: false });
  });
 
  BackgroundGeolocation.on('foreground', function() {
    console.log('[INFO] App is in foreground');
    BackgroundGeolocation.configure({ debug: false });
  });
 
  BackgroundGeolocation.on('abort_requested', function() {
    console.log('[INFO] Server responded with 285 Updates Not Required');
 
    // Here we can decide whether we want stop the updates or not.
    // If you've configured the server to return 285, then it means the server does not require further update.
    // So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
    // But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
  });
 
  BackgroundGeolocation.on('http_authorization', () => {
    console.log('[INFO] App needs to authorize the http requests');
  });
 
 /* BackgroundGeolocation.checkStatus(function(status) {
      alert(status.isRunning);
    console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);
 
    // you don't need to check status before start (this is just the example)
    if (!status.isRunning) {
      BackgroundGeolocation.start(); //triggers start on start event
    }
  });*/
 
  // you can also just start without checking for status
  // BackgroundGeolocation.start();
 
  // Don't forget to remove listeners at some point!
  // BackgroundGeolocation.removeAllListeners();
}
 
document.addEventListener('deviceready', onDeviceReady, false);


    var flipSwitch_Estatus = "";

    function evento_flipSwitchEstatus(){
        //$("#flip_Estatus").on('change', function (event) {
        ////alert("flipSwitch_Estatus: "+flipSwitch_Estatus);        
        //alert("entra al evento");
        var entraAPagina = sessionStorage.getItem("entraAPagina");
        //alert("entraAPagina: " + entraAPagina + " flipSwitch_Estatus: "+flipSwitch_Estatus+ " estatus: "+document.getElementById("flip_Estatus").value);                
        if(document.getElementById("flip_Estatus").value == "off" && flipSwitch_Estatus == ""){
            flipSwitch_Estatus = "off";
            $("#flip_Estatus").val("on").flipswitch("refresh");
        }else if(document.getElementById("flip_Estatus").value == "on" && flipSwitch_Estatus != "off" && entraAPagina != "1"){
            document.getElementById("lblEstatus").innerHTML = "Disponible";
            cambiaEstatusSesion("Disponible");
            flipSwitch_Estatus = "";
        }else if(document.getElementById("flip_Estatus").value == "off" && flipSwitch_Estatus == "apagado"){
            flipSwitch_Estatus = "";
        }
        if(entraAPagina == "1"){
            sessionStorage.setItem("entraAPagina", ""); 
            //alert("limpia variable session entraAPagina");
        }
        if(flipSwitch_Estatus == "off"){
            swal({
                title: "Confirmaci\u00F3n",
                text: "Cambiar su estatus a \"No Disponible\" ?",
                icon: "warning",
                buttons: {
                    cancel: {
                    text: "Cancelar",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true, },
                    confirm: {
                    text: "Aceptar",
                    value: true,
                    visible: true,
                    className: "",
                    closeModal: true
                    }
                }
                })
                .then((confirma) => {
                  if (confirma) {
                    document.getElementById("lblEstatus").innerHTML = "No Disponible";
                    cambiaEstatusSesion("NoDisponible");
                    flipSwitch_Estatus = "apagado";
                    $("#flip_Estatus").val("off").flipswitch("refresh");
                  } else {
                    flipSwitch_Estatus = "";
                    document.getElementById("lblEstatus").innerHTML = "Disponible";
                    $("#flip_Estatus").val("on").flipswitch("refresh");
                  }
                });            
        }
        //});   */
    } 
    
    function cambiaEstatusSesion(psEstatus){
        //alert("psEstatus: " + psEstatus);
        var urlconex = sessionStorage.getItem("urlconex");
        var idUsuarioInicioSesion = sessionStorage.getItem("idusuario");
        var nombreUsuarioInicioSesion = sessionStorage.getItem("nombreuser");
        var estatus = 0;
        if(psEstatus == "Disponible"){
            estatus = 1;
        }else{
            estatus = 0;
        }
        //alert("IdUsu: " +idUsuarioInicioSesion + " estatus: "+ estatus);
        dataString = "idUsuario="+idUsuarioInicioSesion+"&estatus="+estatus;
        $.ajax({
            type : "GET",
            url : urlconex+"cambiaEstatusSesion.php?"+dataString,
            error : function() {
                inabilitarloading();
                swal("Error!", "Error con conexion al servidor", "error");
            },
            success: function(resultado){
                //alert(resultado + ""); 
                var dato = resultado; 
                dato = dato.trim();//quitamos espacios en blanco 
                var cad = dato.split(",");
                var respuesta = cad[0];
                //alert(respuesta);
                if(psEstatus == "Disponible"){
                    sessionStorage.setItem("estatusSession", "1");//Variable de tipo Session para el estatus
                    actualizarLogeo("1");
                    swal({
                      title: "Estatus actual: Disponible",
                      text: "Has cambiado tu estatus",
                      icon: "success",
                      button: "Aceptar",
                    });
                }else{
                    sessionStorage.setItem("estatusSession", "0");//Variable de tipo Session para el estatus
                    actualizarLogeo("0");
                    swal({
                      title: "Estatus actual: No Disponible",
                      text: "Has cambido tu estatus",
                      icon: "warning",
                      button: "Aceptar",
                    });
                }
            }
        });
    }




function sinLogeoRegistro(imei,estatus,idUsuario,nombUsuario){
   var bd=crearBDlogeo();
    insertarTablalogeo(bd,imei,estatus,idUsuario,nombUsuario);
}


function crearBDlogeo(){
   
    var bd=window.openDatabase('mydb4','1.0','testdb4',2*1024*1024);
    
    return bd;
}
    
function crearTablelogeo(bd){
// alert("crear tabla");
    //-->
        bd.transaction(function(texto){
            texto.executeSql('create table if not exists usuarioLogeo (idUsuario,nombreUsuario,imei,estatus,fechaSesion)');
        });
 }

function insertarTablalogeo(bd,imei,estatus,idUsuario,nombUsuario){
    //estatus: se refiere al campo de disponibilidad de la tabla tc_afiliados
    var fec = obtenerFecha();
    bd.transaction(function(texto){
        texto.executeSql('insert into usuarioLogeo (idUsuario,nombreUsuario,imei,estatus,fechaSesion) values ("'+idUsuario+'","'+nombUsuario+'","'+imei+'","'+estatus+'","'+fec+'")');
        
    });
}

function obtenerFecha(){
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
  
    
    var enviarFecha=fecha;
    //alert("enviar fecha " + enviarFecha);
    
    return enviarFecha;
}

function eliminarLogeo() {
     //alert("eliminar registro");
    var bd=crearBDlogeo();
    bd.transaction(function (texto) {

        texto.executeSql('delete from usuarioLogeo');

    });

}

function actualizarLogeo(estatus){
    //alert("actualiza local");
    var bd=crearBDlogeo();
    bd.transaction(function(texto){
        texto.executeSql('update usuarioLogeo set estatus="'+estatus+'"');
    });
}

function validarInternet_login() {
        var ban = false;
        var networkState = navigator.connection.type;
        var states = {};
        //alert("1");
        states[Connection.UNKNOWN] = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI] = 'WiFi connection';
        states[Connection.CELL_2G] = 'Cell 2G connection';
        states[Connection.CELL_3G] = 'Cell 3G connection';
        states[Connection.CELL_4G] = 'Cell 4G connection';
        states[Connection.CELL] = 'Cell generic connection';
        states[Connection.NONE] = 'No network connection';
        //alert("2");
        if (states[networkState] == 'No network connection' || states[networkState] == 'Unknown connection') {
        } else {
            ban = true;
        }
        //alert("3");
        return ban;
    }

function sinLogeo(){    
    var bd=crearBDlogeo();
    crearTablelogeo(bd);
       bd.transaction(function(texto){
       texto.executeSql('select * from usuarioLogeo',[],function(texto,result){
           //alert("se ejecuto el select * from usuarioLogeo");
           var tamaño=result.rows.length;
           var estatus = "-1";
           var fec;
           var idUser = "";
           var nombUser = "";
           if(tamaño>0){
               var fecHoy = obtenerFecha();
               for(var i=0;i<tamaño;i++){
                   estatus=result.rows.item(i).estatus;
                   fec=result.rows.item(i).fechaSesion;
                   idUser=result.rows.item(i).idUsuario;
                   nombUser=result.rows.item(i).nombreUsuario;
               }
           }        
        if (estatus !== "-1"){
           if(fec === fecHoy || fec != fecHoy){ 
               navigator.geolocation.getCurrentPosition(onSuccess, onError);
               sessionStorage.setItem("idusuario", idUser);            
               sessionStorage.setItem("nombreuser", nombUser);
               sessionStorage.setItem("estatusSession", estatus);               
               /*setTimeout(function(){
                   location.href = "servicios.html"; 
               },3800);*/
               document.addEventListener('deviceready', function () {
                   if (validarInternet_login()) {
                       var intervaloPosicion = setInterval(function(){
                           var lat = sessionStorage.getItem("latitud");
                           var long = sessionStorage.getItem("longitud");
                           if (lat==null && long==null) {
                                navigator.geolocation.getCurrentPosition(onSuccess, onError); 
                            }else{
                                clearInterval(intervaloPosicion);
                                location.href = "servicios.html"; 
                            }
                        }, 500);
                   } else {
                       //alert("sin internet"); 
                       sessionStorage.setItem("latitud","0");
                       sessionStorage.setItem("longitud","0");
                       clearInterval(intervaloPosicion);
                       location.href = "servicios.html"; 
                   }
               }, false);
           }else{
            sessionStorage.setItem("idusuario", "");            
            sessionStorage.setItem("nombreuser", "");
            eliminarLogeo();
            $('body').loadingModal('destroy');
           }
        }else{
            $('body').loadingModal('destroy'); 
        }
    //$('body').loadingModal('destroy');
    });
});
}
