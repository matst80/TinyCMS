import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import { Editor } from './cms-link/AdminComponents/Editor';
import { LinkedText } from './cms-link/Components/LinkedText';
import { componentRegistry, setSession, signInWithToken, hasValidToken } from './cms-link/connection';
import { LinkedRow } from './cms-link/Components/LinkedRow';
import { LinkedCol } from './cms-link/Components/LinkedCol';
import { LinkedImage } from './cms-link/Components/LinkedImage';
import { RouteLinks } from './cms-link/Components/RouteLinks';
import { CMSLink } from './cms-link/Components/CMSLink';
import { LinkedRoutes } from './cms-link/Components/LinkedRoutes';
import { createLinkWrapper } from './cms-link/createLinkWrapper';
import { ObjectEditor } from './cms-link/AdminComponents/PropertyEditor';
import { Product } from './cms-link/ShopComponents/Product';
import { GoogleLogin } from 'react-google-login';
import { Cart } from './cms-link/ShopComponents/Cart';

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

const Login = () => (
  <GoogleLogin clientId="1020405052548-c177prrtihlgsfiqg839r247fl2459pp.apps.googleusercontent.com" buttonText="Login" onSuccess={(data) => {
    console.log(data);
    signInWithToken(data.tokenId).then(res => {
      console.log(res);
    });
  }} />
)

const CustomPage = createLinkWrapper(class extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>custom page</h1>
        <h2>components on this page</h2>
        {hasValidToken() ? (<span>Signed in</span>) : (<Login />)}
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
    "nodeproduct": Product,
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
        <Cart />
      </nav>
      <Route path="/edit/" component={Editor} />
      <Route path="/" exact component={Index} />
      <LinkedRoutes id="root" />
      <div className="container">
        <button className="btn btn-primary" onClick={_ => {
          setSession(({ counter }) => {
            const newCounterValue = counter || 0;
            return { counter: newCounterValue + 1 };
          });
        }}>+</button>
      </div>
      <ObjectEditor />
    </CMSLink>
  </Router >
);


export default AppRouter;