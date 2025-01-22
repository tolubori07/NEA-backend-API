import { serve } from "bun";

// Define types for handler functions
type Handler = (req: Request, ctx: any) => Response | Promise<Response>;

class Server {
  private routes: { [method: string]: { [path: string]: Handler } };

  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {},
      OPTIONS: {},
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
    const ctx: any = {}; // You can store context data here

    if (routeHandler) {
      return routeHandler(req, ctx);
    } else {
      return new Response("Not found", { status: 404 });
    }
  }

  // Methods to register routes
  get(path: string, handler: Handler) {
    this.routes.GET[path] = handler;
  }

  post(path: string, handler: Handler) {
    this.routes.POST[path] = handler;
  }

  put(path: string, handler: Handler) {
    this.routes.PUT[path] = handler;
  }

  delete(path: string, handler: Handler) {
    this.routes.DELETE[path] = handler;
  }

  options(path: string, handler: Handler) {
    this.routes.OPTIONS[path] = handler;
  }
}

export default Server;
