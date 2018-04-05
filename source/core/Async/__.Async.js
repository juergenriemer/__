// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.async.min.js
// @js_externs var __; __.Async; __.Async.ix; __.Async.store; __.Async.fnerr; __.Async.fnstat; __.Async.stub; __.Async.resolve; __.Async.reject; __.Async.Promise; __.Async.Promise.debug; __.Async.Promise.clear; __.Async.Promise.wait; __.Async.Promise.then; __.Async.Promise.start; __.Async.Promise.resolve; __.Async.Promise.stop; __.Async.Promise.reject; __.Async.Promise.ctx; __.Async.Promise.fnerr; __.Async.Promise.fnstat; __.Async.Promise._next; __.Async.promise; __.Async.Promise.__guid_async__; __.Async.__guid_async__;
// ==/ClosureCompiler==
// version 1.5
/**
 * @version 1.0
 * @namespace __
 */

if( typeof __ == "undefined" ) {
	__ = {};
}

/**
 * <pre>
 * __.Async handles asynchronous calls in JavaScript.
 * </pre>
 * @memberof __
 * @class __.Async
 * @property {Object}  ctx - Default parent object of tasks; defaults to "window"
 * @property {String}  sLabel - Name of the asynchronous task stack; used for debugging
 * @property {String}  sFile - Name of file; used for debugging
 * @property {Function}  fnerr - Custom function to be invoked in case of rejections
 * @property {Function}  fnstat - Custom function to be invoked on every finished task
 * @example ( new __.Async() )
 * .then( __.SP.list, "create", { sList : "Dossier" } )
 * .start();
 * @example ( new __.Async( {
 * 	  sLabel : "creating secure dossier"
 * 	, sFile : "dossier.list.js"
 * 	, ctx : __.SP.list
 * 	, fnerr : function( sError ) {
 * 		alert( sError );
 * 	}
 * 	, fnstat : function( aInfo ) {
 * 		var sOutput = aInfo.sMsg;
 * 		sOutput += " (" + aInfo.ix + "/" + aInfo.c + ")";
 * 		alert( sOutput );
 * 	}
 * } ) )
 * .then( "create", { sList : "Dossier" } )
 * .start();
 */

// instaniates a new Async task chain
__.Async = function( args ) {
	// create a unique guid 
	var __guid_async__ = "Async" + ( ++__.Async.ix );
	// create arguments object if it does not exist
	var args = args || {};
	// attach the unique guid which travels through the task chain
	args.__guid_async__ = __guid_async__;
	// instantiate a task chain object (promise), adds it to the static
	// store and returns it.
	return __.Async.store[ __guid_async__ ] = new __.Async.Promise( args );
}
// increment used to create a unique async label
__.Async.ix = 0;
// holds all promise instances
__.Async.store = {};
// default error function invoked by rejections
__.Async.fnerr = function( a, b ) {
	console.log( "[error]", a, b );
}

__.Async.fnstat = function() {}

/**
 * <pre>
 * Returns a promise object by its guid passed on as arguments object
 * If no guid is passed on it will create a new instance of Promise
 * </pre>
 * @memberof __.Async
 * @method promise
 * @static
 * @param {Object} [args] Arguments passed on as object 
 * @example function( args ) {
 *     var async = __.async( args );
 * }
 * @returns {Object} Promise instance for chaining
 */
