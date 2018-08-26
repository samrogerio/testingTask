import Router from 'Components/Router';
import Menu from 'Pages/Menu';
import ItemsPage from 'Pages/ItemsPage';
import AboutPage from 'Pages/AboutPage';

import 'Styles/bootstrap.min';
import 'normalize.css';
import 'Styles/app';

const routes = {
  menu: Menu,
  items: ItemsPage,
  about: AboutPage
};

export default root => {
  const router = new Router({
    routes,
    root,
    historyOptions: {
      hashType: 'noslash'
    },
    index: 'menu',
    historyLimit: 10
  });

  return router;
};
