/*
 * Please see the included README.md file for license terms and conditions.
 */


// This file is a suggested starting place for your code.
// It is completely optional and not required.
// Note the reference that includes it in the index.html file.


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.


function myEventHandler() {
    "use strict" ; 

    var ua = navigator.userAgent ;
    var str ;

    if( window.Cordova && dev.isDeviceReady.c_cordova_ready__ ) {
            str = "It worked! Cordova device ready detected at " + dev.isDeviceReady.c_cordova_ready__ + " milliseconds!" ;
    }
    else if( window.intel && intel.xdk && dev.isDeviceReady.d_xdk_ready______ ) {
            str = "It worked! Intel XDK device ready detected at " + dev.isDeviceReady.d_xdk_ready______ + " milliseconds!" ;
    }
    else {
        str = "Bad device ready, or none available because we're running in a browser." ;
    }

    alert(str) ;
}
 
/*function iniciarSesion(){
    navigator.notification.alert('HOLA MUNDO',function(){$.mobile.changePage("principal.html",{transition:"pop"});},'ALERTA','Aceptar');
    //navigator.notification.beep(1);
}*/
 
function test(){
    $.mobile.changePage("login.html",{transition:"pop"});
}



//registro de servicio push
    /*document.addEventListener('deviceready', function () {
      // Enable to debug issues. 
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
       
      window.plugins.OneSignal
        .startInit 
      ("8ca70fb8-61a0-4584-a303-86bc8de3c8de")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit(); 
      //"d347aca2-724b-4b2a-b925-f44f6acddd08"
      // Call syncHashedEmail anywhere in your app if you have the user's email.
      // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
      // window.plugins.OneSignal.syncHashedEmail(userEmail);
       window.plugins.OneSignal.getIds( function ( ids ) {//funcion para obtener idUserPush
            var ed = ids.userId;
            //alert(ed); 
       });
    }, false);*/


    //FIN PUSH    

document.addEventListener("backbutton", function(e){
    navigator.app.close();
}, false);


//navigator.app.clearCache();
//navigator.app.clearHistory();


// ...additional event handlers here...
