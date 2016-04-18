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

    exports.main = this.main;

})(this);
