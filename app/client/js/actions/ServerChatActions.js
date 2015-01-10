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
		this._dispatcher.handleServerAction(AppConstants.CHAT_REQUESTED, {
			fromName: fromName,
			chatId: chatId
		});
	}

	chateEstablished(chatId, targetName) {
		this._dispatcher.handleServerAction(AppConstants.CHAT_ESTABLISHED, { 
			chatId: chatId,
			targetName: targetName
		});		
	}
}