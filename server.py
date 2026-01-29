from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8000

if __name__ == "__main__":
    server = ThreadingHTTPServer(("localhost", PORT), SimpleHTTPRequestHandler)
    print(f"Serving on http://localhost:{PORT}")
    server.serve_forever()
