require([
	'dojo/request/xhr',
	'dojo/_base/kernel',
], function(xhr, kernel) {

	var totalRequests = 500;

	function jqueryXhr(counter, jqueryTime, callback) {
		if(counter >= totalRequests) {
			return callback(jqueryTime);
		}
		var jqueryEnd;
		var jqueryStart = new Date().getTime();
		$.ajax({
			url: '/rest/' + new Date().getTime(),
			dataType: 'json'
		}).done(function(data) {
			jqueryEnd = new Date().getTime();
			jqueryXhr(counter + 1, jqueryTime + (jqueryEnd - jqueryStart), callback);
		});
	}

	function dojoXhr(counter, dojoTime, callback) {
		if(counter >= totalRequests) {
			return callback(dojoTime);
		}
		var dojoEnd;
		var dojoStart = new Date().getTime();
		xhr('/rest/' + new Date().getTime(), {
			handleAs: 'json'
		}).then(function(data) {
			dojoEnd = new Date().getTime();
			dojoXhr(counter + 1, dojoTime + (dojoEnd - dojoStart), callback);
		});		
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

		dojoXhr(0, 0, function(dojoXhrTime) {

			var dojoSpan = document.getElementById('dojo');
			dojoSpan.innerHTML = dojoXhrTime + ' ms';

			jqueryXhr(0, 0, function(jqueryXhrTime) {
				var jquerySpan = document.getElementById('jquery');
				jquerySpan.innerHTML = jqueryXhrTime + ' ms';

				var fastestSpan = document.getElementById('fastest');
				fastestSpan.innerHTML = dojoXhrTime < jqueryXhrTime ? 'Dojo' : 'jQuery';

				var percentSpan = document.getElementById('percent');
				percentSpan.innerHTML = dojoXhrTime < jqueryXhrTime ? 100 - ((dojoXhrTime / jqueryXhrTime) * 100)
																	: 100 - ((jqueryXhrTime / dojoXhrTime) * 100);
			});
		});
	})();

});