const defParams = {
    isLogging: true,
    isErrors: true,

    logStyle: '\x1b[32m%s\x1b[0m',
    errStyle: '\x1b[31m%s\x1b[0m',

    logMsg: `-->  ${stepName} \n`,
}


module.exports = function Flow (customParams) {
    let params = customParams || defParams;
    let { isLogging, isErrors, logStyle, errStyle, logMsg } = params;

    let currentStep = null;

    this.done = (stepName, dataForStep) => {
        let stepHandler = this.steps[stepName];


        if (stepHandler) {
            currentStep = stepName;
            isLogging && console.log(logStyle, logMsg);

            if (typeof stepHandler == 'function') {

                stepHandler (dataForStep);
            } else if (stepHandler instanceof Array) {

                stepHandler.forEach ((func) => func (dataForStep));
            } else {

                isErrors && console.error (errStyle, `FLOW TYPE ERROR: Handler must be a function or an Array. Error in step: "${stepName}"`);
                return false;
            }
        } else {
            isErrors && console.error (errStyle, `FLOW ERROR: undefined handler for step: "${stepName}"`);
        }
    }

    this.isDone = (stepName) => {

    }
}
