
import React, { Component } from 'react';
import AddToCart from './AddToCart';
import { createLinkWrapper } from 'react-cms-link';
import { parseConfig } from './TempArticle';
import { formatMoney } from '../helpers';

const prepareConfig = (items, keys, values) => {
    return items.map((item) => {
        const { pv } = item;

        const props = pv.map((value, key) => {
            const dataValue = keys[key][value];
            const dataString = values[key][value];
            return { [dataValue]: dataString };
        });

        return { ...item, props };
    });
};

const fetchRemoteData = (pageid) => {
    return fetch('/shopproxy/GetCnf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageid })
    }).then(res => res.json()).catch((err)=>{
        return {};
    });
}

const parseProperties = (item, properties, addArticles = true) => {
    const { props } = item;

    return props.forEach((propertyData, propertyIdx) => {
        var v = properties[propertyIdx];

        if (!v.availableAlt)
            v.availableAlt = {};

        Object.keys(propertyData).forEach(propValue => {
            if (!v.availableAlt[propValue]) {
                const text = propertyData[propValue];
                v.availableAlt[propValue] = {
                    text,
                    value: propValue,
                    articles: []
                };
            }
            else if (addArticles)
                v.availableAlt[propValue].articles.push(item);
        });
    });
}

export default createLinkWrapper(class extends Component {
    constructor(props) {
        super(props);
        this.state = { currentFilter: {} };
    }
    componentDidMount() {
        const { pageid } = this.props;
        this._mounted = true;
        this.fetchArticleData(pageid);
    }
    fetchArticleData(pageid) {
        if (pageid) {
            fetchRemoteData(pageid).then(articleData => {
                if (!articleData || !articleData.d)
                    return;
                const allData = parseConfig(articleData.d);
                const data = allData.i;
                const properties = [...allData.p];

                this.propertyList = [...allData.p];
                this.properties = [];

                this.articles = prepareConfig(data.items, data.d, data.val)
                this.articles.forEach((item) => parseProperties(item, properties));
                this.properties = properties;

                if (this._mounted)
                    this.forceUpdate();
            });
        }
    }
    componentDidUpdate(oldprops) {
        const { pageid } = this.props;
        if (pageid !== oldprops.pageid) {
            this.fetchArticleData(pageid);
        }
    }
    updatePropertyState = (active) => {
        this.properties.forEach(({ availableAlt, id }) => {
            Object.values(availableAlt).forEach(prop => {
                prop.disabled = true;
            });
            const activePrp = active.find(prp => prp.id === id);
            if (activePrp) {
                Object.keys(activePrp.availableAlt || {}).forEach(enabledValue => {
                    availableAlt[enabledValue].disabled = false;
                });
            }
        });
    }
    cloneProperties = () => {
        return this.properties.map(({ id }) => ({ id }));
    }
    findMatchingArticles = (currentFilter) => {

        let filterdArticles = [...this.articles];
        for (var filterId in currentFilter) {
            const filterValue = currentFilter[filterId];

            const foundArticles = this.getArticles(filterId, filterValue);
            filterdArticles = this.returnMatching(filterdArticles, foundArticles);

        }
        const properties = this.cloneProperties();
        filterdArticles.forEach((item) => parseProperties(item, properties, false));
        this.matchedProperties = properties;
        this.updatePropertyState(properties);
        this.matchedArticles = filterdArticles;
        if (this._mounted)
            this.forceUpdate();

        console.log('matching art', filterdArticles.length);
    }
    returnMatching = (listA, listB) => {
        var ret = [];
        listA.forEach(a => {
            if (listB.find(b => b.artnr === a.artnr)) {
                ret.push(a);
            }
        })
        return ret;
    }
    componentWillUnmount() {
        this._mounted = false;
    }
    getArticles = (id, value) => {
        const prp = this.properties.find(d => d.id === id);
        return prp.availableAlt[value].articles;
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
    renderPropertyAlternative = ({ value, text, disabled }, format, id) => {
        const formatted = format ? format(value, 1) : text;
        const active = this.state.currentFilter[id] === value;
        return (
            <button key={value} onClick={_ => this.toggleFilter(id, value)} className={'btn btn-success' + (disabled ? ' disabled' : '') + (active ? ' active' : '')}>
                {formatted}
            </button>
        );
    }
    renderProperty = ({ n, id, t, availableAlt, format }) => (
        <div key={id}>
            {n}
            <div className="btn-spacing">
                {Object.values(availableAlt).map(alt => this.renderPropertyAlternative(alt, format, id))}
            </div>
        </div >
    )
    renderArticle = ({ artnr, t, sp }) => {
        const cartArticle = {
            articleNr: artnr,
            name: t,
            price: sp
        };
        return (<div key={artnr}><span>{t} {formatMoney(sp, 0)} kr</span><AddToCart article={cartArticle} /></div>)
    }
    render() {
        if (!this.properties) {
            return (<span>Loading...</span>);
        }
        const props = this.properties.filter(prp => prp.t !== 'hidden').map(this.renderProperty);
        const articles = (this.matchedArticles || []).map(this.renderArticle);

        return (
            <div>
                <div className="product">
                    {props}
                    {this.matchedArticles && (<span>{this.matchedArticles.length} matchedArticles</span>)}
                </div>
                <div>
                    {articles}
                </div>
            </div>);
    }
}, ({ pageid }) => ({ pageid }));
