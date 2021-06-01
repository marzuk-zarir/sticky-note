/**
 * Create Element with Attribute
 * if tag name is invalid it creates 'div' element
 */
function createElement() {
    let tag = arguments[0];
    let attributes = arguments[1] || arguments[0];

    if (arguments.length === 0) {
        throw new Error('Invalid Arguments Field');
    }

    if (arguments.length === 1 && typeof arguments[0] !== 'object') {
        return document.createElement(arguments[0]);
    }

    if (arguments.length === 1 && typeof arguments[0] === 'object') {
        tag = 'div';
    }

    let element = document.createElement(tag);

    for (let attr in attributes) {
        element.setAttribute(attr, attributes[attr]);
    }

    return element;
}

export { createElement };
