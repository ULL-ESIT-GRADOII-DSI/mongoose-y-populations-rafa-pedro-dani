function main() {
    'use strict';
    var original = $('#original').val();
    if(original===""){
        alert("El texto está vacío. Introduzca algo.");
    }
    else{
        if (window.localStorage) {
            localStorage.original = original;
        }
        $.get("/csv",
            {input: $('#original').val()},
            function(data) {
                console.log(data);
            }
        );
    }
    return false;
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
