﻿function set_sliders() {
    var sliders = document.getElementsByClassName('slider');
    for (var i = 0; i < sliders.length; i++) {

        sliders[i].addEventListener('change', move_slider);
    }

    var up = document.getElementById("up");
    var down = document.getElementById("down");



    up.addEventListener('click', function () {
        console.log("Plus" + document.getElementById("slider").value);
        document.getElementById("slider").value = 255;//document.getElementById("slider").value * 1 + 1;
        move_slider();

    });
    down.addEventListener('click', function () {
        console.log("Minus");
        document.getElementById("slider").value = 0;//document.getElementById("slider").value - 1;
        move_slider();


    });
    function move_slider() {
        var slider_val = document.getElementById("slider").value;
        var log_val = Math.round(logslider(document.getElementById("slider").value));
        console.log("VAL " + document.getElementById("slider").value + " Log " + log_val);
        try {
            leds[current_element]['slider'] = "slider";
        }
        catch (err) {
            leds[current_element] = {};
            leds[current_element]['slider'] = "slider";
        }
        
        leds[current_element]['curval'] = log_val ;
        
        console.log("Slider: "  + slider_val);
        console.log("Skaliert: " + log_val);
        console.log("Leds: " + leds);

        send_data(log_val);
    }
}


function logslider(position) {
    // position will be between 0 and 100
    var minp = 1;
    var maxp = 50;

    // The result should be between 100 an 10000000
    var minv = Math.log(1);
    var maxv = Math.log(255);

    // calculate adjustment factor
    var scale = (maxv - minv) / (maxp - minp);

    return Math.exp(minv + scale * (position - minp));
}






function set_leds(daten) {
    console.log(daten);
    console.log(leds);
    

    var spots = document.getElementsByClassName('spot');
    for (var i = 0; i < spots.length; i++) {
        for (var feld in daten) {
            if (feld == spots[i].value) {
                console.log(spots[i].id);
                console.log(daten[feld]);
                if (typeof(leds[spots[i].id]) === "undefined") {
                    leds[spots[i].id] = {};
                }
                leds[spots[i].id]['curval'] = daten[feld];
                leds[spots[i].id]['slider'] = "slider";
                var light = document.getElementById(spots[i].id);

                var val = Math.round((daten[feld] / 255) * 10) / 10;
                console.log("VAL" + val);
                
                if (val < 0.1) val = 0.1;
                light.style.opacity = val;
                
            }
            if (feld == 19) {
                current_type = "vitrine_type" + String.fromCharCode(daten[feld]);
                console.log("Typ:" + String.fromCharCode(daten[feld]));
            }
        }    
    }
    console.log("hier kam was");
    retries = 0;
    document.getElementById('nav_pick').classList.add('selected_nav');
    document.getElementById('nav_scan').classList.remove('selected_nav');
    document.getElementById('nav_move').classList.remove('selected_nav');
    console.log("Nav ok");
    document.getElementById(current_name + "_move").classList.remove("disconnected");
    document.getElementById(current_name + "_pick").classList.remove("disconnected");

    document.getElementById(current_name + "_move").classList.remove("connecting");
    document.getElementById(current_name + "_pick").classList.remove("connecting");

    document.getElementById(current_type).classList.remove('hidden');
    document.getElementById('slider_container').classList.remove('hidden');
    document.getElementById('nav_bar').classList.add('hidden');

}



