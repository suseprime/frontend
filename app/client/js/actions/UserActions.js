const Dispatcher = require('flux').Dispatcher;
import { Inject } from '../../../external/di';
import { ActionTypes } from '../constants/AppConstants';
import { Client } from '../library/Client.js';

@Inject(Dispatcher, Client)
export class UserActions {
	constructor(dispatcher, client) {
		this._dispatcher = dispatcher;
		this._client = client;
	}

	signin(name, password) {
		this._dispatcher.handleViewAction(ActionTypes.SIGNIN, {
			name: name,
			password: password
		});

		this._client.signin(name, password).then((resp) => {
			this._dispatcher.handleViewAction(ActionTypes.SIGNIN_COMPLETE, {
				name: name,
				password: password
			});
		}, (err) {
			this._dispatcher.handleViewAction(ActionTypes.SIGNIN_FAIL, err);
		});
	}

	signout(password) {
		this._dispatcher.handleViewAction(ActionTypes.SIGNOUT, {
			password: password
		});

		this._client.signout(password).then((resp) => {
			this._dispatcher.handleViewAction(ActionTypes.SIGNOUT_COMPLETE, {
				password: password
			});
		}, (err) => {
			this._dispatcher.handleViewAction(ActionTypes.SIGNOUT_FAIL, err);
		})
	}
}