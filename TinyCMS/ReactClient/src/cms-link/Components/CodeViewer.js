import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/styles/prism';
import { createLinkWrapper } from '../createLinkWrapper';

const CodeViewer = ({ code, codeLang }) => (
    <div>
        <SyntaxHighlighter language={codeLang} style={base16AteliersulphurpoolLight}>{code}</SyntaxHighlighter>
    </div>
);

export default createLinkWrapper(CodeViewer, ({ code, codeLang }) => ({ code, codeLang }));
