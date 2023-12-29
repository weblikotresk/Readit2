import test from 'ava';
import preprocessor from './index.js';

test('clean', t => {
    const output = preprocessor('    Hi  \n\t  There   ').clean().toString();
    t.is(output, 'Hi There');
});
test('unescape', t => {
    const output = preprocessor('fred, barney, &amp; pebbles').unescape().toString();
    t.is(output, 'fred, barney, & pebbles');
});
test('toLowerCase', t => {
    const output = preprocessor('Hi TheRe').toLowerCase().toString();
    t.is(output, 'hi there');
});
test('expandContractions', t => {
    const output = preprocessor(`That's great! i'm gonna buy it.`).expandContractions().toString();
    t.is(output, 'that is great! i am going to buy it.');
});
test('killUnicode', t => {
    const output = preprocessor('bjŏȒk—Ɏó').killUnicode().toString();
    t.is(output, 'bjork-yo');
});
test('removeTagsAndMentions', t => {
    const output = preprocessor('@ali, look at #nlp.').removeTagsAndMentions().toString();
    t.is(output, 'ali, look at #nlp.');
});
test('removePunctuation', t => {
    const output = preprocessor('Are you ok?!').removePunctuation().toString();
    t.is(output, 'Are you ok');
});
test('normalizeSingleCurlyQuotes', t => {
    const output = preprocessor('that`s great! but don’t take too long okay?').normalizeSingleCurlyQuotes().toString();
    t.is(output, `that's great! but don't take too long okay?`);
});
test('normalizeDoubleCurlyQuotes', t => {
    const output = preprocessor('it is «Khorzu”').normalizeDoubleCurlyQuotes().toString();
    t.is(output, `it is "Khorzu"`);
});
test('defaults', t => {
    const output = preprocessor('     that`s great!    \n \t  &amp;  but don’t take too long okay?   \n bjŏȒk—Ɏó ').defaults().toString();
    t.is(output, `that's great! & but don't take too long okay? bjork-yo`);
});
test('removeURL & remove Email', t => {
    const output = preprocessor('that is an email shirazy.sajjad@gmail.com and this is a url: github.com.')
        .removeURLs()
        .toString();
    t.is(output, `that is an email  and this is a url: `);
});