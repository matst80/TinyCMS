import React from 'react';
import { routeSelector, withLinkSelector, createLinkWrapper } from "react-cms-link";
import { formatMoney } from '../cms-link/helpers';
import AddToCart from '../cms-link/ShopComponents/AddToCart';
import RelatedProducts from '../components/RelatedProducts';
import { NavigationHeader } from '../components/NavigationHeader';

export default withLinkSelector(createLinkWrapper(class ProductPage extends React.Component {
  render() {
    const { name, description, parentId, price, articleNr, properties = [], images = [], imagesBaseUrl } = this.props;
    const imgs = images.map((d, i) => {
      const bgStyle = { backgroundImage: `url(${imagesBaseUrl}600x600/${d})` };
      return (
        <div key={d} className={i == 0 ? 'first' : 'img'} style={bgStyle} />);
    });
    const attrs = properties.map(({ key, value, unit }, idx) => {
      return (<li key={articleNr + idx}>{key}: {value} {unit}</li>);
    })
    return (
      <div>
        <NavigationHeader id="cocategory" />
        <div className="page-header-outer">
          <div className="page-header">
            <h1 className="page-header-title">{name}</h1>
          </div>
        </div>

        <div className="prd-img">
          {imgs}
        </div>
        <div className="body-padding">
          <div className="body-max-width">
            <div className="body-max-width-inner">
              <div>
                <strong>{articleNr}</strong>
                <p>{description}</p>
                <ul>
                  {attrs}
                </ul>
                <span>{formatMoney(price)} kr</span>
                <AddToCart article={this.props} />
              </div>
            </div>
          </div>
        </div>
        {parentId && (<RelatedProducts id={parentId} />)}
      </div>
    );
  }
},
  ({ name, description, parentId, price, properties, articleNr, imagesBaseUrl, images }) => ({ name, description, parentId, price, properties, articleNr, imagesBaseUrl, images })), routeSelector('artnr'));

