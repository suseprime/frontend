const Dispatcher = require('flux').Dispatcher;
import { CHANGE_EVENT, ActionTypes } from '../constants/AppConstants';
import EventEmitter from 'events';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';
import { NotificationActions } from '../actions/NotificationActions';
import Immutable from 'immutable';

@Inject(Dispatcher, NotificationActions)
export class NotificationsStore extends BaseStore {
	constructor(Dispatcher, notificationActions) {
		super(Dispatcher);

		this._notificationActions = notificationActions;

		this.listenOnAction(ActionTypes.ADD_NOTIFICATION, this._add);
		this.listenOnAction(ActionTypes.REMOVE_NOTIFICATION, this._remove);

		this._data = Immutable.Map();
		this._removeInterval = 5 * 1000;
	}

	_add(payload) {
		let id = Date.now()
		let { message, type } = payload.data;

		this._data = this._data.set(id, Immutable.Map({
			message: message,
			type: type || 'info',
			id: id
		}));

		setTimeout(() => { this._notificationActions.remove(id) }, this._removeInterval);
	}

	_remove(payload) {
		this._data = this._data.remove(payload.data.id);
	}

	getAll() {
		return this._data;
	}

	get(id) {
		return this._data.get(id);
	}
}
