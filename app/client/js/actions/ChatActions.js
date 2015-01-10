const Dispatcher = require('flux').Dispatcher;
import { Inject } from '../../../external/di';
import { ActionTypes } from '../constants/AppConstants';
import { Client } from '../library/Client.js';
import guid from 'node-uuid';

@Inject(Dispatcher, Client)
export class ChatActions {
	constructor(dispatcher, client) {
		this._dispatcher = dispatcher;
		this._client = client;
	}

	sendChatRequest(name) {
		this._dispatcher.handleViewAction(ActionTypes.SEND_CHAT_REQUEST, {
			name: name
		});

		this._client.requestChatWith(name).then((resp) => {
			this._dispatcher.handleViewAction(ActionTypes.SEND_CHAT_REQUEST_COMPLETE, {
				name: name,
				chatId: resp['chat-id']
			});
		}, (err) => {
			this._dispatcher.handleViewAction(ActionTypes.SEND_CHAT_REQUEST_FAIL, err);
		});
	}

	acceptChatRequest(chatId) {
		this._dispatcher.handleViewAction(ActionTypes.ACCEPT_CHAT_REQUEST, {
			chatId: chatId
		});

		this._client.acceptChat(chatId).then((resp) => {
			this._dispatcher.handleViewAction(ActionTypes.ACCEPT_CHAT_REQUEST_COMPLETE, {
				chatId: resp['chet-id']
			});
		}, (err) => {
			this._dispatcher.handleViewAction(ActionTypes.ACCEPT_CHAT_REQUEST_FAIL, err);
		})
	}

	message(message, chatId) {
		var messageId = guid.v4();

		this._dispatcher.handleViewAction(ActionTypes.SEND_MESSAGE, {
			message: message,
			messageId: messageId,
			chatId: chatId
		});

		this._client.message(chatId, message, messageId).then((resp) => {
			this._dispatcher.handleViewAction(ActionTypes.SEND_MESSAGE_COMPLETE, {
				message: message,
				messageId: messageId,
				chatId: chatId
			});
		}, (err) => {
			this._dispatcher.handleViewAction(ActionTypes.SEND_MESSAGE_FAIL, err);
		});
	}
}