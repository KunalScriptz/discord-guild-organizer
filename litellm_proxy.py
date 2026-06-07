#!/usr/bin/env python3
"""Minimal LiteLLM proxy for DeepSeek — no extra deps beyond litellm itself."""
import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler

import litellm

MODEL = os.environ.get("LITELLM_MODEL", "deepseek/deepseek-chat")
PORT = int(os.environ.get("LITELLM_PORT", "4000"))
HOST = os.environ.get("LITELLM_HOST", "127.0.0.1")


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            self._json(200, {"status": "ok", "model": MODEL})
        else:
            self._json(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/v1/chat/completions":
            self._json(404, {"error": "not found"})
            return

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))

        # Extract the API key from auth header and pass to litellm
        auth = self.headers.get("Authorization", "")
        api_key = auth.replace("Bearer ", "") if auth.startswith("Bearer ") else None
        if api_key:
            litellm.api_key = api_key

        try:
            response = litellm.completion(
                model=MODEL,
                messages=body.get("messages", []),
                max_tokens=body.get("max_tokens", 4096),
                response_format=body.get("response_format"),
            )
            self._json(200, response.model_dump(mode="json"))
        except Exception as e:
            self._json(500, {"error": str(e)})

    def _json(self, status, data):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def log_message(self, fmt, *args):
        pass  # silence logs


if __name__ == "__main__":
    print(f"LiteLLM proxy: {MODEL} on {HOST}:{PORT}")
    server = HTTPServer((HOST, PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
