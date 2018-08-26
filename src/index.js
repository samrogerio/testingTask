import invariant from 'invariant';
import render from './app';

const root = document.getElementById('root');

invariant(root !== null, 'Div with ID #root not found');

render(root);
