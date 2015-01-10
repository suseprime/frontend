const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { UserStateStore } from '../stores/UserStateStore';

@Inject(Element, UserStateStore)
export class HomePage {
	constructor(elements, userStateStore) {
		let { div, h1, h3, p, form, input, footer } = elements;

		class _Row {
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
			onSignInClick(e) {
				e.preventDefault()

				let val = this.refs['nick'].getDOMNode().value;
			}

			render() {
				return div({ id: 'home' },
					div({ className: 'heading' },
						div({ className: 'bg' }),
						div({ className: 'content' },
							h1(null, 'Suseprime'),
							p(null, 'super secret private messaging'),
							form(null,
								input({ ref: 'nick', type: 'text', name: 'nick', placeholder: 'Nick', required: true, autoComplete: 'off' }),
								input({ type: 'submit', value: 'Sign in', onClick: this.onSignInClick })))),
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
