((exports) => {
    'use strict';

    const resultTemplate = `
    <br>
    <h4>Resultado CSV</h4>
    <table class="stripped responsive-table bordered" id="result">
        <% _.each(rows, (row) => { %>
            <tr class="<%=row.type%>">
                <% _.each(row.items, (name) =>{ %>
                    <td><%= name %></td>
                <% }); %>
            </tr>
        <% }); %>
    </table>
    `;

    /* Volcar la tabla con el resultado en el HTML */
    const fillTable = (rows) => {
        let template = _.template(resultTemplate)({rows});
        $('#finaltable').html(template);
    };
    /*Constante que vuelca el contenido de los ficheros de
    prueba en el text area que tiene identificador original*/
    const dump = (fileName) => {
        $.get(fileName, (data) => {
            $('#original').val(data);
        });
    };

    const main = () => {
        let input = $('#original').val();
        if (input === '') {
            alert('El texto está vacío. Introduzca algo.');
        } else {
            if (window.localStorage) {
                localStorage.input = input;
            }
            $.get('/csv',
                {input},
                fillTable,
                'json'
            );
        }
        return false;
    };

    $(() => {
        // If the browser supports localStorage and we have some stored data
        if (window.localStorage && localStorage.original) {
            $('#original').val(localStorage.original);
        }

        // botones para rellenar el textarea
        $('button.ejemplos').each((_,y) => {
            $(y).click(() => { dump(`input_examples/${$(y).text()}.txt`); });
        });

        $('#form').submit(main);
        $('.button-collapse').sideNav();
    });

    var dropZone = document.getElementById('drag_and_drop');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    function handleDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.target.style.animaiton = "breathing 2s ease-out infinite normal"; 
        evt.target.style.background = "#7cb342";
    }

    function handleFileSelect(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files; // FileList object.

        // files is a FileList of File objects. List some properties.
        console.log(files);
        evt.target.style.background = "#7cb342";
      }

    exports.main = this.main;

})(this);
