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


library.add(faTimes, faCaretRight, faPlusSquare, faSquare, faSpinner, faWifi, faPen);

componentRegistry.setComponents(
  mergeShopComponents(
    mergeLinkedComponents({
      "docs": Docs,
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