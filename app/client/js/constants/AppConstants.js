const keyMirror = require('keymirror');

export const CHANGE_EVENT = 'change';

export const ActionTypes = keyMirror({
	SIGNIN: null,
	SIGNIN_COMPLETE: null,
	SIGNIN_FAIL: null,

	SEND_CHAT_REQUEST: null,
	SEND_CHAT_REQUEST_COMPLETE: null,
	SEND_CHAT_REQUEST_FAIL: null,

	CLOSE_CHAT: null,

	CHAT_ESTABLISHED: null,

	ACCEPT_CHAT_REQUEST: null,
	ACCEPT_CHAT_REQUEST_COMPLETE: null,
	ACCEPT_CHAT_REQUEST_FAIL: null,

	REJECT_CHAT_REQUEST: null,

	RECEIVE_MESSAGE: null,

	SEND_MESSAGE: null,
	SEND_MESSAGE_COMPLETE: null,
	SEND_MESSAGE_FAIL: null,

	SIGNOUT: null,
	SIGNOUT_COMPLETE: null,
	SIGNOUT_FAIL: null,

	ADD_NOTIFICATION: null,
	REMOVE_NOTIFICATION: null,
	CLICK_NOTIFICATION: null
});

export const PayloadSources = keyMirror({
	SERVER_ACTION: null,
	VIEW_ACTION: null,
	OTR_ACTION: null
});