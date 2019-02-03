/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { getCurrentLink } from 'cmslink';

function addListeners(elm, handlers) {
    Object.keys(handlers).map(key => {
        elm.addEventListener(key, (e) => {
            handlers[key](e);
            e.stopPropagation();
        }, false);
    })
}

var currentDragElement = false;
var currentDropElement = false;
var currentDropIndex = false;
var originalParent;
var originalNextNode;
var currentDragData = {};

function updateDropElement(elm) {
    if (currentDropElement != elm) {
        if (currentDropElement)
            currentDropElement.classList.remove('tc-droptarget');
        if (elm) {
            elm.classList.add('tc-droptarget');
        }
        currentDropElement = elm;
    }
}

const targets = [];

function registerDropZone(elm, onDrop) {
    console.log('adding', elm);
    targets.push({ elm, onDrop });
    addListeners(elm, {
        dragenter: (e) => {
            updateDropElement(elm);
        },
        dragleave: (e) => e.preventDefault(),
        drop: (e) => {
            console.log('drop', e);
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

function updateDragElement(elm, data) {
    if (currentDragElement != elm) {
        originalParent = elm.parentNode;
        originalNextNode = elm.nextSibling;
        if (currentDragElement)
            currentDragElement.classList.remove('tc-dragging');
        if (elm) {
            elm.classList.add('tc-dragging');
            currentDragData = data;
        }
        else {
            currentDragData = {};
        }
        currentDragElement = elm;
        updateDropElement(false);
    }
}

function updateDropIndex(elm, e) {
    if (currentDropElement) {

        if (currentDragElement != elm) {
            const elementPosition = elm.getBoundingClientRect();
            const insertAfter = ((e.pageY - elementPosition.top) > (elm.offsetHeight / 2));

            const nextNode = insertAfter ? elm.nextSibling : elm;

            if (currentDropIndex != nextNode) {
                currentDropIndex = nextNode;
                elm.parentNode.insertBefore(currentDragElement, nextNode);
            }

        }
    }
}

function getDropIndex() {
    var child = currentDropIndex;
    var i = 0;
    if (child === false || child == undefined) {
        return -1;
    }
    while ((child = child.previousSibling) != null)
        i++;

    return i - 1;
}

function dragDone(e) {
    var target = targets.filter(item => item.elm == currentDropElement)[0];
    const index = getDropIndex();
    if (target) {
        target.onDrop({
            source: currentDragElement,
            event: e,
            index,
            data: currentDragData
        });
    }
    restoreOriginalLocation();
    updateDragElement(false);
    updateDropElement(false);
}

export const withDragHandle = (WrappedComponent) => {
    return class DragHandle extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isDragging: false,
                isOverDropZone: false
            };
        }
        componentDidMount() {
            const elm = this.dragElement;
            //console.log('init drag', elm);
            addListeners(elm, {
                dragstart: (e) => {
                    const { id } = this.props;
                    var startData = {
                        startTime: Date.now(),
                        id: id
                    };
                    updateDragElement(elm, startData);
                    //e.preventDefault();
                },
                dragover: (e) => {
                    updateDropIndex(elm, e);
                },
                dragend: (e) => {
                    //console.log('drag ended');
                    e.preventDefault();
                    dragDone(e);
                }
            });
        }
        render() {
            const { isDragging, isOverDropZone } = this.state;
            const props = { ...this.props, isDragging, isOverDropZone };
            return (<div draggable ref={(el) => { this.dragElement = el }}><div className="tc-draghandle">M</div><WrappedComponent {...props} /></div>)
        }
    }
}

const isDebug = false;

export class DropContainer extends React.Component {
    componentDidMount() {
        var elm = this.dropZone;
        registerDropZone(elm, (data) => {
            //console.log(`dropped:${data.data.id} in ${this.props.targetId}`);
            const moveData = {
                parentId: this.props.targetId,
                newIndex: data.index,
                id: data.data.id
            };
            if (isDebug) {
                console.log(moveData);
            }
            else {
                getCurrentLink().send('>' + JSON.stringify(moveData));
            }
        });
    }
    render() {
        const { children, className } = this.props;
        return (<div ref={(el) => { this.dropZone = el }} className={className || 'tc-dropzone'}>{children}</div>);
    }
}

export default createLinkWrapper(class ColBase extends Component {
    render() {
        const { children = [], className, id } = this.props;
        return (
            <DropContainer targetId={id} className={className}>
                {children}
            </DropContainer>
        );
    }
}, ({ className }) => ({ className }));
function restoreOriginalLocation() {
    if (currentDragElement.parentNode !== originalParent) {
        if (originalNextNode) {
            originalParent.insertBefore(currentDragElement, originalNextNode);
        }
        else {
            originalParent.appendChild(currentDragElement);
        }
        originalParent = null;
        originalNextNode = null;
    }
}

