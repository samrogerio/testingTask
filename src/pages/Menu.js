import Page from 'Components/Page';

class MenuPage extends Page {
  constructor(props) {
    super(props);

    this.title = 'Menu';
  }

  setContent() {
    this.content = `
      <div class="row">
        <ul class="nav">
          <li class="nav-item">
            <a class="nav-link" href="#items">Товары</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#about">О нас</a>
          </li>
        </ul>
      </div>`;
  }
}

export default MenuPage;
