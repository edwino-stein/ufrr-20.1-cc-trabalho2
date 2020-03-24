function Lexer()
{
    'use strict';
    if(typeof(this) != "object") return new Lexer();
}

//IF it running into Node.js
if(typeof module !== 'undefined' && module.exports){
    module.exports = Lexer;
}
