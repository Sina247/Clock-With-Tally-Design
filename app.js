window.addEventListener("DOMContentLoaded", () => {
  const c = new Clock24(".clock");
});

class Clock24 {
  constructor(el) {
    this.el = document.querySelector(el);

    this.init();
  }
  init() {
    this.timeUpdate();
  }
  get timeAsObject() {
    const date = new Date();
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();

    return { h, m, s };
  }
  get timeAsString() {
    return this.timeDigitsGrouped.join(":");
  }
  get timeDigitsGrouped() {
    let { h, m, s } = this.timeAsObject;

    if (h < 10) h = `0${h}`;
    else h = `${h}`;
    if (m < 10) m = `0${m}`;
    else m = `${m}`;
    if (s < 10) s = `0${s}`;
    else s = `${s}`;

    return [h, m, s];
  }
  get tallies() {
    const rows = 12;
    const time = this.timeAsObject;
    const timeKeys = Object.keys(time);
    const obj = {};

    for (const key of timeKeys) {
      obj[key] = [];

      for (let r = 0; r < rows; ++r) {
        obj[key].push(0);
      }
    }

    for (const key in obj) {
      const value = time[key];
      let fives = Math.floor(value / 5);

      for (let f = 0; f < fives; ++f) {
        obj[key][f] = 5;
      }

      const remainder = value % 5;
      obj[key][fives] = remainder;
    }

    return obj;
  }
  timeUpdate() {
    this.el?.setAttribute("aria-label", this.timeAsString);

    const columns = this.tallies;
    for (const column in columns) {
      const columnEl = this.el?.querySelector(`[data-column="${column}"]`);

      for (const strokesIndex in columns[column]) {
        const strokesEl = columnEl?.querySelectorAll("[data-strokes]")[strokesIndex];
        strokesEl?.setAttribute("data-strokes", columns[column][strokesIndex]);
      }
    }
    
    clearTimeout(this.timeUpdateLoop);
    this.timeUpdateLoop = setTimeout(this.timeUpdate.bind(this), 1e3);
  }
}