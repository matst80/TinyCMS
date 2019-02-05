import React from 'react';
import { createLinkWrapper, isOfType } from 'react-cms-link';
import CoProduct from './coproduct';

const getProperties = (products) => {
    var ret = {};
    products.map(prod => {
        prod.properties.map(({ key, value }) => {
            if (!ret[key])
                ret[key] = [value];
            else {
                const found = ret[key];
                if (found.indexOf(value) == -1) {
                    found.push(value);
                }
            }
        })
    });
    return ret;
}

const hasNewProducts = (old, curr) => {
    if (!old && !curr)
        return false;
    if (!old && (curr && curr.length))
        return true;
    if (!old || (old.length != curr.length))
        return true;
    return false;
}

export default createLinkWrapper(class RelatedProducts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFilter: {}
        };
    }
    componentDidUpdate(oldProps) {
        const { products } = this.props;
        const hasChanged = hasNewProducts(oldProps.products, products);
        if (hasChanged || (!this.articles && !!products)) {
            this.parseProducts(products);
        }
    }
    parseProducts(products) {
        const filterd = products.filter(d => d.type == 'coproduct');
        filterd.forEach(prod => {
            prod.propertyObject = {};
            prod.properties.map(({ key, value }) => {
                prod.propertyObject[key] = value;
            });
        });
        this.articles = filterd;
        this.properties = getProperties(filterd);
        this.matchedArticles = filterd;
        this.matchedProperties = this.properties;
        this.setState({ currentFilter: {} });
        //this.forceUpdate();
    }
    returnMatching = (listA, listB) => {
        var ret = [];
        listA.forEach(a => {
            if (listB.find(b => b.articleNr === a.articleNr)) {
                ret.push(a);
            }
        })
        return ret;
    }
    getArticles = (id, value) => {
        const articles = [];
        this.articles.map(prod => {
            if (prod.propertyObject[id] == value) {
                articles.push(prod);
            }
        });
        return articles;
    }
    findMatchingArticles = (currentFilter) => {

        let filterdArticles = [...this.articles];
        for (var filterId in currentFilter) {
            const filterValue = currentFilter[filterId];

            const foundArticles = this.getArticles(filterId, filterValue);
            filterdArticles = this.returnMatching(filterdArticles, foundArticles);

        }

        this.matchedProperties = getProperties(filterdArticles);

        this.matchedArticles = filterdArticles;
        if (this._mounted)
            this.forceUpdate();

    }
    toggleFilter = (id, value) => {
        const { currentFilter } = this.state;
        if (currentFilter[id] === value)
            delete currentFilter[id];
        else
            currentFilter[id] = value;

        this.findMatchingArticles(currentFilter);
        this.setState({ currentFilter });
    }
    renderFilter() {
        const filterCategories = Object.keys(this.properties || []).map(key => {
            const matchedProp = this.matchedProperties[key];
            const values = this.properties[key].sort().map(value => {
                const active = this.state.currentFilter[key] === value;
                const disabled = !matchedProp || matchedProp.indexOf(value) == -1;
                return (
                    <button key={value} onClick={() => this.toggleFilter(key, value)} className={'btn btn-success' + (disabled ? ' disabled' : '') + (active ? ' active' : '')}>
                        {value}
                    </button>
                );
            });
            return (
                <div className="filter-category" key={key}>
                    <strong>{key}</strong>
                    <div className="values">{values}</div>
                </div>
            );
        });

        return (<div className="page-header-outer filter-container">{filterCategories}</div>);
    }
    handleSync = () => {
        this.props.store({
            syncHash: (Math.random() * 1000) + ''
        });
    }
    render() {

        const products = (this.matchedArticles || []).map(({ id }) => {
            return (<CoProduct key={id} id={id} />);
        });
        const showSync = !this.matchedArticles || this.matchedArticles.length == 0;
        return (
            <div>
                <div>{this.renderFilter()}</div>
                {showSync && (<blockquote className="syncmessage" onClick={this.handleSync}>Sync category...</blockquote>)}
                <div className="hlist">{products}</div>
            </div>
        );
    }
}, ({ name, children = [] }) => ({ name, products: children.filter(isOfType('coproduct')) }), null, { children: false })