import { fromEvent, filter, sideEffect, map } from 'pipe-me';

class Page {
  constructor(props) {
    this.props = props;
    this.root = this.props.root;

    this.match = this.props.match;
    this.hashBased = this.props.hashBased;
    this.construct();
  }

  construct() {
    this.content = '';
    this.title = document.title;
    this.mounted = false;
    this.setActions();
  }

  pageWillMount() {
    this.setContent();
    this.setTitle();
  }

  pageDidMount() {
    this.mounted = true;
    this.setEventlisteners();
  }

  pageWillReceiveProps() {
    this.setContent();
    this.render();
  }

  pageWillUnMount() {
    this.mounted = false;
    this.removeEventlisteners();
  }

  shouldPageUpdate() {
    const {
      location: { hash, pathname }
    } = this.props.history;
    const path = this.hashBased ? hash : pathname;
    return this.root.innerHTML !== this.getHTML() && this.match.pathname === path;
  }

  setContent() {
    this.content = '';
  }

  setTitle() {
    document.title = this.title;
  }

  getHTML() {
    return `
    <div class="container">
      <div class="row">
        <nav class="navbar navbar-light bg-light">
          <a class="navbar-brand" href="#menu">SPA example</a>
        </nav>
      </div>
      <div class="row">
        <button type="button" class="btn btn-light" data-type="back">Back</button>
      </div>
      ${this.content.trim()}
    </div>`;
  }

  setEventlisteners() {
    this.buttonClicled =
      fromEvent(this.root.firstChild, 'click')
      |> filter(event => event.target.tagName === 'BUTTON')
      |> filter(event => event.target.dataset && event.target.dataset.type)
      |> map(event => ({ type: event.target.dataset.type }))
      |> sideEffect(state => this.callAction(state));
  }

  setActions() {
    this.actions = {
      back: () => this.props.history.goBack()
    };
  }

  callAction({ type }) {
    if ({}.hasOwnProperty.call(this.actions, type)) {
      if (typeof this.actions[type] === 'function') {
        this.actions[type]();
      }
    }
  }

  removeEventlisteners() {
    this.buttonClicled = null;
  }

  render() {
    if (this.shouldPageUpdate()) {
      this.pageWillMount();
      this.root.innerHTML = this.getHTML().trim();
      this.pageDidMount();
    }
  }
}

export default Page;
