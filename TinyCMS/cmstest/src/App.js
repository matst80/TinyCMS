import React, { Component } from 'react';
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
    return (<span onBlur={(el) => {
      console.log(el);
      this.store({ value: el.target.innerHTML });
    }} contentEditable>{value}</span>);
  }
}


const Index = () => <div><h2>Home</h2><LinkedText id="c22e39b4-1a92-41fe-b729-69660412f88f" /><span>efter link</span><LinkedText id="4e567a97-8d81-4c22-8ecb-c81365f12945" /></div>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

class TreeNode extends LinkedComponent {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
    this.connect(({ name, children }) => {
      return { name, children };
    })
  }
  render() {
    const { id, type } = this.props;
    const { isOpen } = this.state;
    const { children = [] } = this.linked;
    const nodes = isOpen ? (<ul>
      {children.map(node => (<TreeNode key={node.id} id={node.id} type={node.type} />))}
    </ul>) : (<span>&nbsp;{children.length}</span>);
    return (
      <li>
        <span onClick={() => {
          this.setState(s => {
            return { isOpen: !s.isOpen }
          })
        }}>{id}</span>
        <Link to={'/edit/' + id}>edit</Link>
        {nodes}
      </li>);
  }
}

class KeyValueEditor extends Component {
  render() {
    const { name, value, onChange } = this.props;
    return (<div key={name}>
      <label htmlFor={name}>{name}</label>
      <input id={name} defaultValue={value} onChange={({ target }) => { onChange && onChange({ [name]: target.value }) }} />
    </div>)
  }
}

class PropertyEditor extends LinkedComponent {
  constructor(props) {
    const { match: { params: { nodeId } } } = props;
    super(props, nodeId);
  }
  componentDidUpdate(prevProps) {
    const { match: { params: { nodeId } } } = this.props;
    const { match: { params } } = prevProps;
    if (nodeId != params.nodeId) {
      this.setupListener(nodeId);
    }
  }
  handleChange = (objectToStore) => {
    this.store(objectToStore);
  }
  render() {
    const { match: { params: { nodeId } } } = this.props;
    const properties = [];
    for (var name in this.linked) {
      const value = this.linked[name];
      properties.push((<KeyValueEditor key={nodeId+name} name={name} value={value} onChange={this.handleChange} />));
    }
    return (
      <div><span>editor: {nodeId}</span>
        {properties}</div>
    );
  }
}

class Edit extends Component {
  render() {
    const { match } = this.props;
    console.log('render edit', match, `${match.path}/:nodeId`);
    return (<div>
      <div>
        <EditNodeTree id="root" />
      </div>
      <div>
        <Route path={`${match.path}:nodeId`} component={PropertyEditor} />
        <Route
          exact
          path={match.path}
          render={() => <h3>Please select a node.</h3>}
        />
      </div>
    </div>);
  }
}

class EditNodeTree extends LinkedComponent {
  render() {
    const { children = [] } = this.linked;
    return (<ul>
      {children.map(node => (<TreeNode key={node.id} id={node.id} type={node.type} />))}
    </ul>)
  }
}

const AppRouter = () => (

  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about/">About</Link>
          </li>
          <li>
            <Link to="/users/">Users</Link>
          </li>
        </ul>
      </nav>
      <CMSLink url={'ws://localhost:5000/ws'}>
        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
        <Route path="/edit/" component={Edit} />
      </CMSLink>
    </div>
  </Router>

);

export default AppRouter;