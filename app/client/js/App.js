const React = require('react');
import { BaseStore } from './stores/BaseStore';


class _App {
	render() {
		return (
			<div>
				<h1>Cool and nice :) :) :)</h1>
				<p>We were there</p>
			</div>
		);
	}
}

export const App = React.createClass(_App.prototype);