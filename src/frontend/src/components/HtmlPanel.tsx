import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDOMStore } from '../store/domStore';

export function HtmlPanel() {
  const rawHtml = useDOMStore(state => state.rawHtml);
  const nodes = useDOMStore(state => state.nodes);
  const matchedNodeIds = useDOMStore(state => state.matchedNodeIds);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const cleanHtml = useMemo(
    () => rawHtml.replace(/<script[\s\S]*?<\/script>/gi, ''),
    [rawHtml]
  );

  const annotatedHtml = useMemo(() => {
    if (!cleanHtml.trim()) {
      return cleanHtml;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanHtml, 'text/html');
    const domOrderedNodes = sortNodesForDomOrder(nodes);
    let index = 0;

    function annotate(element: Element) {
      const currentNode = domOrderedNodes[index];
      if (!currentNode) return;

      element.setAttribute('data-node-id', currentNode.id);
      index++;

      for (const child of Array.from(element.children)) {
        annotate(child);
      }
    }

    if (doc.documentElement) {
      annotate(doc.documentElement);
    }

    const doctype = doc.doctype ? `<!DOCTYPE ${doc.doctype.name}>\n` : '';
    return `${doctype}${doc.documentElement.outerHTML}`;
  }, [cleanHtml, nodes]);

  const applyHighlight = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;

    let style = doc.getElementById('dom-highlight-style');
    if (!style) {
      style = doc.createElement('style');
      style.id = 'dom-highlight-style';
      style.textContent = `
        .dom-highlight {
          background: rgba(255, 230, 90, 0.55) !important;
          outline: 2px solid #ef4444 !important;
          outline-offset: 1px;
        }
      `;
      doc.head.appendChild(style);
    }

    doc.querySelectorAll('.dom-highlight').forEach(element => {
      element.classList.remove('dom-highlight');
    });

    if (matchedNodeIds.length === 0) return;

    const matchedElements: Element[] = [];
    for (const nodeId of matchedNodeIds) {
      const element = doc.querySelector(`[data-node-id="${nodeId}"]`);
      if (!element) continue;

      element.classList.add('dom-highlight');
      matchedElements.push(element);
    }

    const firstMatch = matchedElements[0];
    if (firstMatch instanceof HTMLElement) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [matchedNodeIds]);

  useEffect(() => {
    applyHighlight();
  }, [annotatedHtml, applyHighlight]);

  if (!rawHtml.trim()) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500 text-sm">HTML tidak ada</p>
        <p className="text-gray-400 text-xs">Parse URL atau upload file HTML dahulu</p>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      srcDoc={annotatedHtml}
      title="HTML Preview"
      className="w-full h-full bg-white border-0"
      onLoad={applyHighlight}
    />
  );
}

function compareNodeIds(a: string, b: string): number {
  const aNum = Number(a);
  const bNum = Number(b);
  if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
    return aNum - bNum;
  }
  return a.localeCompare(b);
}

function sortNodesForDomOrder<T extends { id: string }>(nodes: T[]): T[] {
  return [...nodes].sort((a, b) => compareNodeIds(String(a.id), String(b.id)));
}
