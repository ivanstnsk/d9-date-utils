import moment from 'moment';

function parseStrToDate(value) {
  if (typeof value === 'string') {
    return new Date(value).getTime();
  }
  if (Array.isArray(value)) {
    if (typeof value[0] === 'string') {
      return value.map(it => new Date(it).getTime());
    }
    return value.map(range => ({
      from: new Date(range.from).getTime(),
      to: new Date(range.to).getTime()
    }));
  }
  if (typeof value === 'object') {
    return {
      from: new Date(value.from).getTime(),
      to: new Date(value.to).getTime()
    };
  }
  throw new Error('Illegal argument for function!');
}
function isDayInRangeOfDates(day, range) {
  return day >= range.from && day < range.to;
}

// function isRangeAIntersectsRangeB(rangeA, rangeB) {
//   console.log('Check intersection start');
//   console.log(
//     `From: ${moment(rangeA.from).format('YYYY.MM.DD')} - To: ${moment(
//       rangeA.to
//     ).format('YYYY.MM.DD')}`
//   );
//   console.log(
//     `From: ${moment(rangeB.from).format('YYYY.MM.DD')} - To: ${moment(
//       rangeB.to
//     ).format('YYYY.MM.DD')}`
//   );
//   console.log('Check intersection end');
//   if (
//     (rangeA.from > rangeB.to && rangeA.to > rangeB.to) ||
//     (rangeA.from < rangeB.from && rangeA.to < rangeB.from)
//   ) {
//     return false;
//   }
//   return true;
// }

function normalizeRanges(ranges) {
  return ranges.filter(r => r.from <= r.to);
}

function splitRange(value, initRange) {
  if (typeof value === 'object') {
    if (value.from > initRange.from) {
      if (value.to < initRange.to) {
        let d = new Date(value.from);
        d.setDate(d.getDate() - 1);
        const prevDay = d.getTime();
        d = new Date(value.to);
        d.setDate(d.getDate() + 1);
        const nextDay = d.getTime();
        return [
          { from: initRange.from, to: prevDay },
          { from: nextDay, to: initRange.to }
        ];
      }
      return [{ from: value.from, to: initRange.to }];
    }
    if (value.to > initRange.from) {
      return [{ from: value.to, to: initRange.to }];
    }
  }

  const d = new Date(value);
  d.setDate(d.getDate() + 1);
  const nextDay = d.getTime();
  d.setDate(d.getDate() - 2);
  const prevDay = d.getTime();

  return [
    {
      from: initRange.from,
      to: prevDay
    },
    {
      from: nextDay,
      to: initRange.to
    }
  ];
}

function debugPrint(ranges) {
  ranges.forEach(r => {
    console.log(
      `From: ${moment(r.from).format('YYYY.MM.DD')} - To: ${moment(r.to).format(
        'YYYY.MM.DD'
      )}`
    );
  });
}

function sortRanges(ranges) {
  return ranges.sort((rangeA, rangeB) => {
    if (rangeA.from > rangeB.from) {
      return 1;
    }
    if (rangeA.from < rangeB.from) {
      return -1;
    }
    return 0;
  });
}

/**
 * Takes an Array of days and range of dates and returns an array of date
 * ranges that not include any provided days.
 *
 * @param {string[]} days - Array of days in format "YYYY-MM-DD"
 * @param {Object[]} initRange - Range of init dates
 * @param {string} initRange.from - Date start in format "YYYY-MM-DD"
 * @param {string} initRange.to - Date finish in format "YYYY-MM-DD"
 * @param {boolean} sort - If need to sort date ranges after calculations
 */
function substractDaysFromRange(days, initRange, sort = false) {
  let newRanges = [initRange];

  for (let i = 0; i < days.length; i += 1) {
    const pday = days[i];

    for (let r = 0; r < newRanges.length; r += 1) {
      const range = newRanges[r];

      const isInRange = isDayInRangeOfDates(pday, range);
      console.log('Checking if day in range: ', isInRange);

      if (isInRange) {
        const splittedRanges = splitRange(pday, range);
        console.log('Splitting range');
        debugPrint(newRanges);

        const [from, to] = splittedRanges;
        const fr = newRanges.filter((_, index) => index !== r);

        newRanges = fr;
        newRanges.push(from);
        newRanges.push(to);
      }
    }
  }

  if (sort) {
    newRanges = sortRanges(newRanges);
  }

  return newRanges;
}

