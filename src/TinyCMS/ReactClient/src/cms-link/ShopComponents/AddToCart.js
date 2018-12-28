import React, { Component } from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { getOrder, addArticleToCart } from '../shop';


export default createLinkWrapper(class AddToCart extends Component {
    addToCart = () => {
        const { orderId, article } = this.props;
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