/**
 * perfTest.js
 * a simple tool to compare the performance of JavaScript code
 *
 * Copyright (c) 2018 Henrique Vianna
 * Licensed under the MIT License: https://github.com/hvianna/perfTest.js/blob/master/LICENSE
 */


/**
 * Global variables
 */
var n = 0,
	averages = [0, 0, 0],
	running = false,
	editor = [],
	editor_init;


/**
 * Reset run history
 */
function reset() {
	n = 0;
	averages = [0, 0, 0];

	for ( var i = 0; i < 3; i++ )
		document.getElementById(`function${i}_result`).innerHTML = '';
}
	

/**
 * Run the tests
 */
function do_it() {

	if ( running )
		return false;

	running = true;

	document.getElementById('start_button').value=" WAIT... ";

	n++;

	var userFunction = [];

	var outputDiv = [
			document.getElementById('function0_result'),
			document.getElementById('function1_result'),
			document.getElementById('function2_result')
	]

	var start, now, elapsed, repetitions, target, refTime, className;

	var i = 0;

	editor_init.save();
	eval( document.getElementById('initialize').value.trim() );

	editor[0].save();
	userFunction[0] = document.getElementById('function0').value.trim();

	target = 1000;
	repetitions = 0;
	start = performance.now();

	do {
		eval( userFunction[ i ] );
		repetitions++;

		now = performance.now();
		elapsed = now - start;
	}
	while ( elapsed < target );

	elapsed /= 1000;
	refTime = elapsed;
	averages[0] += repetitions;

	outputDiv[0].innerHTML = '<span class="label">Last run</span>' + repetitions + ' repetitions in <strong>' + elapsed + 's</strong>' +
							 '<span class="label">Average of ' + n + ' runs</span>' + Math.round( averages[0] / n ) + ' repetitions';

	target = repetitions;

	for ( i = 1; i < 3; i++ ) {

		editor[ i ].save();
		userFunction[ i ] = document.getElementById(`function${i}`).value.trim();

		if ( userFunction[ i ] ) {

			repetitions = 0;
			start = performance.now();

			do {
				eval( userFunction[ i ] );
				repetitions++;

				now = performance.now();
				elapsed = now - start;
			}
			while ( repetitions < target );

			elapsed /= 1000;
			averages[ i ] += elapsed / refTime - 1;

			outputDiv[ i ].innerHTML = '<span class="label">Last run</span>' + repetitions + ' repetitions in <strong>' + elapsed + 's</strong>' +
									   '<span class="label">Average of ' + n + ' runs</span>';

			ratio = parseInt( averages[ i ] / n * 10000 ) / 100;

			outputDiv[ i ].innerHTML += '<span class="' + ( className = ( ratio < 0 ? 'faster' : 'slower' ) ) + '">' + Math.abs( ratio ) + '% ' + className;
		}
	}

	running = false;

	document.getElementById('start_button').value=" RUN IT! ";

}


/**
 * Initialize
 */
function initialize() {

	editor_init = CodeMirror.fromTextArea( document.getElementById('initialize'), {
//		lineNumbers: true,
		mode: 'javascript'
	});

  	for ( var i = 0; i < 3; i++ ) {
		editor[ i ] = CodeMirror.fromTextArea( document.getElementById(`function${i}`), {
			mode: 'javascript'
		});
  	}
}

window.onload = initialize;
