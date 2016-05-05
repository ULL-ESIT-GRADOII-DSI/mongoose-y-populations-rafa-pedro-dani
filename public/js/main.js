/* global $ localStorage _*/

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
    /*const dump = (fileName) => {
        $.get(fileName, (data) => {
            $('#original').val(data.data);
        });
    };*/

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
        let usuarioactual;
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

        $('#boton_enviar').click(main);
        $('#pag_completa').css('display', 'none');
        $('.modal-trigger').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: 0.50, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            complete: function() {
                $('#materialize-lean-overlay-2').hide();
                if ($('#nombre').val() == "" || $('#apellidos').val() == "")
                    alert("Ha dejado un campo en blanco");
                else{
                    usuarioactual = `${$('#nombre').val()} ${$('#apellidos').val()}`;
                    $.get(`/user/${usuarioactual}`, {}, () => {
                        actualizar();
                        actualizarUsuarios();
                        $('#texto_bienvenida').html(`<p>Bienvenido ${usuarioactual}</p>`);
                    });
                } // Callback for Modal close
            }
        });

        const handleDragOver = (evt) => {
            evt.stopPropagation();
            evt.preventDefault();

            $('#drag_and_drop').css('background-color', '#90a4ae');
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
                $('#drag_and_drop').css('background-color', '#cfd8dc');
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

        $('#boton_guardar').click(() => {
            let nombrefichero = prompt('Introduzca el nombre de su fichero', 'Texto 1');

            $.post('/csv', {
                filename: nombrefichero,
                data: $('#original').val(),
                username: `${usuarioactual}`
            }, (res) => {
                actualizar();
            } , 'text').fail((err) => {
                if (err.status === 400) {
                    alert('Ya existe un fichero con el mismo nombre en la base de datos. Introduzca otro.');
                }
            });
        });

        const archivosenbd = `
        <a class='dropdown-button btn waves-effect'href='#' data-activates='dropdown1'>
            Ficheros contenidos en la base de datos
        </a>
        <ul id='dropdown1' class='dropdown-content'>
            <% archivosbd.forEach((item, i) =>{ %>
                <li class="listabd"><a><%= item.filename %></a></li>
            <% }); %>
        </ul>`;

        const actualizar = () => {
            $.get(`/user/${usuarioactual}`, {}, (archivosbd) => {
                let template = _.template(archivosenbd)({archivosbd});
                $('#contenido_bd').html(template);
                $('.dropdown-button').dropdown({
                    inDuration: 300,
                    outDuration: 225,
                    gutter: 0, // Spacing from edge
                    belowOrigin: false // Displays dropdown below the button
                });
                $('li.listabd').each((_,y) => {
                    $(y).click(() => {
                        $.get(`/csv/${$(y).text()}`, {username: `${usuarioactual}`}, (data) => {
                            $('#original').val(data.data);
                        });
                    });
                });
            });
        };

        $('#boton_inicio_sesion').click(() => {
            if (usuarioactual === undefined) {
                alert('Seleccione o cree algún usuario');
            } else {
                $('#pag_completa').fadeIn(1600);
                $('#pag_completa').css('display','initial');
                $('#ventana_inicial').fadeOut(800);
            }
        });

        $('#boton_registro').click(() => {
            $('#materialize-lean-overlay-2').show();
        });

        $('#boton_salir').click(() => {
            usuarioactual = undefined;
            $('#texto_bienvenida').empty();
            $('#pag_completa').fadeOut(1600);
            $('#pag_completa').css('display','initial');
            $('#ventana_inicial').fadeIn(800);
            $('#original').val('');
        });

        const handleDragLeave = () => {
            $('#drag_and_drop').css('background-color', '#cfd8dc');
            $('#drag_and_drop').css('animation', 'none');
        };

        const usuariosenbd = `
        <a class='dropdown-button btn boton_usuarios waves-effect' href='#' data-activates='dropdown2'>
            Seleccione un usuario
        </a>
          <ul id='dropdown2' class='dropdown-content'>
            <% usuariosbd.forEach((item, i) =>{ %>
                <li class="listausuarios"><a><%= item %></a></li>
            <% }); %>
        </ul>`;

        const actualizarUsuarios = () => {
            $.get('/user/*', {}, (usuariosbd) => {
                let template = _.template(usuariosenbd)({usuariosbd});
                $('#ventana_inicio_sesion_2').html(template);

                $('.dropdown-button').dropdown({
                    inDuration: 300,
                    outDuration: 225,
                    gutter: 0, // Spacing from edge
                    belowOrigin: false // Displays dropdown below the button
                });

                $('li.listausuarios').each((_,y) => {
                    $(y).click(() => {
                        $('#texto_bienvenida').html(`<p>Bienvenido ${$(y).text()}</p>`);
                        usuarioactual = `${$(y).text()}`;
                        actualizar();
                    });
                });
            });
        };

        actualizarUsuarios();

        $('#icono_nube_verde').bind('dragover', handleDragOver);
        $('#icono_nube_verde').bind('drop', handleFileSelect);
        $('#icono_nube_verde').bind('dragleave', handleDragLeave);
        $('#boton_subir_fichero').bind('change', handleFileSelect);
    });

    exports.main = this.main;

})(this);
