import { OTR, DSA } from 'otr';
import guid from 'node-uuid';
import EventEmitter from 'events';

export class Client extends EventEmitter {
	constructor() {
		let serverKey = new DSA();
		let clientKey = new DSA();

		this._server = {
			key: serverKey,
			otr: new OTR({
				fragment_size: 140,
				send_interval: 200,
				priv: serverKey
			})
		}

		this._client = {
			key: clientKey,
			otr: new OTR({
				fragment_size: 140,
				send_interval: 200,
				priv: clientKey
			})
		}

		this._server.otr.on('ui', this._messageReceived);

		this._server.otr.on('io', (msg, meta) => {
			if (this._ws != null && this._status != 'opened') {
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

	_sendMessage(data) {
		let id = guid.v4()

		data['request-id'] = id;

		this._server.otr.sendMsg(JSON.stringify(message));

		return id;
	}

	async _sendMessageAndWaitForResponse(data, type) {
		let message = await this._waitForMessageWithId(this._sendMessage(data));

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
			}
		} catch (e) {
			console.log(e.stack);
		}
	}

	_handleChatMessage(body) {

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

		return await this._sendMessageAndWaitForResponse(msg, 'chat-established')
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

		this._ws.onopen = () => {
			this._status = 'opened'
		}

		this._ws.onerror = (d) => {
			console.error(d);
		}

		this._ws.onmessage = (data) => {
			this._server.otr.receiveMsg(data)
		}

		this._ws.onclose = () => {
			this._status = 'none';
		}
	}
}