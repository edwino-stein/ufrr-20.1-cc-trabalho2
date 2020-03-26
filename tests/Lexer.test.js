const path = require('path');
const tape = require('tape');

const {Lexer, Token} = require(path.relative(".", "../src/Lexer"));

tape('Lexer constructor', (asset) => {
    asset.ok(new Lexer instanceof Lexer, "Returns an instance with new operator");
    asset.ok(Lexer() instanceof Lexer, "Returns an instance without new operator");
    asset.end();
});

tape('Check Lexer.splitSpaces return', (asset) => {

    const lexer = new Lexer();

    asset.test("Check 'a = b + c'", (st) => {

        const lexemes = ["a", "=", "b", "+", "c"];
        const result = lexer.splitSpaces("a = b + c");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check 'a=b - c/2'", (st) => {

        const lexemes = ["a=b", "-", "c/2"];
        const result = lexer.splitSpaces("a=b - c/2");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check 'var1 =var2 + var3/2 * (var4 - 123)'", (st) => {

        const lexemes = ["var1", "=var2", "+", "var3/2", "*", "(var4", "-", "123)"];
        const result = lexer.splitSpaces("var1 =var2 + var3/2 * (var4 - 123)");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check '123var1=*(var)2 + var3/((2&'", (st) => {

        const lexemes = ["123var1=*(var)2", "+", "var3/((2&"];
        const result = lexer.splitSpaces("123var1=*(var)2 + var3/((2&");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check 'var = \"str + legal\" - foo (\"la la\") * lala'", (st) => {

        const lexemes = ["var", "=", "\"str + legal\"", "-", "foo", "(", "\"la la\"", ")", "*", "lala"];
        const result = lexer.splitSpaces("var = \"str + legal\" - foo (\"la la\") * lala");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.end();
});

tape('Check Lexer.parseLexemes return', (asset) => {

    const lexer = new Lexer();

    asset.test("Check 'var1+c/2;'", (st) => {

        const lexemes = ["var1", "+", "c", "/", "2", ";"];
        const result = lexer.parseLexemes("var1+c/2;");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check '123var1=*(var)2;'", (st) => {

        const lexemes = ["123var1", "=", "*", "(", "var", ")", "2", ";"];
        const result = lexer.parseLexemes("123var1=*(var)2;");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check 'var123=pow(2,3)%4'", (st) => {

        const lexemes = ["var123", "=", "pow", "(", "2", ",", "3", ")", "%", "4"];
        const result = lexer.parseLexemes("var123=pow(2,3)%4");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check 'var123'", (st) => {

        const lexemes = ["var123"];
        const result = lexer.parseLexemes("var123");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check 'var+\"str+cool\"'", (st) => {

        const lexemes = ["var", "+", "\"str + cool\""];
        const result = lexer.parseLexemes("var+\"str + cool\"");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.test("Check 'str = \"str + cool\"+\"concat\"'", (st) => {

        const lexemes = ["str", "=", "\"str + cool\"", "+", "\"concat\""];
        const result = lexer.parseLexemes("str = \"str + cool\"+\"concat\"");

        console.log("return: ", result, "; expected: ", lexemes);
        st.deepEqual(result, lexemes, "should match");
        st.end();
    });

    asset.end();
});

tape('Check Lexer.matchLexemeCategory return', (asset) => {

    const lexer = new Lexer();

    asset.test("Check empty token", (st) => {
        st.equal(
            lexer.matchLexemeCategory(""),
            "undefined",
            "Undefined lexeme category"
        );
        st.end();
    });

    asset.test("Check primitive types", (st) => {

        st.equal(
            lexer.matchLexemeCategory("int"),
            "primitiveType",
            "Int type"
        );

        st.equal(
            lexer.matchLexemeCategory("float"),
            "primitiveType",
            "Float type"
        );

        st.equal(
            lexer.matchLexemeCategory("string"),
            "primitiveType",
            "String type"
        );

        st.equal(
            lexer.matchLexemeCategory("bool"),
            "primitiveType",
            "Bool type"
        );

        st.end();
    });

    asset.test("Check Key Words", (st) => {

        st.equal(
            lexer.matchLexemeCategory("if"),
            "keyWord",
            "If key word"
        );

        st.equal(
            lexer.matchLexemeCategory("else"),
            "keyWord",
            "Else key word"
        );

        st.equal(
            lexer.matchLexemeCategory("while"),
            "keyWord",
            "While key word"
        );

        st.end();
    });

    asset.test("Check Booleans literals", (st) => {

        st.equal(
            lexer.matchLexemeCategory("true"),
            "boolLiteral",
            "True value"
        );

        st.equal(
            lexer.matchLexemeCategory("false"),
            "boolLiteral",
            "False value"
        );

        st.end();
    });

    asset.test("Check arithmetic operators", (st) => {

        st.equal(
            lexer.matchLexemeCategory("="),
            "operatorA",
            "Assignment operator"
        );

        st.equal(
            lexer.matchLexemeCategory("+"),
            "operatorA",
            "Plus operator"
        );

        st.equal(
            lexer.matchLexemeCategory("-"),
            "operatorA",
            "Minus operator"
        );

        st.equal(
            lexer.matchLexemeCategory("*"),
            "operatorA",
            "Times operator"
        );

        st.equal(
            lexer.matchLexemeCategory("/"),
            "operatorA",
            "Divider operator"
        );

        st.equal(
            lexer.matchLexemeCategory("%"),
            "operatorA",
            "Mod operator"
        );

        st.end();
    });

    asset.test("Check group and separators", (st) => {

        st.equal(
            lexer.matchLexemeCategory("("),
            "grouper",
            "( symbol"
        );

        st.equal(
            lexer.matchLexemeCategory(")"),
            "grouper",
            ") symbol"
        );

        st.equal(
            lexer.matchLexemeCategory("["),
            "grouper",
            "[ symbol"
        );

        st.equal(
            lexer.matchLexemeCategory("]"),
            "grouper",
            "] symbol"
        );

        st.equal(
            lexer.matchLexemeCategory("{"),
            "grouper",
            "{ symbol"
        );

        st.equal(
            lexer.matchLexemeCategory("}"),
            "grouper",
            "} symbol"
        );

        st.equal(
            lexer.matchLexemeCategory(","),
            "grouper",
            ", symbol"
        );

        st.equal(
            lexer.matchLexemeCategory(";"),
            "grouper",
            "; symbol"
        );


        st.end();
    });

    asset.test("Check identifiers", (st) => {

        st.equal(
            lexer.matchLexemeCategory("var"),
            "id",
            "Simple name"
        );

        st.equal(
            lexer.matchLexemeCategory("_var"),
            "id",
            "Starts with underscore"
        );

        st.equal(
            lexer.matchLexemeCategory("_var_"),
            "id",
            "Starts and ends with underscore"
        );

        st.equal(
            lexer.matchLexemeCategory("num123"),
            "id",
            "Name followed by a number"
        );

        st.equal(
            lexer.matchLexemeCategory("num_123"),
            "id",
            "Name followed by a number separed by an underscore"
        );

        st.equal(
            lexer.matchLexemeCategory("_1_a_B_2_"),
            "id",
            "Complex name with numbers and underscores"
        );

        st.notEqual(
            lexer.matchLexemeCategory("123invalid"),
            "id",
            "Invalid identifier starts with number"
        );

        st.notEqual(
            lexer.matchLexemeCategory("@invalid$"),
            "id",
            "Invalid identifier with bad symbols"
        );

        st.end();

    });

    asset.test("Check numbers", (st) => {

        st.equal(
            lexer.matchLexemeCategory("123456"),
            "numI",
            "Simple integer number"
        );

        st.equal(
            lexer.matchLexemeCategory("123.456"),
            "numF",
            "Simple float number"
        );

        st.equal(
            lexer.matchLexemeCategory(".456"),
            "numF",
            "Float number only with decimal part"
        );

        st.end();
    })

    asset.test("Check literal strings", (st) => {

        st.equal(
            lexer.matchLexemeCategory("\"hello world\""),
            "literalStr",
            "Simple literal string"
        );

        st.equal(
            lexer.matchLexemeCategory("\"a + b = #5\""),
            "literalStr",
            "Literal string with special characters"
        );

        st.notEqual(
            lexer.matchLexemeCategory("hello world"),
            "literalStr",
            "Invalid literal string"
        );

        st.end();
    })

    asset.end();

});


tape('Check Lexer.tokenizeLine', (asset) => {

    const lexer = new Lexer();

    asset.test("Check 'var1 + c/2;'", (st) => {

        const tokens = [
            new Token("id", "var1", 0),
            new Token("operatorA", "+", 0),
            new Token("id", "c", 0),
            new Token("operatorA", "/", 0),
            new Token("numI", "2", 0),
            new Token("grouper", ";", 0)
        ];

        const result = [];
        lexer.tokenizeLine(
            "var1 + c/2;",
            0,
            (t) => result.push(t));

        console.log("return: ", result, "; expected: ", tokens);
        st.deepEqual(result, tokens, "Tokens matched");

        st.end();
    });

    asset.test("Check 'circ =3.14* pow(r,2);'", (st) => {

        const tokens = [
            new Token("id", "circ", 0),
            new Token("operatorA", "=", 0),
            new Token("numF", "3.14", 0),
            new Token("operatorA", "*", 0),
            new Token("id", "pow", 0),
            new Token("grouper", "(", 0),
            new Token("id", "r", 0),
            new Token("grouper", ",", 0),
            new Token("numI", "2", 0),
            new Token("grouper", ")", 0),
            new Token("grouper", ";", 0)
        ];

        const result = [];
        lexer.tokenizeLine(
            "circ =3.14* pow(r,2);",
            0,
            (t) => result.push(t));

        console.log("return: ", result, "; expected: ", tokens);
        st.deepEqual(result, tokens, "Tokens matched");

        st.end();
    });

    asset.test("Check 'str = \"hello\" + \"world\" + 42;'", (st) => {

        const tokens = [
            new Token("id", "str", 0),
            new Token("operatorA", "=", 0),
            new Token("literalStr", "\"hello\"", 0),
            new Token("operatorA", "+", 0),
            new Token("literalStr", "\"world\"", 0),
            new Token("operatorA", "+", 0),
            new Token("numI", "42", 0),
            new Token("grouper", ";", 0)
        ];

        const result = [];
        lexer.tokenizeLine(
            "str = \"hello\" + \"world\" + 42;",
            0,
            (t) => result.push(t));

        console.log("return: ", result, "; expected: ", tokens);
        st.deepEqual(result, tokens, "Tokens matched");

        st.end();
    });

    asset.end();

});


tape('Check Lexer.tokenize ', (asset) => {

    const lexer = new Lexer();

    asset.test("Check single line", (st) => {

        const tokens = [
            new Token("id", "a", 1),
            new Token("operatorA", "=", 1),
            new Token("id", "b", 1),
            new Token("operatorA", "+", 1),
            new Token("numI", "123", 1),
            new Token("grouper", ";", 1)
        ];

        const result = [];
        lexer.tokenize(
            "a = b + 123;\n",
            (t) => result.push(t)
        );

        console.log("return: ", result, "; expected: ", tokens);
        st.deepEqual(result, tokens, "Tokens matched");

        st.end();
    });

    asset.test("Check multi line", (st) => {

        const tokens = [
            new Token("id", "r", 1),
            new Token("operatorA", "=", 1),
            new Token("numI", "2", 1),
            new Token("grouper", ";", 1),
            new Token("id", "pi", 2),
            new Token("operatorA", "=", 2),
            new Token("numF", "3.14", 2),
            new Token("grouper", ";", 2),
            new Token("id", "circ", 3),
            new Token("operatorA", "=", 3),
            new Token("id", "r", 3),
            new Token("operatorA", "*", 3),
            new Token("id", "pi", 3),
            new Token("operatorA", "*", 3),
            new Token("id", "pi", 3),
            new Token("grouper", ";", 3)
        ];

        const result = [];
        lexer.tokenize(
            "r=2;\npi=3.14;\ncirc=r*pi*pi;\n",
            (t) => result.push(t)
        );

        console.log("return: ", result, "; expected: ", tokens);
        st.deepEqual(result, tokens, "Tokens matched");

        st.end();
    });

    asset.test("Check multi line with strings", (st) => {

        const tokens = [
            new Token("primitiveType", "string", 1),
            new Token("id", "msg", 1),
            new Token("operatorA", "=", 1),
            new Token("literalStr", "\"hello world!\"", 1),
            new Token("grouper", ";", 1),
            new Token("id", "print", 2),
            new Token("grouper", "(", 2),
            new Token("literalStr", "\"Menssagem: \"", 2),
            new Token("operatorA", "+", 2),
            new Token("id", "msg", 2),
            new Token("grouper", ")", 2),
            new Token("grouper", ";", 2)
        ];

        const result = [];
        lexer.tokenize(
            "string msg = \"hello world!\";\nprint(\"Menssagem: \" + msg);",
            (t) => result.push(t)
        );

        console.log("return: ", result, "; expected: ", tokens);
        st.deepEqual(result, tokens, "Tokens matched");

        st.end();
    });

    asset.end();
});
