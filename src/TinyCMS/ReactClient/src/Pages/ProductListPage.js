import React from 'react';
import { createLinkWrapper } from "react-cms-link";
import { formatMoney } from '../cms-link/helpers';
import AddToCart from '../cms-link/ShopComponents/AddToCart';
import RelatedProducts from '../components/RelatedProducts';
import { NavigationHeader } from '../components/NavigationHeader';

export default createLinkWrapper(class ProductPage extends React.Component {
  componentDidMount() {
    const { match: { params }, setupListener } = this.props;
    setupListener && setupListener(params.id);
    this.scrollToTop();
  }
  componentDidUpdate(prevProps) {
    const { match: { params }, setupListener } = this.props;

    if (params.id !== prevProps.match.params.id) {
      this.scrollToTop();
      setupListener(params.id);
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
    const { id, name } = this.props;
    return (
      <div>
        <NavigationHeader id="cocategory" />
        
          <h1 className="fullpage-header">{name}</h1>

          <RelatedProducts id={id} />

        
      </div>
    );
  }
},
  ({ id, name }) => ({ id, name }));

