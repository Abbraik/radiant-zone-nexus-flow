import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type ScenarioRef = { id: string; color?: string }

export default function TrajectoryChart({ data, scenarios, indexKey }:{
  data: any[]
  scenarios: ScenarioRef[]
  indexKey: 'SHI' | 'SPI'
}){
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" label={{ value: 'Time (months)', position: 'insideBottomRight', offset: -5 }}/>
        <YAxis domain={[0,1]} label={{ value: indexKey, angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        {scenarios.map(s => (
          <Line
            key={s.id}
            type="monotone"
            dataKey={`${s.id}_${indexKey}`}
            stroke={s.color || '#0ea5e9'}
            dot={false}
            name={`${s.id} ${indexKey}`}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
