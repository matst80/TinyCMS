import React from 'react';
import { createLinkWrapper } from "../cms-link/createLinkWrapper";

export default createLinkWrapper(class Faq extends React.Component {
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
  