__.Async.promise = function( args ) {
	// fetch the promise object from args.__guid_async__ or create
	// a new Promise, i.e. we invoke an async task chain as stand-alone
	var oPromise = ( typeof args == "object" && args.__guid_async__ )
		? __.Async.store[ args.__guid_async__ ]
		: ( new __.Async() );
	// we set the late arrivals flag on the promise, i.e. any newly
	// added task will get put at beginning of task queue
	oPromise.bLateArrivals = true;
	return oPromise;
}
// The constructor function of a task chain object (promise)
__.Async.Promise = function( args ) {
	// assign the guid from the arguments passed on, here we use a variable
	// name that is not likely to be overridden (wrapped in double low dashes)
	this.__guid_async__ = args.__guid_async__;
	this._sStatus = "idle";
	this._args = args;
	this._loTasks = [];
	this._bDebug = false;
	this.ctx = ( args && args.ctx ) ? args.ctx : window;
	this.sLabel = ( args && args.sLabel ) ? args.sLabel : this.__guid_async__;
	this.sFile = ( args && args.sFile ) ? args.sFile : "na";
	this.fnerr = ( args && args.fnerr ) ? args.fnerr : __.Async.fnerr;
	this.fnstat = ( args && args.fnstat ) ? args.fnstat : __.Async.fnstat;
	return this;
};
__.Async.Promise.prototype = {
	  c : 0
	, ix : 0
	, bLateArrivals : false
	, debug : function() {
		this._bDebug = true;
		return this;
	}

	 /**
	 * <pre>
	 * clears the arguments chain of an Async stack
	 * </pre>
	 * @memberof __.Async
	 * @method clear
	 * @example async.clear()
	 * @instance
	 */
	, clear : function() {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : function() {
				that._args = { __guid_async__ : that.__guid_async__ };
				that.resolve();
			}
			, args : {}
		};
		this._add( ofn );
		return this;
			
	}
	 /**
	 * <pre>
	 * Pauses the execution of a task chain for given milliseconds.
	 * </pre>
	 * @memberof __.Async
	 * @method pause
	 * @example async.pause( 1000, "pause a second" )
	 * @param {Integer} ms milliseconds the execution should be paused
	 * @param {String} [sMsg] log message
	 * @returns {Object} Promise instance for chaining
	 * @instance
	 */
	, pause : function( ms, sMsg ) {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : function() {
				setTimeout( function() {
					 that.resolve();
				}, ms );
			}
			, args : {}
			, sMsg : sMsg || "pause"
		};
		this._add( ofn );
		return this;
	}
	 /**
	 * <pre>
	 * Pauses the execution of a task chain until a certain condition
	 * occurs. This condition is indicated as function that is polled
	 * every 25 milliseconds if not indicated otherwise.
	 * </pre>
	 * @memberof __.Async
	 * @method wait
	 * @example async.wait( function() {
	 *       return self.location.hash == "continue";
	 * }, 250, "wait for hash to signal go" )
	 * @example async.wait( function() {
	 *       return self.location.hash == "stop";
	 * } )
	 * @param {Function} fnCondition function to indicate the state of
	 * continuation by return true or false
	 * @param {Integer|String} [x1] Either interval in milliseconds to check the 
	 * condition or log message
	 * @param {String} [x2] log message
	 * @returns {Object} Promise instance for chaining
	 * @instance
	 */
	, wait : function( fnCondition, x1, x2 ) {
		var that = this;
		var msPoll = ( typeof x1 == "number" )
			? x1 : 25;
		var sMsg = ( typeof x1 == "string" )
			? x1
			: ( x2 ) ? x2 : "wait";
		var ofn = {
			  ctx : this.ctx
			, sfn : function() {
				var fnPoll = function() {
					if( fnCondition() ) {
						that.resolve();
					}
					else {
						setTimeout( fnPoll, msPoll );
					}
				};
				fnPoll();
			}
			, args : {}
			, sMsg : sMsg
		};
		this._add( ofn );
		return this;
	}
	/**
	 * <pre>
	 * Registers a method to the task chain
	 * </pre>
	 * @memberof __.Async
	 * @method then
	 * @example
	 * async.then( that, "getRecords", { idUser : 123 }, "Getting records" )
	 * .then( function( args ) {
	 *     __.dn_( "#output" ).innerHTML = args.hResult;
	 *     __.async( args ).resolve();
	 * }, "Printing records" )
	 * @param {Object|Function} x1 Either an anonymous function or parent object of a method
	 * @param {String|String} [x2] Either string of method name or a logging message
	 * @param {String|String} [x3] Either arguments passed on as object or string or a logging message
	 * @param {String} [x4] logging message
	 * @returns {Object} Promise instance for chaining
	 * @instance
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
			var c = this._loTasks.length;
			// if we still have tasks in our stack...
			if( c ) {
				// we iterate through the exising array
				for( var ix=0; ix<c; ix++ ) {
					// and inject the new action after the first 
					// action that is not a "late arrival" itself
					// or a 
					var bSet = false;
					if( ! this._loTasks[ ix ].bLateArrival ) {
						bSet = true;
						this._loTasks.splice( ix, 0, ofn );
						break;
					}
				}
				// so if we found only late arrivals
				if( ! bSet ) {
					// we simply push the new task to the end
					this._loTasks.push( ofn );
				}
			}
			// the task stack is empty!
			else {
				// we simply push the new task into the stack
				this._loTasks.push( ofn );
			}
		}
		else {
			// no "late arrival" a normal action to be added to the
			// end of the array holding all actions
			this._loTasks.push( ofn );
		}
	}
	, _stats : function( sMsg ) {
		// in case we have set a status call back on init or we are in debug mode
		var fn = this.fnstat;
		if( this._bDebug ) {
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
		var ofn = this._loTasks.shift();
		// save the current action message
		this.scurMsg = ofn.sMsg;
		// increase action count
		this.ix++;
		// invoke status method
		this._stats( ofn.sMsg );
		// add passed on arguments to args object
		for( var s in ofn.args ) {
			// get value
			var v = ofn.args[ s ];
			// if we deal with an arguments lookup we
			// fetch the value using the key/path string
			if( typeof v == "object" && v.arg ) {
					var lk = v.arg.split( "." );	
					v = this._args;
					lk.forEach( function( k ) {
						v = v[ k ];
					} );
			}
			// assign to arg chain
			this._args[ s ] = v;
		} 
		// we now invoke the function.
		if( typeof ofn.sfn == "string" ) {
			// in case its name is passed on as string
			// we invoke as key from context object passing
			// on our accumulated arguments object
			ofn.ctx[ ofn.sfn ]( this._args );
		}
		else {
			// in case we passed on an anonymous function
			// we invoke via "call" with context object again
			// passing on our accumulated arguments object
			ofn.sfn.call( ofn.ctx, this._args );
		}
	}
	/**
	 * <pre>
	 * Starts an asynchronous task chain
	 * </pre>
	 * @memberof __.Async
	 * @method start
	 * @example
	 * async.start();
	 * @returns {Object} Promise instance for chaining
	 * @instance
	 */
	, start : function() {
		// we start action chain by setting status to pending
		this._sStatus = "pending";
		// triggering the first action
		this._next();
		// and returning this object for possible further chaining
		return this;
	}
	/**
	 * <pre>
	 * Resolves a task that has been successfully execucted. Results can
	 * be passed on as object which adds them to the arguments object for
	 * the current task chain.
	 * </pre>
	 * @memberof __.Async
	 * @method resolve
	 * @example
	 * async.resolve();
	 * @example
	 * async.resolve( { sList : "Test list" } );
	 * @param {Object} args Arguments passed on as object
	 * @instance
	 */
	, resolve : function( args ) {
		// first we clear any bLateArrivals flag
		this.bLateArrivals = false;
		// next we remove all late arrival flags from tasks
		this._loTasks.forEach( function( ofn ) {
			ofn.bLateArrival = false;
		} );
		// add returned results to args object
		for( var s in args ) {
			this._args[ s ] = args[ s ];
		} 
		// invoke next action if array is not empty
		if( this._loTasks.length > 0 ) {
			this._next();
		}
		else {
			// otherwise stop and set status to idle
			this._sStatus = "idle";
			this._cleanUp();
		}
	}
	/**
	 * <pre>
	 * Stops the execution of the current task chain.
	 * </pre>
	 * @memberof __.Async
	 * @method stop
	 * @example
	 * async.stop()
	 * @instance
	 */
	, stop : function() {
		this._cleanUp();
	}
	/**
	 * <pre>
	 * Rejects a task that errored out in execution. An error message can
	 * be passed on which adds to the error object that is 
	 * created compiling all relevant error information. The error object
	 * is passed on to the default or custom error function.
	 * </pre>
	 * @memberof __.Async
	 * @method reject
	 * @example
	 * async.reject( "Could not save item to the list" );
	 * @param {String|Object} [xError] String or object describing the 
	 * error condition 
	 * @instance
	 */
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
		this._sStatus = "error";
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
		sStack += "args:(" + stringify( this._args ) + ") ";
		sStack += "xError:(" + stringify( xError ) + ")";
		var oStack = {
			  ix : this.ix
			, sError : sError
			, sLabel : this.sLabel
			, sFile : this.sFile
			, sErrorTask : this.scurMsg
			, args : this._args
			, xError : xError
			, sStack : sStack
		};
		// and invoke the error function with error and args object
		if( this.fnerr ) {
			this.fnerr( oStack );
		}
	}
	, _cleanUp : function() {
		if( ! this._bDebug ) {
			delete __.Async.store[ this.__guid_async__ ];
		}
	}
}


