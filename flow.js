const defSettings = {
    isLogging: true,
    isErrors: true,

    logStyle: '\x1b[32m%s\x1b[0m',
    errStyle: '\x1b[31m%s\x1b[0m',

    logName: '--> ',
}


module.exports = class Flow {
    constructor (params) {
        this.steps = params.steps || {};
        this.settings = params.settings;
        for (let key in defSettings) {
            if (this.settings[key] === void 0) this.settings[key] = defSettings[key];
        }
        return this;
    }

    done (stepName, dataForNextStep) {
        const message = `${this.settings.logName}${stepName}`;
        let stepHandler = this.steps[stepName];

        this.LOG (message); // Previous step is finished

        if (stepHandler) {
            if (typeof stepHandler === 'function') {
                stepHandler (dataForNextStep);
                return;
            }
            if (stepHandler instanceof Array) {
                for (let func of stepHandler) {
                    if (typeof func !== 'function') {
                        this.ERR (`FLOW TYPE ERROR: handler: "${func}" must be a function`)
                        return false;
                    }
                }
                stepHandler.forEach (func => func (dataForNextStep));
                return;
            } 
            if (typeof stepHandler.fn === 'function') {
                stepHandler.fn (dataForNextStep);
                return;
            }

            this.ERR (`FLOW TYPE ERROR: wrong type of a handler: "${stepHandler}"`);
            return false;
        } else {
            this.ERR (`FLOW ERROR: undefined handler`);
            return false;
        }
    }
    start (dataForNextStep) {
        this.done ('start');
    }

    // Let's imagine these are private methods
    ERR (msg) {
        const { isErrors, errStyle } = this.settings;
        isErrors && console.error (errStyle, msg);
    }
    LOG (msg) {
        const { isLogging, logStyle } = this.settings;
        isLogging && console.log (logStyle, msg);
    }
}
