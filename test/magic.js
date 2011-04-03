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

var vows = require('vows');
var assert = require('assert');
var magic = require('../');
vows.describe('Magic').addBatch({
  'Test Getter': {
    topic: function(){
      var self = this;
      var x = magic(function(x) {
        self.callback(null, x);
      });
      var bar = x.foo;
    },
    'got foo Getter': function(err, x) {
      assert.equal(x, 'foo');
    }
  },
  'Test Setter': {
    topic: function(){
      var self = this;
      var x = magic(function(){}, function(x,y) {
        self.callback(null, x, y);
      });
      x.foo = 42;
    },
    'got foo/42 Setter': function(err, x, y) {
      assert.equal(x, 'foo');
      assert.equal(y, 42);
    }
  },
  'Test Chain Example': {
    topic: function() {
      var self = this;
      function configChain() {
        var requestChain = [];
        function getter(name) {
          requestChain.push(name);
          return _chain();
        }
        function setter(name, value) {
          getter(name);
          self.callback(null, requestChain.join('.'), value);
        }
        function _chain() {
          return magic(getter, setter);
        }
        return _chain();
      }
      configChain().foo.bar.baz.hello.world = 42;
    },
    'Got 42 Chain': function(err, chain, value) {
      assert.equal(chain, 'foo.bar.baz.hello.world');
      assert.equal(value, 42);
    }
  }
}).export(module);
