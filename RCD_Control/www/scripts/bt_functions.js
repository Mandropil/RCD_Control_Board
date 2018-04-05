function startScan() {

    console.log("Starting scan for devices...", "status");
    var scanbutton = document.getElementById("scan");
    scanbutton.innerHTML = ('Stop');
    scanbutton.classList.add("scanning");
    document.getElementById("devices").innerHTML = "";
    
        

        bluetoothle.startScan(startScanSuccess, handleError, {
            services: [],
            "allowDuplicates": true,
            "scanMode": bluetoothle.SCAN_MODE_LOW_LATENCY,
            "matchMode": bluetoothle.MATCH_MODE_AGGRESSIVE,
            "matchNum": bluetoothle.MATCH_NUM_MAX_ADVERTISEMENT,
            "callbackType": bluetoothle.CALLBACK_TYPE_ALL_MATCHES,
        });

        document.getElementById("scan").onclick = stopScan;
}

function startScanSuccess(result) {

    console.log("startScanSuccess(" + result.status + ")");

    if (result.status === "scanStarted") {

        console.log("Scanning for devices (will continue to scan until you select a device)...", status);
    }
    else if (result.status === "scanResult") {

        if (!foundDevices.some(function (device) {

            return device.address === result.address;

        })) {

            console.log('FOUND DEVICE:');
            console.log(result);
            foundDevices.push(result);
            addDevice(result.name, result.address);
        }
    }
    

}

function retrieveConnectedSuccess(result) {

    console.log("retrieveConnectedSuccess()");
    console.log(result);

    result.forEach(function (device) {

        addDevice_connected(device.name, device.address);

    });
}

function addDevice(name, address) {

    var button = document.createElement("button");
    button.id = "found_"+name;
    button.style.width = "80%";
    button.style.padding = "10px";
    button.style.fontSize = "16px";
    button.textContent = name + ": " + address;

    button.addEventListener("click", function () {
        paired_address = address;
        current_name = name;
        stopScan();
        connect();
    });

    document.getElementById("devices").appendChild(button);



    

}

function addDevice_connected(name, address) {  // Add the item and the graphical stuff

    if (document.getElementById(name + "_pick")) return;

    var button_pick = document.createElement("div");
    button_pick.id = name + "_pick";
    button_pick.classList.add("vitrine");


    var button_move = document.createElement("div");
    button_move.id = name + "_move";
    button_move.classList.add("vitrine");
    button_move.classList.add("move");

    console.log(name);
    var box_text = name.replace("Type", " ");
    box_text = box_text.replace("Case", " ");
    box_text = box_text.replace("_", "\r\n");
    console.log(box_text);
    button_move.textContent = box_text;
    button_pick.textContent = box_text;


    var myElem = document.getElementById(name);
    if (myElem === null) {

        document.getElementById("paired_pick").appendChild(button_pick);
        document.getElementById("paired_move").appendChild(button_move);

        NativeStorage.getItem(name, getSuccess, getError);

        function getSuccess(obj) {
            console.log("geladen");
            document.getElementById(name + "_pick").style.left = obj.x + "px";
            document.getElementById(name + "_pick").style.top = obj.y + "px";
            document.getElementById(name + "_move").style.left = obj.x + "px";
            document.getElementById(name + "_move").style.top = obj.y + "px";
        }
        function getError() {
            console.log("laden fehlgeschlagen");
        }


        $('#' + name+"_pick").on("touchend", click_handler);

        
        $('#' + name+"_move").draggable({
            start: function () {
                
            },
            drag: function () {
                
            },
            stop: function () {
                var offset = $(this).offset();
                var xPos = offset.left;
                var yPos = offset.top;
                console.log(xPos);
                console.log(NativeStorage);
                var name = $(this)[0].id.split("_")[0];

                var names = $(this)[0].id.split("_");
                if (names.length == 1) name = names[0];
                if (names.length == 2) name = names[0];
                if (names.length == 3) name = names[0] + "_" + names[1];
                if (names.length == 4) name = names[0] + "_" + names[1] + "_" + names[2];

                
                
                document.getElementById(name + "_pick").style.left = xPos+"px";
                document.getElementById(name + "_pick").style.top = yPos + "px";
                
                var obj = { x: xPos, y: yPos };

                // be certain to make an unique reference String for each variable!
                NativeStorage.setItem(name,obj, setSuccess, setError);

                function setSuccess(obj) {
                    console.log("Gespeichert");
                }
                function setError(error) {
                    console.log("Speichern fehlgeschlagen");
                }

                
            }
        });
        
    }

    function stop_drag() {
        console.log();
    }


    function click_handler() {
        var old_address = paired_address;
        console.log("Clicked");
        document.getElementById(name + "_move").classList.add("connecting");
        document.getElementById(name + "_pick").classList.add("connecting");
        paired_address = address;
        current_name = name;
        bluetoothle.disconnect(subscribe, error,
            { address: old_address });
        function error(e) {
            console.log(e);
            if (e.message == "No device address") subscribe();
            else {
                console.log("Trennen fehlgeschlagen");
                close_ble();
                subscribe();
            }
        }
    }
    /*
    var my_position = window.localStorage.getItemy(name);
    if (my_position !== null) {
        $("#" + name).position().top = my_position.top;
        $("#" + name).position().left = my_position.left;
    }
    */
    

}


