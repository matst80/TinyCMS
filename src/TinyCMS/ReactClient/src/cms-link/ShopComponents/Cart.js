import React, { Component } from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { getOrder } from '../shop';
import { setSession } from 'cmslink';

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
        const { order, order: { articles }, isOpen, orderId } = this.props;
        const totalNoi = articles.length;
        return (
            <span className="cart nav-item nav-link">
                <span onClick={() => { setSession({ cart: { isOpen: !isOpen, order, orderId } }) }}>({totalNoi})</span>
                <div className={'cart-articles' + (isOpen ? ' show' : '')}>
                    {articles && this.renderItems(articles)}
                </div>
            </span>
        );
    }
},
    ({ showTax = true }) => ({ showTax }),
    ({ cart: { order, orderId, isOpen } }) => ({ order, orderId, isOpen }), { children: false })