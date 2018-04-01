import React, { Component } from 'react';

class ListItem extends Component {
    editItem = (e = false) => {
        if (!this.props.item.selected) {
            this.props.store.selectItemById(this.props.id)
            return
        }

        const title = prompt('Item', this.props.item.title)
        if (title) {
            this.props.store.updateItemById(this.props.id, {
                ...this.props.item,
                title,
            })
        }

    }

    addSubItem = () => {
        this.props.addSubItem(this.props.id)
    }

    toggleShowChildren = () => this.props
        .store
        .setChildrenVisibilityById(this.props.id, !this.props.item.showChildren)

    render() {
        const {
            item,
            id,
            store,
        } = this.props

        const classNames = "ListItem" + (item.selected ? " selected" : "")

        const subItems = store.findItemsByParentId(id)

        return <div>
            <div className={classNames}>
                <span className="title" onClick={this.editItem}>{`${item.title}`} <a onClick={this.toggleShowChildren}>({subItems.length})</a></span>

                {item.selected && <span className="actions">
                    <button onClick={this.addSubItem}>+</button>
                </span>}
            </div>

            {item.showChildren
                && subItems.length > 0
                && <ul>{subItems.map(child => <ListItem item={child} id={child.id} key={child.id} store={store} />)}</ul>}
        </div>
    }
}

export default ListItem;
