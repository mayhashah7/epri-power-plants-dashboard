import { useState } from 'react';
import { postJson, type Substation } from '../lib/api';

const SCENARIOS = [
  { id: 'pv-defect-batch', label: 'PV Defect Survey', agent: 'pp-solar-pv-defect-detection', hint: 'Process this morning\'s drone EL imagery — flag hotspots' },
  { id: 'connector-qa', label: 'Connector QA', agent: 'pp-solar-pv-connector-quality', hint: 'Assess installer batch B-2024-09 X-rays' },
  { id: 'fault-diagnosis', label: 'Generation Fault', agent: 'pp-generation-fault-diagnosis', hint: 'Steam-turbine vibration spike on Unit 3 — diagnose' },
  { id: 'dga-spike', label: 'DGA Spike', agent: 'pp-transformer-dga-monitoring', hint: 'Acetylene rose 3× on GSU TX-7 — classify' },
  { id: 'pid-tune', label: 'Control Loop Drift', agent: 'pp-control-autotuning', hint: 'Boiler pressure loop oscillating — propose retune' },
  { id: 'nuc-troubleshoot', label: 'Nuclear Troubleshoot', agent: 'pp-nuclear-troubleshooting', hint: 'Reactor coolant pump seal flow trending up — investigate' },
  { id: 'nuc-data-pull', label: 'Nuclear Data Pull', agent: 'pp-nuclear-data-retrieval', hint: 'Pull last 60d RCS chemistry against EPRI guidelines' },
  { id: 'spare-forecast', label: 'Spare Parts Forecast', agent: 'pp-nuclear-spare-part-reordering', hint: 'Forecast next 90d spares for Unit 2 outage' },
];

export function ScenarioPanel({ onRan, substations }: { onRan: () => void; substations: Substation[] }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [last, setLast] = useState<string>('');
  const sub = substations[0]?.substation_id ?? '';

  async function run(id: string) {
    setBusy(id); setLast('');
    try {
      const body: any = id === 'storm-outage' ? { substation_id: sub, feeder_index: 7 }
                       : id === 'theft'       ? { substation_id: sub, count: 3 }
                       : id === 'heat-wave'   ? {}
                       : { substation_id: sub };
      const r = await postJson<any>(`/api/scenarios/${id}`, body);
      setLast(`✓ ${id} → ${r.agent_dispatched ?? 'dispatched'}`);
      onRan();
    } catch (e: any) { setLast(`error: ${e.message}`); }
    finally { setBusy(null); }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold tracking-wide">SCENARIOS</h2>
        <span className="text-xs text-slate-500">click to inject + auto-dispatch agent</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 flex-1 overflow-y-auto">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            disabled={!!busy}
            onClick={() => run(s.id)}
            className="text-left p-1.5 rounded-lg bg-grid-bg border border-grid-border hover:border-grid-accent disabled:opacity-50 transition group"
            title={s.hint}
          >
            <div className="text-xs font-medium text-grid-accent leading-tight">{busy === s.id ? '⏳' : s.label}</div>
            <div className="text-xs text-grid-info font-mono mt-0.5">→ {s.agent}</div>
            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{s.hint}</div>
          </button>
        ))}
      </div>
      {last && <div className="text-xs text-grid-ok mt-1 truncate font-mono">{last}</div>}
    </div>
  );
}
