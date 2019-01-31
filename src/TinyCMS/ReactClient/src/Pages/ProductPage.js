import React from 'react';
import { createLinkWrapper } from "react-cms-link";
import { formatMoney } from '../cms-link/helpers';
import AddToCart from '../cms-link/ShopComponents/AddToCart';
import RelatedProducts from '../components/RelatedProducts';
import { NavigationHeader } from '../components/NavigationHeader';

export default createLinkWrapper(class ProductPage extends React.Component {
  componentDidMount() {
    const { match: { params }, setupListener } = this.props;
    setupListener && setupListener(params.artnr);
    this.scrollToTop();
  }
  componentDidUpdate(prevProps) {
    const { match: { params }, setupListener } = this.props;
    if (params.artnr !== prevProps.match.params.artnr) {
      this.scrollToTop();
      setupListener(params.artnr);
    }
  }
  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
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
        <div className="prd-img">
          {imgs}
        </div>
        <div className="body-padding">
          <div className="body-max-width">
            <div className="body-max-width-inner">

              <div>
                <h1>{name}</h1>


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
  ({ name, description, parentId, price, properties, articleNr, imagesBaseUrl, images }) => ({ name, description, parentId, price, properties, articleNr, imagesBaseUrl, images }));

