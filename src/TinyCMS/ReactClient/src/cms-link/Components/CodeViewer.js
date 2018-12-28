import React from 'react';
//import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
//import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/styles/prism';
import { createLinkWrapper } from 'react-cms-link';

const CodeViewer = ({ code, codeLang }) => (
    <div>
        {/* <SyntaxHighlighter language={codeLang}>{code}</SyntaxHighlighter> */}
        <pre>{code}</pre>
    </div>
);

export default createLinkWrapper(CodeViewer, ({ code, codeLang }) => ({ code, codeLang }));
