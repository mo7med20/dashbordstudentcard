/* @refresh reload */
import { render } from 'solid-js/web';
import App from './App';
import studentData from './data.json';

const root = document.getElementById('root');

render(() => <App data={studentData} />, root);
