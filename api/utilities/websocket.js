const SocketIO = require('socket.io');

// Ugly wrapper so that we can use same code for express routes and websocket messages
class Response {
  constructor(callback) {
    this.code = 200;
    this.content = {};
    this.callback = callback;
  }

  status(code) {
    this.code = code;
    return this;
  }

  json(content) {
    this.content = content;
    this.send();
  }

  send() {
    this.callback({
      status: this.code,
      ...this.content,
    });
  }
}

const connectionMiddleware = namespace => callback => {
  namespace.use((socket, next) => {
    const done = ok => {
      if (ok) return next();
      else next("Unauthorized!");
    };
    const  { token } = socket.handshake.query;
    callback({ token, done });
  });
};

const messageMiddleware = socket => callback => {
  socket.use((packet, next) => {
    const done = ok => {
      if (ok) return next();
      else next("Unauthorized!");
    };
    const { token } = packet[1];
    callback({ token, done });
  });
};

const websocket = server => {
  const io = SocketIO(server);

  // Routes actions to controllers
  const routes = {};
  const middleware = [];

  // Defined socket connection
  io.on('connection', socket => {
    // Bind middleware
    middleware.forEach(callback => messageMiddleware(socket)(callback));

    socket.on('message', (msg, callback) => {
      const { action, message } = msg;
      console.log("Received message", action, message);
      // Route message
      controller = routes[action];
      if (controller) {
        req = { query: message };
        res = new Response(callback);
        controller(req, res);
      // Method not found
      } else {
        callback({ status: 404 });
      }
    });
  });

  // Exposed methods
  return {
    // Middleware for api
    auth: callback => connectionMiddleware(io)(callback),
    use: callback => middleware.push(callback),
    // Bind actions to controllers
    message: (action, controller) => routes[action] = controller,
    // Send message to all clients
    broadcast: () => true,
  };
};

module.exports = websocket;
