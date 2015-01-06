import EventEmitter from 'events';
import { CHANGE_EVENT, ActionTypes } from '../constants/AppConstants';
import { Dispatcher } from 'flux';

export class BaseStore extends EventEmitter {
	constructor() {
		this._dispatchToken = Dispatcher.register(this._registerEvents.bind(this));

		super();
	}

	_registerEvents(payload) {
		var action = payload.action;

		if (this._listeners[action.type]) {
			var l = this._listeners[action.type];

			Dispatcher.waitFor(l.waitFor || [])

			l.listener(action);

			if (l._listeners[action.type].notify) {
				this._notify();
			}
		} else if (this._notifiers[action.type]) {
			var n = this._notifiers[action.type]
			
			Dispatcher.waitFor(n.waitFor || []);

			this._notify();
		}
	}

	_notify() {
		this.emit(CHANGE_EVENT);
	}

	listenOnAction(name, func, notify = true, waitFor = []) {
		this._listeners[name] = { listener: func.bind(this), notify: notify, waitFor: waitFor };
	}

	unlistenOnAction(name) {
		if(this._listeners[name])
			delete this._listeners[name];
		if(this._notifiers[name])
			delete this._notifiers[name];
	}

	notifyOnAction(name, waitFor = []) {
		this._notifiers = { waitFor: waitFor };
	}


	get dispatchToken() {
		return this._dispatchToken;
	}

	hi() {
		console.log(this);
	}
}