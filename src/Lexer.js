function Token(category, lexeme, line)
{
    'use strict';
    if(typeof(this) !== "object") return new Token(type, lexeme, line);

    if(typeof(category) !== "string") category = "";

    if(typeof(lexeme) !== "string")
        lexeme = typeof(lexeme) !== "object" ? ""+lexeme : "";

    if(typeof(line) !== "number") line = parseInt(line);

    this.category = category.length > 0 ? category : "undefined";
    this.lexeme = lexeme;
    this.line = line;
}

Token.prototype.category = "undefined";
Token.prototype.lexeme = "";
Token.prototype.line = 0;
Token.prototype.toString = function(){ return "<" + this.type + ", " + this.lexeme + ">"; };

function Lexer()
{
    'use strict';
    if(typeof(this) !== "object") return new Lexer();
}

Lexer.spacesRegex = /\s+/g;
Lexer.strPattern = "([\"'])(?:(?=(\\\\?))\\2.)*?\\1";
Lexer.operatorA = ['+', '-', '*', '/', '%', '='];
Lexer.groupers = ['(', ')', '[', ']', '{', '}', ',', ';'];
Lexer.primitiveTypes = ["int", "float", "string", "bool"];
Lexer.keyWords = ["if", "else", "while"];
Lexer.boolLiterals = ["true", "false"];
Lexer.idRegex = /^[a-zA-Z\_][a-zA-Z\_0-9]*$/;
Lexer.numIRegex = /^[0-9]+$/;
Lexer.numFRegex = /^(([0-9]+(\.[0-9]+))|(\.[0-9]+))$/;

Lexer.EOL = "\n";

Lexer.prototype.splitSpaces = function(input)
{
    if(typeof(input) !== "string") throw "Invalid input";
    if(input.length == 0) return [];

    const strRegex = new RegExp(Lexer.strPattern, "g");
    const strs = [...input.matchAll(strRegex)];
    let frags = [];
    let cursor = 0;

    for(let i in strs){

        const s = strs[i];
        const left = input.substr(cursor, s['index'] - cursor).trim();

        frags = [
            ...frags,
            ...left.split(Lexer.spacesRegex),
            s[0]
        ];

        cursor = s["index"] + s[0].length;
    }

    if(cursor < input.length){
        frags = [
            ...frags,
            ...input.substr(cursor).trim().split(Lexer.spacesRegex)
        ];
    }

    return frags;
}

Lexer.prototype.parseLexemes = function(input)
{
    if(typeof(input) !== "string") throw "Invalid input";
    if(input.length == 0) return [];

    const separators = [...Lexer.operatorA, ...Lexer.groupers];
    const regex = new RegExp(
        "[\\" + separators.join("\\") + "]|"+Lexer.strPattern,
        "g"
    );

    const frags = this.splitSpaces(input);
    const lexemes = [];

    for(let i in frags){

        const matched = [...frags[i].matchAll(regex)];
        let cursor = 0;

        for(let j in matched){
            const sep = matched[j][0];
            const left = frags[i].substr(cursor, matched[j]['index'] - cursor);

            if(left.length > 0) lexemes.push(left);
            lexemes.push(sep);

            cursor = matched[j]['index'] + sep.length;
        }

        if(cursor < frags[i].length) lexemes.push(frags[i].substr(cursor));
    }

    return lexemes;
}

Lexer.prototype.matchLexemeCategory = function(lexeme)
{
    const categories = {
        "primitiveType": l => l.match(new RegExp("^"+Lexer.primitiveTypes.join("|")+"$")) != null,
        "keyWord": l => l.match(new RegExp("^"+Lexer.keyWords.join("|")+"$")) != null,
        "boolLiteral": l => l.match(new RegExp("^"+Lexer.boolLiterals.join("|")+"$")) != null,
        "operatorA": l => l.match(new RegExp("^\\"+Lexer.operatorA.join("|\\")+"$")) != null,
        "grouper": l => l.match(new RegExp("^\\"+Lexer.groupers.join("|\\")+"$")) != null,
        "id": l => l.match(Lexer.idRegex) != null,
        "literalStr": l => l.match(new RegExp("^"+Lexer.strPattern+"$")) != null,
        "numI": l => l.match(Lexer.numIRegex) != null,
        "numF": l => l.match(Lexer.numFRegex) != null,
        "undefined": l => true
    };

    for (let i in categories) {
        if(!categories.hasOwnProperty(i)) continue;
        if(!categories[i](lexeme)) continue;
        return i;
    }
}

Lexer.prototype.tokenizeLine = function(input, line, callback)
{
    if(typeof(input) !== "string") throw "Invalid input";
    if(typeof(callback) !== "function") throw "Invalid callback";
    if(input.length == 0) return;

    const lexemes = this.parseLexemes(input);

    for(let i in lexemes){
        const cat = this.matchLexemeCategory(lexemes[i]);

        if(cat === "undefined")
            throw "Invalid identifier \"" + lexemes[i] + "\" at line " + line;

        callback(new Token(cat, lexemes[i], line));
    }
}

Lexer.prototype.tokenize = function(input, callback){

    if(typeof(input) !== "string") throw "Invalid input";
    if(typeof(callback) !== "function") throw "Invalid callback";
    if(input.length == 0) return;

    const lines = input.split(Lexer.EOL);
    for(var i in lines){
        const ln = parseInt(i) + 1;
        this.tokenizeLine(lines[i], ln, callback);
    }
}

//IF it running into Node.js
if(typeof module !== 'undefined' && module.exports){
    module.exports.Lexer = Lexer;
    module.exports.Token = Token;
}
