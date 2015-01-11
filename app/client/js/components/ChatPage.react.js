const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { UserStateStore } from '../stores/UserStateStore';
import { UserActions } from '../actions/UserActions';
import { ChatStore } from '../stores/ChatStore';
import { ChatActions } from '../actions/ChatActions';
import { MessageStore } from '../stores/MessageStore';
import Modal from 'react-modal'

@Inject(Element, UserStateStore, UserActions, ChatStore, ChatActions, MessageStore)
export class ChatPage {
	constructor(elements, userStateStore, userActions, chatStore, chatActions, messageStore) {
		let { div, nav, h1, a, form, input, textarea, p } = elements;

		class _MessagesList {
			get displayName() { return "MessagesList" }

			componentDidMount() {
				messageStore.listen('change', this.onDataChange);
			}

			componentWillUnmount() {
				messageStore.unlisten('change', this.onDataChange);
			}

			onDataChange() {
				this.forceUpdate();
			}

			render() {
				return div(null, messageStore.getMessages(this.props.chat.get('id')).map((x) => {
					return div({ className: "message" + (x.get('my') ? " my" : "") }, x.get('message'));
				}).toArray());
			}
		}

		const MessagesList = React.createFactory(React.createClass(_MessagesList.prototype));

		class _Chat {
			get displayName() { return "Chat" }

			componentDidMount() {
				messageStore.listen('change', this.onDataChange);
				chatStore.listen('change', this.onDataChange);
			}

			componentWillUnmount() {
				messageStore.unlisten('change', this.onDataChange);
				chatStore.unlisten('change', this.onDataChange);
			}

			onDataChange() {
				this.forceUpdate();
			}

			onFormSubmit(e) {
				e.preventDefault();

				let message = this.refs['message'].getDOMNode().value;

				if (message.length == 0)
					return;

				chatActions.message(message, this.props.chat.get('id'));
			}

			onAcceptRequestClick() {
				chatActions.acceptChatRequest(this.props.chat.get('id'));
			}

			render() {
				let ch = this.props.chat;
				const state = ch.get('state');

				let content = null;

				if (state == 'established') {
					content = div({ className: "other" },
						div({ className: "content" }, MessagesList({ chat: ch })),
							form({ onSubmit: this.onFormSubmit, className: "form" },
								textarea({ ref: 'message' }),
								input({ type: 'submit', value: 'Send' })));
				} else if (state == 'requested') {
					content = div(null,
						div({ className: "content" },
							a({ onClick: this.onAcceptRequestClick }, "Accept request")));
				} else if (state == 'waiting') {
					content = div(null,
						div({ className: "content" }, "Waiting"));
				} else {
					content = div(null,
						div({ className: "content" }, "Preparing"));
				}

				return div({ className: "chat" },
					div({ className: "name" }, ch.get('name')),
					content);
			}
		}


		const Chat = React.createFactory(React.createClass(_Chat.prototype));

		class _AddChatModal {
			get displayName() { return "AddChatModal" }

			handleFormSubmit(e) {
				e.preventDefault()

				let name = this.refs['name'].getDOMNode().value;

				if (name.length > 3) {
					this.props.handleClose();

					chatActions.sendChatRequest(name);
				}
			}

			render() {
				return React.createElement(Modal, {
					className: "modal",
					isOpen: this.props.open,
					closeTimeoutMs: 200,
					onRequestClose: this.props.handleClose
				}, div({ className: 'content' },
					p(null, 'Who to chat with?'),
					form({ className: 'form', onSubmit: this.handleFormSubmit },
						input({ type: 'text', placeholder: 'Nick', ref: 'name' }),
						input({ type: 'submit', placeholder: 'Send request' }))));
			}
		}

		const AddChatModal = React.createFactory(React.createClass(_AddChatModal.prototype));

		class _ChatPage {
			get displayName() { return "ChatPage" }

			getInitialState() {
				return {
					addChatModal: false
				}
			}

			componentDidMount() {
				chatStore.listen('change', this.onDataChange);
			}

			componentWillUnmount() {
				chatStore.unlisten('change', this.onDataChange);
			}

			onDataChange() {
				this.forceUpdate();
			}

			onSignOutClick() {
				userActions.signout()
			}

			handleAddChatModalClose() {
				console.log('wh')
				this.setState({ addChatModal: false });
			}

			onAddChatClick() {
				this.setState({ addChatModal: true });
			}

			render() {
				return div({ id: "chat" },
					AddChatModal({ open: this.state.addChatModal, handleClose: this.handleAddChatModalClose }),
					nav(null,
						h1(null, "Suseprime"),
						div({ className: "right" },
							a({ href: "#", onClick: this.onSignOutClick }, "Logout")),
						div({ className: "second-row" },
							a({ href: "#", onClick: this.onAddChatClick }, "+"))),
					div({ className: "chats" },
						chatStore.chats.map(x => Chat({ chat: x })).toArray()));
			}

		}

		this.component = React.createFactory(React.createClass(_ChatPage.prototype));
	}
}
