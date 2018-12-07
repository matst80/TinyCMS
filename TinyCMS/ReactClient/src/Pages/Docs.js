import React from 'react';
import { createLinkWrapper } from "react-cms-link";

export default createLinkWrapper(class Docs extends React.Component {
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
  