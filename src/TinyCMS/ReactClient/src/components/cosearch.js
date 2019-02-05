import React from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { formatMoney } from '../cms-link/helpers';
import AddToCart from '../cms-link/ShopComponents/AddToCart';

const fetchSearchResult = (value, params) => {
    return fetch(`/cosearch/product?q=${value}&page=0&take=100&languageid=s&countryid=se&useLite=false`).then(d => d.json());
}

export default createLinkWrapper(class CoSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: {},
            searchParams: {

            }
        };
    }
    handleSearch = (event) => {
        const { searchParams } = this.state;
        const { target: { value } } = event;
        if (value && value.length > 2) {
            fetchSearchResult(value, searchParams).then(result => {
                this.setState({ result });
            });
        }
    }
    render() {
        const { result: { Products } } = this.state;
        const results = (Products || []).map(({
            HeaderText,
            Article,
            Prices,
            BodyText
        }) => {
            const cartArticle = {
                articleNr: Article,
                name: HeaderText,
                price: Prices[0].Price
            };
            return (
                <div key={Article}>
                    <strong>{HeaderText}</strong>
                    <p>{BodyText}</p>
                    <span>{formatMoney(Prices[0].Price, 0)}</span>
                    <AddToCart article={cartArticle} />
                </div>);
        });
        return (
            <div>
                <div className="search-panel-input-outer">
                    <input onChange={this.handleSearch} className="search-panel-input" type="text" placeholder="Sök" />
                    <a className="search-panel-button" />
                </div>
                <div className="search-panel-hits">{results}</div>
            </div>
        );
    }
}, ({ noi }) => ({ noi }));