// @flow
'use strict';
const cases = require('jest-in-case');
const babylon = require('babylon');
const stripIndent = require('strip-indent');
const normalizeComments = require('./').normalizeComments;

function parse(code) {
  return babylon.parse(code);
}

cases('normalizeComments()', opts => {
  let code = stripIndent(opts.code).trim();
  let output = stripIndent(opts.output).trim();
  let ast = parse(code);
  let comments = ast.comments;
  let normalized = normalizeComments(comments);
  expect(normalized).toBe(output);
}, [
  {
    name: 'single-line',
    code: `
      // comment
    `,
    output: `
      comment
    `,
  },
  {
    name: 'block-empty-leading-trailing',
    code: `
      /*

      comment

      */
    `,
    output: `
      comment
    `,
  },
  {
    name: 'block-indented',
    code: `
      /*

        comment
        comment
          comment
          comment

      */
    `,
    output: `
      comment
      comment
        comment
        comment
    `,
  },
  {
    name: 'double-leading-star-multi-line',
    code: `
      /**
      comment
      */
    `,
    output: `
      comment
    `,
  },
  {
    name: 'double-leading-star-single-line',
    code: `
      /** comment */
    `,
    output: `
      comment
    `
  },
  {
    name: 'block-stars',
    code: `
      /* comment
       * comment
       */
    `,
    output: `
      comment
      comment
    `,
  },
  {
    name: 'jsdoc',
    code: `
      /**
       * comment
       * comment
       */
    `,
    output: `
      comment
      comment
    `,
  },
  {
    name: 'block-alignment-next-line',
    code: `
      /* comment
         comment */
    `,
    output: `
      comment
      comment
    `,
  },
  {
    name: 'block-alignment-next-line',
    code: `
    /** Writing on one line
    a second line */
    `,
    output: `
      Writing on one line
      a second line
    `,
  },
]);
