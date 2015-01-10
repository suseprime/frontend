const Dispatcher = require('flux').Dispatcher;
import { ActionTypes } from '../constants/AppConstants';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';

@Inject(Dispatcher)
export class ChatRequestStore extends BaseStore {
	constructor(dispatcher, notificationActions) {
		super(dispatcher);
	}
}