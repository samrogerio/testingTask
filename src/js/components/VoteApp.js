import React, {Component} from 'react';
import Timer from "./Timer";
import Row from "./Row";

let CONFIG = {
	candidateCount: 9,
	voteDuration: 9
};

let candidates = new Array;

class VoteApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isVoteStarted: false,
			timeLeft: null,
			winner: null,
			displayedCandidates: new Object
		};
	}

	componentWillMount() {
		candidates.length = 0;
		for (let i = 1; i <= CONFIG.candidateCount; i++) {
			let obj = new Object;
			obj.name = "Кандидат " + i;
			obj.voteValue = 0;
			candidates.push(obj);
		}

		this.setState({
			displayedCandidates: candidates,
			timeLeft: CONFIG.voteDuration
		});
  	}

  	getRandomInt(min, max) {
  		min = Math.ceil(min);
  		max = Math.floor(max);
  		return Math.floor(Math.random() * (max - min)) + min;
	}

	resetVoices() {
		candidates.forEach((item) => {
			item.voteValue = 0;
		})
	}

	byField(field) {
		return (a, b) => {
			return a[field] > b[field] ? 1 : - 1;
		}
	}

	alertWinner() {
		this.setState({
			winner: this.state.displayedCandidates[0].name
		});
	}

	startVote() {
		let _this = this;
		let step = (100 / CONFIG.voteDuration) / 100 + 0.00000000000099;
		this.resetVoices();
		this.state.displayedCandidates.sort(this.byField("name"));

		let timerId1 = setInterval(() => {
			let candidateNumber = _this.getRandomInt(0, _this.state.displayedCandidates.length);
			_this.state.displayedCandidates[candidateNumber].voteValue += step;
		}, 10);

		let timerId2 = setInterval(() => {
			this.state.displayedCandidates.sort(this.byField("voteValue")).reverse();
			_this.setState({
				timeLeft: this.state.timeLeft - 1
			});
		}, 1000);

		setTimeout(() => {
			clearInterval(timerId1);
			clearInterval(timerId2);
			let sum = 0;
			this.state.displayedCandidates.forEach((item) => {
				sum += item.voteValue;
			});
			console.log(sum);
			this.alertWinner();
			this.setState({
				isVoteStarted: false
			});
		}, (CONFIG.voteDuration * 1000) + 10)

		return this.setState({
			isVoteStarted: true,
			winner: null,
			timeLeft: CONFIG.voteDuration
		});
	}

	render() {
		return (
			<div className="voteapp">
				<div className="panel panel-default">
					<div className="panel-heading">Тестовое задание №1</div>
					<div className="panel-body">
   	 					<p>Есть N (вынести в конфиг) кандидатов. Каждые 10мс с равной долей вероятности
   	 					генерируется голос за одного из кандидатов.
   	 					Голосование длится 9с (конфиг). Пользователь видит время до окончания голосования
   	 					и отсортированную таблицу с кандидатами и их результатами голосования в процентах
   	 					(округлить до десятых, учесть тот факт, что сумма всех процентов должна быть строго равна 100).
   	 					Данные обновляются 1 раз в секунду. По окончанию выводится сообщение о победителе.</p>
   	 					    <ul>
      							<li>ES6/7 как основной язык приложения</li>
      							<li>React для пользовательского интерфейса</li>
      							<li>Bootstrap</li>
      							<li>Код в репозиторий на github. Развернуть можно там же.</li>
    						</ul>
  					</div>
  				</div>
				<table className="table table-striped">
					<thead>
						<tr>
							<td>Кандидат</td>
							<td>Голос, %</td>
						</tr>
					</thead>
					<tbody>
						{
							this.state.displayedCandidates.map((el, index) =>{
								return <Row name={el.name} key={index} voteValue={Math.round((el.voteValue) * 10) / 10}/>
							})
						}
					</tbody>
				</table>
				<div className="panel panel-default bottom">
					<button
						name="button"
						value="start"
						onClick={this.startVote.bind(this)}
						disabled={this.state.isVoteStarted}
						className="btn btn-primary">
						Старт
					</button>
					<div className="alert alert-success" role="alert">Победитель: {this.state.winner || "неизвестен"}</div>
					<Timer timeLeft={this.state.timeLeft}/>
				</div>

			</div>
		);
	}
}

export default VoteApp;
