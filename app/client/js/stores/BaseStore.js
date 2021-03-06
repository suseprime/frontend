import EventEmitter from 'events';
import { CHANGE_EVENT, ActionTypes } from '../constants/AppConstants';

export class BaseStore extends EventEmitter {
	constructor(dispatcher) {
		super();

		this._dispatcher = dispatcher;
		this._dispatchToken = dispatcher.register(this._registerEvents.bind(this));
		this._listeners = {};
		this._notifiers = {};
	}

	_registerEvents(payload) {
		var action = payload.action;

		if (this._listeners[action.type]) {
			var l = this._listeners[action.type];

			this._dispatcher.waitFor(l.waitFor || [])

			l.listener(action);

			if (l.notify) {
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

	listenOnAsyncAction(name, funcOnInit, funcOnComplete, funcOnFail) {
		let fn = (n, f) => {
			if (typeof f == 'function') {
				this.listenOnAction(name + n, f);
			} else {
				this.listenOnAction(name + n, f.func, f.notify, f.waitFor);
			}
		}

		fn('', funcOnInit);
		fn('_COMPLETE', funcOnComplete);
		fn('_FAIL', funcOnFail);
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

	_runAfter(fn) {
		setTimeout(fn, 0);
	}


	get dispatchToken() {
		return this._dispatchToken;
	}

	listen(...args) {
		this.on(...args);
	}

	unlisten(...args) {
		this.removeListener(...args);
	}
}