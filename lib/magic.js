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

var magic = require('./magicBindings').magic;
var util = require('util');
module.exports = function () {
  var args = [].slice.call(arguments);
  var cb1 = args.pop(), cb2;
  var getter, setter, obj;
  if (typeof cb1 == 'function') {
    cb2 = args.pop();
    if (typeof cb2 == 'function') {
      setter = cb1;
      getter = cb2;
    } else {
      getter = cb1;
      setter = function(x,y){ return y; };
    }
    
    return magic(function (name) {
      // Node bug that console.log checks for an inspect method
      if (!(name == 'inspect'
            && arguments.callee.caller.caller === util.inspect)) {
        return getter.call(this, name);
      }
      return undefined;
    }, setter);
  }
  return null;
}
