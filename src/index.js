export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/ask" && request.method === "POST") {
      // Forward the request body directly to your Voyagers API
      const body = await request.text(); // raw text to keep JSON untouched

      const backendRes = await fetch(env.BACKEND_URL + "/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      // Pass through status and headers, stream body
      return new Response(backendRes.body, {
        status: backendRes.status,
        headers: {
          "Content-Type": backendRes.headers.get("Content-Type") || "application/json",
          "Access-Control-Allow-Origin": "*", // allow your frontends to call it
        },
      });
    }

    if (url.pathname === "/health") {
      return new Response(
        JSON.stringify({ status: "ok", backend: env.BACKEND_URL }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response("Sphinx Aether API", { status: 200 });
  },
};
