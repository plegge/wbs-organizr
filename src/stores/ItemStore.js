import { action, computed, configure, observable } from 'mobx'

configure({ enforceActions: true })

const NEXT_SIBLING = 'NEXT_SIBLING'
const PREVIOUS_SIBLING = 'PREVIOUS_SIBLING'

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
            showChildren: showChildren || false,
        }

        this._list = this._list.concat(newItem)

        config.SELECT_NEW_ITEM && this.selectItemById(newItem.id)

        if (parentId) {
            this.setChildrenVisibilityById(parentId, true)
        }

        return newItem.id
    }

    @action
    removeItemById = (id) => {
        if (id === config.ROOT_ID) {
            return
        }

        this.selectPreviousSibling()
            || this.selectParent()

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
        showChildren: showChildren && (this.findItemsByParentId(id).length > 0),
    }))

    @action
    updateItemById = (id, newItem) =>
        this._findItemAndApply(id, (oldItem) => ({
            ...oldItem,
            ...newItem,
            id,
        }))

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
    selectPreviousSibling = (currentItem = false) => {
        return this._selectSibling(currentItem || this.selectedItem, PREVIOUS_SIBLING)
    }

    @action
    selectNextSibling = (currentItem = false) => {
        return this._selectSibling(currentItem || this.selectedItem, NEXT_SIBLING)
    }

    @action
    selectNextParentSibling = (currentItem = this.selectedItem) => {
        if (currentItem.id === config.ROOT_ID) {
            return null
        }

        let parent = this.findItemById(currentItem.parentId)
        let sibling = this._findSibling(parent, NEXT_SIBLING)

        while (sibling === null && parent.id !== config.ROOT_ID) {
            parent = this.findItemById(parent.parentId)
            sibling = this._findSibling(parent, NEXT_SIBLING)
        }

        if (sibling) {
            this.selectItemById(sibling)
        }

        return sibling
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

        return childId
    }

    @action
    selectLastChildFromPreviousSibling = () => {

        const previousSiblingId = this._findSibling(this.selectedItem, PREVIOUS_SIBLING)

        if (!previousSiblingId) {
            return false
        }

        let lastChildId = previousSiblingId
        let found = true

        while (found) {
            const childId = this.findItemsByParentId(lastChildId)
                .map(item => item.id)
                .reduce((selectedId, childId) => childId, null)

            if (childId) {
                lastChildId = childId
            } else {
                found = false
            }
        }

        lastChildId = (lastChildId === previousSiblingId)
            ? null
            : lastChildId

        if (lastChildId) {
            this.selectItemById(lastChildId)
        }

        return lastChildId
    }

    @action
    removeSelected = () => {
        this.removeItemById(this.selectedItem.id)
    }

    @action
    showChildrenFromSelected = (item = this.selectedItem) => {
        return (item.showChildren)
            ? false
            : this.setChildrenVisibilityById(item.id, true) && true
    }

    @action
    hideChildrenFromSelected = (item = this.selectedItem) => {
        return (!item.showChildren)
            ? false
            : this.setChildrenVisibilityById(item.id, false) && true
    }

    _findSibling = (currentItem, direction) => {
        const siblings = this._getSiblingsIdList(currentItem)
        const getList = direction === NEXT_SIBLING
            ? this._getNextFromList
            : this._getPreviousFromList

        const { itemId, found } = getList(siblings, currentItem.id)

        return found && itemId
            ? itemId
            : null
    }

    _selectSibling = (currentItem, direction) => {
        const itemId = this._findSibling(currentItem, direction)

        if (itemId) {
            this.selectItemById(itemId)
        }

        return itemId
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

    _getNextFromList = (list, selectedId) => this
        ._getPreviousFromList(list.reverse(), selectedId)

    _getSiblingsIdList = (item) => this.findItemsByParentId(item.parentId)
        .map(sibling => sibling.id)

    _createRoot() {
        this.addItem({
            id: config.ROOT_ID,
            title: config.ROOT_LABEL,
            parentId: null,
            selected: true,
            isRoot: true,
            showChildren: false,
        })
    }
}

export default ItemStore
export const ROOT_ID = config.ROOT_ID
