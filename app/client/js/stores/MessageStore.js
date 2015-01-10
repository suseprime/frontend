const Dispatcher = require('flux').Dispatcher;
import { ActionTypes } from '../constants/AppConstants';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';
import Immutable from 'immutable';

@Inject(Dispatcher)
export class MessageStore extends BaseStore {
	constructor(dispatcher, notificationActions) {
		super(dispatcher);

		this.listenOnAsyncAction(ActionTypes.SEND_MESSAGE, this.onSendMessageStarted, this.onSendMessageCompleted, this.onSendMessageFailed);
		this.listenOnAction(ActionTypes.RECEIVE_MESSAGE, this.onReceiveMessage)

		this._messages = Immutable.Map();
	}

	getMessages(chatId) {
		return this._messages.get(chatId, Immutable.List());
	}

	onSendMessageStarted(data) {
		let { message, messageId, chatId } = data.data;

		this._messages = this._messages.updateIn([ chatId ], Immutable.List(), (x) => {
			return x
				.push(Immutable.fromJS({
					message: message,
					messageId: messageId,
					chatId: chatId,
					date: new Date(),
					state: 'sending',
					my: true
				}))
//				.sortBy(y => y.date)
		});
	}

	onSendMessageCompleted(data) {
		let { message, messageId, chatId } = data.data;

		let messageKey = this._messages.get(chatId, Immutable.List()).findIndex(x => x.get('messageId') == messageId);

		this._messages = this._messages.updateIn([ chatId,  messageKey ], (x) => {
			return x.set('state', 'sent');
		})
	}

	onSendMessageFailed(data) {
		let { messageId, error } = data.data;

		let messageKey = this._messages.get(chatId, Immutable.List()).findIndex(x => x.get('messageId') == messageId);

		this._messages = this._messages.updateIn([ chatId, messageKey ], (x) => {
			return x.set('state', 'failed').set('error', error);
		});
//				.sortBy(y => y.date)
	}

	onReceiveMessage(data) {
		let { message, messageId, chatId } = data.data;

		this._messages = this._messages.updateIn([ chatId ], Immutable.List(), (c) => {
			return c.push(Immutable.fromJS({
					message: message,
					messageId: messageId,
					chatId: chatId,
					date: new Date(),
					state: 'sent',
					my: false
				}))
		});
//				.sortBy(y => y.date)
	}
}