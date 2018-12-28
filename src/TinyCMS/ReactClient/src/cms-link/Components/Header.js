import React from 'react';
import { createLinkWrapper } from 'react-cms-link';

export default createLinkWrapper(({ text }) => (<h1>{text}</h1>), ({ text }) => ({ text }));

