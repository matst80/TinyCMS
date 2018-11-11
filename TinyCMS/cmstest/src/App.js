import React from 'react';
import { Edit } from './Edit';
import { CMSLink, LinkedComponent, componentRegistry, LinkedChildComponent, PageRouteLinks, LinkedRoutes, LinkedText } from './cms-link';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';





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

class TestPage extends LinkedChildComponent {
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
    "users": Users,
    "index": Index,
    "about": TestPage,
    "text": LinkedText,
    "template": () => (<div className="container"><h1>custom</h1></div>)
  });

const AppRouter = () => (
  <Router>
    <CMSLink url={'ws://localhost:5000/ws'}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="navbar-nav">

          <Link className="nav-item nav-link" to="/">Home</Link>
          <PageRouteLinks id="root" />
          <Link className="nav-item nav-link" to="/edit/">Edit</Link>

        </div>
      </nav>
      <Route path="/edit/" component={Edit} />
      <Route path="/" exact component={Index} />
      <LinkedRoutes id="root" />

    </CMSLink>
  </Router>
);


export default AppRouter;