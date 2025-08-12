import React, { useMemo, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useChangesQueueStore, type ChangeItem, type EvidenceItem } from '@/stores/useChangesQueueStore'
import DiffViewer from '@/components/common/DiffViewer'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertTriangle, GitPullRequest, Boxes, Workflow } from 'lucide-react'

export default function ChangesQueuePage(){
  const { changes, evidence, publishAllEnabled, hasStaleFixtures } = useChangesQueueStore()
  const [showStaleOnly, setShowStaleOnly] = useState(false)

  const grouped = useMemo(()=>{
    const items = showStaleOnly ? changes.filter(isStale) : changes
    return {
      Loop: items.filter(c=>c.type==='Loop'),
      Bundle: items.filter(c=>c.type==='Bundle'),
      Pathway: items.filter(c=>c.type==='Pathway'),
    }
  },[changes, showStaleOnly])

  return (
    <div className="p-4 space-y-4">
      {hasStaleFixtures(30) && (
        <div className="p-3 rounded-lg border bg-warning/15 text-warning-foreground flex items-center justify-between">
          <div className="flex items-center gap-2"><AlertTriangle size={16}/> Fixtures stale — review and refresh</div>
          <button className="underline text-sm" onClick={()=>setShowStaleOnly(true)}>Show stale only</button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Changes Queue</h1>
        <button className={`px-3 py-2 rounded ${publishAllEnabled()? 'bg-primary text-primary-foreground':'bg-muted text-muted-foreground cursor-not-allowed'}`} disabled={!publishAllEnabled()}>Publish All</button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending Changes</TabsTrigger>
          <TabsTrigger value="evidence">Evidence Inbox</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4">
          <ChangeGroup title="Loops" items={grouped.Loop} icon={<GitPullRequest size={16}/>} />
          <ChangeGroup title="Bundles" items={grouped.Bundle} icon={<Boxes size={16}/>} />
          <ChangeGroup title="Pathways" items={grouped.Pathway} icon={<Workflow size={16}/>} />
        </TabsContent>
        <TabsContent value="evidence">
          <EvidenceInbox />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ChangeGroup({ title, items, icon }:{ title:string; items: ChangeItem[]; icon: React.ReactNode }){
  if (items.length===0) return null
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2"><span>{icon}</span><h2 className="font-medium">{title}</h2></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map(c=> <ChangeCard key={c.id} c={c} />)}
      </div>
    </section>
  )
}

function statusBadge(s: ChangeItem['status']){
  const cls = s==='Ready' ? 'bg-success text-success-foreground' : s==='In Review' ? 'bg-warning text-warning-foreground' : 'bg-muted'
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{s}</span>
}

function ChangeCard({ c }:{ c: ChangeItem }){
  return (
    <Dialog>
      <div className="p-3 rounded-lg border bg-card text-card-foreground">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs opacity-70">{c.type}</div>
            <div className="font-medium">{c.name}</div>
            <div className="text-xs opacity-70">By {c.submitter} • {new Date(c.updatedAt).toLocaleString()}</div>
          </div>
          {statusBadge(c.status)}
        </div>
        <div className="mt-2 text-sm">
          Evidence: <Badge variant="secondary">{c.evidenceIds.length}</Badge>
        </div>
        <div className="mt-3">
          <DialogTrigger asChild>
            <button className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm">Open</button>
          </DialogTrigger>
        </div>
      </div>
      <DialogContent className="sm:max-w-[880px]">
        <DialogHeader>
          <DialogTitle>{c.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <DiffViewer before={c.diff.before} after={c.diff.after} format={c.diff.format} />
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded bg-success text-success-foreground">Accept</button>
            <button className="px-3 py-2 rounded bg-destructive text-destructive-foreground">Reject</button>
          </div>
          <AttachedEvidence changeId={c.id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AttachedEvidence({ changeId }:{ changeId: string }){
  const { evidence, linkEvidence, setEvidenceQuality } = useChangesQueueStore()
  const linked = evidence.filter(e=> e.linkedIds.includes(changeId))
  const unlinked = evidence.filter(e=> !e.linkedIds.includes(changeId))
  return (
    <div className="space-y-2">
      <div className="font-medium">Evidence</div>
      {linked.length===0 && <div className="text-sm opacity-70">No evidence linked.</div>}
      <ul className="space-y-2">
        {linked.map(e=> (
          <li key={e.id} className="p-2 rounded border flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{e.title}</div>
              <div className="text-xs opacity-70">By {e.submitter}</div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>Quality</span>
              <select value={e.quality} onChange={ev=> setEvidenceQuality(e.id, Number(ev.target.value))} className="border rounded px-2 py-1">
                {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </li>
        ))}
      </ul>
      {unlinked.length>0 && (
        <div className="text-sm">
          <div className="mb-1">Link more evidence</div>
          <div className="flex flex-wrap gap-2">
            {unlinked.map(e=> <button key={e.id} onClick={()=>linkEvidence(e.id, changeId)} className="px-2 py-1 rounded border text-xs hover:bg-muted/60">+ {e.title}</button>)}
          </div>
        </div>
      )}
    </div>
  )
}

function EvidenceInbox(){
  const { evidence, changes, linkEvidence, setEvidenceQuality } = useChangesQueueStore()
  const [sel, setSel] = useState<EvidenceItem | null>(null)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Linked Item(s)</TableHead>
              <TableHead>Quality</TableHead>
              <TableHead>Submitter</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evidence.map(e=> (
              <TableRow key={e.id} className="cursor-pointer hover:bg-muted/40" onClick={()=>setSel(e)}>
                <TableCell className="font-medium">{e.title}</TableCell>
                <TableCell className="text-sm">{e.linkedIds.length}</TableCell>
                <TableCell>
                  <select value={e.quality} onChange={ev=> setEvidenceQuality(e.id, Number(ev.target.value))} className="border rounded px-2 py-1 text-sm">
                    {[1,2,3,4,5].map(n=> <option key={n} value={n}>{n}</option>)}
                  </select>
                </TableCell>
                <TableCell className="text-sm">{e.submitter}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="lg:col-span-1 p-3 rounded-lg border bg-card text-card-foreground">
        {!sel ? (
          <div className="text-sm opacity-70">Select an evidence to preview.</div>
        ) : (
          <div className="space-y-2">
            <div className="font-medium">{sel.title}</div>
            {sel.text && <pre className="p-2 rounded bg-muted/50 text-xs whitespace-pre-wrap">{sel.text}</pre>}
            {sel.fileUrl && <a className="underline text-sm" href={sel.fileUrl} target="_blank" rel="noreferrer">Open file</a>}
            <div className="text-sm">
              <div className="mb-1">Link to Item</div>
              <div className="flex flex-wrap gap-2">
                {changes.map(c=> (
                  <button key={c.id} onClick={()=>linkEvidence(sel.id, c.id)} className="px-2 py-1 rounded border text-xs hover:bg-muted/60">
                    {c.type}: {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function isStale(c: ChangeItem){
  if (!c.lastPublishedAt) return false
  const thirty = Date.now() - 30*24*3600*1000
  return new Date(c.lastPublishedAt).getTime() < thirty
}
