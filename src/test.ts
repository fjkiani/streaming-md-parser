// Test cases for markdown parser
const testCases = `
# Test Cases

## 1. Basic Code Formatting
Simple inline: \`console.log("test")\`
Split inline: \`console.log("sp|lit")\`

Code block:
\`\`\`typescript
function test() {
    return true;
}
\`\`\`

## 2. State Transitions
Mixed format: \`inline\` then \`\`\`block\`\`\` then \`inline\`

## 3. Split Tokens
This is a sp|lit to|ken te|st with \`co|de\` and \`\`\`ty|pe|sc|ript
let x = 1;
\`\`\`
`;

// Test runner function
function runTests() {
    const container = document.getElementById('markdownContainer')!;
    container.innerHTML = '';
    
    // Split into random length tokens (2-20 chars)
    const tokens: string[] = [];
    let remaining = testCases;
    while (remaining.length > 0) {
        const len = Math.floor(Math.random() * 18) + 2;
        tokens.push(remaining.slice(0, len));
        remaining = remaining.slice(len);
    }
    
    console.log('Starting tests...');
    console.log('Test cases:', testCases);
    console.log('Split into tokens:', tokens);
    
    // Stream tokens
    let i = 0;
    const interval = setInterval(() => {
        if (i < tokens.length) {
            console.log('Adding token:', tokens[i]);
            addToken(tokens[i]);
            i++;
        } else {
            clearInterval(interval);
            console.log('Tests completed');
            verifyTests();
        }
    }, 50);
}

function verifyTests() {
    const container = document.getElementById('markdownContainer')!;
    
    console.log('Verifying tests...');
    
    // 1. Check if backticks are visible
    const text = container.textContent || '';
    const hasVisibleBackticks = text.includes('`');
    console.log('Backticks visible:', hasVisibleBackticks);
    
    // 2. Check code formatting
    const inlineCodes = container.getElementsByClassName('inline-code');
    const codeBlocks = container.getElementsByClassName('code-block');
    console.log('Inline code elements:', inlineCodes.length);
    console.log('Code block elements:', codeBlocks.length);
    
    // 3. Check text selection
    const isSelectable = window.getSelection()?.toString().length === 0;
    console.log('Text is selectable:', isSelectable);
}

// Add test button to window for access from HTML
(window as any).runTests = runTests;

// Original test function
function otherTest() {
    console.log('a');
}
