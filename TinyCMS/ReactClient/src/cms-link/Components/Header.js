import React from 'react';
import { createLinkWrapper } from '../createLinkWrapper';

export default createLinkWrapper(({ text }) => (<h1>{text}</h1>), ({ text }) => ({ text }));

