/*
  Copyright (C) 2013 Alexander (Sasha) Mazurov <alexander.mazurov@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*global esprima:true, estraverse:true, escope: true,
 define:true, require:true, exports:true */

(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // Rhino, and plain browser loading.
    if (typeof exports === "object") {
        module.exports = factory(require('esprima'),require('estraverse'), require('escope'))
    }else if (typeof define === 'function' && define.amd) {
        define(['esprima', 'estraverse', 'escope'], factory);
    } else {
        root.eslevels = factory(esprima, estraverse, escope);
    }
}(this, function (esprima, estraverse, escope) {
    'use strict';
    var exports = {};

    escope.Scope.prototype._cache = null;
    escope.Scope.prototype._level = -1;

   escope.Scope.prototype.level =  function() {
      if (this._level === -1) {
        this._level = 0;
        if (this.upper !== null) {
          this._level = 1 + this.upper.level();
        }
      }
      return this._level;
    }
    escope.Scope.prototype.find =  function(name) {
      var vars;
      if (this._cache === null) {
        this._cache = {};
      }
      if (this._cache[name] === undefined) {
        vars = this.variables;
        for (var i=0; i < vars.length; ++i) {
          if (vars[i].name === name) {
            this._cache[name]  = this.level();
          }
        }

        if (this._cache[name] === undefined) {
          if (this.upper === null) {
            this._cache[name] = 0;
          } else {
            this._cache[name] = this.upper.find(name);
          }
        }
      }
      return this._cache[name];
    }    

    function Context(code) {
        this._syntax = null;
        this._scopeManager = null;
        if (code) {
            this.setCode(code);
        }
    }

    Context.prototype.setCode = function (code) {
        this._syntax = null;
        this._scopeManager = null;
        if (typeof code === 'string') {
            this._syntax = esprima.parse(code, { range: true});
        } else if (typeof code === 'object' && code.type === 'Program') {
            if (typeof code.range !== 'object' || code.range.length !== 2) {
                throw new Error('eslevels: Context only accepts a syntax tree with range information');
            }
            this._syntax = code;
        }
        this._scopeManager = escope.analyze(this._syntax);
    };


    var RegionSet = function(){
      this.regions = [];
    };

    RegionSet.prototype.addRegion = function(region) {
      var newregions = [];
      var curr;
      if (this.regions.length === 0) {
        this.regions.push(region);
        return this;
      }
      
      for(var i=0; i < this.regions.length; i++) {
        curr =  this.regions[i];
          if (
              (region[2] < curr[1]) ||
              (region[1] > curr[2])
            ) {
            newregions.push(curr);
          } else {
            if (curr[1] !== region[1]) {
              newregions.push([curr[0], curr[1], region[1]-1]);
            }
            newregions.push(region);
            if (curr[2] !== region[2]) {
              newregions.push([curr[0], region[2]+1, curr[2]]);
            }
          }
      }
      this.regions = newregions;
    };


    

    function addMainScopes(result, scopes) {
      for (var i = 0; i < scopes.length; i++) {
          // console.log(scopes[i]);
          result.addRegion([scopes[i].level(), scopes[i].block.range[0],
            scopes[i].block.range[1]]);
      }
    }

  function isDeclaredHere(name, scope) {
    var vars = scope.variables;
    for (var i=0; i < vars.length; ++i) {
      if (vars[i].name === name) {
        return true;
      }
    }
    return false;
  }

  function findLevel(name, scope) {
    if (scope === null) {
      return 0;
    }
    if (isDeclaredHere(name, scope)) {
      return scope.level();
    }
    return findLevel(name, scope.upper);
  }

   function addScopeVariables(result, scope) {
      var refs = scope.references;
      var level, identifier;
      for(var i=0; i < refs.length; i++) {
        identifier = refs[i].identifier;
        level = scope.find(identifier.name);
        if (level !== scope.level()) {
            // console.log(identifier.range);
            result.addRegion([level, identifier.range[0], identifier.range[1]-1]);
        }
      }
   }

    Context.prototype.color = function () {
        var result = new RegionSet();
        var scopes = this._scopeManager.scopes;
        addMainScopes(result, scopes);
        for (var i = 0; i < scopes.length; i++) {
          addScopeVariables(result, scopes[i]);
        }
        return result.regions;
    };

    exports.Context = Context;
    return exports;
}));
