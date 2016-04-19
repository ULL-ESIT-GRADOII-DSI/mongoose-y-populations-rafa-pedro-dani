/*jslint browser: true, this: true*/
/*global
*/
((exports) => {
    'use strict';
    const resultTemplate = `
    <br>
    <h4>Resultado CSV</h4>
    <table class='stripped responsive-table bordered' id='result'>
        <% _.each(rows, (row) => { %>
            <tr class='<%=row.type%>'>
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
                    'json');
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
            $(y).click(() => {
                dump(`input_examples/${$(y).text()}.txt`);
            });
        });

        $('#form').submit(main);

        const handleDragOver = (evt) => {
            evt.stopPropagation();
            evt.preventDefault();

            $('#drag_and_drop').css('background-color', '#aed581');
            $('#drag_and_drop').css('animation', 'breathing 2s ease-out infinite normal');
        };

        const handleFileSelect = (evt) => {
            evt.stopPropagation();
            evt.preventDefault();

            let files;
            if (evt.currentTarget.name === 'subida_fichero') {
                files = evt.target.files;
            }else {
                files = evt.originalEvent.dataTransfer.files; // FileList object.
                $('#drag_and_drop').css('background-color', '#f1f8e9');
                $('#drag_and_drop').css('animation', 'none');
            }

            // files is a FileList of File objects. List some properties.
            if (files[0].type.match('^text/.*$')) {
                let reader = new FileReader();

                reader.onload = (e) => {
                    $('#original').val(e.target.result);
                };

                reader.readAsText(files[0]);
            } else {
                alert('El fichero que se ha subido no es de tipo texto.');
            }
        };

        const handleDragLeave = () => {
            $('#drag_and_drop').css('background-color', '#f1f8e9');
            $('#drag_and_drop').css('animation', 'none');
        };

        $('#icono_nube_verde').bind('dragover', handleDragOver);
        $('#icono_nube_verde').bind('drop', handleFileSelect);
        $('#icono_nube_verde').bind('dragleave', handleDragLeave);
        $('#boton_subir_fichero').bind('change', handleFileSelect);

    });

    exports.main = this.main;

})(this);
