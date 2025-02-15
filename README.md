# Markdown Parser with Optimistic Code Block Formatting

A streaming markdown parser that optimistically formats code blocks and inline code as they arrive.

## Core Features

1. **Optimistic Parsing**
   - Formats code immediately when backticks appear
   - Doesn't wait for closing backticks
   - Maintains formatting during streaming

2. **Code Block Support**
   - Inline code with single backticks: `code`
   - Code blocks with triple backticks: ```code```
   - Preserves whitespace in code blocks

3. **Streaming Support**
   - Handles randomly chunked tokens
   - Maintains text selectability during streaming
   - Preserves formatting across token boundaries

## Implementation Details

### State Management
```typescript
interface ParserState {
    buffer: string;
    isInCodeBlock: boolean;
    isInInlineCode: boolean;
    codeBlockQuotes: number;
    isNewLine: boolean;
}
```

### Key Components
1. **Token Processing**
   - Processes tokens character by character
   - Handles backtick sequences (1 or 3)
   - Manages newlines and whitespace

2. **Buffer Management**
   - Accumulates characters in buffer
   - Processes buffer when state changes
   - Flushes long buffers (>100 chars)

3. **Styling**
   - Gray background for code sections
   - Monospace font for code
   - Proper indentation preservation

## Testing

Run the tests using:
```bash
npm run test
```

Test cases cover:
1. Basic code formatting
2. State transitions
3. Split tokens

## Future Improvements

1. Performance
   - Optimize buffer management
   - Batch DOM operations

2. Features
   - Language detection
   - Code highlighting
   - Better indentation handling

3. Robustness
   - Error recovery
   - Edge case handling
   - Comprehensive testing

## Usage

```typescript
// Initialize the parser
const container = document.getElementById('markdownContainer');

// Stream in tokens
function addToken(token: string) {
    // Parser will format code blocks optimistically
}

// Run a test stream
function runTests() {
    // Splits markdown into random tokens and streams them
}
```

## Requirements
- TypeScript
- Modern browser with DOM support