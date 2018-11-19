import React, { Component } from 'react';
import { createLinkWrapper } from "../createLinkWrapper";
import { getOrder } from '../shop';

export default createLinkWrapper(class extends Component {
    componentDidUpdate(prevProps) {
        const { orderId } = this.props;
        if (prevProps.orderId !== orderId)
            this.updateOrder();
    }
    updateOrder = () => {
        const { orderId } = this.props;
        getOrder(orderId).then(order => {
            console.log('order changed', orderId);
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
        const { order: { articles } } = this.props;
        const totalNoi = articles.length;
        return (
            <div className="cart">
                <span>({totalNoi})</span>
                {articles && this.renderItems(articles)}
            </div>
        );
    }
}, ({ showTax = true }) => ({ showTax }), ({ cart: { order, orderId, isOpen } }) => ({ order, orderId, isOpen }), { children: false })