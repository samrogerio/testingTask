import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';

import Page from './Page';

class Router {
  constructor(props) {
    this.props = props;
    this.routes = this.props.routes || {};
    this.index = this.props.index || '';

    this.historyType = this.props.historyType || 'hash';
    this.hashBased = this.historyType.toLowerCase().indexOf('hash') > 0;
    this.base = this.hashBased ? '#' : '/';
    this.historyOptions = this.props.historyOptions || {};
    this.historyLimit = this.props.historyLimit || null;

    this.construct();
  }

  construct() {
    this.history = this.createHistory();
    this.setListeners();
    this.init();
  }

  init() {
    this.initRoutes();
    this.setCatchAll();
    this.setStartRout();
  }

  createHistory() {
    switch (this.historyType) {
      case 'memory':
        return createMemoryHistory(this.historyOptions);

      case 'browser':
      case 'browserHash':
        return createBrowserHistory(this.historyOptions);

      default:
        return createHashHistory(this.historyOptions);
    }
  }

  initRoutes() {
    Object.keys(this.routes).forEach(rout => {
      this.routes[rout] = new this.routes[rout]({
        history: this.history,
        root: this.props.root,
        hashBased: this.hashBased,
        match: {
          pathname: `${this.base}${rout}`
        }
      });
    });
  }

  setCatchAll() {
    this.notFound = {}.hasOwnProperty.call(this.routes, '404') ? '404' : this.index;
  }

  setStartRout() {
    const paramType = this.hashBased ? 'hash' : 'pathname';
    const location = this.history.location[paramType].substring(1);
    this.redirect(location ? location : this.index, this.history.location.search);
  }

  setListeners() {
    this.history.listen(({ hash, pathname }) => {
      const path = (this.hashBased ? hash : pathname).substring(1);
      this.switch(path);
    });
  }

  redirect(path, search) {
    this.history.replace({ pathname: `${this.base}${path}`, search });
  }

  checkRange(path) {
    if (!this.history.location.search) {
      this.redirect(path, `?index=${this.history.length}`);
    } else {
      if (
        this.history.length - parseInt(this.history.location.search.split('=').pop(), 10) >
        this.historyLimit - 1
      ) {
        this.currentLocation = path;
        this.history.goForward();
      }
    }
  }

  switch(location) {
    const isExist = {}.hasOwnProperty.call(this.routes, location);
    const path = isExist ? location : this.notFound;

    if (!isExist) {
      this.redirect(path);
      return;
    }

    if (this.historyLimit) {
      this.checkRange(path);
    }

    if (this.currentLocation !== path && this.routes[path] instanceof Page) {
      this.currentLocation = path;

      if (this.routes[this.currentLocation].mounted) {
        this.routes[this.currentLocation].pageWillUnMount();
      }

      this.routes[path].render();
    }
  }
}

export default Router;
