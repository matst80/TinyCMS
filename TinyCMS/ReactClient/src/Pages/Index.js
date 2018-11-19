import React from 'react';
import { createLinkWrapper } from "../cms-link/createLinkWrapper";
import { CmsGoogleLogin } from '../cms-link/Components/CmsGoogleLogin';
import { setSession, hasValidToken } from '../cms-link/connection';
import Cart from '../cms-link/ShopComponents/Cart';

export default createLinkWrapper(class IndexBase extends React.Component {
    render() {
        return (
            <div className="container">
                <h1>custom page</h1>
                <h2>components on this page</h2>
                <Cart />
                {hasValidToken() ? (<span>Signed in</span>) : (<CmsGoogleLogin />)}
                <p>{this.props.counter} clicks</p>
                {this.props.children}
                
                <button
                    className="btn btn-primary"
                    onClick={() => {
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