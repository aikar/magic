var magic = require('../');
function requestChain(cb, chain, prevRequestChain) {
  var map = {};
  this.map = map;
  var thisChain = this;
  this.prev = prevRequestChain;
  this.chain = chain = (chain && chain.slice(0)) || [];
  function getter(name) {
    if (typeof map[name] === 'undefined') {
      var ret = cb.call(map, name, thisChain);
      // if its still undefined, make it magical
      if (typeof map[name] === 'undefined') {
        map[name] = new requestChain(cb, chain.concat(name), thisChain);
      }
      if (typeof ret !== 'undefined') return ret;
    }
    return map[name];
  }
  function setter(name, value) {
    map[name] = value;
  }
  return magic(getter, setter);
}

/**
 * NOTE WITH THIS AUTOLOADER!
 *
 * Its not perfect and can be confused under some conditions
 *
 * such as, foo.js and a dir named foo inside same folder, if foo does not export
 * an object (exports a function or primitive value), then the foo folder
 * will not be accessible.
 *
 * Even then, if foo IS an object, and exports a variable such as lib/foo.js:
 * module.exports = {bar:'baz'};
 *
 * then the path lib/foo/bar.js will not be accessible due to it picking up
 * the bar value from the module foo.
 *
 * In other words, be careful to not cause path/name conflicts and itll work ok
 */
function getLoader(basedir) {
  basedir = (basedir && basedir + '/') || '';
  return new requestChain(function _loader(name, chain) {
    try {
      var newchain = chain.chain.concat(name);
      file = (basedir||'') + newchain.join('/');
      var mod = require(file);
      if (typeof mod == 'object') {
        // we could just set this[name] = mod, but then if there is path
        // name conflicts such as lib/foo.js then lib/foo/bar.js, then the folder
        // version would not be accessible. so make it magical
        // note above comment, it is still possible to conflict here if foo.js
        // exports a bar property, then lib/foo/bar.js would not be accessible.
        this[name] = new requestChain(_loader, newchain, chain);
        
        for (var i in mod) {
          this[name][i] = mod[i]
        }
      } else {
        // if its not an object, we cant make it magical :(
        this[name] = mod;
      }
    } catch (e) {
      console.log(e.message, file);
    }
  });
};
// custom dir loader
var loader = getLoader(__dirname+'/autoloader');
// official require() loader.
var node = getLoader();
console.log(loader.foo.value);
console.log(loader.bar.value);
console.log(loader.bar.baz.value);
node.util.print("Foo!\n");
console.log((node.fs.readFileSync(__dirname+'/node_modules/hello.js')+"").trim());
console.log(node.os.hostname());
console.log(node.hello.world); // load node_modules/hello.js and access export world.
