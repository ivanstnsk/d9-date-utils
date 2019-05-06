import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { DateUtils } from './utils/index2';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

const range = {
  from: new Date('2019.01.01').getTime(),
  to: new Date('2019.12.20').getTime()
};

const ranges = [
  {
    from: new Date('2019.02.01').getTime(),
    to: new Date('2019.02.20').getTime()
  },
  {
    from: new Date('2019.05.01').getTime(),
    to: new Date('2019.06.04').getTime()
  }
];
const dates = [new Date('2019.06.10').getTime()];

// const range = {
//   from: 1,
//   to: 30
// };
// const ranges = [
//   { from: 10, to: 12 },
//   { from: 13, to: 15 },
//   { from: 18, to: 20 }
// ];
// const dates = [12, 17, 21, 25];

const du = new DateUtils();
du.setInitRange(range);
du.setRanges(ranges);
du.setDates(dates);
du.process();
du.sort();
console.log('removed', du.getShortDates());
du.updateDateBounds();
console.log('Bounds', du.getShortDates());
