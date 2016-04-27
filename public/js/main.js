/*jslint browser: true, this: true*/

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
            $('#original').val(data.data);
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
        //$('button.ejemplos').each((_,y) => {
        //    $(y).click(() => {
        //        dump(`input_examples/${$(y).text()}.txt`);
        //    });
        //});

        $('#form').submit(main);

        const handleDragOver = (evt) => {
            evt.stopPropagation();
            evt.preventDefault();

            $('#drag_and_drop').css('background-color', '#81d4fa');
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
                $('#drag_and_drop').css('background-color', '#e1f5fe');
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

        $("#boton_guardar").click(() => {
            let nombrefichero = prompt ("Introduzca el nombre de su fichero", "Texto 1");
            $.post('/csv', {
	            filename: nombrefichero,
	            data: $('#original').val()
            }, (res) => {} , 'json').fail((err)=>{if(err.status==400)alert("Ya existe un fichero con el mismo nombre en la base de datos. Introduzca otro.")});
            actualizar();
        });

        //$("#contenido_bd").click(() => {
            //TODO: llamar a funcion para que actualice
        //});

        $.get('/csv/*', {}, (archivosbd) => {
            let template = _.template(archivosenbd)({archivosbd});
            $('#contenido_bd').html(template);
            $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
            });
            $('li.listabd').each((_,y) => {
                $(y).click(() => {
                    dump(`/csv/${$(y).text()}`);
                });
            });
        });

        const archivosenbd =`
        <a class='dropdown-button btn waves-effect'href='#' data-activates='dropdown1'>Ficheros contenidos en la base de datos</a>
        <ul id='dropdown1' class='dropdown-content'>
            <% archivosbd.forEach((item, i) =>{ %>
                <li class="listabd"><a><%= item.filename %></a></li>
            <% }); %>
        </ul>`

        const actualizar = () => {
            console.log("actualiceeee");
          $.get('/csv/*', {}, (archivosbd) => {
            let template = _.template(archivosenbd)({archivosbd});
            $('#contenido_bd').html(template);
            $('.dropdown-button').dropdown({
                inDuration: 300,
                outDuration: 225,
                gutter: 0, // Spacing from edge
                belowOrigin: false, // Displays dropdown below the button
            });
            $('li.listabd').each((_,y) => {
                $(y).click(() => {
                    dump(`/csv/${$(y).text()}`);
                });
            });
        });
        };

        const handleDragLeave = () => {
            $('#drag_and_drop').css('background-color', '#e1f5fe');
            $('#drag_and_drop').css('animation', 'none');
        };

        $('#icono_nube_verde').bind('dragover', handleDragOver);
        $('#icono_nube_verde').bind('drop', handleFileSelect);
        $('#icono_nube_verde').bind('dragleave', handleDragLeave);
        $('#boton_subir_fichero').bind('change', handleFileSelect);

    });

    exports.main = this.main;

})(this);
