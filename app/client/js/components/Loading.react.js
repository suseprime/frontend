const React = require('react')
import { Inject } from '../../../external/di';
import { Element } from '../library/react/element.js';

let rq = (fl) => {
	return eval(fl.slice(17, fl.length));
};

let SVGs = {
  balls: rq(require('../../images/svg/loading-balls.svg')),
  bars: rq(require('../../images/svg/loading-bars.svg')),
  bubbles: rq(require('../../images/svg/loading-bubbles.svg')),
  cubes: rq(require('../../images/svg/loading-cubes.svg')),
  cylon: rq(require('../../images/svg/loading-cylon.svg')),
  spin: rq(require('../../images/svg/loading-spin.svg')),
  'spinning-bubbles': rq(require('../../images/svg/loading-spinning-bubbles.svg')),
  spokes: rq(require('../../images/svg/loading-spokes.svg'))
};

@Inject(Element)
export class Loading {
	constructor(elements) {
		let { div } = elements;

		class _Loading {
			getDefaultProps() {
				return {
					color: '#fff',
					height: 64,
					type: 'balls',
					width: 64
				};
			}

			render() {
				var svg = SVGs[this.props.type];
				var svgStyle = {
					fill: this.props.color,
					height: this.props.height,
					width: this.props.width
				};

				return div({ style: svgStyle, dangerouslySetInnerHTML: { __html: svg } });
			}

		}

		this.component = React.createFactory(React.createClass(_Loading.prototype));
	}
}
