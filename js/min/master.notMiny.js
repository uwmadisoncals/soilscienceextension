/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!memory;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( window.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.style.width = "2px";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = marginDiv = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			conMarginTop, ptlm, vb, style, html,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
		vb = "visibility:hidden;border:0;";
		style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
		html = "<div " + style + "><div></div></div>" +
			"<table " + style + " cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Figure out if the W3C box model works as expected
		div.innerHTML = "";
		div.style.width = div.style.paddingLeft = "1px";
		jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
		}

		div.style.cssText = ptlm + vb;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		body.removeChild( container );
		div  = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, attr, name,
			data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 && !jQuery._data( this[0], "parsedAttrs" ) ) {
					attr = this[0].attributes;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
					jQuery._data( this[0], "parsedAttrs", true );
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var self = jQuery( this ),
					args = [ parts[0], value ];

				self.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;

					// See #9699 for explanation of this approach (setting first, then removal)
					jQuery.attr( elem, name, "" );
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( rboolean.test( name ) && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /\bhover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Determine handlers that should run if there are delegated events
		// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !event.target.disabled && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {
				selMatch = {};
				matches = [];
				jqcur[0] = cur;
				for ( i = 0; i < delegateCount; i++ ) {
					handleObj = handlers[ i ];
					sel = handleObj.selector;

					if ( selMatch[ sel ] === undefined ) {
						selMatch[ sel ] = (
							handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
						);
					}
					if ( selMatch[ sel ] ) {
						matches.push( handleObj );
					}
				}
				if ( matches.length ) {
					handlerQueue.push({ elem: cur, matches: matches });
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						// If form was submitted by the user, bubble the event up the tree
						if ( this.parentNode && !event.isTrigger ) {
							jQuery.event.simulate( "submit", this.parentNode, event, true );
						}
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on.call( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace? handleObj.type + "." + handleObj.namespace : handleObj.type,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					doneName = match[0];
					parent = elem.parentNode;
	
					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent[ expando ] = doneName;
					}
					
					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( 
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ? 
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test( "<" + elem.nodeName ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^([\-+])=([\-+.\de]+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret === null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ( ret || 0 );
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight,
		i = 0,
		len = which.length;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i++ ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i++ ) {
			val += parseFloat( jQuery.css( elem, "padding" + which[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + which[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + which[ i ] ) ) || 0;
			}
		}
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css(elem, "display") === "none" ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ( ( -Math.cos( p*Math.PI ) / 2 ) + 0.5 ) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( self.options.hide && jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				jQuery._data( self.elem, "fxshow" + self.prop, self.start );
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Adds width/height step functions
// Do not set anything below 0
jQuery.each([ "width", "height" ], function( i, prop ) {
	jQuery.fx.step[ prop ] = function( fx ) {
		jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
	};
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ],
				body = elem.document.body;
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				body && body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNumeric( ret ) ? ret : orig;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );
 /*! jQuery UI - v1.10.4 - 2014-05-14
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.position.js, jquery.ui.autocomplete.js, jquery.ui.menu.js
* Copyright 2014 jQuery Foundation and other contributors; Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.4",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( arguments.length === 1 ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( arguments.length === 1 ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );
(function( $, undefined ) {

$.ui = $.ui || {};

var cachedScrollbarWidth,
	max = Math.max,
	abs = Math.abs,
	round = Math.round,
	rhorizontal = /left|center|right/,
	rvertical = /top|center|bottom/,
	roffset = /[\+\-]\d+(\.[\d]+)?%?/,
	rposition = /^\w+/,
	rpercent = /%$/,
	_position = $.fn.position;

function getOffsets( offsets, width, height ) {
	return [
		parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
		parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
	];
}

function parseCss( element, property ) {
	return parseInt( $.css( element, property ), 10 ) || 0;
}

function getDimensions( elem ) {
	var raw = elem[0];
	if ( raw.nodeType === 9 ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: 0, left: 0 }
		};
	}
	if ( $.isWindow( raw ) ) {
		return {
			width: elem.width(),
			height: elem.height(),
			offset: { top: elem.scrollTop(), left: elem.scrollLeft() }
		};
	}
	if ( raw.preventDefault ) {
		return {
			width: 0,
			height: 0,
			offset: { top: raw.pageY, left: raw.pageX }
		};
	}
	return {
		width: elem.outerWidth(),
		height: elem.outerHeight(),
		offset: elem.offset()
	};
}

$.position = {
	scrollbarWidth: function() {
		if ( cachedScrollbarWidth !== undefined ) {
			return cachedScrollbarWidth;
		}
		var w1, w2,
			div = $( "<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>" ),
			innerDiv = div.children()[0];

		$( "body" ).append( div );
		w1 = innerDiv.offsetWidth;
		div.css( "overflow", "scroll" );

		w2 = innerDiv.offsetWidth;

		if ( w1 === w2 ) {
			w2 = div[0].clientWidth;
		}

		div.remove();

		return (cachedScrollbarWidth = w1 - w2);
	},
	getScrollInfo: function( within ) {
		var overflowX = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-x" ),
			overflowY = within.isWindow || within.isDocument ? "" :
				within.element.css( "overflow-y" ),
			hasOverflowX = overflowX === "scroll" ||
				( overflowX === "auto" && within.width < within.element[0].scrollWidth ),
			hasOverflowY = overflowY === "scroll" ||
				( overflowY === "auto" && within.height < within.element[0].scrollHeight );
		return {
			width: hasOverflowY ? $.position.scrollbarWidth() : 0,
			height: hasOverflowX ? $.position.scrollbarWidth() : 0
		};
	},
	getWithinInfo: function( element ) {
		var withinElement = $( element || window ),
			isWindow = $.isWindow( withinElement[0] ),
			isDocument = !!withinElement[ 0 ] && withinElement[ 0 ].nodeType === 9;
		return {
			element: withinElement,
			isWindow: isWindow,
			isDocument: isDocument,
			offset: withinElement.offset() || { left: 0, top: 0 },
			scrollLeft: withinElement.scrollLeft(),
			scrollTop: withinElement.scrollTop(),
			width: isWindow ? withinElement.width() : withinElement.outerWidth(),
			height: isWindow ? withinElement.height() : withinElement.outerHeight()
		};
	}
};

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions,
		target = $( options.of ),
		within = $.position.getWithinInfo( options.within ),
		scrollInfo = $.position.getScrollInfo( within ),
		collision = ( options.collision || "flip" ).split( " " ),
		offsets = {};

	dimensions = getDimensions( target );
	if ( target[0].preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
	}
	targetWidth = dimensions.width;
	targetHeight = dimensions.height;
	targetOffset = dimensions.offset;
	// clone to reuse original targetOffset later
	basePosition = $.extend( {}, targetOffset );

	// force my and at to have valid horizontal and vertical positions
	// if a value is missing or invalid, it will be converted to center
	$.each( [ "my", "at" ], function() {
		var pos = ( options[ this ] || "" ).split( " " ),
			horizontalOffset,
			verticalOffset;

		if ( pos.length === 1) {
			pos = rhorizontal.test( pos[ 0 ] ) ?
				pos.concat( [ "center" ] ) :
				rvertical.test( pos[ 0 ] ) ?
					[ "center" ].concat( pos ) :
					[ "center", "center" ];
		}
		pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
		pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

		// calculate offsets
		horizontalOffset = roffset.exec( pos[ 0 ] );
		verticalOffset = roffset.exec( pos[ 1 ] );
		offsets[ this ] = [
			horizontalOffset ? horizontalOffset[ 0 ] : 0,
			verticalOffset ? verticalOffset[ 0 ] : 0
		];

		// reduce to just the positions without the offsets
		options[ this ] = [
			rposition.exec( pos[ 0 ] )[ 0 ],
			rposition.exec( pos[ 1 ] )[ 0 ]
		];
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	if ( options.at[ 0 ] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[ 0 ] === "center" ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[ 1 ] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[ 1 ] === "center" ) {
		basePosition.top += targetHeight / 2;
	}

	atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
	basePosition.left += atOffset[ 0 ];
	basePosition.top += atOffset[ 1 ];

	return this.each(function() {
		var collisionPosition, using,
			elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseCss( this, "marginLeft" ),
			marginTop = parseCss( this, "marginTop" ),
			collisionWidth = elemWidth + marginLeft + parseCss( this, "marginRight" ) + scrollInfo.width,
			collisionHeight = elemHeight + marginTop + parseCss( this, "marginBottom" ) + scrollInfo.height,
			position = $.extend( {}, basePosition ),
			myOffset = getOffsets( offsets.my, elem.outerWidth(), elem.outerHeight() );

		if ( options.my[ 0 ] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[ 0 ] === "center" ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[ 1 ] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[ 1 ] === "center" ) {
			position.top -= elemHeight / 2;
		}

		position.left += myOffset[ 0 ];
		position.top += myOffset[ 1 ];

		// if the browser doesn't support fractions, then round for consistent results
		if ( !$.support.offsetFractions ) {
			position.left = round( position.left );
			position.top = round( position.top );
		}

		collisionPosition = {
			marginLeft: marginLeft,
			marginTop: marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[ i ] ] ) {
				$.ui.position[ collision[ i ] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
					my: options.my,
					at: options.at,
					within: within,
					elem : elem
				});
			}
		});

		if ( options.using ) {
			// adds feedback as second argument to using callback, if present
			using = function( props ) {
				var left = targetOffset.left - position.left,
					right = left + targetWidth - elemWidth,
					top = targetOffset.top - position.top,
					bottom = top + targetHeight - elemHeight,
					feedback = {
						target: {
							element: target,
							left: targetOffset.left,
							top: targetOffset.top,
							width: targetWidth,
							height: targetHeight
						},
						element: {
							element: elem,
							left: position.left,
							top: position.top,
							width: elemWidth,
							height: elemHeight
						},
						horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
						vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
					};
				if ( targetWidth < elemWidth && abs( left + right ) < targetWidth ) {
					feedback.horizontal = "center";
				}
				if ( targetHeight < elemHeight && abs( top + bottom ) < targetHeight ) {
					feedback.vertical = "middle";
				}
				if ( max( abs( left ), abs( right ) ) > max( abs( top ), abs( bottom ) ) ) {
					feedback.important = "horizontal";
				} else {
					feedback.important = "vertical";
				}
				options.using.call( this, props, feedback );
			};
		}

		elem.offset( $.extend( position, { using: using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
				outerWidth = within.width,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = withinOffset - collisionPosLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
				newOverRight;

			// element is wider than within
			if ( data.collisionWidth > outerWidth ) {
				// element is initially over the left side of within
				if ( overLeft > 0 && overRight <= 0 ) {
					newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
					position.left += overLeft - newOverRight;
				// element is initially over right side of within
				} else if ( overRight > 0 && overLeft <= 0 ) {
					position.left = withinOffset;
				// element is initially over both left and right sides of within
				} else {
					if ( overLeft > overRight ) {
						position.left = withinOffset + outerWidth - data.collisionWidth;
					} else {
						position.left = withinOffset;
					}
				}
			// too far left -> align with left edge
			} else if ( overLeft > 0 ) {
				position.left += overLeft;
			// too far right -> align with right edge
			} else if ( overRight > 0 ) {
				position.left -= overRight;
			// adjust based on position and margin
			} else {
				position.left = max( position.left - collisionPosLeft, position.left );
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
				outerHeight = data.within.height,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = withinOffset - collisionPosTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
				newOverBottom;

			// element is taller than within
			if ( data.collisionHeight > outerHeight ) {
				// element is initially over the top of within
				if ( overTop > 0 && overBottom <= 0 ) {
					newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
					position.top += overTop - newOverBottom;
				// element is initially over bottom of within
				} else if ( overBottom > 0 && overTop <= 0 ) {
					position.top = withinOffset;
				// element is initially over both top and bottom of within
				} else {
					if ( overTop > overBottom ) {
						position.top = withinOffset + outerHeight - data.collisionHeight;
					} else {
						position.top = withinOffset;
					}
				}
			// too far up -> align with top
			} else if ( overTop > 0 ) {
				position.top += overTop;
			// too far down -> align with bottom edge
			} else if ( overBottom > 0 ) {
				position.top -= overBottom;
			// adjust based on position and margin
			} else {
				position.top = max( position.top - collisionPosTop, position.top );
			}
		}
	},
	flip: {
		left: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.left + within.scrollLeft,
				outerWidth = within.width,
				offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
				collisionPosLeft = position.left - data.collisionPosition.marginLeft,
				overLeft = collisionPosLeft - offsetLeft,
				overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					data.at[ 0 ] === "right" ?
						-data.targetWidth :
						0,
				offset = -2 * data.offset[ 0 ],
				newOverRight,
				newOverLeft;

			if ( overLeft < 0 ) {
				newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
				if ( newOverRight < 0 || newOverRight < abs( overLeft ) ) {
					position.left += myOffset + atOffset + offset;
				}
			}
			else if ( overRight > 0 ) {
				newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
				if ( newOverLeft > 0 || abs( newOverLeft ) < overRight ) {
					position.left += myOffset + atOffset + offset;
				}
			}
		},
		top: function( position, data ) {
			var within = data.within,
				withinOffset = within.offset.top + within.scrollTop,
				outerHeight = within.height,
				offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
				collisionPosTop = position.top - data.collisionPosition.marginTop,
				overTop = collisionPosTop - offsetTop,
				overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
				top = data.my[ 1 ] === "top",
				myOffset = top ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					data.at[ 1 ] === "bottom" ?
						-data.targetHeight :
						0,
				offset = -2 * data.offset[ 1 ],
				newOverTop,
				newOverBottom;
			if ( overTop < 0 ) {
				newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
				if ( ( position.top + myOffset + atOffset + offset) > overTop && ( newOverBottom < 0 || newOverBottom < abs( overTop ) ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
			else if ( overBottom > 0 ) {
				newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
				if ( ( position.top + myOffset + atOffset + offset) > overBottom && ( newOverTop > 0 || abs( newOverTop ) < overBottom ) ) {
					position.top += myOffset + atOffset + offset;
				}
			}
		}
	},
	flipfit: {
		left: function() {
			$.ui.position.flip.left.apply( this, arguments );
			$.ui.position.fit.left.apply( this, arguments );
		},
		top: function() {
			$.ui.position.flip.top.apply( this, arguments );
			$.ui.position.fit.top.apply( this, arguments );
		}
	}
};

// fraction support test
(function () {
	var testElement, testElementParent, testElementStyle, offsetLeft, i,
		body = document.getElementsByTagName( "body" )[ 0 ],
		div = document.createElement( "div" );

	//Create a "fake body" for testing based on method used in jQuery.support
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0,
		background: "none"
	};
	if ( body ) {
		$.extend( testElementStyle, {
			position: "absolute",
			left: "-1000px",
			top: "-1000px"
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || document.documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	div.style.cssText = "position: absolute; left: 10.7432222px;";

	offsetLeft = $( div ).offset().left;
	$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );
})();

}( jQuery ) );
(function( $, undefined ) {

$.widget( "ui.autocomplete", {
	version: "1.10.4",
	defaultElement: "<input>",
	options: {
		appendTo: null,
		autoFocus: false,
		delay: 300,
		minLength: 1,
		position: {
			my: "left top",
			at: "left bottom",
			collision: "none"
		},
		source: null,

		// callbacks
		change: null,
		close: null,
		focus: null,
		open: null,
		response: null,
		search: null,
		select: null
	},

	requestIndex: 0,
	pending: 0,

	_create: function() {
		// Some browsers only repeat keydown events, not keypress events,
		// so we use the suppressKeyPress flag to determine if we've already
		// handled the keydown event. #7269
		// Unfortunately the code for & in keypress is the same as the up arrow,
		// so we use the suppressKeyPressRepeat flag to avoid handling keypress
		// events when we know the keydown event was used to modify the
		// search term. #7799
		var suppressKeyPress, suppressKeyPressRepeat, suppressInput,
			nodeName = this.element[0].nodeName.toLowerCase(),
			isTextarea = nodeName === "textarea",
			isInput = nodeName === "input";

		this.isMultiLine =
			// Textareas are always multi-line
			isTextarea ? true :
			// Inputs are always single-line, even if inside a contentEditable element
			// IE also treats inputs as contentEditable
			isInput ? false :
			// All other element types are determined by whether or not they're contentEditable
			this.element.prop( "isContentEditable" );

		this.valueMethod = this.element[ isTextarea || isInput ? "val" : "text" ];
		this.isNewMenu = true;

		this.element
			.addClass( "ui-autocomplete-input" )
			.attr( "autocomplete", "off" );

		this._on( this.element, {
			keydown: function( event ) {
				if ( this.element.prop( "readOnly" ) ) {
					suppressKeyPress = true;
					suppressInput = true;
					suppressKeyPressRepeat = true;
					return;
				}

				suppressKeyPress = false;
				suppressInput = false;
				suppressKeyPressRepeat = false;
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					suppressKeyPress = true;
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					suppressKeyPress = true;
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					suppressKeyPress = true;
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					suppressKeyPress = true;
					this._keyEvent( "next", event );
					break;
				case keyCode.ENTER:
				case keyCode.NUMPAD_ENTER:
					// when menu is open and has focus
					if ( this.menu.active ) {
						// #6055 - Opera still allows the keypress to occur
						// which causes forms to submit
						suppressKeyPress = true;
						event.preventDefault();
						this.menu.select( event );
					}
					break;
				case keyCode.TAB:
					if ( this.menu.active ) {
						this.menu.select( event );
					}
					break;
				case keyCode.ESCAPE:
					if ( this.menu.element.is( ":visible" ) ) {
						this._value( this.term );
						this.close( event );
						// Different browsers have different default behavior for escape
						// Single press can mean undo or clear
						// Double press in IE means clear the whole form
						event.preventDefault();
					}
					break;
				default:
					suppressKeyPressRepeat = true;
					// search timeout should be triggered before the input value is changed
					this._searchTimeout( event );
					break;
				}
			},
			keypress: function( event ) {
				if ( suppressKeyPress ) {
					suppressKeyPress = false;
					if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
						event.preventDefault();
					}
					return;
				}
				if ( suppressKeyPressRepeat ) {
					return;
				}

				// replicate some key handlers to allow them to repeat in Firefox and Opera
				var keyCode = $.ui.keyCode;
				switch( event.keyCode ) {
				case keyCode.PAGE_UP:
					this._move( "previousPage", event );
					break;
				case keyCode.PAGE_DOWN:
					this._move( "nextPage", event );
					break;
				case keyCode.UP:
					this._keyEvent( "previous", event );
					break;
				case keyCode.DOWN:
					this._keyEvent( "next", event );
					break;
				}
			},
			input: function( event ) {
				if ( suppressInput ) {
					suppressInput = false;
					event.preventDefault();
					return;
				}
				this._searchTimeout( event );
			},
			focus: function() {
				this.selectedItem = null;
				this.previous = this._value();
			},
			blur: function( event ) {
				if ( this.cancelBlur ) {
					delete this.cancelBlur;
					return;
				}

				clearTimeout( this.searching );
				this.close( event );
				this._change( event );
			}
		});

		this._initSource();
		this.menu = $( "<ul>" )
			.addClass( "ui-autocomplete ui-front" )
			.appendTo( this._appendTo() )
			.menu({
				// disable ARIA support, the live region takes care of that
				role: null
			})
			.hide()
			.data( "ui-menu" );

		this._on( this.menu.element, {
			mousedown: function( event ) {
				// prevent moving focus out of the text field
				event.preventDefault();

				// IE doesn't prevent moving focus even with event.preventDefault()
				// so we set a flag to know when we should ignore the blur event
				this.cancelBlur = true;
				this._delay(function() {
					delete this.cancelBlur;
				});

				// clicking on the scrollbar causes focus to shift to the body
				// but we can't detect a mouseup or a click immediately afterward
				// so we have to track the next mousedown and close the menu if
				// the user clicks somewhere outside of the autocomplete
				var menuElement = this.menu.element[ 0 ];
				if ( !$( event.target ).closest( ".ui-menu-item" ).length ) {
					this._delay(function() {
						var that = this;
						this.document.one( "mousedown", function( event ) {
							if ( event.target !== that.element[ 0 ] &&
									event.target !== menuElement &&
									!$.contains( menuElement, event.target ) ) {
								that.close();
							}
						});
					});
				}
			},
			menufocus: function( event, ui ) {
				// support: Firefox
				// Prevent accidental activation of menu items in Firefox (#7024 #9118)
				if ( this.isNewMenu ) {
					this.isNewMenu = false;
					if ( event.originalEvent && /^mouse/.test( event.originalEvent.type ) ) {
						this.menu.blur();

						this.document.one( "mousemove", function() {
							$( event.target ).trigger( event.originalEvent );
						});

						return;
					}
				}

				var item = ui.item.data( "ui-autocomplete-item" );
				if ( false !== this._trigger( "focus", event, { item: item } ) ) {
					// use value to match what will end up in the input, if it was a key event
					if ( event.originalEvent && /^key/.test( event.originalEvent.type ) ) {
						this._value( item.value );
					}
				} else {
					// Normally the input is populated with the item's value as the
					// menu is navigated, causing screen readers to notice a change and
					// announce the item. Since the focus event was canceled, this doesn't
					// happen, so we update the live region so that screen readers can
					// still notice the change and announce it.
					this.liveRegion.text( item.value );
				}
			},
			menuselect: function( event, ui ) {
				var item = ui.item.data( "ui-autocomplete-item" ),
					previous = this.previous;

				// only trigger when focus was lost (click on menu)
				if ( this.element[0] !== this.document[0].activeElement ) {
					this.element.focus();
					this.previous = previous;
					// #6109 - IE triggers two focus events and the second
					// is asynchronous, so we need to reset the previous
					// term synchronously and asynchronously :-(
					this._delay(function() {
						this.previous = previous;
						this.selectedItem = item;
					});
				}

				if ( false !== this._trigger( "select", event, { item: item } ) ) {
					this._value( item.value );
				}
				// reset the term after the select event
				// this allows custom select handling to work properly
				this.term = this._value();

				this.close( event );
				this.selectedItem = item;
			}
		});

		this.liveRegion = $( "<span>", {
				role: "status",
				"aria-live": "polite"
			})
			.addClass( "ui-helper-hidden-accessible" )
			.insertBefore( this.element );

		// turning off autocomplete prevents the browser from remembering the
		// value when navigating through history, so we re-enable autocomplete
		// if the page is unloaded before the widget is destroyed. #7790
		this._on( this.window, {
			beforeunload: function() {
				this.element.removeAttr( "autocomplete" );
			}
		});
	},

	_destroy: function() {
		clearTimeout( this.searching );
		this.element
			.removeClass( "ui-autocomplete-input" )
			.removeAttr( "autocomplete" );
		this.menu.element.remove();
		this.liveRegion.remove();
	},

	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "source" ) {
			this._initSource();
		}
		if ( key === "appendTo" ) {
			this.menu.element.appendTo( this._appendTo() );
		}
		if ( key === "disabled" && value && this.xhr ) {
			this.xhr.abort();
		}
	},

	_appendTo: function() {
		var element = this.options.appendTo;

		if ( element ) {
			element = element.jquery || element.nodeType ?
				$( element ) :
				this.document.find( element ).eq( 0 );
		}

		if ( !element ) {
			element = this.element.closest( ".ui-front" );
		}

		if ( !element.length ) {
			element = this.document[0].body;
		}

		return element;
	},

	_initSource: function() {
		var array, url,
			that = this;
		if ( $.isArray(this.options.source) ) {
			array = this.options.source;
			this.source = function( request, response ) {
				response( $.ui.autocomplete.filter( array, request.term ) );
			};
		} else if ( typeof this.options.source === "string" ) {
			url = this.options.source;
			this.source = function( request, response ) {
				if ( that.xhr ) {
					that.xhr.abort();
				}
				that.xhr = $.ajax({
					url: url,
					data: request,
					dataType: "json",
					success: function( data ) {
						response( data );
					},
					error: function() {
						response( [] );
					}
				});
			};
		} else {
			this.source = this.options.source;
		}
	},

	_searchTimeout: function( event ) {
		clearTimeout( this.searching );
		this.searching = this._delay(function() {
			// only search if the value has changed
			if ( this.term !== this._value() ) {
				this.selectedItem = null;
				this.search( null, event );
			}
		}, this.options.delay );
	},

	search: function( value, event ) {
		value = value != null ? value : this._value();

		// always save the actual value, not the one passed as an argument
		this.term = this._value();

		if ( value.length < this.options.minLength ) {
			return this.close( event );
		}

		if ( this._trigger( "search", event ) === false ) {
			return;
		}

		return this._search( value );
	},

	_search: function( value ) {
		this.pending++;
		this.element.addClass( "ui-autocomplete-loading" );
		this.cancelSearch = false;

		this.source( { term: value }, this._response() );
	},

	_response: function() {
		var index = ++this.requestIndex;

		return $.proxy(function( content ) {
			if ( index === this.requestIndex ) {
				this.__response( content );
			}

			this.pending--;
			if ( !this.pending ) {
				this.element.removeClass( "ui-autocomplete-loading" );
			}
		}, this );
	},

	__response: function( content ) {
		if ( content ) {
			content = this._normalize( content );
		}
		this._trigger( "response", null, { content: content } );
		if ( !this.options.disabled && content && content.length && !this.cancelSearch ) {
			this._suggest( content );
			this._trigger( "open" );
		} else {
			// use ._close() instead of .close() so we don't cancel future searches
			this._close();
		}
	},

	close: function( event ) {
		this.cancelSearch = true;
		this._close( event );
	},

	_close: function( event ) {
		if ( this.menu.element.is( ":visible" ) ) {
			this.menu.element.hide();
			this.menu.blur();
			this.isNewMenu = true;
			this._trigger( "close", event );
		}
	},

	_change: function( event ) {
		if ( this.previous !== this._value() ) {
			this._trigger( "change", event, { item: this.selectedItem } );
		}
	},

	_normalize: function( items ) {
		// assume all items have the right format when the first item is complete
		if ( items.length && items[0].label && items[0].value ) {
			return items;
		}
		return $.map( items, function( item ) {
			if ( typeof item === "string" ) {
				return {
					label: item,
					value: item
				};
			}
			return $.extend({
				label: item.label || item.value,
				value: item.value || item.label
			}, item );
		});
	},

	_suggest: function( items ) {
		var ul = this.menu.element.empty();
		this._renderMenu( ul, items );
		this.isNewMenu = true;
		this.menu.refresh();

		// size and position menu
		ul.show();
		this._resizeMenu();
		ul.position( $.extend({
			of: this.element
		}, this.options.position ));

		if ( this.options.autoFocus ) {
			this.menu.next();
		}
	},

	_resizeMenu: function() {
		var ul = this.menu.element;
		ul.outerWidth( Math.max(
			// Firefox wraps long text (possibly a rounding bug)
			// so we add 1px to avoid the wrapping (#7513)
			ul.width( "" ).outerWidth() + 1,
			this.element.outerWidth()
		) );
	},

	_renderMenu: function( ul, items ) {
		var that = this;
		$.each( items, function( index, item ) {
			that._renderItemData( ul, item );
		});
	},

	_renderItemData: function( ul, item ) {
		return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
	},

	_renderItem: function( ul, item ) {
		return $( "<li>" )
			.append( $( "<a>" ).text( item.label ) )
			.appendTo( ul );
	},

	_move: function( direction, event ) {
		if ( !this.menu.element.is( ":visible" ) ) {
			this.search( null, event );
			return;
		}
		if ( this.menu.isFirstItem() && /^previous/.test( direction ) ||
				this.menu.isLastItem() && /^next/.test( direction ) ) {
			this._value( this.term );
			this.menu.blur();
			return;
		}
		this.menu[ direction ]( event );
	},

	widget: function() {
		return this.menu.element;
	},

	_value: function() {
		return this.valueMethod.apply( this.element, arguments );
	},

	_keyEvent: function( keyEvent, event ) {
		if ( !this.isMultiLine || this.menu.element.is( ":visible" ) ) {
			this._move( keyEvent, event );

			// prevents moving cursor to beginning/end of the text field in some browsers
			event.preventDefault();
		}
	}
});

$.extend( $.ui.autocomplete, {
	escapeRegex: function( value ) {
		return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
	},
	filter: function(array, term) {
		var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
		return $.grep( array, function(value) {
			return matcher.test( value.label || value.value || value );
		});
	}
});


// live region extension, adding a `messages` option
// NOTE: This is an experimental API. We are still investigating
// a full solution for string manipulation and internationalization.
$.widget( "ui.autocomplete", $.ui.autocomplete, {
	options: {
		messages: {
			noResults: "No search results.",
			results: function( amount ) {
				return amount + ( amount > 1 ? " results are" : " result is" ) +
					" available, use up and down arrow keys to navigate.";
			}
		}
	},

	__response: function( content ) {
		var message;
		this._superApply( arguments );
		if ( this.options.disabled || this.cancelSearch ) {
			return;
		}
		if ( content && content.length ) {
			message = this.options.messages.results( content.length );
		} else {
			message = this.options.messages.noResults;
		}
		this.liveRegion.text( message );
	}
});

}( jQuery ));
(function( $, undefined ) {

$.widget( "ui.menu", {
	version: "1.10.4",
	defaultElement: "<ul>",
	delay: 300,
	options: {
		icons: {
			submenu: "ui-icon-carat-1-e"
		},
		menus: "ul",
		position: {
			my: "left top",
			at: "right top"
		},
		role: "menu",

		// callbacks
		blur: null,
		focus: null,
		select: null
	},

	_create: function() {
		this.activeMenu = this.element;
		// flag used to prevent firing of the click handler
		// as the event bubbles up through nested menus
		this.mouseHandled = false;
		this.element
			.uniqueId()
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length )
			.attr({
				role: this.options.role,
				tabIndex: 0
			})
			// need to catch all clicks on disabled menu
			// not possible through _on
			.bind( "click" + this.eventNamespace, $.proxy(function( event ) {
				if ( this.options.disabled ) {
					event.preventDefault();
				}
			}, this ));

		if ( this.options.disabled ) {
			this.element
				.addClass( "ui-state-disabled" )
				.attr( "aria-disabled", "true" );
		}

		this._on({
			// Prevent focus from sticking to links inside menu after clicking
			// them (focus should always stay on UL during navigation).
			"mousedown .ui-menu-item > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-state-disabled > a": function( event ) {
				event.preventDefault();
			},
			"click .ui-menu-item:has(a)": function( event ) {
				var target = $( event.target ).closest( ".ui-menu-item" );
				if ( !this.mouseHandled && target.not( ".ui-state-disabled" ).length ) {
					this.select( event );

					// Only set the mouseHandled flag if the event will bubble, see #9469.
					if ( !event.isPropagationStopped() ) {
						this.mouseHandled = true;
					}

					// Open submenu on click
					if ( target.has( ".ui-menu" ).length ) {
						this.expand( event );
					} else if ( !this.element.is( ":focus" ) && $( this.document[ 0 ].activeElement ).closest( ".ui-menu" ).length ) {

						// Redirect focus to the menu
						this.element.trigger( "focus", [ true ] );

						// If the active item is on the top level, let it stay active.
						// Otherwise, blur the active item since it is no longer visible.
						if ( this.active && this.active.parents( ".ui-menu" ).length === 1 ) {
							clearTimeout( this.timer );
						}
					}
				}
			},
			"mouseenter .ui-menu-item": function( event ) {
				var target = $( event.currentTarget );
				// Remove ui-state-active class from siblings of the newly focused menu item
				// to avoid a jump caused by adjacent elements both having a class with a border
				target.siblings().children( ".ui-state-active" ).removeClass( "ui-state-active" );
				this.focus( event, target );
			},
			mouseleave: "collapseAll",
			"mouseleave .ui-menu": "collapseAll",
			focus: function( event, keepActiveItem ) {
				// If there's already an active item, keep it active
				// If not, activate the first item
				var item = this.active || this.element.children( ".ui-menu-item" ).eq( 0 );

				if ( !keepActiveItem ) {
					this.focus( event, item );
				}
			},
			blur: function( event ) {
				this._delay(function() {
					if ( !$.contains( this.element[0], this.document[0].activeElement ) ) {
						this.collapseAll( event );
					}
				});
			},
			keydown: "_keydown"
		});

		this.refresh();

		// Clicks outside of a menu collapse any open menus
		this._on( this.document, {
			click: function( event ) {
				if ( !$( event.target ).closest( ".ui-menu" ).length ) {
					this.collapseAll( event );
				}

				// Reset the mouseHandled flag
				this.mouseHandled = false;
			}
		});
	},

	_destroy: function() {
		// Destroy (sub)menus
		this.element
			.removeAttr( "aria-activedescendant" )
			.find( ".ui-menu" ).addBack()
				.removeClass( "ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons" )
				.removeAttr( "role" )
				.removeAttr( "tabIndex" )
				.removeAttr( "aria-labelledby" )
				.removeAttr( "aria-expanded" )
				.removeAttr( "aria-hidden" )
				.removeAttr( "aria-disabled" )
				.removeUniqueId()
				.show();

		// Destroy menu items
		this.element.find( ".ui-menu-item" )
			.removeClass( "ui-menu-item" )
			.removeAttr( "role" )
			.removeAttr( "aria-disabled" )
			.children( "a" )
				.removeUniqueId()
				.removeClass( "ui-corner-all ui-state-hover" )
				.removeAttr( "tabIndex" )
				.removeAttr( "role" )
				.removeAttr( "aria-haspopup" )
				.children().each( function() {
					var elem = $( this );
					if ( elem.data( "ui-menu-submenu-carat" ) ) {
						elem.remove();
					}
				});

		// Destroy menu dividers
		this.element.find( ".ui-menu-divider" ).removeClass( "ui-menu-divider ui-widget-content" );
	},

	_keydown: function( event ) {
		var match, prev, character, skip, regex,
			preventDefault = true;

		function escape( value ) {
			return value.replace( /[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&" );
		}

		switch ( event.keyCode ) {
		case $.ui.keyCode.PAGE_UP:
			this.previousPage( event );
			break;
		case $.ui.keyCode.PAGE_DOWN:
			this.nextPage( event );
			break;
		case $.ui.keyCode.HOME:
			this._move( "first", "first", event );
			break;
		case $.ui.keyCode.END:
			this._move( "last", "last", event );
			break;
		case $.ui.keyCode.UP:
			this.previous( event );
			break;
		case $.ui.keyCode.DOWN:
			this.next( event );
			break;
		case $.ui.keyCode.LEFT:
			this.collapse( event );
			break;
		case $.ui.keyCode.RIGHT:
			if ( this.active && !this.active.is( ".ui-state-disabled" ) ) {
				this.expand( event );
			}
			break;
		case $.ui.keyCode.ENTER:
		case $.ui.keyCode.SPACE:
			this._activate( event );
			break;
		case $.ui.keyCode.ESCAPE:
			this.collapse( event );
			break;
		default:
			preventDefault = false;
			prev = this.previousFilter || "";
			character = String.fromCharCode( event.keyCode );
			skip = false;

			clearTimeout( this.filterTimer );

			if ( character === prev ) {
				skip = true;
			} else {
				character = prev + character;
			}

			regex = new RegExp( "^" + escape( character ), "i" );
			match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
				return regex.test( $( this ).children( "a" ).text() );
			});
			match = skip && match.index( this.active.next() ) !== -1 ?
				this.active.nextAll( ".ui-menu-item" ) :
				match;

			// If no matches on the current filter, reset to the last character pressed
			// to move down the menu to the first item that starts with that character
			if ( !match.length ) {
				character = String.fromCharCode( event.keyCode );
				regex = new RegExp( "^" + escape( character ), "i" );
				match = this.activeMenu.children( ".ui-menu-item" ).filter(function() {
					return regex.test( $( this ).children( "a" ).text() );
				});
			}

			if ( match.length ) {
				this.focus( event, match );
				if ( match.length > 1 ) {
					this.previousFilter = character;
					this.filterTimer = this._delay(function() {
						delete this.previousFilter;
					}, 1000 );
				} else {
					delete this.previousFilter;
				}
			} else {
				delete this.previousFilter;
			}
		}

		if ( preventDefault ) {
			event.preventDefault();
		}
	},

	_activate: function( event ) {
		if ( !this.active.is( ".ui-state-disabled" ) ) {
			if ( this.active.children( "a[aria-haspopup='true']" ).length ) {
				this.expand( event );
			} else {
				this.select( event );
			}
		}
	},

	refresh: function() {
		var menus,
			icon = this.options.icons.submenu,
			submenus = this.element.find( this.options.menus );

		this.element.toggleClass( "ui-menu-icons", !!this.element.find( ".ui-icon" ).length );

		// Initialize nested menus
		submenus.filter( ":not(.ui-menu)" )
			.addClass( "ui-menu ui-widget ui-widget-content ui-corner-all" )
			.hide()
			.attr({
				role: this.options.role,
				"aria-hidden": "true",
				"aria-expanded": "false"
			})
			.each(function() {
				var menu = $( this ),
					item = menu.prev( "a" ),
					submenuCarat = $( "<span>" )
						.addClass( "ui-menu-icon ui-icon " + icon )
						.data( "ui-menu-submenu-carat", true );

				item
					.attr( "aria-haspopup", "true" )
					.prepend( submenuCarat );
				menu.attr( "aria-labelledby", item.attr( "id" ) );
			});

		menus = submenus.add( this.element );

		// Don't refresh list items that are already adapted
		menus.children( ":not(.ui-menu-item):has(a)" )
			.addClass( "ui-menu-item" )
			.attr( "role", "presentation" )
			.children( "a" )
				.uniqueId()
				.addClass( "ui-corner-all" )
				.attr({
					tabIndex: -1,
					role: this._itemRole()
				});

		// Initialize unlinked menu-items containing spaces and/or dashes only as dividers
		menus.children( ":not(.ui-menu-item)" ).each(function() {
			var item = $( this );
			// hyphen, em dash, en dash
			if ( !/[^\-\u2014\u2013\s]/.test( item.text() ) ) {
				item.addClass( "ui-widget-content ui-menu-divider" );
			}
		});

		// Add aria-disabled attribute to any disabled menu item
		menus.children( ".ui-state-disabled" ).attr( "aria-disabled", "true" );

		// If the active item has been removed, blur the menu
		if ( this.active && !$.contains( this.element[ 0 ], this.active[ 0 ] ) ) {
			this.blur();
		}
	},

	_itemRole: function() {
		return {
			menu: "menuitem",
			listbox: "option"
		}[ this.options.role ];
	},

	_setOption: function( key, value ) {
		if ( key === "icons" ) {
			this.element.find( ".ui-menu-icon" )
				.removeClass( this.options.icons.submenu )
				.addClass( value.submenu );
		}
		this._super( key, value );
	},

	focus: function( event, item ) {
		var nested, focused;
		this.blur( event, event && event.type === "focus" );

		this._scrollIntoView( item );

		this.active = item.first();
		focused = this.active.children( "a" ).addClass( "ui-state-focus" );
		// Only update aria-activedescendant if there's a role
		// otherwise we assume focus is managed elsewhere
		if ( this.options.role ) {
			this.element.attr( "aria-activedescendant", focused.attr( "id" ) );
		}

		// Highlight active parent menu item, if any
		this.active
			.parent()
			.closest( ".ui-menu-item" )
			.children( "a:first" )
			.addClass( "ui-state-active" );

		if ( event && event.type === "keydown" ) {
			this._close();
		} else {
			this.timer = this._delay(function() {
				this._close();
			}, this.delay );
		}

		nested = item.children( ".ui-menu" );
		if ( nested.length && event && ( /^mouse/.test( event.type ) ) ) {
			this._startOpening(nested);
		}
		this.activeMenu = item.parent();

		this._trigger( "focus", event, { item: item } );
	},

	_scrollIntoView: function( item ) {
		var borderTop, paddingTop, offset, scroll, elementHeight, itemHeight;
		if ( this._hasScroll() ) {
			borderTop = parseFloat( $.css( this.activeMenu[0], "borderTopWidth" ) ) || 0;
			paddingTop = parseFloat( $.css( this.activeMenu[0], "paddingTop" ) ) || 0;
			offset = item.offset().top - this.activeMenu.offset().top - borderTop - paddingTop;
			scroll = this.activeMenu.scrollTop();
			elementHeight = this.activeMenu.height();
			itemHeight = item.height();

			if ( offset < 0 ) {
				this.activeMenu.scrollTop( scroll + offset );
			} else if ( offset + itemHeight > elementHeight ) {
				this.activeMenu.scrollTop( scroll + offset - elementHeight + itemHeight );
			}
		}
	},

	blur: function( event, fromFocus ) {
		if ( !fromFocus ) {
			clearTimeout( this.timer );
		}

		if ( !this.active ) {
			return;
		}

		this.active.children( "a" ).removeClass( "ui-state-focus" );
		this.active = null;

		this._trigger( "blur", event, { item: this.active } );
	},

	_startOpening: function( submenu ) {
		clearTimeout( this.timer );

		// Don't open if already open fixes a Firefox bug that caused a .5 pixel
		// shift in the submenu position when mousing over the carat icon
		if ( submenu.attr( "aria-hidden" ) !== "true" ) {
			return;
		}

		this.timer = this._delay(function() {
			this._close();
			this._open( submenu );
		}, this.delay );
	},

	_open: function( submenu ) {
		var position = $.extend({
			of: this.active
		}, this.options.position );

		clearTimeout( this.timer );
		this.element.find( ".ui-menu" ).not( submenu.parents( ".ui-menu" ) )
			.hide()
			.attr( "aria-hidden", "true" );

		submenu
			.show()
			.removeAttr( "aria-hidden" )
			.attr( "aria-expanded", "true" )
			.position( position );
	},

	collapseAll: function( event, all ) {
		clearTimeout( this.timer );
		this.timer = this._delay(function() {
			// If we were passed an event, look for the submenu that contains the event
			var currentMenu = all ? this.element :
				$( event && event.target ).closest( this.element.find( ".ui-menu" ) );

			// If we found no valid submenu ancestor, use the main menu to close all sub menus anyway
			if ( !currentMenu.length ) {
				currentMenu = this.element;
			}

			this._close( currentMenu );

			this.blur( event );
			this.activeMenu = currentMenu;
		}, this.delay );
	},

	// With no arguments, closes the currently active menu - if nothing is active
	// it closes all menus.  If passed an argument, it will search for menus BELOW
	_close: function( startMenu ) {
		if ( !startMenu ) {
			startMenu = this.active ? this.active.parent() : this.element;
		}

		startMenu
			.find( ".ui-menu" )
				.hide()
				.attr( "aria-hidden", "true" )
				.attr( "aria-expanded", "false" )
			.end()
			.find( "a.ui-state-active" )
				.removeClass( "ui-state-active" );
	},

	collapse: function( event ) {
		var newItem = this.active &&
			this.active.parent().closest( ".ui-menu-item", this.element );
		if ( newItem && newItem.length ) {
			this._close();
			this.focus( event, newItem );
		}
	},

	expand: function( event ) {
		var newItem = this.active &&
			this.active
				.children( ".ui-menu " )
				.children( ".ui-menu-item" )
				.first();

		if ( newItem && newItem.length ) {
			this._open( newItem.parent() );

			// Delay so Firefox will not hide activedescendant change in expanding submenu from AT
			this._delay(function() {
				this.focus( event, newItem );
			});
		}
	},

	next: function( event ) {
		this._move( "next", "first", event );
	},

	previous: function( event ) {
		this._move( "prev", "last", event );
	},

	isFirstItem: function() {
		return this.active && !this.active.prevAll( ".ui-menu-item" ).length;
	},

	isLastItem: function() {
		return this.active && !this.active.nextAll( ".ui-menu-item" ).length;
	},

	_move: function( direction, filter, event ) {
		var next;
		if ( this.active ) {
			if ( direction === "first" || direction === "last" ) {
				next = this.active
					[ direction === "first" ? "prevAll" : "nextAll" ]( ".ui-menu-item" )
					.eq( -1 );
			} else {
				next = this.active
					[ direction + "All" ]( ".ui-menu-item" )
					.eq( 0 );
			}
		}
		if ( !next || !next.length || !this.active ) {
			next = this.activeMenu.children( ".ui-menu-item" )[ filter ]();
		}

		this.focus( event, next );
	},

	nextPage: function( event ) {
		var item, base, height;

		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isLastItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.nextAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base - height < 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" )
				[ !this.active ? "first" : "last" ]() );
		}
	},

	previousPage: function( event ) {
		var item, base, height;
		if ( !this.active ) {
			this.next( event );
			return;
		}
		if ( this.isFirstItem() ) {
			return;
		}
		if ( this._hasScroll() ) {
			base = this.active.offset().top;
			height = this.element.height();
			this.active.prevAll( ".ui-menu-item" ).each(function() {
				item = $( this );
				return item.offset().top - base + height > 0;
			});

			this.focus( event, item );
		} else {
			this.focus( event, this.activeMenu.children( ".ui-menu-item" ).first() );
		}
	},

	_hasScroll: function() {
		return this.element.outerHeight() < this.element.prop( "scrollHeight" );
	},

	select: function( event ) {
		// TODO: It should never be possible to not have an active item at this
		// point, but the tests don't trigger mouseenter before click.
		this.active = this.active || $( event.target ).closest( ".ui-menu-item" );
		var ui = { item: this.active };
		if ( !this.active.has( ".ui-menu" ).length ) {
			this.collapseAll( event, true );
		}
		this._trigger( "select", event, ui );
	}
});

}( jQuery ));
 /*
 * iosSlider - http://iosscripts.com/iosslider/
 * 
 * A jQuery Horizontal Slider for iPhone/iPad Safari 
 * This plugin turns any wide element into a touch enabled horizontal slider.
 * 
 * Copyright (c) 2012 Marc Whitbread
 * 
 * Version: v1.1.56 (01/20/2013)
 * Minimum requirements: jQuery v1.4+
 *
 * Advanced requirements:
 * 1) jQuery bind() click event override on slide requires jQuery v1.6+
 *
 * Terms of use:
 *
 * 1) iosSlider is licensed under the Creative Commons – Attribution-NonCommercial 3.0 License.
 * 2) You may use iosSlider free for personal or non-profit purposes, without restriction.
 *	  Attribution is not required but always appreciated. For commercial projects, you
 *	  must purchase a license. You may download and play with the script before deciding to
 *	  fully implement it in your project. Making sure you are satisfied, and knowing iosSlider
 *	  is the right script for your project is paramount.
 * 3) You are not permitted to make the resources found on iosscripts.com available for
 *    distribution elsewhere "as is" without prior consent. If you would like to feature
 *    iosSlider on your site, please do not link directly to the resource zip files. Please
 *    link to the appropriate page on iosscripts.com where users can find the download.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 */

;(function($) {
	
	/* global variables */
	var scrollbarNumber = 0;
	var xScrollDistance = 0;
	var yScrollDistance = 0;
	var scrollIntervalTime = 10;
	var scrollbarDistance = 0;
	var isTouch = 'ontouchstart' in window;
	var supportsOrientationChange = 'onorientationchange' in window;
	var isWebkit = false;
	var has3DTransform = false;
	var isIe7 = false;
	var isIe8 = false;
	var isIe9 = false;
	var isIe = false;
	var isGecko = false;
	var grabOutCursor = 'pointer';
	var grabInCursor = 'pointer';
	var onChangeEventLastFired = new Array();
	var autoSlideTimeouts = new Array();
	var iosSliders = new Array();
	var iosSliderSettings = new Array();
	var isEventCleared = new Array();
	var slideTimeouts = new Array();
	var activeChildOffsets = new Array();
	var activeChildInfOffsets = new Array();
	var infiniteSliderOffset = new Array();
	var sliderMin = new Array();
	var sliderMax = new Array();
	var sliderAbsMax = new Array();
	var touchLocks = new Array();
	
	/* private functions */
	var helpers = {
    
        showScrollbar: function(settings, scrollbarClass) {
			
			if(settings.scrollbarHide) {
				$('.' + scrollbarClass).css({
					opacity: settings.scrollbarOpacity,
					filter: 'alpha(opacity:' + (settings.scrollbarOpacity * 100) + ')'
				});
			}
			
		},
		
		hideScrollbar: function(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber) {
			
			if(settings.scrollbar && settings.scrollbarHide) {
					
				for(var i = j; i < j+25; i++) {
					
					scrollTimeouts[scrollTimeouts.length] = helpers.hideScrollbarIntervalTimer(scrollIntervalTime * i, distanceOffsetArray[j], ((j + 24) - i) / 24, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings);
					
				}
			
			}
			
		},
		
		hideScrollbarInterval: function(newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings) {
	
			scrollbarDistance = (newOffset * -1) / (sliderMax[sliderNumber]) * (stageWidth - scrollMargin - scrollBorder - scrollbarWidth);
			
			helpers.setSliderOffset('.' + scrollbarClass, scrollbarDistance);
			
			$('.' + scrollbarClass).css({
				opacity: settings.scrollbarOpacity * opacity,
				filter: 'alpha(opacity:' + (settings.scrollbarOpacity * opacity * 100) + ')'
			});
			
		},
		
		slowScrollHorizontalInterval: function(node, slideNodes, newOffset, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, activeChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, sliderNumber, centeredSlideOffset, endOffset, settings) {

			if(settings.infiniteSlider) {
				
				if(newOffset <= (sliderMax[sliderNumber] * -1)) {

					var scrollerWidth = $(node).width();

					if(newOffset <= (sliderAbsMax[sliderNumber] * -1)) {
						
						var sum = originalOffsets[0] * -1;
						$(slideNodes).each(function(i) {
							
							helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
							if(i < childrenOffsets.length) {
								childrenOffsets[i] = sum * -1;
							}
							sum = sum + $(this).outerWidth(true);
							
						});
						
						newOffset = newOffset + childrenOffsets[0] * -1;
						sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
						infiniteSliderOffset[sliderNumber] = 0;
						
					} else {
						
						var lowSlideNumber = 0;
						var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
						$(slideNodes).each(function(i) {
							
							if(helpers.getSliderOffset(this, 'x') < lowSlideOffset) {
								lowSlideOffset = helpers.getSliderOffset(this, 'x');
								lowSlideNumber = i;
							}
							
						});
						
						var tempOffset = sliderMin[sliderNumber] + scrollerWidth;
						helpers.setSliderOffset($(slideNodes)[lowSlideNumber], tempOffset);
						
						sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

						childrenOffsets.splice(0, 1);
						childrenOffsets.splice(childrenOffsets.length, 0, tempOffset * -1 + centeredSlideOffset);

						infiniteSliderOffset[sliderNumber]++;
						
					}
					
				}
				
				if((newOffset >= (sliderMin[sliderNumber] * -1)) || (newOffset >= 0)) {
					
					var scrollerWidth = $(node).width();
					
					if(newOffset >= 0) {

						var sum = originalOffsets[0] * -1;
						$(slideNodes).each(function(i) {
							
							helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
							if(i < childrenOffsets.length) {
								childrenOffsets[i] = sum * -1;
							}
							sum = sum + $(this).outerWidth(true);
							
						});
						
						newOffset = newOffset - childrenOffsets[0] * -1;
						sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
						infiniteSliderOffset[sliderNumber] = numberOfSlides;
						
						while(((childrenOffsets[0] * -1 - scrollerWidth + centeredSlideOffset) > 0)) {

							var highSlideNumber = 0;
							var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'x') > highSlideOffset) {
									highSlideOffset = helpers.getSliderOffset(this, 'x');
									highSlideNumber = i;
								}
								
							});

							var tempOffset = sliderMin[sliderNumber] - $(slideNodes[highSlideNumber]).outerWidth(true);
							helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset);
							
							childrenOffsets.splice(0, 0, tempOffset * -1 + centeredSlideOffset);
							childrenOffsets.splice(childrenOffsets.length-1, 1);

							sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

							infiniteSliderOffset[sliderNumber]--;
							activeChildOffsets[sliderNumber]++;
							
						}

					} 
					
					if(newOffset < 0) {
					
						var highSlideNumber = 0;
						var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
						$(slideNodes).each(function(i) {
							
							if(helpers.getSliderOffset(this, 'x') > highSlideOffset) {
								highSlideOffset = helpers.getSliderOffset(this, 'x');
								highSlideNumber = i;
							}
							
						});						
					
						var tempOffset = sliderMin[sliderNumber] - $(slideNodes[highSlideNumber]).outerWidth(true);
						helpers.setSliderOffset($(slideNodes)[highSlideNumber], tempOffset);
						
						childrenOffsets.splice(0, 0, tempOffset * -1 + centeredSlideOffset);
						childrenOffsets.splice(childrenOffsets.length-1, 1);

						sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
						sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

						infiniteSliderOffset[sliderNumber]--;
						
					}
				
				}
				
			}

			var slideChanged = false;
			var newChildOffset = helpers.calcActiveOffset(settings, newOffset, childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, activeChildOffset, sliderNumber);
			var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			if(settings.infiniteSlider) {
								
				if(tempOffset != activeChildInfOffsets[sliderNumber]) {
					slideChanged = true;
				}
					
			} else {
			
				if(newChildOffset != activeChildOffsets[sliderNumber]) {
					slideChanged = true;
				}
			
			}
			
			if(slideChanged) {
				
				var args = new helpers.args(settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, endOffset, true);
				$(node).parent().data('args', args);
				
				if(settings.onSlideChange != '') {
				
					settings.onSlideChange(args);
				
				}
			
			}
			
			activeChildOffsets[sliderNumber] = newChildOffset;
			activeChildInfOffsets[sliderNumber] = tempOffset;
			
			newOffset = Math.floor(newOffset);
			
			helpers.setSliderOffset(node, newOffset);

			if(settings.scrollbar) {
				
				scrollbarDistance = Math.floor((newOffset * -1 - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth));
				var width = scrollbarWidth - scrollBorder;
				
				if(newOffset >= (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) {

					width = scrollbarWidth - scrollBorder - (scrollbarDistance * -1);
					
					helpers.setSliderOffset($('.' + scrollbarClass), 0);
					
					$('.' + scrollbarClass).css({
						width: width + 'px'
					});
				
				} else if(newOffset <= ((sliderMax[sliderNumber] * -1) + 1)) {
					
					width = scrollbarStageWidth - scrollMargin - scrollBorder - scrollbarDistance;
					
					helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
					
					$('.' + scrollbarClass).css({
						width: width + 'px'
					});
					
				} else {
					
					helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
					
					$('.' + scrollbarClass).css({
						width: width + 'px'
					});
				
				}
				
			}
			
		},
		
		slowScrollHorizontal: function(node, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings) {
			
			var distanceOffsetArray = new Array();
			var xScrollDistanceArray = new Array();
			var nodeOffset = helpers.getSliderOffset(node, 'x');
			var snapDirection = 0;
			var maxSlideVelocity = 25 / 1024 * stageWidth;
			var changeSlideFired = false;
			frictionCoefficient = settings.frictionCoefficient;
			elasticFrictionCoefficient = settings.elasticFrictionCoefficient;
			snapFrictionCoefficient = settings.snapFrictionCoefficient;
				
			if((xScrollDistance > 5) && settings.snapToChildren && !snapOverride) {
				snapDirection = 1;
			} else if((xScrollDistance < -5) && settings.snapToChildren && !snapOverride) {
				snapDirection = -1;
			}
			
			if(xScrollDistance < (maxSlideVelocity * -1)) {
				xScrollDistance = maxSlideVelocity * -1;
			} else if(xScrollDistance > maxSlideVelocity) {
				xScrollDistance = maxSlideVelocity;
			}
			
			if(!($(node)[0] === $(currentEventNode)[0])) {
				snapDirection = snapDirection * -1;
				xScrollDistance = xScrollDistance * -2;
			}
			
			var tempInfiniteSliderOffset = infiniteSliderOffset[sliderNumber];
			
			if(settings.infiniteSlider) {
			
				var tempSliderMin = sliderMin[sliderNumber];
				var tempSliderMax = sliderMax[sliderNumber];
			
			}
			
			var tempChildrenOffsets = new Array();
			var tempSlideNodeOffsets = new Array();

			for(var i = 0; i < childrenOffsets.length; i++) {
				
				tempChildrenOffsets[i] = childrenOffsets[i];
				
				if(i < slideNodes.length) {
					tempSlideNodeOffsets[i] = helpers.getSliderOffset($(slideNodes[i]), 'x');
				}
				
			}
			
			while((xScrollDistance > 1) || (xScrollDistance < -1)) {
				
				xScrollDistance = xScrollDistance * frictionCoefficient;
				nodeOffset = nodeOffset + xScrollDistance;

				if(((nodeOffset > (sliderMin[sliderNumber] * -1)) || (nodeOffset < (sliderMax[sliderNumber] * -1))) && !settings.infiniteSlider) {
					xScrollDistance = xScrollDistance * elasticFrictionCoefficient;
					nodeOffset = nodeOffset + xScrollDistance;
				}
				
				if(settings.infiniteSlider) {
					
					if(nodeOffset <= (tempSliderMax * -1)) {
						
						var scrollerWidth = $(node).width();
							
						var lowSlideNumber = 0;
						var lowSlideOffset = tempSlideNodeOffsets[0];
						for(var i = 0; i < tempSlideNodeOffsets.length; i++) {
							
							if(tempSlideNodeOffsets[i] < lowSlideOffset) {
								lowSlideOffset = tempSlideNodeOffsets[i];
								lowSlideNumber = i;
							}
							
						}
						
						var newOffset = tempSliderMin + scrollerWidth;
						tempSlideNodeOffsets[lowSlideNumber] = newOffset;
						
						tempSliderMin = tempChildrenOffsets[1] * -1 + centeredSlideOffset;
						tempSliderMax = tempSliderMin + scrollerWidth - stageWidth;

						tempChildrenOffsets.splice(0, 1);
						tempChildrenOffsets.splice(tempChildrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

						tempInfiniteSliderOffset++;
						
					}
					
					if(nodeOffset >= (tempSliderMin * -1)) {
						
						var scrollerWidth = $(node).width();
						
						var highSlideNumber = 0;
						var highSlideOffset = tempSlideNodeOffsets[0];
						for(var i = 0; i < tempSlideNodeOffsets.length; i++) {
							
							if(tempSlideNodeOffsets[i] > highSlideOffset) {
								highSlideOffset = tempSlideNodeOffsets[i];
								highSlideNumber = i;
							}
							
						}

						var newOffset = tempSliderMin - $(slideNodes[highSlideNumber]).outerWidth(true);
						tempSlideNodeOffsets[highSlideNumber] = newOffset;
						
						tempChildrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
						tempChildrenOffsets.splice(tempChildrenOffsets.length-1, 1);

						tempSliderMin = tempChildrenOffsets[0] * -1 + centeredSlideOffset;
						tempSliderMax = tempSliderMin + scrollerWidth - stageWidth;

						tempInfiniteSliderOffset--;
					
					}
						
				}
				
				distanceOffsetArray[distanceOffsetArray.length] = nodeOffset;
				xScrollDistanceArray[xScrollDistanceArray.length] = xScrollDistance;

			}

			var slideChanged = false;
			var newChildOffset = helpers.calcActiveOffset(settings, nodeOffset, tempChildrenOffsets, stageWidth, tempInfiniteSliderOffset, numberOfSlides, activeChildOffsets[sliderNumber], sliderNumber);
			var tempOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides)%numberOfSlides;

			if(settings.snapToChildren) {
			
				if(settings.infiniteSlider) {
				
					if(tempOffset != activeChildInfOffsets[sliderNumber]) {
						slideChanged = true;
					}
						
				} else {
				
					if(newChildOffset != activeChildOffsets[sliderNumber]) {
						slideChanged = true;
					}
				
				}

				if((snapDirection < 0) && !slideChanged) {
				
					newChildOffset++;
					
					if((newChildOffset >= childrenOffsets.length) && !settings.infinteSlider) newChildOffset = childrenOffsets.length - 1;
					
				} else if((snapDirection > 0) && !slideChanged) {
				
					newChildOffset--;
					
					if((newChildOffset < 0) && !settings.infinteSlider) newChildOffset = 0;
					
				}
			
			}

			if(settings.snapToChildren || (((nodeOffset > (sliderMin[sliderNumber] * -1)) || (nodeOffset < (sliderMax[sliderNumber] * -1))) && !settings.infiniteSlider)) {
				
				nodeOffset = helpers.getSliderOffset(node, 'x');
				distanceOffsetArray.splice(0, distanceOffsetArray.length);
				
				while((nodeOffset < (tempChildrenOffsets[newChildOffset] - 0.5)) || (nodeOffset > (tempChildrenOffsets[newChildOffset] + 0.5))) {
					
					nodeOffset = ((nodeOffset - (tempChildrenOffsets[newChildOffset])) * snapFrictionCoefficient) + (tempChildrenOffsets[newChildOffset]);
					distanceOffsetArray[distanceOffsetArray.length] = nodeOffset;
					
				}

				distanceOffsetArray[distanceOffsetArray.length] = tempChildrenOffsets[newChildOffset];
	
			}

			var jStart = 1;
			if((distanceOffsetArray.length%2) != 0) {
				jStart = 0;
			}
			
			var lastTimeoutRegistered = 0;
			var count = 0;
			
			for(var j = 0; j < scrollTimeouts.length; j++) {
				clearTimeout(scrollTimeouts[j]);
			}
			
			var endOffset = (newChildOffset + tempInfiniteSliderOffset + numberOfSlides)%numberOfSlides;

			var lastCheckOffset = 0;
			for(var j = jStart; j < distanceOffsetArray.length; j = j + 2) {
				
				if((j == jStart) || (Math.abs(distanceOffsetArray[j] - lastCheckOffset) > 1) || (j >= (distanceOffsetArray.length - 2))) {
				
					lastCheckOffset	= distanceOffsetArray[j];
					
					scrollTimeouts[scrollTimeouts.length] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * j, node, slideNodes, distanceOffsetArray[j], scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, newChildOffset, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, sliderNumber, centeredSlideOffset, endOffset, settings);
				
				}
				
			}
			
			var slideChanged = false;
			var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			if(settings.infiniteSlider) {
				
				if(tempOffset != activeChildInfOffsets[sliderNumber]) {
					slideChanged = true;
				}
					
			} else {
			
				if(newChildOffset != activeChildOffsets[sliderNumber]) {
					slideChanged = true;
				}
			
			}
				
			if(settings.onSlideComplete != '') {

				scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (j + 1), settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, sliderNumber);
				
			}
			
			slideTimeouts[sliderNumber] = scrollTimeouts;
			
			helpers.hideScrollbar(settings, scrollTimeouts, j, distanceOffsetArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber);
				
		},
		
		onSlideComplete: function(settings, node, slideNode, newChildOffset, sliderNumber) {
			
			var isChanged = (onChangeEventLastFired[sliderNumber] != newChildOffset) ? true : false;
			var args = new helpers.args(settings, $(node), slideNode, newChildOffset, newChildOffset, isChanged);
			$(node).parent().data('args', args);
				
			if(settings.onSlideComplete != '') {
				
				settings.onSlideComplete(args);
			
			}
			
			onChangeEventLastFired[sliderNumber] = newChildOffset;
		
		},
		
		getSliderOffset: function(node, xy) {
			
			var sliderOffset = 0;
			if(xy == 'x') {
				xy = 4;
			} else {
				xy = 5;
			}
			
			if(has3DTransform && !isIe7 && !isIe8) {
				
				var transforms = new Array('-webkit-transform', '-moz-transform', 'transform');
				
				for(var i = 0; i < transforms.length; i++) {
					
					if($(node).css(transforms[i]) != undefined) {
						
						if($(node).css(transforms[i]).length > 0) {
						
							var transformArray = $(node).css(transforms[i]).split(',');
							
							break;
							
						}
					
					}
				
				}
				
				sliderOffset = parseInt(transformArray[xy], 10);
					
			} else {
			
				sliderOffset = parseInt($(node).css('left'), 10);
			
			}
			
			return sliderOffset;
		
		},
		
		setSliderOffset: function(node, sliderOffset) {
			
			if(has3DTransform && !isIe7 && !isIe8) {
				
				$(node).css({
					'webkitTransform': 'matrix(1,0,0,1,' + sliderOffset + ',0)',
					'MozTransform': 'matrix(1,0,0,1,' + sliderOffset + ',0)',
					'transform': 'matrix(1,0,0,1,' + sliderOffset + ',0)'
				});
			
			} else {

				$(node).css({
					left: sliderOffset + 'px'
				});
			
			}
						
		},
		
		setBrowserInfo: function() {
			
			if(navigator.userAgent.match('WebKit') != null) {
				isWebkit = true;
				grabOutCursor = '-webkit-grab';
				grabInCursor = '-webkit-grabbing';
			} else if(navigator.userAgent.match('Gecko') != null) {
				isGecko = true;
				grabOutCursor = 'move';
				grabInCursor = '-moz-grabbing';
			} else if(navigator.userAgent.match('MSIE 7') != null) {
				isIe7 = true;
				isIe = true;
			} else if(navigator.userAgent.match('MSIE 8') != null) {
				isIe8 = true;
				isIe = true;
			} else if(navigator.userAgent.match('MSIE 9') != null) {
				isIe9 = true;
				isIe = true;
			}
			
		},
		
		has3DTransform: function() {
			
			var has3D = false;
			
			var testElement = $('<div />').css({
				'webkitTransform': 'matrix(1,1,1,1,1,1)',
				'MozTransform': 'matrix(1,1,1,1,1,1)',
				'transform': 'matrix(1,1,1,1,1,1)'
			});
			
			if(testElement.attr('style') == '') {
				has3D = false;
			} else if(testElement.attr('style') != undefined) {
				has3D = true;
			}
			
			return has3D;
			
		},
		
		getSlideNumber: function(slide, sliderNumber, numberOfSlides) {
			
			return (slide - infiniteSliderOffset[sliderNumber] + numberOfSlides) % numberOfSlides;
		
		}, 

        calcActiveOffset: function(settings, offset, childrenOffsets, stageWidth, infiniteSliderOffset, numberOfSlides, activeChildOffset, sliderNumber) {
								
			var isFirst = false;
			var arrayOfOffsets = new Array();
			var newChildOffset;

			for(var i = 0; i < childrenOffsets.length; i++) {
				
				if((childrenOffsets[i] <= offset) && (childrenOffsets[i] > (offset - stageWidth))) {
				
					if(!isFirst && (childrenOffsets[i] != offset)) {
						
						arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i-1];
						
					}
					
					arrayOfOffsets[arrayOfOffsets.length] = childrenOffsets[i];
					
					isFirst = true;
						
				}
			
			}
			
			if(arrayOfOffsets.length == 0) {
				arrayOfOffsets[0] = childrenOffsets[childrenOffsets.length - 1];
			}
			
			var distance = stageWidth;
			var closestChildOffset = 0;
			
			for(var i = 0; i < arrayOfOffsets.length; i++) {
				
				var newDistance = Math.abs(offset - arrayOfOffsets[i]);
				
				if(newDistance < distance) {
					closestChildOffset = arrayOfOffsets[i];
					distance = newDistance;
				}
				
			}
			
			for(var i = 0; i < childrenOffsets.length; i++) {
				
				if(closestChildOffset == childrenOffsets[i]) {
					
					newChildOffset = i;
					
				}
				
			}
			
			return newChildOffset;
		
		},
		
		changeSlide: function(slide, node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {

			helpers.autoSlidePause(sliderNumber);
			
			for(var j = 0; j < scrollTimeouts.length; j++) {
				clearTimeout(scrollTimeouts[j]);
			}
			
			var steps = Math.ceil(settings.autoSlideTransTimer / 10) + 1;
			var startOffset = helpers.getSliderOffset(node, 'x');
			var endOffset = childrenOffsets[slide];
			var offsetDiff = endOffset - startOffset;
			
			if(settings.infiniteSlider) {
				
				slide = (slide - infiniteSliderOffset[sliderNumber] + numberOfSlides * 2)%numberOfSlides;
				
				var appendArray = false;
				if((slide == 0) && (numberOfSlides == 2)) {
					
					slide = numberOfSlides;
					childrenOffsets[slide] = childrenOffsets[slide-1] - $(slideNodes).eq(0).outerWidth(true);
					appendArray = true;
					
				}
				
				endOffset = childrenOffsets[slide];
				offsetDiff = endOffset - startOffset;
				
				var offsets = new Array(childrenOffsets[slide] - $(node).width(), childrenOffsets[slide] + $(node).width());
				
				if(appendArray) {
					childrenOffsets.splice(childrenOffsets.length-1, 1);
				}
				
				for(var i = 0; i < offsets.length; i++) {
					
					if(Math.abs(offsets[i] - startOffset) < Math.abs(offsetDiff)) {
						offsetDiff = (offsets[i] - startOffset);
					}
				
				}
				
			}
			
			var stepArray = new Array();
			var t;
			var nextStep;

			helpers.showScrollbar(settings, scrollbarClass);

			for(var i = 0; i <= steps; i++) {

				t = i;
				t /= steps;
				t--;
				nextStep = startOffset + offsetDiff*(Math.pow(t,5) + 1);
				
				stepArray[stepArray.length] = nextStep;
				
			}
			
			var lastCheckOffset = 0;
			for(var i = 0; i < stepArray.length; i++) {
				
				if((i == 0) || (Math.abs(stepArray[i] - lastCheckOffset) > 1) || (i >= (stepArray.length - 2))) {

					lastCheckOffset	= stepArray[i];
					
					scrollTimeouts[i] = helpers.slowScrollHorizontalIntervalTimer(scrollIntervalTime * (i + 1), node, slideNodes, stepArray[i], scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, sliderNumber, centeredSlideOffset, slide, settings);
						
				}
				
				if((i == 0) && (settings.onSlideStart != '')) {
					var tempOffset = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;		
				
					settings.onSlideStart(new helpers.args(settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, slide, false));
				}
					
			}

			var slideChanged = false;
			var tempOffset = (slide + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
			
			if(settings.infiniteSlider) {
				
				if(tempOffset != activeChildInfOffsets[sliderNumber]) {
					slideChanged = true;
				}
					
			} else {
			
				if(slide != activeChildOffsets[sliderNumber]) {
					slideChanged = true;
				}
			
			}
				
			if(slideChanged && (settings.onSlideComplete != '')) {

				scrollTimeouts[scrollTimeouts.length] = helpers.onSlideCompleteTimer(scrollIntervalTime * (i + 1), settings, node, $(node).children(':eq(' + tempOffset + ')'), tempOffset, sliderNumber);
			}
			
			slideTimeouts[sliderNumber] = scrollTimeouts;
			
			helpers.hideScrollbar(settings, scrollTimeouts, i, stepArray, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber);
			
			helpers.autoSlide(node, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
			
		},
		
		autoSlide: function(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings) {
			
			if(!settings.autoSlide) return false;
			
			helpers.autoSlidePause(sliderNumber);

			autoSlideTimeouts[sliderNumber] = setTimeout(function() {

				if(!settings.infiniteSlider && (activeChildOffsets[sliderNumber] > childrenOffsets.length-1)) {
					activeChildOffsets[sliderNumber] = activeChildOffsets[sliderNumber] - numberOfSlides;
				}
				
				var nextSlide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides + 1)%numberOfSlides;

				helpers.changeSlide(nextSlide, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
				
				helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
				
			}, settings.autoSlideTimer + settings.autoSlideTransTimer);
			
		},
		
		autoSlidePause: function(sliderNumber) {
			
			clearTimeout(autoSlideTimeouts[sliderNumber]);

		},
		
		isUnselectable: function(node, settings) {

			if(settings.unselectableSelector != '') {
				if($(node).closest(settings.unselectableSelector).size() == 1) return true;
			}
			
			return false;
			
		},
		
		/* timers */
		slowScrollHorizontalIntervalTimer: function(scrollIntervalTime, node, slideNodes, step, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, sliderNumber, centeredSlideOffset, endOffset, settings) {
		
			var scrollTimeout = setTimeout(function() {
				helpers.slowScrollHorizontalInterval(node, slideNodes, step, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, slide, originalOffsets, childrenOffsets, infiniteSliderWidth, numberOfSlides, sliderNumber, centeredSlideOffset, endOffset, settings);
			}, scrollIntervalTime);
			
			return scrollTimeout;
		
		},
		
		onSlideCompleteTimer: function(scrollIntervalTime, settings, node, slideNode, slide, scrollbarNumber) {
			
			var scrollTimeout = setTimeout(function() {
				helpers.onSlideComplete(settings, node, slideNode, slide, scrollbarNumber);
			}, scrollIntervalTime);
			
			return scrollTimeout;
		
		},
		
		hideScrollbarIntervalTimer: function(scrollIntervalTime, newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings) {

			var scrollTimeout = setTimeout(function() {
				helpers.hideScrollbarInterval(newOffset, opacity, scrollbarClass, scrollbarWidth, stageWidth, scrollMargin, scrollBorder, sliderNumber, settings);
			}, scrollIntervalTime);
		
			return scrollTimeout;
		
		},
						
		args: function(settings, node, activeSlideNode, newChildOffset, targetSlideOffset, isChanged) {

			this.settings = settings;
			this.data = $(node).parent().data('iosslider');
			this.slideChanged = isChanged;
			this.sliderObject = node;
			this.sliderContainerObject = $(node).parent();
			this.currentSlideObject = activeSlideNode;
			this.currentSlideNumber = newChildOffset + 1;
			this.targetSlideObject = $(node).children(':eq(' + targetSlideOffset + ')');
			this.targetSlideNumber = targetSlideOffset + 1;
			this.currentSliderOffset = helpers.getSliderOffset(node, 'x') * -1;
			
			try {
				if($(node).parent().data('args') == undefined) {
					this.prevSlideNumber = settings.startAtSlide;
				} else if($(node).parent().data('args').prevSlideNumber == this.currentSlideNumber) {
					this.prevSlideNumber = $(node).parent().data('args').currentSlideNumber;					
				} else {
					this.prevSlideNumber = $(node).parent().data('args').prevSlideNumber;
				}
				
				this.prevSlideObject = $(node).children(':eq(' + this.prevSlideNumber + ')');
			} catch(e) {}

		},
		
		preventDrag: function(event) {
			event.preventDefault();
		},
		
		preventClick: function(event) {
			event.stopImmediatePropagation();
			return false;
		},
		
		enableClick: function() {
			return true;
		}
        
    }
    
    helpers.setBrowserInfo();
    
    var methods = {
		
		init: function(options, node) {
			
			has3DTransform = helpers.has3DTransform();
			
			var settings = $.extend(true, {
				'elasticPullResistance': 0.6, 		
				'frictionCoefficient': 0.92,
				'elasticFrictionCoefficient': 0.6,
				'snapFrictionCoefficient': 0.92,
				'snapToChildren': false,
				'snapSlideCenter': false,
				'startAtSlide': 1,
				'scrollbar': false,
				'scrollbarDrag': false,
				'scrollbarHide': true,
				'scrollbarLocation': 'top',
				'scrollbarContainer': '',
				'scrollbarOpacity': 0.4,
				'scrollbarHeight': '4px',
				'scrollbarBorder': '0',
				'scrollbarMargin': '5px',
				'scrollbarBackground': '#000',
				'scrollbarBorderRadius': '100px',
				'scrollbarShadow': '0 0 0 #000',
				'scrollbarElasticPullResistance': 0.9,
				'desktopClickDrag': false,
				'keyboardControls': false,
				'tabToAdvance': false,
				'responsiveSlideContainer': true,
				'responsiveSlides': true,
				'navSlideSelector': '',
				'navPrevSelector': '',
				'navNextSelector': '',
				'autoSlideToggleSelector': '',
				'autoSlide': false,
				'autoSlideTimer': 5000,
				'autoSlideTransTimer': 750,
				'infiniteSlider': false,
				'stageCSS': {
					position: 'relative',
					top: '0',
					left: '0',
					overflow: 'hidden',
					zIndex: 1
				},
				'unselectableSelector': '',
				'onSliderLoaded': '',
				'onSliderUpdate': '',
				'onSliderResize': '',
				'onSlideStart': '',
				'onSlideChange': '',
				'onSlideComplete': ''
			}, options);
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function(i) {
				
				scrollbarNumber++;
				var sliderNumber = scrollbarNumber;
				var scrollTimeouts = new Array();
				iosSliderSettings[sliderNumber] = settings;
				sliderMin[sliderNumber] = 0;
				sliderMax[sliderNumber] = 0;
				var minTouchpoints = 0;
				var xCurrentScrollRate = new Array(0, 0);
				var yCurrentScrollRate = new Array(0, 0);
				var scrollbarBlockClass = 'scrollbarBlock' + scrollbarNumber;
				var scrollbarClass = 'scrollbar' + scrollbarNumber;
				var scrollbarNode;
				var scrollbarBlockNode;
				var scrollbarStageWidth;
				var scrollbarWidth;
				var containerWidth;
				var containerHeight;
				var centeredSlideOffset = 0;
				var stageNode = $(this);
				var stageWidth;
				var stageHeight;
				var slideWidth;
				var scrollMargin;
				var scrollBorder;
				var lastTouch;
				var isFirstInit = true;
				var newChildOffset = -1;
				var webkitTransformArray = new Array();
				var childrenOffsets;
				var originalOffsets = new Array();
				var scrollbarStartOpacity = 0;
				var xScrollStartPosition = 0;
				var yScrollStartPosition = 0;
				var currentTouches = 0;
				var scrollerNode = $(this).children(':first-child');
				var slideNodes;
				var slideNodeWidths;
				var slideNodeOuterWidths;
				var numberOfSlides = $(scrollerNode).children().not('script').size();
				var xScrollStarted = false;
				var lastChildOffset = 0;
				var isMouseDown = false;
				var currentSlider = undefined;
				var sliderStopLocation = 0;
				var infiniteSliderWidth;
				infiniteSliderOffset[sliderNumber] = 0;
				var shortContent = false;
				onChangeEventLastFired[sliderNumber] = -1;
				var isAutoSlideToggleOn = false;
				iosSliders[sliderNumber] = stageNode;
				isEventCleared[sliderNumber] = false;
				var currentEventNode;
				var intermediateChildOffset = 0;
				var tempInfiniteSliderOffset = 0;
				var preventXScroll = false;
				var snapOverride = false;
				var scrollerWidth;
				var clickEvent = isTouch ? 'touchstart.iosSliderEvent' : 'click.iosSliderEvent';
				var anchorEvents;
				var onclickEvents;
				var allScrollerNodeChildren;
				touchLocks[sliderNumber] = false;
				slideTimeouts[sliderNumber] = new Array();
				if(settings.scrollbarDrag) {
					settings.scrollbar = true;
					settings.scrollbarHide = false;
				}
				var $this = $(this);
				var data = $this.data('iosslider');	
				if(data != undefined) return true;
           		
           		$(this).find('img').bind('dragstart.iosSliderEvent', function(event) { event.preventDefault(); });

				if(settings.infiniteSlider) {
					settings.scrollbar = false;
				}
						
				if(settings.scrollbar) {
					
					if(settings.scrollbarContainer != '') {
						$(settings.scrollbarContainer).append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>");
					} else {
						$(scrollerNode).parent().append("<div class = '" + scrollbarBlockClass + "'><div class = '" + scrollbarClass + "'></div></div>");
					}
				
				}
				
				if(!init()) return true;
				
				$(this).find('a').bind('mousedown', helpers.preventDrag);
				$(this).find("[onclick]").bind('click', helpers.preventDrag).each(function() {
					
					$(this).data('onclick', this.onclick);
				
				});
				
				var newChildOffset = helpers.calcActiveOffset(settings, helpers.getSliderOffset($(scrollerNode), 'x'), childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, undefined, sliderNumber);
				var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
				
				var args = new helpers.args(settings, scrollerNode, $(scrollerNode).children(':eq(' + tempOffset + ')'), tempOffset, tempOffset, false);
				$(stageNode).data('args', args);

				if(settings.onSliderLoaded != '') {

					settings.onSliderLoaded(args);
					
				}
				
				onChangeEventLastFired[sliderNumber] = tempOffset;

				function init() {
					
					helpers.autoSlidePause(sliderNumber);
					
					anchorEvents = $(scrollerNode).find('a');
					onclickEvents = $(scrollerNode).find('[onclick]');
					allScrollerNodeChildren = $(scrollerNode).find('*');
					
					$(stageNode).css('width', '');
					$(stageNode).css('height', '');
					$(scrollerNode).css('width', '');
					slideNodes = $(scrollerNode).children().not('script').get();
					slideNodeWidths = new Array();
					slideNodeOuterWidths = new Array();
					
					$(slideNodes).css('width', '');
					
					sliderMax[sliderNumber] = 0;
					childrenOffsets = new Array();
					containerWidth = $(stageNode).parent().width();
					stageWidth = $(stageNode).outerWidth(true);
					
					if(settings.responsiveSlideContainer) {
						stageWidth = ($(stageNode).outerWidth(true) > containerWidth) ? containerWidth : $(stageNode).outerWidth(true);
					}

					$(stageNode).css({
						position: settings.stageCSS.position,
						top: settings.stageCSS.top,
						left: settings.stageCSS.left,
						overflow: settings.stageCSS.overflow,
						zIndex: settings.stageCSS.zIndex,
						'webkitPerspective': 1000,
						'webkitBackfaceVisibility': 'hidden',
						width: stageWidth
					});
					
					$(settings.unselectableSelector).css({
						cursor: 'default'
					});
						
					for(var j = 0; j < slideNodes.length; j++) {
						
						slideNodeWidths[j] = $(slideNodes[j]).width();
						slideNodeOuterWidths[j] = $(slideNodes[j]).outerWidth(true);
						var newWidth = slideNodeOuterWidths[j];
						
						if(settings.responsiveSlides) {

							if(slideNodeOuterWidths[j] > stageWidth) {
								
								newWidth = stageWidth + (slideNodeOuterWidths[j] - slideNodeWidths[j]) * -1;
								
							} else {

								newWidth = slideNodeWidths[j];
								
							}
							
							$(slideNodes[j]).css({
								width: newWidth
							});
					
						}
						
						$(slideNodes[j]).css({
							'webkitBackfaceVisibility': 'hidden',
							position: 'absolute',
							top: 0
						});
						
						childrenOffsets[j] = sliderMax[sliderNumber] * -1;
						
						sliderMax[sliderNumber] = sliderMax[sliderNumber] + newWidth + (slideNodeOuterWidths[j] - slideNodeWidths[j]);
					
					}
					
					if(settings.snapSlideCenter) {
						centeredSlideOffset = (stageWidth - slideNodeOuterWidths[0]) * 0.5;
						
						if(settings.responsiveSlides && (slideNodeOuterWidths[0] > stageWidth)) {
							centeredSlideOffset = 0;
						}
					}
					
					sliderAbsMax[sliderNumber] = sliderMax[sliderNumber] * 2;
					
					for(var j = 0; j < slideNodes.length; j++) {
						
						helpers.setSliderOffset($(slideNodes[j]), childrenOffsets[j] * -1 + sliderMax[sliderNumber] + centeredSlideOffset);
						
						childrenOffsets[j] = childrenOffsets[j] - sliderMax[sliderNumber];
					
					}
					
					if(!settings.infiniteSlider && !settings.snapSlideCenter) {
					
						for(var i = 0; i < childrenOffsets.length; i++) {
							
							if(childrenOffsets[i] <= ((sliderMax[sliderNumber] * 2 - stageWidth) * -1)) {
								break;
							}
							
							lastChildOffset = i;
							
						}
						
						childrenOffsets.splice(lastChildOffset + 1, childrenOffsets.length);
						childrenOffsets[childrenOffsets.length] = (sliderMax[sliderNumber] * 2 - stageWidth) * -1;
					
					}
					
					for(var i = 0; i < childrenOffsets.length; i++) {
						originalOffsets[i] = childrenOffsets[i];
					}
					
					if(isFirstInit) {
						settings.startAtSlide = (iosSliderSettings[sliderNumber].startAtSlide > childrenOffsets.length) ? childrenOffsets.length : iosSliderSettings[sliderNumber].startAtSlide;
						if(settings.infiniteSlider) {
							settings.startAtSlide = (iosSliderSettings[sliderNumber].startAtSlide - 1 + numberOfSlides)%numberOfSlides;
							activeChildOffsets[sliderNumber] = (iosSliderSettings[sliderNumber].startAtSlide);
						} else {
							settings.startAtSlide = ((iosSliderSettings[sliderNumber].startAtSlide - 1) < 0) ? childrenOffsets.length-1 : iosSliderSettings[sliderNumber].startAtSlide;	
							activeChildOffsets[sliderNumber] = (iosSliderSettings[sliderNumber].startAtSlide-1);
						}
						activeChildInfOffsets[sliderNumber] = activeChildOffsets[sliderNumber];
					}
					
					sliderMin[sliderNumber] = sliderMax[sliderNumber] + centeredSlideOffset;
					
					$(scrollerNode).css({
						position: 'relative',
						cursor: grabOutCursor,
						'webkitPerspective': '0',
						'webkitBackfaceVisibility': 'hidden',
						width: sliderMax[sliderNumber] + 'px'
					});
					
					scrollerWidth = sliderMax[sliderNumber];
					sliderMax[sliderNumber] = sliderMax[sliderNumber] * 2 - stageWidth + centeredSlideOffset * 2;
					
					shortContent = (scrollerWidth < stageWidth) ? true : false;

					if(shortContent) {
						
						$(scrollerNode).css({
							cursor: 'default'
						});
						
					}
					
					containerHeight = $(stageNode).parent().outerHeight(true);
					stageHeight = $(stageNode).height();
					
					if(settings.responsiveSlideContainer) {
						stageHeight = (stageHeight > containerHeight) ? containerHeight : stageHeight;
					}
					
					$(stageNode).css({
						height: stageHeight
					});

					helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]);
					
					if(settings.infiniteSlider && !shortContent) {
						
						var currentScrollOffset = helpers.getSliderOffset($(scrollerNode), 'x');
						var count = (infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides * -1;

						while(count < 0) {
								
							var lowSlideNumber = 0;
							var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'x') < lowSlideOffset) {
									lowSlideOffset = helpers.getSliderOffset(this, 'x');
									lowSlideNumber = i;
								}
								
							});
							
							var newOffset = sliderMin[sliderNumber] + scrollerWidth;
							helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);
							
							sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

							childrenOffsets.splice(0, 1);
							childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

							count++;
							
						}
						
						while(((childrenOffsets[0] * -1 - scrollerWidth + centeredSlideOffset) > 0) && settings.snapSlideCenter && isFirstInit) {
							
							var highSlideNumber = 0;
							var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
							$(slideNodes).each(function(i) {
								
								if(helpers.getSliderOffset(this, 'x') > highSlideOffset) {
									highSlideOffset = helpers.getSliderOffset(this, 'x');
									highSlideNumber = i;
								}
								
							});

							var newOffset = sliderMin[sliderNumber] - slideNodeOuterWidths[highSlideNumber];
							helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);
							
							childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
							childrenOffsets.splice(childrenOffsets.length-1, 1);

							sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
							sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

							infiniteSliderOffset[sliderNumber]--;
							activeChildOffsets[sliderNumber]++;
							
						}
					
					}
					
					helpers.setSliderOffset(scrollerNode, childrenOffsets[activeChildOffsets[sliderNumber]]);
					
					if(!isTouch && !settings.desktopClickDrag) {
						
						$(scrollerNode).css({
							cursor: 'default'
						});
						
					}
					
					if(settings.scrollbar) {
						
						$('.' + scrollbarBlockClass).css({ 
							margin: settings.scrollbarMargin,
							overflow: 'hidden',
							display: 'none'
						});
						
						$('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({ 
							border: settings.scrollbarBorder
						});
						
						scrollMargin = parseInt($('.' + scrollbarBlockClass).css('marginLeft')) + parseInt($('.' + scrollbarBlockClass).css('marginRight'));
						scrollBorder = parseInt($('.' + scrollbarBlockClass + ' .' + scrollbarClass).css('borderLeftWidth'), 10) + parseInt($('.' + scrollbarBlockClass + ' .' + scrollbarClass).css('borderRightWidth'), 10);
						scrollbarStageWidth = (settings.scrollbarContainer != '') ? $(settings.scrollbarContainer).width() : stageWidth;
						scrollbarWidth = (scrollbarStageWidth - scrollMargin) / numberOfSlides;
		
						if(!settings.scrollbarHide) {
							scrollbarStartOpacity = settings.scrollbarOpacity;
						}
						
						$('.' + scrollbarBlockClass).css({ 
							position: 'absolute',
							left: 0,
							width: scrollbarStageWidth - scrollMargin + 'px',
							margin: settings.scrollbarMargin
						});
						
						if(settings.scrollbarLocation == 'top') {
							$('.' + scrollbarBlockClass).css('top', '0');
						} else {
							$('.' + scrollbarBlockClass).css('bottom', '0');
						}
						
						$('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({ 
							borderRadius: settings.scrollbarBorderRadius,
							background: settings.scrollbarBackground,
							height: settings.scrollbarHeight,
							width: scrollbarWidth - scrollBorder + 'px',
							minWidth: settings.scrollbarHeight,
							border: settings.scrollbarBorder,
							'webkitPerspective': 1000,
							'webkitBackfaceVisibility': 'hidden',
							'position': 'relative',
							opacity: scrollbarStartOpacity,
							filter: 'alpha(opacity:' + (scrollbarStartOpacity * 100) + ')',
							boxShadow: settings.scrollbarShadow
						});
						
						helpers.setSliderOffset($('.' + scrollbarBlockClass + ' .' + scrollbarClass), Math.floor((childrenOffsets[activeChildOffsets[sliderNumber]] * -1 - sliderMin[sliderNumber] + centeredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth)));
		
						$('.' + scrollbarBlockClass).css({
							display: 'block'
						});
						
						scrollbarNode = $('.' + scrollbarBlockClass + ' .' + scrollbarClass);
						scrollbarBlockNode = $('.' + scrollbarBlockClass);						
						
					}
					
					if(settings.scrollbarDrag && !shortContent) {
						$('.' + scrollbarBlockClass + ' .' + scrollbarClass).css({
							cursor: grabOutCursor
						});
					}
					
					if(settings.infiniteSlider) {
					
						infiniteSliderWidth = (sliderMax[sliderNumber] + stageWidth) / 3;
						
					}
					
					if(settings.navSlideSelector != '') {
								
						$(settings.navSlideSelector).each(function(j) {
						
							$(this).css({
								cursor: 'pointer'
							});
							
							$(this).unbind(clickEvent).bind(clickEvent, function() {

								helpers.changeSlide(j, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
								
							});
						
						});
								
					}	
					
					if(settings.navPrevSelector != '') {
						
						$(settings.navPrevSelector).css({
							cursor: 'pointer'
						});
						
						$(settings.navPrevSelector).unbind(clickEvent).bind(clickEvent, function() {	
						
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
											
							if((slide > 0) || settings.infiniteSlider) {
								helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							}
						});
					
					}
					
					if(settings.navNextSelector != '') {
						
						$(settings.navNextSelector).css({
							cursor: 'pointer'
						});
						
						$(settings.navNextSelector).unbind(clickEvent).bind(clickEvent, function() {
							
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
							
							if((slide < childrenOffsets.length-1) || settings.infiniteSlider) {
								helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							}
						});
					
					}
					
					if(settings.autoSlide && !shortContent) {
						
						if(settings.autoSlideToggleSelector != '') {
						
							$(settings.autoSlideToggleSelector).css({
								cursor: 'pointer'
							});
							
							$(settings.autoSlideToggleSelector).unbind(clickEvent).bind(clickEvent, function() {
								
								if(!isAutoSlideToggleOn) {
								
									helpers.autoSlidePause(sliderNumber);
									isAutoSlideToggleOn = true;
									
									$(settings.autoSlideToggleSelector).addClass('on');
									
								} else {
									
									helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
									
									isAutoSlideToggleOn = false;
									
									$(settings.autoSlideToggleSelector).removeClass('on');
									
								}
							
							});
						
						}
						
						if(!isAutoSlideToggleOn && !shortContent) {
							helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
						}
	
						if(!isTouch) {
							
							$(stageNode).bind('mouseenter.iosSliderEvent', function() {
								helpers.autoSlidePause(sliderNumber);
							});
							
							$(stageNode).bind('mouseleave.iosSliderEvent', function() {
								if(!isAutoSlideToggleOn && !shortContent) {
									helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
								}
							});
						
						} else {
							
							$(stageNode).bind('touchend.iosSliderEvent', function() {
							
								if(!isAutoSlideToggleOn && !shortContent) {
									helpers.autoSlide(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
								}
							
							});
						
						}
					
					}
					
					$(stageNode).data('iosslider', {
						obj: $this,
						settings: settings,
						scrollerNode: scrollerNode,
						slideNodes: slideNodes,
						numberOfSlides: numberOfSlides,
						centeredSlideOffset: centeredSlideOffset,
						sliderNumber: sliderNumber,
						originalOffsets: originalOffsets,
						childrenOffsets: childrenOffsets,
						sliderMax: sliderMax[sliderNumber],
						scrollbarClass: scrollbarClass,
						scrollbarWidth: scrollbarWidth, 
						scrollbarStageWidth: scrollbarStageWidth,
						stageWidth: stageWidth, 
						scrollMargin: scrollMargin, 
						scrollBorder: scrollBorder, 
						infiniteSliderOffset: infiniteSliderOffset[sliderNumber], 
						infiniteSliderWidth: infiniteSliderWidth						
					});
					
					isFirstInit = false;
					
					return true;
				
				}
				
				if(iosSliderSettings[sliderNumber].responsiveSlides || iosSliderSettings[sliderNumber].responsiveSlideContainer) {
					
					var orientationEvent = supportsOrientationChange ? 'orientationchange' : 'resize';
					
					$(window).bind(orientationEvent + '.iosSliderEvent', function() {
							
						if(!init()) return true;
						
						var args = $(stageNode).data('args');
				
						if(settings.onSliderResize != '') {
					    	settings.onSliderResize(args);
					    }
						
					});
					
				}
				
				if((settings.keyboardControls || settings.tabToAdvance) && !shortContent) {

					$(document).bind('keydown.iosSliderEvent', function(e) {
						
						if((!isIe7) && (!isIe8)) {
							var e = e.originalEvent;
						}
						
						if((e.keyCode == 37) && settings.keyboardControls) {
							
							e.preventDefault();
							
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;

							if((slide > 0) || settings.infiniteSlider) {
								helpers.changeSlide(slide - 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							} 
								
						} else if(((e.keyCode == 39) && settings.keyboardControls) || ((e.keyCode == 9) && settings.tabToAdvance)) {
							
							e.preventDefault();
							
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
								
							if((slide < childrenOffsets.length-1) || settings.infiniteSlider) {
								helpers.changeSlide(slide + 1, scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, centeredSlideOffset, settings);
							}
								
						}
					
					});
					
				}
					
				if(isTouch || settings.desktopClickDrag) {
					
					var touchStartEvent = isTouch ? 'touchstart.iosSliderEvent' : 'mousedown.iosSliderEvent';
					var touchSelection = $(scrollerNode);
					var touchSelectionMove = $(scrollerNode);
					var preventDefault = null;
					var isUnselectable = false;
					
					if(settings.scrollbarDrag) {
					
						touchSelection = touchSelection.add(scrollbarNode);
						touchSelectionMove = touchSelectionMove.add(scrollbarBlockNode);
						
					}
					
					$(touchSelection).bind(touchStartEvent, function(e) {
						
						if(touchLocks[sliderNumber] || shortContent) return true;
						
						isUnselectable = helpers.isUnselectable(e.target, settings);
						
						if(isUnselectable) return true;
						
						currentEventNode = ($(this)[0] === $(scrollbarNode)[0]) ? scrollbarNode : scrollerNode;
						
						if((!isIe7) && (!isIe8)) {
							var e = e.originalEvent;
						}

						helpers.autoSlidePause(sliderNumber);
						
						allScrollerNodeChildren.unbind('.disableClick');
						
						if(!isTouch) {
							
							if (window.getSelection) {
								if (window.getSelection().empty) {
									window.getSelection().empty();
								} else if (window.getSelection().removeAllRanges) {
									window.getSelection().removeAllRanges();
								}
							} else if (document.selection) {
								document.selection.empty();
							}
							
							eventX = e.pageX;
							eventY = e.pageY;
							
							isMouseDown = true;
							currentSlider = scrollerNode;

							$(this).css({
								cursor: grabInCursor
							});
							
						} else {
						
							eventX = e.touches[0].pageX;
							eventY = e.touches[0].pageY;

						}
						
						xCurrentScrollRate = new Array(0, 0);
						yCurrentScrollRate = new Array(0, 0);
						xScrollDistance = 0;
						xScrollStarted = false;
						
						for(var j = 0; j < scrollTimeouts.length; j++) {
							clearTimeout(scrollTimeouts[j]);
						}
						
						var scrollPosition = helpers.getSliderOffset(scrollerNode, 'x');

						if(scrollPosition > (sliderMin[sliderNumber] * -1 + centeredSlideOffset + scrollerWidth)) {
							
							scrollPosition = sliderMin[sliderNumber] * -1 + centeredSlideOffset + scrollerWidth;

							helpers.setSliderOffset($('.' + scrollbarClass), scrollPosition);
							
							$('.' + scrollbarClass).css({
								width: (scrollbarWidth - scrollBorder) + 'px'
							});
							
						} else if(scrollPosition < (sliderMax[sliderNumber] * -1)) {
						
							scrollPosition = sliderMax[sliderNumber] * -1;

							helpers.setSliderOffset($('.' + scrollbarClass), (scrollbarStageWidth - scrollMargin - scrollbarWidth));
							
							$('.' + scrollbarClass).css({
								width: (scrollbarWidth - scrollBorder) + 'px'
							});
							
						} 
						
						var scrollbarSubtractor = ($(this)[0] === $(scrollbarNode)[0]) ? (sliderMin[sliderNumber]) : 0;
						
						xScrollStartPosition = (helpers.getSliderOffset(this, 'x') - eventX - scrollbarSubtractor) * -1;
						yScrollStartPosition = (helpers.getSliderOffset(this, 'y') - eventY) * -1;

						xCurrentScrollRate[1] = eventX;
						yCurrentScrollRate[1] = eventY;
						
						snapOverride = false;

					});
					
					var touchMoveEvent = isTouch ? 'touchmove.iosSliderEvent' : 'mousemove.iosSliderEvent';
					
					$(touchSelectionMove).bind(touchMoveEvent, function(e) {

						if((!isIe7) && (!isIe8)) {
							var e = e.originalEvent;
						}
						
						if(touchLocks[sliderNumber] || shortContent) return true;
						
						if(isUnselectable) return true;
						
						var edgeDegradation = 0;

						if(!isTouch) {
							
							if (window.getSelection) {
								if (window.getSelection().empty) {
									window.getSelection().empty();
								} else if (window.getSelection().removeAllRanges) {
									window.getSelection().removeAllRanges();
								}
							} else if (document.selection) {
								document.selection.empty();
							}
							
						}
						
						if(isTouch) {
							eventX = e.touches[0].pageX;
							eventY = e.touches[0].pageY;
						} else {
							eventX = e.pageX;
							eventY = e.pageY;
							
							if(!isMouseDown) {
								return false;
							}
							
							if(!isIe) {
								if((typeof e.webkitMovementX != 'undefined' || typeof e.webkitMovementY != 'undefined') && e.webkitMovementY === 0 && e.webkitMovementX === 0) {
									return false;
								}
							}
							
						}
						
						xCurrentScrollRate[0] = xCurrentScrollRate[1];
						xCurrentScrollRate[1] = eventX;
						xScrollDistance = (xCurrentScrollRate[1] - xCurrentScrollRate[0]) / 2;
						
						yCurrentScrollRate[0] = yCurrentScrollRate[1];
						yCurrentScrollRate[1] = eventY;
						yScrollDistance = (yCurrentScrollRate[1] - yCurrentScrollRate[0]) / 2;
						
						if(!xScrollStarted) {
						
							var slide = (activeChildOffsets[sliderNumber] + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;
							var args = new helpers.args(settings, scrollerNode, $(scrollerNode).children(':eq(' + slide + ')'), slide, slide, false);
							$(stageNode).data('args', args);

							if(settings.onSlideStart != '') {
								settings.onSlideStart(args);
							}
							
						}
						
						if(((yScrollDistance > 3) || (yScrollDistance < -3)) && ((xScrollDistance < 3) && (xScrollDistance > -3)) && (isTouch) && (!xScrollStarted)) {
							preventXScroll = true;
						}
						
						if(((xScrollDistance > 5) || (xScrollDistance < -5)) && (isTouch)) {
						
							e.preventDefault();
							xScrollStarted = true;
							
						} else if(!isTouch) {
							
							xScrollStarted = true;
							
						}
						
						if(xScrollStarted && !preventXScroll) {
							
							var scrollPosition = helpers.getSliderOffset(scrollerNode, 'x');
							var scrollbarSubtractor = ($(this)[0] === $(scrollbarBlockNode)[0]) ? (sliderMin[sliderNumber]) : centeredSlideOffset;
							var scrollbarMultiplier = ($(this)[0] === $(scrollbarBlockNode)[0]) ? ((sliderMin[sliderNumber] - sliderMax[sliderNumber] - centeredSlideOffset) / (scrollbarStageWidth - scrollMargin - scrollbarWidth)) : 1;
							var elasticPullResistance = ($(this)[0] === $(scrollbarBlockNode)[0]) ? settings.scrollbarElasticPullResistance : settings.elasticPullResistance;
							var snapCenteredSlideOffset = (settings.snapSlideCenter && ($(this)[0] === $(scrollbarBlockNode)[0])) ? 0 : centeredSlideOffset;
							var snapCenteredSlideOffsetScrollbar = (settings.snapSlideCenter && ($(this)[0] === $(scrollbarBlockNode)[0])) ? centeredSlideOffset : 0;

							if(isTouch) {
								if(currentTouches != e.touches.length) {
									xScrollStartPosition = (scrollPosition * -1) + eventX;
								}
								
								currentTouches = e.touches.length;
							}
							
							if(settings.infiniteSlider) {

								if(scrollPosition <= (sliderMax[sliderNumber] * -1)) {
									
									var scrollerWidth = $(scrollerNode).width();
									
									if(scrollPosition <= (sliderAbsMax[sliderNumber] * -1)) {
										
										var sum = originalOffsets[0] * -1;
										$(slideNodes).each(function(i) {
											
											helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
											if(i < childrenOffsets.length) {
												childrenOffsets[i] = sum * -1;
											}
											sum = sum + $(this).outerWidth(true);
											
										});
										
										xScrollStartPosition = xScrollStartPosition - childrenOffsets[0] * -1;
										sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
										infiniteSliderOffset[sliderNumber] = 0;
										
									} else {
										
										var lowSlideNumber = 0;
										var lowSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
										$(slideNodes).each(function(i) {
											
											if(helpers.getSliderOffset(this, 'x') < lowSlideOffset) {
												lowSlideOffset = helpers.getSliderOffset(this, 'x');
												lowSlideNumber = i;
											}
											
										});
										
										var newOffset = sliderMin[sliderNumber] + scrollerWidth;
										helpers.setSliderOffset($(slideNodes)[lowSlideNumber], newOffset);	
										
										sliderMin[sliderNumber] = childrenOffsets[1] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

										childrenOffsets.splice(0, 1);
										childrenOffsets.splice(childrenOffsets.length, 0, newOffset * -1 + centeredSlideOffset);

										infiniteSliderOffset[sliderNumber]++;
										
									}
									
								}
								
								if((scrollPosition >= (sliderMin[sliderNumber] * -1)) || (scrollPosition >= 0)) {
		
									var scrollerWidth = $(scrollerNode).width();
									
									if(scrollPosition >= 0) {
									
										var sum = originalOffsets[0] * -1;
										$(slideNodes).each(function(i) {
											
											helpers.setSliderOffset($(slideNodes)[i], sum + centeredSlideOffset);
											if(i < childrenOffsets.length) {
												childrenOffsets[i] = sum * -1;
											}
											sum = sum + $(this).outerWidth(true);
											
										});
										
										xScrollStartPosition = xScrollStartPosition + childrenOffsets[0] * -1;
										sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
										infiniteSliderOffset[sliderNumber] = numberOfSlides;
										
										while(((childrenOffsets[0] * -1 - scrollerWidth + centeredSlideOffset) > 0)) {
				
											var highSlideNumber = 0;
											var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
											$(slideNodes).each(function(i) {
												
												if(helpers.getSliderOffset(this, 'x') > highSlideOffset) {
													highSlideOffset = helpers.getSliderOffset(this, 'x');
													highSlideNumber = i;
												}
												
											});
				
											var newOffset = sliderMin[sliderNumber] - $(slideNodes[highSlideNumber]).outerWidth(true);
											helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);
											
											childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
											childrenOffsets.splice(childrenOffsets.length-1, 1);
				
											sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
											sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;
				
											infiniteSliderOffset[sliderNumber]--;
											activeChildOffsets[sliderNumber]++;
											
										}

									} else {

										var highSlideNumber = 0;
										var highSlideOffset = helpers.getSliderOffset($(slideNodes[0]), 'x');
										$(slideNodes).each(function(i) {
											
											if(helpers.getSliderOffset(this, 'x') > highSlideOffset) {
												highSlideOffset = helpers.getSliderOffset(this, 'x');
												highSlideNumber = i;
											}
											
										});
										
										var newOffset = sliderMin[sliderNumber] - $(slideNodes[highSlideNumber]).outerWidth(true);
										helpers.setSliderOffset($(slideNodes)[highSlideNumber], newOffset);									
										
										childrenOffsets.splice(0, 0, newOffset * -1 + centeredSlideOffset);
										childrenOffsets.splice(childrenOffsets.length-1, 1);

										sliderMin[sliderNumber] = childrenOffsets[0] * -1 + centeredSlideOffset;
										sliderMax[sliderNumber] = sliderMin[sliderNumber] + scrollerWidth - stageWidth;

										infiniteSliderOffset[sliderNumber]--;

									}
								
								}
								
							} else {
								
								var scrollerWidth = $(scrollerNode).width();
								
								if(scrollPosition > (sliderMin[sliderNumber] * -1 + centeredSlideOffset)) {

									edgeDegradation = (sliderMin[sliderNumber] + ((xScrollStartPosition - scrollbarSubtractor - eventX + snapCenteredSlideOffset) * -1 * scrollbarMultiplier) - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier;
									
								}
								
								if(scrollPosition < (sliderMax[sliderNumber] * -1)) {
									
									edgeDegradation = (sliderMax[sliderNumber] + snapCenteredSlideOffsetScrollbar + ((xScrollStartPosition - scrollbarSubtractor - eventX) * -1 * scrollbarMultiplier) - scrollbarSubtractor) * elasticPullResistance * -1 / scrollbarMultiplier;
										
								}
							
							}

							helpers.setSliderOffset(scrollerNode, ((xScrollStartPosition - scrollbarSubtractor - eventX - edgeDegradation) * -1 * scrollbarMultiplier) - scrollbarSubtractor + snapCenteredSlideOffsetScrollbar);
							
							if(settings.scrollbar) {
								
								helpers.showScrollbar(settings, scrollbarClass);

								scrollbarDistance = Math.floor((xScrollStartPosition - eventX - edgeDegradation - sliderMin[sliderNumber] + snapCenteredSlideOffset) / (sliderMax[sliderNumber] - sliderMin[sliderNumber] + centeredSlideOffset) * (scrollbarStageWidth - scrollMargin - scrollbarWidth) * scrollbarMultiplier);
								
								var width = scrollbarWidth;
								
								if(scrollPosition >= (sliderMin[sliderNumber] * -1 + snapCenteredSlideOffset + scrollerWidth)) {

									width = scrollbarWidth - scrollBorder - (scrollbarDistance * -1);
									
									helpers.setSliderOffset($('.' + scrollbarClass), 0);
									
									$('.' + scrollbarClass).css({
										width: width + 'px'
									});
									
								} else if(scrollPosition <= ((sliderMax[sliderNumber] * -1) + 1)) {

									width = scrollbarStageWidth - scrollMargin - scrollBorder - scrollbarDistance;
									
									helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
									
									$('.' + scrollbarClass).css({
										width: width + 'px'
									});
									
								} else {
								
									helpers.setSliderOffset($('.' + scrollbarClass), scrollbarDistance);
									
								}
								
							}
							
							if(isTouch) {
								lastTouch = e.touches[0].pageX;
							}

							var slideChanged = false;
							var newChildOffset = helpers.calcActiveOffset(settings, (xScrollStartPosition - eventX - edgeDegradation) * -1, childrenOffsets, stageWidth, infiniteSliderOffset[sliderNumber], numberOfSlides, undefined, sliderNumber);
							var tempOffset = (newChildOffset + infiniteSliderOffset[sliderNumber] + numberOfSlides)%numberOfSlides;

							if(settings.infiniteSlider) {
								
								if(tempOffset != activeChildInfOffsets[sliderNumber]) {
									slideChanged = true;
								}
									
							} else {
							
								if(newChildOffset != activeChildOffsets[sliderNumber]) {
									slideChanged = true;
								}
							
							}
							
							if(slideChanged) {
								
								activeChildOffsets[sliderNumber] = newChildOffset;
								activeChildInfOffsets[sliderNumber] = tempOffset;
								snapOverride = true;
								
								var args = new helpers.args(settings, scrollerNode, $(scrollerNode).children(':eq(' + tempOffset + ')'), tempOffset, tempOffset, true);
								$(stageNode).data('args', args);
								
								if(settings.onSlideChange != '') {
									settings.onSlideChange(args);
								}
								
							}
							
						}
						
					});
					
					$(touchSelection).bind('touchend.iosSliderEvent', function(e) {
						
						var e = e.originalEvent;
						
						if(touchLocks[sliderNumber] || shortContent) return true;
						
						if(isUnselectable) return true;
						
						if(e.touches.length != 0) {
							
							for(var j = 0; j < e.touches.length; j++) {
								
								if(e.touches[j].pageX == lastTouch) {
									helpers.slowScrollHorizontal(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
								}
								
							}
							
						} else {
							
							helpers.slowScrollHorizontal(scrollerNode, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
							
						}
						
						preventXScroll = false;
						
					});
					
					if(!isTouch) {

						var eventObject = $(window);
	
						if(isIe8 || isIe7) {
							var eventObject = $(document); 
						}
						
						$(eventObject).bind('mouseup.iosSliderEvent' + sliderNumber, function(e) {
							
							if(xScrollStarted) {
								anchorEvents.unbind('click.disableClick').bind('click.disableClick', helpers.preventClick);
							} else {
								anchorEvents.unbind('click.disableClick').bind('click.disableClick', helpers.enableClick);
							}
							
							onclickEvents.each(function() {
								
								this.onclick = function(event) {
									if(xScrollStarted) { 
										return false;
									}
								
									$(this).data('onclick').call(this, event || window.event);
								}
								
							});
							
							if(parseFloat($().jquery) >= 1.8) {
								
								allScrollerNodeChildren.each(function() {
										
									var clickObject = $._data(this, 'events');
									
									if(clickObject != undefined) {
										if(clickObject.click != undefined) {

											if(clickObject.click[0].namespace != 'iosSliderEvent') {
												
												if(!xScrollStarted) { 
													return false;
												}
											
												$(this).one('click.disableClick', helpers.preventClick);
											    var handlers = $._data(this, 'events').click;
											    var handler = handlers.pop();
											    handlers.splice(0, 0, handler);
												
											}
											
										}
									}
									
								});
							
							} else if(parseFloat($().jquery) >= 1.6) {
							
								allScrollerNodeChildren.each(function() {
										
									var clickObject = $(this).data('events');
									
									if(clickObject != undefined) {
										if(clickObject.click != undefined) {

											if(clickObject.click[0].namespace != 'iosSliderEvent') {
												
												if(!xScrollStarted) { 
													return false;
												}
											
												$(this).one('click.disableClick', helpers.preventClick);
											    var handlers = $(this).data('events').click;
											    var handler = handlers.pop();
											    handlers.splice(0, 0, handler);
												
											}
											
										}
									}
									
								});
							
							} else {
							}
							
							if(!isEventCleared[sliderNumber]) {
							
								if(shortContent) return true;
								
								$(touchSelection).css({
									cursor: grabOutCursor
								});
								
								isMouseDown = false;
								
								if(currentSlider == undefined) {
									return false;
								}

								helpers.slowScrollHorizontal(currentSlider, slideNodes, scrollTimeouts, scrollbarClass, xScrollDistance, yScrollDistance, scrollbarWidth, stageWidth, scrollbarStageWidth, scrollMargin, scrollBorder, originalOffsets, childrenOffsets, sliderNumber, infiniteSliderWidth, numberOfSlides, currentEventNode, snapOverride, centeredSlideOffset, settings);
								
								currentSlider = undefined;
							
							}
							
							preventXScroll = false;
							
						});
						
					} 
				
				}
				
			});	
			
		},
		
		destroy: function(clearStyle, node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {
			
				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;
				
				if(clearStyle == undefined) {
		    		clearStyle = true;
		    	}
		    	
	    		helpers.autoSlidePause(data.sliderNumber);
		    	isEventCleared[data.sliderNumber] = true;
		    	$(window).unbind('.iosSliderEvent-' + data.sliderNumber);
		    	$(window).unbind('.iosSliderEvent');
		    	$(document).unbind('.iosSliderEvent-' + data.sliderNumber);
		    	$(document).unbind('keydown.iosSliderEvent');
		    	$(this).unbind('.iosSliderEvent');
	    		$(this).children(':first-child').unbind('.iosSliderEvent');
	    		$(this).children(':first-child').children().unbind('.iosSliderEvent');
		    	
		    	if(clearStyle) {
	    			$(this).attr('style', '');
		    		$(this).children(':first-child').attr('style', '');
		    		$(this).children(':first-child').children().attr('style', '');
		    		
		    		$(data.settings.navSlideSelector).attr('style', '');
		    		$(data.settings.navPrevSelector).attr('style', '');
		    		$(data.settings.navNextSelector).attr('style', '');
		    		$(data.settings.autoSlideToggleSelector).attr('style', '');
		    		$(data.settings.unselectableSelector).attr('style', '');
	    		}
	    		
	    		if(data.settings.scrollbar) {
	    			$('.scrollbarBlock' + data.sliderNumber).remove();
	    		}
	    		
	    		var scrollTimeouts = slideTimeouts[data.sliderNumber];
	    		
	    		for(var i = 0; i < scrollTimeouts.length; i++) {
					clearTimeout(scrollTimeouts[i]);
				}
	    		
	    		$this.removeData(['iosslider', 'args']);
		    	
			});
		
		},
		
		update: function(node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {

				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;
				
				data.settings.startAtSlide = $this.data('args').currentSlideNumber;
				methods.destroy(false, this);
				
				if((data.numberOfSlides != 1) && data.settings.infiniteSlider) {
				 	data.settings.startAtSlide = (activeChildOffsets[data.sliderNumber] + 1 + infiniteSliderOffset[data.sliderNumber] + data.numberOfSlides)%data.numberOfSlides;
				}

				methods.init(data.settings, this);
				
				var args = new helpers.args(data.settings, data.scrollerNode, $(data.scrollerNode).children(':eq(' + (data.settings.startAtSlide - 1) + ')'), data.settings.startAtSlide - 1, data.settings.startAtSlide - 1, false);
				$(data.stageNode).data('args', args);
				
				if(data.settings.onSliderUpdate != '') {
			    	data.settings.onSliderUpdate(args);
			    }
		    	
			});
		
		},
		
		addSlide: function(slideNode, slidePosition) {

			return this.each(function() {
				
				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;
				
				if(!data.settings.infiniteSlider) {
				
					if(slidePosition <= data.numberOfSlides) {
						$(data.scrollerNode).children(':eq(' + (slidePosition - 1) + ')').before(slideNode);
					} else {
						$(data.scrollerNode).children(':eq(' + (slidePosition - 2) + ')').after(slideNode);
					}
					
					if($this.data('args').currentSlideNumber >= slidePosition) {
						$this.data('args').currentSlideNumber++;
					}
					
				} else {
					
					if(slidePosition == 1) {
						$(data.scrollerNode).children(':eq(0)').before(slideNode);
					} else {
						$(data.scrollerNode).children(':eq(' + (slidePosition - 2) + ')').after(slideNode);
					}
					
					if((infiniteSliderOffset[data.sliderNumber] < -1) && (true)) {
						activeChildOffsets[data.sliderNumber]--;
					}
					
					if($this.data('args').currentSlideNumber >= slidePosition) {
						activeChildOffsets[data.sliderNumber]++;
					}
					
				}
					
				$this.data('iosslider').numberOfSlides++;
				
				methods.update(this);
			
			});
		
		},
		
		removeSlide: function(slideNumber) {
		
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;

				$(data.scrollerNode).children(':eq(' + (slideNumber - 1) + ')').remove();
				if(activeChildOffsets[data.sliderNumber] > (slideNumber - 1)) {
					activeChildOffsets[data.sliderNumber]--;
				}

				methods.update(this);
			
			});
		
		},
		
		goToSlide: function(slide, node) {
			
			if(node == undefined) {
				node = this;
			}
			
			return $(node).each(function() {
					
				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;
				
				slide = (slide > data.childrenOffsets.length) ? data.childrenOffsets.length - 1 : slide - 1;
				
				helpers.changeSlide(slide, $(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
				
				activeChildOffsets[data.sliderNumber] = slide;

			});
			
		},
		
		lock: function() {
			
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;

				touchLocks[data.sliderNumber] = true;
			
			});
			
		},
		
		unlock: function() {
		
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;

				touchLocks[data.sliderNumber] = false;
			
			});
		
		},
		
		getData: function() {
		
			return this.each(function() {
			
				var $this = $(this);
				var data = $this.data('iosslider');
				if(data == undefined) return false;
				
				return data;
			
			});	
		
		}
		
		/*autoSlide: function(boolean) {
			
			helpers.autoSlidePause(data.sliderNumber);
		
		},
		
		autoSlidePlay: function() {
		
			helpers.autoSlide($(data.scrollerNode), $(data.slideNodes), slideTimeouts[data.sliderNumber], data.scrollbarClass, data.scrollbarWidth, data.stageWidth, data.scrollbarStageWidth, data.scrollMargin, data.scrollBorder, data.originalOffsets, data.childrenOffsets, data.sliderNumber, data.infiniteSliderWidth, data.numberOfSlides, data.centeredSlideOffset, data.settings);
			
		}*/
	
	}
	
	/* public functions */
	$.fn.iosSlider = function(method) {

		if(methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('invalid method call!');
		}
	
    };

}) (jQuery); /**
 * Isotope v1.5.19
 * An exquisite jQuery plugin for magical layouts
 * http://isotope.metafizzy.co
 *
 * Commercial use requires one-time license fee
 * http://metafizzy.co/#licenses
 *
 * Copyright 2012 David DeSandro / Metafizzy
 */
