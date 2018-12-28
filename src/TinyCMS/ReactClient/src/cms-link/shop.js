import { setSession } from 'cmslink';

const createCart = () => {
    return fetch('/api/shop/cart').then(res => res.json());
}

export const addArticleToCart = (id, articleData) => {
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

export const getOrder = (orderId) => {
    return ((orderId && orderId.length) ? getCart(orderId) : createCart()).then(order => {
        if (!!order && order.id)
            setSession({ cart: { order, orderId: order.id } });
        return order;
    });
}
