const UNICODES = require('./data/unicode-charchters');
const CONTRACTIONS = require('./data/contractions');
const { unescape } = require('lodash');
const urlRegex = require('url-regex');

class TextPreprocessor {
    /**
     * Normalizing texts before any natural language processing
     * @param {string} text 
     */
    constructor(text) {
        this.text = text;
    };
    /**
     * Removes the leading and trailing white space and line terminator characters
     * and strips extra whitespace from all documents, leaving only at most one whitespace between any two other characters.
     */
    clean() {
        this.text = this.text.trim().replace(/\s{2,}/g, ' ');
        return this;
    };
    /**
     * Converts the HTML entities &amp;, &lt;, &gt;, &quot;, and &#39; in string to their corresponding characters.
     */
    unescape() {
        this.text = unescape(this.text);
        return this;
    };
    /**
     * Converts all the alphabetic characters in a string to lowercase.
     */
    toLowerCase() {
        this.text = this.text.toLowerCase();
        return this;
    };
    /**
     * returns the result of chains so far
     */
    toString() {
        return this.text;
    };
    /**
     * Replaces all occuring English contractions by their expanded equivalents, e.g. "don't" is changed to "do not".
     */
    expandContractions() {
        this.toLowerCase();
        for (let key in CONTRACTIONS) {
            this.text = this.text.replace(new RegExp(key, 'gi'), CONTRACTIONS[key][0]);
        }
        return this;
    };
    /**
     * Replaces hugely-ignorant, and widely subjective transliteration of latin, cryllic, greek unicode characters with english ascii.
     */
    killUnicode() {
        let chars = this.text.split('');
        chars.forEach((s, i) => {
            if (UNICODES[s]) {
                chars[i] = UNICODES[s];
            }
        });
        this.text = chars.join('');
        return this;
    };
    /**
     * Replaces any occurrence of the given expression with the givven string
     * @param {RegExp} regexp 
     * @param {String} value
     */
    replace(regexp, value) {
        this.text = this.text.replace(regexp, value);
        return this;
    };
    /**
     * Removes any occurrence of the given expression
     * @param {RegExp} regexp 
     */
    remove(regexp) {
        return this.replace(regexp, '');
    };
    /**
     * Removes #tags, @mentions from start of the text
     */
    removeTagsAndMentions() {
        return this.remove(/^[#@]/);
    };
    /**
     * Removes all special charachters
     */
    removeSpecialCharachters() {
        return this.remove(/[^\w\s]/gi);
    };
    /**
     * Removes Urls and emails
     */
    removeURLs() {
        return this.remove(urlRegex({ strict: false }));
    };
    /**
     * Remove brackets and parentheses contents.
     * @example `Hello, this is Mike (example)` to `Hello, this is Mike `
     */
    removeParenthesesContents() {
        return this.remove(/\[.*\]/g).remove(/\(.*\)/g);
    }
    /**
     * Removes punctuation from end of the text
     */
    removePunctuation() {
        return this.remove(/[,;.!?]+$/g);
    };
    /**
     * Coerce single curly quotes. `don’t` to `don't`
     */
    normalizeSingleCurlyQuotes() {
        return this.replace(/[\u0027\u0060\u00B4\u2018\u2019\u201A\u201B\u2032\u2035\u2039\u203A]+/g, '\'');
    }
    /**
     * Coerce double curly quotes. `it is «Khorzu”` to `it is "Khorzu"`
     */
    normalizeDoubleCurlyQuotes() {
        return this.replace(/[\u0022\u00AB\u00BB\u201C\u201D\u201E\u201F\u2033\u2034\u2036\u2037\u2E42\u301D\u301E\u301F\uFF02]+/g, '"');
    }
    /**
     * Executes default normalizing methods. including:
     * `clean`,`toLowerCase`,`unescape`,`killUnicode` and `normalizeSingleCurlyQuotes`
     */
    defaults() {
        return this.chain('clean', 'toLowerCase', 'unescape', 'killUnicode', 'normalizeSingleCurlyQuotes');
    };
    /**
     * Executes chain of givven method names
     */
    chain() {
        Array.from(arguments).forEach(arg => this[arg]());
        return this;
    };
}

/**
 * Normalizing texts before any natural language processing
 * @param {String} text
 * 
 * @returns {TextPreprocessor}
 */
function preprocessor(text) {
    return new TextPreprocessor(text);
}

module.exports = preprocessor;