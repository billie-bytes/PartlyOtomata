import { useDOMStore } from '../store/domStore';

export function HtmlPanel() {
  const rawHtml = useDOMStore(state => state.rawHtml);

  if (!rawHtml.trim()) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-gray-500 text-sm">HTML tidak ada</p>
        <p className="text-gray-400 text-xs">Parse URL atau upload file HTML dahulu</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <pre className="min-h-full p-4 text-xs leading-6 text-gray-800 whitespace-pre-wrap break-words font-mono">
        <code>{rawHtml}</code>
      </pre>
    </div>
  );
}
