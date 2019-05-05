import React, { Component } from 'react';
import { getDisabledDays } from './utils';
import './App.css';

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

class App extends Component {
  state = {
    inputDates: '',
    dates: [],
    disabledRanges: []
  };

  handleUpdateDates = () => {
    this.setState({
      dates: [...this.state.dates, this.state.inputDates]
    });
  };

  handleCalculate = () => {
    const disabledRanges = getDisabledDays(this.state.dates);
    console.log(disabledRanges);
    this.setState({ disabledRanges });
  };

  renderDates() {
    const rows = [];
    this.state.dates.forEach(item => {
      rows.push(<div key={Math.random()}>{item}</div>);
    });
    return rows.length === 0 ? '[]' : rows;
  }

  renderMonth(year = '2019', month) {
    const d = new Date(year, month, 0);
    const w = WEEK_DAYS.map(it => <div className="calendar-week-t">{it}</div>);
    const days = getDaysInMonth(year, month);
    const rows = [];
    for (let i = 1; i <= days; i += 7) {
      const d = [];
      for (let y = i; y < i + 7; y += 1) {
        if (y > days) {
          d.push(<div key={Math.random()} className="calendar-week-d-empty" />);
        } else {
          let isMarked = false;
          let isDisabled = false;
          const d2 = new Date(year, month - 1, y);

          this.state.dates.forEach(date => {
            const d1 = new Date(date);
            // console.log('compare', d1, d2);
            if (d1.getTime() === d2.getTime()) {
              isMarked = true;
            }
          });

          this.state.disabledRanges.forEach(range => {
            if (d2.getTime() >= range.from && d2.getTime() <= range.to) {
              isDisabled = true;
            }
          });

          d.push(
            <div
              key={Math.random()}
              className="calendar-week-d"
              style={{
                border: isMarked ? '3px solid red' : '',
                backgroundColor: isDisabled ? 'lightgrey' : 'white'
              }}
            >
              {y}
            </div>
          );
        }
      }
      rows.push(
        <div key={Math.random()} className="calendar-week-t-c">
          {d}
        </div>
      );
    }
    return (
      <div key={Math.random()} className="calendar">
        <div key={Math.random()} className="calendar-title">
          {monthNames[d.getMonth()]}
        </div>
        {/* <div className="calendar-week-t-c">{w}</div> */}
        {rows}
      </div>
    );
  }

  renderYear(year) {
    const rows = [];
    for (let i = 1; i < 13; i++) {
      rows.push(this.renderMonth(year, i));
    }
    return [
      <div key={Math.random()} className="calendar-year-title">
        {year}
      </div>,
      <div key={Math.random()} className="calendar-year">
        {rows}
      </div>
    ];
  }

  render() {
    const { inputDates } = this.state;

    return (
      <div className="App">
        <div className="App-left">
          <div>Dates</div>
          <div>{this.renderDates()}</div>
          <br />
          <span>Input dates</span>
          <br />
          <input
            name="dates"
            value={inputDates}
            onChange={e => this.setState({ inputDates: e.target.value })}
          />
          <button onClick={this.handleUpdateDates}>Update</button>
          <button onClick={this.handleCalculate}>Calculate</button>
        </div>
        {this.renderYear('2019')}
        {this.renderYear('2020')}
      </div>
    );
  }
}

export default App;
