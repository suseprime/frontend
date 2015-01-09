const React = require('react');
import { App } from './components/App.react';
import { Injector, Provide } from '../../external/di';
import { Element } from './library/react/element.js';

const injector = new Injector();
const app = injector.get(App);
const elements = injector.get(Element)

window.React = React;

React.render(app.component(), document.getElementById('app'));