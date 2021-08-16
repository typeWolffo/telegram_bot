require('dotenv').config();
const TeleBot = require('telebot');
const puppeteer = require('puppeteer');

const bot = new TeleBot(process.env.TELEGRAM_API_KEY);

players = [];
registerTimeleft = 10;

bot.on('/register', (msg) => {

    return bot.sendMessage(msg.chat.id, `${registerTimeleft}`).then(re => {
        timer(msg.chat.id, re.message_id);
    });

    function timer(chatId, messageId) {
        let countdown = setInterval(async () => {
            registerTimeleft -= 1;
            if (registerTimeleft <= 0) {
                clearInterval(countdown);
                bot.sendMessage(chatId, 'Rejestracja zamknięta');
            }
            console.log(registerTimeleft);
            console.log(chatId);

            bot.editMessageText({chatId, messageId}, `${registerTimeleft}`, {parseMode: 'html'}
            ).catch(error => console.log('Error:', error));

        }, 1000);
    }
})

bot.on('/prs', (msg) => {

    function registerPlayers() {
        players.push(msg.from.username);
        console.log(players);
        console.log(msg);

    }

    function test() {
        (async () => {
            const browser = await puppeteer.launch();
            // Create a new incognito browser context.
            const context = await browser.createIncognitoBrowserContext();
            // Create a new page in a pristine context.
            const page = await context.newPage();
            // Do stuff
            await page.goto('https://example.com');
        })();
    }

    async function prsGame() {
        await registerPlayers();
        await test();
    }

    prsGame();
});
bot.on('/test',  msg => {
    puppeteer.launch({headless:false}).then(async browser => {
        const page = await browser.newPage();
        await page.goto('https://youtube.com');        await page.setOfflineMode(true);


        await page.focus('input');
    });
})


bot.start();