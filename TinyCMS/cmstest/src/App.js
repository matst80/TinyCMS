import React, { Component } from 'react';
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

const Index = () => <div><h2>Home</h2><LinkedText id="c22e39b4-1a92-41fe-b729-69660412f88f" /><span>efter link</span><LinkedText id="4e567a97-8d81-4c22-8ecb-c81365f12945" /></div>;
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