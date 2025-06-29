// src/handlers/proxy.ts
import fetch from 'node-fetch';
import { Request, Response } from 'express';
import routes from '../routes/routes';

interface Route {
  name: string;
  context: string[];
  target: string;
  pathRewrite: Record<string, string>;
}

const errors = {
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  SERVICE_ERROR: 'SERVICE_ERROR'
};

const defaultTimeout = 5000;
const nonBodyMethods = ['GET', 'HEAD'];

export async function proxyHandler(req: Request, res: Response) {
  try {
    const { path, method, headers, body } = req;

    console.log(`🔍 Incoming request: ${method} ${path}`);

    // Step 1: Find matching route
    const route = routes.find((route: Route) =>
      route.context.some((context) => path.startsWith(context))
    );

    if (!route) {
      console.log(`❌ No route found for: ${path}`);
      res.status(404).json({
        error: errors.ROUTE_NOT_FOUND,
        message: `No route found for ${path}`,
        availableRoutes: routes.map(r => r.context).flat()
      });
      return;
    }

    console.log(`✅ Route found: ${route.name}`);

    // Step 2: Apply path rewriting
    let servicePath = path;
    Object.entries(route.pathRewrite).forEach(([key, value]) => {
      servicePath = servicePath.replace(new RegExp(key), value as string);
    });

    // Step 3: Build target URL
    const targetUrl = `${route.target}${servicePath}`;
    console.log(`🎯 Forwarding to: ${targetUrl}`);

    // Step 4: Prepare headers (remove host-specific headers)
    const forwardHeaders: Record<string, string> = {};

    // Convert headers to proper format
    Object.entries(headers).forEach(([key, value]) => {
      if (key !== 'host' && key !== 'content-length' && value) {
        forwardHeaders[key] = Array.isArray(value) ? value[0] : String(value);
      }
    });

    // Add gateway identification headers
    forwardHeaders['x-forwarded-for'] = req.ip || '';
    forwardHeaders['x-forwarded-proto'] = req.protocol;
    forwardHeaders['x-forwarded-host'] = req.hostname;
    forwardHeaders['x-gateway-name'] = 'api-gateway';
    forwardHeaders['x-service-name'] = route.name;

    // Step 5: Prepare request body
    const requestBody = nonBodyMethods.includes(method.toUpperCase())
      ? undefined
      : JSON.stringify(body);

    // Step 6: Make the request to the service
    const response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body: requestBody,
      timeout: defaultTimeout
    });

    // Step 7: Get response from service
    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    console.log(`📥 Service responded: ${response.status}`);

    // Step 8: Forward response back to client
    res.status(response.status);

    // Forward response headers (excluding some)
    response.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    res.json(responseData);

  } catch (error: any) {
    console.error('❌ Proxy error:', error);

    if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: errors.SERVICE_ERROR,
        message: 'Service unavailable - cannot connect to target service',
        service: req.path
      });
      return
    }

    res.status(500).json({
      error: errors.SERVICE_ERROR,
      message: 'Internal gateway error'
    });
  }
}