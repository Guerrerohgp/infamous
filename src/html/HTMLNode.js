
import Class from 'lowclass'
import styles from './HTMLNode.style'
//import Sizeable from '../core/Sizeable'
//import Transformable from '../core/Transformable'
import DeclarativeBase, {initDeclarativeBase, proxyGettersSetters} from './DeclarativeBase'

initDeclarativeBase()

const HTMLNode = Class('HTMLNode').extends( DeclarativeBase, ({ Public, Private, Super }) => ({

    construct() {
        Super(this).construct()
    },

    getStyles() {
        return styles
    },

    static: {

        // TODO: get these from somewhere dynamically, and do same for
        // proxyGettersSetters and _updateNodeProperty
        observedAttributes: (DeclarativeBase.observedAttributes || []).concat([
            'opacity',
            'sizemode',
            'size',
            'align',
            'mountpoint',
            'rotation',
            'position',
            'scale',
            'origin',
            'skew',
        ]),

    },

    attributeChangedCallback(...args) {
        Super(this).attributeChangedCallback(...args)
        Private(this)._updateNodeProperty(...args)
    },

    private: {

        _updateNodeProperty(attribute, oldValue, newValue) {
            // attributes on our HTML elements are the same name as those on
            // the Node class (the setters).
            if (newValue !== oldValue) {
                if (attribute == 'opacity')
                    Public(this)[attribute] = window.parseFloat(newValue)
                else if (attribute == 'sizemode')
                    Public(this)[attribute] = parseStringArray(newValue)
                else if (
                    attribute == 'size'
                    || attribute == 'align'
                    || attribute == 'mountpoint'
                    || attribute == 'rotation'
                    || attribute == 'position'
                    || attribute == 'scale'
                    || attribute == 'origin'
                    || attribute == 'skew'
                ) {
                    Public(this)[attribute] = parseNumberArray(newValue)
                }
            }
        },

    },
}))

// This associates the Transformable getters/setters with the HTML-API classes,
// so that the same getters/setters can be called from HTML side of the API.
//proxyGettersSetters(Transformable, HTMLNode)
//proxyGettersSetters(Sizeable, HTMLNode)

function parseNumberArray(str) {
    checkIsNumberArrayString(str)
    const numbers = str.trim().split(/(?:\s*,\s*)|(?:\s+)/g)
    const length = numbers.length
    if (length > 0) numbers[0] = window.parseFloat(numbers[0])
    if (length > 1) numbers[1] = window.parseFloat(numbers[1])
    if (length > 2) numbers[2] = window.parseFloat(numbers[2])
    return numbers
}

function parseStringArray(str) {
    checkIsSizeArrayString(str)
    const strings = str.trim().toLowerCase().split(/(?:\s*,\s*)|(?:\s+)/g)
    const length = strings.length
    if (length > 0) strings[0] = strings[0]
    if (length > 1) strings[1] = strings[1]
    if (length > 2) strings[2] = strings[2]
    return strings
}

function checkIsNumberArrayString(str) {
    if (!str.match(/^\s*(((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s*,){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))))|((\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+)))\s){0,2}(\s*(-|\+)?((\.\d+)|(\d+\.\d+)|(\d+)|(\d+(\.\d+)?e(-|\+)?(\d+))))))\s*$/g))
        throw new Error(`Attribute must be a comma- or space-separated sequence of up to three numbers, for example "1 2.5 3". Yours was "${str}".`)
}

function checkIsSizeArrayString(str) {
    if (!str.match(/^\s*(((\s*([a-zA-Z]+)\s*,){0,2}(\s*([a-zA-Z]+)))|((\s*([a-zA-Z]+)\s*){1,3}))\s*$/g))
        throw new Error(`Attribute must be a comma- or space-separated sequence of up to three strings, for example "literal proportional". Yours was "${str}".`)
}

export {HTMLNode as default}
