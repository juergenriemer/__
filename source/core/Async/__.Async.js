// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name __.async.min.js
// @js_externs var __; __.Async; __.Async.ix; __.Async.store; __.Async.fnerr; __.Async.fnstat; __.Async.stub; __.Async.resolve; __.Async.reject; __.Async.Promise; __.Async.Promise.debug; __.Async.Promise.try; __.Async.Promise.catch; __.Async.Promise.clear; __.Async.Promise.wait; __.Async.Promise.when; __.Async.Promise.then; __.Async.Promise.start; __.Async.Promise.resolve; __.Async.Promise.stop; __.Async.Promise.reject; __.Async.Promise.ctx; __.Async.Promise.fnerr; __.Async.Promise.fnstat; __.Async.Promise._next; __.Async.promise; __.Async.Promise.sdftError; __.Async.Promise.__guid_async__; __.Async.__guid_async__; __.Async.Promise._args;
// ==/ClosureCompiler==
/**
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
 * @property {String}  id - Name of the asynchronous task stack; used for debugging
 * @property {String}  [sdftError] - default message shown to the user in case of a rejection
 * @property {Function}  [fnerr] - Custom function to be invoked in case of rejections
 * @property {Function}  [fnstat] - Custom function to be invoked on every finished task
 * @todo replace x1..xn paramters with more meaningful names e.g. ctx_or_cb
 * @example ( new __.Async() )
 * .then( __.SP.list, "create", { sList : "Dossier" } )
 * .start();
 * @example ( new __.Async( {
 * 	  id : "creating secure dossier"
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
 * Returns a promise object by its guid passed on as arguments object
 * If no guid is passed on it will create a new instance of Promise
 * @memberof __.Async
 * @method promise
 * @static
 * @param {Object} [args] arguments passed on as object 
 * @example function( args ) {
 *     var async = __.Async.promise( args );
 * }
 * @returns {Object} Promise instance for chaining
 */
