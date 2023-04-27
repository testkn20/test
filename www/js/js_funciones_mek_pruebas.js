//sessionStorage.setItem("urlconex", "http://187.191.44.202:81/androidwebserviceMEKBeta/"); //SERVIDOR 2019
sessionStorage.setItem("urlconex", "http://187.191.44.202:83/androidwebserviceMEKBeta/"); //SERVIDOR 2020
//sessionStorage.setItem("urlconex", "http://192.168.1.173:81/androidwebserviceMEKBeta-remision/"); //local

 
function push(){
    
     
}

/* //inicio de sesion real
function iniciarSesion(){ 
    permisoCamara();
    habilitarloading();
    var permissions = cordova.plugins.permissions;
    permissions.checkPermission(permissions.READ_PHONE_STATE, function( status ){
        if ( status.hasPermission ) { 
            var deviceID = device.uuid; 
            var seri = device.serial;
            var model = device.model;
            var version = device.version;
            window.plugins.imei.get( 
                function(imei) {
                    sessionStorage.setItem("imei",imei);
                    document.addEventListener('deviceready', function () {

                        var notificationOpenedCallback = function(jsonData) {
                            console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                        };

                        window.plugins.OneSignal.startInit("8ca70fb8-61a0-4584-a303-86bc8de3c8de")
                        .handleNotificationOpened(notificationOpenedCallback).endInit(); 
                        window.plugins.OneSignal.getIds( function ( ids ) {
                             
                            var ed = ids.userId;
                            sessionStorage.setItem("idCelular",ids.userId);
                            var urlconex = sessionStorage.getItem("urlconex");
                            var usuario=$("#textUsuario").val();
                            var contra=$("#passUsuario").val(); 
                            var imei=sessionStorage.getItem("imei");
                            var  clave=sessionStorage.getItem("idCelular");
                            var versionApp='3.5.1';
                            dataString="correo="+usuario+"&contra="+contra+"&imei="+sessionStorage.getItem("imei")+"&clave="+sessionStorage.getItem("idCelular")+"&versionApp="+versionApp;
                            
                            if($.trim(usuario).length>0 & $.trim(contra).length>0){     
                                $.ajax({
                                    type : "GET",
                                    url : urlconex+"logeoPedido.php?"+dataString,
                                  
                                    error : function() {            
                                       
                                          inabilitarloading();
                                        swal("Error!", "Error con conexion al servidor", "error");
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
                                            push();
                                            location.href="servicios.html";                
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
                },
                function() {
                }
             );
        }else {
            permissions.requestPermission(permissions.READ_PHONE_STATE, successPhone, errorPhone);
        }
    });
}*/

 //inicio de sesion para las pruebas
function iniciarSesion(){ 
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
    //sessionStorage.setItem("imei","352171100568669");
    sessionStorage.setItem("imei","359944077595524");//aldo
    //sessionStorage.setItem("imei","869401020141263");
    document.addEventListener('deviceready', function () {
        // Enable to debug issues.
        // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});


        //"d347aca2-724b-4b2a-b925-f44f6acddd08"
        // Call syncHashedEmail anywhere in your app if you have the user's email.
        // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
        // window.plugins.OneSignal.syncHashedEmail(userEmail);


        sessionStorage.setItem("idCelular","aaa");
        var urlconex = sessionStorage.getItem("urlconex");
        var usuario=$("#textUsuario").val();
        var contra=$("#passUsuario").val(); 
        var dataString="correo="+usuario+"&contra="+contra+"&imei="+sessionStorage.getItem("imei")+"&clave="+sessionStorage.getItem("idCelular")+"&versionApp=3.5.1";
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
                    sessionStorage.setItem("estatusSession", "1");
                    sessionStorage.setItem("entraAPagina", "1");
                    if(estatuss=="ok"){                
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
}

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

function cerrarSession(){
    var urlconex = sessionStorage.getItem("urlconex");
    var aux=sessionStorage.getItem("idusuario");
    $.ajax({
		type : "GET",
		url : urlconex+"cerrarSesion.php?id="+aux,		        
        success: function(data) {  
            sessionStorage.setItem("idusuario", "");  
            location.href="login.html";   
        }
	}); 
}

//OBTENER UBICACIONES    
var x = setInterval(function() {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);         
}, 8000); 
  

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
        swal("Advertecia!","SPor Favor, enciende GPS para Continuar...", "warning"); 
    }
};

function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}  


