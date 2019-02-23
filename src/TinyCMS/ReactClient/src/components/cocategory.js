import React from 'react';
import { isOfType, createLinkWrapper } from 'react-cms-link';
import { BrowserRouter as Router, Link } from "react-router-dom";
//import { formatMoney } from '../cms-link/helpers';

const isCategory = isOfType('category');

const CoCategory = createLinkWrapper(class CoCategoryBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: !!props.isOpen };
    }
    toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }
    render() {
        const { isOpen } = this.state;
        const { name, nodes = [], isTop = true, id } = this.props;
        
        const link = `/category/${id}`;
        const cats = isOpen && nodes.map(d => (
            <CoCategory key={d.id} id={d.id} isTop={false} />
        ));
        return (
            <nav className={'menu-top-item-outer' + (isOpen ? ' open' : '')}>
                {nodes.length > 0 && (<a className={isTop ? 'menu-expand-top-item' : 'menu-expand-item'} onClick={this.toggleOpen} />)}
                <Link to={link} className="menu-top-item">{name}</Link>
                <nav className="menu-items">
                    {isOpen ? cats : null}
                </nav>
            </nav>
        );
    }
}, ({ name, children=[], id }) => ({ name, nodes: children.filter(isCategory), id }), null, { children: false });

export default CoCategory;