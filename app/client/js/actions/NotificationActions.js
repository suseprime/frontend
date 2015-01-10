const Dispatcher = require('flux').Dispatcher;
import { Inject } from '../../../external/di';
import { ActionTypes } from '../constants/AppConstants';

@Inject(Dispatcher)
export class NotificationActions {
	constructor(dispatcher) {
		this._dispatcher = dispatcher;
	}

	_addNotification(message, type) {
		this._dispatcher.handleViewAction(ActionTypes.ADD_NOTIFICATION, {
			message: message,
			type: type
		});
	}

	info(message) {
		this._addNotification(message, 'info');
	}

	warn(message) {
		this._addNotification(message, 'warn');
	}

	success(message) {
		this._addNotification(message, 'success');
	}

	error(message) {
		this._addNotification(message, 'error');
	}

	remove(id) {
		this._dispatcher.handleViewAction(ActionTypes.REMOVE_NOTIFICATION, {
			id: id
		});
	}

	click(id) {
		this._dispatcher.handleViewAction(ActionTypes.CLICK_NOTIFICATION, {
			id: id
		});
	}
}