import { render } from 'preact';
import { App } from './App';
import { installPerfProbe } from './Perf/PerfProbe';
import '../Design/Tokens.css';

const params = new URLSearchParams(window.location.search);
if (params.has('perf')) installPerfProbe();

const app = document.getElementById('app');
if (app) {
  render(<App />, app);
}
