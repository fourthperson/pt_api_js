const express = require('express');

const content = require('./content.json');

const app = express();
const port = 3031;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function invalid() {
    return {
        status: 500,
        data: 'Invalid answer value passed. Answers should only be true or false separated by a semicolon(;)\n{answers:"true;false;true;false;false;true"}'
    };
}

function mark(json) {
    let body = json.toString();
    if (!body.includes(';')) {
        return invalid();
    }
    if (body.includes(' ')) {
        body = body.replace(' ', '');
    }
    const answers = body.split(';');
    let intCount = 0;
    let extCount = 0;
    for (let i = 0; i < answers.length; i++) {
        console.log(answers[i]);
        if (answers[i] === 'true') {
            intCount++;
        } else if (answers[i] === 'false') {
            extCount++;
        } else {
            return invalid();
        }
    }
    if (intCount > extCount) {
        return {status: 200, data: 'Introverted'};
    } else if (extCount > intCount) {
        return {status: 200, data: 'Extroverted'};
    } else {
        return {status: 200, data: 'Balance'};
    }
}

app.use(express.json());

app.get('/', (request, response) => response.stop());
app.post('/', (request, response) => response.end());
app.get('/evaluate', (request, response) => response.end());

app.get('/questions', async (request, response) => {
    let x = [];
    content.forEach(question => x.push(question));
    response.json(shuffle(x));
});

app.post('/evaluate', (request, response) => {
    let body = request.body.toString();
    console.log(body);
    response.json(mark(body));
});

app.listen(port, (error) => {
    if (error) console.error('App error: ', error);
    console.log(`App serving on port ${port}`);
});
