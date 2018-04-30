// Eine Einführung zur leeren Vorlage finden Sie in der folgenden Dokumentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// Zum Debuggen von Code beim Laden einer Seite in cordova-simulate oder auf Android-Geräten/-Emulatoren: Starten Sie Ihre App, legen Sie Haltepunkte fest, 
// und führen Sie dann "window.location.reload()" in der JavaScript-Konsole aus.

var foundDevices = [];
var paired_address;

var current_element,last_element;

var current_type = "vitrine_type2";


var last_view = "startup";
var current_view = "vitrine_type2";

var leds = {};


var retries = 0;
var current_name = "";

(function () {
    "use strict";

    current_element = "element_102";
    last_element = "element_102";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    


    function onDeviceReady() {

        
        set_events();  // Eventhandler für Fader setzen
        show_hide();   // Je nach Zustand die jeweiligen Seiten anzeigen

        // Bluetooth LE benötigt Zugriff auf Geolation auf Android

        if (check_loc_permissions) do_ble();

        // Verarbeiten der Cordova-Pause- und -Fortsetzenereignisse
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        //Navigation initialisieren
        set_navigation_switchers();
        set_sliders();

        //addDevice_connected("Type1_Case3", "Test1");
        //addDevice_connected("Type2_Case3", "Test2");
        //addDevice_connected("Type3_Case5", "Test3");


        document.getElementById("scan").onclick = startScan;
        document.getElementById("send").onclick = send_data_raw;

        var fixed = document.getElementById('main_window');

        fixed.addEventListener('touchmove', function (e) {

            e.preventDefault();

        }, false);

       


    };

  



 



 




    function onPause() {
        // TODO: Diese Anwendung wurde ausgesetzt. Speichern Sie hier den Anwendungszustand.
    };

    function onResume() {
        // TODO: Diese Anwendung wurde erneut aktiviert. Stellen Sie hier den Anwendungszustand wieder her.
    };

 

   


})();