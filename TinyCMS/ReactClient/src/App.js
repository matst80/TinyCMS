import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Editor from './cms-link/AdminComponents/Editor';

import { componentRegistry } from './cms-link/connection';
import RouteLinks from './cms-link/Components/RouteLinks';
import CMSLink from './cms-link/Components/CMSLink';
import LinkedRoutes from './cms-link/Components/LinkedRoutes';
import ObjectEditor from './cms-link/AdminComponents/ObjectEditor';

import Index from './Pages/Index';
import Docs from './Pages/Docs';
import QuickStart from './Pages/QuickStart';
import Faq from './Pages/Faq';
import { mergeLinkedComponents } from './cms-link/Components';
import { mergeShopComponents } from './cms-link/ShopComponents';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faCaretRight, faPlusSquare, faSquare, faSpinner, faWifi, faPen } from '@fortawesome/free-solid-svg-icons';
import './scss/app.scss';
import './scss/editor.scss';
import Cart from './cms-link/ShopComponents/Cart';
import { createLinkWrapper } from './cms-link/createLinkWrapper';

library.add(faTimes, faCaretRight, faPlusSquare, faSquare, faSpinner, faWifi, faPen);

function Ucfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const styleKeys = ['backgroundColor', 'color', 'padding', 'margin'];

const getUnitString = (unit, styleObj, name) => {
  for (var key in unit) {
    if (unit[key]) {
      styleObj[name + Ucfirst(key)] = unit[key] + 'px';
    }
  }
}

const getStyle = (data) => {
  var ret = {};
  for (var key in data) {
    if (styleKeys.indexOf(key) !== -1) {
      var val = data[key];
      if (val.top !== undefined) {
        getUnitString(val, ret, key);
      }
      else
        ret[key] = val;
    }
  }
  return ret;
}

const StyleDemo = createLinkWrapper(class StyleDemoBase extends React.Component {
  render() {
    const { children = [] } = this.props;
    const style = getStyle(this.props);
    console.log('setting style', style, this.props);
    return (<div style={style}>{children}</div>);
  }
}, (data) => data);

componentRegistry.setComponents(
  mergeShopComponents(
    mergeLinkedComponents({
      "docs": Docs,
      "stylednode": StyleDemo,
      "quickstart": QuickStart,
      "faq": Faq,
      "index": Index,
      "about": Index,
      "page": Index
    })));

const App = () => (
  <Router>
    <CMSLink url={'ws://localhost:5000/ws'}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <div className="navbar-nav">
            <Link className="nav-item nav-link" to="/">Home</Link>
            <RouteLinks id="root" />
            <Link className="nav-item nav-link" to="/edit/">Edit</Link>
            <Cart />
          </div>
        </div>
      </nav>
      <Route path="/edit/" component={Editor} />
      <Route path="/" exact component={Index} />
      <LinkedRoutes id="root" />
      <ObjectEditor />
    </CMSLink>
  </Router >
);

export default App;