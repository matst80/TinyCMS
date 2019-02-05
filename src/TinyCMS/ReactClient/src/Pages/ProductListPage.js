import React from 'react';
import { createLinkWrapper, withLinkSelector, routeSelector } from "react-cms-link";
import { formatMoney } from '../cms-link/helpers';
import AddToCart from '../cms-link/ShopComponents/AddToCart';
import RelatedProducts from '../components/RelatedProducts';
import { NavigationHeader } from '../components/NavigationHeader';

export default withLinkSelector(createLinkWrapper(class ProductPage extends React.Component {
  // componentDidMount() {
  //   const { match: { params }, setupListener } = this.props;
  //   setupListener && setupListener(params.id);
  //   this.scrollToTop();
  // }
  // componentDidUpdate(prevProps) {
  //   const { match: { params }, setupListener } = this.props;

  //   if (params.id !== prevProps.match.params.id) {
  //     this.scrollToTop();
  //     setupListener(params.id);
  //   }
  // }
  // scrollToTop = () => {
  //   window.scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth'
  //   });
  // }
  render() {
    const { id, name } = this.props;
    return (
      <div>
        <NavigationHeader id="cocategory" />
        <div className="page-header-outer">
          <div className="page-header">
            <h1 className="page-header-title">{name}</h1>
          </div>
        </div>
        <div className="body-padding">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec maximus ac lorem in hendrerit. Pellentesque tellus magna, aliquet id lacus eu, fringilla venenatis lorem. Nulla lacinia tempor bibendum. Nam id est vitae lectus pharetra venenatis vel a elit. Aenean eros sapien, accumsan non rutrum mollis, iaculis sit amet metus. Pellentesque tincidunt nisi sed lorem egestas finibus. Donec ac pellentesque nibh. Duis iaculis lorem felis, in pulvinar eros varius non. Pellentesque ultrices non lorem vitae ultrices. Maecenas sed arcu vitae odio ornare mollis. Mauris sit amet diam dignissim, tempus metus sit amet, interdum ante. Donec eget velit elit. Etiam nec lectus a velit lacinia iaculis. Mauris aliquet elementum efficitur. Nam a est enim. Etiam imperdiet nulla at mi egestas hendrerit.</p>
        </div>
        <RelatedProducts id={id} />


      </div>
    );
  }
},
  ({ id, name }) => ({ id, name })), routeSelector());

