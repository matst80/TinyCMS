

import { createLinkWrapper } from './createLinkWrapper';
import CMSLink from './Components/CMSLink';
import LinkedComponent from './Components/LinkedComponent';
import {
    renderMergedProps,
    componentRegistry,
    setEditComponent,
    setEditorLink
} from './connection';

const isOfType = (type) => (item) => {
    return item.type==type;
}

export {
    isOfType,
    renderMergedProps,
    componentRegistry,
    setEditComponent,
    setEditorLink,
    createLinkWrapper,
    LinkedComponent,
    CMSLink
}
