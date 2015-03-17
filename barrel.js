angular.module('barrel', [])

.constant('BarrelKey', 
  'barrel'
)


.service('BarrelUtils', function(BarrelKey) {
  this.store = null;

  this.init = function() {
    var store = localStorage.getItem(BarrelKey);

    if (!store) {
      localStorage.setItem(BarrelKey, '');
      store = {};
    } else {
      store = JSON.parse(store);
    }

    this.store = store;
  };

  this.init();

  this._store = function() {
    localStorage.setItem(BarrelKey, JSON.stringify(this.store));
  };

  this.save = function(id, item) {
    this.store[id] = item;
    this._store();
  };    
})


.service('Barrel', function(BarrelObject) {
    
  this.child = function(id) {
    return BarrelObject(id);
  };

})


.factory('BarrelObject', function(BarrelUtils) {
  function BarrelObject(id) {
    if(!(this instanceof BarrelObject)) {
      return new BarrelObject(id);
    }

    this.$id = id;

    this._innerArray = [];
  };

  BarrelObject.prototype = {
    $update: function(value) {
      this._innerArray = value;
      this.$save();
    },
    $save: function() {
      BarrelUtils.save(this.$id, this);
    },
    $push: function(object) {
      this._innerArray.push(object);
    }
  };

  return BarrelObject;
});
