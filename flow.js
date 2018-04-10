/* eslint no-console: "off" */
const isBrowser = typeof window !== 'undefined' && ({}).toString.call(window) === '[object Window]';
// const isNode = typeof global !== "undefined" && ({}).toString.call(global) === '[object global]';

const defSettings = {
  isLogging: true,
  isErrors: true,
  logStyle: isBrowser ? 'color: green' : '\x1b[32m%s\x1b[0m',
  errStyle: isBrowser ? 'color: red' : '\x1b[31m%s\x1b[0m',
  logName: '--> ',
};

module.exports = class Flow {
  constructor(params) {
    if (params) {
      this.steps = params.steps || {};
      this.settings = params.settings || {};
    } else {
      this.settings = {};
    }
    Object.keys(defSettings).forEach((key) => {
      if (this.settings[key] === undefined) {
        this.settings[key] = defSettings[key];
      }
    });
    return this;
  }

  done(stepName, dataForNextStep) {
    const message = `${this.settings.logName}${stepName}`;
    const doneCb = this.done.bind(this);
    const stepHandler = this.steps[stepName];

    this.LOG(message); // Previous step is finished

    if (stepHandler) {
      if (typeof stepHandler === 'function') {
        stepHandler(doneCb, dataForNextStep);
        return;
      }
      if (stepHandler instanceof Array) {
        if (stepHandler.some(func => typeof func !== 'function')) {
          this.ERR('FLOW TYPE ERROR: handler must be a function');
          return false;
        }
        stepHandler.forEach(func => func(doneCb, dataForNextStep));
        return;
      }

      this.ERR(`FLOW TYPE ERROR: wrong type of a handler: "${stepHandler}"`);
      return false;
    } else {
      this.ERR(`FLOW ERROR: undefined handler for step: "${stepName}"`);
      return false;
    }
  }
  start(dataForNextStep) {
    this.done('start', dataForNextStep);
  }


  // Let's imagine these are private methods
  ERR(msg) {
    const { isErrors, errStyle } = this.settings;
    if (isErrors) {
      if (!errStyle) console.error(msg);
      else if (isBrowser) console.error(`%c${msg}`, errStyle);
      else console.error(errStyle, msg);
    }
  }
  LOG(msg) {
    const { isLogging, logStyle } = this.settings;
    if (isLogging) {
      if (!logStyle) console.log(msg);
      else if (isBrowser) console.log(`%c${msg}`, logStyle);
      else console.log(logStyle, msg);
    }
  }
};
