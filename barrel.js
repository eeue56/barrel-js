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


    this._conf = {
      innerArray: [],
      listeners: []
    };

    var me = BarrelUtils.get(id); 

    if (me !== null){
      this._conf.innerArray = me._conf.innerArray;      
    }
  };

  BarrelObject.prototype = {
    $update: function(value) {
      this._conf.innerArray = value;
    },
    $save: function() {
      BarrelUtils.save(this.$id, this);
    },
    $watch: function(cb, context) {
      var list = this._conf.listeners;
      list.push([cb, context]);

      return function() {
        var i = list.findIndex(function(parts){
          return parts[0] === cb && parts[1] = context;
        });

        if (i > -1) {
          list.splice(i, 1);
        }
      };
    },
    $push: function(object) {
      this._conf.innerArray.push(object);
    },
    $asArray: function() {
      return this._conf.innerArray;
    },
    $$notify: function() {
      var self = this;

      var list = this._conf.listeners.slice();

      angular.forEach(list, function(parts) {
        parts[0].call(parts[1], { 
          event: 'value',
          key: self.$id
        });
      });
    }
  };

  return BarrelObject;
});
