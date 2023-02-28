let layers = data.split('\n').filter((str) => !messagesExceptions.includes(str));
let boardProps = {};

filterMessages.forEach((message) => {
    if (message.includes('BOARD')) {
        const messageConvertToArray = message.split('-');
        boardProps = {
            width: parseFloat(messageConvertToArray[1]),
            height: parseFloat(messageConvertToArray[2]),
            numberBoards: parseFloat(messageConvertToArray[3]),
        };
    }
    if (message.includes('TYPE') && message.includes('Corte exterior')) {
        const messageConvertToArray = message.split('-');
        const layer = {
            type: messageConvertToArray[1],
            longitud: messageConvertToArray[2],
            nodes: messageConvertToArray[3]
        };
        layers.push(layer);
    };
});