/* eslint-disable react/no-multi-comp */
import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { componentRegistry, CMSLink, createLinkWrapper } from 'react-cms-link';
import { ObjectEditor } from 'react-cms-editor';
import LinkedRoutes from './cms-link/Components/LinkedRoutes';
import Index from './Pages/Index';
import Docs from './Pages/Docs';
import QuickStart from './Pages/QuickStart';
import Faq from './Pages/Faq';
import { mergeLinkedComponents } from './cms-link/Components';
import { mergeShopComponents } from './cms-link/ShopComponents';
import './scss/app.scss';
import './../node_modules/react-cms-editor/build/main.css';
import CoSearch from './components/cosearch';
import cocategory from './components/cocategory.js';
import coproduct from './components/coproduct.js';
import ProductPage from './Pages/ProductPage.js';
import ProductListPage from './Pages/ProductListPage';
import { EditorAdmin } from './Pages/EditorAdmin';
import { Contract, ContractSite } from './components/MWComponents';

// function Ucfirst(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

// const styleKeys = ['backgroundColor', 'color', 'padding', 'margin', 'outline'];

// const getUnitString = (unit, styleObj, name) => {
//   for (var key in unit) {
//     if (unit[key]) {
//       styleObj[name + Ucfirst(key)] = unit[key] + 'px';
//     }
//   }
// }

// const getStyle = (data) => {
//   var ret = {};
//   for (var key in data) {
//     if (styleKeys.indexOf(key) !== -1) {
//       var val = data[key];
//       if (val.top !== undefined) {
//         getUnitString(val, ret, key);
//       }
//       else
//         ret[key] = val;
//     }
//   }
//   return ret;
// }



// const StyleDemo = createLinkWrapper(class StyleDemoBase extends React.Component {
//   render() {
//     const { children = [] } = this.props;
//     const style = getStyle(this.props);
//     console.log('setting style', style, this.props);
//     return (<div style={style}>{children}</div>);
//   }
// }, (data) => data);

componentRegistry.setComponents(
  mergeShopComponents(
    mergeLinkedComponents({
      "coproduct": coproduct,
      "cosearch": CoSearch,
      //"categoryholder": MainCategory,
      "category": cocategory,
      "docs": Docs,
      //"three-renderer": LinkedRenderer,
      //"entity": LinkedEntity,
      "contract": Contract,
      "contractsite": ContractSite,
      //      "stylednode": StyleDemo,
      "quickstart": QuickStart,
      "faq": Faq,
      "productpage": ProductPage,
      "index": Index,
      "about": Index,
      "page": Index
    })));


// const catRoot = {};
// const catFlat = [];
// const firstLevel = [];
// catlist.map(({ CategoryId, Name, Level, ParentId }) => {
//   return {
//     id: CategoryId,
//     lvl: Level,
//     name: Name,
//     parentId: ParentId
//   }
// }).map(cat => {
//   catFlat[cat.id] = cat;
//   if (cat.lvl == 1) {
//     firstLevel.push(cat);
//   }
// });

// catFlat.map(cat => {
//   var parent = catFlat[cat.parentId];
//   if (parent) {
//     if (!parent.children) {
//       parent.children = [];
//     }
//     parent.children.push(cat);
//   }
// });


//console.log(firstLevel);


const App = () => (
  <Router>
    <CMSLink url={'ws://localhost:5000/ws'}>
      <Route path="/" exact component={Index} />
      <LinkedRoutes id="root" />
      <Route path={`/product/:artnr`} component={ProductPage} />
      <Route path={`/category/:id`} component={ProductListPage} />
      <Route path="/edit/" component={EditorAdmin} />
      {/* <ObjectEditor /> */}
    </CMSLink>
  </Router >
);

export default App;