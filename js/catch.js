/*
 * Catch.js
 * By Josh Bavari - 1-22-2014
 * 
 * Inspired by Ajaxpect 0.9.0
 * http://code.google.com/p/ajaxpect
 */
(function(){

	var Catch = function() {
		this.previousErrors = [];
	};

	Catch.prototype.on = function(wrap, methodMatchFunction) {
		if(arguments.length == 0) {
			return;
		}

		if(arguments.length == 1) {
			//They only passed the object to wrap. We will wrap all methods.
			Ajaxpect.addAround(wrap, function() { return true; }, this.interceptTryCatch);
		}
	};

	Catch.prototype.interceptTryCatch = function tryCatchInterception(args, orig, ajaxpect) {
		var callingFunctionName = "Anonymous";
		var callerFunctionName = "Anonymous";

		if(orig.name) {
			callingFunctionName = orig.name;
		}
		if(args.callee && args.callee.caller && args.callee.caller.name) {
			callerFunctionName = args.callee.caller.name;
		}

		try {
			//app.log("Interception occuring - function being called: " + callingFunctionName + " && the caller: " + callerFunctionName);
			//app.log("Interception args count: " + args.length);

			if(args.length === 0) { 
				return orig();
			} else if(args.length === 1) {
				return orig(args[0]);
			} else if(args.length === 2) {
				return orig(args[0], args[1]);
			} else if(args.length === 3) {
				return orig(args[0], args[1], args[2]);
			} else if(args.length === 4) {
				return orig(args[0], args[1], args[2], args[3]);
			} else if(args.length === 5) {
				return orig(args[0], args[1], args[2], args[3], args[4]);
			} else if(args.length === 6) {
				return orig(args[0], args[1], args[2], args[3], args[4], args[5]);
			}
		} catch (ex) {
			// console.log(this);
			// alert(ex);
			// var errorMessage = "Error in " + callingFunctionName + " ";
			// errorMessage += ex.message + " " + ex.stack;
			// window.Catch.previousErrors.push({errorMethod: callingFunctionName, message: ex.message, stack: ex.stack });
			window.Catch.captureError(ex, callingFunctionName);
			// console.log(errorMessage);
		}
	};

	Catch.prototype.captureError = function(error, callingFunctionName) {
		window.Catch.previousErrors.push({errorMethod: callingFunctionName, message: error.message, stack: error.stack });	
	};

	Catch.prototype.windowErrorOccurred = function windowErrorOccurred(errorMsg, info, lineNum) {
		console.log("ErrorHandler - errorOccurred: " + JSON.stringify(errorMsg) + " " + info + " " + lineNum );
		
		try {
			// unused++;
		} catch(ex) {
			window.Catch.captureError(ex, '');
		}
		
		// return false;
	};

	window.Catch = new Catch();
	window.onerror = window.Catch.windowErrorOccurred;


})();