# babel-normalize-comments

> Merge comments together into a normalized string

Preserves indentation in many different comment styles

## Install

```
yarn add babel-normalize-comments
```

## Usage

```
const babylon = require('babylon');
const { normalizeComments, normalizeComment } = require('babel-normalize-comments');

let ast = babylon.parse(code);

// normalize an array of comment nodes
normalizeComments(ast.comments);

// normalize a single comment node
normalizeComment(ast.comments[0]);
```

See [test.js](test.js) for examples of input and output.
