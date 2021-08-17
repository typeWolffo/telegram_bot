require('dotenv').config();
const TeleBot = require('telebot');
const {exec} = require("child_process");
const bot = new TeleBot(process.env.TELEGRAM_API_KEY);

players = [];
registerTimeleft = 10;

class Figure {
    constructor(name, winsWith, losesTo) {
        this.name = name;
        this.winsWith = winsWith;
        this.losesTo = losesTo;
    }
}

class Player {
    constructor(name, chosenFigure) {
        this.name = name;
        this.chosenFigure = chosenFigure;
    }
}



bot.on('/register', (msg) => {

    function setPlayerWithFigure(fig, win, lose) {
        let figure = new Figure(fig, win, lose)
        let player = new Player(msg.from.username, figure);
        players.push(player);
    }

    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('Rock', {callback: setPlayerWithFigure('rock', 'scissors', 'paper')}),
            bot.inlineButton('Paper', {callback: setPlayerWithFigure('paper', 'rock', 'scissors')}),
            bot.inlineButton('Scissors', {callback: setPlayerWithFigure('scissors', 'paper', 'rock')}),
        ]
    ]);
console.log(players)
    return bot.sendMessage(msg.chat.id, `${registerTimeleft}`).then(re => {
        timer(msg.chat.id, re.message_id);
        bot.sendMessage(msg.from.id, 'Choose', {replyMarkup});

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

    async function prsGame() {
        await registerPlayers();
    }

    prsGame();
});
bot.on('/test', msg => {

    exec(`powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList '/c cd / && echo test  > test.TEST'"`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
})


bot.start();