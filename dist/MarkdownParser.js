"use strict";
var blogpostMarkdown = "# control\n\n*humans should focus on bigger problems*\n\n## Setup\n\n```bash\ngit clone git@github.com:anysphere/control\n```\n\n```bash\n./init.sh\n```\n\n## Folder structure\n\n**The most important folders are:**\n\n1. `vscode`: this is our fork of vscode, as a submodule.\n2. `milvus`: this is where our Rust server code lives.\n3. `schema`: this is our Protobuf definitions for communication between the client and the server.\n\nEach of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!\n\nSome less important folders:\n\n1. `release`: this is a collection of scripts and guides for releasing various things.\n2. `infra`: infrastructure definitions for the on-prem deployment.\n3. `third_party`: where we keep our vendored third party dependencies.\n\n## Miscellaneous things that may or may not be useful\n\n##### Where to find rust-proto definitions\n\nThey are in a file called `aiserver.v1.rs`. It might not be clear where that file is. Run `rg --files --no-ignore bazel-out | rg aiserver.v1.rs` to find the file.\n\n## Releasing\n\nWithin `vscode/`:\n\n- Bump the version\n- Then:\n\n```\ngit checkout build-todesktop\ngit merge main\ngit push origin build-todesktop\n```\n\n- Wait for 14 minutes for gulp and ~30 minutes for todesktop\n- Go to todesktop.com, test the build locally and hit release\n";
var currentContainer = null;
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer');
    // this randomly split the markdown into tokens between 2 and 20 characters long
    // simulates the behavior of an ml model thats giving you weirdly chunked tokens
    var tokens = [];
    var remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        var tokenLength = Math.floor(Math.random() * 18) + 2;
        var token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }
    var toCancel = setInterval(function () {
        var token = tokens.shift();
        if (token) {
            addToken(token);
        }
        else {
            clearInterval(toCancel);
        }
    }, 20);
}
var state = {
    buffer: '',
    isInCodeBlock: false,
    isInInlineCode: false,
    codeBlockQuotes: 0,
    isNewLine: true
};
function resetState() {
    state = {
        buffer: '',
        isInCodeBlock: false,
        isInInlineCode: false,
        codeBlockQuotes: 0,
        isNewLine: true
    };
}
function processBuffer() {
    if (!currentContainer || !state.buffer)
        return;
    var element = document.createElement(state.isNewLine && !state.isInCodeBlock ? 'div' : 'span');
    if (state.isInCodeBlock) {
        element.className = 'code-block';
    }
    else if (state.isInInlineCode) {
        element.className = 'inline-code';
    }
    element.textContent = state.buffer;
    currentContainer.appendChild(element);
    state.buffer = '';
}
function addToken(token) {
    if (!currentContainer)
        return;
    for (var i = 0; i < token.length; i++) {
        var char = token[i];
        // Handle newlines
        if (char === '\n') {
            processBuffer();
            if (!state.isInCodeBlock) {
                currentContainer.appendChild(document.createElement('br'));
                state.isNewLine = true;
            }
            else {
                state.buffer += char;
            }
            continue;
        }
        if (char === '`') {
            state.codeBlockQuotes++;
            // Process any existing buffer before changing state
            processBuffer();
            if (state.codeBlockQuotes === 3) {
                state.isInCodeBlock = !state.isInCodeBlock;
                state.codeBlockQuotes = 0;
                continue;
            }
            else if (state.codeBlockQuotes === 1) {
                state.isInInlineCode = !state.isInInlineCode;
                state.codeBlockQuotes = 0;
                continue;
            }
        }
        else {
            // Reset backtick count if we see non-backtick
            if (state.codeBlockQuotes > 0) {
                // Add the pending backticks as regular characters
                for (var j = 0; j < state.codeBlockQuotes; j++) {
                    state.buffer += '`';
                }
                state.codeBlockQuotes = 0;
            }
            if (char !== ' ' || state.isInCodeBlock || state.isInInlineCode) {
                state.isNewLine = false;
            }
            state.buffer += char;
        }
    }
    // Process buffer if it's getting too long
    if (state.buffer.length > 100) {
        processBuffer();
    }
}
// Add some basic styles to the document
var style = document.createElement('style');
style.textContent = "\n    .inline-code {\n        background-color: #f0f0f0;\n        padding: 2px 4px;\n        border-radius: 3px;\n        font-family: monospace;\n        display: inline;\n    }\n    \n    .code-block {\n        display: block;\n        background-color: #f5f5f5;\n        padding: 1em;\n        margin: 0.5em 0;\n        border-radius: 5px;\n        font-family: monospace;\n        white-space: pre;\n    }\n\n    div {\n        margin: 0.5em 0;\n        min-height: 1em;\n    }\n";
document.head.appendChild(style);
