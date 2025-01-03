/*
* food-reminder
* */

const { WebhookClient } = require('discord.js');
const { webhookId, webhookToken, testId, testToken, isTesting, reminderMessage, triggerHours } = require('./config.json');
const webhookClient = new WebhookClient({ id: isTesting ? testId : webhookId, token: isTesting ? testToken : webhookToken });

let _reminderInterval;
let _latch = false;

function formatTime(date) {
    let amPm = date.getHours() > 11;
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return `${date.getHours() - 12}:${minute}${amPm ? "pm" : "am"}`;
}

function manualTrigger(confirmation) {
    if(!confirmation) {
        console.log(`[debug] requires confirmation. add an argument that is just true.`)
        return;
    }
    if(!webhookClient) return;

    console.log(`[debug] manually triggered.`);
    let currentDate = new Date();
    let currentHour = currentDate.getHours();

    console.log(`[debug] currentHour = ${currentHour}`);
    webhookClient.send(reminderMessage.replaceAll(`{{time}}`, formatTime(currentDate))).then(() => {});
}

_reminderInterval = setInterval(() => {
    if(!webhookClient) return;

    console.log(`[debug] interval hit.`);
    let currentDate = new Date();
    let currentHour = currentDate.getHours();

    console.log(`[debug] currentHour = ${currentHour}`);
    if(triggerHours.includes(currentHour) === true) {
        console.log(`[debug] currentHour matches possible triggerHours (${triggerHours.join(", ")}).`);

        if(_latch === true) return;

        webhookClient.send(reminderMessage.replaceAll(`{{time}}`, formatTime(currentDate))).then(() => {
            _latch = true;
            console.log(`[debug] latched, will unlatch when hour is not matched.`);
        });
    } else {
        if(_latch === true) {
            _latch = false;
            console.log(`[debug] unlatched.`);
        }
    }
},30000);

const repl = require('node:repl');
const local = repl.start({
    prompt: "$ ",
    useGlobal: true
});

local.context.webhookClient = webhookClient;
local.context.manualTrigger = manualTrigger;
local.context._latch = _latch;

local.on('exit', () => {
    console.log('exiting..');

    clearInterval(_reminderInterval);
    process.exit(0);
});
