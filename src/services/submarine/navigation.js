class Navigation {
  constructor(history) {
    this._history = history;
  }

  _push = route => {
    this._history.push(route);
  };

  navHome = () => {
    this._push('/');
  };
}

export default Navigation;
