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
    this.outRanges = this.outRanges.map((r, index) => {
      const f = new Date(r.from);
      const t = new Date(r.to);
      f.setDate(f.getDate() + 1);
      t.setDate(t.getDate() - 1);

      if (index === 0) {
        f.setDate(f.getDate() - 1);
      }
      if (index === this.outRanges.length - 1) {
        t.setDate(t.getDate() + 1);
      }
      return {
        from: f.getTime(),
        to: t.getTime()
      };
    });
    this.outRanges = this.outRanges.filter(r => r.from <= r.to);
  }

  get() {
    return this.outRanges;
  }

  getShortDates() {
    this.dateRanges = this.outRanges.map(it => {
      const f = new Date(it.from);
      const t = new Date(it.to);
      return {
        from: `${f.getFullYear()}.${('0' + (f.getMonth() + 1)).slice(-2)}.${(
          '0' + f.getDate()
        ).slice(-2)}`,
        to: `${t.getFullYear()}.${('0' + (t.getMonth() + 1)).slice(-2)}.${(
          '0' + t.getDate()
        ).slice(-2)}`
      };
    });
    return this.dateRanges;
  }
}
