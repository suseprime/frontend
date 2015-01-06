const React = require('react');
import { App } from './App';

window.React = React;

React.render(
	<App />,
	document.getElementById('app')
);