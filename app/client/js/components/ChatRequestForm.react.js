const React = require('react');
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { ChatActions } from '../actions/ChatActions';

@Inject(Element, ChatActions)
export class ChatRequestForm {
	constructor(elements, chatActions, ) {
		let { div, form, input } = elements;

		class _ChatRequestForm {
			render() {
				return div(
					form({ onSubmit: this.onFormSubmit },
						input({ ref: 'name', type: 'text', name: 'who', placeholder: 'Who', required: true, autoComplete: 'off' }),
						input({ type: 'submit', value: 'Add' }))
				);
			}
		}
	}
}