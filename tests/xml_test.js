var x=require('../xml');
var assert = require('assert')
//var html=require('html');

Date.prototype.toString = Date.prototype.toISOString

// tests
/// attributes basic
/// attributes from objects
/// attributes
// empty elements
// elements inside elements
//

// STRICT mode
//  check attribute names
//  check element names
// OMG this is hell...

// any non zero value results in failure???

function humane(x, cmp) {
    console.log("////// XML Tree (JSON)")
    //console.log(JSON.stringify(x, null, 4))
    console.log("////// XML Rendered")
    console.log(x.toString())
    console.log("////// Done")

//    assert.equal(x.toString(), cmp)
//    if (x.toString() === cmp) {
//        return true
//    } else {
//        assert('test failed')
//    }
}

//assert.equal('bang', 'bong');

// problem - you can't garauntee the order of the array and therefore attributes are a bit whacky
//let test = x.el('att1', { attr1:true, attr2:false, no_value:null, attr_number:12})

// the problem with most other versions I've seen are the damn return values
// I'll admit mine is a bit weird - maybe 'x.at({object})' is called for
//  all it does is take an object pointer it is NOT of type XNode...
humane(
    x.el('div', [
        x.el('p', 'a very simple test'),
        x.el('p', ' to see which is harder to work with'),
        [   // array flattening
            x.el('p', 'totally end of')
        ]
    ])
)



humane(
    x.el('test_element',
        {
            attr1:true,
            attr2:false,
            no_value:null,
            attr_number:new Date
        }),
    '<test_element attr1="true" attr2="false" no_value attr_number="12" />')

humane(
    x.el('body',
        x.el('p',
            'this is my text element'),
        x.el('u',
            'this one is underlined')),
    '<body><p>this is my text element</p><u>this one is underlined</u></body>')

humane(
    x.el('body',
        x.el('p',
            'text with an embedded ',
            x.el('u',
                'underline'),
            ' & ',
            x.el('u',
                'bold'),
            ' and ',
            '"<plain> \'text\'"'),
        x.el('p',
            'Last word!')),
    '<body><p>this is my text element</p><u>this one is underlined</u></body>')

humane(
    x.el('top_element',
        [
            x.el('text1', 'this shows '),
            x.el('text2', 'how '),
            [
                x.el('text3', 'arrays '),
                x.el('text4', 'are ')
            ],
            x.el('flattened')]),
    '')
// need a simple 'list' thing - or an element with NO name
// which is preferrable? if I implement 'list' then can it be used
// elsewhere (i doubt it)
humane(
    x.li(
        x.uc('!DOCTYPE', { html:null }),
        x.el('arbitrary', {testing: 'some new features'}),
        x.el('th',
            x.el('tr',
                x.el('td', { class:'td_class' }, 'thing all the way down here')
            )
        ),
        x.uc('meta', { keywords: 'correct, right, cromulant' }),
        x.uc('link', { link:'http://something.somewhere.com', rel:'cousin' }),
        x.el('body', 'yes, finally some content')),
    '')


humane(
    x.el('text',
        'this shows a \'string\' followed by a number >',
        38,
        '<, a boolean ->> ',
        true,
        ', a date ',
        new Date(),
        ' and even a regular expression(!) ',
        x.el('regex',
            [/^[0-9]{3,4}<[A-Z]>*/])
//        /^[0-9]{3,4}<[A-Z]>*/
    ).toString())
//
// humane(
//     x.el('text',
//         'this shows ',
//         38,
//         true,
//         new Date(),       // annoying - doesn't come out in ISO format (reprogram the bastard)
//         /^[0-9]{3,4}A*/
//     ))


//console.log(JSON.stringify())


// exit code == 0 for success, any thing else for failure
process.exit(0)
//return 7

console.log(
    x.el('p',['some text ', x.el('u', 'underlined'), ' back to normal'])
);
console.log(
    x.el('p',['some text ', x.el('u', 'underlined'), ' back to normal']).toString()
);
console.log(
    x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', x.el('u', 'underlined'), ' back to normal']).toString()
);

// i'd like this to work
x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', 34, x.el('u', 'underlined'), ' back to normal']).toString();


//console.log(html.html(html.head(html.title("here's your title")), html.body(html.h1("header"),html.p("text"))));
/*

> x=require('xml');
{ el: [Function: el],
  tx: [Function: tx],
  uc: [Function: uc],
  xr: [Function: xr] }
> var x=require('xml');
undefined
> x.el('p',['some text ', x.el('u', 'underlined'),
... ' back to normal']);
test
false
test
true
XElement {
  name: 'p',
  dsct:
   [ XText { text: 'some text ' },
     XElement { name: 'u', dsct: [Object] },
     XText { text: ' back to normal' } ] }
> x.el('p',['some text ', x.el('u', 'underlined'), ' back to normal']).toString();
test
false
test
true
'<p>some text <u>underlined</u> back to normal</p>'
> x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', x.el('u', 'underlined'), ' back to normal']).toString();
test
false
test
false
'<p defer class="mango" id="34">some text <u>underlined</u> back to normal</p>'
> x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', true, x.el('u', 'underlined'), ' back to normal']).toString();
test
false
test
false
appending node that is neither XNode or string true
'<p defer class="mango" id="34">some text <u>underlined</u> back to normal</p>'
> x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', 34, x.el('u', 'underlined'), ' back to normal']).toString();
test
false
test
false
appending node that is neither XNode or string 34
'<p defer class="mango" id="34">some text <u>underlined</u> back to normal</p>'

*/
