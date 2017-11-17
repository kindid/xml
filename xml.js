///////////////////////////////////////////////////////////////////////////////
///(c) kuiash.com ltd 2017+
///////////////////////////////////////////////////////////////////////////////

/***********************************************************************

name    function
el      creates a new XML element
tx      creates a single text node
uc      unclosed element like '<!DOCTYPE>', 'link', 'meta' etc
li      just a list (same as a unnamed element)
xr      inserts RAW text as an element (not as a node itself)
        USE ONLY IN EXTREME CIRCUMSTANCES

All of the above generate a XNode derived object.

prototypes
----------

prototypes.render() converts the XML tree to text and also escape
all entities that is < > & and quote

XML/JS Mappings
---------------

Broadly speaking:
    Javascript maps are used to represent XML attributes
        If a map VALUE is "null" then there is no value and only the attribute
            name will appear in the output - examples are "defer" and "async"
    Javascript lists/vectors/argument arrays are used to represent the children of an element
    Javascript strings represent text nodes
    All other Javascript types are also converted to XML text nodes via "toString()"
        This allows you to pass in your own types and specialise conversion to
        XML by adding a custom "toString()" to your objects prototype

Calling Convention
------------------

The first parameter is the name of the element e.g. 'body' or 'location'

If the second parameter of 'el' or 'uc' is an object then the key/value
pairs will be rendered as XML attributes.

All subsequent parameters are treated this way
    If an array is passed in then all children (and children/children)
        of this array are added to the 'this' element. That is the
        arrays are flattened. This makes the creation of tables and
        lists much easier
    Is an XNode is passed (an object create by el/tx/uc/xr) then it is
        simply appended as a child element, in order to the 'this'
        element
    If the object is of any other type the parameter.toString() is
        called to render it as a text element. This allows JS types
        strings, numbers, bool, null etc to be converted strings

Examples
--------

xml.el('html',
    xml.el('body',
        xml.el('p',
            'here is text ',
            'continuing in the next parameter',
            xml.el('b', 'BOLD!')))).render()

<html><body><p>here is text continuing in the next parameter<b>BOLD!</b></p></body></html>

You may want to look at the 'html' module as it will shorten your typing

html.html(
    html.body(
        html.p(
            'here is text ',
            'continuing in the next parameter',
            html.b('BOLD!'))).render();




***********************************************************************/
function isString(x) {
    return(typeof x === 'string' || x instanceof String);
}
///////////////////////////////////////////////////////////////////////////////
// TODO;rename this 'encodeXML'
function encodeXML(s) {
    return s.
        replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;').
        replace(/"/g, '&quot;').
        replace(/'/g, '&apos;');
}
///////////////////////////////////////////////////////////////////////////////
function XNode() { }
///////////////////////////////////////////////////////////////////////////////
function inherit(what, from) {
    what.prototype = new from;
    what.prototype.constructor = what;
}
///////////////////////////////////////////////////////////////////////////////
function XElement(name, p0) {
    this.name = name;
    let first_e = 1;
    // TODO: this is far too complicated - consider just 4 entry formats
    // "object" is anything that is non-array e.g.
    // p0 instanceof Object && !Array.isArray(p0)
    // string
    // string, object
    // string, array
    // string, object, array
    if ((!Array.isArray(p0)) && (p0 instanceof Object) && !isXNode(p0) && !isString(p0)) {
        this.attr = p0
        first_e++
    }
    this.dsct = [];
    for(let e of [...arguments].slice(first_e)) {
        this.append(e)
    }
}
///////////////////////////////////////////////////////////////////////////////
inherit(XElement, XNode);
///////////////////////////////////////////////////////////////////////////////
XElement.prototype.render = function() {
    let out = ''
    if (this.name !== '') {
        out = '<' + this.name + render_attrs(this.attr)
        if (this.dsct.length > 0) {
            out += '>' +
                this.dsct.reduce((q,e)=>q+e.render(),'') +
                '</' + this.name +  '>'
        } else {
            out += ' />'
        }
    } else {
        out = this.dsct.reduce((q,e)=>q+e.render(),'')
    }
    return out;
}
///////////////////////////////////////////////////////////////////////////////
XElement.prototype.toString = function() {
    return this.render();
}
///////////////////////////////////////////////////////////////////////////////
XElement.prototype.append = function(node) {
    if (isString(node)) {
        this.dsct.push(new XText(node));
    } else if (isXNode(node)) {
        this.dsct.push(node);
    } else if (Array.isArray(node)) {
        //node.map((inner)=>{ this.append(inner)})
        // recursively flatten arrays
        for(let inner_node of node) {
            this.append(inner_node);
        }
    } else {
        try {
            this.dsct.push(new XText(node.toString()));
        } catch(e) {
            // todo; should assert
            console.log("appending node that is neither XNode, string or array = " + JSON.stringify(node));
            console.trace("FORCE ERROR")
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
function XUnclosed(name, attr) {
    this.name = name;
    if (typeof(attr) !== undefined) {
        if (attr instanceof Object) {
            this.attr = attr
        } else {
            console.log('XUnclosed created with non-object for parameters');
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
inherit(XUnclosed, XNode);
///////////////////////////////////////////////////////////////////////////////
XUnclosed.prototype.render = function() {
    return '<' + this.name + render_attrs(this.attr) + '>'
}
///////////////////////////////////////////////////////////////////////////////
function XText(text) {
    this.text = text;
}
inherit(XText, XNode);
///////////////////////////////////////////////////////////////////////////////
XText.prototype.render = function() {
    return encodeXML(this.text)
}
///////////////////////////////////////////////////////////////////////////////
function XRaw(text) {
    this.text = text;
}
inherit(XRaw, XNode);
///////////////////////////////////////////////////////////////////////////////
XRaw.prototype.render = function() {
    return this.text;
}
///////////////////////////////////////////////////////////////////////////////
function render_attrs(attr) {
    let out = ''
    if (typeof attr !== 'undefined') {
        for(key of Object.keys(attr)) {
            let v = attr[key];
            // NOTE; specialiased behaviour. a 'null' value prints only the key
            if (v === null) {
                out += ' ' + key;
            } else {
                out += ' ' + key + '="' + encodeXML(v.toString()) + '"';
            }
        }
    }
    return out;
}

///////////////////////////////////////////////////////////////////////////////
function isXNode(x) {
    return x instanceof XNode;
}
///////////////////////////////////////////////////////////////////////////////
module.exports = {
    'el': function() { return new XElement(...arguments) },
    'tx': function(text) { return new XText(text) },
    'uc': function() { return new XUnclosed(...arguments) },
    'xr': function() { return new XRaw(...arguments) },
    'li': function() { return new XElement('', ...arguments) }
};
