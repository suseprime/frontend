import { Inject } from '../../../external/di';
import { MessageStore } from '../stores/MessageStore';
import { ChatStore } from '../stores/ChatStore';
import { ActionTypes } from '../constants/AppConstants';

@Inject(MessageStore, ChatStore)
export class ChatNotifications {
  constructor(messageStore, chatStore) {
    if('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission((permission) => {
        if(permission === 'granted') {
        }
      });
    }
    messageStore.listenOnAction(ActionTypes.RECEIVE_MESSAGE, (this.onReceiveMessage).bind(this));
    this._chatStore = chatStore;
  }

  onReceiveMessage(data) {
    if('Notification' in window && Notification.permission !== 'denied') {
      let { message, messageId, chatId } = data.data;
      let chatKey = this._chatStore.chats.findIndex((x) => x.get('id') == chatId);
      let nick = this._chatStore.chats.get(chatKey).get('name');

      console.log(data);
      let title = "New message from " + nick;
      let options = {
        body: message,
        tag: chatId + '_' + messageId
      };
      let notification = new Notification(title,  options);
      notification.onclick = () => {
        console.log('Clicked');
      };
    }
  }
}