__.Async.promise = function( args ) {
	// fetch the promise object from args.__guid_async__ 
	var oPromise = null;
	if( typeof args == "object" && args.__guid_async__ ) {
		oPromise = __.Async.store[ args.__guid_async__ ];
	}
	// or create a new Promise, i.e. we invoke an async task chain
	// as stand-alone
	else {
		oPromise = ( new __.Async() );
		// in case we pass on a callback we save it for later
		// invocation. We attach the callback to the promise
		// object with double underscores to prevent overriding
		// if no callback is attached we assume a console log
		// of the result as appropriate
		oPromise.__cb__ = ( args && args[ "cb" ] )
			? args[ "cb" ]
			: function( xResult ) {
				console.log( xResult );
			} ;
	}
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
	//this._args = args;
	this._args = { __guid_async__ : this.__guid_async__ };
	this._loTasks = [];
	this._bDebug = false;
	this._bTrying = false;
	this.ctx = ( args && args.ctx ) ? args.ctx : window;
	this.id = ( args && args.id ) ? args.id : this.__guid_async__;
	this.sdftError = ( args && args.sdftError ) ? args.sdftError : "";
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
	 * clears the arguments chain of an Async stack
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
	 * Pauses the execution of a task chain for given milliseconds.
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
	 * Pauses the execution of a task chain until a certain condition
	 * occurs. This condition is indicated as function that is polled
	 * every 25 milliseconds if not indicated otherwise.
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
	 * Indicates a try block of tasks
	 * @memberof __.Async
	 * @method try
	 * @example async.try()
	 * @instance
	 */
	, try : function() {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : function() {
				that._bTrying = true;
				that.resolve();
			}
			, args : {}
		};
		this._add( ofn );
		return this;
	}
	 /**
	 * Adds a catch
	 * @memberof __.Async
	 * @method catch
	 * @example async.catch( function( args ) {
	 *	var async = __.Async.promise( args );
	 *	// do sg
	 *	async.resolve();
	 * } )
	 * @param {Function} fn An anonymous function to be executed in case of
	 * exception
	 * @instance
	 */
	, catch : function( fn ) {
		var that = this;
		var ofn = {
			  ctx : this.ctx
			, sfn : fn || function( args ) {
				that.resolve();
			}
			, args : {}
			, bCatch : true
		};
		this._add( ofn );
		return this;
	}
	/**
	 * Registers methods to the task chain that shall get executed
	 * in parallel. 
	 * @memberof __.Async
	 * @method when 
	 * @example
	 * ( new __.Async() )
	 * .then( this, "task1", {x:1}, "p1" )
	 * .when( [
	 * 	  ( new __.Async() )
	 * 		.then( this, "task2", {x:2}, "p2" )
	 * 		.then( function( args ) {
	 * 			var async = __.Async.promise( args );
	 * 			var p1Results = args.aResult;
	 * 			delete args.aResult;
	 * 			async.resolve( { p1Results : p1Results } );
	 * 		} )
	 * 	 , ( new __.Async() )
	 * 		.then( this, "task3", {x:3}, "p3" )
	 * 		.then( this, "task4", {x:4}, "p4" )
	 * 	, ( new __.Async() ).then( this, "task5", {x:5}, "p5" )
	 * 	, ( new __.Async() ).then( this, "task6", {x:6}, "p6" )
	 * ], "execute in parallel" )
	 * .then( this, "task7", {x:7}, "p7" )
	 * .start();
	 * @param {Array} loAsyncs Array of Async stacks
	 * @param {String} [sMsg] logging message
	 * @returns {Object} Promise instance for chaining
	 * @instance
	 */
	, when : function( loAsyncs, sMsg ) {
		// get original arguments
		var _args = this._args;
		// set optional loggin message
		var sMsg = sMsg || "";
		var that = this;
		this.then( function() {
			var async = __.Async.promise( _args );
			var c = loAsyncs.length;
			loAsyncs.forEach( function( oAsync ) {
				// set link to parent Async stack
				oAsync.oParent = that;
				// add last task in parallel task stack
				// to identify whether we are finished
				oAsync.then( function( args ) {
					// add return result to args obj
					// excluding Async guid
					delete args.__guid_async__;
					for( var s in args ) {
						_args[ s ] = args[ s ];
					} 
					// if we went through all paras
					// we resolve to continue with
					// original async task stack
					if( --c == 0 ) {
						async.resolve();
					}
					// resolve last parallel task for
					// clean up
					oAsync.resolve();
					
				}, "done" )
				// and start the parallel task stack
				oAsync.start();
			} );
		}, sMsg );
		// return instance for chaining
		return this;
	}
	/**
	 * Registers a method to the task chain.
	 * <br />
	 * We can either register an existing method by indicating
	 * its parent object and method name or we register an anonymous function.
	 * In the first case the method needs to be "promisable" and invoke eitherresolve or reject.  
	 * The latter
	 * we usually choose to operate on results of previous task and/or we want
	 * fork the task chain base on conditions.
	 * <br />
	 * For debugging or showing progress we can add an additional message.
	 * <br />
	 * In order to use arguments from previous tasks use "args"
	 * </pre>
	 * @memberof __.Async
	 * @method then
	 * @example
	 * // oUser = class intance of User
	 * ( new __.Async() )
	 * .then( oUser, "getRecords", { idUser : 123 }, "Getting records" )
	 * .then( function( args ) {
	 *     var async = __.Async.promise( args );
	 *     if( args.hResults ) {
	 *         __.dn_( "#output" ).innerHTML = args.hResult;
	 *     }
	 *     else {
	 *         async.then( oUser, "delete", { idUser : 123 } );
	 *     }
	 *     async.resolve();
	 * }, "Printing records or deleting user" )
	 * .start();
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
				? ( typeof x3 == "object" )
					? x3
					: {}
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
		var that = this;
		// cut next function object from list
		var ofn = this._loTasks.shift();
		// first we check if its a catch and we didn't encounter an
		// error in which case we skip it and invoke the next task
		// NOTE: _bTrying is set to false by reject
		if( ofn.bCatch && this._bTrying ) {
			this._next();
			return;
		}
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
			if( typeof v == "object" && v && v[ "arg" ] ) {
				var lk = v[ "arg" ].split( "." );
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
			// in case of a forced callback (happens if we
			// indicate "cb" in a standalone call we invoke it
			if( this.__cb__ ) {
				this.__cb__( args );
			}
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
	 * @param {String|Object} [sError] String or object describing the 
	 * error condition 
	 * @instance
	 */
	, reject : function( xError ) {
		// create error stack
		var oStack = this._errorStack( xError );
		// if we are in a try/catch block we handle exception
		if( this._bTrying ) {
			this._handleException( oStack );
		}
		// check for try wrap in parent stack in which case we
		// invoke the parents exception handling
		else if( this.oParent && this.oParent._bTrying ) {
			this.oParent._handleException( oStack );
		}
		// or invoke the error function with error and args object
		else if( this.fnerr ) {
			this.fnerr( oStack );
		}
	}
	, _handleException : function( oStack ) {
		// in which case we jump to the closest catch
		// by deleting all task in between, to this 
		// we get the index of the next catch
		var ixCatch = 0;
		var c = this._loTasks.length;
		for( var ix=0; ix<c; ix++ ) {
			var oTask = this._loTasks[ ix ];
			if( oTask.bCatch ) {
				ixCatch = ix;
				break;
			}
		}
		// and blank all tasks before
		this._loTasks.splice( 0, ixCatch );
		// add the error stack object to the arguments chain
		this._bTrying = false;
		this._args.oError = oStack;
		// and invoke next task which is catch
		this._next();
	}
	, _errorStack : function( xError ) {
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
				? ( xError[ "sError" ] )
					? xError[ "sError" ]
					: "A task was rejected"
				: "A task was rejected";
		var sStack = "id:(" + this.id + ") ";
		sStack += "task:(" + this.scurMsg + ") ";
		sStack += "args:(" + stringify( this._args ) + ") ";
		sStack += "sdftError:(" + this.sdftError + ") ";
		sStack += "sError:(" + stringify( sError ) + ") ";
		var oStack = {
			  "ix" : this.ix
			, "id" : this.id
			, "sErrorTask" : this.scurMsg
			, "args" : this._args
			, "sdftError" : this.sdftError
			, "sError" : sError
			, "sStack" : sStack
		};
		return oStack;
	}
	, _cleanUp : function() {
		if( ! this._bDebug ) {
			delete __.Async.store[ this.__guid_async__ ];
		}
	}
}



