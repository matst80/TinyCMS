/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { getCurrentLink } from 'cmslink';

const MoveIcon = ({ size = 20 }) => (<svg style={{ width: size, height: size }} aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M337.782 434.704l-73.297 73.782c-4.686 4.686-12.284 4.686-16.971 0l-73.296-73.782c-4.686-4.686-4.686-12.284 0-16.97l7.07-7.07c4.686-4.686 12.284-4.686 16.971 0L239 451.887h1V272H60.113v1l41.224 40.741c4.686 4.686 4.686 12.284 0 16.971l-7.071 7.07c-4.686 4.686-12.284 4.686-16.97 0L3.515 264.485c-4.686-4.686-4.686-12.284 0-16.971l73.782-73.297c4.686-4.686 12.284-4.686 16.971 0l7.071 7.071c4.686 4.686 4.686 12.284 0 16.971L60.113 239v1H240V60.113h-1l-40.741 41.224c-4.686 4.686-12.284 4.686-16.971 0l-7.07-7.071c-4.686-4.686-4.687-12.284 0-16.97l73.297-73.782c4.686-4.686 12.284-4.686 16.971 0l73.297 73.782c4.686 4.686 4.686 12.284 0 16.971l-7.071 7.071c-4.686 4.686-12.284 4.686-16.971 0L273 60.113h-1V240h179.887v-1l-41.224-40.741c-4.686-4.686-4.686-12.284 0-16.971l7.071-7.07c4.686-4.686 12.284-4.686 16.97 0l73.782 73.297c4.687 4.686 4.686 12.284 0 16.971l-73.782 73.297c-4.686 4.686-12.284 4.686-16.97 0l-7.071-7.07c-4.686-4.686-4.686-12.284 0-16.971L451.887 273v-1H272v179.887h1l40.741-41.224c4.686-4.686 12.284-4.686 16.971 0l7.07 7.071c4.686 4.685 4.686 12.283 0 16.97z"></path></svg>);

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
            console.log(elm);
            elm.classList.add('tc-droptarget');
            if (currentDragElement)
                elm.appendChild(currentDragElement);
        }
        currentDropElement = elm;
    }
}

const targets = [];

function registerDropZone(elm, onDrop) {
    //console.log('adding', elm);
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

            if (currentDropIndex != nextNode && currentDragElement) {
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
    const subtract = currentDropElement==originalParent?-1:0;
    return i + subtract;
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

function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    }
}

export const withDragHandle = (WrappedComponent, showHandle = false, needsEvents = false, extraDragData = {}) => {
    return class DragHandle extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                isDragging: false,
                noEditor: true,
                isHoverd: false
            };
        }
        componentDidMount() {
            const elm = this.dragElement;
            const hover = debounce(() => {
                if (needsEvents) {
                    restoreOriginalLocation(false);
                    this.setState({ isHoverd: true });
                }
            }, 400);
            //console.log('init drag', elm);
            addListeners(elm, {
                dragstart: (e) => {
                    const { id } = this.props;
                    var startData = {
                        startTime: Date.now(),
                        id: id,
                        ...extraDragData
                    };
                    if (needsEvents) {
                        this.setState({ isDragging: true });
                    }
                    updateDragElement(elm, startData);
                    //e.preventDefault();
                },
                dragover: (e) => {
                    updateDropIndex(elm, e);
                    hover();
                },
                dragend: (e) => {
                    //console.log('drag ended');
                    e.preventDefault();
                    dragDone(e);
                    if (needsEvents) {
                        this.setState({ isDragging: false });
                    }
                }
            });
        }
        render() {
            const { isDragging, isHoverd } = this.state;
            const props = { ...this.props, isDragging, isHoverd };
            return (<div className="tc-draggable" draggable ref={(el) => { this.dragElement = el }}>{showHandle && (<div className="tc-draghandle"><MoveIcon /></div>)}<WrappedComponent {...props} /></div>)
        }
    }
}

const isDebug = false;

export class DropContainer extends React.Component {
    componentDidMount() {
        var elm = this.dropZone;
        registerDropZone(elm, (data) => {
            //console.log(`dropped:${data.data.id} in ${this.props.targetId}`);
            console.log('drop data', data)
            if (data.data.createNew) {
                const addData = {
                    type: data.data.id,
                    parentId: this.props.targetId
                };
                getCurrentLink().send('+' + JSON.stringify(addData));
            }
            else {
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

function restoreOriginalLocation(resetNodes = true) {
    if (currentDragElement.parentNode !== originalParent) {
        if (originalNextNode) {
            originalParent.insertBefore(currentDragElement, originalNextNode);
        }
        else {
            originalParent.appendChild(currentDragElement);
        }
        if (resetNodes) {
            originalParent = null;
            originalNextNode = null;
        }
    }
}

