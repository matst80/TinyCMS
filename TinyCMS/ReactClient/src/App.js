import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { Editor } from './cms-link/AdminComponents/Editor';
import { LinkedText } from './cms-link/Components/LinkedText';
import { componentRegistry, setSession } from './cms-link/connection';
import { LinkedRow } from './cms-link/Components/LinkedRow';
import { LinkedCol } from './cms-link/Components/LinkedCol';
import { LinkedImage } from './cms-link/Components/LinkedImage';
import { RouteLinks } from './cms-link/Components/RouteLinks';
import { CMSLink } from './cms-link/Components/CMSLink';
import { LinkedRoutes } from './cms-link/Components/LinkedRoutes';
import { createLinkWrapper } from './cms-link/createLinkWrapper';
import { ObjectEditor } from './cms-link/AdminComponents/PropertyEditor';

const Index = () => (
  <div className="container">
    <h2>Home</h2>
    <LinkedText id="othertext" />
    <br />
    <LinkedText id="text2otherpage" />
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

const CustomPage = createLinkWrapper(class extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>custom page</h1>
        <h2>components on this page</h2>
        <p>{this.props.counter} clicks</p>
        {this.props.children}
      </div>
    );
  }
},
  undefined,
  ({ counter }) => ({ counter }));


componentRegistry.setComponents(
  {
    "row": LinkedRow,
    "col": LinkedCol,
    "users": Users,
    "index": Index,
    "about": CustomPage,
    "page": CustomPage,
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
      <button className="btn brn-primary" onClick={_ => {
        setSession(({ counter }) => {
          const newCounterValue = counter || 0;
          return { counter: newCounterValue + 1 };
        });
      }}> +</button>
      <ObjectEditor />
    </CMSLink>
  </Router >
);


export default AppRouter;