import React from 'react';
import { Edit } from './Edit';
import { CMSLink, LinkedComponent } from './cms-link';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';



class LinkedText extends LinkedComponent {
  constructor(props) {
    super(props);
    this.connect(({ value }) => {
      return { value };
    })
  }
  render() {
    const { value } = this.linked;
    return (<span onBlur={({ target }) => {
      this.store({ value: target.innerHTML });
    }} contentEditable>{value}</span>);
  }
}

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

class PageRouteLinks extends LinkedComponent {
  constructor(props) {
    super(props);
    this.connect(({ children }) => ({ children: children.filter(node => node.type === 'page') }));
  }
  render() {
    const { children = [] } = this.linked;
    return children.map(({ name, url, id }) => (<Link className="nav-item nav-link" key={id} to={url}>{name}</Link>))

  }
}

const templates = {
  "users": Users,
  "index": Index,
  "about": About,
  "template": () => (<div className="container"><h1>custom</h1></div>)
}

class LinkedRoutes extends LinkedComponent {
  constructor(props) {
    super(props);
    this.connect(({ children }) => ({
      children: children
        .filter(node => node.type === 'page')
        .map(({ url, id, templateId }) => ({ url, id, templateId }))
    }));
  }
  render() {
    const { children = [] } = this.linked;
    return children.map(({ url, id, templateId = 'users' }) => (<Route key={id} path={url} component={templates[templateId]} />));

  }
}


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