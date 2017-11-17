///////////////////////////////////////////////////////////////////////////////
///(c) kuiash.com ltd 2017+
///////////////////////////////////////////////////////////////////////////////

/***********************************************************************

name    function
el      creates a new XML element
tx      creates a single text node
uc      unclosed element like '<!DOCTYPE>', 'link', 'meta' etc
xr      inserts RAW text as an element (not as a node itself)
        USE ONLY IN EXTREME CIRCUMSTANCES

All of the above generate a XNode derived object.

prototypes
----------

prototypes.render() converts the XML tree to text and also escape
all entities that is < > & and quote

calling convention
------------------

if the first parameter of 'el' or 'uc' is an object then the key/value
pairs will render as XML attributes

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

examples
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
function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
///////////////////////////////////////////////////////////////////////////////
function XNode() { }
///////////////////////////////////////////////////////////////////////////////
function inherit(what, from) {
    what.prototype = new from;
    what.prototype.constructor = what;
}
///////////////////////////////////////////////////////////////////////////////
// p0? that WILL be an object but NOT of type 'XNode'
function XElement(name, p0) {
    this.name = name;
    var firstChildParam = 1;

    // todo; use 'Array.isArray' to detect first parameter
    // is JUST an array, this is useful, for example, with
    // the 'p' element where there MAY be
    // the problem is that p0 instanceof Object matches
    //  an array (literal or not)

    //console.log(Array.isArray(p0));

    // todo; passing a new String() here will break this
    // to summarise 'isXNode' could return true for a string
    // removing the test has some crazy interesting effects!!!
    if ((!Array.isArray(p0)) && (p0 instanceof Object) && !isXNode(p0) && !isString(p0)) {
        // use object assign.
        this.attr = {};
        for (k in p0) { this.attr[k] = p0[k]; }
        firstChildParam++;
    }
    this.dsct = [];
    for (var p = firstChildParam; p < arguments.length; ++p) {
        if (arguments[p] instanceof Array) {
            for(var j = 0; j < arguments[p].length; j++) {
                this.append(arguments[p][j]);
            }
        } else {
            this.append(arguments[p]);
        }
    }
}

inherit(XElement, XNode);

XElement.prototype.render = function() {
    var out = '<' + this.name;
    // problem. the first thing is an object, simple as that
    //  BUT, so is an XNode.
    // solution, it has to be an object but NOT an XNode
    if (typeof this.attr !== 'undefined') {
        if (Object.keys(this.attr).length) {
            for(var key in this.attr) {
                // todo: if the value of this.attr[key] is null then the
                //  key exists alone. this let's you implement <script async defer src="/script.js">
                var v = this.attr[key];
                if (v === null) {
                    out += ' ' + key;
                } else {
                    out += ' ' + key + '="' + encodeHTML(this.attr[key].toString()) + '"';
                }
            }
        }
    }
    if (this.dsct.length > 0) {
        out += '>';
        for(var i = 0; i < this.dsct.length; ++i) {
            out += this.dsct[i].render();
        }
//        out += '</' + this.name + ' + ' +  (this.attr ? this.attr.id : 'none') + '>';
        out += '</' + this.name +  '>';
    } else {
        out += ' />';
    }
    return out;
}

XElement.prototype.toString = function() {
    return this.render();
}

XElement.prototype.append = function(node) {
    if (isString(node)) {
        this.dsct.push(new XText(node));
    } else if (isXNode(node)) {
        this.dsct.push(node);
    } else if (Array.isArray(node)) {
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
// there's some work up above that might be handy you know.
function XUnclosed(name, attr) {
    this.name = name;
    if (typeof(attr) !== undefined) {
        if (attr instanceof Object) {
            this.attr = {};
            // not perfect at all, possibly use JSON.stringify on attrs[k]
            // todo;try and use Object.assign (note, that doesn't work well but may be much faster)
            for (k in attr) { this.attr[k] = attr[k]; }
        } else {
            // todo; should assert
            console.log('XUnclosed created with non-object for parameters');
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
inherit(XUnclosed, XNode);
///////////////////////////////////////////////////////////////////////////////
XUnclosed.prototype.render = function() {
    var out = '<' + this.name;
    // todo; if (attr in this) {
    if (typeof this.attr !== 'undefined') {
        if (Object.keys(this.attr).length) {
            for(var key in this.attr) {
                if (this.attr[key] === null) {
                    out += ' ' + key;
                } else {
                    out += ' ' + key + '="' + encodeHTML(this.attr[key].toString()) + '"';
                }
            }
        }
    }
    out += '>';
    return out;
}
///////////////////////////////////////////////////////////////////////////////
function XText(text) {
    this.text = text;
}
inherit(XText, XNode);

XText.prototype.render = function() {
    return encodeHTML(this.text);
}

///////////////////////////////////////////////////////////////////////////////

function XRaw(text) {
    this.text = text;
}
inherit(XRaw, XNode);

XRaw.prototype.render = function() {
    return this.text;
}

///////////////////////////////////////////////////////////////////////////////

function isXNode(x) {
    return x instanceof XNode;
}

///////////////////////////////////////////////////////////////////////////////

module.exports = {
    'el': function() { return new XElement(...arguments); },
    'tx': function(text) { return new XText(text); },
    'uc': function() { return new XUnclosed(...arguments); },
    'xr': function() { return new XRaw(...arguments); }
};
