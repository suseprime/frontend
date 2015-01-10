const Dispatcher = require('flux').Dispatcher;
import { Provide } from '../../../external/di';
import { PayloadSources } from '../constants/AppConstants';

@Provide(Dispatcher)
export class SuseDispatcher extends Dispatcher {
	constructor(...args) {
		super(...args);
	}

	dispatch(data) {
		console.log(data.action.type, data.action.data);

		super.dispatch(data);
	}

	handleServerAction(type, data) {
		this.dispatch({
			source: PayloadSources.SERVER_ACTION,
			action: {
				type: type,
				data: data
			}
		});
	}

	handleViewAction(type, data) {
		this.dispatch({
			source: PayloadSources.VIEW_ACTION,
			action: {
				type: type,
				data: data
			}
		});
	}

	handleOTRAction(type, data) {
		this.dispatch({
			source: PayloadSources.OTR_ACTION,
			action: {
				type: type,
				data: data
			}
		});

	}
}