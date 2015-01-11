const Dispatcher = require('flux').Dispatcher;
import { ActionTypes } from '../constants/AppConstants';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';
import { NotificationActions } from '../actions/NotificationActions';

@Inject(Dispatcher, NotificationActions)
export class UserStore extends BaseStore {
	constructor(dispatcher, notificationActions) {
		super(dispatcher);

		this._notificationActions = notificationActions;

		this.listenOnAsyncAction(ActionTypes.SIGNIN, this.onSignInStarted, this.onSignInCompleted, this.onSignInFailed);
		this.listenOnAsyncAction(ActionTypes.SIGNOUT, this.onSignOutStarted, this.onSignOutCompleted, this.onSignOutFailed);

		this.signInState = 'null';
		this.nick = undefined;
	}

	onSignOutStarted(data) {}

	onSignOutCompleted(data) {
		this.signInState = 'null';
		this.nick = undefined;
	}

	onSignOutFailed(data) {
		this.signInState = 'fail';
	}

	onSignInStarted(data) {
		this.signInState = 'init';
		this.nick = data.data.name;
	}

	onSignInCompleted(data) {
		this.signInState = 'complete';
	}

	onSignInFailed(data) {
		this.signInState = 'fail';

		this._runAfter(() => {
			this._notificationActions.error('Logging on server have failed')
		});
	}
}
