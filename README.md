# ```xml``` A Simple XML generator for node. An experiment in learning.

## PLEASE NOTE; This API is considered to be "in progress". In particular it has yet to be decided if the complicated test in ```x.el``` for attributes remains or whether it is mandatory that all child elements are placed in an array, this would add extra markup to the Javascript but would (may) make the internal engine easier to understand.

### Exports

name | function
-----|----------------------------
el | Creates a new XML element. If the element has no name then it is simply a collection of further elements (equivalent )
tx | codereates a single text node
uc | Unclosed element like '<!DOCTYPE>', 'link', 'meta' etc
li | Just a list (same as a unnamed element)
xr | Inserts RAW text as an element (not as a node itself) **USE ONLY IN EXTREME CIRCUMSTANCES**

All of the above generate a XNode derived object.

### Prototypes

XNode.prototype.toString() converts the XML tree to text and also escapes all entities that is < > & apostrophe & quote

### XML/JS Mappings

Broadly speaking:
- Javascript maps are used to represent XML attributes
 - If a map VALUE is "null" then there is no value and only the attribute name will appear in the output - examples are "defer" and "async"
- Javascript lists/vectors/argument arrays are used to represent the children of an element
- Javascript strings represent text nodes
- All other Javascript types are also converted to XML text nodes via "toString()"
 - This allows you to pass in your own types and specialise conversion to XML by adding a custom "toString()" to your objects prototype

### Calling Convention

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
        strings, numbers, bool, Date, null etc to be converted strings

### Examples

A simple example…
```
let x = require('xml')
x.el('html',
    x.el('body',
        x.el('p',
            'here is text ',
            'continuing in the next parameter',
            x.el('b', 'BOLD!')))).toString()
```
This is the result…

```<html><body><p>here is text continuing in the next parameter<b>BOLD!</b></p></body></html>```

This example shows how any object that has a ```toString``` function can be used (```Dates``` even ```RegEx```!)…

```
x.el('text',
    'this shows a \'string\' followed by a number >',
    38,
    '<, a boolean ->> ',
    true,
    ', a date ',
    new Date(),
    ' and even a regular expression(!) ',
    x.el('regex', /^[0-9]{3,4}<[A-Z]>*/)
).toString()
```
And here is how this looks post-render (I've added new lines at 64 chars)

```
<text>this shows a &apos;string&apos; followed by a number &gt;
38&lt;, a boolean -&gt;&gt; true, a date 2017-11-17T14:46:58.34
4Z and even a regular expression(!) /^[0-9]{3,4}&lt;[A-Z]&gt;*/
</text>
```

### Additional (this is not ready yet... awful sorry)

You may want to look at the 'html' module as it will shorten your typing

html.html(
    html.body(
        html.p(
            'here is text ',
            'continuing in the next parameter',
            html.b('BOLD!'))).render();
