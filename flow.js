const defSettings = {
    isLogging: true,
    isErrors: true,

    logStyle: '\x1b[32m%s\x1b[0m',
    errStyle: '\x1b[31m%s\x1b[0m',
}


module.exports = function Flow (params) {
    const settings = Object.assign (defSettings, params.settings);
    const { isLogging, isErrors, logStyle, errStyle, logMsg } = settings;
    const msg = logMsg || 'done: ';
    // let currentStep = null;
    //WIP let raceStorage = {};

    this.steps = params.steps || {};

    this.done = (stepName, dataForStep) => {
        let stepHandler = this.steps[stepName];

        if (stepHandler) {
            // currentStep = stepName;
            isLogging && console.log(logStyle, `${msg} ${stepName}`);

            if (typeof stepHandler == 'function') {

                stepHandler (dataForStep);
            } else if (stepHandler instanceof Array) {

                stepHandler.forEach ((func) => func (dataForStep));
            } else if (typeof stepHandler.fn == 'function') {
                //WIP raceStorage[stepHandler] = stepHandler.arg;

                stepHandler.fn (dataForStep);
            } else {

                isErrors && console.error (errStyle, `FLOW TYPE ERROR: Handler must be a function or an Array. Error in step: "${stepName}"`);
                return false;
            }
        } else {

            isErrors && console.error (errStyle, `FLOW ERROR: undefined handler for step: "${stepName}"`);
        }
    }
}
