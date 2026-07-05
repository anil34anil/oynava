"use client";

import { useEffect } from "react";

interface PlaygamaWidgetsQueue {
  clbs: Array<() => void>;
  defineWidget?: (opts: { widget_id: string; element_id: string }) => void;
  showWidget?: (elementId: string) => void;
}

declare global {
  interface Window {
    playgama_widgets?: PlaygamaWidgetsQueue;
  }
}

/** Playgama PlayBox widget — panelde üretilen widget_id'ye göre oyun önizleme şeridi gösterir. */
export function PlaygamaWidget({ widgetId, className }: { widgetId: string; className?: string }) {
  const elementId = `widget-playgama-${widgetId}`;

  useEffect(() => {
    window.playgama_widgets = window.playgama_widgets || { clbs: [] };
    window.playgama_widgets.clbs.push(() => {
      window.playgama_widgets?.defineWidget?.({ widget_id: widgetId, element_id: elementId });
      window.playgama_widgets?.showWidget?.(elementId);
    });
  }, [widgetId, elementId]);

  return <div id={elementId} className={className} />;
}
