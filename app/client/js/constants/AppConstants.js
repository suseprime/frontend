var keyMirror = require('keymirror');

export const CHANGE_EVENT = 'change';

export const ActionTypes = keyMirror({
	LOGIN: null,
	LOGIN_COMPLETE: null,
	LOGIN_FAIL: null,

	SEND_CHAT_REQUEST: null,
	SEND_CHAT_REQUEST_COMPLETE: null,
	SEND_CHAT_REQUEST_FAIL: null,

	CLOSE_CHAT: null,

	CHAT_REQUEST_ACCEPTED: null,
	CHAT_REQUEST_REJECTED: null,

	ACCEPT_CHAT_REQUEST: null,
	ACCEPT_CHAT_REQUEST_COMPLETE: null,
	ACCEPT_CHAT_REQUEST_FAIL: null,

	SEND_MESSAGE: null,
	SEND_MESSAGE_COMPLETE: null,
	SEND_MESSAGE_FAIL: null,

	LOGOUT: null,
	LOGOUT_COMPLETE: null,
	LOGOUT_FAIL: null
});