function set_navigation_switchers() {
    var switcher1 = document.getElementById("element_100");
    var switcher2 = document.getElementById("element_200");
    var switcher3 = document.getElementById("element_300");

    
    var scan = document.getElementById("nav_scan");
    var move = document.getElementById("nav_move");
    var pick = document.getElementById("nav_pick");



    switcher1.addEventListener('click', function () {

        
        document.getElementById(current_type).classList.add('hidden');
        document.getElementById('vitrine_poles').classList.remove('hidden');

    });
    switcher2.addEventListener('click', function () {

        document.getElementById(current_type).classList.add('hidden');
        document.getElementById('vitrine_poles').classList.remove('hidden');

    });
    switcher3.addEventListener('click', function () {

        document.getElementById(current_type).classList.remove('hidden');
        document.getElementById('vitrine_poles').classList.add('hidden');


    });
    scan.addEventListener('click', function () {
        //bluetoothle.retrieveConnected(retrieveConnectedSuccess, handleError, {});
        document.getElementById("page_pick").classList.add('hidden');
        document.getElementById('page_scan').classList.remove('hidden');
        document.getElementById('page_move').classList.add('hidden');

        document.getElementById('nav_pick').classList.remove('selected_nav');
        document.getElementById('nav_scan').classList.add('selected_nav');
        document.getElementById('nav_move').classList.remove('selected_nav');


    });
    move.addEventListener('click', function () {
        document.getElementById("page_pick").classList.add('hidden');
        document.getElementById('page_scan').classList.add('hidden');
        document.getElementById('page_move').classList.remove('hidden');

        document.getElementById('nav_pick').classList.remove('selected_nav');
        document.getElementById('nav_scan').classList.remove('selected_nav');
        document.getElementById('nav_move').classList.add('selected_nav');

    });
    pick.addEventListener('click', function () {
        document.getElementById("page_pick").classList.remove('hidden');
        document.getElementById('page_scan').classList.add('hidden');
        document.getElementById('page_move').classList.add('hidden');

        document.getElementById('nav_pick').classList.add('selected_nav');
        document.getElementById('nav_scan').classList.remove('selected_nav');
        document.getElementById('nav_move').classList.remove('selected_nav');



    });
}





function show_hide() {
    //$("#spot").
}

function toggle_setup() {

    $("#" + name).draggable({
        stop: function () {
            console.log($("#" + name).position().top);
            console.log($("#" + name).position().left);
            window.localStorage.setItem(name, {
                "top": $("#" + name).position().top,
                "left": $("#" + name).position().top
            });
        }

    });

}

function set_events() { //Eventhandler für Klicken auf Elemente

    var spots = document.getElementsByClassName('spot');
    for (var i = 0; i < spots.length; i++) {
        document.getElementById(spots[i].id).onclick = set_active;
    }
    spots = document.getElementsByClassName('switcher');
    for (i = 0; i < spots.length; i++) {
        document.getElementById(spots[i].id).onclick = set_active;
    }


    var closer = document.getElementsByClassName('cross');
    for (i = 0; i < closer.length; i++) {
        
        document.getElementById(closer[i].id).onclick = hide_parent;
        
    }


    var onner = document.getElementsByClassName('all_on');
    
    for (var i = 0; i < onner.length; i++) {

        document.getElementById(onner[i].id).onclick = all_on;

    }
    var offer = document.getElementsByClassName('all_off');
    for (var i = 0; i < offer.length; i++) {

        document.getElementById(offer[i].id).onclick = all_off;

    }


}

function all_on() {
    send_data_raw("N20001");

}
function all_off() {
    send_data_raw("O20001");

}


function hide_parent() {
    this.parentElement.classList.add('hidden');
    document.getElementById('slider_container').classList.add('hidden');
    document.getElementById("page_pick").classList.remove('hidden');
    document.getElementById("nav_bar").classList.remove('hidden');
    send_data_raw("SS");
    close_ble();
    
}


function set_active() {
    current_element = this.id;
    console.log(current_element);
    document.getElementById(current_element + "_ring").classList.add('active');
    document.getElementById(current_element).classList.add('active');
    if (current_element !== last_element) {
        document.getElementById(last_element + "_ring").classList.remove('active');
        document.getElementById(last_element).classList.remove('active');
    }
    try {
        document.getElementById(leds[current_element]['slider']).value = leds[current_element]['curval'];
    }
    catch (err) {
        console.log("keine Daten");
        console.log(leds);
    }
    last_element = this.id;
}
