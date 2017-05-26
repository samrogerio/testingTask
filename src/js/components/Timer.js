import React, {Component} from 'react';

class Timer extends Component {

	render() {
		return (
			<span>До окончания: <span className="time">{this.props.timeLeft}</span> сек</span>
		);
	}
}

export default Timer;
