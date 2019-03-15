/**
 * perfTest.js
 * a simple tool to compare the performance of JavaScript code
 *
 * Copyright (c) 2018-2019 Henrique Vianna
 * Licensed under the MIT License: https://github.com/hvianna/perfTest.js/blob/master/LICENSE
 */


/**
 * Global variables
 */
var __n = 0,
	__averages = [0, 0, 0],
	__running = false,
	__editor = [],
	__editor_init;


/**
 * Reset run history
 */
function __reset() {
	__n = 0;
	__averages = [0, 0, 0];

	for ( var i = 0; i < 3; i++ )
		document.getElementById(`function${i}_result`).innerHTML = '';
}


/**
 * Run the tests
 */
function __do_it() {

	if ( __running )
		return false;

	__running = true;

	document.getElementById('start_button').value=" WAIT... ";

	__n++;

	var __userFunction = [];

	var __outputDiv = [
			document.getElementById('function0_result'),
			document.getElementById('function1_result'),
			document.getElementById('function2_result')
	]

	var __start, __now, __elapsed, __repetitions, __target, __refTime, __className;

	var __i = 0;

	__editor_init.save();
	eval( document.getElementById('initialize').value.trim() );

	__editor[0].save();
	__userFunction[0] = document.getElementById('function0').value.trim();

	__target = 1000;
	__repetitions = 0;
	__start = performance.now();

	do {
		eval( __userFunction[ __i ] );
		__repetitions++;

		__now = performance.now();
		__elapsed = __now - __start;
	}
	while ( __elapsed < __target );

	__elapsed /= 1000;
	__refTime = __elapsed;
	__averages[0] += __repetitions;

	__outputDiv[0].innerHTML = '<span class="label">Last run</span>' + __repetitions + ' repetitions in <strong>' + __elapsed + 's</strong>' +
							   '<span class="label">Average of ' + __n + ' runs</span>' + Math.round( __averages[0] / __n ) + ' repetitions';

	__target = __repetitions;

	for ( __i = 1; __i < 3; __i++ ) {

		__editor[ __i ].save();
		__userFunction[ __i ] = document.getElementById(`function${__i}`).value.trim();

		if ( __userFunction[ __i ] ) {

			__repetitions = 0;
			__start = performance.now();

			do {
				eval( __userFunction[ __i ] );
				__repetitions++;

				__now = performance.now();
				__elapsed = __now - __start;
			}
			while ( __repetitions < __target );

			__elapsed /= 1000;
			__averages[ __i ] += __elapsed / __refTime - 1;

			__outputDiv[ __i ].innerHTML = '<span class="label">Last run</span>' + __repetitions + ' repetitions in <strong>' + __elapsed + 's</strong>' +
									       '<span class="label">Average of ' + __n + ' runs</span>';

			__ratio = parseInt( __averages[ __i ] / __n * 10000 ) / 100;

			__outputDiv[ __i ].innerHTML += '<span class="' + ( __className = ( __ratio < 0 ? 'faster' : 'slower' ) ) + '">' + Math.abs( __ratio ) + '% ' + __className;
		}
	}

	__running = false;

	document.getElementById('start_button').value=" RUN IT! ";

}


/**
 * Initialize
 */
function __initialize() {

	__editor_init = CodeMirror.fromTextArea( document.getElementById('initialize'), {
//		lineNumbers: true,
		mode: 'javascript'
	});

  	for ( var i = 0; i < 3; i++ ) {
		__editor[ i ] = CodeMirror.fromTextArea( document.getElementById(`function${i}`), {
			mode: 'javascript'
		});
  	}
}

window.onload = __initialize;
