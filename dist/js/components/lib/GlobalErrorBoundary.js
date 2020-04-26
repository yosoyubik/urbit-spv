const _jsxFileName = "/Users/jose/urbit/btc-landscape/src/js/components/lib/GlobalErrorBoundary.js";import React, { useMemo } from 'react';
import newGithubIssueUrl from 'new-github-issue-url';
import { OutButton, RestartButton } from './Buttons';
import { version } from '../../package.json';

const buildTitle = error => `Error Report: ${error.message}`;

const buildBody = error => `\n
<!-- Thanks for submitting this error! Can you help us identify the issue by providing additional context? -->
\n
## Context
\n
<!-- 1) What were you doing when you encountered this error? -->
\n
<!-- 2) Only if relevant (don't self-dox!), what point were you interacting with? -->
\n
## Error\n\n
\`\`\`
${error.stack}
\`\`\`
\n
In Bridge version ${version}.\n
`;

/**
 * NOTE: we want to use as few normal components here as possible, since the
 * error might have originated from within those components, making this
 * whole error boundary useless.
 */
export default function GlobalErrorBoundary({ error }) {
  const url = useMemo(
    () =>
      newGithubIssueUrl({
        user: 'urbit',
        repo: 'bridge',
        labels: ['bug', 'error handling'],
        title: buildTitle(error),
        body: buildBody(error),
      }),
    [error]
  );

  return (
    React.createElement('div', { className: "mw1 ph4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
      , React.createElement('h2', { className: "mt8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}, "Bridge Error!"
         , ' '
        , React.createElement('span', { role: "img", 'aria-label': "a bridge on fire"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, "🌉🔥"

        )
      )
      , React.createElement('p', { className: "mt4 f5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}, "We caught an error thrown by the Bridge application client-side code."

        , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} )
        , React.createElement('b', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Your points and assets are most likely safe."       )
      )
      , React.createElement('p', { className: "mt4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}, "If you'd like to help us make Bridge better, you can submit the error and your description of events to our GitHub issue tracker."


      )
      , React.createElement(OutButton, { href: url, solid: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}, "Submit the Issue on GitHub"

      )
      , React.createElement('pre', { className: "bg-gray1 mt4 p4 mono scroll-x"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, error.stack)
      , React.createElement('p', { className: "mt4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "You can reload Bridge and retry the operation that caused an error. If the error persists, please submit a bug report and we'll work with you to resolve it!"



      )
      , React.createElement(RestartButton, { onClick: () => document.location.reload(), solid: true, success: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, "Reload Bridge"

      )
    )
  );
}
