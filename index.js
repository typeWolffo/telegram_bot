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


    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('Rock', {callback: 'figure_rock'}),
            bot.inlineButton('Paper', {callback: 'figure_paper'}),
            bot.inlineButton('Scissors', {callback: 'figure_scissors'}),
        ]
    ], {resize: true});

    function timer(chatId, messageId) {
        let countdown = setInterval(async () => {
            registerTimeleft -= 1;
            if (registerTimeleft <= 0) {
                clearInterval(countdown);
                bot.sendMessage(chatId, 'Register stop:.');
            }
            console.log(registerTimeleft);
            console.log(chatId);

            bot.editMessageText({chatId, messageId}, `${registerTimeleft}`, {parseMode: 'html'}
            ).catch(error => console.log('Error:', error));

        }, 1000);
    }

    bot.on('callbackQuery', msg => {
        const action = msg.data;
        let figure = new Figure();
        console.log('callback: ', action)
        switch (action) {
            case 'figure_rock':
                figure.name = 'rock';
                figure.winsWith = 'scissors';
                figure.losesTo = 'paper'
                break;
            case 'figure_paper':
                figure.name = 'paper';
                figure.winsWith = 'rock';
                figure.losesTo = 'scissors'
                break;
            case 'figure_scissors':
                figure.name = 'scissors';
                figure.winsWith = 'paper';
                figure.losesTo = 'rock'
                break;
        }
        console.log(figure)

        // function setPlayerWithFigure(fig, win, lose) {
        //     let figure = new Figure(fig, win, lose)
        //     let player = new Player(msg.from.username, figure);
        //     players.push(player);
        // }
    });


    return bot.sendMessage(msg.chat.id, `${registerTimeleft}`).then(re => {
        timer(msg.chat.id, re.message_id);
        bot.sendMessage(msg.from.id, 'Choose your figure    ', {replyMarkup});
    });
})


// bot.on('/prs', (msg) => {
//
//     function registerPlayers() {
//         players.push(msg.from.username);
//         console.log(players);
//         console.log(msg);
//
//     }
//
//     async function prsGame() {
//         await registerPlayers();
//     }
//
//     prsGame();
// });


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