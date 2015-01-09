const React = require('react')
import { Inject, Injector } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { UserStateStore } from '../stores/UserStateStore';

@Inject(Element, UserStateStore)
export class App {
	constructor(elements) {
		let { div, h1, h3, p, form, input, footer } = elements;

		class _Row {
			render() {
				return div({ className: "row" },
					div({ className: "image onScreen " + this.props.name }),
					div({ className: "text" },
						h3(null, this.props.title),
						this.props.content));				
			}
		}

		const Row = React.createFactory(React.createClass(_Row.prototype));

		class _App {
			onSignInClick() {

			}

			render() {
				return div({ id: "home" },
					div({ className: "heading" },
						div({ className: "bg" }),
						div({ className: "content" },
							h1(null, "Suseprime"),
							p(null, "super secret private messaging"),
							form(null,
								input({ type: "text", name: "nick", placeholder: "Nick", required: true, autocomplete: "off" }),
								input({ type: "submit", value: "Sign in", onClick: this.onSignInClick })))),
					div({ className: "body" },
						[
							{
								name: "lock",
								title: "Security",
								content: "It is encrypted using modified OTR protocol, which combines numerous army-level secured algorythms."
							},
							{
								name: "server",
								title: "Peer to peer encryption",
								content: "We can't decrypt your messages, because messages and keys aren't stored on our servers, but only passed to your friend."
							}
						].map((row) => Row(row))),
					footer(null, "Suseprime 2015"));
			}

		}

		this.component = React.createFactory(React.createClass(_App.prototype));
	}
}