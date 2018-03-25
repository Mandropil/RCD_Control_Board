function do_ble() {
    new Promise(function (resolve) {
        bluetoothle.initialize(resolve, { request: true, statusReceiver: false });
    }).then(ble_initializeSuccess, handleError);
}


function ble_initializeSuccess(result) {
    console.log("init");
    if (result.status === "enabled") {

        console.log("Bluetooth is enabled.");
        console.log(result);
        bluetoothle.retrieveConnected(retrieveConnectedSuccess, handleError, {});
    }

    else {

        document.getElementById("start-scan").disabled = true;

        console.log("Bluetooth is not enabled:", "status");
        console.log(result, "status");
    }
}



function handleError(error) {
    var msg;
    if (error.error && error.message) {
        var errorItems = [];
        if (error.service) {
            errorItems.push("service: " + (uuids[error.service] || error.service));
        }
        if (error.characteristic) {
            errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
        }
        msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
        //bluetoothle.close();
    }
    else {
        msg = error;
    }

    console.log(msg, "error");
    if (error.error === "read" && error.service && error.characteristic) {
        reportValue(error.service, error.characteristic, "Error: " + error.message);
    }
}


function subscribe() {
    console.log("Sub1");
    bluetoothle.isConnected(subscribe_after_connect, is_not_connected, { "address": paired_address });


    
}
function is_not_connected() {
    console.log("Sub2");
    bluetoothle.reconnect(subscribe_after_connect, connect, { "address": paired_address });
}


function subscribe_after_connect() {
    console.log("Verbinde...");
    console.log(paired_address);
    bluetoothle.subscribe(function (result) {
        if (result.status == "subscribed") {
            send_data_raw("I20001");
        }
        if (result.value) {
            console.log(result.value);
            var ergebnis = bluetoothle.encodedStringToBytes(result.value);
            console.log(ergebnis);
            set_leds(ergebnis);
            

        }
    }, function (e) {
        
        if (e.message == "Already subscribed") {
            console.log("Bereits subscribed, sende Daten");
            send_data_raw("I20001");
        }
        else {
            console.log(e);
            console.log("subscribe fehler");
            retries++;
            console.log("Retries: " + retries);
            if (retries > 5) {
                document.getElementById(current_name + "_move").classList.remove("connecting");
                document.getElementById(current_name + "_pick").classList.remove("connecting");
                document.getElementById(current_name + "_move").classList.add("disconnected");
                document.getElementById(current_name + "_pick").classList.add("disconnected");
                return;
            }
            if (e.error == "isNotConnected") {
                bluetoothle.disconnect(bluetoothle.close(setTimeout(connect(), 200), handleError), handleError, { "address": paired_address });
                
            }
        }
    }, {
            "service": "0000ffe0-0000-1000-8000-00805f9b34fb",
            "address": paired_address,
            "characteristic": "0000ffe1-0000-1000-8000-00805f9b34fb"
        });



    
    
    


    window.onbeforeunload = close_ble;


    //bluetoothle.notify(notify_suc, notify_err, params).then(notify_data,notify_error);



}

function close_ble() {
    
        var params = {
            "service": "0000ffe0-0000-1000-8000-00805f9b34fb",
            "address": paired_address,
            "characteristic": "0000ffe1-0000-1000-8000-00805f9b34fb"
        };
        bluetoothle.close(cl_suc, cl_err, params);
    
}
function cl_suc() {

}
function cl_err() {

}

function send_data(data_string) {
    var color = parseInt(data_string);
    console.log(paired_address);
    var val = Math.round((color / 255) * 10) / 10;
    console.log("VAL" + val);
    console.log(color);
    if (val < 0.1) val = 0.1;
    var light = document.getElementById(current_element);
    light.style.opacity = val;

    var val1 = document.getElementById(current_element).value;
    var val2 = data_string

    if (val1.length == 0) val1 = "00";
    if (val1.length == 1) val1 = "0" + val1;
    if (val2.length == 0) val2 = "000";
    if (val2.length == 1) val2 = "00" + val2;
    if (val2.length == 2) val2 = "0" + val2;
        

    console.log(data_string);
    var full_string = "" + val1 + val2;
    console.log(full_string);
    full_string = "L" + full_string + "*";
    var bytes = bluetoothle.stringToBytes(full_string);
    var encodedString = bluetoothle.bytesToEncodedString(bytes);

    console.log(encodedString.length);

    var params = {
        "value": encodedString,
        "service": "0000ffe0-0000-1000-8000-00805f9b34fb",
        "address": paired_address,
        "characteristic": "0000ffe1-0000-1000-8000-00805f9b34fb"
    };

    bluetoothle.write(w_suc, w_err, params);

    function w_suc() {
        console.log("Geschrieben");
    }
    function w_err(err) {
        console.log(err);
        console.log("Fehler schreiben");
    }


}
function send_data_raw(data_string) {  //Dem aktuellen Modul Rohdaten Daten senden
    console.log(data_string);
    
    data_string = data_string + "*"; //Immer Abschlusszeichen anfügen

    var bytes = bluetoothle.stringToBytes(data_string);
    var encodedString = bluetoothle.bytesToEncodedString(bytes);
    var params = {
        "value": encodedString,
        "service": "0000ffe0-0000-1000-8000-00805f9b34fb",
        "address": paired_address,
        "characteristic": "0000ffe1-0000-1000-8000-00805f9b34fb"
    };

    bluetoothle.write(w_suc, w_err, params);
    function w_suc() {
        console.log("Raw Geschrieben" + data_string);
    }
    function w_err(err) {
        console.log(err);
        console.log("Raw Fehler schreiben");
    }
}

