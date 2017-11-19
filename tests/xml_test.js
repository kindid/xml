///////////////////////////////////////////////////////////////////////////////
///(c) kuiash.com ltd 2017+ code@kuiash.com ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var x=require('../xml');
/////////////////////////////////////////////////////////////////////////////////
const verbose = false
/////////////////////////////////////////////////////////////////////////////////
function xml_test(title, xn, txt)
{
    if (verbose) {
        console.log("////// XML Tree (JSON)")
        console.log(JSON.stringify(x, null, 4))
        console.log("////// XML Rendered")
        console.log(xn.toString())
        console.log("////// Done")
    }
    console.log('test : ', title)
    try {
        let rendered = xn.toString()
        if (rendered !== txt) {
            throw('mismatch ' + rendered + ' !== ' + txt)
        } else {
            console.log('pass : ', title)
        }
    } catch(e) {
        console.log('fail : ', title, ' : ',  e.toString())
        console.trace()
        process.exit(-1)
    }
}
/////////////////////////////////////////////////////////////////////////////////
// All these tests of these should render to the same thing
/////////////////////////////////////////////////////////////////////////////////
xml_test(
    'simple tree 1a',
    x.el('div',
        x.el('p', 'a very simple test'),
        x.el('p', ' to see which is harder to work with'),
        [   // array flattening & test empty attributes
            x.el('p', {}, 'totally end of')
        ]
    ),
    '<div><p>a very simple test</p><p> to see which is harder to work with</p><p>totally end of</p></div>'
)

xml_test(
    'simple tree 1b',
    x.el('div', [
        x.el('p', [ 'a very simple test' ]),
        x.el('p', {}, [ ' to see which is harder to work with' ]),
        [   // array flattening & test empty attributes
            x.el('p', {}, 'totally end of')
        ]
    ]),
    '<div><p>a very simple test</p><p> to see which is harder to work with</p><p>totally end of</p></div>'
)

xml_test(
    'simple tree 1c',
    x.el('div', [
        x.el('p', [ 'a very simple test' ]),
        x.el('p', [ ' to see which is harder to work with' ]),
        [   // array flattening & test empty attributes
            x.el('p', {}, 'totally end of')
        ]
    ]),
    '<div><p>a very simple test</p><p> to see which is harder to work with</p><p>totally end of</p></div>'
)

xml_test(
    'simple tree 1d',
    x.el('div', {},
        x.el('p', [ 'a very simple test' ]),
        x.el('p', [ ' to see which is harder to work with' ]),
        [   // array flattening & test empty attributes
            x.el('p', {}, 'totally end of')
        ]
    ),
    '<div><p>a very simple test</p><p> to see which is harder to work with</p><p>totally end of</p></div>'
)

/////////////////////////////////////////////////////////////////////////////////
// Test Javascript output
/////////////////////////////////////////////////////////////////////////////////

xml_test(
    'Javascript types test',
    x.el('test_element',
        {
            attr1:true,
            attr2:false,
            no_value:null,
            attr_number:new Date(0).toISOString()
        }),
    '<test_element attr1="true" attr2="false" no_value attr_number="1970-01-01T00:00:00.000Z" />')

/////////////////////////////////////////////////////////////////////////////////

xml_test(
    'Test null attributes',
    x.el('script',
        {
            'defer':null,
            'type':'application/javascript'
        }),
    '<script defer type="application/javascript" />')

/////////////////////////////////////////////////////////////////////////////////

xml_test(
    'Simple full body test',
    x.el('body',
        [
        x.el('p',
            'this is my text element'),
        x.el('u',
            'this one is underlined')]),
    '<body><p>this is my text element</p><u>this one is underlined</u></body>')

xml_test(
    'Many embedded elements and escaping ampersand',
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
    '<body><p>text with an embedded <u>underline</u> &amp; <u>bold</u> and &quot;&lt;plain&gt; &apos;text&apos;&quot;</p><p>Last word!</p></body>')

xml_test(
    'Test array flattening',
    x.el('top_element',
        [
            x.el('text1', 'this shows '),
            x.el('text2', 'how '),
            [
                x.el('text3', 'arrays '),
                x.el('text4', 'are ')
            ],
            x.el('flattened')]),
    '<top_element><text1>this shows </text1><text2>how </text2><text3>arrays </text3><text4>are </text4><flattened /></top_element>')

////////////////////////////////////////////////////////////////////////////////
/// these should produce the same output
////////////////////////////////////////////////////////////////////////////////

xml_test(
    'Testing unclosed elements and lists',
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
    '<!DOCTYPE html><arbitrary testing="some new features" /><th><tr><td class="td_class">thing all the way down here</td></tr></th><meta keywords="correct, right, cromulant"><link link="http://something.somewhere.com" rel="cousin"><body>yes, finally some content</body>')

xml_test(
    'Testing unnamed elements',
    x.el('',
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
    '<!DOCTYPE html><arbitrary testing="some new features" /><th><tr><td class="td_class">thing all the way down here</td></tr></th><meta keywords="correct, right, cromulant"><link link="http://something.somewhere.com" rel="cousin"><body>yes, finally some content</body>')

////////////////////////////////////////////////////////////////////////////////

xml_test(
    'Javascript type outputs as element text',
    x.el('text',
        'this shows a \'string\' followed by a number >',
        38,
        '<, a boolean ->> ',
        true,
        ', a date ',
        new Date(1048576),
        ' and even a regular expression(!) ',
        x.el('regex',
            [/^[0-9]{3,4}<[A-Z]>*/])
    ),
    '<text>this shows a &apos;string&apos; followed by a number &gt;38&lt;, a boolean -&gt;&gt; true, a date Thu Jan 01 1970 00:17:28 GMT+0000 (BST) and even a regular expression(!) <regex>/^[0-9]{3,4}&lt;[A-Z]&gt;*/</regex></text>')

////////////////////////////////////////////////////////////////////////////////

let test_attr = {
    class: 'noclassatall',
    id:'main',
    link:'http://www.github.com/kuiash' }

xml_test(
    'Javascript type outputs as attributes',
    x.el('top', test_attr, 'text in here'),
    '<top class="noclassatall" id="main" link="http://www.github.com/kuiash">text in here</top>')

////////////////////////////////////////////////////////////////////////////////
/// test various array flattenings
////////////////////////////////////////////////////////////////////////////////

let x1 = x.el('x1', 'x1x1x1x1')
let x2 = [ x.el('x2', 'x2x2x2 ', x.el('x2:a', 'x2x2 ', 'x2')) ]
let x3 = x.el('x3', [ 'x3x3x3' ], [ 'xx3 ', 'xx3 ', [ 'xxx3', 'xxx3' ]], ' x3')

xml_test(
    'Flatten 1',
    x1,
    '<x1>x1x1x1x1</x1>')

xml_test(
    'Flatten 2',
    x2,
    '<x2>x2x2x2 <x2:a>x2x2 x2</x2:a></x2>')

xml_test(
    'Flatten 3',
    x3,
    '<x3>x3x3x3xx3 xx3 xxx3xxx3 x3</x3>')

xml_test(
    'Flatten 1,2',
    x.li(
        x1,
        x2),
    '<x1>x1x1x1x1</x1><x2>x2x2x2 <x2:a>x2x2 x2</x2:a></x2>')

xml_test(
    'Flatten 1,2,3',
    x.li(
        x1,
        x2,
        x3),
    '<x1>x1x1x1x1</x1><x2>x2x2x2 <x2:a>x2x2 x2</x2:a></x2><x3>x3x3x3xx3 xx3 xxx3xxx3 x3</x3>')

process.exit(0)
