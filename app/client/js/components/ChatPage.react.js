const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';
import { UserStore } from '../stores/UserStore';
import { UserActions } from '../actions/UserActions';
import { ChatStore } from '../stores/ChatStore';
import { ChatActions } from '../actions/ChatActions';
import { MessageStore } from '../stores/MessageStore';
import Modal from 'react-modal'
import { Loading } from './Loading.react'

@Inject(Element, UserStore, UserActions, ChatStore, ChatActions, MessageStore, Loading)
export class ChatPage {
	constructor(elements, userStore, userActions, chatStore, chatActions, messageStore, loading) {
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
					var s = null;

					if (x.get('state') == 'sending') {
						s = [ ' ',  loading.component({ height: 15, width: 15, type: 'spinning-bubbles', color: '#3e3e3e' }) ]
					}

					return div({ className: "message" + (x.get('my') ? " my" : "") }, x.get('message'), s);
				}).toArray());
			}
		}

		const MessagesList = React.createFactory(React.createClass(_MessagesList.prototype));

		class _ChatForm {
			get displayName() { return "ChatForm" }

			getInitialState() {
				return { text: '' }
			}

			onTextChange(e) {
				this.setState({ text: e.target.value });
			}

			trySendMessage() {
				let message = this.state.text.trim();

				if (message.length == 0)
					return;

				this.setState({ text: '' });

				chatActions.message(message, this.props.chat.get('id'));
			}

			onKeyDown(e) {
				if (event.keyCode == 13) {
					e.preventDefault()

					this.trySendMessage();
				}
			}

			onFormSubmit(e) {
				e.preventDefault();

				this.trySendMessage();
			}

			render() {
				return form({ onSubmit: this.onFormSubmit, className: "form" },
					textarea({ ref: 'message', value: this.state.text, onChange: this.onTextChange, onKeyDown: this.onKeyDown }),
					input({ type: 'submit', value: 'Send' }))
			}
		}

		const ChatForm = React.createFactory(React.createClass(_ChatForm.prototype));

		class _Chat {
			get displayName() { return "Chat" }

			onAcceptRequestClick() {
				chatActions.acceptChatRequest(this.props.chat.get('id'));
			}

			onRejectRequestClick() {
				chatActions.rejectChatRequest(this.props.chat.get('id'));
			}

			onCloseChatClick() {
				if (this.props.chat.get('state') == 'established') {
					chatActions.closeChatRequest(this.props.chat.get('id'));
				}
			}

			render() {
				let ch = this.props.chat;
				const state = ch.get('state');

				let content = null;

				if (state == 'established') {
					content = div({ className: "other" },
						div({ className: "content" }, MessagesList({ chat: ch })), ChatForm({ chat: ch }));
				} else if (state == 'requested') {
					content = div({ className: "other" },
						div({ className: "content text" },
							p({ className: "accept-request" }, a({ onClick: this.onAcceptRequestClick }, "Accept request")),
							p({ className: "reject-request" }, a({ onClick: this.onRejectRequestClick }, "Reject request"))));
				} else if (state == 'waiting') {
					content = div({ className: "other" },
						div({ className: "content text" }, p({ className: 'waiting' }, "Waiting")));
				} else {
					content = div({ className: "other" },
						div({ className: "content text" }, p({ className: 'preparing' }, "Preparing")));
				}

				return div({ className: "chat" },
					div({ className: "name" }, ch.get('name'), (this.props.chat.get('state') == 'established') ? [ ' - ', a({ onClick: this.onCloseChatClick }, 'Close') ] : null),
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
							a({ href: "#", onClick: this.onSignOutClick }, userStore.nick + ": Logout")),
						div({ className: "second-row" },
							a({ href: "#", onClick: this.onAddChatClick }, "+"))),
					div({ className: "chats" },
						chatStore.chats.map(x => Chat({ chat: x })).toArray()));
			}

		}

		this.component = React.createFactory(React.createClass(_ChatPage.prototype));
	}
}
