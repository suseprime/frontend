const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { UserStore } from '../stores/UserStore';
import { HomePage } from './HomePage.react';
import { ChatPage } from './ChatPage.react';
import { Notifications } from './Notifications.react';

@Inject(Element, UserStore, HomePage, ChatPage, Notifications)
export class App {
	constructor(elements, userStateStore, homePage, chatPage, notifications) {
		let { div } = elements;

		class _App {
			get displayName() { return "App" }

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
				let page = userStateStore.signInState == 'complete' ? chatPage : homePage;

				return div(null, 
					page.component(),
					notifications.component());
			}

		}

		this.component = React.createFactory(React.createClass(_App.prototype));
	}
}
