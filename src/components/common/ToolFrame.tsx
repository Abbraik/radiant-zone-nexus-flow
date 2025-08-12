import React from 'react'
import { cn } from '@/lib/utils'

type ToolFrameProps = {
  title?: React.ReactNode
  actions?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export default function ToolFrame({ title, actions, className, children }: ToolFrameProps){
  return (
    <section className={cn('rounded-xl border bg-card text-card-foreground shadow-sm', className)}>
      {(title || actions) && (
        <header className="flex items-center gap-3 border-b px-4 py-3">
          {title && <h1 className="text-base font-medium">{title}</h1>}
          <div className="flex-1" />
          {actions}
        </header>
      )}
      <div className="p-4">
        {children}
      </div>
    </section>
  )
}
