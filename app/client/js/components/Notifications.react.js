const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { NotificationsStore } from '../stores/NotificationsStore';
import { NotificationActions } from '../actions/NotificationActions';

@Inject(Element, NotificationsStore, NotificationActions)
export class Notifications {
	constructor(elements, store, notificationActions) {
		let { div, span, i } = elements;

		class _Notificatons {
			get displayName() { return "Notifications" }

			componentDidMount() {
				store.listen('change', this.onDataChange);
			}

			componentWillUnmount() {
				store.unlisten('change', this.onDataChange);
			}

			onDataChange() {
				this.forceUpdate();
			}

			onNotificationClick(id) {
				notificationActions.click(id);
				notificationActions.remove(id);
			}

			render() {
				return div({ className: 'notifications' },
					store.getAll().map((x, i) => this.renderNotification(x)).toArray());
			}

			renderNotification(notification) {
				return div({
					key: notification.get('id'),
					className: notification.get('type') + ' notification',
					onClick: this.onNotificationClick.bind(this, notification.get('id'))
				}, span({ className: 'message' }, notification.get('message')));
			}
		}

		this.component = React.createFactory(React.createClass(_Notificatons.prototype));
	}
}
