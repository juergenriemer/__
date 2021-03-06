// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.class.min.js
// @jscomp_off es5Strict
// @js_externs var __; __.Class; __.Class.instantiate; __.Class.extend; __.Class.mixin; __.Class._super;
// ==/ClosureCompiler==

/**
 * @namespace __
 */
if( typeof __ == "undefined" ) {
	__ = {};
}

/**
 * @namespace __.Class
 * @memberof __
 */
__.Class = function() {};
__.Class.prototype.construct = function() {};

/**
 * Creates a new class by extending from the base class (__.Class) or
 * inheriting from an existing class.<br>
 * If the class has a method called "init" it will invoke it on creation of an instace.<br>
 * In case of inheritance you can call a parent's method by using the "_super" method.<br>
 * Static attributes and methods are created by appending to the class constructor function.
 * @memberof __.Class
 * @method extend
 * @example // a base class
 * var Person = __.Class.extend( {
 *      sName : null
 *    , init : function( args ) {
 *         this.sName = args.sName;
 *         Person.cPerson++;
 *    }
 *    , say : function() {
 *       return "My name is " + this.sName;
 *    }
 * } );
 * // static attribute
 * Person.cPerson = 0
 * // static function
 * Person.report = function() {
 *     return Person.cPerson + " person(s) created";
 * }
 * var tom = __.Class.instantiate( Person, { sName : "Tom" } );
 * tom.say(); // "My name is Tom"
 * Person.report(); // "1 person(s) created"
 * @example // an extended class
 * var Soldier = Person.extend( {
 *    salute : function() {
 *       return this.say() + ", Sir";
 *    }
 * } );
 * var tom = __.Class.instantiate( Soldier, { sName : "Major Tom" } );
 * tom.salute(); // "My name is Major Tom, Sir"
 * Person.report(); // "2 person(s) created"
 * @returns {Object} class object to chain loading of mixins
 */
__.Class.extend = function( o ) {
	var that = this;
	var oNew = function() {
		if (arguments[ 0 ] !== __.Class) {
			// call constructor if not base 
			this.construct.apply( this, arguments ); 
		}
	};
	// get prototype and hook to parent
	var oPrototype = new this( __.Class );
	// save link to parent's prototype
	var oParent = this.prototype;
	for (var sMember in o) {
		var oMember = o[sMember];
		if (oMember instanceof Function) {
			oMember.oParent = oParent;
			// in case we override add method
			// _super() to call parent's function
			/**
			 * Provides a hook into the parent's object to call the overridden (super) method.<br />
			 * NB: Since we use callee/caller this will not work in xtrict mode.
			 * @memberof __.Class
			 * @method _super
			 * @instance
			 * @param {String} [sMethod] Name of the parent method
			 * @example
			 * var Person = __.Class.extend( {
			 *    say : function() {
			 *       return "Hi";
			 *    }
			 * } );
			 * var Player = Person.extend( {
			 *    say : function() {
			 *       return this._super( "say" ) + ", Teammate";
			 *    }
			 * } );
			 * var player = __.Class.instantiate( Player );
			 * player.say(); // "Hi, Teammate"
			 */
			oPrototype.oParent = oParent;
			oPrototype._super= function( sMethod ) {
				var oCaller = arguments.callee.caller;
				// method context == this
				var ctx = this;
				// methods arguments == arguments
				var args = oCaller.arguments;
				return args.callee.oParent[ sMethod ].apply( ctx, args )
			};
		}
		// augment with members
		oPrototype[ sMember ] = oMember;
	}
	// set the prototype
	oNew.prototype = oPrototype;
	// set method for mixins
	/**
	 * Mixes in additional behaviour to the class. It expects plain objects in the
	 * arguments (Other class objects cannot be mixed in).
	 * Mixin object members will not overwrite class members in case of same
	 * method or attribute names.
	 * @memberof __.Class
	 * @method mixin
	 * @param {Object} objects Any number of objects to be mixed in.
	 * @example
	 * var Minecraft = {
         *       say : function() {
	 *         return "Mojang";
	 *     }
	 *     , craft : function() {
	 *         return "wooden sword";
	 *     }
	 * };
	 * var Ingress = {
         *       say : function() {
	 *         return "Ingress";
	 *     }
	 *     , capture : function() {
	 *         return "portal green";
	 *     }
	 * };
	 * var Player = __.Class.extend( {
	 *     say : function() {
	 *        return "Hi";
	 *     }
	 * }).mixin( Minecraft, Ingress );
	 * var player = __.Class.instantiate( Player );
	 * player.say(); // Hi
	 * player.craft(); // wooden sword
	 * player.capture(); // portal green
	 */
	oNew.mixin = function() {
		var loMixins = [].slice.call( arguments );
		loMixins.forEach( function( oMixin ) {
			for( var sMember in oMixin ) {
				if( ! oPrototype[ sMember ] ) {
					oPrototype[ sMember ] = oMixin[ sMember ];
				} 
			}	
		} );	
		return this;
	}
	// make it extendable
	oNew.extend = this.extend;
	// and return it
	return oNew;
};

/**
 * Creates a new instance of a class.
 * @memberof __.Class
 * @method instantiate
 * @example Person = __.Class.extend( {
 *      sName : null
 *    , init : function( args ) {
 *       this.sName = args.sName;
 * }
 *    , say : function() {
 *       return "Hi, I am " + this.sName;
 *    }
 * } );
 * tim = __.Class.instantiate( Person, { sName : "Tim" } );
 * tim.say(); // Hi, I am Tim
 * @returns {Object} instance of a class object
 */
__.Class.instantiate = function() {
	// create new instance
	var oClass = arguments[0];
	var args = arguments[1];
	var oInstance = new oClass( args );
	// call init function if exists
	if( oInstance.init ) {
		oInstance.init( args );
	}
	return oInstance;
};

