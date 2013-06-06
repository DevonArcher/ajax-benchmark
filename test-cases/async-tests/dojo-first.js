require([
	'dojo/request/xhr',
	'dojo/_base/kernel',
], function(xhr, kernel) {

	var totalRequests = 500;

	var jQueryRequests = [];
	var jQueryCounter = 0;
	function jqueryXhr(callback) {
		var jqueryTotalTimeEnd;
		var jqueryTotalTimeStart = new Date().getTime();
		for(var i = 0; i < totalRequests; i++) {
			(function(index) {
				var jqueryEnd;
				var jqueryStart = new Date().getTime();
				$.ajax({
					url: '/rest/' + new Date().getTime(),
					dataType: 'json'
				}).done(function(data) {
					jqueryEnd = new Date().getTime();
					jQueryRequests[index] = (jqueryEnd - jqueryStart);
					jqueryTotalTimeEnd = new Date().getTime();
					jQueryCounter += 1;
					if(jQueryCounter === totalRequests) {
						return callback(jqueryTotalTimeEnd - jqueryTotalTimeStart);
					}
				});				
			})(i);
		}
	}

	var dojoRequests = [];
	var dojoCounter = 0;
	function dojoXhr(callback) {
		var dojoTotalTimeEnd;
		var dojoTotalTimeStart = new Date().getTime();
		for(var k = 0; k < totalRequests; k++) {
			(function(index) {
				var dojoEnd;
				var dojoStart = new Date().getTime();
				xhr('/rest/' + new Date().getTime(), {
					handleAs: 'json'
				}).then(function(data) {
					dojoEnd = new Date().getTime();
					dojoRequests[index] = (dojoEnd - dojoStart);
					dojoTotalTimeEnd = new Date().getTime();
					dojoCounter += 1;
					if(dojoCounter === totalRequests) {
						return callback(dojoTotalTimeEnd - dojoTotalTimeStart);
					}
				});
			})(k);
		}
	}

	(function main() {
		var iterationSpan = document.getElementById('iterations');
		iterationSpan.innerHTML = totalRequests;

		var dojoVersionSpan = document.getElementById('dojoVersion');
		dojoVersionSpan.innerHTML = kernel.version.major + '.'
									+ kernel.version.minor + '.'
									+ kernel.version.patch;

		var jqueryVersionSpan = document.getElementById('jqueryVersion');
		jqueryVersionSpan.innerHTML = $().jquery;

		dojoXhr(function(dojoXhrTime) {
			var dojoSpan = document.getElementById('dojo');
			dojoSpan.innerHTML = dojoXhrTime + ' ms';

			jqueryXhr(function(jqueryXhrTime) {

				var jquerySpan = document.getElementById('jquery');
				jquerySpan.innerHTML = jqueryXhrTime + ' ms';

				var fastestSpan = document.getElementById('fastest');
				fastestSpan.innerHTML = dojoXhrTime < jqueryXhrTime ? 'Dojo' : 'jQuery';

				var percentSpan = document.getElementById('percent');
				percentSpan.innerHTML = dojoXhrTime < jqueryXhrTime ? 100 - ((dojoXhrTime / jqueryXhrTime) * 100)
																	: 100 - ((jqueryXhrTime / dojoXhrTime) * 100);

				debugger;
			});
		});
	})();

});