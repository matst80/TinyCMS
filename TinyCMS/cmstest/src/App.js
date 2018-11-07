import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

const createLink = (settings) => {
  const { url } = settings;
  const socket = new WebSocket(url);
  const nodeCache = {};

  const listeners = {};

  const triggerListeners = (id, data) => {
    const listenersForId = listeners[id];
    if (listenersForId)
      listenersForId.map(listener => {
        if (!listener.stopped) {
          listener.callback(data);
        }
      })
  }

  const parseNodesToCache = (data, parentId) => {
    const { id, children } = data;
    if (id) {
      nodeCache[id] = data;
      triggerListeners(id, data);
    }
    if (children) {
      children.map(child => parseNodesToCache(child, id));
    }
  }

  const connect = () => {
    socket.onopen = (event) => {
      console.log('connected', event);
      socket.send('?root');
    }
    socket.onmessage = (event) => {
      //console.log('gotmessage', event);
      const jsonData = JSON.parse(event.data);
      console.log('json', jsonData);
      parseNodesToCache(jsonData);
      console.log(nodeCache);
    }

  }

  const send = (data) => {
    return socket.send(data);
  }

  connect();

  return {
    send,
    getById: (id) => {
      send(id)
    },
    listenTo: (id, callback) => {
      const ret = {
        id,
        stopped: false,
        stop: () => { },
        resume: () => { },
        callback
      };
      if (!listeners[id]) {
        listeners[id] = [ret]
      }
      else listeners[id].push(ret);
      if (nodeCache[id]) {
        if (!ret.stopped)
          callback(nodeCache[id]);
      }
      return ret;
    }
  }
}

const cmsLink = createLink({ url: 'ws://localhost:5000/ws' });

class LinkedComponent extends Component {
  constructor(props) {
    super(props);
    this.linked = {};
    this._link = cmsLink.listenTo(props.id, (data) => {
      console.log('got data', data)
      const linkedData = this.filterProperties(data);
      if (this.deepEqual(this.linked, linkedData)) {
        this.linked = linkedData;
        if (this._mounted)
          this.forceUpdate()
      }

    });
  }
  deepEqual = (a, b) => {
    if (a === b)
      return false;
    return (JSON.stringify(a) !== JSON.stringify(b));
  }
  setLinkedProperties = (filterFunction) => {
    this.filterFunction = filterFunction;
  }
  filterProperties = (props) => {
    if (this.filterFunction)
      return this.filterFunction(props);
    return props;
  }
  store(valueObject) {
    const { id } = this.props;
    const sendObject = { ...valueObject, id: id };
    const jsonstring = JSON.stringify(sendObject);
    console.log('sending:',jsonstring);
    cmsLink.send(`=${jsonstring}`)
  }
  componentDidMount() {
    const { id } = this.props;
    this._mounted = true;
  }
  componentWillUnmount() {
    this._mounted = false;
  }
}

class LinkedText extends LinkedComponent {
  constructor(props) {
    super(props);
    this.setLinkedProperties(({ value }) => {
      return { value };
    })
  }
  render() {
    console.log('render linked text');
    const { value } = this.linked;
    return (<span onBlur={(el) => {
      console.log(el);
      this.store({ value: el.target.innerHTML });
    }} contentEditable>{value}</span>);
  }
}


const Index = () => <div><h2>Home</h2><LinkedText id="c22e39b4-1a92-41fe-b729-69660412f88f" /><span>efter link</span></div>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

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

      <Route path="/" exact component={Index} />
      <Route path="/about/" component={About} />
      <Route path="/users/" component={Users} />
    </div>
  </Router>
);

export default AppRouter;