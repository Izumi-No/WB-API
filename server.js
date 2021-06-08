const express = require('express');
const process = require('process');

const port = process.env.PORT || 3000;
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

// conversor: https://stackoverflow.com/questions/53247588/converting-a-string-into-binary-and-back
function stringToBinary(input) {
  const characters = input.split('');

  return characters
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, 0))
    .join(' ');
}
//
const prev = [];
io.on('connection', (socket) => {
  socket.on('message', (data) => {
    const obj = {
      id: socket.id,
      username: data.username,
      text: data.mensage,
      binary: stringToBinary(data.mensage),
    };
    prev.push(obj);
    socket.broadcast.emit('previas', prev);
    socket.emit('previas', prev);
  });

  socket.broadcast.emit('previas', prev);
});

app.get('*', (req, res) => { res.send('tá funfando zé'); });

server.listen(port);
