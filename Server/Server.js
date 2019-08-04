const fs = require('fs');
let csv = require('csv');
let http = require('http');
let express = require('express');
let socketIo = require('socket.io');

const dataPath = "../Data/Time_HKLD.csv";
const port = 8080;

function readCSVFile(socket){
  let stream = fs.createReadStream(dataPath)
    .pipe(csv.parse({ headers: false })
      .on('data', (row) => {
        socket.emit("message", row);
        console.log("sent message");

        stream.pause();
        setTimeout(() => {
          stream.resume()
        }, 40);
      })
      .on('error', error => console.error(error))
    );
}

function init(){
  let app = express();
  let server = http.createServer(app);
  let io = socketIo(server);

  server.listen(port, () => {
    console.log('Running server on port %s', port);
  });

  io.on('connect', (socket) => {
    console.log('Connected client on port %s.', port);
    socket.on('start', () => {
      console.log('[server](message): Starting');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
    readCSVFile(socket);
  });
}

init();
