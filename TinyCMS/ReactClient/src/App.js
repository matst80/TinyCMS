import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { Editor } from './cms-link/AdminComponents/Editor';
import { LinkedText } from './cms-link/Components/LinkedText';
import { LinkedComponent } from './cms-link/Components/LinkedComponent';
import { componentRegistry } from './cms-link/connection';
import { LinkedRow } from './cms-link/Components/LinkedRow';
import { LinkedCol } from './cms-link/Components/LinkedCol';
import { LinkedImage } from './cms-link/Components/LinkedImage';
import { RouteLinks } from './cms-link/Components/RouteLinks';
import { CMSLink } from './cms-link/Components/CMSLink';
import { LinkedRoutes } from './cms-link/Components/LinkedRoutes';

const Index = () => (
  <div className="container">
    <h2>Home</h2>
    <LinkedText id="othertext" />
    <br />
    <LinkedText id="text2otherpage" />
  </div>
);

const About = () => (
  <div className="container">
    <h2>About</h2>
    <p>
      inget här än
    </p>
  </div>
);

const Users = () => (
  <div className="container">
    <h2>Users</h2>
    <p>
      inget här än
    </p>
  </div>
);

class TestPage extends LinkedComponent {
  render() {
    return (<div className="container">
      <h1>custom page</h1>
      <h2>components on this page</h2>
      {this.renderChildren()}
    </div>
    )
  }
}

componentRegistry.setComponents(
  {
    "row": LinkedRow,
    "col": LinkedCol,
    "users": Users,
    "index": Index,
    "about": TestPage,
    "text": LinkedText,
    "image": LinkedImage,
    "template": () => (<div className="container"><h1>custom</h1></div>)
  });

const AppRouter = () => (
  <Router>
    <CMSLink url={'ws://localhost:5000/ws'}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/">Home</Link>
          <RouteLinks id="root" />
          <Link className="nav-item nav-link" to="/edit/">Edit</Link>
        </div>
      </nav>
      <Route path="/edit/" component={Editor} />
      <Route path="/" exact component={Index} />
      <LinkedRoutes id="root" />

    </CMSLink>
  </Router>
);


export default AppRouter;