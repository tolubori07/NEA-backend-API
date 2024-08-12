import { serve } from "bun";

type Handler = (req: Request) => Response | Promise<Response>;

class Server {
  private routes: { [method: string]: { [path: string]: Handler } };

  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {},
    };
  }

  // Method to start the server
  listen(port: number) {
    serve({
      port: port,
      fetch: this.handleRequest.bind(this),
    });
    console.log(`Server started on port ${port}`);
  }

  // Method to handle incoming requests
  async handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method;
    const routeHandler = this.routes[method]?.[url.pathname];

    if (routeHandler) {
      return routeHandler(req);
    } else {
      return new Response("Not found", { status: 404 });
    }
  }

  // Method to register a GET route
  get(path: string, handler: Handler) {
    this.routes.GET[path] = handler;
  }

  // Method to register a POST route
  post(path: string, handler: Handler) {
    this.routes.POST[path] = handler;
  }

  // Method to register a PUT route
  put(path: string, handler: Handler) {
    this.routes.PUT[path] = handler;
  }

  // Method to register a DELETE route
  delete(path: string, handler: Handler) {
    this.routes.DELETE[path] = handler;
  }
}

export default Server;

