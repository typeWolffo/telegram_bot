require('dotenv').config();
const TeleBot = require('telebot');
const {exec} = require("child_process");
const bot = new TeleBot(process.env.TELEGRAM_API_KEY);

players = [];
playersFiltered = [];
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

    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('Rock', {callback: 'figure_rock'}),
            bot.inlineButton('Paper', {callback: 'figure_paper'}),
            bot.inlineButton('Scissors', {callback: 'figure_scissors'}),
        ]
    ], {resize: true});

    bot.on('callbackQuery', msg => {
        const action = msg.data;
        let figure = new Figure();
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

        function addNewPlayer() {
            let player = new Player(msg.from.username, figure.name);
            players.push(player);
        }

        function makePlayersUnique() {
            playersFiltered = uniquePlayers(players, player => player.name);
        }

        function determineWinner() {
            for (let player of playersFiltered) {
                console.log(player)
            }
        }

        (async function gameHandler() {
            await addNewPlayer();
            await makePlayersUnique();
            await determineWinner();
        })();
    });

    function uniquePlayers(data, key) {
        return [
            ...new Map(
                data.map(x => [key(x), x])
            ).values()
        ]
    }


    return bot.sendMessage(msg.chat.id, `${registerTimeleft}`).then(re => {
        timer(msg.chat.id, re.message_id);
        bot.sendMessage(msg.chat.id, 'Choose your figure    ', {replyMarkup});
    });
})


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