import React from 'react';

export const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest);
    return (
        React.createElement(component, finalProps)
    );
}

const registeredComponents = {
};

export const componentRegistry = ((registry) => ({
    setComponents: (templates) => {
        for (var key in templates) {
            registry[key] = templates[key];
        }
    },
    getComponent: (type, props) => {
        const component = registry[type];
        if (component) {
            return React.createElement(component, { ...props });
        }
        throw 'component not found:' + type;
        //return renderMergedProps(registry[type], props);
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

