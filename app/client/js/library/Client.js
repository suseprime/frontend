import guid from 'node-uuid';
import EventEmitter from 'events';
import { Inject } from '../../../external/di';
import { ServerChatActions } from '../actions/ServerChatActions';

@Inject(ServerChatActions)
export class Client extends EventEmitter {
	constructor(chatActions) {
		let key = new DSA();
		this._chatActions = chatActions;

		this._server = {
			key: key,
			otr: new OTR({
				fragment_size: 140,
				send_interval: 200,
				priv: key
			})
		}

		this._clients = {};

		this._server.otr.REQUIRE_ENCRYPTION = true
		this._server.otr.on('ui', this._messageReceived.bind(this));

		this._server.otr.on('io', (msg, meta) => {
			if (this._ws != null && this._status == 'opened') {
				this._ws.send(msg);
			}
		});

		this._ws = null;
		this._status = 'none';
		this._host = '';
	}

	_waitForMessageWithId(id) {
		return new Promise((resolve) => {
			let fn = (message) => {
				if (message['request-id'] == id) {
					resolve(message);
					this.removeListener('message', fn);
				}
			};

			this.on('message', fn);
		});
	}

	async _sendMessage(data) {
		await this._ws_promise;
		
		let id = guid.v4()

		data['request-id'] = id;

		this._server.otr.sendMsg(JSON.stringify(data));

		return id;
	}

	async _sendMessageAndWaitForResponse(data, type) {
		let message = await this._waitForMessageWithId(await this._sendMessage(data));

		if (message.type == 'error') {
			throw new Exception("Server responded with error", message);
		} else if (message.type != type) {
			throw new Exception("Server responded with unknow message", message)
		} else {
			return message;
		}
	}

	_messageReceived(message, encrypted) {
		try {
			let body = JSON.parse(message);
			this.emit('message', body);

			if(body.type == 'message') {
				this._handleChatMessage(body);
			} else if (body.type == 'chat-established') {
				this._handleChatEstablished(body);
			} else if (body.type == 'chat-request') {
				this._handleChatRequest(body);
			}
		} catch (e) {
			console.log(e.stack);
		}
	}

	_handleChatRequest(body) {
		this._chatActions.chatRequested(body['chat-id'], body['from-username']);
	}

	_handleChatEstablished(body) {
		this._chatActions.chatEstablished(body['chat-id'], body['target-username']);
		if(typeof body['request-id'] === 'undefined') {
			let chatId = body['chat-id'];
			this._clients[chatId] = new OTR({
				fragment_size: 140,
				send_interval: 200,
				priv: key
			});

			buddy.on('ui', (msg, encrypted) => {
				this._chatActions.receiveMessage(msg, chatId, guid.v4());
			});

			buddy.on('io', (message, meta) => {
				let msg = {
					'type': 'message',
					'message': message,
					'chat-id': chatId
				};
				this._sendMessage(msg);
			});

			this._clients[chatId].REQUIRE_ENCRYPTION = true;
		}
	}

	_handleChatMessage(body) {
		let msg = body.message;
		this._clients[body['chat-id']].receiveMsg(msg);
	}

	async signin(name, password) {
		this.connect();

		let msg = {
			'type': 'sign-in',
			'username': name
		}

		if (password != null) {
			msg['password'] = password;
		}

		return await this._sendMessageAndWaitForResponse(msg, 'sign-in-accepted');
	}

	async requestChatWith(name) {
		let msg = {
			'type': 'chat-request',
			'target-username': name
		}

		return await this._sendMessageAndWaitForResponse(msg, 'chat-request-sent');
	}

	async acceptChat(chatId) {
		let msg = {
			'type': 'chat-request-accepted',
			'chat-id': chatId
		}

		let body = await this._sendMessageAndWaitForResponse(msg, 'chat-established');
		chatId = body['chat-id'];
		this._clients[chatId] = new OTR({
			fragment_size: 140,
			send_interval: 200,
			priv: key
		});

		buddy.on('ui', (message, encrypted) => {
			this._chatActions.receiveMessage(message, chatId, guid.v4());
		});

		buddy.on('io', (message, meta) => {
			let msg = {
				'type': 'message',
				'message': message,
				'chat-id': chatId
			};
			this._sendMessage(msg);
		});

		this._clients[chatId].REQUIRE_ENCRYPTION = true;
		this._clients[chatId].sendQueryMsg();
		return body;
	}

	async status() {
		let msg = { 'type': 'status' }

		return await this._sendMessageAndWaitForResponse(msg, 'status');
	}

	async message(chatId, message, messageId) {
		let msg = {
			'type': 'message',
			'chat-id': chatId,
			'message-id': messageId,
			'message': message
		}

		return await this._sendMessageAndWaitForResponse(msg, 'message-sent');
	}

	async signout(password) {
		let msg = {
			'type': 'sign-out',
		}

		if (password != null) {
			msg['password'] = password;
		}

		let message = await this._sendMessageAndWaitForResponse(msg, 'signed-out');
		this._ws.close();

		return message;
	}

	set host(value) {
		this._host = value;
	}

	get host() {
		return this._host;
	}

	connect() {
		if (this._status != 'none')
			return;

		this._ws = new WebSocket(this._host);
		this._status = 'init';

		this._ws_promise = new Promise((res, rej) => {
			this._ws.onopen = () => {
				this._status = 'opened';

				setTimeout(() => res(), 0);
			}
		});

		this._ws.onerror = (d) => {
			console.error(d);
		}

		this._ws.onmessage = (data) => {
			this._server.otr.receiveMsg(data.data);
		}

		this._ws.onclose = () => {
			this._status = 'none';
		}
	}
}
