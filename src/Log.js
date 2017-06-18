import chalk from 'chalk'

let stepCount = 0;
let totalSteps = 3;

class Log {
    static info(msg) {
        console.log(`${chalk.blue('info')} ${msg}`);
    }

    static warning(msg) {
        console.warn(`${chalk.yellow('warning')} ${msg}`);
    }

    static error(msg) {
        console.error(`${chalk.red('error')} ${msg}`);
    }

    static success(msg) {
        console.log(`${chalk.green('success')} ${msg}`);
    }

    static step(msg) {
        stepCount++;
        console.log(`[${stepCount}/${totalSteps}] ${msg}`);
    }
}

export default Log;
