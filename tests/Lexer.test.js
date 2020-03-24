const path = require('path');
const tape = require('tape');

const Lexer = require(path.relative(".", "../src/Lexer"));

tape('Lexer constructor', (asset) => {
    asset.ok(new Lexer instanceof Lexer, "Returns an instance with new operator");
    asset.ok(Lexer() instanceof Lexer, "Returns an instance without new operator");
    asset.end();
});

