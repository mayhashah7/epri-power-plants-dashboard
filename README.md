# Power Plants — Nuclear, Renewables & Thermal

> EPRI AI for Power Challenge — agentic dashboard built on Azure AI Foundry.

AI agents for plant asset performance, fault diagnosis, control autotuning, and nuclear knowledge acceleration

## Architecture

- **Backend**: FastAPI + WebSocket + synthetic data simulator
- **Frontend**: React / Vite / Tailwind / MapLibre / Recharts
- **Agents**: 11 agents registered in **Azure AI Foundry**
  (orchestrator + 10 specialists)
- **Models**: GPT-5 family per-agent (gpt-5 / gpt-5-mini / gpt-5-chat)
- **Deployment**: Azure Container Apps, Bicep IaC

## Agent fabric

| Agent | Domain | Mission |
|---|---|---|
| `pp-orchestrator` | routing | Routes requests + aggregates evidence |
| `pp-solar-pv-defect-detection` | solar | Drone EL / IR imagery → cell-level defect map |
| `pp-solar-pv-connector-quality` | connector | X-ray analysis of PV-connector installs |
| `pp-generation-fault-diagnosis` | fault | Cross-fleet fault-signature matching |
| `pp-transformer-dga-monitoring` | dga | DGA + temp + pressure → incipient-fault classifier |
| `pp-control-autotuning` | control | RL-based PID / MPC autotuning for plant loops |
| `pp-nuclear-deliverables-enhancement` | nuc_docs | LLM-drafted technical reports & risk analyses |
| `pp-nuclear-design-validation` | nuc_design | AI design-control V&V methodology |
| `pp-nuclear-spare-part-reordering` | spares | Predictive spares forecast — kill stockouts & excess |
| `pp-nuclear-troubleshooting` | troubleshoot | Conversational troubleshooting assistant |
| `pp-nuclear-data-retrieval` | nuc_data | NL-to-query over plant historian / databases |

## Scenarios

- **PV Defect Survey** → `pp-solar-pv-defect-detection` — Process this morning's drone EL imagery — flag hotspots
- **Connector QA** → `pp-solar-pv-connector-quality` — Assess installer batch B-2024-09 X-rays
- **Generation Fault** → `pp-generation-fault-diagnosis` — Steam-turbine vibration spike on Unit 3 — diagnose
- **DGA Spike** → `pp-transformer-dga-monitoring` — Acetylene rose 3× on GSU TX-7 — classify
- **Control Loop Drift** → `pp-control-autotuning` — Boiler pressure loop oscillating — propose retune
- **Nuclear Troubleshoot** → `pp-nuclear-troubleshooting` — Reactor coolant pump seal flow trending up — investigate
- **Nuclear Data Pull** → `pp-nuclear-data-retrieval` — Pull last 60d RCS chemistry against EPRI guidelines
- **Spare Parts Forecast** → `pp-nuclear-spare-part-reordering` — Forecast next 90d spares for Unit 2 outage

## Local dev

```bash
# API
cd apps/dashboard-api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Web
cd apps/dashboard-web
npm install && npm run dev
```

## Deploy

```bash
./scripts/deploy.sh   # provisions Container Apps + seeds Foundry agents
```

---
Part of the [EPRI AI for Power Challenge 2026](https://epri.brightidea.com/AIforPower2026) demo set.
