const blogpostMarkdown = `# control

*humans should focus on bigger problems*

## Setup

\`\`\`bash
git clone git@github.com:anysphere/control
\`\`\`

\`\`\`bash
./init.sh
\`\`\`

## Folder structure

**The most important folders are:**

1. \`vscode\`: this is our fork of vscode, as a submodule.
2. \`milvus\`: this is where our Rust server code lives.
3. \`schema\`: this is our Protobuf definitions for communication between the client and the server.

Each of the above folders should contain fairly comprehensive README files; please read them. If something is missing, or not working, please add it to the README!

Some less important folders:

1. \`release\`: this is a collection of scripts and guides for releasing various things.
2. \`infra\`: infrastructure definitions for the on-prem deployment.
3. \`third_party\`: where we keep our vendored third party dependencies.

## Miscellaneous things that may or may not be useful

##### Where to find rust-proto definitions

They are in a file called \`aiserver.v1.rs\`. It might not be clear where that file is. Run \`rg --files --no-ignore bazel-out | rg aiserver.v1.rs\` to find the file.

## Releasing

Within \`vscode/\`:

- Bump the version
- Then:

\`\`\`
git checkout build-todesktop
git merge main
git push origin build-todesktop
\`\`\`

- Wait for 14 minutes for gulp and ~30 minutes for todesktop
- Go to todesktop.com, test the build locally and hit release
`;

let currentContainer: HTMLElement | null = null; 
// Do not edit this method
function runStream() {
    currentContainer = document.getElementById('markdownContainer')!;

    // this randomly split the markdown into tokens between 2 and 20 characters long
    // simulates the behavior of an ml model thats giving you weirdly chunked tokens
    const tokens: string[] = [];
    let remainingMarkdown = blogpostMarkdown;
    while (remainingMarkdown.length > 0) {
        const tokenLength = Math.floor(Math.random() * 18) + 2;
        const token = remainingMarkdown.slice(0, tokenLength);
        tokens.push(token);
        remainingMarkdown = remainingMarkdown.slice(tokenLength);
    }

    const toCancel = setInterval(() => {
        const token = tokens.shift();
        if (token) {
            addToken(token);
        } else {
            clearInterval(toCancel);
        }
    }, 20);
}

// Add these state variables at the top of the file, after blogpostMarkdown
interface ParserState {
    buffer: string;
    isInCodeBlock: boolean;
    isInInlineCode: boolean;
    codeBlockQuotes: number;
    isNewLine: boolean;
}

let state: ParserState = {
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
    if (!currentContainer || !state.buffer) return;
    
    const element = document.createElement(state.isNewLine && !state.isInCodeBlock ? 'div' : 'span');
    
    if (state.isInCodeBlock) {
        element.className = 'code-block';
    } else if (state.isInInlineCode) {
        element.className = 'inline-code';
    }
    
    element.textContent = state.buffer;
    currentContainer.appendChild(element);
    state.buffer = '';
}

function addToken(token: string) {
    if (!currentContainer) return;

    for (let i = 0; i < token.length; i++) {
        const char = token[i];
        
        // Handle newlines
        if (char === '\n') {
            processBuffer();
            if (!state.isInCodeBlock) {
                currentContainer.appendChild(document.createElement('br'));
                state.isNewLine = true;
            } else {
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
            } else if (state.codeBlockQuotes === 1) {
                state.isInInlineCode = !state.isInInlineCode;
                state.codeBlockQuotes = 0;
                continue;
            }
        } else {
            // Reset backtick count if we see non-backtick
            if (state.codeBlockQuotes > 0) {
                // Add the pending backticks as regular characters
                for (let j = 0; j < state.codeBlockQuotes; j++) {
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
const style = document.createElement('style');
style.textContent = `
    .inline-code {
        background-color: #f0f0f0;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: monospace;
        display: inline;
    }
    
    .code-block {
        display: block;
        background-color: #f5f5f5;
        padding: 1em;
        margin: 0.5em 0;
        border-radius: 5px;
        font-family: monospace;
        white-space: pre;
    }

    div {
        margin: 0.5em 0;
        min-height: 1em;
    }
`;
document.head.appendChild(style);