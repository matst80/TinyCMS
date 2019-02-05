import React from 'react';
import { createLinkWrapper } from 'react-cms-link';
import CoCategory from './cocategory';
import { isOfType } from 'react-cms-link';
import CoSearch from './cosearch';

export const NavigationHeader = createLinkWrapper(class NavigationHeaderBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
    }
    toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
    render() {
        const { isOpen } = this.state;
        const { nodes = [] } = this.props;
        return (
            <header className={'header' + (isOpen ? ' open' : '')}>
                <div className="header-buttons">
                    <a className="logo" href="/sv/" />
                    <a className="header-button header-menu-button" onClick={this.toggleOpen}>
                        <span className="header-button-icon header-menu-button-icon" />
                        <span className="header-button-text">Meny</span>
                    </a>
                    <a className="header-button header-language-button">
                        <span className="header-button-icon header-language-button-icon" />
                        <span className="header-button-text">Språk</span>
                    </a>
                </div>

                {isOpen && (
                    <nav key={'menu'} className="header-panel navigation-menu-panel">
                        <CoSearch />

                        <a className="search-panel-hits-not-found header-teaser">Vi hittade inte det du sökte</a>
                        <a className="search-panel-hits-shop-teaser header-teaser" href="https://www.clasohlson.com/se/">Letar du efter produkter? Besök butiken här</a>

                        <div className="menu">
                            {/* {nodes.map(({ name, id }) => (<span key={id}>{id} {name}</span>))}
                            <CoCategory id="1030S" /> */}
                            {nodes.map(({ id }) => (<CoCategory key={id} id={id} isTop />))}

                        </div>

                        <div className="menu-teasers">
                            <a className="header-teaser" href="https://www.clasohlson.com/se/">Letar du efter produkter? Besök butiken här</a>
                        </div>
                    </nav>
                )}
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
}, ({ name, children = [] }) => ({ name, nodes: children.filter(isOfType('category')) }));