(function(a,b,c){"use strict";var d=a.document,e=a.Modernizr,f=function(a){return a.charAt(0).toUpperCase()+a.slice(1)},g="Moz Webkit O Ms".split(" "),h=function(a){var b=d.documentElement.style,c;if(typeof b[a]=="string")return a;a=f(a);for(var e=0,h=g.length;e<h;e++){c=g[e]+a;if(typeof b[c]=="string")return c}},i=h("transform"),j=h("transitionProperty"),k={csstransforms:function(){return!!i},csstransforms3d:function(){var a=!!h("perspective");if(a){var c=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),d="@media ("+c.join("transform-3d),(")+"modernizr)",e=b("<style>"+d+"{#modernizr{height:3px}}"+"</style>").appendTo("head"),f=b('<div id="modernizr" />').appendTo("html");a=f.height()===3,f.remove(),e.remove()}return a},csstransitions:function(){return!!j}},l;if(e)for(l in k)e.hasOwnProperty(l)||e.addTest(l,k[l]);else{e=a.Modernizr={_version:"1.6ish: miniModernizr for Isotope"};var m=" ",n;for(l in k)n=k[l](),e[l]=n,m+=" "+(n?"":"no-")+l;b("html").addClass(m)}if(e.csstransforms){var o=e.csstransforms3d?{translate:function(a){return"translate3d("+a[0]+"px, "+a[1]+"px, 0) "},scale:function(a){return"scale3d("+a+", "+a+", 1) "}}:{translate:function(a){return"translate("+a[0]+"px, "+a[1]+"px) "},scale:function(a){return"scale("+a+") "}},p=function(a,c,d){var e=b.data(a,"isoTransform")||{},f={},g,h={},j;f[c]=d,b.extend(e,f);for(g in e)j=e[g],h[g]=o[g](j);var k=h.translate||"",l=h.scale||"",m=k+l;b.data(a,"isoTransform",e),a.style[i]=m};b.cssNumber.scale=!0,b.cssHooks.scale={set:function(a,b){p(a,"scale",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.scale?d.scale:1}},b.fx.step.scale=function(a){b.cssHooks.scale.set(a.elem,a.now+a.unit)},b.cssNumber.translate=!0,b.cssHooks.translate={set:function(a,b){p(a,"translate",b)},get:function(a,c){var d=b.data(a,"isoTransform");return d&&d.translate?d.translate:[0,0]}}}var q,r;e.csstransitions&&(q={WebkitTransitionProperty:"webkitTransitionEnd",MozTransitionProperty:"transitionend",OTransitionProperty:"oTransitionEnd",transitionProperty:"transitionEnd"}[j],r=h("transitionDuration"));var s=b.event,t;s.special.smartresize={setup:function(){b(this).bind("resize",s.special.smartresize.handler)},teardown:function(){b(this).unbind("resize",s.special.smartresize.handler)},handler:function(a,b){var c=this,d=arguments;a.type="smartresize",t&&clearTimeout(t),t=setTimeout(function(){jQuery.event.handle.apply(c,d)},b==="execAsap"?0:100)}},b.fn.smartresize=function(a){return a?this.bind("smartresize",a):this.trigger("smartresize",["execAsap"])},b.Isotope=function(a,c,d){this.element=b(c),this._create(a),this._init(d)};var u=["width","height"],v=b(a);b.Isotope.settings={resizable:!0,layoutMode:"masonry",containerClass:"isotope",itemClass:"isotope-item",hiddenClass:"isotope-hidden",hiddenStyle:{opacity:0,scale:.001},visibleStyle:{opacity:1,scale:1},containerStyle:{position:"relative",overflow:"hidden"},animationEngine:"best-available",animationOptions:{queue:!1,duration:800},sortBy:"original-order",sortAscending:!0,resizesContainer:!0,transformsEnabled:!b.browser.opera,itemPositionDataEnabled:!1},b.Isotope.prototype={_create:function(a){this.options=b.extend({},b.Isotope.settings,a),this.styleQueue=[],this.elemCount=0;var c=this.element[0].style;this.originalStyle={};var d=u.slice(0);for(var e in this.options.containerStyle)d.push(e);for(var f=0,g=d.length;f<g;f++)e=d[f],this.originalStyle[e]=c[e]||"";this.element.css(this.options.containerStyle),this._updateAnimationEngine(),this._updateUsingTransforms();var h={"original-order":function(a,b){return b.elemCount++,b.elemCount},random:function(){return Math.random()}};this.options.getSortData=b.extend(this.options.getSortData,h),this.reloadItems(),this.offset={left:parseInt(this.element.css("padding-left")||0,10),top:parseInt(this.element.css("padding-top")||0,10)};var i=this;setTimeout(function(){i.element.addClass(i.options.containerClass)},0),this.options.resizable&&v.bind("smartresize.isotope",function(){i.resize()}),this.element.delegate("."+this.options.hiddenClass,"click",function(){return!1})},_getAtoms:function(a){var b=this.options.itemSelector,c=b?a.filter(b).add(a.find(b)):a,d={position:"absolute"};return this.usingTransforms&&(d.left=0,d.top=0),c.css(d).addClass(this.options.itemClass),this.updateSortData(c,!0),c},_init:function(a){this.$filteredAtoms=this._filter(this.$allAtoms),this._sort(),this.reLayout(a)},option:function(a){if(b.isPlainObject(a)){this.options=b.extend(!0,this.options,a);var c;for(var d in a)c="_update"+f(d),this[c]&&this[c]()}},_updateAnimationEngine:function(){var a=this.options.animationEngine.toLowerCase().replace(/[ _\-]/g,""),b;switch(a){case"css":case"none":b=!1;break;case"jquery":b=!0;break;default:b=!e.csstransitions}this.isUsingJQueryAnimation=b,this._updateUsingTransforms()},_updateTransformsEnabled:function(){this._updateUsingTransforms()},_updateUsingTransforms:function(){var a=this.usingTransforms=this.options.transformsEnabled&&e.csstransforms&&e.csstransitions&&!this.isUsingJQueryAnimation;a||(delete this.options.hiddenStyle.scale,delete this.options.visibleStyle.scale),this.getPositionStyles=a?this._translate:this._positionAbs},_filter:function(a){var b=this.options.filter===""?"*":this.options.filter;if(!b)return a;var c=this.options.hiddenClass,d="."+c,e=a.filter(d),f=e;if(b!=="*"){f=e.filter(b);var g=a.not(d).not(b).addClass(c);this.styleQueue.push({$el:g,style:this.options.hiddenStyle})}return this.styleQueue.push({$el:f,style:this.options.visibleStyle}),f.removeClass(c),a.filter(b)},updateSortData:function(a,c){var d=this,e=this.options.getSortData,f,g;a.each(function(){f=b(this),g={};for(var a in e)!c&&a==="original-order"?g[a]=b.data(this,"isotope-sort-data")[a]:g[a]=e[a](f,d);b.data(this,"isotope-sort-data",g)})},_sort:function(){var a=this.options.sortBy,b=this._getSorter,c=this.options.sortAscending?1:-1,d=function(d,e){var f=b(d,a),g=b(e,a);return f===g&&a!=="original-order"&&(f=b(d,"original-order"),g=b(e,"original-order")),(f>g?1:f<g?-1:0)*c};this.$filteredAtoms.sort(d)},_getSorter:function(a,c){return b.data(a,"isotope-sort-data")[c]},_translate:function(a,b){return{translate:[a,b]}},_positionAbs:function(a,b){return{left:a,top:b}},_pushPosition:function(a,b,c){b=Math.round(b+this.offset.left),c=Math.round(c+this.offset.top);var d=this.getPositionStyles(b,c);this.styleQueue.push({$el:a,style:d}),this.options.itemPositionDataEnabled&&a.data("isotope-item-position",{x:b,y:c})},layout:function(a,b){var c=this.options.layoutMode;this["_"+c+"Layout"](a);if(this.options.resizesContainer){var d=this["_"+c+"GetContainerSize"]();this.styleQueue.push({$el:this.element,style:d})}this._processStyleQueue(a,b),this.isLaidOut=!0},_processStyleQueue:function(a,c){var d=this.isLaidOut?this.isUsingJQueryAnimation?"animate":"css":"css",f=this.options.animationOptions,g=this.options.onLayout,h,i,j,k;i=function(a,b){b.$el[d](b.style,f)};if(this._isInserting&&this.isUsingJQueryAnimation)i=function(a,b){h=b.$el.hasClass("no-transition")?"css":d,b.$el[h](b.style,f)};else if(c||g||f.complete){var l=!1,m=[c,g,f.complete],n=this;j=!0,k=function(){if(l)return;var b;for(var c=0,d=m.length;c<d;c++)b=m[c],typeof b=="function"&&b.call(n.element,a,n);l=!0};if(this.isUsingJQueryAnimation&&d==="animate")f.complete=k,j=!1;else if(e.csstransitions){var o=0,p=this.styleQueue[0],s=p&&p.$el,t;while(!s||!s.length){t=this.styleQueue[o++];if(!t)return;s=t.$el}var u=parseFloat(getComputedStyle(s[0])[r]);u>0&&(i=function(a,b){b.$el[d](b.style,f).one(q,k)},j=!1)}}b.each(this.styleQueue,i),j&&k(),this.styleQueue=[]},resize:function(){this["_"+this.options.layoutMode+"ResizeChanged"]()&&this.reLayout()},reLayout:function(a){this["_"+this.options.layoutMode+"Reset"](),this.layout(this.$filteredAtoms,a)},addItems:function(a,b){var c=this._getAtoms(a);this.$allAtoms=this.$allAtoms.add(c),b&&b(c)},insert:function(a,b){this.element.append(a);var c=this;this.addItems(a,function(a){var d=c._filter(a);c._addHideAppended(d),c._sort(),c.reLayout(),c._revealAppended(d,b)})},appended:function(a,b){var c=this;this.addItems(a,function(a){c._addHideAppended(a),c.layout(a),c._revealAppended(a,b)})},_addHideAppended:function(a){this.$filteredAtoms=this.$filteredAtoms.add(a),a.addClass("no-transition"),this._isInserting=!0,this.styleQueue.push({$el:a,style:this.options.hiddenStyle})},_revealAppended:function(a,b){var c=this;setTimeout(function(){a.removeClass("no-transition"),c.styleQueue.push({$el:a,style:c.options.visibleStyle}),c._isInserting=!1,c._processStyleQueue(a,b)},10)},reloadItems:function(){this.$allAtoms=this._getAtoms(this.element.children())},remove:function(a,b){var c=this,d=function(){c.$allAtoms=c.$allAtoms.not(a),a.remove(),b&&b.call(c.element)};a.filter(":not(."+this.options.hiddenClass+")").length?(this.styleQueue.push({$el:a,style:this.options.hiddenStyle}),this.$filteredAtoms=this.$filteredAtoms.not(a),this._sort(),this.reLayout(d)):d()},shuffle:function(a){this.updateSortData(this.$allAtoms),this.options.sortBy="random",this._sort(),this.reLayout(a)},destroy:function(){var a=this.usingTransforms,b=this.options;this.$allAtoms.removeClass(b.hiddenClass+" "+b.itemClass).each(function(){var b=this.style;b.position="",b.top="",b.left="",b.opacity="",a&&(b[i]="")});var c=this.element[0].style;for(var d in this.originalStyle)c[d]=this.originalStyle[d];this.element.unbind(".isotope").undelegate("."+b.hiddenClass,"click").removeClass(b.containerClass).removeData("isotope"),v.unbind(".isotope")},_getSegments:function(a){var b=this.options.layoutMode,c=a?"rowHeight":"columnWidth",d=a?"height":"width",e=a?"rows":"cols",g=this.element[d](),h,i=this.options[b]&&this.options[b][c]||this.$filteredAtoms["outer"+f(d)](!0)||g;h=Math.floor(g/i),h=Math.max(h,1),this[b][e]=h,this[b][c]=i},_checkIfSegmentsChanged:function(a){var b=this.options.layoutMode,c=a?"rows":"cols",d=this[b][c];return this._getSegments(a),this[b][c]!==d},_masonryReset:function(){this.masonry={},this._getSegments();var a=this.masonry.cols;this.masonry.colYs=[];while(a--)this.masonry.colYs.push(0)},_masonryLayout:function(a){var c=this,d=c.masonry;a.each(function(){var a=b(this),e=Math.ceil(a.outerWidth(!0)/d.columnWidth);e=Math.min(e,d.cols);if(e===1)c._masonryPlaceBrick(a,d.colYs);else{var f=d.cols+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.colYs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryPlaceBrick(a,g)}})},_masonryPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=this.masonry.columnWidth*d,h=c;this._pushPosition(a,g,h);var i=c+a.outerHeight(!0),j=this.masonry.cols+1-f;for(e=0;e<j;e++)this.masonry.colYs[d+e]=i},_masonryGetContainerSize:function(){var a=Math.max.apply(Math,this.masonry.colYs);return{height:a}},_masonryResizeChanged:function(){return this._checkIfSegmentsChanged()},_fitRowsReset:function(){this.fitRows={x:0,y:0,height:0}},_fitRowsLayout:function(a){var c=this,d=this.element.width(),e=this.fitRows;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.x!==0&&f+e.x>d&&(e.x=0,e.y=e.height),c._pushPosition(a,e.x,e.y),e.height=Math.max(e.y+g,e.height),e.x+=f})},_fitRowsGetContainerSize:function(){return{height:this.fitRows.height}},_fitRowsResizeChanged:function(){return!0},_cellsByRowReset:function(){this.cellsByRow={index:0},this._getSegments(),this._getSegments(!0)},_cellsByRowLayout:function(a){var c=this,d=this.cellsByRow;a.each(function(){var a=b(this),e=d.index%d.cols,f=Math.floor(d.index/d.cols),g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByRowGetContainerSize:function(){return{height:Math.ceil(this.$filteredAtoms.length/this.cellsByRow.cols)*this.cellsByRow.rowHeight+this.offset.top}},_cellsByRowResizeChanged:function(){return this._checkIfSegmentsChanged()},_straightDownReset:function(){this.straightDown={y:0}},_straightDownLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,0,c.straightDown.y),c.straightDown.y+=d.outerHeight(!0)})},_straightDownGetContainerSize:function(){return{height:this.straightDown.y}},_straightDownResizeChanged:function(){return!0},_masonryHorizontalReset:function(){this.masonryHorizontal={},this._getSegments(!0);var a=this.masonryHorizontal.rows;this.masonryHorizontal.rowXs=[];while(a--)this.masonryHorizontal.rowXs.push(0)},_masonryHorizontalLayout:function(a){var c=this,d=c.masonryHorizontal;a.each(function(){var a=b(this),e=Math.ceil(a.outerHeight(!0)/d.rowHeight);e=Math.min(e,d.rows);if(e===1)c._masonryHorizontalPlaceBrick(a,d.rowXs);else{var f=d.rows+1-e,g=[],h,i;for(i=0;i<f;i++)h=d.rowXs.slice(i,i+e),g[i]=Math.max.apply(Math,h);c._masonryHorizontalPlaceBrick(a,g)}})},_masonryHorizontalPlaceBrick:function(a,b){var c=Math.min.apply(Math,b),d=0;for(var e=0,f=b.length;e<f;e++)if(b[e]===c){d=e;break}var g=c,h=this.masonryHorizontal.rowHeight*d;this._pushPosition(a,g,h);var i=c+a.outerWidth(!0),j=this.masonryHorizontal.rows+1-f;for(e=0;e<j;e++)this.masonryHorizontal.rowXs[d+e]=i},_masonryHorizontalGetContainerSize:function(){var a=Math.max.apply(Math,this.masonryHorizontal.rowXs);return{width:a}},_masonryHorizontalResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_fitColumnsReset:function(){this.fitColumns={x:0,y:0,width:0}},_fitColumnsLayout:function(a){var c=this,d=this.element.height(),e=this.fitColumns;a.each(function(){var a=b(this),f=a.outerWidth(!0),g=a.outerHeight(!0);e.y!==0&&g+e.y>d&&(e.x=e.width,e.y=0),c._pushPosition(a,e.x,e.y),e.width=Math.max(e.x+f,e.width),e.y+=g})},_fitColumnsGetContainerSize:function(){return{width:this.fitColumns.width}},_fitColumnsResizeChanged:function(){return!0},_cellsByColumnReset:function(){this.cellsByColumn={index:0},this._getSegments(),this._getSegments(!0)},_cellsByColumnLayout:function(a){var c=this,d=this.cellsByColumn;a.each(function(){var a=b(this),e=Math.floor(d.index/d.rows),f=d.index%d.rows,g=(e+.5)*d.columnWidth-a.outerWidth(!0)/2,h=(f+.5)*d.rowHeight-a.outerHeight(!0)/2;c._pushPosition(a,g,h),d.index++})},_cellsByColumnGetContainerSize:function(){return{width:Math.ceil(this.$filteredAtoms.length/this.cellsByColumn.rows)*this.cellsByColumn.columnWidth}},_cellsByColumnResizeChanged:function(){return this._checkIfSegmentsChanged(!0)},_straightAcrossReset:function(){this.straightAcross={x:0}},_straightAcrossLayout:function(a){var c=this;a.each(function(a){var d=b(this);c._pushPosition(d,c.straightAcross.x,0),c.straightAcross.x+=d.outerWidth(!0)})},_straightAcrossGetContainerSize:function(){return{width:this.straightAcross.x}},_straightAcrossResizeChanged:function(){return!0}},b.fn.imagesLoaded=function(a){function h(){a.call(c,d)}function i(a){var c=a.target;c.src!==f&&b.inArray(c,g)===-1&&(g.push(c),--e<=0&&(setTimeout(h),d.unbind(".imagesLoaded",i)))}var c=this,d=c.find("img").add(c.filter("img")),e=d.length,f="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",g=[];return e||h(),d.bind("load.imagesLoaded error.imagesLoaded",i).each(function(){var a=this.src;this.src=f,this.src=a}),c};var w=function(b){a.console&&a.console.error(b)};b.fn.isotope=function(a,c){if(typeof a=="string"){var d=Array.prototype.slice.call(arguments,1);this.each(function(){var c=b.data(this,"isotope");if(!c){w("cannot call methods on isotope prior to initialization; attempted to call method '"+a+"'");return}if(!b.isFunction(c[a])||a.charAt(0)==="_"){w("no such method '"+a+"' for isotope instance");return}c[a].apply(c,d)})}else this.each(function(){var d=b.data(this,"isotope");d?(d.option(a),d._init(c)):b.data(this,"isotope",new b.Isotope(a,this,c))});return this}})(window,jQuery); (function ($) {
    // Monkey patch jQuery 1.3.1+ css() method to support CSS 'transform'
    // property uniformly across Safari/Chrome/Webkit, Firefox 3.5+, IE 9+, and Opera 11+.
    // 2009-2011 Zachary Johnson www.zachstronaut.com
    // Updated 2011.05.04 (May the fourth be with you!)
    function getTransformProperty(element)
    {
        // Try transform first for forward compatibility
        // In some versions of IE9, it is critical for msTransform to be in
        // this list before MozTranform.
        var properties = ['transform', 'WebkitTransform', 'msTransform', 'MozTransform', 'OTransform'];
        var p;
        while (p = properties.shift())
        {
            if (typeof element.style[p] != 'undefined')
            {
                return p;
            }
        }
        
        // Default to transform also
        return 'transform';
    }
    
    var _propsObj = null;
    
    var proxied = $.fn.css;
    $.fn.css = function (arg, val)
    {
        // Temporary solution for current 1.6.x incompatibility, while
        // preserving 1.3.x compatibility, until I can rewrite using CSS Hooks
        if (_propsObj === null)
        {
            if (typeof $.cssProps != 'undefined')
            {
                _propsObj = $.cssProps;
            }
            else if (typeof $.props != 'undefined')
            {
                _propsObj = $.props;
            }
            else
            {
                _propsObj = {}
            }
        }
        
        // Find the correct browser specific property and setup the mapping using
        // $.props which is used internally by jQuery.attr() when setting CSS
        // properties via either the css(name, value) or css(properties) method.
        // The problem with doing this once outside of css() method is that you
        // need a DOM node to find the right CSS property, and there is some risk
        // that somebody would call the css() method before body has loaded or any
        // DOM-is-ready events have fired.
        if
        (
            typeof _propsObj['transform'] == 'undefined'
            &&
            (
                arg == 'transform'
                ||
                (
                    typeof arg == 'object'
                    && typeof arg['transform'] != 'undefined'
                )
            )
        )
        {
            _propsObj['transform'] = getTransformProperty(this.get(0));
        }
        
        // We force the property mapping here because jQuery.attr() does
        // property mapping with jQuery.props when setting a CSS property,
        // but curCSS() does *not* do property mapping when *getting* a
        // CSS property.  (It probably should since it manually does it
        // for 'float' now anyway... but that'd require more testing.)
        //
        // But, only do the forced mapping if the correct CSS property
        // is not 'transform' and is something else.
        if (_propsObj['transform'] != 'transform')
        {
            // Call in form of css('transform' ...)
            if (arg == 'transform')
            {
                arg = _propsObj['transform'];
                
                // User wants to GET the transform CSS, and in jQuery 1.4.3
                // calls to css() for transforms return a matrix rather than
                // the actual string specified by the user... avoid that
                // behavior and return the string by calling jQuery.style()
                // directly
                if (typeof val == 'undefined' && jQuery.style)
                {
                    return jQuery.style(this.get(0), arg);
                }
            }

            // Call in form of css({'transform': ...})
            else if
            (
                typeof arg == 'object'
                && typeof arg['transform'] != 'undefined'
            )
            {
                arg[_propsObj['transform']] = arg['transform'];
                delete arg['transform'];
            }
        }
        
        return proxied.apply(this, arguments);
    };
})(jQuery);
 (function ($) {
    // Monkey patch jQuery 1.3.1+ to add support for setting or animating CSS
    // scale and rotation independently.
    // 2009-2010 Zachary Johnson www.zachstronaut.com
    // Updated 2010.11.06
    var rotateUnits = 'deg';
    
    $.fn.rotate = function (val)
    {
        var style = $(this).css('transform') || 'none';
        
        if (typeof val == 'undefined')
        {
            if (style)
            {
                var m = style.match(/rotate\(([^)]+)\)/);
                if (m && m[1])
                {
                    return m[1];
                }
            }
            
            return 0;
        }
        
        var m = val.toString().match(/^(-?\d+(\.\d+)?)(.+)?$/);
        if (m)
        {
            if (m[3])
            {
                rotateUnits = m[3];
            }
            
            $(this).css(
                'transform',
                style.replace(/none|rotate\([^)]*\)/, '') + 'rotate(' + m[1] + rotateUnits + ')'
            );
        }
        
        return this;
    }
    
    // Note that scale is unitless.
    $.fn.scale = function (val, duration, options)
    {
        var style = $(this).css('transform');
        
        if (typeof val == 'undefined')
        {
            if (style)
            {
                var m = style.match(/scale\(([^)]+)\)/);
                if (m && m[1])
                {
                    return m[1];
                }
            }
            
            return 1;
        }
        
        $(this).css(
            'transform',
            style.replace(/none|scale\([^)]*\)/, '') + 'scale(' + val + ')'
        );
        
        return this;
    }

    // fx.cur() must be monkey patched because otherwise it would always
    // return 0 for current rotate and scale values
    var curProxied = $.fx.prototype.cur;
    $.fx.prototype.cur = function ()
    {
        if (this.prop == 'rotate')
        {
            return parseFloat($(this.elem).rotate());
        }
        else if (this.prop == 'scale')
        {
            return parseFloat($(this.elem).scale());
        }
        
        return curProxied.apply(this, arguments);
    }
    
    $.fx.step.rotate = function (fx)
    {
        $(fx.elem).rotate(fx.now + rotateUnits);
    }
    
    $.fx.step.scale = function (fx)
    {
        $(fx.elem).scale(fx.now);
    }
    
    /*
    
    Starting on line 3905 of jquery-1.3.2.js we have this code:
    
    // We need to compute starting value
    if ( unit != "px" ) {
        self.style[ name ] = (end || 1) + unit;
        start = ((end || 1) / e.cur(true)) * start;
        self.style[ name ] = start + unit;
    }
    
    This creates a problem where we cannot give units to our custom animation
    because if we do then this code will execute and because self.style[name]
    does not exist where name is our custom animation's name then e.cur(true)
    will likely return zero and create a divide by zero bug which will set
    start to NaN.
    
    The following monkey patch for animate() gets around this by storing the
    units used in the rotation definition and then stripping the units off.
    
    */
    
    var animateProxied = $.fn.animate;
    $.fn.animate = function (prop)
    {
        if (typeof prop['rotate'] != 'undefined')
        {
            var m = prop['rotate'].toString().match(/^(([+-]=)?(-?\d+(\.\d+)?))(.+)?$/);
            if (m && m[5])
            {
                rotateUnits = m[5];
            }
            
            prop['rotate'] = m[1];
        }
        
        return animateProxied.apply(this, arguments);
    }
})(jQuery); var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init(); $(function(){


$( "#mobile-menu a" ).each(function( index ) {
  $(this).addClass($(this).text());
});


//var mmIH = $("#mobile-menu-inner").height();

//console.log(mmIH + " " + wHeight);

//if($(window).height() < $("#mobile-menu-inner").height()) {
//	console.log('not adjusted 3');
	//$("#mobile-menu-inner").height($("#mobile-menu-inner").height());
//} else {
	//console.log("adjusted height");
	var wHeight = $(window).height();
	$("#mobile-menu-inner").height(wHeight);
	//$("#mobile-menu-inner").css("overflow-y","hidden");
	
//}
/*var mmIC = $("#mobile-menu-container").height();
mmIC = mmIC + 300;
$("#mobile-menu-inner").height(mmIC);
$("#mobile-menu-inner").css("overflow-y","auto");*/

setTimeout(function() {
//var mobileCopyTop = $(".slideImage img").first().html();

if($('body').hasClass('home')) {
	var mobileCopyMiddle = $("#main").html();

//$(".blurredBodyCopy .top").html(mobileCopyTop);	
	
	$(".blurredBodyCopy .middle").html(mobileCopyMiddle);
} else {
	
}
},1000);


$(window).scroll(function() {
  	
  	var newtop = $(window).scrollTop();
  	newtop = "-"+newtop+"px";
  	newtranslate = "translate(0px,"+newtop+")";
  	//console.log(mainshowing+ " " + newtranslate);
  	
	 $(".blurredBodyCopy").css("transform",newtranslate);
  	
  	
  
  	
  });


function imageBoxFit() {
	$( "#page .box" ).each(function( index ) {
	  var imgS = $(this).find("img").first();
	  var imgSH = $(imgS).height();
	  var imgSW = $(imgS).width();
	  
	  var imgAR = imgSW / imgSH;
	  
	  
	  
	  
	  var boxH = $(this).height();
	  var boxW = $(this).width();
	  
	  var boxAR = boxW / boxH;
	  
	  
	  //console.log(imgAR + " " + boxAR);
	  if(boxAR >= imgAR) {
		  $(imgS).css("width","100%");
		  $(imgS).css("height","auto");
	  } else {
		  $(imgS).css("height","100%");
		  $(imgS).css("width","auto");
	  }
	  
	});
}

imageBoxFit();
setTimeout(function() {
	imageBoxFit();
},1000);

var countFeatures = 0;
	   var ieWarning = localStorage.getItem("ieWarning");
	   
	   var agentStr = navigator.userAgent;
        var modeType;
        if (agentStr.indexOf("Trident/5.0") > -1) {
            if (agentStr.indexOf("MSIE 7.0") > -1)
                modeType = "IE9 Compatibility View";
                
               
                
            else
                modeType = "IE9";
        }
        else if (agentStr.indexOf("Trident/4.0") > -1) {
            if (agentStr.indexOf("MSIE 7.0") > -1)
                modeType = "IE8 Compatibility View";
                
             
                
            else
                modeType = "IE8";
        }
        else
            modeType = "IE7";


		if(modeType == "IE9 Compatibility View" || modeType == "IE8 Compatibility View") {
			if(ieWarning != "dismiss") {
				$(".ieWarning").slideDown();
			}
		}
		
		$(".ieWarningDismiss").click(function(e) {
			e.preventDefault();
			$(".ieWarning").slideUp();
			localStorage.setItem("ieWarning","dismiss");
		});
		
		$(".ieWarningDismissOnce").click(function(e) {
			e.preventDefault();
			$(".ieWarning").slideUp();
			//localStorage.setItem("ieWarning","dismiss");
		});
        //document.title = "Browser Mode:\t" + mode;

	   
	  setTimeout(function() {
		  $("body").toggleClass("relative");
	  },3000);
	  
	  setTimeout(function() {
		  $("body").toggleClass("relative");
	  },6000);
	  
	  function anchoredFooter() {
	  	  var footerElem = $("#colophon");
	  	  var threshHold = 0;
		  var bodyH = $("body").height();
		  var viewH = $(window).height();
		  var footerH = footerElem.height();
		  
		  
		  if(footerElem.hasClass("fixedBottom")) {
		  		console.log(bodyH+footerH+threshHold + " : " + viewH);
			  if((bodyH+footerH+threshHold) < viewH) {
			  	//footerElem.addClass("fixedBottom");
			  } else {
			  	footerElem.removeClass("fixedBottom");
			  }
		  } else {
			  if(bodyH < viewH) {
			  	footerElem.addClass("fixedBottom");
			  } else {
			  	//footerElem.removeClass("fixedBottom");
			  }
		  }
	  }
	  
	  //run on page load
	  anchoredFooter(); 
	  
	  $(".headeroverlay, .headerbgBlur, .headerbgBlurImage").height($(".navWrapper").height());
	 $(".headerbgBlur, .headerbgBlurImage").width($(".navWrapper").width()); 
	  
	  //recheck when the window is resized
	  $( window ).resize(function() {
	 		anchoredFooter(); 
	 		imageBoxFit();
	 		
	 		var wHeight = $(window).height();
	 		$("#mobile-menu-inner").height(wHeight);


	 		$(".headeroverlay, .headerbgBlur, .headerbgBlurImage").height($(".navWrapper").height());
	 		$(".headerbgBlur, .headerbgBlurImage").width($(".navWrapper").width()); 
	 		
	 		/*$("#mobile-menu").css("z-index", "-1");
    	$("#mobile-menu").css("opacity", "0");*/
    		
    		$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "");
    	    $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	     $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "");
    	    $("#mobile-menu").css("-moz-transition", "0.3s");
    	    $("#mobile-menu").css("-moz-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-moz-transform", "scale(0.8)");
    	    
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(0px,0,0)");
	  }); 
	  
	  $('.newsItem .additionalContent').each(function(index) {
		//console.log($(this).next().html());
		var i = $(this).children().hasClass("noImageSpacer2");
		
		if(i) {
				//console.log("no image");
			} else {
				$(this).next().addClass("imagePresent");
			}
		
		
			
			
		});
	   
	   $(".box a").click(function() {
		  $(this).closest(".box").find("img").addClass("blurAnim");
		  $(this).closest(".box").find(".windows8").show();
		  $(this).closest(".box").find(".shade").fadeIn(400);
	   });
	   
	   
	   
	   
	   //Check to see if the homepage feature exists
	   var checkcol = $('.collegeFeature').html();
	   if(checkcol) {
	   
	   var blurbarheight = $('.headertransition').height();
	   blurbarheightmod = blurbarheight + 10;
	   blurbarheight = blurbarheight + "px";
	   blurbarheightmod = blurbarheightmod + "px";
	   
	   $(".slideBlurImage").css("height",blurbarheightmod);
	   $(".slideBlur").css("height",blurbarheight);
	   
	   
	 var transitiontype = "crossdissolve"; //This can be set to 'slide' or to 'crossdissolve'
    	$(".collegeFeature").addClass(transitiontype);
	   
	   
	   var mobileFeatures ="";
	   var navFeatures ="";
	   //Feature setup
	   
	   if(transitiontype == "slide") {	  
	   
	   $('.collegeFeature li').each(function(index) {
			   countFeatures = countFeatures + 1;
			   
			   mobileFeatures = mobileFeatures + ("<div class='item item"+countFeatures+"'><div class='inner'>"+ $(this).html() + "</div></div>");
			   
			   //navFeatures = navFeatures + ("<div class='navitem navitem"+countFeatures+"'><div class='inner'>"+ $(this).html() + "</div></div>");
			   
			   $(this).attr("data-count",countFeatures);
			   $(this).css("z-index",countFeatures);
			   $(this).addClass('active');
			   if($(this).attr("data-count") != 1) {
				   //$(this).css("display","none");
				   $(this).removeClass('active');
			   }
  
			  
		 });
		
		
		} else {
				
			 $('.collegeFeature li').each(function(index) {
			   countFeatures = countFeatures + 1;
			   
			   mobileFeatures = mobileFeatures + ("<div class='item item"+countFeatures+"'><div class='inner'>"+ $(this).html() + "</div></div>");
			   
			   //navFeatures = navFeatures + ("<div class='navitem navitem"+countFeatures+"'><div class='inner'>"+ $(this).html() + "</div></div>");
			   var zIndexCount = 10-countFeatures;
			   $(this).attr("data-count",countFeatures);
			   $(this).css("z-index",countFeatures);
			   $(this).addClass('active');
			   if($(this).attr("data-count") != 1) {
				   //$(this).css("display","none");
				   //$(this).hide();
				   $(this).removeClass('active');
				   $(this).css("opacity","0");
				   $(this).css("left","100000px");
			   }
			   });
		}
		
		 //console.log(countFeatures);
		 
		
		
		//$(".headeroverlay").append(navFeatures);
		 
		 var bodyWidth = $(window).width() +"px";
				//console.log(bodyWidth);
				$(".collegeFeature ul li").css("width",bodyWidth);
				var headerbackground = bodyWidth + " auto";
				$(".headerbgBlurImage").css("background-size",headerbackground);
		 
		$( window ).resize(function() {
				var bodyWidth = $(window).width() +"px";
				//console.log(bodyWidth);
				var headerbackground = bodyWidth + " auto";
				$(".collegeFeature ul li").css("width",bodyWidth);
				$(".headerbgBlurImage").css("background-size",headerbackground);
  		});
		
		   $('.iosSlider .slider').html(mobileFeatures); 
		 
		var duration = 20000;
		var halfd = duration /2;
		var time1,time2;
    	time1 = setInterval(function() {nextSlide();},duration);
    	var homeCheck = $("body").hasClass("home");
    	
    	 //If only one feature is available, hide auto rotation.
		 if(countFeatures == 1 || homeCheck == false) {
			 $(".timer, .collegeFeature .next, .collegeFeature .previous").hide();
			 clearInterval(time1);
		 }
    	
    	
    	//Feature slide rotation functionality
    	function nextSlide(elem) {
    	
    	rotateTimer();
    	
    	 var widthvar = $(".collegeFeature ul li").width();
    	 
    	if(transitiontype == "slide") {
	    	if($('.collegeFeature li:last-child').hasClass('active')) {
			   $(".collegeFeature ul").animate({ 
			        left: "0px"
			      }, 500 );
			      
			      
			      
			   } else {
				   $(".collegeFeature ul").animate({ 
			        left: "-="+widthvar+"px"
			      }, 500 );
			   }
		   
		  }

	    	
	    	$('.collegeFeature li').each(function(e) {
			  
			   if($(this).hasClass('active') && ($(this).attr("data-count") < countFeatures)) {
			   	 var t = $(this);
			   	 
				  $(t).next().addClass('active');
				  $(t).removeClass('active');
				  
				  if(transitiontype == "crossdissolve") {
				  	$(t).next().css("left","0px");
					  $(t).next().animate({
					   	  opacity: 1
				   	  }, 1000, function() {
					   	  $(t).css("opacity","0");
					   	  $(t).css("left","100000px");
				   	  });
			   	  }
				  
				   return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == countFeatures)) {
				  var t = $(this);
				  $(t).removeClass('active');
				   
				   if(transitiontype == "crossdissolve") {
					   $('.collegeFeature li:first-child').css("opacity","1");
					   $('.collegeFeature li:first-child').css("left","0px");
					   $(t).animate({
					   	  opacity: 0
				   	  }, 1000, function() {
					   	  $(t).css("left","10000000px");
				   	  });
			   	  }
				   
				    $('.collegeFeature li:first-child').addClass('active');
				   return false; 
			   }
		   });
		   }
		   

    	//Rotate Timer functionality
        function rotateTimer() {
        	
        	clearTimeout(time2);
        	
        if(BrowserDetect.browser == "Explorer" || BrowserDetect.browser == "Firefox") {
	     
	     } else {
        	
        	$('.collegeFeature .timer1').stop().rotate('0deg');
		    $('.collegeFeature .timer2').stop().rotate('0deg');
		    
	      
	       $('.collegeFeature .timer2').animate({rotate: '180deg'}, halfd, 'linear');
	       time2 = setTimeout(function() {        
	       		$('.collegeFeature .timer1').animate({rotate: '180deg'}, halfd, 'linear', function() {
		       		
		       		//rotateTimer();
	       		});
	       		
	       		
	       },halfd);
	       
	       }
	       
	     }
	     
	   
	     rotateTimer();

	     $('.collegeFeature .next').click(function() {
	     
	     	//console.log(transitiontype);
	     	     
	     if(!sliderpaused) {
	     	clearTimeout(time1);
	     	time1 = setInterval(function() {nextSlide($(this));},duration);
	     	rotateTimer();
	     }
	     
	     if(transitiontype == "slide") {
		     var widthvar = $(".collegeFeature ul li").width();
	     	
	    	
	    	$('.collegeFeature li').each(function(index) {
			   
			   if($(this).hasClass('active') && ($(this).attr("data-count") < countFeatures)) {
			   	  var t = $(this);
			   	  
				  $(t).next().addClass('active');
				  $(t).removeClass('active');
				  
				  $(".collegeFeature ul").animate({ 
					  left: "-="+widthvar+"px"
		        	}, 500 );
				   
				  return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == countFeatures)) {
				  var t = $(this);
				  $(t).removeClass('active');
				  
				   $('.collegeFeature li:first-child').addClass('active');
				   
				   $(".collegeFeature ul").animate({ 
					   left: "0px"
		        	}, 500 );
				   
				   return false; 
			   }
			   
			    
			   
			   
		   });
	     } else {
		     $('.collegeFeature li').each(function(index) {
			   
			   if($(this).hasClass('active') && ($(this).attr("data-count") < countFeatures)) {
			   	  var t = $(this);
			   	  $(t).next().css("left","0px");
			   	  $(t).next().animate({
				   	  opacity: 1
			   	  }, 1000, function() {
				   	  $(t).css("opacity","0");
				   	  $(t).css("left","1000000px");
			   	  });
			   	  
			   	 
				  $(t).next().addClass('active');
				  $(t).removeClass('active');
				  
				 /* $(".collegeFeature ul").animate({ 
					  left: "-="+widthvar+"px"
		        	}, 500 );*/
				   
				  return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == countFeatures)) {
				  var t = $(this);
				  $(t).removeClass('active');
				  
				  
				  $('.collegeFeature li:first-child').css("opacity","1");
				  $('.collegeFeature li:first-child').css("left","0px");
				   $(t).animate({
				   	  opacity: 0
			   	  }, 1000, function() {
				   	  $(t).css("left","100000px");
			   	  });
				  
				   $('.collegeFeature li:first-child').addClass('active');
				   
				/*   $(".collegeFeature ul").animate({ 
					   left: "0px"
		        	}, 500 );*/
				   
				   return false; 
			   }
			   
			    
			   
			   
		   });
	     }
		    
		   
		   		   
		   return false;
	     });
	     
	     
	     $('.collegeFeature .previous').click(function() {
	     	//console.log(mainslider);
	     	if(!sliderpaused) {
		     	clearTimeout(time1);
		     	time1 = setInterval(function() {nextSlide(this);},duration);
		     	rotateTimer();
	     	}
	     	
		     var widthvar = $(".collegeFeature ul li").width();
	    	
	    	if(transitiontype == "slide") {
	    	
	    	$('.collegeFeature li').each(function(index) {
			   
			   if($(this).hasClass('active') && ($(this).attr("data-count") != 1)) {
			   	 var t = $(this);
			   	 
				  $(t).prev().addClass('active');
				  $(t).removeClass('active');
				  
				  $(".collegeFeature ul").animate({ 
					  left: "+="+widthvar+"px"
		        	}, 500 );
				   
				   return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == 1)) {
				  var t = $(this);
				  $(t).removeClass('active');
				   
				   
				    $('.collegeFeature li:last-child').addClass('active');
				    
				     $(".collegeFeature ul").animate({ 
					     left: "-2814px"
					     }, 500 );

				   return false; 
			   }
		   }); 
		   
		   } else {
		   $('.collegeFeature li').each(function(index) {
			   
			   if($(this).hasClass('active') && ($(this).attr("data-count") != 1)) {
			   	 var t = $(this);
				  $(t).prev().addClass('active');
				   $(t).prev().css("left","0px");
				  $(t).removeClass('active');
				  
				  $(t).prev().css("opacity","1");
				  $(t).animate({
				   	  opacity: 0
			   	  }, 1000, function() {
				   	  $(t).css("left","100000px");
			   	  });

				   
				   return false;
			   } 
			   if($(this).hasClass('active') && ($(this).attr("data-count") == 1)) {
				  var t = $(this);
				  $(t).removeClass('active');
				   
				   
				   
				    $('.collegeFeature li:last-child').addClass('active');
				    $('.collegeFeature li:last-child').css("left","0px");
				    $('.collegeFeature li:last-child').animate({
				   	  opacity: 1
			   	  }, 1000, function() {
				   	  $(t).css("opacity","0");
				   	  $(t).css("left","100000px");
			   	  });
				    
				    
				     /*$(".collegeFeature ul").animate({ 
					     left: "-2814px"
					     }, 500 );*/

				   return false; 
			   }
		   });
		   
		   }
		   
		   

		   return false;
	     });
	     
	     var sliderpaused = false;
	     
	     //Pausing and playing the feature slides
	     $('.collegeFeature .timer a').click(function() {
	     	if(!sliderpaused) {
		     	clearTimeout(time1);
		     	clearTimeout(time2);
		     	
		     	//$('.collegeFeature .timer1').stop();
		     	//$('.collegeFeature .timer2').stop();
		     	
		     	$('.collegeFeature .timer1').stop().animate({rotate: '0deg'}, 200, 'linear');
				       setTimeout(function() {        
				       		$('.collegeFeature .timer2').stop().animate({rotate: '0deg'}, 200, 'linear', function() {
					       		
					       		//rotateTimer();
				       		});
				       		
				       		
				       },200);
		     	
		     	$(this).addClass("paused");
		     	sliderpaused = true;
		     	storePrefs("mainslider","paused");
	     	} else {
		     	rotateTimer();
		     	time1 = setInterval(function() {nextSlide();},duration);
		     	
		     	$(this).removeClass("paused");
		     	storePrefs("mainslider","play");
		     	sliderpaused = false;
	     	}
	     
	     
	     	return false;
	     });
	     
	     //Save the paused state to html5 local storage
	     if (supports_html5_storage()) {
	     	var mainslider = localStorage.getItem("mainslider");
		      if(mainslider == "paused") {
				    clearTimeout(time1);
			     	clearTimeout(time2);
			     	
			     	$('.collegeFeature .timer1').stop();
			     	$('.collegeFeature .timer2').stop();
			     	
			     	
			     	
			     	$(".collegeFeature .timer a").addClass("paused");
			     	sliderpaused = true;
			     	} else {
				  mainslider = "play";
				  }
				  
		}
		
		if(isMobile) {
					clearTimeout(time1);
			     	clearTimeout(time2);
			     	
			     	$('.collegeFeature .timer1').stop();
			     	$('.collegeFeature .timer2').stop();
			     	
			     	
			     	
			     	$(".collegeFeature .timer a").addClass("paused");
		}
		
		}


 	var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
			};
 			
			
 	//Redraw tiles UI
 	function reDraw(elem) {
		
		//$(".box").addClass("dropin");
		
		
		setTimeout(function() {
		
		$("#container").animate({ 
       
        opacity: 1.0
       
      }, 500 );
		
		if(arrHasDupes(mainobjs)) {
			var dupes = arrHasDupes(mainobjs);
	
		}
		
		if(arrHasDupes(descobjs)) {
			var dupes = arrHasDupes(descobjs);
			
		}

		
		if($('.newsItem.twitter')) {
			var url = $('.newsItem.twitter .titleheading a').last().attr("href");
			var text = "Learn more about how " + $('.newsItem.twitter .titleheading h3').text();
			if(url) {
				$('.newsItem.twitter .highlight').attr("href",url);
				$('.newsItem.twitter .highlight').attr("title",text);
				$('.newsItem.twitter .highlight').text(text);
			}
		}
		
		
		
		$('.newsItem').each(function(index) {
		var w = $(this);
		var t = $(this).find('.titleheading').text();
		var d = $(this).find('.excerpt').text();
		
		var ds = d.substring(0,50);
		
		if(dupes) {
			if(t == dupes || ds == dupes) {
				//$(this).hide();
				$(this).addClass("duplicate");
				dupes = "";
			}
		}
		
		
		
		$(this).find('.excerpt a').remove();
		var tempexcerpt = $(this).find('.excerpt').text();
		
		//Remove extra spaces from the beginning and end of the excerpt
		tempexcerpt = trim11(tempexcerpt);
		
		if(tempexcerpt.length == 0) {
			$(this).addClass("noexcerpt");
		} else {
			
			//tempexcerpt = tempexcerpt.replace('/&#8230','/');
			//console.log( tempexcerpt.charAt( tempexcerpt.length-1 ) );
			tempexcerpt = tempexcerpt.slice(0, -2);
			var shortexcerpt = "<p>"+tempexcerpt.substring(0,120)+"&#8230;</p>";
			$(this).find('.excerpt').html(shortexcerpt);
		}
		
			
			
		
		
		//$(".twitter").find('.excerpt').html("");
		
		
		
		
		/*var height1 = parseInt($(this).find('.additionalContent').height());
		var height2 = parseInt($(this).find('.text').height());
		var height3 = parseInt($(this).find('.additionalContent img').attr('height'));
		var width1 = parseInt($(this).find('.additionalContent img').attr('width'));
		var width2 = parseInt($(this).find('.additionalContent').width());*/
		
		
		if(!isMobile) {
		//var updateheight = height1 + (height2*1.3);
		} else {
			//var updateheight = height1 + (height2*1.1);
		}
			
		
		/*$(this).not('.customize, .noImage').find('.previousa').css("height",updateheight);*/
		
		if(BrowserDetect.browser != "Explorer") {
		
		var b = $(this).find('.excerpt').html();
		var h = $(this).find('.excerpt').height();
		
		
			h = h *1.3;
		
		//console.log(h);
		
		/*if(!isMobile) {
		
		$(this).find('.excerpt').css("height",h);
		$(this).find('.excerpt').html("");
		$(this).find('.excerpt').append("<div class='fold1'><div class='content'>"+b+"</div></div><div class='fold2' aria-hidden='true'><div class='content'>"+b+"</div></div>");
		
		$(this).find('.fold2 .content').css("margin-top",-(h/2));
		$(this).find('.fold1').css("height",h/2);
		$(this).find('.fold2').css("height",h/2);
		$(this).find('.fold2').css("-webkit-transform-origin-y",-(h/2));
		
		
		if(BrowserDetect.browser == "Chrome") {
		$(this).find('.fold1').css("-webkit-transform", "translate3d(0px, "+-(h/7)+"px, 0px) rotateX(-90deg)");
		} else {
			$(this).find('.fold1').css("-webkit-transform", "translate3d(0px, 0px, 0px) rotateX(-90deg)");
		}
		
		var h = $(this).find('.excerpt').height();

		//$(this).find('.excerpt').attr("data-height",h+'px');
		
		}*/
		}
		
		
	});
	
	if(!startcat) {
		startcat = "chronological";
	}
    
      $container.isotope({
        masonry: {
        columnWidth: 316
        
          //columnWidth: 1
        },
        sortBy: startcat,
        getSortData: {
          number: function( $elem ) {
            var number = $elem.hasClass('newsItem') ? 
              $elem.find('.number').text() :
              $elem.attr('data-number');
            return parseInt( number, 10 );
          },
          alphabetical: function( $elem ) {
            var name = $elem.find('h3'),
            itemText = name.length ? name : $elem;
            return itemText.text();
          },
          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
        }
      });
		
		 },500);

	}
 	//End of reDraw()
 	
 	function reIso(elem) {
		

		
	
	if(!startcat) {
		startcat = "chronological";
	}
    
      $container.isotope({
        masonry: {
        columnWidth: 316
        
          //columnWidth: 1
        },
        sortBy: startcat,
        getSortData: {
          number: function( $elem ) {
            var number = $elem.hasClass('newsItem') ? 
              $elem.find('.number').text() :
              $elem.attr('data-number');
            return parseInt( number, 10 );
          },
          alphabetical: function( $elem ) {
            var name = $elem.find('h3'),
            itemText = name.length ? name : $elem;
            return itemText.text();
          },
          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
        }
      });
		
		

	}
 	
 	//Find any duplicate article entries by title	
	function arrHasDupes( A ) {                          // finds any duplicate array elements using the fewest possible comparison
		var i, j, n;
		n=A.length;
	                                                     // to ensure the fewest possible comparisons
		for (i=0; i<n; i++) {                        // outer loop uses each item i at 0 through n
			for (j=i+1; j<n; j++) {              // inner loop only compares items j at i+1 to n
				if (A[i]==A[j]) {
				
				return A[i];
				}
				
		}	}
		return false;
	}
	
	//Trim String
	function trim11(str) {
	    str = str.replace(/^\s+/, '');
	    for (var i = str.length - 1; i >= 0; i--) {
	        if (/\S/.test(str.charAt(i))) {
	            str = str.substring(0, i + 1);
	            break;
	        }
	    }
	    return str;
	}
 
 	 var calsWPTheme = {

	    foo: function() {
	    },
	
	    bar: function() {
	    },
	    
	    init: function() {
	    	
	    	//Check for window resize and reDraw the tiles as needed.
		    var resize;
		 	$(window).resize(function() {
		 			clearTimeout(resize);
			 		resize = setTimeout(function() { reIso(); },300);
		  	});
		  	
		  	//Setup sidebar navigation event listeners
		  	$("#nav_sidebar .children").hide();
		  	
		  	$("#nav_sidebar li ul.children").prev().addClass("hasChildren");
		  	
		  	$("#nav_sidebar .children").delay(300).slideDown(700, function() {
			  		// Animation complete.
			  });
			  
			  
			  if(Function('/*@cc_on return document.documentMode===10@*/')()){document.documentElement.className+=' ie10';}
		  	
		  			 	
		 	var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
			};
			
			
			
			
			
			
			function slideChange(args) {
						
				/*$('.sliderContainer .slideSelectors .item').removeClass('selected');
				$('.sliderContainer .slideSelectors .item:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');*/
			
			}
			
			function slideComplete(args) {
							
				/*if(!args.slideChanged) return false;
				
				$(args.sliderObject).find('.text1, .text2').attr('style', '');
				
				$(args.currentSlideObject).find('.text1').animate({
					right: '100px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');
				
				$(args.currentSlideObject).find('.text2').delay(200).animate({
					right: '50px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');*/
				
			}
			
			function sliderLoaded(args) {
					
			/*	$(args.sliderObject).find('.text1, .text2').attr('style', '');
				
				$(args.currentSlideObject).find('.text1').animate({
					right: '100px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');
				
				$(args.currentSlideObject).find('.text2').delay(200).animate({
					right: '50px',
					opacity: '0.8'
				}, 400, 'easeOutQuint');
				
				slideChange(args);*/
				
			}
			
			
			//$(".fluidHeight").show();
			
			/*if($(".collegeFeature").hasClass("mobileShown")) {
				
			} else {
			//$(".collegeFeature").hide();
			}
			$('.iosSlider').iosSlider({
					desktopClickDrag: true,
					autoSlideTimer: 9000,
					snapToChildren: true,
					onSlideComplete: slideComplete,
					autoSlide: true,
					scrollbar: true,
					scrollbarContainer: '.sliderContainer .scrollbarContainer',
					scrollbarMargin: '0',
					scrollbarBorderRadius: '1em',
					
				});*/

			
			
			$("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
			
			
			
				//Mobile
				//$('body').addClass("mobile");
				//isMobile = true;
				
				//Enable quickly scrolling to the top of the list by touching the header bar
			    $('.mobileScrollTop').click(function(){
			    		
			    	    $(".mobileScroll").animate({ scrollTop: 0 }, 400);	
			    });
			    
			    
			    //Add in mobile menu and categories markup and event listeners
			    /*var orignav = $(".menu-main-navigation-container, .menu").first().html();
			   
			    $('#mobile-menu-container').html(orignav);
			    
			    var origfilter = $(".categories").first().html();
			    $('#mobile-filter-inner').html(origfilter);*/
			     //$(".categories").first().html("");
			    var menushown = false;
			    var filtershown = false;
				
				if(isMobile.iOS()) {
					
				$("body").addClass("mobile");
   
			    $('.mobileNavTrigger').bind('touchstart', function(){
					
					
			    	$(this).addClass("touched");
			    	return false;
			    });
    
    $('.mobileNavTriggerLarge').bind('touchstart', function(){
    	
    	if(menushown) {
    	$(".home canvas").show();
    	$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "");
    	    $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "");
    	    $("#mobile-menu").css("-moz-transition", "0.3s");
    	    $("#mobile-menu").css("-moz-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-moz-transform", "scale(0.8)");
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(0px,0,0)");
    	    
    	  /*  $("#mobile-menu").css("z-index", "-1");
    	    $("#mobile-menu").css("opacity", "0");*/
    	    
    	    setTimeout(function() { $("#mobile-filter").show(); },500);
    	    
    	    menushown = false; 
    	    
    	  }
    	  
    	  if(filtershown) {
	    	  $(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    
    	    setTimeout(function() { $("#mobile-menu").show(); },500);
    	    
    	    filtershown = false;
    	  }   	
    	    return false;
    });
			    
			    
			    
			    $('.mobileNavTrigger').bind('touchend', function(){
			    
				    $("#mobile-filter").hide();
    	if(menushown) {
    		$(".home canvas").show();
    		$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "");
    	    $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    
    	    $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "");
    	    $("#mobile-menu").css("-moz-transition", "0.3s");
    	    $("#mobile-menu").css("-moz-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-moz-transform", "scale(0.8)");
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(0px,0,0)");
    	    
    	  /*  $("#mobile-menu").css("z-index", "-1");
    	    $("#mobile-menu").css("opacity", "0");*/
    	    
    	    setTimeout(function() { $("#mobile-filter").show(); },500);
    	    
    	    menushown = false;
    	    	    
    	} else {
    	$(".home canvas").hide();
    		$(".mobileNavTriggerLarge").show();
	    	/*$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(240px,0,0)");*/
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	     $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-menu").css("-moz-transition", "0.3s");
    	    $("#mobile-menu").css("-moz-transform", "translate3d(0px,0,0)");

    	    
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(240px,0,0)");
    	    
    	   /* $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "translate3d(240px,0,0)");*/
    	    $("#mobile-menu-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-moz-transform", "translate3d(0px,0,0)");
    	    
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(240px,0,0)");
    	    
    	   /* $("#mobile-menu").css("opacity", "1");
    	    setTimeout(function() { $("#mobile-menu").css("z-index", "1");  },500);*/
    	    menushown = true;
    	    
    	    if(filtershown) {
    	    	$(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	
    	    	$(".mobileScroll").css("-moz-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-moz-transform", "translate3d(0px,0,0)");
    	    	//$("#mobile-menu").css("-webkit-transform", "translate3d(240px,0,0)");
    	    	filtershown = false;
    	    }

    	}
    	
    	$(this).removeClass("touched");
    	
    	return false;
    });
			    
			    $('.mobileSettingsTrigger').bind('touchstart', function(){
    	
    	
    	$(this).addClass("touched");
    	   return false; 
    });
			
			    $('.mobileSettingsTrigger').bind('touchend', function(){
				   
				    $("#mobile-menu").hide();
				    
    if(filtershown) {
    		$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    
    	    setTimeout(function() { $("#mobile-menu").show(); },500);
    	    
    	    filtershown = false;
    	  
    	} else {
    		$(".mobileNavTriggerLarge").show();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "translate3d(0px,0,0)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    
    	    
    	    $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-filter").css("-moz-transition", "0.3s");
    	    $("#mobile-filter").css("-moz-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-moz-transform", "translate3d(0px,0,0)");
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(-240px,0,0)");
    	     
    	    filtershown = true;
    	    
    	    
	    	   if(menushown) {
    	    	$(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-menu").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	
    	    	$(".mobileScroll").css("-moz-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-moz-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-menu").css("-moz-transform", "translate3d(0px,0,0)");
    	    	menushown = false;
    	    }
    	    
    	   
    	}
    	$(this).removeClass("touched");
    	return false;
    });
    
    
    } else {
    /* Event listeners for when its not a mobile browser */
			$('.mobileNavTrigger').bind('click', function(){
					
					
			    	$(this).addClass("touched");
			    	return false;
			    });
    
    
    
    $('.mobileNavTriggerLarge').bind('click', function(){
    	
    	if(menushown) {
    	/*$("#mobile-menu").css("z-index", "-1");
    	$("#mobile-menu").css("opacity", "0");*/
    	$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "");
    	    $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	     $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "");
    	    $("#mobile-menu").css("-moz-transition", "0.3s");
    	    $("#mobile-menu").css("-moz-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-moz-transform", "scale(0.8)");
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(0px,0,0)");
    	    
    	    setTimeout(function() { $("#mobile-filter").show(); },500);
    	    
    	    menushown = false; 
    	    
    	  }
    	  
    	  if(filtershown) {
	    	  $(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    
    	    setTimeout(function() { $("#mobile-menu").show(); },500);
    	    
    	    filtershown = false;
    	  }   	
    	    return false;
    });
			    
			    
			    
			    $('.mobileNavTrigger').bind('click', function(){
			    
				    $("#mobile-filter").hide();
    	if(menushown) {
    		$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "");
    	    $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	     $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "");
    	    $("#mobile-menu").css("-moz-transition", "0.3s");
    	    $("#mobile-menu").css("-moz-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-menu-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-moz-transform", "scale(0.8)");
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(0px,0,0)");
    	    
    	    setTimeout(function() { $("#mobile-filter").show(); },500);
    	    
    	  /*  $("#mobile-menu").css("z-index", "-1");
    	    $("#mobile-menu").css("opacity", "0");*/
    	    
    	    menushown = false;
    	    	    
    	} else {
    		$(".mobileNavTriggerLarge").show();
	    	/*$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(240px,0,0)");*/
    	    $("#mobile-menu-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(240px,0,0)");
    	     $("#mobile-menu").css("-webkit-transition", "0.3s");
    	    $("#mobile-menu").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-menu").css("-moz-transition", "0.3s");
    	    $("#mobile-menu").css("-moz-transform", "translate3d(0px,0,0)");

    	    
    	    /* $(".mobileScroll").css("-moz-transition", "0.3s");	
    	    $(".mobileScroll").css("-moz-transform", "translate3d(240px,0,0)");*/
    	    $("#mobile-menu-inner").css("-moz-transition", "0.3s");
    	    $("#mobile-menu-inner").css("-moz-transform", "translate3d(0px,0,0)");
    	    
    	    //$("#access").css("-moz-transition", "0.3s");
    	    //$("#access").css("-moz-transform", "translate3d(240px,0,0)");
    	    
    	    menushown = true;
    	   /* $("#mobile-menu").css("opacity", "1");
    	    setTimeout(function() { $("#mobile-menu").css("z-index", "1");  },500);*/
    	    
    	    if(filtershown) {
    	    	$(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	//$("#mobile-menu").css("-webkit-transform", "translate3d(240px,0,0)");
    	    	filtershown = false;
    	    }

    	}
    	
    	$(this).removeClass("touched");
    	
    	return false;
    });
			    
			    $('.mobileSettingsTrigger').bind('click', function(){
    	
    	
    	$(this).addClass("touched");
    	   return false; 
    });
			
			    $('.mobileSettingsTrigger').bind('click', function(){
				   
				    $("#mobile-menu").hide();
				    
    if(filtershown) {
    		$(".mobileNavTriggerLarge").hide();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "scale(0.8)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(0px,0,0)");
    	    
    	    
    	    setTimeout(function() { $("#mobile-menu").show(); },500);
    	    
    	    filtershown = false;
    	  
    	} else {
    		$(".mobileNavTriggerLarge").show();
	    	$(".mobileScroll").css("-webkit-transition", "0.3s");	
    	    $(".mobileScroll").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    $("#mobile-filter").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    $("#mobile-filter-inner").css("-webkit-transition", "0.3s");
    	    $("#mobile-filter-inner").css("-webkit-transform", "translate3d(0px,0,0)");
    	    //$("#access").css("-webkit-transition", "0.3s");
    	    //$("#access").css("-webkit-transform", "translate3d(-240px,0,0)");
    	    filtershown = true;
    	    
    	    
	    	   if(menushown) {
    	    	$(".mobileScroll").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-filter").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	$("#mobile-menu").css("-webkit-transform", "translate3d(0px,0,0)");
    	    	menushown = false;
    	    }
    	    
    	   
    	}
    	$(this).removeClass("touched");
    	return false;
    });		
	}
			
		//Add scroll event listener to allow for fixed navigation header upon scrolling
			    $(window).scroll(function() {
			    	var scrolltop = $(window).scrollTop();
			    	
				    
				    if(scrolltop >= offset) {
					    $('#access').addClass("fixedNav"); 
					    $('#branding').css("margin-bottom","50px");
				    } else {
					    $('#access').removeClass("fixedNav");
					    $('#branding').css("margin-bottom","0px");
				    }
			  	});
			  	
			  	//Scroll to the top of the page smoothly when clicking the small crest
			  	$('.totop').click(function(){
				  	    $("html, body").animate({ scrollTop: 0 }, 600);
				  	    return false;
				});	
				
			
				//Not Mobile
				
				
				
				/*
				$('.newsItem a.more').mouseover(function() {
					$(this).prev().addClass("highlighted");	
				});	
					
				$('.newsItem a.more').mouseout(function() {
					$(this).prev().removeClass("highlighted");	
				});	
					
				$('.newsItem a.more, .newsItem a.categor').mouseover(function() {
					$(this).parent().find('.more').show();
				});	
					
				$('.newsItem a.more, .newsItem a.categor').mouseout(function() {
					$(this).parent().find('.more').hide();	
				});	
					
					
				
				$('.newsItem .previousa a').mouseover(function() {
					
					
					if(BrowserDetect.browser == "Explorer" || BrowserDetect.browser == "Opera") {
						var n = $(this).parent();
						//ex = setTimeout(function() {
						$(n).find('.excerpt').slideDown();
						
						//},800)
						 
					} else {
							var n = $(this).parent();
							
							
							//ex = setTimeout(function() {
							
								$(n).removeClass("reverse");
								$(n).addClass("expand");
								
								
								$(n).attr("aria-live","true");
							
							//},1000)
					}
						
				});
					
				$('.newsItem .previousa a').mouseout(function() {
				
				
				
					if(BrowserDetect.browser == "Explorer" || BrowserDetect.browser == "Opera") {
					//clearTimeout(ex);
						$(this).parent().find('.excerpt').slideUp();
					} else {
					
					//clearTimeout(ex);
					
					var n = $(this).parent();
					
					$(n).addClass("reverse");
					$(n).removeClass("expand");
					$(n).attr("aria-live","false");
					
					
					}
					
					
					$(this).removeClass("focusHighlight");
					
				});
					
				$('.newsItem .previousa a').focus(function() {
				
				
					
					if(BrowserDetect.browser == "Explorer") {
						
						$(this).parent().find('.excerpt').slideDown();
						 
					} else {
							
							var n = $(this).parent();
							$(n).addClass("expand");
							$(n).removeClass("reverse");
							
							
							
							$(n).attr("aria-live","true");
					}
					
					$(this).addClass("focusHighlight");
				});
					
				$('.newsItem .previousa a').blur(function() {
					
					if(BrowserDetect.browser == "Explorer") {
					
						$(this).parent().find('.excerpt').slideUp();
					} else {
					
					var n = $(this).parent();
					$(n).addClass("reverse");
					$(n).removeClass("expand");
					$(n).attr("aria-live","false");
					
					
					}
					
					$(this).removeClass("focusHighlight");
				});

			  	*/
				
			
			
		
	    }
	};

	calsWPTheme.init();
 
 
	//Declare starting variables
	
 	var filteroptions = "";
    var sortoptions = "chronological";
    var $container = $('#container');
    var nt;
    var count = 0;
    var mainobjs = [];
    var descobjs = [];
    var c = 0;
    var num = 0; //starting number for results returned in search filter
    var isMobile = false;  //Determining if you are on a mobile device (tablet or smartphone)
    var filterquery;
      var remember = "yes";
    
    //Add the browser type as a class to the body
    $('body').addClass(BrowserDetect.browser);
    
    if(BrowserDetect.OS == "iPhone/iPod") {
	    $('body').addClass("iPhone");
    } else {
    	$('body').addClass(BrowserDetect.OS);
    }
    
    
    /*var isMobile = {
			    Android: function() {
			        return navigator.userAgent.match(/Android/i);
			    },
			    BlackBerry: function() {
			        return navigator.userAgent.match(/BlackBerry/i);
			    },
			    iOS: function() {
			        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
			    },
			    Opera: function() {
			        return navigator.userAgent.match(/Opera Mini/i);
			    },
			    Windows: function() {
			        return navigator.userAgent.match(/IEMobile/i);
			    },
			    any: function() {
			        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
			    }
			};
			
			if( isMobile.any() ) {
				$('body').addClass("mobile");
				isMobile = true;
			}*/
    
    if(BrowserDetect.OS == "iPhone/iPod" || (BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Chrome")) {
    	$('body').addClass("mobile");
    	isMobile = true;
    } 
    
    //Count the number of images in the articles section
    $('.newsItem img').each(function(index) {
    	count = count +1;
    });
    
    //Compensate for Internet Explorer offset measurement
    var offset = $('#access').offset().top;
    if(BrowserDetect.browser == "Explorer") {
	    offset = offset;
    } else {
	    offset = offset;
    }
    
    
    
    
    
     
    
    
    
    
	    
    
    //Preload the images for the articles if available
    $('.newsItem').each(function(index) {
   
	    
   
	    if($(this).hasClass("Communities")) {
		    $(this).addClass("People")
	    }
	    
	    if($(this).hasClass("Communities") == false && $(this).hasClass("People") == false && $(this).hasClass("Agriculture") == false && $(this).hasClass("Energy") == false && $(this).hasClass("Environment") == false && $(this).hasClass("Events") == false && $(this).hasClass("Food") == false && $(this).hasClass("Health") == false && $(this).hasClass("social") == false) {
		    $(this).not('.customize').addClass("Announcements");
	    }
	    
	    var w = $(this);

		var tsrc = $(this).not('.customize').find('img').attr('src');
		var tsrcObj = $(this).not('.customize').find('img').parent();
		if(BrowserDetect.browser != "Explorer") {
		//$(this).find('.excerpt').hide();
		}
		var addarray = $(this).find('.titleheading').text();
		var adddescarray = $(this).find('.excerpt').text();
		var adddescarraysmall = adddescarray.substring(0,50)
		descobjs.push(adddescarraysmall);
		mainobjs.push(addarray);
		
		//If images are associated with the content, preload those images
		if(count > 0) {
			
			var img = new Image();
	        $(img).load(function () {
	           
	            c = c + 1;
	            //console.log(c + " " + count); 
	           var per = (c/count)*100;
	           //console.log(per);
	            $('.progress').attr("style","width:"+per+"%;");
	            if(c == count) {
	            	$('.loadBar').fadeOut(300);
		            //console.log('its done');
		            
		            reDraw();
	            }
	        }).error(function () {
	            // notify the user that the image could not be loaded
	            //tsrcObj.html("<div class='noImageSpacer2'></div>");
	            
	            //console.log(delaychange.attr("src"));
	           
				// console.log(tsrcObj.html());
	            //tsrc = tsrc.replace(/^https:\/\//i, 'http://');
	            tsrcObj.html("<div class='noImageSpacer2'></div>");
	            tsrcObj.next().removeClass('imagePresent');
	            // console.log(tsrcObj.html());
	            //console.log(delaychange.attr("src"));
				
	           
	            
	            $('.loadBar').fadeOut(300);
	            reDraw();
	        }).attr('src', tsrc);
        
        
        
	      } else {
		      $('.loadBar').fadeOut(300);
		            //console.log('its done');
		            
		            reDraw();
	      }
		
	});

	 
    //Initial Isotope Call
    $container.isotope({
        masonry: {
        columnWidth: 316
        
          //columnWidth: 1
        },
        sortBy: 'chronological',
        getSortData: {
          number: function( $elem ) {
            var number = $elem.hasClass('newsItem') ? 
              $elem.find('.number').text() :
              $elem.attr('data-number');
            return parseInt( number, 10 );
          },
          alphabetical: function( $elem ) {
            var name = $elem.find('h3'),
            itemText = name.length ? name : $elem;
            return itemText.text();
          },
          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
        }
      });
    
      
      var $optionSets = $('.option-set'),
          $optionLinks = $optionSets.find('a');

      //Options event listener
      $('.option-set a').click(function(){
      
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
          return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');
  
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;
      
        if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
          // changes in layout modes need extra logic
          changeLayoutMode( $this, options )
        } else {
          // otherwise, apply new options
          $container.isotope(options);
          //console.log(options);
          //localStorage.setItem("options", options);
        }
        
        return false;
      });
      
      
      //Store preference function needs to include polyfill for older browsers
      function storePrefs(key,value) {
		     if (supports_html5_storage()) {
			      // window.localStorage is available!
			      //alert(categories);
			      
			      localStorage.setItem(key, value);
			      
			     
		  		} else {
		  			
			  		// no native support for HTML5 storage :(
			  		// maybe try dojox.storage or a third-party solution
			  	}

	     }
      
      
      //Storing initial values, also needs polyfill for older browsers
      if (supports_html5_storage()) {
			      // window.localStorage is available!
			     
			      var startingcategories = localStorage.getItem("categories");
			      
			      var startcat = localStorage.getItem("sortCat");
			      if(!startcat) {
				      startcat = sortoptions;
			      } else {
			      		$('.categoriesSort a').removeClass('selected');
				     	$('.categoriesSort a').each(function(index) {
					     	if($(this).attr("data-cat") == startcat) {
						     	$(this).addClass("selected");
					     	}
					     });
					  sortingoptions = startcat;
					  sortoptions = startcat;
					  
					  if(isMobile) {
					  		
						  //var origfilter = $(".categories").first().html();
						  //$('#mobile-filter-inner').html(origfilter);
					  }
			      }
			      
			      if(startingcategories) {
				      var startingcategoriesarray = startingcategories.split(',');
					      
					      	for (var i = 0; i < startingcategoriesarray.length; i++) {
						      	
					     		if(startingcategoriesarray[i]) {
					     			
					     			if(startingcategoriesarray.length > 0) {
					     				
				              			var filterquery = filterquery +', .'+ startingcategoriesarray[i];
				              			
				              		} else {
					              		var filterquery = filterquery;
				              		}
				              		
				              		//$('.categories .topics a').addClass("selected");
				              		
				              		$('.categories .topics a').each(function(index) {
					              			var tempcat = $(this).attr('data-cat');
					              			//alert(tempcat);
					              			if(tempcat == startingcategoriesarray[i]) {
						              			$(this).removeClass("selected");
						              			
					              			}
					              	});
					              	
					              	
				              		
				              	}
				              	
				              	if(isMobile) {
					              			
										  var origfilter = $(".categories").first().html();
										  $('#mobile-filter-inner').html(origfilter);
									  }
				    
				            
				           } 
				           
			
		             
		              //If mobile, hide main filter menu
				      if(BrowserDetect.OS == "iPhone/iPod" || (BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Chrome") || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
					      //console.log('hide customize menu');
					      var filterquery = filterquery +', .customize, .duplicate';
					      reDraw();
					  }
		             
		             var categories = startingcategoriesarray;
		             
		             var completestartingquery = '".newsItem:not(.'+filterquery +')"';
		             filteroptions = completestartingquery;
		             
		             
		             } else {
				      var categories = new Array;
				      categories.push('duplicate');
				      
				      //If mobile, hide main filter menu
				      if(BrowserDetect.OS == "iPhone/iPod" || (BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Chrome")) {
				      		
					       categories.push('customize');
					       //categories.push('duplicate');
					       reDraw();
				      }
			      }

				  	
			     	//$container.isotope({ filter: completestartingquery });
			     	if(startcat && !startingcategories) {
			     	
			     	//If mobile, hide main filter menu
				      if(BrowserDetect.OS == "iPhone/iPod" || (BrowserDetect.OS == "Linux" && BrowserDetect.browser == "Chrome") || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
					      //console.log('hide customize menu');
					      var filterquery = filterquery +', .customize, .duplicate';
					      
					      //$container.isotope({ filter: ".newsItem:not(.duplicate, .customize)" });
					      //reDraw();
					  } else {
							var filterquery = filterquery +', .duplicate';
					  }
			     	
			     	var completestartingquery = '".newsItem:not(.'+filterquery +')"';
			     	filteroptions = completestartingquery;
			     	
			     	setTimeout(function() {
			     	$container.isotope({ 
			      		filter: completestartingquery,
			      		sortBy: startcat,
				        getSortData: {
				          number: function( $elem ) {
				            var number = $elem.hasClass('newsItem') ? 
				              $elem.find('.number').text() :
				              $elem.attr('data-number');
				            return parseInt( number, 10 );
				          },
				          alphabetical: function( $elem ) {
				            var name = $elem.find('h3'),
				            itemText = name.length ? name : $elem;
				            return itemText.text();
				          },
				          
				          chronological: function( $elem ) {
				            var number = $elem.find('.hiddendate').text();
				            return parseInt( number );
				          },
				          grouped: function( $elem ) {
				            var groupname = $elem.find('.hiddengroup').text();
				            return groupname;
				          }
				        } 
			        });
			         },300);
			        
			        }
			        
			        if(!startcat && startingcategories) {
			     	$container.isotope({ filter: completestartingquery });			        
			        }
			     	
			     	
			     	if(startcat && startingcategories) {
			     	setTimeout(function() {
			     		
			     		
			     		$container.isotope({ 
			      		filter: completestartingquery,
			      		sortBy: startcat,
				        getSortData: {
				          number: function( $elem ) {
				            var number = $elem.hasClass('newsItem') ? 
				              $elem.find('.number').text() :
				              $elem.attr('data-number');
				            return parseInt( number, 10 );
				          },
				          alphabetical: function( $elem ) {
				            var name = $elem.find('h3'),
				            itemText = name.length ? name : $elem;
				            return itemText.text();
				          },
				          chronological: function( $elem ) {
				            var number = $elem.find('.hiddendate').text();
				            return parseInt( number );
				          },
				          grouped: function( $elem ) {
				            var groupname = $elem.find('.hiddengroup').text();
				            return groupname;
				          }
				        } 
			        });
			        
			        },300);
			        
			        }

			     	
			      			      
			   			      //alert(startingcategories);
			      
		  		} else {
	      // no native support for HTML5 storage :(
		  // maybe try dojox.storage or a third-party solution
	  }
	     
	  //Apply stored preferences, also needs polyfill for older browsers
	  function applyPrefs(startingcategoriesarray) {
	     	//alert(startingcategoriesarray.length);
		 	for (var i = 0; i < startingcategoriesarray.length; i++) {
	     		
	     		if(startingcategoriesarray[i]) {
	     			if(startingcategoriesarray.length > 0) {
              			var filterquery = filterquery +', .'+ startingcategoriesarray[i];
              		} else {
	              		var filterquery = filterquery;
              		}
              	}
    
             }
             
             
             var categories = startingcategoriesarray;
             
             var completestartingquery = '".newsItem:not(.'+filterquery +')"';
             
		  
	     	$container.isotope({ filter: completestartingquery });
	     	filteroptions = completestartingquery;
	    
	     }
	           
      
      

      
      //Categories Event Listener
      $('.categories .topics a.categor, #mobile-filter .topics a.categor').click(function() {
      	
      	if($(this).hasClass('selected')) {
      		var cat = $(this).attr('data-cat');
      		$(this).removeClass('selected');
	        categories.push(cat);
	        	       
	     } else {
		    var cat = $(this).attr('data-cat');
      		
      		$(this).addClass('selected');
	        
	        categories.splice(categories.indexOf(cat), 1);
	      	     
	     }
	     	//alert(categories);
	     	for (var i = 0; i < categories.length; i++) {
	     		
	     		if(categories[i]) {
	     			if(categories.length > 0) {
              			var filterquery = filterquery +', .'+ categories[i];
              		} else {
	              		var filterquery = filterquery;
              		}
              	}
    
             }
             
             var completefilterquery = '".newsItem:not(.'+filterquery +')"';
             filteroptions = completefilterquery;
	     	

		  	
	     	$container.isotope({ 
      		filter: completefilterquery,
      		sortBy: sortoptions,
	        getSortData: {
	          number: function( $elem ) {
	            var number = $elem.hasClass('newsItem') ? 
	              $elem.find('.number').text() :
	              $elem.attr('data-number');
	            return parseInt( number, 10 );
	          },
	          alphabetical: function( $elem ) {
	            var name = $elem.find('h3'),
	            itemText = name.length ? name : $elem;
	            return itemText.text();
	          },
	          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
	          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
	        } 
	        
        });
	     	if(remember == "yes") {
	     		storePrefs("categories",categories);
	     	}
	     	return false;
      });
      
      //Resorting content when a category is clicked
      $('.categoriesSort a').click(function() {
      	console.log(filteroptions);
      
      	$(".categoriesSort a").removeClass("selected");
      	$(this).addClass("selected");
      	
      	var cat = $(this).attr('data-cat');
      	
      	sortoptions = cat;
      	$container.isotope({ 
      		filter: filteroptions,
      		sortBy: cat,
	        getSortData: {
	          number: function( $elem ) {
	            var number = $elem.hasClass('newsItem') ? 
	              $elem.find('.number').text() :
	              $elem.attr('data-number');
	            return parseInt( number, 10 );
	          },
	          alphabetical: function( $elem ) {
	            var name = $elem.find('h3'),
	            itemText = name.length ? name : $elem;
	            return itemText.text();
	          },
	          chronological: function( $elem ) {
            var number = $elem.find('.hiddendate').text();
            return parseInt( number );
          },
	          grouped: function( $elem ) {
            var groupname = $elem.find('.hiddengroup').text();
            return groupname;
          }
	        } 
        });
        
        if(remember == "yes") {
	     		storePrefs("sortCat",cat);
	     	}
        return false;
      });
      
      //Browser test to see if html5 local storage is supported
      function supports_html5_storage() {
		  try {
		    return 'localStorage' in window && window['localStorage'] !== null;
		  } catch (e) {
		    return false;
		  }
	}
      
      //Remember Setting event listener
     $('.remembersettings').click(function() {
     	
	     var r = $(this).attr("data-rem");
	     if(r == "yes") {
		     $(this).removeClass("selected");
		     $(this).attr("data-rem", "no");
		     remember = "no";
	     } else {
		      $(this).addClass("selected");
		     $(this).attr("data-rem", "yes");
		     remember = "yes";
	     }
	     
	     return false;
	  });
	     
     //Previous event listener for the hide and show options menu.  ** Deprecated ** 
	 $('.catOptions').click(function() {
	     	$(this).next().toggle();
	     	
	     	return false;
	     });
	     
	   		
		//Search input field functionality
		$("#s").attr("autocomplete","off");
		
		$("#s").keydown(function(event) {
			
			

			if(event.keyCode == 40) {
			event.preventDefault();
			$(".filtered .visible").first().find('a').focus();
			$(".filtered .visible").first().addClass("focused");				
				
			}
		});
		
		
		//Auto Complete Functionality
		
		$(".filtered li").keydown(function(event) {
			
			if(event.keyCode == 38) {
						event.preventDefault();
				
						
				
												
						num = parseInt($(".filtered .focused").attr("data-counted")) - 1;
						
						$(".filtered .visible").each(function(index) {
							
							if($(this).attr("data-counted") == num) {
								
								$(this).find('a').focus();
								$(".filtered .focused").removeClass("focused");
								$(this).addClass("focused");
								//num = parseInt($(this).attr("data-counted")) + 1;
								return false;
							}
						});
						
				
				
				
				
				
			}
		
			
			
			if(event.keyCode == 40) {
						event.preventDefault();
				
						
				
						
						
						num = parseInt($(".filtered .focused").attr("data-counted")) + 1;
						
						$(".filtered .visible").each(function(index) {
							
							if($(this).attr("data-counted") == num) {
								
								
								$(this).find('a').focus();
								$(".filtered .focused").removeClass("focused");
								$(this).addClass("focused");
								//num = parseInt($(this).attr("data-counted")) + 1;
								return false;
							}
						});
						
				
				
				
				
				
			}
		});
		
		
		//Beta loading spinner - currently set to only appear in Chrome Browser
		if(BrowserDetect.browser != "Chrome") {
		
			$(".loadingSpinner").hide();
			
			
		
		} else {
			$(".loadingSpinner").hide();
			
			$(".newsItem .previousa .highlight").click(function () {
				
				$(this).addClass('loading');
				$(this).find('.loadingSpinner').show();
			});
		}
		
		var peoplecount = 0;		
		
		//Regular Expression Search Filter Auto Complete
		$("#s").keyup(function () {
			var filter = $(this).val(), count = 0;
			$("#cals_uwds-q").attr("value",filter);
			
			
			$.ajax({ 
                  
                    url: 'http://www.wisc.edu/directories/json/?jsonp=?',
                    type: 'GET',
                    dataType: 'json',
                    data: {name: $(this).val(), division: 'COLLEGE OF AGRICULTURAL & LIFE SCIENCES'},
                    success:  function(data, textStatus, XMLHttpRequest) {
                                var output ='';
                                if (data !== null){
                                    if(data["count"]==0){
                                        if(data["errors"][0]){
                                            if(data["errors"][0]['code']==4){
                                                //Too many results
                                                output = '';									
                                            }
                                        } else {
                                            output = '';
                                        }
                                    } else {
                                    	peoplecount = data['count'];
                                        
                                        output+='<ul>';
                                        $.each(data["records"], function(index, record){
                                                                    for(j=0;j<record['titles'].length;j++){
                                                                        if(record["titles"][j]["division"]=="COLLEGE OF AGRICULTURAL & LIFE SCIENCES"){
                                                                        
                                                                        
                                                                        output+=
                                                                                '<li class=""><a href="http://www.wisc.edu/directories/person.php?name=' + record['fullName'] + '" target="_blank">' +
                                                                                    '<div class="person_name"><strong>'
                                                                                        + record['fullName'] + 
                                                                                    '</strong></div>';
                                                                                    
                                                                        if (record['emails'][0]!=""){
                                                                            output+='<div class="person_email">' +
                                                                                        '' + record['emails'][0] + '' +
                                                                                    '</div>';
                                                                        }
                                                                        
                                                                        if(record['phones'][0]!=""){
                                                                            output+='<div class="person_phone">' 
                                                                                        + record['phones'][0] +
                                                                                    '</div>';
                                                                        }
    
                                                                       /* if(record["titles"][j]["title"]){
                                                                            output+='<div class="person_title"><strong>Title: </strong>'
                                                                                        + record["titles"][j]["title"] +
                                                                                    '</div>';
                                                                        }
                                                                        
                                                                        if(record["titles"][j]["department"]){
                                                                            output+='<div class="person_department"><strong>Dept: </strong>'
                                                                                        + record["titles"][j]["department"] +
                                                                                    '</div>';
                                                                        }*/
                                                                        
                                                                        
                                                                            output+='</a>' +
                                                                                '</li>';
                                                                        }
                                                                    }
                                                                        
                                                                });
                                        
                                        output+="</ul>";
                                            
                                }
                                
    
                                }
                                
                                $("#cals_uwds_search_results").html(output);
                                $(".filtered .directory").html(output);
                                //console.log(XMLHttpRequest);	
                              
                              },
                    error: function(){ 
                            $("#cals_uwds_search_results").html('Data could not be retrieved.');
                            
                            }
                });



				
						
			
			
			
			var resultscounted = 0;
			if(filter == "boredom") {
			       eegg();
		    }
		            
			$(".filtered:first li").each(function () {
				
			
		        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
		        	$(this).addClass("hidden"); 
		        	$(this).removeClass("visible"); 
			       
			        
		        } else {
				
					
					
					//$(".cleartrigger").fadeIn(300);
				/*$('.instructions').fadeOut('fast', function() {
		        		// Animation complete
					
		     		 });*/
				
		            $(this).removeClass("hidden");
		            $(this).addClass("visible");
		            
		            $(".filtered .visible").each(function(index) {
					$(this).attr("data-counted",resultscounted);
					resultscounted = resultscounted + 1;
					
					
					});
		            
		            count++;
		           
		            
		        }
		    });
		    
		    
		  /* $(".filtered li.visible").each(function () {
		    	//console.log('ran');
		    		$(this).addClass("checking");
		    		var currentobj = $(this);
		    		var currenttextobj = $(this).text();
		    		
		    		//var nexttextobj = $(this).next("li.visible").text();
		    		$(".filtered li.visible").not($(".checking")).each(function () {
			    		var nexttextobj = $(this).text();
			    		if(currenttextobj == nexttextobj) {
				    		//console.log(currenttextobj +" "+ nexttextobj);
				    		$(this).addClass("duplicate");
				    		currentobj.removeClass("checking");
			    		}
		    		});
		    		
	
		    });*/
		    
		   
		    
		    $("#filter-count").text(count+peoplecount);
		    
		    if((count + peoplecount) > 0) {
			            $(".filtered").show();
			            $("#s").addClass("notEmpty");
			            //$(".searchClear").show();
		            } else {
		            $("#s").removeClass("notEmpty");
			            $(".filtered").stop().fadeOut(300);
			            
		            }
		          if(filter.length > 0) {
			        $(".searchClear").show();
		        }  else {
			        $(".searchClear").hide();
		        }
		            
    	});
    	
    	 var seen = {};
			$('.filtered li').each(function() {
			    var txt = $(this).text();
			    if (seen[txt])
			        $(this).remove();
			    else
			        seen[txt] = true;
			});
    	
    	
    	//Check for search complete to be ignored and hide
    	//setInterval(function() {
    		
			var v = $("#s").val();
			if(v != "") {
			
				var filter = $("#s").val(), count = 0;
				var resultscounted = 0;
			if(filter == "boredom") {
			       eegg();
		    }
		            
			$(".filtered:first li").each(function () {
		        if ($(this).text().search(new RegExp(filter, "i")) < 0) {$(this).addClass("hidden"); $(this).removeClass("visible"); 
			       
			        
		        } else {
				
					
					
					//$(".cleartrigger").fadeIn(300);
				/*$('.instructions').fadeOut('fast', function() {
		        		// Animation complete
					
		     		 });*/
		     		 
		     		 
				
		            $(this).removeClass("hidden");
		            $(this).addClass("visible");
		            
		            $(".filtered .visible").each(function(index) {
					$(this).attr("data-counted",resultscounted);
					resultscounted = resultscounted + 1;
					
					
					});
		            
		            count++;
		           
		            
		        }
		    });
		    $("#filter-count").text(count);
		    if(count > 0) {
		    		$("#s").addClass("notEmpty");
			            $(".filtered").show();
			            //$(".searchClear").show();
		            } else {
		            	$("#s").removeClass("notEmpty");
			            $(".filtered").stop().fadeOut(300);
			            
			            
		            }
		         if(filter.length > 0) {
			        $(".searchClear").show();
		        }  else {
			        $(".searchClear").hide();
		        }
			}
			
			
			 
    	
		//},1000);
    	
    	//take action upon user leaving the search input field
    	$("#s").blur(function () {
    		var v = $(this).attr("value");
    		
    		if(v == "") {
	    		$(".filtered").fadeOut(300);
	    		$(".searchClear").hide();
	    		//$(".cleartrigger").fadeOut(300);
	    		
	    	}
	    });
	    
	    //Clear the search results and hide suggested searches
	    $(".searchClear").click(function() {
		   	 $("#s").attr("value","");
		   	 $("#s").removeClass("notEmpty");
		   	 $(".filtered").fadeOut(300);
	    		$(".searchClear").hide();
	    		
	    		return false;
	    });
		
		//Easter Egg - Type "boredom" into search to activate
		var eeggused = "no";
		function eegg() {
			if(eeggused == "no") {
			eeggused = "yes";
			var KICKASSVERSION='2.0';
			var s = document.createElement('script'); 
			s.type='text/javascript'; 
			document.body.appendChild(s); 
			s.src='//hi.kickassapp.com/kickass.js';
			void(0);
			}
		}
		
		
		
		
		//Mobile Helper Functions
		(function(document){

	window.MBP = window.MBP || {}; 
	
	// Fix for iPhone viewport scale bug 
	// http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
	
	MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
	MBP.ua = navigator.userAgent;
	
	MBP.scaleFix = function () {
	  if (MBP.viewportmeta && /iPhone|iPad/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
	    MBP.viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
	    document.addEventListener("gesturestart", MBP.gestureStart, false);
	  }
	};
	MBP.gestureStart = function () {
	    MBP.viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
	};
	
	
	// Hide URL Bar for iOS and Android by Scott Jehl
	// https://gist.github.com/1183357
	
	MBP.hideUrlBar = function () {
		var win = window,
			doc = win.document;
	
		// If there's a hash, or addEventListener is undefined, stop here
		if( !location.hash || !win.addEventListener ){
	
			//scroll to 1
			window.scrollTo( 0, 1 );
			var scrollTop = 1,
	
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );
	
			win.addEventListener( "load", function(){
				setTimeout(function(){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}, 0);
			}, false );
		}
	};
	
	
	// Fast Buttons - read wiki below before using
	// https://github.com/shichuan/mobile-html5-boilerplate/wiki/JavaScript-Helper
	
	MBP.fastButton = function (element, handler) {
	    this.element = element;
	    this.handler = handler;
	    if (element.addEventListener) {
	      element.addEventListener('touchstart', this, false);
	      element.addEventListener('click', this, false);
	    }
	};
	
	MBP.fastButton.prototype.handleEvent = function(event) {
	    switch (event.type) {
	        case 'touchstart': this.onTouchStart(event); break;
	        case 'touchmove': this.onTouchMove(event); break;
	        case 'touchend': this.onClick(event); break;
	        case 'click': this.onClick(event); break;
	    }
	};
	
	MBP.fastButton.prototype.onTouchStart = function(event) {
	    event.stopPropagation();
	    this.element.addEventListener('touchend', this, false);
	    document.body.addEventListener('touchmove', this, false);
	    this.startX = event.touches[0].clientX;
	    this.startY = event.touches[0].clientY;
	    this.element.style.backgroundColor = "rgba(0,0,0,.7)";
	};
	
	MBP.fastButton.prototype.onTouchMove = function(event) {
	    if(Math.abs(event.touches[0].clientX - this.startX) > 10 || 
	       Math.abs(event.touches[0].clientY - this.startY) > 10    ) {
	        this.reset();
	    }
	};
	
	MBP.fastButton.prototype.onClick = function(event) {
	    event.stopPropagation();
	    this.reset();
	    this.handler(event);
	    if(event.type == 'touchend') {
	        MBP.preventGhostClick(this.startX, this.startY);
	    }
	    this.element.style.backgroundColor = "";
	};
	
	MBP.fastButton.prototype.reset = function() {
	    this.element.removeEventListener('touchend', this, false);
	    document.body.removeEventListener('touchmove', this, false);
	    this.element.style.backgroundColor = "";
	};
	
	MBP.preventGhostClick = function (x, y) {
	    MBP.coords.push(x, y);
	    window.setTimeout(function (){
	        MBP.coords.splice(0, 2);
	    }, 2500);
	};
	
	MBP.ghostClickHandler = function (event) {
	    for(var i = 0, len = MBP.coords.length; i < len; i += 2) {
	        var x = MBP.coords[i];
	        var y = MBP.coords[i + 1];
	        if(Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
	            event.stopPropagation();
	            event.preventDefault();
	        }
	    }
	};
	
	if (document.addEventListener) {
	    document.addEventListener('click', MBP.ghostClickHandler, true);
	}
	                            
	MBP.coords = [];
	
	
	// iOS Startup Image
	// https://github.com/shichuan/mobile-html5-boilerplate/issues#issue/2
	
	MBP.splash = function () {
	    var filename = navigator.platform === 'iPad' ? 'h/' : 'l/';
	    document.write('<link rel="apple-touch-startup-image" href="/img/' + filename + 'splash.png" />' );
	};
	
	
	// Autogrow
	// http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html
	
	MBP.autogrow = function (element, lh) {
	
	    function handler(e){
	        var newHeight = this.scrollHeight,
	            currentHeight = this.clientHeight;
	        if (newHeight > currentHeight) {
	            this.style.height = newHeight + 3 * textLineHeight + "px";
	        }
	    }
	
	    var setLineHeight = (lh) ? lh : 12,
	        textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : 
	                         getComputedStyle(element, null).lineHeight;
	
	    textLineHeight = (textLineHeight.indexOf("px") == -1) ? setLineHeight :
	                     parseInt(textLineHeight, 10);
	
	    element.style.overflow = "hidden";
	    element.addEventListener ? element.addEventListener('keyup', handler, false) :
	                               element.attachEvent('onkeyup', handler);
	};
	
})(document);
		MBP.hideUrlBar();
	
	
		//Determine if the user is using iOS5 or iOS6
		var ua = navigator.userAgent;
		var isiOS5 = /iPhone OS 5/i.test(ua);
		var isiOS6 = /iPhone OS 6/i.test(ua);


		//Solve mobile web app scrolling bug that moves the header and footer during springback
		if(isiOS5 || isiOS6) {
		document.body.addEventListener('touchstart', function(event){
		var obj=document.getElementsByTagName("div");
			var i = 0;
			for (i=0;i<=obj.length;i++)
			{
				var mainid = obj[i].className;
				if(mainid == "mobileScroll") {
					
					var scroll = obj[i].scrollTop;
					var windowsize = window.innerHeight;
					var combine = scroll + windowsize;

					

					if(obj[i].scrollTop <= 0) {
						obj[i].scrollTop = 1;
						
					}

					if(combine == obj[i].scrollHeight || combine > obj[i].scrollHeight) {
						
						obj[i].scrollTop = obj[i].scrollTop-1;
					}
					break;
				}
				
			}
	}, false);
	} else {
			//not iOS5 or iOS6
		}

		//If you are an admin you can press esc to edit a page on any single content page.
		if($('.post-edit-link').html()) {
		
	$(document).keyup(function(event) {
			
			

			if(event.keyCode == 27) {
			event.preventDefault();
			var url = $('.post-edit-link').first().attr("href");	
			window.location = url;			
				
			}
		});
	}
});

 window.googleLT_||(window.googleLT_=(new Date).getTime()),window.google||(window.google={}),window.google.loader||(window.google.loader={},google.loader.ServiceBase="http://www.google.com/uds",google.loader.GoogleApisBase="http://ajax.googleapis.com/ajax",google.loader.ApiKey="notsupplied",google.loader.KeyVerified=!0,google.loader.LoadFailure=!1,google.loader.Secure=!1,google.loader.GoogleLocale="www.google.com",google.loader.ClientLocation=null,google.loader.AdditionalParams="",function(){function e(e,s){return e.load=s}function s(e){return e in H?H[e]:H[e]=-1!=navigator.userAgent[C]()[v](e)}function o(e,s){var o=function(){};o.prototype=s[S],e.U=s[S],e.prototype=new o}function r(e,s){var o=Array[S].slice.call(arguments,2)||[];return function(){var r=o.concat(Array[S].slice.call(arguments));return e.apply(s,r)}}function n(e){return e=Error(e),e.toString=function(){return this.message},e}function d(e,s){for(var o=e.split(/\./),r=f,n=0;n<o[x]-1;n++)r[o[n]]||(r[o[n]]={}),r=r[o[n]];r[o[o[x]-1]]=s}function t(e,s,o){e[s]=o}function i(e,s,o){if(e.addEventListener)e.addEventListener(s,o,!1);else if(e.attachEvent)e.attachEvent("on"+s,o);else{var r=e["on"+s];e["on"+s]=null!=r?c([o,r]):o}}function c(e){return function(){for(var s=0;s<e[x];s++)e[s]()}}function a(){V[b.readyState]?u():0<T[x]&&f[I](a,10)}function u(){for(var e=0;e<T[x];e++)T[e]();T.length=0}function p(e){this.b=e,this.o=[],this.n={},this.e={},this.f={},this.j=!0,this.c=-1}function l(e){this.F=e,this.q={},this.r=0}function m(e,s,o){this.name=e,this.D=s,this.p=o,this.u=this.h=!1,this.k=[],google[A].v[this[k]]=r(this.l,this)}function j(e,s){this.b=e,this.i=s,this.h=!1}var g=encodeURIComponent,f=window,b=document,y="push",h="replace",w="charAt",v="indexOf",q="ServiceBase",k="name",_="getTime",x="length",S="prototype",I="setTimeout",A="loader",L="substring",E="join",C="toLowerCase",H={};if(!J)var J=d;if(!M)var M=t;google[A].v={},J("google.loader.callbacks",google[A].v);var D={},F={};google[A].eval={},J("google.loader.eval",google[A].eval),e(google,function(e,s,o){function r(e){var s=e.split(".");if(2<s[x])throw n("Module: '"+e+"' not found!");"undefined"!=typeof s[1]&&(d=s[0],o.packages=o.packages||[],o.packages[y](s[1]))}var d=e;if(o=o||{},e instanceof Array||e&&"object"==typeof e&&"function"==typeof e[E]&&"function"==typeof e.reverse)for(var t=0;t<e[x];t++)r(e[t]);else r(e);if(!(e=D[":"+d]))throw n("Module: '"+d+"' not found!");if(o&&!o.language&&o.locale&&(o.language=o.locale),o&&"string"==typeof o.callback&&(t=o.callback,t.match(/^[[\]A-Za-z0-9._]+$/)&&(t=f.eval(t),o.callback=t)),(t=o&&null!=o.callback)&&!e.s(s))throw n("Module: '"+d+"' must be loaded before DOM onLoad!");t?e.m(s,o)?f[I](o.callback,0):e.load(s,o):e.m(s,o)||e.load(s,o)}),J("google.load",google.load),google.T=function(e,o){o?(0==T[x]&&(i(f,"load",u),!s("msie")&&!s("safari")&&!s("konqueror")&&s("mozilla")||f.opera?f.addEventListener("DOMContentLoaded",u,!1):s("msie")?b.write("<script defer onreadystatechange='google.loader.domReady()' src=//:></script>"):(s("safari")||s("konqueror"))&&f[I](a,10)),T[y](e)):i(f,"load",e)},J("google.setOnLoadCallback",google.T);var T=[];google[A].P=function(){var e=f.event.srcElement;"complete"==e.readyState&&(e.onreadystatechange=null,e.parentNode.removeChild(e),u())},J("google.loader.domReady",google[A].P);var V={loaded:!0,complete:!0};google[A].d=function(e,s,o){if(o){var r;"script"==e?(r=b.createElement("script"),r.type="text/javascript",r.src=s):"css"==e&&(r=b.createElement("link"),r.type="text/css",r.href=s,r.rel="stylesheet"),(e=b.getElementsByTagName("head")[0])||(e=b.body.parentNode.appendChild(b.createElement("head"))),e.appendChild(r)}else"script"==e?b.write('<script src="'+s+'" type="text/javascript"></script>'):"css"==e&&b.write('<link href="'+s+'" type="text/css" rel="stylesheet"></link>')},J("google.loader.writeLoadTag",google[A].d),google[A].Q=function(e){F=e},J("google.loader.rfm",google[A].Q),google[A].S=function(e){for(var s in e)"string"==typeof s&&s&&":"==s[w](0)&&!D[s]&&(D[s]=new j(s[L](1),e[s]))},J("google.loader.rpl",google[A].S),google[A].R=function(e){if((e=e.specs)&&e[x])for(var s=0;s<e[x];++s){var o=e[s];"string"==typeof o?D[":"+o]=new p(o):(o=new m(o[k],o.baseSpec,o.customSpecs),D[":"+o[k]]=o)}},J("google.loader.rm",google[A].R),google[A].loaded=function(e){D[":"+e.module].l(e)},J("google.loader.loaded",google[A].loaded),google[A].O=function(){return"qid="+((new Date)[_]().toString(16)+Math.floor(1e7*Math.random()).toString(16))},J("google.loader.createGuidArg_",google[A].O),d("google_exportSymbol",d),d("google_exportProperty",t),google[A].a={},J("google.loader.themes",google[A].a),google[A].a.I="//www.google.com/cse/style/look/bubblegum.css",M(google[A].a,"BUBBLEGUM",google[A].a.I),google[A].a.K="//www.google.com/cse/style/look/greensky.css",M(google[A].a,"GREENSKY",google[A].a.K),google[A].a.J="//www.google.com/cse/style/look/espresso.css",M(google[A].a,"ESPRESSO",google[A].a.J),google[A].a.M="//www.google.com/cse/style/look/shiny.css",M(google[A].a,"SHINY",google[A].a.M),google[A].a.L="//www.google.com/cse/style/look/minimalist.css",M(google[A].a,"MINIMALIST",google[A].a.L),google[A].a.N="//www.google.com/cse/style/look/v2/default.css",M(google[A].a,"V2_DEFAULT",google[A].a.N),p[S].g=function(e,s){var o="";if(void 0!=s&&(void 0!=s.language&&(o+="&hl="+g(s.language)),void 0!=s.nocss&&(o+="&output="+g("nocss="+s.nocss)),void 0!=s.nooldnames&&(o+="&nooldnames="+g(s.nooldnames)),void 0!=s.packages&&(o+="&packages="+g(s.packages)),null!=s.callback&&(o+="&async=2"),void 0!=s.style&&(o+="&style="+g(s.style)),void 0!=s.noexp&&(o+="&noexp=true"),void 0!=s.other_params&&(o+="&"+s.other_params)),!this.j){google[this.b]&&google[this.b].JSHash&&(o+="&sig="+g(google[this.b].JSHash));var r,n=[];for(r in this.n)":"==r[w](0)&&n[y](r[L](1));for(r in this.e)":"==r[w](0)&&this.e[r]&&n[y](r[L](1));o+="&have="+g(n[E](","))}return google[A][q]+"/?file="+this.b+"&v="+e+google[A].AdditionalParams+o},p[S].t=function(e){var s=null;e&&(s=e.packages);var o=null;if(s)if("string"==typeof s)o=[e.packages];else if(s[x])for(o=[],e=0;e<s[x];e++)"string"==typeof s[e]&&o[y](s[e][h](/^\s*|\s*$/,"")[C]());for(o||(o=["default"]),s=[],e=0;e<o[x];e++)this.n[":"+o[e]]||s[y](o[e]);return s},e(p[S],function(e,s){var o=this.t(s),r=s&&null!=s.callback;if(r)var n=new l(s.callback);for(var d=[],t=o[x]-1;t>=0;t--){var i=o[t];r&&n.B(i),this.e[":"+i]?(o.splice(t,1),r&&this.f[":"+i][y](n)):d[y](i)}if(o[x]){for(s&&s.packages&&(s.packages=o.sort()[E](",")),t=0;t<d[x];t++)i=d[t],this.f[":"+i]=[],r&&this.f[":"+i][y](n);if(s||null==F[":"+this.b]||null==F[":"+this.b].versions[":"+e]||google[A].AdditionalParams||!this.j)s&&s.autoloaded||google[A].d("script",this.g(e,s),r);else{o=F[":"+this.b],google[this.b]=google[this.b]||{};for(var c in o.properties)c&&":"==c[w](0)&&(google[this.b][c[L](1)]=o.properties[c]);google[A].d("script",google[A][q]+o.path+o.js,r),o.css&&google[A].d("css",google[A][q]+o.path+o.css,r)}for(this.j&&(this.j=!1,this.c=(new Date)[_](),1!=this.c%100&&(this.c=-1)),t=0;t<d[x];t++)i=d[t],this.e[":"+i]=!0}}),p[S].l=function(e){-1!=this.c&&(K("al_"+this.b,"jl."+((new Date)[_]()-this.c),!0),this.c=-1),this.o=this.o.concat(e.components),google[A][this.b]||(google[A][this.b]={}),google[A][this.b].packages=this.o.slice(0);for(var s=0;s<e.components[x];s++){this.n[":"+e.components[s]]=!0,this.e[":"+e.components[s]]=!1;var o=this.f[":"+e.components[s]];if(o){for(var r=0;r<o[x];r++)o[r].C(e.components[s]);delete this.f[":"+e.components[s]]}}},p[S].m=function(e,s){return 0==this.t(s)[x]},p[S].s=function(){return!0},l[S].B=function(e){this.r++,this.q[":"+e]=!0},l[S].C=function(e){this.q[":"+e]&&(this.q[":"+e]=!1,this.r--,0==this.r&&f[I](this.F,0))},o(m,p),e(m[S],function(e,s){var o=s&&null!=s.callback;o?(this.k[y](s.callback),s.callback="google.loader.callbacks."+this[k]):this.h=!0,s&&s.autoloaded||google[A].d("script",this.g(e,s),o)}),m[S].m=function(e,s){return s&&null!=s.callback?this.u:this.h},m[S].l=function(){this.u=!0;for(var e=0;e<this.k[x];e++)f[I](this.k[e],0);this.k=[]};var B=function(e,s){return e.string?g(e.string)+"="+g(s):e.regex?s[h](/(^.*$)/,e.regex):""};m[S].g=function(e,s){return this.G(this.w(e),e,s)},m[S].G=function(e,s,o){var r="";if(e.key&&(r+="&"+B(e.key,google[A].ApiKey)),e.version&&(r+="&"+B(e.version,s)),s=google[A].Secure&&e.ssl?e.ssl:e.uri,null!=o)for(var n in o)e.params[n]?r+="&"+B(e.params[n],o[n]):"other_params"==n?r+="&"+o[n]:"base_domain"==n&&(s="http://"+o[n]+e.uri[L](e.uri[v]("/",7)));return google[this[k]]={},-1==s[v]("?")&&r&&(r="?"+r[L](1)),s+r},m[S].s=function(e){return this.w(e).deferred},m[S].w=function(e){if(this.p)for(var s=0;s<this.p[x];++s){var o=this.p[s];if(RegExp(o.pattern).test(e))return o}return this.D},o(j,p),e(j[S],function(e,s){this.h=!0,google[A].d("script",this.g(e,s),!1)}),j[S].m=function(){return this.h},j[S].l=function(){},j[S].g=function(e,s){if(!this.i.versions[":"+e]){if(this.i.aliases){var o=this.i.aliases[":"+e];o&&(e=o)}if(!this.i.versions[":"+e])throw n("Module: '"+this.b+"' with version '"+e+"' not found!")}return google[A].GoogleApisBase+"/libs/"+this.b+"/"+e+"/"+this.i.versions[":"+e][s&&s.uncompressed?"uncompressed":"compressed"]},j[S].s=function(){return!1};var N=!1,O=[],G=(new Date)[_](),R=function(){N||(i(f,"unload",z),N=!0)},P=function(e,s){if(R(),!(google[A].Secure||google[A].Options&&!1!==google[A].Options.csi)){for(var o=0;o<e[x];o++)e[o]=g(e[o][C]()[h](/[^a-z0-9_.]+/g,"_"));for(o=0;o<s[x];o++)s[o]=g(s[o][C]()[h](/[^a-z0-9_.]+/g,"_"));f[I](r(U,null,"//gg.google.com/csi?s=uds&v=2&action="+e[E](",")+"&it="+s[E](",")),1e4)}},K=function(e,s,o){o?P([e],[s]):(R(),O[y]("r"+O[x]+"="+g(e+(s?"|"+s:""))),f[I](z,5<O[x]?0:15e3))},z=function(){if(O[x]){var e=google[A][q];0==e[v]("http:")&&(e=e[h](/^http:/,"https:")),U(e+"/stats?"+O[E]("&")+"&nc="+(new Date)[_]()+"_"+((new Date)[_]()-G)),O.length=0}},U=function(e){var s=new Image,o=U.H++;U.A[o]=s,s.onload=s.onerror=function(){delete U.A[o]},s.src=e,s=null};U.A={},U.H=0,d("google.loader.recordCsiStat",P),d("google.loader.recordStat",K),d("google.loader.createImageForLogging",U)}(),google.loader.rm({specs:["feeds","spreadsheets","gdata","visualization",{name:"sharing",baseSpec:{uri:"http://www.google.com/s2/sharing/js",ssl:null,key:{string:"key"},version:{string:"v"},deferred:!1,params:{language:{string:"hl"}}}},"search","orkut","ads","elements",{name:"books",baseSpec:{uri:"http://books.google.com/books/api.js",ssl:"https://encrypted.google.com/books/api.js",key:{string:"key"},version:{string:"v"},deferred:!0,params:{callback:{string:"callback"},language:{string:"hl"}}}},{name:"friendconnect",baseSpec:{uri:"http://www.google.com/friendconnect/script/friendconnect.js",ssl:null,key:{string:"key"},version:{string:"v"},deferred:!1,params:{}}},"identitytoolkit","ima",{name:"maps",baseSpec:{uri:"http://maps.google.com/maps?file=googleapi",ssl:"https://maps-api-ssl.google.com/maps?file=googleapi",key:{string:"key"},version:{string:"v"},deferred:!0,params:{callback:{regex:"callback=$1&async=2"},language:{string:"hl"}}},customSpecs:[{uri:"http://maps.googleapis.com/maps/api/js",ssl:"https://maps.googleapis.com/maps/api/js",version:{string:"v"},deferred:!0,params:{callback:{string:"callback"},language:{string:"hl"}},pattern:"^(3|3..*)$"}]},"payments","wave","annotations_v2","earth","language",{name:"annotations",baseSpec:{uri:"http://www.google.com/reviews/scripts/annotations_bootstrap.js",ssl:null,key:{string:"key"},version:{string:"v"},deferred:!0,params:{callback:{string:"callback"},language:{string:"hl"},country:{string:"gl"}}}},"picker"]}),google.loader.rfm({":search":{versions:{":1":"1",":1.0":"1"},path:"/api/search/1.0/65b21018ad4df09e3eb5a21326b72d0b/",js:"default+en.I.js",css:"default+en.css",properties:{":JSHash":"65b21018ad4df09e3eb5a21326b72d0b",":NoOldNames":!1,":Version":"1.0"}},":language":{versions:{":1":"1",":1.0":"1"},path:"/api/language/1.0/f66252f80431973fa38526a329b0a47b/",js:"default+en.I.js",properties:{":JSHash":"f66252f80431973fa38526a329b0a47b",":Version":"1.0"}},":feeds":{versions:{":1":"1",":1.0":"1"},path:"/api/feeds/1.0/975cfa817ddcf5992ebfc12a1f34c97b/",js:"default+en.I.js",css:"default+en.css",properties:{":JSHash":"975cfa817ddcf5992ebfc12a1f34c97b",":Version":"1.0"}},":spreadsheets":{versions:{":0":"1",":0.4":"1"},path:"/api/spreadsheets/0.4/87ff7219e9f8a8164006cbf28d5e911a/",js:"default.I.js",properties:{":JSHash":"87ff7219e9f8a8164006cbf28d5e911a",":Version":"0.4"}},":ima":{versions:{":3":"1",":3.0":"1"},path:"/api/ima/3.0/28a914332232c9a8ac0ae8da68b1006e/",js:"default.I.js",properties:{":JSHash":"28a914332232c9a8ac0ae8da68b1006e",":Version":"3.0"}},":wave":{versions:{":1":"1",":1.0":"1"},path:"/api/wave/1.0/3b6f7573ff78da6602dda5e09c9025bf/",js:"default.I.js",properties:{":JSHash":"3b6f7573ff78da6602dda5e09c9025bf",":Version":"1.0"}},":annotations":{versions:{":1":"1",":1.0":"1"},path:"/api/annotations/1.0/bacce7b6155a1bbadda3c05d65391b22/",js:"default+en.I.js",properties:{":JSHash":"bacce7b6155a1bbadda3c05d65391b22",":Version":"1.0"}},":earth":{versions:{":1":"1",":1.0":"1"},path:"/api/earth/1.0/109c7b2bae7fe6cc34ea875176165d81/",js:"default.I.js",properties:{":JSHash":"109c7b2bae7fe6cc34ea875176165d81",":Version":"1.0"}},":picker":{versions:{":1":"1",":1.0":"1"},path:"/api/picker/1.0/1c635e91b9d0c082c660a42091913907/",js:"default.I.js",css:"default.css",properties:{":JSHash":"1c635e91b9d0c082c660a42091913907",":Version":"1.0"}}}),google.loader.rpl({":scriptaculous":{versions:{":1.8.3":{uncompressed:"scriptaculous.js",compressed:"scriptaculous.js"},":1.9.0":{uncompressed:"scriptaculous.js",compressed:"scriptaculous.js"},":1.8.2":{uncompressed:"scriptaculous.js",compressed:"scriptaculous.js"},":1.8.1":{uncompressed:"scriptaculous.js",compressed:"scriptaculous.js"}},aliases:{":1.8":"1.8.3",":1":"1.9.0",":1.9":"1.9.0"}},":yui":{versions:{":2.6.0":{uncompressed:"build/yuiloader/yuiloader.js",compressed:"build/yuiloader/yuiloader-min.js"},":2.9.0":{uncompressed:"build/yuiloader/yuiloader.js",compressed:"build/yuiloader/yuiloader-min.js"},":2.7.0":{uncompressed:"build/yuiloader/yuiloader.js",compressed:"build/yuiloader/yuiloader-min.js"},":2.8.0r4":{uncompressed:"build/yuiloader/yuiloader.js",compressed:"build/yuiloader/yuiloader-min.js"},":2.8.2r1":{uncompressed:"build/yuiloader/yuiloader.js",compressed:"build/yuiloader/yuiloader-min.js"},":2.8.1":{uncompressed:"build/yuiloader/yuiloader.js",compressed:"build/yuiloader/yuiloader-min.js"},":3.3.0":{uncompressed:"build/yui/yui.js",compressed:"build/yui/yui-min.js"}},aliases:{":3":"3.3.0",":2":"2.9.0",":2.7":"2.7.0",":2.8.2":"2.8.2r1",":2.6":"2.6.0",":2.9":"2.9.0",":2.8":"2.8.2r1",":2.8.0":"2.8.0r4",":3.3":"3.3.0"}},":swfobject":{versions:{":2.1":{uncompressed:"swfobject_src.js",compressed:"swfobject.js"},":2.2":{uncompressed:"swfobject_src.js",compressed:"swfobject.js"}},aliases:{":2":"2.2"}},":webfont":{versions:{":1.0.28":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.27":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.29":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.12":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.13":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.14":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.15":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.10":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.11":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.2":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.1":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.0":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.6":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.19":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.5":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.18":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.4":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.17":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.3":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.16":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.9":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.21":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.22":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.25":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.26":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.23":{uncompressed:"webfont_debug.js",compressed:"webfont.js"},":1.0.24":{uncompressed:"webfont_debug.js",compressed:"webfont.js"}},aliases:{":1":"1.0.29",":1.0":"1.0.29"}},":ext-core":{versions:{":3.1.0":{uncompressed:"ext-core-debug.js",compressed:"ext-core.js"},":3.0.0":{uncompressed:"ext-core-debug.js",compressed:"ext-core.js"}},aliases:{":3":"3.1.0",":3.0":"3.0.0",":3.1":"3.1.0"}},":mootools":{versions:{":1.3.1":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.1.1":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.3.0":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.3.2":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.1.2":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.2.3":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.2.4":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.2.1":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.2.2":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.2.5":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.4.0":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.4.1":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"},":1.4.2":{uncompressed:"mootools.js",compressed:"mootools-yui-compressed.js"}},aliases:{":1":"1.1.2",":1.11":"1.1.1",":1.4":"1.4.2",":1.3":"1.3.2",":1.2":"1.2.5",":1.1":"1.1.2"}},":jqueryui":{versions:{":1.8.0":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.2":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.1":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.15":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.14":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.13":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.12":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.11":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.10":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.17":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.16":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.6.0":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.9":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.7":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.8":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.7.2":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.5":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.7.3":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.6":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.7.0":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.7.1":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.8.4":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.5.3":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"},":1.5.2":{uncompressed:"jquery-ui.js",compressed:"jquery-ui.min.js"}},aliases:{":1.8":"1.8.17",":1.7":"1.7.3",":1.6":"1.6.0",":1":"1.8.17",":1.5":"1.5.3",":1.8.3":"1.8.4"}},":chrome-frame":{versions:{":1.0.2":{uncompressed:"CFInstall.js",compressed:"CFInstall.min.js"},":1.0.1":{uncompressed:"CFInstall.js",compressed:"CFInstall.min.js"},":1.0.0":{uncompressed:"CFInstall.js",compressed:"CFInstall.min.js"}},aliases:{":1":"1.0.2",":1.0":"1.0.2"}},":dojo":{versions:{":1.3.1":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.3.0":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.6.1":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.1.1":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.3.2":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.6.0":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.2.3":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.7.2":{uncompressed:"dojo/dojo.js.uncompressed.js",compressed:"dojo/dojo.js"},":1.7.0":{uncompressed:"dojo/dojo.js.uncompressed.js",compressed:"dojo/dojo.js"},":1.7.1":{uncompressed:"dojo/dojo.js.uncompressed.js",compressed:"dojo/dojo.js"},":1.4.3":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.5.1":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.5.0":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.2.0":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.4.0":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"},":1.4.1":{uncompressed:"dojo/dojo.xd.js.uncompressed.js",compressed:"dojo/dojo.xd.js"}},aliases:{":1.7":"1.7.2",":1":"1.6.1",":1.6":"1.6.1",":1.5":"1.5.1",":1.4":"1.4.3",":1.3":"1.3.2",":1.2":"1.2.3",":1.1":"1.1.1"}},":prototype":{versions:{":1.7.0.0":{uncompressed:"prototype.js",compressed:"prototype.js"},":1.6.0.2":{uncompressed:"prototype.js",compressed:"prototype.js"},":1.6.1.0":{uncompressed:"prototype.js",compressed:"prototype.js"},":1.6.0.3":{uncompressed:"prototype.js",compressed:"prototype.js"}},aliases:{":1.7":"1.7.0.0",":1.6.1":"1.6.1.0",":1":"1.7.0.0",":1.6":"1.6.1.0",":1.7.0":"1.7.0.0",":1.6.0":"1.6.0.3"}},":jquery":{versions:{":1.6.2":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.3.1":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.6.1":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.3.0":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.6.4":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.6.3":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.3.2":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.6.0":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.2.3":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.7.0":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.7.1":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.2.6":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.4.3":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.4.4":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.5.1":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.5.0":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.4.0":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.5.2":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.4.1":{uncompressed:"jquery.js",compressed:"jquery.min.js"},":1.4.2":{uncompressed:"jquery.js",compressed:"jquery.min.js"}},aliases:{":1.7":"1.7.1",":1.6":"1.6.4",":1":"1.7.1",":1.5":"1.5.2",":1.4":"1.4.4",":1.3":"1.3.2",":1.2":"1.2.6"}}})); $(document).ready(function(){
		var count = 1;
	
		$( ".slideImage" ).each(function( index ) {
				
				var orightml = $(this).css("background-image");
				$(this).find(".slideBlurImage").css("background-image",orightml);
				$(this).find(".headerbgBlurImage").css("background-image",orightml);	
				
  		});
  		
  		 //setTimeout(function() {
	   $(".headershade").addClass("fadeOut");
	   //},1500);
	   
	   setTimeout(function() {
	   $(".headershade").hide();
	   },3000);
	
	
	var p1 = $( ".slideBlur" );
	var offset1 = p1.offset();
	var offsetPosition1 = "0px -" + offset1.top + "px";
	
	var p2 = $( ".headerbgBlur" );
	var offset2 = p2.offset();
	
	
	var p3 = $( ".headeroverlay" );
	var offset3 = p3.offset();
	
	
	var offsetPosition2 = "-"+offset3.left+"px -" + offset2.top + "px";
	

	$(".slideBlurImage").css("background-position",offsetPosition1);
	$(".headerbgBlurImage").css("background-position",offsetPosition2);
	//$(".headerbgBlurImage").css("background-position",offsetPosition2);
	
	/*$('.slideBlur').blurjs({
		 
		radius:30
	});*/
	
	
	
	
}); $( document ).ready(function() {
//alert("testing");

/*if (typeof jQuery.ui !=='undefined'){
	alert("JQuery UI loaded");
}else{
	alert("No jquery UI");
}*/

// Fix the height of the main div based upon the number of rows in the Main navigation. Supports up to 3 rows.
var headeroverlay_hght = function (){
	var currnt_ho_hght = (parseInt($("div.headeroverlay").css("height")));
	if( currnt_ho_hght>40 && currnt_ho_hght <= 80){
		$("div#main").css("padding-top",40);
	}else if(currnt_ho_hght>80 && currnt_ho_hght <=120){
		$("div#main").css("padding-top",80);
	}else if(currnt_ho_hght>120 && currnt_ho_hght < 160){
		$("div#main").css("padding-top",120);
	};
};

/*var SoilsExtAutoComplete = function(){
	$('#wcmc-ajax').autocomplete({
		source:availableTags
	});

}; */

//turn off the autocomplete in these form fields
$("#s, #autocomplete1, #yearAuthorField").attr("autocomplete","off");



headeroverlay_hght();

}); 