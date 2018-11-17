import React, { Component } from 'react';
import { createLinkWrapper } from "../createLinkWrapper";
import { getOrder } from '../shop';

export const Cart = createLinkWrapper(class extends Component {
    componentDidMount() {
        const { orderId } = this.props;
        getOrder(orderId).then(order => {
            
        });
    }
    renderItems(articles) {
        if (articles && articles.length)
            return articles.map(({ name, noi }, idx) => (
                <div key={idx}>
                    <span>{name}</span> <span>{noi}</span>
                </div>
            ));
        return (<span>No articles in cart</span>);
    }
    render() {
        if (!this.props.order) {
            return (<span>Empty cart</span>);
        }
        const { order: { articles }, orderId } = this.props;
        return (
            <div className="cart">
                <span>{orderId}</span>
                {articles && this.renderItems(articles)}
            </div>
        );
    }
}, ({ showTax = true }) => ({ showTax }), ({ cart: { order, orderId, isOpen } }) => ({ order, orderId, isOpen }), { children: false })