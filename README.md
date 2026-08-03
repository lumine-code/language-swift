# language-swift

Swift language support.

## Features

- **Grammars**: provides Tree-sitter grammars, built from [tree-sitter-swift](https://github.com/alex-pinkus/tree-sitter-swift).
- **Syntax highlighting**: full tree-sitter grammar coverage for Swift files.
- **Folding**: folds blocks from the parse tree rather than by indentation.

## Installation

To install `language-swift` search for _language-swift_ in the Install pane of the Lumine settings or run `lumine --install lumine-code/language-swift`.

## Usage

Upstream ships no generated parser, so the wasm is regenerated from `grammar.js` with the pinned `tree-sitter-cli`. That is reproducible — a second regenerate is byte-identical — but it means the parser is built here rather than taken as published.

## Services

- **hyperlink.injection** (`^1.0.0`): consumed to highlight URLs inside Swift files as clickable links.
- **todo.injection** (`^1.0.0`): consumed to highlight `TODO`-style markers inside comments.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
