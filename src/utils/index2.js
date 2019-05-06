function splitRange(rangeA, rangeB) {
  if (typeof rangeB === 'object') {
    if (rangeB.from > rangeA.from && rangeB.to < rangeA.to) {
      return [
        {
          from: rangeA.from,
          to: rangeB.from
        },
        {
          from: rangeB.to,
          to: rangeA.to
        }
      ];
    } else {
      if (rangeB.from < rangeA.from && rangeB.to > rangeA.to) {
        return [
          {
            from: rangeA.from,
            to: rangeA.from
          }
        ];
      }
      if (rangeB.from > rangeA.from && rangeB.from < rangeA.to) {
        return [
          {
            from: rangeA.from,
            to: rangeB.from
          }
        ];
      } else if (rangeB.to > rangeA.from && rangeB.to < rangeA.to) {
        return [
          {
            from: rangeB.to,
            to: rangeA.to
          }
        ];
      } else {
        return [
          {
            from: rangeA.from,
            to: rangeA.from
          }
        ];
      }
    }
  } else {
    return [
      {
        from: rangeA.from,
        to: rangeB
      },
      {
        from: rangeB,
        to: rangeA.to
      }
    ];
  }
}

function isInRange(rangeA, rangeB) {
  return (
    (rangeB.from < rangeA.to && rangeB.from > rangeA.from) ||
    (rangeB.to > rangeA.from && rangeB.to < rangeA.to)
  );
}

function isDateInRange(range, date) {
  return date > range.from && date < range.to;
}

export function removeRangesFromRange(ranges, range) {
  let finalRanges = [range];

  ranges.forEach(rB => {
    finalRanges.forEach(rA => {
      console.log('compare', rA, rB, isInRange(rA, rB));

      if (isInRange(rA, rB)) {
        const splitted = splitRange(rA, rB);
        console.log(splitted);
        finalRanges = finalRanges.filter(
          it => !(it.from === rA.from && it.to === rA.to)
        );
        finalRanges = [...finalRanges, ...splitted];
      }
    });
  });

  return finalRanges;
}

export class DateUtils {
  range = null;
  ranges = [];
  dates = [];
  outRanges = [];

  setInitRange = range => (this.range = range);

  setRanges = ranges => (this.ranges = ranges);

  setDates = dates => (this.dates = dates);

  process() {
    if (!this.range) {
      throw new Error('Provide an init range!');
    }

    this.outRanges = [this.range];
    this.ranges.forEach(rB => {
      this.outRanges.forEach(rA => {
        console.log('compare', rA, rB, isInRange(rA, rB));

        if (isInRange(rA, rB)) {
          const splitted = splitRange(rA, rB);
          console.log(splitted);
          this.outRanges = this.outRanges.filter(
            it => !(it.from === rA.from && it.to === rA.to)
          );
          this.outRanges = [...this.outRanges, ...splitted];
        }
      });
    });

    this.dates.forEach(d => {
      this.outRanges.forEach(rA => {
        console.log('compare', rA, d, isDateInRange(rA, d));

        if (isDateInRange(rA, d)) {
          const splitted = splitRange(rA, d);
          console.log(splitted);
          this.outRanges = this.outRanges.filter(
            it => !(it.from === rA.from && it.to === rA.to)
          );
          this.outRanges = [...this.outRanges, ...splitted];
        }
      });
    });
  }

  sort() {
    this.outRanges = this.outRanges.sort((a, b) => {
      if (a.from > b.from) {
        return 1;
      }
      if (a.from < b.from) {
        return -1;
      }
      return 0;
    });
  }

  updateDateBounds() {
    this.outRanges = this.outRanges.map(r => ({
      from: r.from + 1,
      to: r.to - 1
    }));
    this.outRanges = this.outRanges.filter(r => r.from <= r.to);
  }

  get() {
    return this.outRanges;
  }
}
