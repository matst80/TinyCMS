import React from 'react';
import { schemaHelper } from 'cmslink';

export default class NodeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isOpen: false };
        this.open = this.open.bind(this);
        this.selectNode = this.selectNode.bind(this);

        schemaHelper.getAll().then(allTypes => {
            this.allTypes = allTypes;
            if (this._mounted)
                this.forceUpdate();
        });
    }
    open(onChange) {
        this.onChange = onChange;
        this.setState({ isOpen: true });
    }
    selectNode(nodeType) {
        const onNodeSelected = this.onChange;
        if (onNodeSelected) {
            onNodeSelected(nodeType);
            this.setState({ isOpen: false });
        }
    }
    render() {
        const { isOpen } = this.state;
        if (!isOpen)
            return null;
        const nodes = (this.allTypes || []).map(nodeType => {
            return (<div key={nodeType} onClick={_ => this.selectNode(nodeType)}>{nodeType}</div>);
        });
        return (<div className="nodeselector card">
            {nodes}
        </div>);
    }
}
