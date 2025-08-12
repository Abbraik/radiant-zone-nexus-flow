import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { applyDemoCase, type DemoCaseId, DEMO_CASES } from '@/modules/demo/demoData'

export type TourStep = {
  id: string
  title: string
  description: string
  // When provided, the step is considered complete once the route matches
  routeStartsWith?: string
  anchorSelector?: string
}

export type TourSession = {
  caseId: DemoCaseId
  stepIndex: number
}

type Ctx = {
  active: boolean
  session: TourSession | null
  steps: TourStep[]
  start: (caseId: DemoCaseId) => void
  next: () => void
  back: () => void
  exit: () => void
  restart: () => void
}

const TourCtx = createContext<Ctx | null>(null)

const STORAGE_KEY = 'rznf:tours'

function loadProgress(): Record<string, number>{
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
function saveProgress(map: Record<string, number>){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

const TOUR_DEFS: Record<DemoCaseId, TourStep[]> = {
  'youth-employment': [
    { id: 'ye-1', title: 'Loop Health', description: 'View Youth Unemployment Loop in MONITOR.', routeStartsWith: '/monitor/loop-health' },
    { id: 'ye-2', title: 'Open Bundles', description: 'Go to ACT and open the mapped bundle.', routeStartsWith: '/act/bundles' },
    { id: 'ye-3', title: 'Pathway', description: 'Open the Pathway for the bundle item.', routeStartsWith: '/act/pathway-builder' },
    { id: 'ye-4', title: 'Leverage Ladder', description: 'See LP assignment in THINK → Leverage Ladder.', routeStartsWith: '/think/leverage' },
    { id: 'ye-5', title: 'Back to Monitor', description: 'Return to MONITOR to observe change.', routeStartsWith: '/monitor/loop-health' },
    { id: 'ye-6', title: 'Network Explorer', description: 'Visit INNOVATE → Network Explorer.', routeStartsWith: '/innovate/network-explorer' },
    { id: 'ye-7', title: 'Evidence & Publish', description: 'Open ADMIN → Evidence Inbox to link evidence.', routeStartsWith: '/admin/changes-queue' },
  ],
  'fertility-housing': [
    { id: 'fh-1', title: 'Loop Health', description: 'Inspect housing stock loop.', routeStartsWith: '/monitor/loop-health' },
    { id: 'fh-2', title: 'Bundles', description: 'Open the housing bundle.', routeStartsWith: '/act/bundles' },
    { id: 'fh-3', title: 'Leverage Ladder', description: 'See leverage depth and tier.', routeStartsWith: '/think/leverage' },
  ],
  'service-throughput': [
    { id: 'st-1', title: 'Loop Health', description: 'Check clinic staffing loop status.', routeStartsWith: '/monitor/loop-health' },
    { id: 'st-2', title: 'Bundles', description: 'Open Throughput Booster bundle.', routeStartsWith: '/act/bundles' },
    { id: 'st-3', title: 'Network', description: 'Navigate to Network Explorer.', routeStartsWith: '/innovate/network-explorer' },
  ],
}

export function GuidedTourProvider({ children }:{ children: React.ReactNode }){
  const [session, setSession] = useState<TourSession|null>(null)
  const [steps, setSteps] = useState<TourStep[]>([])
  const nav = useNavigate()
  const loc = useLocation()
  const progressRef = useRef<Record<string, number>>(loadProgress())

  const active = !!session

  // Update completion based on route
  useEffect(()=>{
    if (!session) return
    const step = steps[session.stepIndex]
    if (step?.routeStartsWith && loc.pathname.startsWith(step.routeStartsWith)){
      // allow next
    }
  }, [loc.pathname, session, steps])

  const start = useCallback((caseId: DemoCaseId)=>{
    applyDemoCase(caseId)
    const defs = TOUR_DEFS[caseId]
    setSteps(defs)
    const map = progressRef.current
    const savedIdx = map[caseId] ?? 0
    const nextIdx = Math.min(savedIdx, defs.length-1)
    setSession({ caseId, stepIndex: nextIdx })
    // Navigate to the first/next required route
    const target = defs[nextIdx]?.routeStartsWith || '/'
    nav(target, { replace: false })
  },[nav])

  const next = useCallback(()=>{
    if (!session) return
    const defs = TOUR_DEFS[session.caseId]
    const nextIdx = Math.min(session.stepIndex + 1, defs.length-1)
    const map = progressRef.current
    map[session.caseId] = nextIdx
    saveProgress(map)
    setSession({ ...session, stepIndex: nextIdx })
    const target = defs[nextIdx]?.routeStartsWith
    if (target) nav(target)
  },[session, nav])

  const back = useCallback(()=>{
    if (!session) return
    const prevIdx = Math.max(0, session.stepIndex - 1)
    setSession({ ...session, stepIndex: prevIdx })
    const target = TOUR_DEFS[session.caseId][prevIdx]?.routeStartsWith
    if (target) nav(target)
  },[session, nav])

  const exit = useCallback(()=>{
    setSession(null)
  },[])

  const restart = useCallback(()=>{
    if (!session) return
    const map = progressRef.current
    map[session.caseId] = 0
    saveProgress(map)
    setSession({ ...session, stepIndex: 0 })
    const target = TOUR_DEFS[session.caseId][0]?.routeStartsWith
    if (target) nav(target)
  },[session, nav])

  const ctx: Ctx = useMemo(()=>({ active, session, steps, start, next, back, exit, restart }), [active, session, steps, start, next, back, exit, restart])

  return (
    <TourCtx.Provider value={ctx}>
      {children}
      {active && <Overlay steps={steps} stepIndex={session!.stepIndex} onNext={next} onBack={back} onExit={exit} />}
    </TourCtx.Provider>
  )
}

function Overlay({ steps, stepIndex, onNext, onBack, onExit }:{ steps: TourStep[]; stepIndex: number; onNext:()=>void; onBack:()=>void; onExit:()=>void }){
  const step = steps[stepIndex]
  const sel = step?.anchorSelector?.trim()
  const el = sel ? (document.querySelector(sel) as HTMLElement | null) : null
  const rect = el?.getBoundingClientRect()

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" />
      {rect && (
        <div className="absolute border-2 border-primary/80 rounded-md pointer-events-none" style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }} />
      )}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] sm:w-[640px] p-4 rounded-lg border bg-card/90 backdrop-blur text-card-foreground shadow">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="text-xs opacity-70">Step {stepIndex+1} of {steps.length}</div>
            <div className="font-semibold">{step?.title}</div>
            <div className="text-sm mt-1 opacity-80">{step?.description}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="px-3 py-1.5 rounded border text-sm">Back</button>
            <button onClick={onNext} className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm">Next</button>
            <button onClick={onExit} className="px-3 py-1.5 rounded border text-sm">Exit</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export function useTour(){
  const ctx = useContext(TourCtx)
  if (!ctx) throw new Error('useTour must be used within GuidedTourProvider')
  return ctx
}
