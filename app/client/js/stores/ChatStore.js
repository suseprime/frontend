const Dispatcher = require('flux').Dispatcher;
import { ActionTypes } from '../constants/AppConstants';
import { BaseStore } from './BaseStore';
import { Inject } from '../../../external/di';
import Immutable from 'immutable';

@Inject(Dispatcher)
export class ChatStore extends BaseStore {
	constructor(dispatcher, notificationActions) {
		super(dispatcher);

		this.listenOnAsyncAction(ActionTypes.SEND_CHAT_REQUEST, this.onSendChatRequestStarted, this.onSendChatRequestCompleted, this.onSendChatRequestFailed);
		this.listenOnAsyncAction(ActionTypes.ACCEPT_CHAT_REQUEST, this.onAcceptChatRequestStarted, this.onAcceptChatRequestCompleted, this.onAcceptChatRequestFailed);
		this.listenOnAction(ActionTypes.CHAT_REQUESTED, this.onChatRequested);
		this.listenOnAction(ActionTypes.CHAT_ESTABLISHED, this.onChatEstablished);
		this.listenOnAction(ActionTypes.CHAT_SELECTED, this.onChatSelected);

		this._selectedChat = null;
		this._chats = Immutable.List();
	}

	get chats() {
		return this._chats;
	}

	onChatSelected(data) {
		this._selectedChat = data.data.id;
	}

	onSendChatRequestStarted(data) {
		let { name } = data.data;

		this._chats = this._chats.update((x) => {
			return x
				.push(Immutable.fromJS({
					name: name,
					state: 'preparing'
				}));
		});
	}

	onSendChatRequestCompleted(data) {
		let { name, chatId } = data.data;
		
		let chatKey = this._chats.findIndex((x) => x.name == name);

		this._chats = this._chats.updateIn([ chatKey ], (x) => {
			return x
				.set('id', chatId)
				.set('state', 'waiting');
		});
	}

	onSendChatRequestFailed(data) {
		let { name, error } = data.data;
		let chatKey = this._chats.findIndex((x) => x.name == name);

		this._chats = this._chats.remove(chatKey);
	}

	onChatEstablished(data) {
		let { chatId } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);

		this._chats = this._chats.updateIn([ chatKey ], (x) => {
			return x
				.set('state', 'established');
		});
	}

	onChatRequested(data) {
		let { fromName, chatId } = data.data;

		this._chats = this._chats.update((x) => {
			return x
				.push(Immutable.fromJS({
					name: fromName,
					state: 'requested',
					id: chatId
				}));
		});
	}

	onAcceptChatRequestStarted(data) {
		let { chatId } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);

		this._chats = this._chats.updateIn([ chatKey ], (x) => {
			return x
				.set('state', 'waiting');
		});
	}

	onAcceptChatRequestCompleted(data) {
		let { chatId } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);

		this._chats = this._chats.updateIn([ chatKey ], (x) => {
			return x
				.set('state', 'established');
		});
	}

	onAcceptChatRequestFailed(data) {
		let { chatId, error } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);

		this._chats = this._chats.remove(chatKey);
	}
}
