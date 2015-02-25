angular.module('barrel', [])

.service('Barrel', function() {
  this.store = null;
  var BARREL_KEY = 'barrel';

  this.init = function() {
    var store = localStorage.getItem(BARREL_KEY);

    if (!store) {
      localStorage.setItem(BARREL_KEY, '');
      store = {};
    } else {
      store = JSON.parse(store);
    }

    this.store = store;
  };

  this.init();

  this._store = function() {
    localStorage.setItem(BARREL_KEY, JSON.stringify(this.store));
  };

  this.child = function(id) {
    return this.store[id] || new BarrelObject(id);
  };

  this.save = function(id, item) {
    this.store[id] = item;
    this._store();
  };    

})

.factory('BarrelObject', function(Barrel) {
  function BarrelObject(id) {
    if(!(this instanceof BarrelObject)) {
      return new BarrelObject(id);
    }

    this.$id = id;
  };

  BarrelObject.prototype = {
    $save: function() {
      Barrel.save(this.$id, this);
    },
    $push: function(object) {

    }
  };

  return BarrelObject;
});