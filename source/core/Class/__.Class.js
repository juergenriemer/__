__.Class = function() {};
__.Class.prototype.construct = function() {};
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
__.Class.extend = function(o) {
	var oNew = function() {
		if (arguments[ 0 ] !== __.Class) {
			// call constructor if not base 
			this.construct.apply( this, arguments ); 
		}
	};
	// get prototype and hook to parent
	var oPrototype = new this( __.Class );
	var oParent = this.prototype;
	for (var sMember in o) {
		var oMember = o[sMember];
		if (oMember instanceof Function) {
			oMember.oParent = oParent;
			// in case we override add method
			// _super() to call parent's function
			oPrototype._super= function() {
				var that = arguments[0];
				var args = arguments[1];
				var sfn = arguments[2];
				return args.callee.oParent[ sfn ].apply( that, args )
			};
		}
		// augment with members
		oPrototype[sMember] = oMember;
	}
	// check for simple augmentations w/o mix/super
	// used to enhance classes with set of methods 
	if( oPrototype.$$augments ) {
		var loAugs = oPrototype.$$augments;
		var c = loAugs.length;
		for( var ix=0; ix<c; ix++ ) {
			var oAug = loAugs[ ix ]//.prototype;
			for (var sMember in oAug ) {
				var oMember = oAug[sMember];
				// augment with members
				oPrototype[sMember] = oMember;
			}
			
		}
	}
	// set prototype
	oNew.prototype = oPrototype;
	// and make it extendable
	oNew.extend = this.extend;
	return oNew;
};

/* example 
Mamel = __.Class.extend( {
	say : function( sMsg ) {
		console.log( sMsg );
	}
} );

Cat = Mamel.extend( {
	init : function( a ) {
		console.log( a );
	}
	, say : function( sMsg ) {
		this._super( this, arguments, 'say' );
		console.log( "miau" );
	}
} );


cat = __.Class.instantiate( Cat, {a:1} );
cat.say( "hi" );
*/
