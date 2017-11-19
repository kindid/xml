///////////////////////////////////////////////////////////////////////////////
///(c) kuiash.com ltd 2017+ code@kuiash.com ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function isString(x)
{
    return(typeof x === 'string' || x instanceof String);
}
///////////////////////////////////////////////////////////////////////////////
function encodeXML(s)
{
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
function inherit(what, from)
{
    what.prototype = new from;
    what.prototype.constructor = what;
}
///////////////////////////////////////////////////////////////////////////////
// TODO; 'STRICT' mode - ATM I assume you know what you're doing(!)
// TODO: check name is valid (see regex)
// TODO: check names of attributes
// TODO: report errors in children (no toString etc)
function XElement(name, p0)
{
    this.name = name
    this.dsct = []
    let first_e = 1
    if (!(Array.isArray(p0) || isString(p0) || isXNode(p0))) {
        if (p0 instanceof Object) {
            this.attr = p0
        } else {
            if (typeof p0 !== 'undefined') {
                console.log('XElement created with non-object for attributes');
            }
        }
        first_e = 2
    }
    [...arguments].slice(first_e).map((e)=>{this.append(e)})
}
///////////////////////////////////////////////////////////////////////////////
inherit(XElement, XNode);
///////////////////////////////////////////////////////////////////////////////
XElement.prototype.render = function()
{
    let out = ''
    if (this.name !== '') {
        out = '<' + this.name + render_attrs(this.attr)
        if (this.dsct.length > 0) {
            out += '>' + this.dsct.reduce((q,e)=>q+e.render(),'') + '</' + this.name +  '>'
        } else {
            out += ' />'
        }
    } else {
        out = this.dsct.reduce((q,e)=>q+e.render(),'')
    }
    return out;
}
///////////////////////////////////////////////////////////////////////////////
XElement.prototype.toString = function()
{
    return this.render();
}
///////////////////////////////////////////////////////////////////////////////
XElement.prototype.append = function(node)
{
    if (isString(node)) {
        this.dsct.push(new XText(node));
    } else if (isXNode(node)) {
        this.dsct.push(node);
    } else if (Array.isArray(node)) {
        node.map((inner)=>{ this.append(inner)})
    } else {
        try {
            this.dsct.push(new XText(node.toString()));
        } catch(e) {
            console.log("appending node that is neither XNode, string or array & has no toString = " + JSON.stringify(node));
        }
    }
}
///////////////////////////////////////////////////////////////////////////////
function XUnclosed(name, attr)
{
    this.name = name;
    if (attr instanceof Object) {
        this.attr = attr
    } else {
        console.log('XUnclosed created with non-object for attributes');
    }
}
inherit(XUnclosed, XNode)
///////////////////////////////////////////////////////////////////////////////
XUnclosed.prototype.render = function()
{
    return '<' + this.name + render_attrs(this.attr) + '>'
}
///////////////////////////////////////////////////////////////////////////////
function XText(text) { this.text = text; }
inherit(XText, XNode)
///////////////////////////////////////////////////////////////////////////////
XText.prototype.render = function() { return encodeXML(this.text) }
///////////////////////////////////////////////////////////////////////////////
function XRaw(text) { this.text = text; }
inherit(XRaw, XNode)
///////////////////////////////////////////////////////////////////////////////
XRaw.prototype.render = function() { return this.text; }
///////////////////////////////////////////////////////////////////////////////
function render_attrs(attr)
{
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
function isXNode(x)
{
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
