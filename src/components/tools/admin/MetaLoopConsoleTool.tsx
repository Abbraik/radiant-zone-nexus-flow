import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useToolsStore } from '@/stores/toolsStore';
import { usePrecedenceStore } from '@/stores/precedenceStore';

export default function MetaLoopConsoleTool(){
  const open = useToolsStore(s=>s.admin.meta);
  const close = useToolsStore(s=>s.close);
  const { state, clear } = usePrecedenceStore();

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('admin','meta')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed inset-x-0 top-16 mx-auto w-[800px] rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Meta-Loop Console</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 p-4 bg-zinc-800/30">
              <div className="text-sm font-medium mb-2">Current Precedence State</div>
              <div className="text-xs opacity-70">
                Active: {state.active ? 'YES' : 'NO'}
                {state.active && (
                  <>
                    <br />Meta-REL ID: {state.metaRelId?.slice(0,8)}
                    <br />Paused RELs: {state.relIds.map(id=>id.slice(0,8)).join(', ')}
                    <br />Banner: {state.banner}
                  </>
                )}
              </div>
              {state.active && (
                <button 
                  onClick={clear}
                  className="mt-2 text-xs px-2 py-1 rounded bg-red-600 hover:bg-red-700 transition-colors">
                  Clear Precedence
                </button>
              )}
            </div>

            <div className="text-sm opacity-70">
              Meta-Loop Console provides administrative control over system-wide precedence states.
              Future versions will include conflict resolution, sequence management, and meta-analytics.
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}