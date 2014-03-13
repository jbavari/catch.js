// function windowFailMethod() {
// 	Variable.That.Doesnt.Exist.Should.Fail();
// }

// describe('Window global functions', function() {
// 	var errorHandler = null;
//     var interceptor = null;

//     beforeEach(function(){ 
//         // Say we wanted to tell Catch to wrap all anon methods
//         // Catch.wrapGlobalFunctions();

//         // app = interceptor;
//         errorHandler = new ErrorHandler();

//     });

//     // afterEach(function(){});

// 	it('Should catch global function errors when attaching to the window object', function(){
//         spyOn(errorHandler, 'sendErrorToServer');

//         Ajaxpect.addAround(window, errorHandler.interceptionMethods, errorHandler.interceptTryCatch);

//         windowFailMethod();

//         expect(errorHandler.sendErrorToServer).toHaveBeenCalled();

//         // Ajaxpect.addAround(window, errorHandler.interceptionMethods, errorHandler.interceptTryCatch);
//         // app.errorFunc();
//         // expect(windowFailMethod).toHaveBeenCalled();
// 	});
// });