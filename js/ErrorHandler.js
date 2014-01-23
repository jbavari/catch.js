var ErrorHandler = function(app_reference){
	var self = this;
	var app = app_reference;
	self.errorQueue = [];
	self.sendingErrors = false;
	self.lastErrorQueueSendTime = null;
	self.lastQueueSendTime = null;
	
	self.onErrorCode = "RM-500";
	self.jQueryBindErrorCode = "RM-501";
	self.jsonResponseFailCode = "RM-503";
	self.socialErrorCode = "RMS-500";
	self.uploadErrorCode = "RMU-500";
	
	self.init = function() {
		window.onerror = self.errorOccurred;
		
		//Going to disable ajax reporting from jQuery - most calls that happen are 500's that we are 
		//recording server side, only to have the app record it via sendErrorToServer
		// $(document).ajaxError(self.handleAjaxError);
		// $(document).ajaxComplete(self.handleAjaxComplete);
		// self.registerJQueryBindErrorCatching();

		//Ajaxpect.addAround(app, self.interceptionMethods, self.interceptTryCatch);
	};

	self.interceptionMethods = function(name) { 
		// app.log("ErrorHandler.interceptionMethods - calling for function name: " + name);
		//Here we are guaranteed the name coming in is a function, not a property or object
		var shouldIntercept = true;

		if(name != undefined && name != null) {
			shouldIntercept = false;
		}

		switch(name) {
			case "log":
			case "alert":
			case "":
				shouldIntercept = false;
				break;
			default: 
				shouldIntercept = true;
		}
		// if(shouldIntercept) { 
		// 	app.log("It was decided, we should intercept " + name + ".");
		// } else {
		// 	app.log("It was decided we shall not intercept " + name + ".");
		// }
		return shouldIntercept;
	};

	self.interceptTryCatch = function tryCatchInterception(args, orig, ajaxpect) {
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

			if(args.length == 0) { 
				return orig();
			} else if(args.length == 1) {
				return orig(args[0]);
			} else if(args.length == 2) {
				return orig(args[0], args[1]);
			} else if(args.length == 3) {
				return orig(args[0], args[1], args[2]);
			} else if(args.length == 4) {
				return orig(args[0], args[1], args[2], args[3]);
			} else if(args.length == 5) {
				return orig(args[0], args[1], args[2], args[3], args[4]);
			} else if(args.legnth == 6) {
				return orig(args[0], args[1], args[2], args[3], args[4], args[5]);
			}
		} catch (ex) {
			// app.log("There was an error! the caller: " + callerFunctionName);
			// app.log("The error was: " + JSON.stringify(ex));
			// alert(ex);
			var errorMessage = "Error in " + callingFunctionName + " ";
			errorMessage += ex.message + " " + ex.stack;
			self.sendErrorToServer(errorMessage, "RM-500", function(){app.log("ErrorHandler - interceptTryCatch done reporting to server"); } );
			// self.reportErrorToServer(ex, orig.name, stackInfo);
		}
	},
	
	self.handleAjaxComplete = function(event, jqxhr, settings) {
		app.log("ErrorHandler - jQuery global ajaxComplete being called");
		// app.log("Event: " + JSON.stringify(event));

		
		var jsonResponse;
		var isJson = true;
		if(jqxhr.responseText != null){
			try {
				jsonResponse = JSON.parse(jqxhr.responseText);
				// app.log("ErrorHandler - json response failed to parse");
			} catch (ex) {
				// app.log("ErrorHandler - json response failed to parse");
				// app.log(jqxhr.responseText);
				isJson = false;
			}
		}
		
		if(jsonResponse != null && jsonResponse.success && jsonResponse.success == false) {
			// app.log("ErrorHandler - ajaxComplete - but false success response. Reporting");
			//Need to report error, unless server already knows about it..
			var errorMessage = "False returned. Message: " + JSON.stringify(jsonResponse);
			errorMessage += " \r\n URL: " + settings.url;
			self.sendErrorToServer(errorMessage, self.jsonResponseFailCode, null);
		}
	};
	
	self.handleAjaxError = function(event, jqxhr, settings, exception) {
		app.log("ErrorHandler - jQuery global ajaxError being called");
		//app.log("Params: event: " + JSON.stringify(event));
		app.log("jQXHR: " + JSON.stringify(jqxhr));
		app.log("settings: " + JSON.stringify(settings));
		app.log("Exception: " + JSON.stringify(exception));
		
		//jQuery error params:
		//http://ajrawson.com/display-jquery-ajax-error-information
		var errorMessage = 'Response Text: ' + jqxhr.responseText + " \r\n";
		errorMessage += 'Status: ' + jqxhr.status + " \r\n";
		errorMessage += 'Data: ' + settings.data + " \r\n";
		errorMessage += 'Url: ' + settings.url + " \r\n";
		errorMessage += 'Exception: ' + exception;
		
		self.sendErrorToServer(errorMessage, "JQA" + jqxhr.statusText, function(){app.log("ErrorHandler - jQuery ajaxError done reporting to server"); } );
	};
	
	self.registerJQueryBindErrorCatching = function() {
		//Taken from a blog to catch all errors in bind events from jQuery
		//http://blogs.cozi.com/tech/2008/04/javascript-error-tracking-why-windowonerror-is-not-enough.html
		// override jQuery.fn.bind to wrap every provided function in try/catch
		var jQueryBind = jQuery.fn.bind;
		jQuery.fn.bind = function( type, data, fn ) { 
		  if ( !fn && data && typeof data == 'function' )
		  {
		    fn = data;
		    data = null;
		  }
		  if ( fn )
		  {
		    var origFn = fn;
			// var wrappedFn = function() { ... };
			// 
			// 		should be changed to
			// 
			// 		var wrappedFn = jQuery.proxy(origFn, function () { ... });
			// 
			// 	
		    var wrappedFn = jQuery.proxy(origFn, function() { 
		      try 
		      {
		        return origFn.apply( this, arguments );
		      }
		      catch ( ex )
		      {
				var errorMessage = "jQuery bind error. Exception: " + JSON.stringify(ex);
				app.log("********");
				app.log("ErrorHandler - jquery Bind Error happened. Handling error here. ");
				app.log("********");
				self.sendErrorToServer(errorMessage, self.jQueryBindErrorCode, null);
		        // trackError( ex );
		        // re-throw ex iff error should propogate
		        // throw ex;
		       }
		     });
		     fn = wrappedFn;
		   }
		   return jQueryBind.call( this, type, data, fn );
		};
	};
	
	self.sendErrorToServer = function(errorMessage, errorCode, callBack) {

		console.log("Error Message: " + errorMessage);
		console.log("Error Code: ReferenceError");
		console.log("Error Callback: " + callBack);

		// var errorUrl = "http://localhost:3000/catchjs/error";
		// errorMessage = params[:error_message]
		//     user_id = params[:user_id]
		//     build_number = params[:build_number]
		//     error_code = params[:error_code]
		// var id = null;
		// if(app.user != null)
		// 	id = app.user.id;
		// var postData = { 
		// 					error_message: errorMessage,
		// 	 				user_id: id,
		// 					build_number: buildNumber,
		// 					error_code: errorCode
		// 				};
		// app.log("ErrorHandler - sendErrorToServer - URL: " + errorUrl + " and post data: " + JSON.stringify(postData));
		// try
		// {
		// 	$.ajax({type: 'POST',
		// 			url: errorUrl,
		// 			data: postData,
		// 			global: false,
		// 			success: function(data) { 
		// 				if ( data == false) { app.log("ErrorHandler - Failed on sending error!"); }
		// 				else {
		// 					// app.log("ErrorHandler - sendErrorToServer - completed");
		// 					if(callBack)
		// 						callBack();
		// 				}
		// 			}, 
		// 			error: function(data) {
		// 				// app.log("ErrorHandler - sendErrorToServer - failed " + JSON.stringify(data));
		// 			},
		// 			dataType: 'JSON'});
		// } catch(e){
		// 	// app.log("ErrorHandler - sendErrorToServer - failed");
		// }
	};
	
	self.errorOccurred = function(errorMsg, info, lineNum) {
		app.log("ErrorHandler - errorOccurred: " + JSON.stringify(errorMsg) + " " + info + " " + lineNum );
		self.sendErrorToServer("Window.onerror caught an error: " + errorMsg, self.onErrorCode);
		
		try {
			unused++;
		} catch(ex) {
			app.log(JSON.stringify(ex));
		}
		
		return false;
	};
	
	self.sendErrorQueueToServer = function() {
		var errorUrl = "http://localhost:3000/catch/jserror";
		var postData = { 
							error_list: self.errorQueue,
			 				user_id: app.user.id,
							build_number: buildNumber
						};
		try
		{
			$.ajax({type: 'POST',
					url: errorUrl,
					data: postData,
					success: function(data) { 
						if ( data == false) { app.log("ErrorHandler - Failed on sending error!"); }
						else {
							app.log("ErrorHandler - sendErrorQueueToServer - completed");
							self.lastQueueSendTime = new Date();
							if(callBack)
								callBack();
						}
					}, 
					error: function(data) {
						app.log("ErrorHandler - sendErrorToServer - failed " + JSON.stringify(data));
					},
					dataType: 'JSON'});
		} catch(e){
			app.log("ErrorHandler - sendErrorToServer - failed");
		}
	};
	
	self.hasErrorsToReport = function() { 
		return true;
	};
	
	self.addErrorToQueue = function(error) {
		self.errorQueue.push(error);
	};
};