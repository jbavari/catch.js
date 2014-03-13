// var InterceptionObject = function() {
//     return {
//         log: function(message) {
//             console.log(message);
//         },
//         changePage: function(page) {
//             return;
//         },
//         argLengthOfFunction: function() {
//             return arguments.length;
//         },
//         method: function() {
//             this.methToCall();
//         },
//         methodWithParam: function(param) {
//             this.methToCall(param);
//         },
//         methodWithParameters: function(param1, param2) {
//             this.methToCall(param1, param2);
//         },
//         func: function() {
//             return true;
//         },
//         funcWithParam: function(param) {
//             return param;
//         },
//         funcWithParameters: function(param1, param2) {
//             return param1 + " " + param2;
//         },
//         funcThatCallsAnotherFunc: function(param) {
//             return app.funcWithParameters(param, param);
//         },
//         errorFunc: function() {
//             Some.property().That.Couldnt().Exist();
//             return function(){return null;}().thisWillFail();
//         },
//         errorThrownFunc: function() {
//             throw new Error("Something went bonkers");
//         }
//     };
// };

// describe('RaiseMore application', function() {
//     describe('Interception tests', function() {
//         var errorManager = null;
//         var interceptor = null;

//         beforeEach(function(){ 
//             //At each test, we create a new 'app'' object like we have in the 
//             //existing cordova application.
//             interceptor = new InterceptionObject();
//             app = interceptor;
//             errorManager = new ErrorHandler(app);
//         });

//         afterEach(function(){
//         });

//         it('Basic interception occurs', function() {
//             //Set up interception - ensure all methods are intercepted (return true)
//             //and pass in handler to do a call to original function.
//             Ajaxpect.addAround(interceptor, function() { return true; }, function(args, orig, ajaxpect) { return orig(); });
//             expect(interceptor.func()).toBe(true);
//         });

//         it('Interception of parameters is called', function() {
//             Ajaxpect.addAround(interceptor, function() { return true; }, function(args, orig, ajaxpect) { return orig(args[0], args[1], args[2], args[3]); });
//             expect(interceptor.argLengthOfFunction("Josh", "Luke", "Rob", "Derek")).toBe(4);

//         });

//         it('Interception of ErrorHandler catches an exception thrown', function() {

//             spyOn(errorManager, 'interceptTryCatch');

//             Ajaxpect.addAround(app, errorManager.interceptionMethods, errorManager.interceptTryCatch);
//             app.errorFunc();
//             expect(errorManager.interceptTryCatch).toHaveBeenCalled();
//         });

//         it('Interception of ErrorHandler catches an exception and sends to the server', function() {
            
//             spyOn(errorManager, 'sendErrorToServer');

//             Ajaxpect.addAround(app, errorManager.interceptionMethods, errorManager.interceptTryCatch);
//             app.errorFunc();
//             expect(errorManager.sendErrorToServer).toHaveBeenCalled();
//         });

//         it('Interception of ErrorHandler allows passing through of a variable a function with interception', function() {

//             spyOn(errorManager, 'sendErrorToServer');


//             Ajaxpect.addAround(app, errorManager.interceptionMethods, errorManager.interceptTryCatch);
//             var result = app.funcWithParameters("Josh", "Luke");
//             expect(result).toBe("Josh Luke");
//         });

//         it('Interception of ErrorHandler catches an Error object and sends to the server', function(){
//             spyOn(errorManager, 'sendErrorToServer');

//             Ajaxpect.addAround(app, errorManager.interceptionMethods, errorManager.interceptTryCatch);
//             var result = app.errorThrownFunc();
//             expect(errorManager.sendErrorToServer).toHaveBeenCalled();
//         });

//         it('Interception of ErrorHandler allows functions to return values from other functions', function(){
//             // spyOn(errorManager, 'interceptTryCatch');
//             Ajaxpect.addAround(app, errorManager.interceptionMethods, errorManager.interceptTryCatch);
//             var returnVal = app.funcThatCallsAnotherFunc("Josh");
//             expect(returnVal).toBe("Josh Josh");
//         });
//     });
// });//Closes describe Raisemore Application
