
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { base16AteliersulphurpoolLight } from 'react-syntax-highlighter/dist/styles/prism';

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './scss/app.scss';
import './scss/editor.scss';
import { Editor } from './cms-link/AdminComponents/Editor';
import { LinkedText, Header, Section } from './cms-link/Components/LinkedText';
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faCaretRight, faPlusSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

library.add(faTimes, faCaretRight, faPlusSquare, faSquare);

const Index = () => (
  <div className="container">
    <h2>Home</h2>
    <LinkedText id="othertext" />
    <br />
    <LinkedText id="text2otherpage" />
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

const CodeViewer = ({ code, codeLang }) => (<div><SyntaxHighlighter language={codeLang} style={base16AteliersulphurpoolLight}>{code}</SyntaxHighlighter></div>);

const CodeView = createLinkWrapper(CodeViewer, ({ code, codeLang }) => ({ code, codeLang }));

const Docs = createLinkWrapper(class extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <div className="container">
        <h1>{name}</h1>
        {this.props.children}
      </div>
    );
  }
},
  ({ name }) => ({ name }));

const Faq = createLinkWrapper(class extends React.Component {
  render() {
    const { name } = this.props;
    return (
      <div className="container">
        <h1>{name}</h1>
        {this.props.children}
      </div>
    );
  }
},
  ({ name }) => ({ name }));

const QuickStart = createLinkWrapper(class extends React.Component {
  render() {
    const { name, sections } = this.props;
    return (
      <div className="container">
        <h1>{name}</h1>
        <ul className="sectionLinks">
          {(sections || []).map(({ id, title }) => (
            <li><a key={id} href={`#${id}`}>{title}</a></li>
          ))}
        </ul>
        {this.props.children}
      </div>
    );
  }
},
  ({ name, children = [] }) => ({ name, sections: children.filter(d => d.type === 'section') }));

const Example = createLinkWrapper(class extends React.Component {
  render() {
    return (
      <div className="container">
        <h1>custom page</h1>
        <h2>components on this page</h2>
        {hasValidToken() ? (<span>Signed in</span>) : (<Login />)}
        <p>{this.props.counter} clicks</p>
        {this.props.children}
        <Cart />
        <button className="btn btn-primary" onClick={_ => {
          setSession(({ counter }) => {
            const newCounterValue = counter || 0;
            return { counter: newCounterValue + 1 };
          });
        }}>+</button>
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
    "code": CodeView,
    "header": Header,
    "section": Section,
    "docs": Docs,
    "quickstart": QuickStart,
    "faq": Faq,
    "nodeproduct": Product,
    "index": Index,
    "about": Example,
    "page": Example,
    "text": LinkedText,
    "image": LinkedImage,
    "template": () => (<div className="container"><h1>custom</h1></div>)
  });

const AppRouter = () => (
  <Router>
    <CMSLink url={'ws://localhost:5000/ws'}>
      {/* <div className="topbar"></div> */}
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


export default AppRouter;