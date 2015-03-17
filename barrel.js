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
    localStorage.setItem(BarrelKey, angular.toJson(this.store));
  };

  this.save = function(id, item) {
    this.store[id] = item;
    this._store();
  };

  this.get = function(id) {
    return this.store[id] || null;
  }    
})


.service('Barrel', function(BarrelObject) {
    
  this.child = function(id) {
    return new BarrelObject(id);
  };

})


.factory('BarrelObject', function(BarrelUtils) {
  function BarrelObject(id) {

    if(!(this instanceof BarrelObject)) {
      return new BarrelObject(id);
    }

    this.$id = id;

    this._innerArray = [];

    var me = BarrelUtils.get(id); 

    if (me !== null){
      this._innerArray = me._innerArray;      
    }
  };

  BarrelObject.prototype = {
    $update: function(value) {
      this._innerArray = value;
    },
    $save: function() {
      BarrelUtils.save(this.$id, this);
    },
    $push: function(object) {
      this._innerArray.push(object);
    },
    $asArray: function() {
      return this._innerArray;
    }
  };

  return BarrelObject;
});
