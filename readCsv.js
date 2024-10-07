const fs = require('fs');
const csv = require('csv-parser');;

function symbolReplace(data) {
    return data.map(item => item.replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/\\/g, '').trim());
}

function cleanNum(num) {
    if (num.endsWith('K')) {
        return parseInt(num.replace('K', '')) * 1000
    }
    return parseInt(num)
}

function formatDate(dateString) {
    const months = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12'
    };
    
    const parts = dateString.split(' ');
    const month = months[parts[0]];
    const day = parts[1].replace(',', '');
    const year = parts[2];

    return `${year}.${month}.${day}`;
}



function cleanString(str) {
    return str.replace(/'/g, '').replace(/"/g, '').replace(']', '').replace('[', '').replace('\n', '').trim();
}

function getDict(data) {
    data = symbolReplace(data);
    const result = {
        "Title": cleanString(data[1]),
        "Release Date": new Date(formatDate(data[2])),
        "Team": cleanString(data[3]),
        "Rating": parseFloat(data[4]),
        "Times Listed": cleanNum(data[5]),
        "Number of Reviews": cleanNum(data[6]),
        "Genres": cleanString(data[7]),
        "Summary": cleanString(data[8]),
        "Reviews": cleanString(data[9]),
        "Plays": cleanNum(data[10]),
        "Playing": cleanNum(data[11]),
        "Backlogs": cleanNum(data[12]),
        "Wishlist": cleanNum(data[13])
    };
    return JSON.stringify(result, null, 3);
}



let results = [];

function readCsv() {
    const filePath = 'games.csv';
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const result = getDict(Object.values(row));
                results.push(result);
            })
            .on('end', () => {
                resolve(results);  //Возвращаем результаты после завершения чтения
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}





module.exports = readCsv;