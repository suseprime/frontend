const Dispatcher = require('flux').Dispatcher;
import { Inject } from '../../../external/di';
import { ActionTypes } from '../constants/AppConstants';
import guid from 'node-uuid';

@Inject(Dispatcher)
export class ServerChatActions {
	constructor(dispatcher, client) {
		this._dispatcher = dispatcher;
	}

	receiveMessage(message, chatId, messageId) {
		this._dispatcher.handleViewAction(ActionTypes.RECEIVE_MESSAGE, {
			message: message,
			chatId: chatId,
			messageId: messageId
		})
	}

	chatRequested(chatId, fromName) {
		this._dispatcher.handleServerAction(ActionTypes.CHAT_REQUESTED, {
			fromName: fromName,
			chatId: chatId
		});
	}

	chatEstablished(chatId, targetName) {
		this._dispatcher.handleServerAction(ActionTypes.CHAT_ESTABLISHED, { 
			chatId: chatId,
			targetName: targetName
		});		
	}

	chatClosed(chatId) {
		this._dispatcher.handleServerAction(ActionTypes.CHAT_CLOSED, {
			chatId: chatId
		});
	}

	chatRejected(chatId) {
		this._dispatcher.handleServerAction(ActionTypes.CHAT_REJECTED, {
			chatId: chatId
		});
	}
}