import { OTR, DSA } from 'otr'

export class Client {
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

		this._server.otr.on('ui', this._msgReceived);

		this._server.otr.on('io', (msg, meta) => {
			if (this._ws != null && this._status != 'opened') {
				this._ws.send(msg);
			}
		});

		this._ws = null;
		this._status = 'none';
	}

	_msgReceived(message, encrypted) {
		try {
			let body = JSON.parse(message);
			let { type } = body;
			
		} catch (e) {
			console.log(e.stack);
		}
	}

	connect(server) {
		if (this._status != 'none')

		this._ws = new WebSocket(server);
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