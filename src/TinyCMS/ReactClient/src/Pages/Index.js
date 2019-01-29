import React from 'react';
import { createLinkWrapper } from "react-cms-link";
import { CmsGoogleLogin } from '../cms-link/Components/CmsGoogleLogin';
import { setSession, hasValidToken } from 'cmslink';
//import { NavigationHeader } from '../components/NavigationHeader';

export default createLinkWrapper(class IndexBase extends React.Component {
    render() {
        return (
            <div>
  
                <div className="container">
                    <h1>MyWorkplace</h1>
                    <p className="signin-status">
                        {hasValidToken() ? (<span>Signed in</span>) : (<CmsGoogleLogin />)}
                    </p>
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
            </div>
        );
    }
},
    undefined,
    ({ counter }) => ({ counter }));