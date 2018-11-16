import React, { Component } from 'react';
import { createLinkWrapper } from "../createLinkWrapper";
import { setSession } from '../connection';

const createCart = () => {
    return fetch('/api/shop/cart').then(res => res.json());
}

const addArticleToCart = (id, articleData) => {
    return fetch(`/api/shop/cart/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
    }).then(res => res.json()).then(order => {
        if (order && order.id)
            setSession({ cart: { order, orderId: order.id } });
        return order;
    });
}

const getCart = (orderId) => {
    return fetch(`/api/shop/cart/${orderId}`).then(res => res.json());
}

const getOrder = (orderId) => {
    return ((orderId && orderId.length) ? getCart(orderId) : createCart()).then(order => {
        if (order && order.id)
            setSession({ cart: { order, orderId: order.id } });
        return order;
    });
}

export const AddToCart = createLinkWrapper(class extends Component {
    addToCart = () => {
        const { orderId, article } = this.props;
        console.log('adding', article);
        getOrder(orderId).then(order => {
            addArticleToCart(order.id, article || {}).then(d => {
                console.log('added article');
            });
        })
    }
    render() {
        return (
            <div className="add-to-cart">
                <button className="btn btn-primary" onClick={this.addToCart}>Add to cart</button>
            </div>
        );
    }
},
    ({ showTax = true }) => ({ showTax }),
    ({ cart: { order, orderId, isOpen } }) => ({ order, orderId, isOpen }), { children: false });