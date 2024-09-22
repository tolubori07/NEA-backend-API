import { serve } from "bun";

// Define types for handler and middleware functions
type Handler = (req: Request, ctx: any) => Response | Promise<Response>;
type Middleware = (
  req: Request,
  ctx: any,
  next: () => Promise<Response | void>,
) => Promise<Response | void> | void;

class Server {
  private routes: { [method: string]: { [path: string]: Handler } };
  private middlewares: Middleware[];

  constructor() {
    this.routes = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {},
      OPTIONS: {},
    };
    this.middlewares = [];
  }

  // Method to register a middleware
  use(middleware: Middleware) {
    this.middlewares.push(middleware);
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
      // Execute middlewares in sequence
      for (let i = 0; i < this.middlewares.length; i++) {
        let nextCalled = false;

        const next = async () => {
          nextCalled = true;
        };

        const result = await this.middlewares[i](req, ctx, next);

        if (result instanceof Response) {
          return result; // Middleware ended the response
        }

        if (!nextCalled) {
          return new Response("Middleware did not call next()", {
            status: 500,
          });
        }
      }

      // Finally, call the route handler
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
