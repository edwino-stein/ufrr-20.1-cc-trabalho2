function doAnalyse(){
    const lexer = new Lexer();

    const table = $("#symble-table");
    const message = $("#message");

    message.hide();
    message.removeClass("info");
    message.removeClass("error");

    table.hide();
    table.find("tbody").empty();

    try{
        const src = $("#source-code").val();
        if(src.length == 0) throw "Empty Src";
        let cod = 0;
        lexer.tokenize(src, (token) => {
            const rowTpl = $($.parseHTML(
                "<tr>"+
                    "<td data-label=\"codigo\"></td>"+
                    "<td data-label=\"rotulo\"></td>"+
                    "<td data-label=\"lexeme\"></td>"+
                    "<td data-label=\"linha\"></td>"+
                "</tr>"
            )[0]);

            rowTpl.find("td[data-label='codigo']").append(cod++);
            rowTpl.find("td[data-label='rotulo']").append(token.category);
            rowTpl.find("td[data-label='lexeme']").append(token.lexeme);
            rowTpl.find("td[data-label='linha']").append(token.line);

            table.find("tbody").append(rowTpl);
        });

        table.show();
    }
    catch (e) {
        message.addClass("error");
        message.find(".header").text("Um erro ocorreu durante a análise");
        message.find("p").text(e);
        message.show();
        console.log(e);
    }
}

$( document ).ready(function() {

    $("#run").click((e) => { doAnalyse(); });
    $("#load-file-btn").click((e) => { $("#load-file-input").click() });
    $("#load-file-input").change((e) => {

        const file = e.target.files[0];
        if(typeof(file) !== "object") return;

        const fileReader = new FileReader();

        fileReader.onload = (d) => {
            const src = $("#source-code");
            src.empty();
            src.val(fileReader.result);
            doAnalyse();
        };

        fileReader.readAsText(file);
    });

    $("#source-code").val("float pi = 3.14;\nint raio = 5;\nfloat circ = 2*pi*raio;")

});
