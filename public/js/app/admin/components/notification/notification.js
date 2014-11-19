import 'can/'
import 'can/map/define/'
import 'can/map/delegate/'
import appState from 'appState'

import 'swal'

appState.delegate('notification', 'set', function() {		
	var state = appState.attr('notification'),
		success = state.status === 'success';

	swal({
		title: success ? "ОК!" : "Упс!",
		text: state.msg,
		type: success ? 'success' : 'error',
		allowOutsideClick: true
	});

});
