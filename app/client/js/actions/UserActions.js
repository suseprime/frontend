const Dispatcher = require('flux').Dispatcher;
import { Inject } from '../../../external/di';
import { ActionTypes } from '../constants/AppConstants';

@Inject(Dispatcher)
export class UserActions {
	constructor(dispatcher) {
		this._dispatcher = dispatcher;
	}

	signin(nickname) {
		
	}
}