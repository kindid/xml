var x=require('../xml');
//var html=require('html');

// tests
/// attributes basic
/// attributes from objects
/// attributes
// empty elements
// elements inside elements
//

console.log(
    x.el('p',['some text ', x.el('u', 'underlined'), ' back to normal'])
);
console.log(
    x.el('p',['some text ', x.el('u', 'underlined'), ' back to normal']).render()
);
console.log(
    x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', x.el('u', 'underlined'), ' back to normal']).render()
);

// i'd like this to work
x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', 34, x.el('u', 'underlined'), ' back to normal']).render();


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
> x.el('p',['some text ', x.el('u', 'underlined'), ' back to normal']).render();
test
false
test
true
'<p>some text <u>underlined</u> back to normal</p>'
> x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', x.el('u', 'underlined'), ' back to normal']).render();
test
false
test
false
'<p defer class="mango" id="34">some text <u>underlined</u> back to normal</p>'
> x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', true, x.el('u', 'underlined'), ' back to normal']).render();
test
false
test
false
appending node that is neither XNode or string true
'<p defer class="mango" id="34">some text <u>underlined</u> back to normal</p>'
> x.el('p',{'defer':null, 'class':'mango', id:34}, ['some text ', 34, x.el('u', 'underlined'), ' back to normal']).render();
test
false
test
false
appending node that is neither XNode or string 34
'<p defer class="mango" id="34">some text <u>underlined</u> back to normal</p>'

*/
