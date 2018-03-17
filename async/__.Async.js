// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.async.min.js
// @js_externs var __; __.Async; __.Async.ix; __.Async.store; __.Async.fnerr; __.Async.fnok; __.Async.fnstat; __.Async.stub; __.Async.resolve; __.Async.reject; __.Async.Promise; __.Async.Promise.debug; __.Async.Promise.clear; __.Async.Promise.wait; __.Async.Promise.then; __.Async.Promise.start; __.Async.Promise.resolve; __.Async.Promise.stop; __.Async.Promise.reject; __.Async.Promise.ctx; __.Async.Promise.fnerr; __.Async.Promise.fnstat; __.Async.Promise._next; __.async; __.Async.Promise.__guid_async__; __.Async.__guid_async__;
// ==/ClosureCompiler==
// version 1.5

if( typeof __ == "undefined" ) {
	__ = {};
}

__.Async = function( args ) {
	var __guid_async__ = "Async" + ( ++__.Async.ix );
	var args = args || {};
	args.__guid_async__ = __guid_async__;
	return __.Async.store[ __guid_async__ ] = new __.Async.Promise( args );
}
__.Async.ix = 0;
__.Async.store = {};
__.Async.fnerr = function( a, b ) {
	console.log( "[error]", a, b );
}
__.Async.fnok = function() {}
__.Async.fnstat = function() {}
__.Async.stub = {
	  resolve : function( a ) { console.log( a ); }
	, reject : function( oError ) { console.log( oError ); __.Async.fnerr( oError ); }
};
__.async = function( args ) {
	// fetch the promise object from args.__guid_async__
	var oPromise = ( typeof args == "object" && args.__guid_async__ )
		? __.Async.store[ args.__guid_async__ ]
		: __.Async.stub;
	// we set the late arrivals flag on the promise, i.e. any newly
	// added task will get put at beginning of task queue
	oPromise.bLateArrivals = true;
	return oPromise;
}
__.Async.Promise = function( args ) {
	this.__guid_async__ = args.__guid_async__;
	this.sLabel = ( args && args.sLabel ) ? args.sLabel : this.__guid_async__;
	this.sFile = ( args && args.sFile ) ? args.sFile : "na";
	this.sStatus = "idle";
	this.args = args;
	this.lofn = [];
	this.bDebug = false;
	this.ctx = ( args && args.ctx ) ? args.ctx : window;
	this.fnerr = ( args && args.fnerr ) ? args.fnerr : __.Async.fnerr;
	this.fnstat = ( args && args.fnstat ) ? args.fnstat : __.Async.fnstat;
	return this;
};
__.Async.Promise.prototype = {
	  c : 0
	, ix : 0
	, bLateArrivals : false
	, debug : function() {
		this.bDebug = true;
		return this;
	}
	, clear : function() {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : function() {
				that.args = { __guid_async__ : that.__guid_async__ };
				that.resolve();
			}
			, args : {}
		};
		this._add( ofn );
		return this;
			
	}
	, wait : function( x1, x2, x3 ) {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : ( typeof x2 == "function" )
				? function() {
					var fnPoll = function() {
						if( x2() ) {
							that.resolve();
						}
						else {
							setTimeout( fnPoll, x1 );
						}
					};
					fnPoll();
				}
				: function() {
					setTimeout( function() {
						 that.resolve();
					}, x1 );
				}
			, args : {}
			, sMsg : ( typeof x2 == "string" ) ? x2 : x3
		};
		this._add( ofn );
		return this;
	}
	/**
	 * <pre>
	 * Registers a method to the Async chain
	 * </pre>
	 * @memberof __.Async.Promise
	 * @method then
	 * @example ( new __.Async() )
	 * .then( that, "getRecords", { idUser : 123 }, "Getting records" )
	 * .then( function( args ) {
	 *     __.dn_( "#output" ).innerHTML = args.hResult;
	 *     __.async( args ).resolve();
	 * }, "Printing records" )
	 * .start();
	 * @param {Object|Function} x1 Either an anonymous function or parent object of the method
	 * @param {String|String} x2 Either string of method name or status message
	 * @param {String|String} x3 Either string of method name or status message
	 * @returns {String|null} Value of the cookie or null
	 */
	, then : function( x1, x2, x3, x4 ) {
		// construct an action's object
		var ofn = {
			  ctx : ( typeof x1 == "object" ) ? x1 : this.ctx
			, sfn : ( typeof x1 == "object" ) ? x2 : x1
			, args : ( typeof x2 == "string" )
				? x3
				: ( x2 )
					? x2
					: {}
			, sMsg : ( typeof x3 == "object" )
				? x4
				: ( typeof x3 == "string" )
					? x3
					: ( typeof x2 == "string" )
						? x2
						: ""
		};
		this._add( ofn );
		return this;
	}
	, _add : function( ofn ) {
		this.c++;
		ofn.__guid_async__ = this.__guid_async__;
		// We first check whether we are in late arrival mode, this
		// happens if another batch of tasks is assigned 
		if( this.bLateArrivals ) {
			// in which case we need to add new actions at the beginning
			// of the task queue but at the end of any such added actions
			// we end up with an array like this [ new1, new2, old3, old4 ]
			// so we have to mark the new action as "late arrival"
			// for subsequent late arrivals to position them below previous ones
			ofn.bLateArrival = true;
			// first we get number of task left in our task stack
			var c = this.lofn.length;
			// if we still have tasks in our stack...
			if( c ) {
				// we iterate through the exising array
				for( var ix=0; ix<c; ix++ ) {
					// and inject the new action after the first 
					// action that is not a "late arrival" itself
					// or a 
					var bSet = false;
					if( ! this.lofn[ ix ].bLateArrival ) {
						bSet = true;
						this.lofn.splice( ix, 0, ofn );
						break;
					}
				}
				// so if we found only late arrivals
				if( ! bSet ) {
					// we simply push the new task to the end
					this.lofn.push( ofn );
				}
			}
			// the task stack is empty!
			else {
				// we simply push the new task into the stack
				this.lofn.push( ofn );
			}
		}
		else {
			// no "late arrival" a normal action to be added to the
			// end of the array holding all actions
			this.lofn.push( ofn );
		}
	}
	, _stats : function( sMsg ) {
		// in case we have set a status call back on init or we are in debug mode
		var fn = this.fnstat;
		if( this.bDebug ) {
			fn = function( a ) {
				console.log( a.__guid_async__ + " (" + a.ix + "/" + a.c + ") -> " + a.sMsg );
			};
		}
		if( fn ) {
			// ... we invoke it with possible message and
			// information on progress
			fn( {
				  __guid_async__ : this.__guid_async__
				, sMsg : sMsg || ""
				, c : this.c
				, ix : this.ix
				, pct : this.ix * 100 / this.c
			} );
		}
	}
	, _next : function() {
		// cut next function object from list
		var ofn = this.lofn.shift();
		// save the current action message
		this.scurMsg = ofn.sMsg;
		// increase action count
		this.ix++;
		// invoke status method
		this._stats( ofn.sMsg );
		// add passed on arguments to args object
		for( var s in ofn.args ) {
			this.args[ s ] = ofn.args[ s ];
		} 
		// we now invoke the function.
		if( typeof ofn.sfn == "string" ) {
			// in case its name is passed on as string
			// we invoke as key from context object passing
			// on our accumulated arguments object
			ofn.ctx[ ofn.sfn ]( this.args );
		}
		else {
			// in case we passed on an anonymous function
			// we invoke via "call" with context object again
			// passing on our accumulated arguments object
			ofn.sfn.call( ofn.ctx, this.args );
		}
	}
	, start : function() {
		// we start action chain by setting status to pending
		this.sStatus = "pending";
		// triggering the first action
		this._next();
		// and returning this object for possible further chaining
		return this;
	}
	, resolve : function( args ) {
		// first we clear any bLateArrivals flag
		this.bLateArrivals = false;
		// next we remove all late arrival flags from tasks
		this.lofn.forEach( function( ofn ) {
			ofn.bLateArrival = false;
		} );
		// add returned results to args object
		for( var s in args ) {
			this.args[ s ] = args[ s ];
		} 
		// invoke next action if array is not empty
		if( this.lofn.length > 0 ) {
			this._next();
		}
		else {
			// otherwise stop and set status to idle
			this.sStatus = "idle";
			this._cleanUp();
		}
	}
	, stop : function() {
		this._cleanUp();
	}
	, reject : function( xError ) {
		var stringify = function( s ) {
			try {
				return ( s ) ? JSON.stringify( s ) : "na";
			}
			catch( e ) {
				return "could not stringify";
			}
		};
		// we do not clean up to be able to inspect the stack
		// but we set the status to erroneous
		this.sStatus = "error";
		// an error happened, we stop here 
		var sError = ( typeof xError == "string" )
			? xError
			: ( typeof xError ==  "object" )
				? ( xError.sError )
					? xError.sError
					: "A task was rejected"
				: "A task was rejected";
		var sStack = "label:[" + this.sLabel + "] ";
		sStack += "file:[" + this.sFile + "] ";
		sStack += "task:[" + this.scurMsg + "] ";
		sStack += "args:(" + stringify( this.args ) + ") ";
		sStack += "xError:(" + stringify( xError ) + ")";
		var oStack = {
			  ix : this.ix
			, sError : sError
			, sLabel : this.sLabel
			, sFile : this.sFile
			, sErrorTask : this.scurMsg
			, args : this.args
			, xError : xError
			, sStack : sStack
		};
		// and invoke the error function with error and args object
		if( this.fnerr ) {
			this.fnerr( oStack );
		}
	}
	, _cleanUp : function() {
		if( ! this.bDebug ) {
			delete __.Async.store[ this.__guid_async__ ];
		}
	}
}


