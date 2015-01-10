const Dispatcher = require('flux').Dispatcher;
import { Provide } from '../../../external/di';
import { PayloadSource } from '../constants/AppConstants';

@Provide(Dispatcher)
export class SuseDispatcher extends Dispatcher {
	constructor(...args) {
		super(...args);
	}

	handleServerAction(type, data) {
		this.dispatch({
			source: PayloadSource.SERVER_ACTION,
			action: {
				type: type,
				data: data
			}
		});
	}

	handleViewAction(action) {
		this.dispatch({
			source: PayloadSource.VIEW_ACTION,
			action: {
				type: type,
				data: data
			}
		});
	}

	handleOTRAction(action) {
		this.dispatch({
			source: PayloadSource.OTR_ACTION,
			action: {
				type: type,
				data: data
			}
		});

	}
}