


const getLink = function () {
    if (!window.cmslink) {
        require('./cmslink');
    }
    return window.cmslink;
}

console.log('linking', window.cmslink);

export const createLink = getLink().createLink;
export const getCurrentLink = getLink().getCurrentLink;
export const hasValidToken = getLink().hasValidToken;
export const onAuthenticationChanged = getLink().onAuthenticationChanged;
export const schemaHelper = getLink().schemaHelper;
export const sessionChanged = getLink().sessionChanged;
export const setSession = getLink().setSession;
export const signInWithToken = getLink().signInWithToken;

