const Dispatcher = require('flux').Dispatcher;
import { CHANGE_EVENT, ActionTypes } from '../constants/AppConstants';
import EventEmitter from 'events';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';

@Inject(Dispatcher)
class NotificationsStore extends BaseStore {
	constructor(Dispatcher) {
		super(Dispatcher);

		this.listenOnAction(ActionTypes.ADD_NOTIFICATION, this._add);
		this.listenOnAction(ActionTypes.REMOVE_NOTIFICATION, this._remove);

		this._data = {};
		this._removeInterval = 4 * 1000;
	}

	_add(payload) {
		let id = Date.now()
		let { message, type } = payload.data;

		this._data[id] = {
			message: message,
			type: type || 'info',
		}

		setTimeout(() => { this._notificationActinos.remove(id) }, this._removeInterval);
	}

	_remove(payload) {
		let { id } = payload.data;

		if (this._data[id] != null) {
			delete this._data[id];
		}
	}
}