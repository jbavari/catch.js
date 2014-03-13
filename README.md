catch.js
=======

A Javascript library focused on wrapping functions in try/catch blocks to provide better error catching and reporting.

# Why

Error handling is a mess on the web. Usually you can rely on hooking into the window.onerror method, but many times, that leaves you wanting more.

I created this library to help lend a hand in the global error handling issues many web developers run into. 

My initial plan was to help set this up on Phonegap / Cordova - that way you can have better control over global errors.

## Getting Started

Catch.on( YourObject, function returnsTrueOnMethodsToCatch() {} );

<!-- Catch.init(config [, functionReturningTrueOnMethodsToCatch]); -->

```bash
$ npm install catchjs
```

### Configuration to catch any errors on the App object

```js
Catch.on( App );
```

### Configuration to catch any errors on an array of objects

```js
Catch.init( [App, $, async] );
```

### Configuration to catch any errors on the App object. 

The second parameter is a filtering function, by returning true, it matches that function to be try/catch'ed.

```js
Catch.init( App, function() { return true; } );
```

### Configuration to catch any errors on App object but only on the 'log' method

```js
Catch.init( App, function(name) { if(name === 'log') { return true; } else { return false; } } );
```

### Configuration to catch any errors on objects with filtering function

```js
Catch.init({
	join_point: App,
	point_cut: function(name) {
		switch(name){
			case "log":
			case "alert":
				return true;
		};
		//Didnt match, so we return a false
		return false;
	}
});
```