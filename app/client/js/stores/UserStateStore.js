const Dispatcher = require('flux').Dispatcher;
import { ActionTypes } from '../constants/AppConstants';
import EventEmitter from 'events';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';
import { NotificationActions } from '../actions/NotificationActions';

@Inject(Dispatcher, NotificationActions)
export class UserStateStore extends BaseStore {
	constructor(dispatcher, notificationActions) {
		super(dispatcher);

		this._notificationActions = notificationActions;

		this.listenOnAction(ActionTypes.LOGIN, this.onLoginStarted);
		this.listenOnAction(ActionTypes.LOGIN_COMPLETE, this.onLoginCompleted);
		this.listenOnAction(ActionTypes.LOGIN_FAIL, this.onLoginFailed);

		this.loginState = 'null';
	}



	onLoginStarted(data) {
		this.loginState = 'init';
	}

	onLoginCompleted(data) {
		this.loginState = 'complete';
	}

	onLoginFailed(data) {
		this.loginState = 'fail';

		this._runAfter(() => {
			this._notificationActions.error('Logging on server have failed')
		});
	}
}