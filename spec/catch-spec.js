//Catch spec

describe('Catch.js initialization', function(){
	it('Should be defined by window.Catch', function(){
		expect(window.Catch).toBeDefined();
	});

	it('Should not be null after including', function(){
		expect(window.Catch).not.toBeNull();
	});

	it('Should have an attach method', function(){
		expect(window.Catch.on).toBeDefined();
	});

	it('Should have an array of previously held errors', function(){
		expect(window.Catch.previousErrors).toBeDefined();
	});

	it('Should an empty array of previously held errors', function(){
		expect(window.Catch.previousErrors.length).toBe(0);
	});

});

describe('Catch.js - attach', function(){
	var interceptionFactory = function(){ return { someMethod: function someMethod() { Some.Error.Will.Occur.When.Called; } }; };
	var interceptionObject = null;

	describe('Catch.js attaching to all methods', function(){

		beforeEach(function(){
			interceptionObject = new interceptionFactory();
			//Reset the errors
			window.Catch.previousErrors = [];
		});

		it('Should wrap all methods ', function(){
			window.Catch.on(interceptionObject);
			interceptionObject.someMethod();
			//This method should not have thrown an exception if it was wrapped from Catch
		});

		it('Should log the error to the previousErrors array from an array', function(){
			window.Catch.on(interceptionObject);
			interceptionObject.someMethod();
			expect(window.Catch.previousErrors.length).toBe(1);
		});

		it('Should log the error message to the previousErrors array from an array', function(){
			window.Catch.on(interceptionObject);
			interceptionObject.someMethod();
			var lastError = window.Catch.previousErrors[0];

			expect(lastError).not.toBeNull();
			expect(lastError.message).not.toBeNull();
			expect(lastError.errorMethod).not.toBeNull();
			expect(lastError.stack).not.toBeNull();
		});

		it('Should log the function causing exception', function(){
			window.Catch.on(interceptionObject);
			interceptionObject.someMethod();
			var lastError = window.Catch.previousErrors[0];

			expect(lastError).not.toBeNull();
			//Its a named function above, 'someMethod'
			expect(lastError.errorMethod).toBe('someMethod');
		});
	});

	describe('Catch.js only attaches to the methods specified', function(){
		it('Should throw an exception from method not matched', function(){
			spyOn(window.Catch, 'windowErrorOccurred');
			try{
				interceptionObject.someMethod();
			}catch(ex){
				expect(window.Catch.windowErrorOccurred).toHaveBeenCalled();
			}
			// expect(interceptionObject.someMethod).toThrow('ReferenceError');

		});
	});
});