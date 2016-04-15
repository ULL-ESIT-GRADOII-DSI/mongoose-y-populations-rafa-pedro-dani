function main() {
    'use strict';
    var original = $('#original').val();
    if(original===""){
        alert("El texto está vacío. Introduzca algo.");
        return false;
    }
    else{
        if (window.localStorage) {
            localStorage.original = original;
        }
    }
}

$(document).ready(function() {
    'use strict';
    // If the browser supports localStorage and we have some stored data
    if (window.localStorage && localStorage.original) {
        $('#original').val(localStorage.original);
    }

    $('#form').submit(main);
    $(".button-collapse").sideNav();
});
