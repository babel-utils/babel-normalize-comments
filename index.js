// @flow
'use strict';

/*::
import type { CommentBlock, CommentLine } from 'babel-flow-types';

type Comment = CommentBlock | CommentLine;
type Comments = Array<Comment>;
*/

const EMPTY_LINE = /^[ \t]*\**[ \t]*$/;
const SPACE_UNTIL_CONTENT = /^[ \t\*]*(?=\S)/;

function normalizeComment(comment /*: Comment */) /*: string */ {
  if (comment.type === 'CommentLine') {
    return comment.value.trim();
  }

  if (comment.type !== 'CommentBlock') {
    throw new Error(`Unknown comment type: ${comment.type}`);
  }

  let lines = comment.value.split('\n');
  let start = 0;
  let end = lines.length - 1;

  while (start <= lines.length - 1) {
    if (EMPTY_LINE.test(lines[start])) {
      start++;
    } else {
      break;
    }
  }

  while (end >= 0) {
    if (EMPTY_LINE.test(lines[end])) {
      end--;
    } else {
      break;
    }
  }

  let trimmed = lines.slice(start, end + 1);
  let indents = [];
  let startPos = comment.loc.start.column + 2;
  trimmed.forEach((line, index) => {
    let offset = index === 0 && start === 0 ? startPos : 0;
    let match = line.match(SPACE_UNTIL_CONTENT);
    if (match && !EMPTY_LINE.test(line)) {
      indents.push(offset + match[0].length);
    }
  });

  let minIndent = Math.min.apply(Math, indents);

  let normalized = trimmed.map((line, index) => {
    let offset = index === 0 && start === 0 ? startPos : 0;
    return line.slice(Math.abs(minIndent - offset)).trimRight();
  });

  return normalized.join('\n');
}

function normalizeComments(comments /*: Comments */) /*: string */ {
  let results = [];

  comments.forEach(comment => {
    let res = normalizeComment(comment);
    if (res !== '') results.push(res);
  });

  return results.join('\n');
}

module.exports = {
  normalizeComment,
  normalizeComments,
};
