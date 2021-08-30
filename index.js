require('dotenv').config();
const TeleBot = require('telebot');
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


bot.on('/r', (msg) => {

    function timer(chatId, messageId) {
        let countdown = setInterval(async () => {
            registerTimeleft -= 1;
            if (registerTimeleft <= 0) {
                clearInterval(countdown);
                bot.sendMessage(chatId, 'Register stop:.');
            }
            console.log(registerTimeleft);

            bot.editMessageText({
                chatId,
                messageId
            }, `${registerTimeleft}`, {
                parseMode: 'html'
            }).catch(error => console.log('Error:', error));

        }, 1000);
    }

    let replyMarkup = bot.inlineKeyboard([
        [
            bot.inlineButton('Rock', {
                callback: 'figure_rock'
            }),
            bot.inlineButton('Paper', {
                callback: 'figure_paper'
            }),
            bot.inlineButton('Scissors', {
                callback: 'figure_scissors'
            }),
        ]
    ], {
        resize: true
    });

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
            let player = {
                playerName: msg.from.username,
                chosenFigure: figure.name
            }
            players.push(player);
        }

        function makePlayersUnique() {
            playersFiltered = uniquePlayers(players, player => player.playerName);
        }

        function determineWinner() {

            while (playersFiltered.length > 0) {
                const setWinner = () => {

                const firstPlayer = playersFiltered[0];

                const getSecondRandomPlayer = () => {
                    for (let players in playersFiltered) {
                        let randomPlayerIndex = Math.floor(Math.random() * (players - 1 + 1)) + 1;
                        return randomPlayerIndex;
                    }
                }

                let secondPlayer = playersFiltered[getSecondRandomPlayer()];
                    if (secondPlayer) {
                        if (firstPlayer.chosenFigure === secondPlayer.chosenFigure) {
                            // setWinner();
                        } else if (firstPlayer.chosenFigure == 'rock') {
                            if (secondPlayer.chosenFigure == 'paper') {
                                playersFiltered.splice(0, 1); // remove first player from playersFiltered array
                                console.log('stage 1 :: first removed')
                                // setWinner();
                            } else {
                                playersFiltered.splice(getSecondRandomPlayer(), 1); // remove chosen randomly second player from playersFiltered array
                                console.log('stage 2 :: second removed')
                                // setWinner();
                            }
                        } else if (firstPlayer.chosenFigure == 'scissors') {
                            if (secondPlayer.chosenFigure == 'rock') {
                                playersFiltered.splice(0, 1);
                                console.log('stage 2 :: first removed')
                                // setWinner();
                            } else {
                                playersFiltered.splice(getSecondRandomPlayer(), 1);
                                console.log('stage 2 :: second removed')
                                // setWinner();
                            }
                        } else if (firstPlayer.chosenFigure == 'paper') {
                            if (secondPlayer.chosenFigure == 'scissors') {
                                playersFiltered.splice(0, 1);
                                console.log('stage 3 :: first removed')
                                // setWinner();
                            } else {
                                playersFiltered.splice(getSecondRandomPlayer(), 1);
                                console.log('stage 3 :: second removed')
                                // setWinner();
                            }
                        }
                        console.log('Winner :: ', playersFiltered[0]);
                    }
                }
            }
            console.log('winner')
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
        bot.sendMessage(msg.chat.id, 'Choose your figure    ', {
            replyMarkup
        });
    });
})

bot.start();