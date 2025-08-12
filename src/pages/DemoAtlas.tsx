import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEMO_CASES, applyDemoCase } from '@/modules/demo/demoData'
import { useTour } from '@/modules/tours/GuidedTourProvider'

export default function DemoAtlas(){
  const nav = useNavigate()
  const tour = useTour()

  useEffect(()=>{
    document.title = 'Seed Atlas • Demo Cases'
    const meta = document.querySelector('meta[name="description"]') || document.createElement('meta')
    meta.setAttribute('name','description')
    meta.setAttribute('content','Explore three pre-built demo cases and launch guided tours.')
    document.head.appendChild(meta)
  },[])

  const launch = (id: Parameters<typeof applyDemoCase>[0])=>{
    tour.start(id)
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Seed Atlas</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DEMO_CASES.map(c=> (
          <article key={c.id} className="p-4 rounded-lg border bg-card/70 backdrop-blur text-card-foreground space-y-2">
            <div className="font-medium">{c.title}</div>
            <p className="text-sm opacity-80">{c.description}</p>
            <div className="flex items-center gap-3 text-xs opacity-70">
              <span>{c.loops.length} loops</span>
              <span>{c.bundles.length} bundles</span>
              <span>~{c.durationMin} min</span>
            </div>
            <div className="pt-2">
              <button onClick={()=>launch(c.id)} className="px-3 py-2 rounded bg-primary text-primary-foreground">Launch Tour</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
