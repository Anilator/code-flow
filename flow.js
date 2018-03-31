const defSettings = {
    isLogging: true,
    isErrors: true,

    logStyle: '\x1b[32m%s\x1b[0m',
    errStyle: '\x1b[31m%s\x1b[0m',

    logName: 'done: ',
}


module.exports = class Flow {
    constructor (params) {
        this.steps = params.steps || {};
        this.settings = params.settings;
        for (let key in defSettings) {
            if (this.settings[key] === void 0) this.settings[key] = defSettings[key];
        }
    }

    done (stepName, dataForStep) {
        const message = `${this.settings.logName}${stepName}`;
        let stepHandler = this.steps[stepName];

        if (stepHandler) {
            LOG (message);

            if (typeof stepHandler === 'function') {
                stepHandler (dataForStep);
                return true;
            }
            if (stepHandler instanceof Array) {

                for (func of stepHandler) {
                    if (typeof func !== 'function') {
                        ERR (`FLOW TYPE ERROR: handler must be a function. \nError in step: "${stepName}"`)
                        return false;
                    }
                }
                stepHandler.forEach (func => func (dataForStep));
                return true;
            } 
            if (typeof stepHandler.fn === 'function') {
                stepHandler.fn (dataForStep);
                return true;
            }

            ERR (`FLOW TYPE ERROR: wrong type of a handler. \nError in step: "${stepName}"`);
            return false;
        } else {
            ERR (`FLOW ERROR: undefined handler for step: "${stepName}"`);
            return false;
        }
    }
    start (dataForStep) {
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
