# Agri-Cows.App

Monorepo with:
- **agri-cows-api** — Python REST API
- **agri-cows-pwa** — TypeScript PWA (frontend)

Use it to manage cattle data (herd, events like breeding/treatments/weights).

---

## Quick Start

### Prereqs
- Python ≥ 3.10
- Node.js ≥ 18 (20 recommended)
- npm or pnpm

---

## Backend — `agri-cows-api`

### Setup
```bash
cd agri-cows-api

# Option A: Poetry (if pyproject.toml exists)
poetry install

# Option B: venv + pip
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt || pip install -e .
