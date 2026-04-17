# Tubes2_BOELANGOSONK-V2

A React + Go web app for DOM tree traversal using BFS and DFS with CSS selector matching.

## Quick Start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

App runs at [http://localhost:3000](http://localhost:3000).

## Usage

1. Paste HTML or scrape a URL in the Input panel
2. Enter a CSS selector and choose BFS or DFS
3. Click **Traverse** to see matched nodes and traversal log
4. Use **LCA** panel to find the lowest common ancestor of two nodes

## Local Development

```bash
# Backend (port 8080)
cd backend && go run ./cmd/main.go

# Frontend (port 3000)
cd frontend && bun run dev
```
