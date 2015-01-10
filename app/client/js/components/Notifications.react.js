const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { NotificationsStore } from '../stores/NotificationsStore';

@Inject(Element, NotificationsStore)
export class Notifications {
	constructor(elements, store, notificationActions) {
		let { div, span, i, CSSTransitionGroup } = elements;

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
					CSSTransitionGroup({ transitionName: 'notification', component: 'div' },
						store.getAll().map((x, i) => this.renderNotification(x))));
			}

			renderNotification(notification) {
				return div({ 
					key: notification.get('id'),
					className: notification.get('type') + ' notification',
					onClick: this.onNotificationClick.bind(this, notification.get('id'))
				}, span({ className: 'text' }, notification.get('text')));
			}
		}

		this.component = React.createFactory(React.createClass(_Notificatons.prototype));
	}
}