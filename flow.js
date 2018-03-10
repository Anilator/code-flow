const defParams = {
    isLogging: true,
    isErrors: true,

    logStyle: '\x1b[32m%s\x1b[0m',
    errStyle: '\x1b[31m%s\x1b[0m',
}


module.exports = function Flow (customParams) {
    let params = Object.assign (defParams, customParams);
    let { isLogging, isErrors, logStyle, errStyle, logMsg } = params;
    let currentStep = null;
    let raceStorage = {};

    this.steps = {};
    this.done = (stepName, dataForStep) => {
        let stepHandler = this.steps[stepName];

        if (stepHandler) {
            stepHandler.isDone = true;
            currentStep = stepName;
            isLogging && console.log(logStyle, `-->  ${stepName} \n`);

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
