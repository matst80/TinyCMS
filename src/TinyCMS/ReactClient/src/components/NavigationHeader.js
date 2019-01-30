import React from 'react';
import { createLinkWrapper } from 'react-cms-link';

const MainCategory = createLinkWrapper(class CoMainCategory extends React.Component {
    render() {
        const { children } = this.props;
        return (
            <div>{children}</div>
        );
    }
});

export class NavigationHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }
    toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
    render() {
        const { isOpen } = this.state;
        return (
            <header className={'header' + (isOpen ? ' open' : '')}>
                <div className="header-buttons">
                    <a className="logo" href="/sv/"></a>
                    <a className="header-button header-menu-button" onClick={this.toggleOpen}>
                        <span className="header-button-icon header-menu-button-icon"></span>
                        <span className="header-button-text">Meny</span>
                    </a>
                    <a className="header-button header-language-button">
                        <span className="header-button-icon header-language-button-icon"></span>
                        <span className="header-button-text">Språk</span>
                    </a>
                </div>
                {isOpen ? (
                    <nav className="header-panel navigation-menu-panel">
                        <div className="search-panel-input-outer">
                            <input className="search-panel-input" type="text" placeholder="Sök" />
                            <a className="search-panel-button"></a>
                        </div>
                        <div className="search-panel-hits"></div>

                        <a className="search-panel-hits-not-found header-teaser">Vi hittade inte det du sökte</a>
                        <a className="search-panel-hits-shop-teaser header-teaser" href="https://www.clasohlson.com/se/">Letar du efter produkter? Besök butiken här</a>

                        <div className="menu">
                            {/* <RouteLinks id="root" /> */}
                            <MainCategory id="cocategories" />
                        </div>

                        <div className="menu-teasers">
                            <a className="header-teaser" href="https://www.clasohlson.com/se/">Letar du efter produkter? Besök butiken här</a>
                        </div>
                    </nav>
                ) : null}
            </header>

            // <nav className="navbar navbar-expand-lg navbar-light bg-light" >
            //     <div className="container">
            //         <div className="navbar-nav">
            //             <Link className="nav-item nav-link" to="/">Home</Link>
            //             <RouteLinks id="root" />
            //             {/* <Link className="nav-item nav-link" to="/edit/">Edit</Link> */}
            //             <Cart />
            //         </div>
            //     </div>
            // </nav >
        );
    }
}