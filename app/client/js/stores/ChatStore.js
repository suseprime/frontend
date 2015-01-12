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
		this.listenOnAsyncAction(ActionTypes.REJECT_CHAT_REQUEST, this.onRejectChatRequestStarted, this.onRejectChatRequestCompleted, this.onRejectChatRequestFailed);
		this.listenOnAsyncAction(ActionTypes.CLOSE_CHAT_REQUEST, this.onCloseChatRequestStarted, this.onCloseChatRequestCompleted, this.onCloseChatRequestFailed);
		this.listenOnAction(ActionTypes.CHAT_REQUESTED, this.onChatRequested);
		this.listenOnAction(ActionTypes.CHAT_ESTABLISHED, this.onChatEstablished);
		this.listenOnAction(ActionTypes.CHAT_SELECTED, this.onChatSelected);
		this.listenOnAction(ActionTypes.CHAT_REJECTED, this.onChatRejected);
		this.listenOnAction(ActionTypes.CHAT_CLOSED, this.onChatClosed);

		this._selectedChat = null;
		this._chats = Immutable.List();
		this._rejectingChats = Immutable.List();
		this._closingChats = Immutable.List();
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

	onRejectChatRequestStarted(data) {
		let { chatId } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);
		let chat = this._chats.get(chatKey);

		this._chats = this._chats.remove(chatKey);
		this._rejectingChats = this._rejectingChats.push(chat);
	}

	onRejectChatRequestCompleted(data) {
		let { chatId } = data.data;

		let chatKey = this._rejectingChats.findIndex((x) => x.chatId == chatId);

		this._rejectingChats = this._rejectingChats.remove(chatKey);
	}

	onRejectChatRequestFailed(data) {
		let { chatId } = data.data;

		let chatKey = this._rejectingChats.findIndex((x) => x.chatId == chatId);
		let chat = this._chats.get(chatKey);

		this._chats = this._chats.push(chat);
		this._rejectingChats = this._rejectingChats.remove(chatKey);
	}

	onCloseChatRequestStarted(data) {
		let { chatId } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);
		let chat = this._chats.get(chatKey);

		this._chats = this._chats.remove(chatKey);
		this._closingChats = this._closingChats.push(chat);
	}

	onCloseChatRequestCompleted(data) {
		let { chatId } = data.data;

		let chatKey = this._closingChats.findIndex((x) => x.chatId == chatId);

		this._closingChats = this._closingChats.remove(chatKey);
	}

	onCloseChatRequestFailed(data) {
		let { chatId } = data.data;

		let chatKey = this._closingChats.findIndex((x) => x.chatId == chatId);
		let chat = this._chats.get(chatKey);

		this._chats = this._chats.push(chat);
		this._closingChats = this._closingChats.remove(chatKey);
	}

	onChatRejected(data) {
		let { chatId } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);

		this._chats = this._chats.remove(chatKey);
	}

	onChatClosed(data) {
		let { chatId } = data.data;

		let chatKey = this._chats.findIndex((x) => x.chatId == chatId);

		this._chats = this._chats.remove(chatKey);
	}
}
