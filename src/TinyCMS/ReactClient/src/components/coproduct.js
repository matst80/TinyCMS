import React from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { formatMoney, renderMergedProps } from '../cms-link/helpers';

export default createLinkWrapper(class CoProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { name, price, description, articleNr, id, imagesBaseUrl, images = [] } = this.props;

        var bgImage = images.length ? (imagesBaseUrl + '303x303/' + images[0]) : '';
        
        return (
            <div className="product" style={{ backgroundImage: `url(${bgImage}` }}>
                <div className="prod-overlay">
                    <Link to={'/product/' + articleNr}>{name}</Link>
                    <span className="price">{formatMoney(price)} kr</span>
                </div>
            </div>
        );
    }
}, ({ name, description, articleNr, price, tax, id, imagesBaseUrl, images }) => ({ name, description, articleNr, price, tax, id, imagesBaseUrl, images }));