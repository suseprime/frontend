const Dispatcher = require('flux').Dispatcher;
import { Inject } from '../../../external/di';
import { MessageStore } from '../stores/MessageStore';
import { ChatStore } from '../stores/ChatStore';
import { ActionTypes } from '../constants/AppConstants';

@Inject(Dispatcher, ChatStore)
export class ChatNotifications {
  constructor(dispatcher, chatStore) {
    if('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission((permission) => {
        if(permission === 'granted') {
        }
      });
    }
    
    dispatcher.register(this._registerEvents.bind(this));
    this._chatStore = chatStore;
  }

  _registerEvents(payload) {
    if (payload.action.type == ActionTypes.RECEIVE_MESSAGE)
      this.onReceiveMessage(payload.action);
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
