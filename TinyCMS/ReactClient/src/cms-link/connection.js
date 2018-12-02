/* eslint-disable no-undef */

import { renderMergedProps } from "./helpers";
if (!window.cmslink)
    require('./vanillaconnection');

const lnk = window.cmslink;

export const createLink = lnk.createLink;
export const getCurrentLink = lnk.getCurrentLink;
export const hasValidToken = lnk.hasValidToken;
export const onAuthenticationChanged = lnk.onAuthenticationChanged;
export const schemaHelper = lnk.schemaHelper;
export const sessionChanged = lnk.sessionChanged;
export const setSession = lnk.setSession;
export const signInWithToken = lnk.signInWithToken;

const registeredComponents = {
};

export const componentRegistry = ((registry) => ({
    setComponents: (templates) => {
        for (var key in templates) {
            registry[key] = templates[key];
        }
    },
    getComponent: (type, props) => {
        return renderMergedProps(registry[type], props);
    },
    getValue: (type) => registry[type],
    hasComponent: (data) => {
        if (data.type)
            return !!registry[data.type];
        return !!registry[data];
    }
}))(registeredComponents);


export const setEditComponent = (element, id) => {
    if (window.currentEditorLink)
        window.currentEditorLink(element, id);
}

export const setEditorLink = (callback) => {
    window.currentEditorLink = callback;
}

