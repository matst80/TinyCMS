import React from 'react';
import { signInWithToken } from 'cmslink';
import { GoogleLogin } from 'react-google-login';

export const CmsGoogleLogin = () => (
    <GoogleLogin
        buttonText="Login"
        clientId="1020405052548-c177prrtihlgsfiqg839r247fl2459pp.apps.googleusercontent.com"
        onSuccess={(data) => {
            signInWithToken(data.tokenId);
        }}
    />
)
