const Dispatcher = require('flux').Dispatcher;
import { CHANGE_EVENT, ActionTypes } from '../constants/AppConstants';
import EventEmitter from 'events';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';

@Inject(Dispatcher)
export class UserStateStore extends BaseStore {
	constructor(dispatcher) {
		super(dispatcher);
		
		this.listenOnAction(ActionTypes.LOGIN, this.onLoginStarted);
		this.listenOnAction(ActionTypes.LOGIN_COMPLETE, this.onLoginCompleted);
		this.listenOnAction(ActionTypes.LOGIN_FAIL, this.onLoginFailed);

		this.state = null;
	}

	onLoginStarted(data) {
		this.state = 'init';
	}

	onLoginCompleted(data) {
		this.state = 'complete';
	}

	onLoginFailed(data) {
		this.state = 'fail';

		this._runAfter(() => {
			this._notificationActions.error('Logging on server have failed')
		});
	}
}