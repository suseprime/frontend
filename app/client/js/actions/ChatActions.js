const Dispatcher = require('flux').Dispatcher;
import { Inject } from '../../../external/di';
import { ActionTypes } from '../constants/AppConstants';
import { Client } from '../library/Client.js';
import { NotificationActions } from './NotificationActions';
import guid from 'node-uuid';

@Inject(Dispatcher, Client, NotificationActions)
export class ChatActions {
	constructor(dispatcher, client, notificationActions) {
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
			this._dispatcher.handleViewAction(ActionTypes.SEND_CHAT_REQUEST_FAIL, { 
				name: name,
				error: err
			});
		}).catch(x => console.error(x));
	}

	acceptChatRequest(chatId) {
		this._dispatcher.handleViewAction(ActionTypes.ACCEPT_CHAT_REQUEST, {
			chatId: chatId
		});

		this._client.acceptChat(chatId).then((resp) => {
			this._dispatcher.handleViewAction(ActionTypes.ACCEPT_CHAT_REQUEST_COMPLETE, {
				chatId: resp['chat-id']
			});
		}, (err) => {
			this._dispatcher.handleViewAction(ActionTypes.ACCEPT_CHAT_REQUEST_FAIL, {
				chatId: chatId,
				error: err
			});
		}).catch(x => console.error(x));
	}

	async rejectChatRequest(chatId) {
		this._dispatcher.handleViewAction(ActionTypes.REJECT_CHAT_REQUEST, {
			chatId: chatId
		});

		try {
			let resp = await this._client.rejectChat(chatId);

			this._dispatcher.handleViewAction(ActionTypes.REJECT_CHAT_REQUEST_COMPLETE, {
				chatId: chatId
			});
		} catch (e) {
			this._dispatcher.handleViewAction(ActionTypes.REJECT_CHAT_REQUEST_FAIL, {
				chatId: chatId,
				error: e
			})
		}
	}

	async closeChatRequest(chatId) {
		this._dispatcher.handleViewAction(ActionTypes.CLOSE_CHAT_REQUEST, {
			chatId: chatId
		});

		try {
			let resp = await this._client.closeChat(chatId);

			this._dispatcher.handleViewAction(ActionTypes.CLOSE_CHAT_REQUEST_COMPLETE, {
				chatId: chatId
			});
		} catch (e) {
			this._dispatcher.handleViewAction(ActionTypes.CLOSE_CHAT_REQUEST_FAIL, {
				chatId: chatId,
				error: e
			});
		}
	}

	selectChat(chatId) {
		this._dispatcher.handleViewAction(ActionTypes.SELECT_CHAT, {
			'id': chatId
		});
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
			this._dispatcher.handleViewAction(ActionTypes.SEND_MESSAGE_FAIL, {
				messageId: messageId,
				error: err
			});
		}).catch(x => console.error(x));
	}
}