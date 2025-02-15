"use strict";
// Test cases for markdown parser
var testCases = "\n# Test Cases\n\n## 1. Basic Code Formatting\nSimple inline: `console.log(\"test\")`\nSplit inline: `console.log(\"sp|lit\")`\n\nCode block:\n```typescript\nfunction test() {\n    return true;\n}\n```\n\n## 2. State Transitions\nMixed format: `inline` then ```block``` then `inline`\n\n## 3. Split Tokens\nThis is a sp|lit to|ken te|st with `co|de` and ```ty|pe|sc|ript\nlet x = 1;\n```\n";
// Test runner function
function runTests() {
    var container = document.getElementById('markdownContainer');
    container.innerHTML = '';
    // Split into random length tokens (2-20 chars)
    var tokens = [];
    var remaining = testCases;
    while (remaining.length > 0) {
        var len = Math.floor(Math.random() * 18) + 2;
        tokens.push(remaining.slice(0, len));
        remaining = remaining.slice(len);
    }
    console.log('Starting tests...');
    console.log('Test cases:', testCases);
    console.log('Split into tokens:', tokens);
    // Stream tokens
    var i = 0;
    var interval = setInterval(function () {
        if (i < tokens.length) {
            console.log('Adding token:', tokens[i]);
            addToken(tokens[i]);
            i++;
        }
        else {
            clearInterval(interval);
            console.log('Tests completed');
            verifyTests();
        }
    }, 50);
}
function verifyTests() {
    var _a;
    var container = document.getElementById('markdownContainer');
    console.log('Verifying tests...');
    // 1. Check if backticks are visible
    var text = container.textContent || '';
    var hasVisibleBackticks = text.includes('`');
    console.log('Backticks visible:', hasVisibleBackticks);
    // 2. Check code formatting
    var inlineCodes = container.getElementsByClassName('inline-code');
    var codeBlocks = container.getElementsByClassName('code-block');
    console.log('Inline code elements:', inlineCodes.length);
    console.log('Code block elements:', codeBlocks.length);
    // 3. Check text selection
    var isSelectable = ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString().length) === 0;
    console.log('Text is selectable:', isSelectable);
}
// Add test button to window for access from HTML
window.runTests = runTests;
// Original test function
function otherTest() {
    console.log('a');
}
