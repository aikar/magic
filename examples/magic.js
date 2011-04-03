//  Copyright (c) 2011 Daniel Ennis <aikar@aikar.co>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var magic = require('../');

// Basic example
var obj = magic(function(name) {
  console.log('Request to get', name)
}, function(name, val) {
  console.log('Request to set', name, 'to', val);
});
var foo = obj.foo;
obj.bar = 1;


// Config chain example
function configChain() {
  var requestChain = [];
  function getter(name) {
    requestChain.push(name);
    return _chain();
  }
  function setter(name, value) {
    getter(name);// add final key to chain
    var key = requestChain.join('.');
    console.log('Setting', key, 'to', value);
  }
  function _chain() {
    return magic(getter, setter);
  }
  return _chain();
}

configChain().foo.bar.baz.hello.world = 42;
