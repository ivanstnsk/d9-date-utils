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
    inputMode: 'day',
    inputDates: '',
    inputRange: null,
    dates: [],
    ranges: [],
    disabledRanges: [
      {
        from: new Date('1970-01-01').getTime(),
        to: new Date('2099-12-31').getTime()
      }
    ]
  };

  handleUpdateDates = () => {
    if (this.state.inputMode === 'day') {
      this.setState({
        dates: [...this.state.dates, this.state.inputDates]
      });
    }
    if (this.state.inputMode === 'range') {
      this.setState({
        ranges: [...this.state.ranges, this.state.inputDates],
        inputRange: null
      });
    }
  };

  handleCalculate = () => {
    if (this.state.inputMode === 'day') {
      const disabledRanges = getDisabledDays(this.state.dates);
      console.log(disabledRanges);
      this.setState({ disabledRanges });
    }
  };

  handleToggleMode = () => {
    this.setState({
      inputMode: this.state.inputMode === 'day' ? 'range' : 'day'
    });
  };

  handleDayClick = date => {
    const { inputMode } = this.state;

    if (inputMode === 'day') {
      this.setState({ inputDates: date });
    }

    if (inputMode === 'range') {
      const { inputRange } = this.state;
      if (inputRange) {
        if (inputRange.from) {
          this.setState({
            inputRange: { from: inputRange.from, to: date },
            inputDates: `${inputRange.from}-${date}`
          });
        }
      } else {
        this.setState({ inputRange: { from: date } });
      }
    }
  };

  renderDates() {
    const rows = [];
    this.state.dates.forEach(item => {
      rows.push(<div key={Math.random()}>{item}</div>);
    });
    return rows.length === 0 ? '[]' : rows;
  }

  renderRanges() {
    const rows = [];
    this.state.ranges.forEach(item => {
      rows.push(<div key={Math.random()}>{item}</div>);
    });
    return rows.length === 0 ? '[]' : rows;
  }

  renderMonth(year = '2019', month) {
    const d = new Date(year, month, 0);
    const w = WEEK_DAYS.map(it => <div className="calendar-week-t">{it}</div>);
    const days = getDaysInMonth(year, month);
    const rows = [];

    let rangeD1 = null;
    let rangeD2 = null;
    if (
      this.state.inputRange &&
      this.state.inputRange.from &&
      this.state.inputRange.to
    ) {
      rangeD1 = new Date(this.state.inputRange.from);
      rangeD2 = new Date(this.state.inputRange.to);
    }

    for (let i = 1; i <= days; i += 7) {
      const d = [];
      for (let y = i; y < i + 7; y += 1) {
        if (y > days) {
          d.push(<div key={Math.random()} className="calendar-week-d-empty" />);
        } else {
          let isMarked = false;
          let isDisabled = false;
          let isInRange = false;
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

          if (rangeD1 && rangeD2) {
            if (
              d2.getTime() >= rangeD1.getTime() &&
              d2.getTime() <= rangeD2.getTime()
            ) {
              isInRange = true;
            }
          }

          d.push(
            <div
              key={Math.random()}
              className="calendar-week-d"
              style={{
                border: isInRange
                  ? '2px solid blue'
                  : isMarked
                  ? '3px solid red'
                  : '',
                backgroundColor: isDisabled ? 'lightgrey' : 'white'
              }}
              onClick={() => this.handleDayClick(`${year}.${month}.${y}`)}
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
          <div>Ranges</div>
          <div>{this.renderRanges()}</div>
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
          <button onClick={() => this.setState({ inputRange: null })}>
            Clear Range
          </button>
          <br />
          <br />
          <div>
            Mode: {this.state.inputMode}
            <button onClick={this.handleToggleMode}>Toggle Mode</button>
          </div>
        </div>
        {this.renderYear('2019')}
        {this.renderYear('2020')}
      </div>
    );
  }
}

export default App;
