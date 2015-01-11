const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { UserStateStore } from '../stores/UserStateStore';
import { UserActions } from '../actions/UserActions';
import Loading from 'react-loading/dist/react-loading.js'

@Inject(Element, UserStateStore, UserActions)
export class HomePage {
	constructor(elements, userStateStore, userActions) {
		let { div, h1, h3, p, form, input, footer } = elements;

		class _Row {
			get displayName() { return "Row" }

			render() {
				return div({ className: 'row' },
					div({ className: 'image onScreen ' + this.props.name }),
					div({ className: 'text' },
						h3(null, this.props.title),
						p(null, this.props.content)));
			}
		}

		const Row = React.createFactory(React.createClass(_Row.prototype));

		class _HomePage {
			get displayName() { return "HomePage" }

			componentDidMount() {
				userStateStore.listen('change', this.onDataChange);
			}

			componentWillUnmount() {
				userStateStore.unlisten('change', this.onDataChange);
			}

			onDataChange() {
				this.forceUpdate();
			}

			onFormSubmit(e) {
				e.preventDefault()

				let val = this.refs['nick'].getDOMNode().value;
				
				if (val.length > 3) {
					userActions.signin(val);
				}
			}

			render() {
				let progress = null;

				switch(userStateStore.signInState) {
					case 'init':
						progress = div({
							className: 'loading'
						}, React.createElement(Loading, { type: 'spinning-bubbles', color: '#efefef' }));
						break;
					case 'fail':
						progress = p(null, 'There was some error');
						break;
					default:
						progress = form({ onSubmit: this.onFormSubmit },
								input({ ref: 'nick', type: 'text', name: 'nick', placeholder: 'Nick', required: true, autoComplete: 'off' }),
								input({ type: 'submit', value: 'Sign in' }));
				}

				return div({ id: 'home' },
					div({ className: 'heading' },
						div({ className: 'bg' }),
						div({ className: 'content' },
							h1(null, 'Suseprime'),
							p(null, 'super secret private messaging'),
							progress)),
					div({ className: 'body' },
						[
							{
								key: 'lock',
								name: 'lock',
								title: 'Security',
								content: 'It is encrypted using modified OTR protocol, which combines numerous army-level secured algorythms.'
							},
							{
								key: 'server',
								name: 'server',
								title: 'Peer to peer encryption',
								content: 'We can\'t decrypt your messages, because messages and keys aren\'t stored on our servers, but only passed to your friend.'
							}
						].map((row) => Row(row))),
					footer(null, 'Suseprime 2015'));
			}

		}

		this.component = React.createFactory(React.createClass(_HomePage.prototype));
	}
}
