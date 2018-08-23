import { fromPromise, sideEffect } from 'pipe-me';
import Page from 'Components/Page';

import items from './items';

class ItemsPage extends Page {
  constructor(props) {
    super(props);

    this.title = 'Items Page';
  }

  pageDidMount() {
    super.pageDidMount();

    if (!this.items) {
      this.fetchItems();
    }
  }

  fetchItems() {
    // eslint-disable-next-line
    const fetch = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(items);
      }, 2000);
    });

    fromPromise(fetch) |> sideEffect(data => this.setData(data));
  }

  setData(data) {
    this.items = data;
    super.pageWillReceiveProps();
  }

  renderRows() {
    const getRowHTML = (item, i) => `
      <tr>
        <th scope="row">${i + 1}</th>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
      </tr>`;

    return Object.keys(this.items.items).reduce((acc, item, i) => {
      acc += getRowHTML(this.items.items[item], i); // eslint-disable-line
      return acc;
    }, '');
  }

  setContent() {
    this.content = `
      <div class="row">
        ${
          this.items
            ? `
          <span>Items loaded. Total: ${this.items.total}</span>
          <table class="table table-striped">
            <tbody>
              <tr>
                <th scope="col">#</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
              ${this.renderRows()}
            </tbody>
          </table>`
            : `<span>Items is fetching...</span>`
        }
      </div>`;
  }
}

export default ItemsPage;
