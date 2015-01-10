const React = require('react');
import { App } from './components/App.react';
import { Injector, Provide } from '../../external/di';
import { Element } from './library/react/element.js';
import { SuseDispatcher } from './library/Dispatcher';

const injector = new Injector([SuseDispatcher]);
const app = injector.get(App);
const elements = injector.get(Element)

window.React = React;

React.render(app.component(), document.getElementById('app'));