function connect() {

    console.log('Connecting to device: ' + paired_address + "...", "status");

    stopScan();
    


    new Promise(function (resolve, reject) {

        bluetoothle.connect(resolve, reject, { address: paired_address  });


    }).then(connectSuccess, subscribe);


    
}

function connectSuccess(result) {

    console.log("- " + result.status);





    if (result.status === "connected") {

        console.log(result.address);
        paired_address = result.address;
        console.log(result.address);
        getDeviceServices(result.address);

        addDevice_connected(result.name, result.address)


    }
    else if (result.status === "disconnected") {

        console.log("Disconnected from device: " + result.address, "status");
    }
}



function stopScan() {
    
    document.getElementById("scan").innerHTML = ('Scan');
    document.getElementById("scan").classList.remove("scanning");
    document.getElementById("scan").onclick = startScan;


    new Promise(function (resolve, reject) {

        bluetoothle.stopScan(resolve, reject);

    }).then(stopScanSuccess, not_scanning);
}

function not_scanning() {
    console.log("Scant nicht, nichts zu tun");
}

function stopScanSuccess() {

    if (!foundDevices.length) {

        console.log("NO DEVICES FOUND");
    }
    else {

        console.log("Found " + foundDevices.length + " devices.", "status");
    }
}



function getDeviceServices(address) {

    console.log("Getting device services...", "status");

    var platform = window.cordova.platformId;

    if (platform === "android") {

        new Promise(function (resolve, reject) {

            bluetoothle.discover(resolve, reject,
                { address: address });

        }).then(discoverSuccess, handleError);

    }
    else if (platform === "windows") {

        new Promise(function (resolve, reject) {

            bluetoothle.services(resolve, reject,
                { address: address });

        }).then(servicesSuccess, handleError);

    }
    else {

        console.log("Unsupported platform: '" + window.cordova.platformId + "'", "error");
    }
}


function discoverSuccess(result) {

    console.log("Discover returned with status: " + result.status);

    if (result.status === "discovered") {

        // Create a chain of read promises so we don't try to read a property until we've finished
        // reading the previous property.

        var readSequence = result.services.reduce(function (sequence, service) {

            return sequence.then(function () {

                return addService(result.address, service.uuid, service.characteristics);
            });

        }, Promise.resolve());

        // Once we're done reading all the values, disconnect
        readSequence.then(function () {

            new Promise(function (resolve, reject) {

                bluetoothle.disconnect(resolve, reject,
                    { address: result.address });

            }).then(connectSuccess, handleError);

        });

    }
}

function servicesSuccess(result) {

    console.log("servicesSuccess()");
    console.log(result);

    if (result.status === "services") {

        var readSequence = result.services.reduce(function (sequence, service) {

            return sequence.then(function () {

                console.log('Executing promise for service: ' + service);

                new Promise(function (resolve, reject) {

                    bluetoothle.characteristics(resolve, reject,
                        { address: result.address, service: service });

                }).then(characteristicsSuccess, handleError);

            }, handleError);

        }, Promise.resolve());

        // Once we're done reading all the values, disconnect
        readSequence.then(function () {

            new Promise(function (resolve, reject) {

                bluetoothle.disconnect(resolve, reject,
                    { address: result.address });

            }).then(connectSuccess, handleError);

        });
    }

    if (result.status === "services") {

        result.services.forEach(function (service) {

            new Promise(function (resolve, reject) {

                bluetoothle.characteristics(resolve, reject,
                    { address: result.address, service: service });

            }).then(characteristicsSuccess, handleError);

        });

    }
}


function characteristicsSuccess(result) {

    console.log("characteristicsSuccess()");
    console.log(result);

    if (result.status === "characteristics") {

        return addService(result.address, result.service, result.characteristics);
    }
}

function addService(address, serviceUuid, characteristics) {

    console.log('Adding service ' + serviceUuid + '; characteristics:');
    console.log(characteristics);

    var readSequence = Promise.resolve();

    
    
    characteristics.forEach(function (characteristic) {

        readSequence = readSequence.then(function () {

            return new Promise(function (resolve, reject) {

                bluetoothle.read(resolve, reject,
                    { address: address, service: serviceUuid, characteristic: characteristic.uuid });

            }).then(readSuccess, handleError);

        });
    });

    subscribe(address);
    return readSequence;
}

function readSuccess(result) {

    console.log("readSuccess():");
    console.log(result);

    if (result.status === "read") {

        reportValue(result.service, result.characteristic, window.atob(result.value));
    }
}

function reportValue(serviceUuid, characteristicUuid, value) {

    console.log(value);
}