/**
 * Takes an Array of date ranges and initial range of dates and returns
 * an array of date ranges that not include any provided ranges.
 *
 * @param {Object[]} ranges - Array of date ranges
 * @param {string} ranges.from - Date start in format "YYYY-MM-DD"
 * @param {string} ranges.to - Date finish in format "YYYY-MM-DD"
 * @param {Object[]} initRange - Range of init dates
 * @param {string} initRange.from - Date start in format "YYYY-MM-DD"
 * @param {string} initRange.to - Date finish in format "YYYY-MM-DD"
 * @param {boolean} sort - If need to sort date ranges after calculations
 */
// function substractRangesFromRange(ranges, initRange, sort = false) {
//   let newRanges = [
//     {
//       from: new Date(initRange.from).getTime(),
//       to: new Date(initRange.to).getTime()
//     }
//   ];

//   for (let i = 0; i < ranges.length; i += 1) {
//     const range = {
//       from: new Date(ranges[i].from).getTime(),
//       to: new Date(ranges[i].to).getTime()
//     };

//     for (let r = 0; r < newRanges.length; r += 1) {
//       const isIntersects = isRangeAIntersectsRangeB(range, newRanges[r]);
//       console.log('Checking if intersects: ', isIntersects);

//       if (isIntersects) {
//         const splittedRanges = splitRange(range, newRanges[r]);
//         console.log('Splitting range');
//         debugPrint(splittedRanges);

//         const fr = newRanges.filter((_, index) => index !== r);
//         // console.log('filtered', fr);
//         newRanges = fr;
//         console.log('after filter');
//         debugPrint(newRanges);

//         newRanges.push(splittedRanges[0]);
//         if (splittedRanges[1]) {
//           newRanges.push(splittedRanges[1]);
//         }

//         console.log('after splitting');
//         debugPrint(newRanges);

//         // console.log(
//         //   splittedRanges[0],
//         //   moment(splittedRanges[0].from).format('YYYY.MM.DD'),
//         //   moment(splittedRanges[0].to).format('YYYY.MM.DD')
//         // );
//         // if (splittedRanges[1]) {
//         //   console.log(
//         //     splittedRanges[1],
//         //     moment(splittedRanges[1].from).format('YYYY.MM.DD'),
//         //     moment(splittedRanges[1].to).format('YYYY.MM.DD')
//         //   );
//         // }
//         // for (let s = 0; s < splittedRanges.length; s += 1) {
//         //   newRanges.push(splittedRanges[s]);
//         // }
//       }
//     }

//   }

//   if (sort) {
//     newRanges = sortRanges(newRanges);
//   }

//   return newRanges;
// }

export function getDisabledIntervalsForDays(daysStr) {
  const rangeStr = {
    from: '1970-01-01',
    to: '2099-12-31'
  };
  const range = parseStrToDate(rangeStr);
  const days = parseStrToDate(daysStr);

  const substractedDayRanges = substractDaysFromRange(days, range, true);

  return substractedDayRanges;
}

export function getDisabledDays(daysStr) {
  // const daysStr = ['2019-04-25', '2019-04-23'];
  // const rangesStr = [
  //   { from: '2019-04-02', to: '2019-04-13' },
  //   { from: '2019-04-10', to: '2019-04-14' }
  // ];
  const rangeStr = {
    from: '1970-01-01',
    to: '2099-12-31'
  };
  const days = parseStrToDate(daysStr);
  // const ranges = parseStrToDate(rangesStr);
  const range = parseStrToDate(rangeStr);

  // console.log('is intersects', isRangeAIntersectsRangeB(ranges[0], ranges[1]));

  const substractedDayRanges = substractDaysFromRange(days, range, true);
  console.log('Substract days from ranges');
  debugPrint(substractedDayRanges);

  return substractedDayRanges;

  // const substractedRangeRanges = substractRangesFromRange(ranges, range, true);
  // console.log('Substract ranges from ranges');
  // debugPrint(substractedRangeRanges);
}
