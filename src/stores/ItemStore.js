import { action, computed, observable } from 'mobx'

const config = {
    SELECT_NEW_ITEM: false,
    ROOT_ID: 'root',
    ROOT_LABEL: 'Home',
}

class ItemStore {
    constructor() {
        this._createRoot()
    }

    @observable
    _list = []

    @computed
    get list() {
        return this._list.filter(item => !item.deleted)
    }

    @action
    addItem = ({ id, title, parentId, selected, isRoot, deleted, showChildren }) => {
        if (id && this.list.map(item => item.id).includes(id)) {
            return id
        }

        const newItem = {
            title,
            parentId,
            id: id || Date.now(),
            selected: selected || false,
            isRoot: isRoot || false,
            deleted: deleted || false,
            showChildren: showChildren || true,
        }

        this._list = this._list.concat(newItem)

        config.SELECT_NEW_ITEM && this.selectItemById(newItem.id)

        return newItem.id
    }

    @action
    removeItemById = (id) => {
        if (id === config.ROOT_ID) {
            return
        }

        this.selectPreviousSibling()
        this._findItemAndApply(id, (item) => ({ ...item, deleted: true }))
    }

    @action
    selectItemById = (id) => this._findItemAndApply(id,
        (item) => ({ ...item, selected: true }),
        (item) => ({ ...item, selected: false })
    )

    @action
    setChildrenVisibilityById = (id, showChildren) => this._findItemAndApply(id, (item) => ({
        ...item,
        showChildren,
    }))

    @action
    updateItemById = (id, newItem) => this._findItemAndApply(id, (oldItem) => ({ ...newItem, id }))

    @computed
    get selectedItem() {
        return this.list
            .filter(item => item.selected)
            .reduce((value, item) => item, null)
    }

    findItemById = (id) => this.list
        .filter(item => item.id === id)
        .reduce((selected, current) => current, null)

    findItemsByParentId = (parentId) => this.list
        .filter(item => item.parentId === parentId)

    @action
    selectPreviousSibling = () => {
        const {
            itemId,
            found,
        } = this._getPreviousFromList(this
            .findItemsByParentId(this.selectedItem.parentId)
            .map(item => item.id),
            this.selectedItem.id)

        if (found && itemId) {
            this.selectItemById(itemId)
        } else if (!itemId && this.selectedItem.id !== config.ROOT_ID) {
            this.selectItemById(this.selectedItem.parentId)
        }
    }

    @action
    selectNextSibling = () => {
        const {
            itemId,
            found,
        } = this._getNextFromList(this
            .findItemsByParentId(this.selectedItem.parentId)
            .map(item => item.id),
            this.selectedItem.id)

        if (found && itemId) {
            this.selectItemById(itemId)
        } else if (!itemId) {
            console.log('selecting selectFirstChild')
            this.selectFirstChild()
        }
    }

    @action
    selectParent = () => {
        if (this.selectedItem.id !== config.ROOT_ID) {
            this.selectItemById(this.selectedItem.parentId)
        }
    }

    @action
    selectFirstChild = () => {
        const childId = this.findItemsByParentId(this.selectedItem.id)
            .map(item => item.id)
            .reduce((selectedId, childId) => selectedId ? selectedId : childId, false)

        if (childId !== false) {
            this.selectItemById(childId)
        }
    }

    @action
    removeSelected = () => {
        this.removeItemById(this.selectedItem.id)
    }

    _doNotModify = (item) => item

    _findItemAndApply = (id, modifier, modifierIfNotItem = this._doNotModify) =>
        this._list = this._list
            .map(item => item.id === id
                ? modifier(item)
                : modifierIfNotItem(item))

    _getPreviousFromList = (list, selectedId) => list
        .reduce(({ itemId, found }, current) => ({
            found: found || current === selectedId,
            itemId: found || current === selectedId ? itemId : current,
        }), { itemId: null, found: false })

    _getNextFromList = (list, selectedId) => this._getPreviousFromList(list.reverse(), selectedId)

    _createRoot() {
        this.addItem({
            id: config.ROOT_ID,
            title: config.ROOT_LABEL,
            parentId: 0,
            selected: true,
            isRoot: true,
            showChildren: true,
        })
    }
}

export default ItemStore
export const ROOT_ID = config.ROOT_ID
