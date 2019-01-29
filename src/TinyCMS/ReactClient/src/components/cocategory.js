import React from 'react';
import { createLinkWrapper } from 'react-cms-link';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
//import { formatMoney } from '../cms-link/helpers';

const isCategory = (node) => {
    return (node.type == 'category');
}

const CoCategory = createLinkWrapper(class CoCategoryBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: props.isOpen||false };
    }
    toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
    render() {
        const { isOpen } = this.state;
        const { name, children = [], isTop = true, id } = this.props;
        const filterd = children.filter(isCategory);
        const cats = isOpen && filterd.map(d => {

            return (
                <CoCategory key={d.id} id={d.id} isTop={false} />
            );
        });
        return (
            <nav className={'menu-top-item-outer' + (isOpen ? ' open' : '')}>
                {filterd.length > 0 && (<a className={isTop ? 'menu-expand-top-item' : 'menu-expand-item'} onClick={this.toggleOpen}></a>)}
                <Link to={'/category/' + id} className="menu-top-item">{name}</Link>
                {/* <a className="menu-top-item" href={'/category/' + id}>{name}</a> */}
                <nav className="menu-items">
                    {isOpen && cats}
                </nav>
            </nav>
        );
    }
}, ({ name, children, id }) => ({ name, children, id }), null, { children: false });

export default CoCategory;