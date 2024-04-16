const { WebSocketServer } = require('ws');
const uuid = require('uuid');

function peerProxy(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    if (request.headers['sec-websocket-protocol'] === 'chat') {
      wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
      });
    } else {
      // Handle other WebSocket upgrades here
    }
  });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection for chat');

    ws.on('message', data => {
      // Broadcast the received message to all connected clients
      const message = JSON.parse(data);
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ name: message.name, message: message.message }));
        }
      });
    });

    ws.on('close', () => console.log('WebSocket connection closed'));
  });

  return wss;
}

module.exports = { peerProxy };
