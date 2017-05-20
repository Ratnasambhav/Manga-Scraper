const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const mkdirp = require('mkdirp');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// const mangaURL =
//   'http://www.mangareader.net/its-not-my-fault-that-im-not-popular/1';

function start(URL) {
  request(URL, (error, response, html) => {
    if (!error) {
      const $ = cheerio.load(html);
      const noOfPages = $('#pageMenu > option:nth-last-child(1)').text();
      console.log('Number of pages: ' + noOfPages);
      const path = './' + $('#mangainfo > div:nth-child(1) > h1').text();
      if (!fs.existsSync(path)) {
        mkdirp(path, function(err) {
          if (err) console.error(err);
          else console.log('Manga will be save at: ' + path);
        });
      }
      let i;
      for (i = 1; i <= noOfPages; i++) {
        const nowPath = path + '/' + i + '.jpg';
        const nowURL = URL + '/' + i;
        saveImage(nowURL, nowPath);
      }
    }
  });
}

function saveImage(URL, path) {
  request(URL, (error, response, html) => {
    if (!error) {
      var $ = cheerio.load(html);
      const imgURL = $('#imgholder a #img').attr('src');
      request.get(
        {
          url: imgURL,
          encoding: 'binary'
        },
        function(err, response, body) {
          fs.writeFile(path, body, 'binary', function(err) {
            if (err) console.log(err);
            else console.log(path + ' saved!');
          });
        }
      );
    } else {
      console.log(error);
    }
  });
}

rl.question('Enter the manga url: ', answer => {
  console.log(`URL entered: ${answer}`);
  rl.close();
  start(answer);
});
