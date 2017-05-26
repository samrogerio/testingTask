import React, {Component} from 'react';

class Row extends Component {
	render() {
		return (
			<tr>
				<td>{this.props.name}</td>
				<td>{this.props.voteValue}</td>
			</tr>
		)
	}
}


export default Row;
