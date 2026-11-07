'use client';

/**
 * Agent map: an external, team-provided page that draws the workspace's agents
 * and how work flows between them (for example the Openews newsroom map,
 * scripts/vista.js). Shown as a dashboard view only when
 * NEXT_PUBLIC_AGENT_MAP_URL is set; the page is embedded as-is.
 */

export const AGENT_MAP_URL = process.env.NEXT_PUBLIC_AGENT_MAP_URL || '';

export function AgentMapView() {
  if (!AGENT_MAP_URL) return null;
  return (
    <iframe
      title="Agent map"
      src={AGENT_MAP_URL}
      className="h-full w-full border-0 bg-background"
    />
  );
}
