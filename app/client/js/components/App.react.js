const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { UserStateStore } from '../stores/UserStateStore';
import { HomePage } from './HomePage.react'
import { Notifications } from './Notifications.react'

@Inject(Element, UserStateStore, HomePage, Notifications)
export class App {
	constructor(elements, userStateStore, homePage, notifications) {
		let { div } = elements;

		class _App {
			componentDidMount() {
				userStateStore.listen('change', this.onDataChange);
			}

			componentWillUnmount() {
				userStateStore.unlisten('change', this.onDataChange);
			}

			onDataChange() {
				this.forceUpdate();
			}

			render() {
				let page = userStateStore.loginState == 'complete' ? chatPage : homePage;

				return div(null, 
					page.component(),
					notifications.component());
			}

		}

		this.component = React.createFactory(React.createClass(_App.prototype));
	}
}
