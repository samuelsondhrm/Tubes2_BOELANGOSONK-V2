# Tubes2_BOELANGOSONK-V2

**DOM Tree Visualizer** — A web application for traversing HTML document elements by CSS Selector using **BFS** and **DFS** algorithms on the Document Object Model (DOM) tree.

> Tugas Besar 2 IF2211 Algorithm Strategy — Semester II 2025/2026  
> Institut Teknologi Bandung

**Live Demo:** [http://boelangoesonk.malaysiawest.cloudapp.azure.com](http://boelangoesonk.malaysiawest.cloudapp.azure.com)

## Table of Contents

- [Application Overview](#application-overview)
- [BFS and DFS Algorithms](#bfs-and-dfs-algorithms)
- [Features](#features)
- [Directory Structure](#directory-structure)
- [Requirements](#requirements)
- [Installation & Running the Program](#installation--running-the-program)
  - [Option 1: Docker (Recommended)](#option-1-docker-recommended)
  - [Option 2: Local Development](#option-2-local-development)
- [How to Use](#how-to-use)
- [API Endpoints](#api-endpoints)
- [Author](#author)

## Application Overview

This application implements DOM tree traversal on an HTML document using BFS and DFS graph algorithms. Users can provide a URL or paste raw HTML, select a traversal algorithm, and specify a CSS Selector to search for. The application then displays:

- An interactive DOM tree visualization with maximum depth information
- Highlighted traversal paths and nodes matching the selector
- Search metrics (time elapsed, number of nodes visited)
- A step-by-step traversal log terminal
- LCA (Lowest Common Ancestor) feature using Binary Lifting

## BFS and DFS Algorithms

### Breadth-First Search (BFS)

BFS traverses the DOM tree level by level — starting from the root, then all children at depth 1, depth 2, and so on. The implementation uses a **queue** (FIFO) combined with a **goroutine pool** to evaluate nodes concurrently.

```
Root → [head, body] → [title, meta, div, div] → ...
```

**Implementation details:**
- Queue-based, level-order traversal
- Best suited for finding elements close to the root (shallow matches)
- Each node is dequeued from the front of the frontier (`frontier[0]`)
- Worker goroutines evaluate CSS selector matching in parallel

### Depth-First Search (DFS)

DFS traverses the DOM tree as deep as possible down one branch before backtracking to explore the next. The implementation uses a **stack** with the same goroutine pool.

```
Root → head → title → (back) → meta → (back) → body → div → ...
```

**Implementation details:**
- Stack-based, pre-order traversal
- Best suited for deeply nested document structures
- Each node is popped from the top of the stack (`frontier[len-1]`)
- Child nodes are pushed in reverse order to preserve left-to-right traversal

**Multithreading:** Both algorithms use a goroutine pool with 4 workers to evaluate CSS selector matching concurrently, coordinated via Go's `context` and `sync.WaitGroup`.

## Features

- **Flexible input** — scrape from a URL or paste raw HTML directly
- **Two algorithms** — BFS and DFS, selectable before each traversal
- **Full CSS Selector support** — tag, class (`.`), ID (`#`), universal (`*`), and combinators (`>`, descendant space, `+`, `~`)
- **Interactive DOM tree visualization** — zoomable canvas with matched/visited/path node highlights
- **Top-N or all results** — limit the number of matched elements displayed
- **Stats footer** — max depth, nodes visited, matched count, search time (ms)
- **Process log terminal** — streams every traversal step in real time
- **Traversal log export** — automatically saved as a JSON file under `backend/logs/`
- **LCA (Lowest Common Ancestor)** — find the nearest shared ancestor of two nodes using Binary Lifting in O(log n)
- **SSE Streaming** — a dedicated stream endpoint for step-by-step traversal animation
- **Dark / Light mode** — theme toggle in the navbar
- **Docker ready** — single command to run the entire application

## Directory Structure

```
Tubes2_BOELANGOSONK-V2/
├── backend/
│   ├── cmd/
│   │   └── main.go                 # Entry point: Gin setup + routing
│   ├── internal/
│   │   ├── handler/                # HTTP handlers (scrape, traverse, stream, lca)
│   │   ├── lca/                    # Binary Lifting LCA implementation
│   │   ├── model/                  # Shared structs (DOMNode, Request, Response)
│   │   ├── parser/                 # HTML → DOM tree parser
│   │   ├── scraper/                # HTTP fetcher for remote URLs
│   │   ├── selector/               # CSS selector tokenizer & matcher
│   │   ├── store/                  # In-memory tree store + LCA table cache
│   │   └── traversal/              # BFS, DFS (concurrent), traversal logger
│   ├── Dockerfile
│   ├── go.mod
│   └── go.sum
├── frontend/
│   ├── src/
│   │   ├── api/client.ts           # API client (fetch wrapper)
│   │   ├── components/             # React components (UI panels, canvas, etc.)
│   │   ├── hooks/useTraversal.ts   # Custom hook for traversal state management
│   │   ├── types/api.ts            # TypeScript type definitions
│   │   ├── App.tsx                 # Root layout + page routing
│   │   └── index.css               # Global styles + Tailwind
│   ├── Dockerfile
│   ├── nginx.conf                  # Nginx reverse proxy config (production)
│   ├── package.json
│   └── vite.config.ts              # Vite proxy to backend (development)
├── docker-compose.yml
├── .env.example
└── README.md
```

## Requirements

### For Docker (Production Mode)
| Software | Minimum Version |
|---|---|
| Docker | 24.x |
| Docker Compose | v2.x |

### For Local Development
| Software | Version | Notes |
|---|---|---|
| Go | 1.24+ | Backend runtime |
| Bun | 1.x | Frontend package manager & runtime |
| Node.js | 20.x+ | Required by Vite |

## Installation & Running the Program

### Clone the Repository

```bash
git clone https://github.com/samuelsondhrm/Tubes2_BOELANGOSONK-V2.git
cd Tubes2_BOELANGOSONK-V2
```

---

### Option 1: Docker (Recommended)

Runs both the frontend and backend inside containers with a single command. No local Go or Bun installation required.

**Step 1 — Copy the environment file:**

```bash
cp .env.example .env
```

The default `.env` values work out of the box for local Docker usage — no changes needed.

**Step 2 — Build and start:**

```bash
docker compose up --build
```

**Step 3 — Open the application:**

| Service | URL |
|---|---|
| Frontend | [http://localhost](http://localhost) |
| Backend API | [http://localhost:8080](http://localhost:8080) |

To stop the application:

```bash
docker compose down
```

---

### Option 2: Local Development

Runs the backend and frontend separately with hot-reload enabled.

**Step 1 — Copy the environment file:**

```bash
cp .env.example .env
```

The default `.env` values are already configured for local development:

```env
PORT=8080
ALLOWED_ORIGIN=http://localhost:3000
VITE_API_BASE_URL=http://localhost:8080/api
```

**Step 2 — Run the Backend:**

```bash
cd backend
go mod download        # Download dependencies (only needed once)
go run ./cmd/main.go
```

The backend will be available at `http://localhost:8080`.

> Optional: use [`air`](https://github.com/air-verse/air) for hot-reload:
> ```bash
> go install github.com/air-verse/air@latest
> air
> ```

**Step 3 — Run the Frontend** (open a new terminal):

```bash
cd frontend
bun install            # Install dependencies (only needed once)
bun run dev
```

The frontend will be available at `http://localhost:3000`. All `/api/*` requests are automatically proxied to the backend by Vite — no CORS configuration needed during development.

**Step 4 — Production Build (optional):**

```bash
# Frontend
cd frontend && bun run build

# Backend
cd backend && go build -o server ./cmd/main.go
```


## How to Use

1. Open the application in your browser (`http://localhost` for Docker, or `http://localhost:3000` for local dev).
2. In the **Traversal Engine** panel, select the input mode: **URL** or **RAW HTML**.
3. Choose an algorithm: **BFS** or **DFS**.
4. Enter a website URL or paste your raw HTML.
5. In the **Search Options** panel, set the view mode (Top N / All Occurrences) and enter a **CSS Selector** (e.g. `div`, `.class-name`, `#id`, `body > p`).
6. Click **START SEARCH** — the DOM tree will render on the center canvas with traversal highlights.
7. *(Optional)* Use the **LCA Engine** panel to find the Lowest Common Ancestor of two nodes. Enter the Node IDs visible in the log terminal (format: `node-0`, `node-1`, etc.).
8. Search statistics (max depth, nodes visited, matched count, time elapsed) are displayed in the footer.
9. The full traversal log is automatically saved to `backend/logs/` as a timestamped JSON file.


## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/scrape` | Fetch HTML from a URL and parse it into a DOM tree |
| `POST` | `/api/traverse` | Run BFS/DFS with a CSS selector, returns results + traversal log |
| `GET` | `/api/traverse/stream` | SSE stream of each traversal step (for animation) |
| `POST` | `/api/lca` | Find the Lowest Common Ancestor of two node IDs |

**Example `POST /api/traverse` request:**

```json
{
  "url": "https://example.com",
  "algorithm": "BFS",
  "selector": "p",
  "topN": 10
}
```

> Set `topN` to `0` to return all matched elements.


## Author

| Name | Student ID | Primary Responsibilities |
|---|---|---|
| Samuelson Dharmawan T. | 13524001 | HTML Parser, BFS Algorithm, DOM Tree Visualizer (FE) |
| Edward David Rumahorbo | 13524036 | DFS Algorithm, CSS Selector Engine, Input & Result UI (FE) |
| Reinhard Alfonzo Hutabarat | 13524056 | LCA Binary Lifting, SSE Stream, Traversal Animation (FE), Docker & Azure Deployment |

---

*IF2211 Algorithm Strategy — Institut Teknologi Bandung — 2026*