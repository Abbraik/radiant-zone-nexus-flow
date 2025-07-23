import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import * as THREE from 'three';

interface DigitalTwinPreviewProps {
  data: {
    srt: number;
    tension: 'low' | 'medium' | 'high';
    throughput: number[];
    responseTime: number[];
    resourceUtilization: number;
  };
  width?: number;
  height?: number;
  className?: string;
}

// Animated response curve based on SRT
const ResponseCurve: React.FC<{ srt: number; tension: string }> = ({ srt, tension }) => {
  const lineRef = useRef<any>(null);
  
  // Generate curve points based on SRT
  const points = React.useMemo(() => {
    const curve: THREE.Vector3[] = [];
    const amplitude = tension === 'high' ? 0.8 : tension === 'medium' ? 0.5 : 0.3;
    const frequency = srt * 2;
    
    for (let i = 0; i <= 50; i++) {
      const x = (i / 50) * 4 - 2;
      const y = Math.sin(x * frequency) * amplitude * Math.exp(-Math.abs(x) * srt);
      curve.push(new THREE.Vector3(x, y, 0));
    }
    
    return curve;
  }, [srt, tension]);

  // Animation
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const getColor = (tension: string) => {
    switch (tension) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <Line
      ref={lineRef}
      points={points}
      color={getColor(tension)}
      lineWidth={3}
      transparent
      opacity={0.8}
    />
  );
};

// Floating particles representing system activity
const SystemParticles: React.FC<{ count: number; tension: string }> = ({ count, tension }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const [positions] = useState(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      ]);
    }
    return pos;
  });

  useFrame((state) => {
    if (meshRef.current) {
      for (let i = 0; i < count; i++) {
        const matrix = new THREE.Matrix4();
        const speed = tension === 'high' ? 0.02 : tension === 'medium' ? 0.015 : 0.01;
        
        positions[i][1] += speed + Math.sin(state.clock.elapsedTime + i) * 0.001;
        
        // Wrap around
        if (positions[i][1] > 2) positions[i][1] = -2;
        
        matrix.setPosition(positions[i][0], positions[i][1], positions[i][2]);
        meshRef.current.setMatrixAt(i, matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const getColor = (tension: string) => {
    switch (tension) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={getColor(tension)} transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Resource utilization visualization
const ResourceGauge: React.FC<{ utilization: number }> = ({ utilization }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
  });

  const getUtilizationColor = (util: number) => {
    if (util > 90) return '#ef4444';
    if (util > 70) return '#f59e0b';
    return '#10b981';
  };

  const angle = (utilization / 100) * Math.PI * 2;

  return (
    <group position={[1.5, 0, 0]}>
      {/* Background ring */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshBasicMaterial color="#374151" transparent opacity={0.3} />
      </mesh>
      
      {/* Utilization arc */}
      <mesh ref={ringRef} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.3, 0.03, 8, Math.max(1, Math.floor(32 * (angle / (Math.PI * 2))))]} />
        <meshBasicMaterial color={getUtilizationColor(utilization)} />
      </mesh>
      
      {/* Center indicator */}
      <mesh>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={getUtilizationColor(utilization)} />
      </mesh>
    </group>
  );
};

// Main scene component
const DigitalTwinScene: React.FC<{
  srt: number;
  tension: 'low' | 'medium' | 'high';
  resourceUtilization: number;
}> = ({ srt, tension, resourceUtilization }) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={0.6} />
      
      <ResponseCurve srt={srt} tension={tension} />
      <SystemParticles count={20} tension={tension} />
      <ResourceGauge utilization={resourceUtilization} />
    </>
  );
};

export const DigitalTwinPreview: React.FC<DigitalTwinPreviewProps> = ({
  data,
  width = 300,
  height = 200,
  className = ''
}) => {
  const { srt, tension, throughput, responseTime, resourceUtilization } = data;
  
  const currentThroughput = throughput[throughput.length - 1] || 0;
  const currentResponseTime = responseTime[responseTime.length - 1] || 0;

  return (
    <Card className={`relative overflow-hidden glass-secondary border-border-subtle/20 ${className}`}>
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Header Overlay */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="space-y-1">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                tension === 'high' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                tension === 'medium' ? 'bg-warning/20 text-warning border-warning/30' :
                'bg-success/20 text-success border-success/30'
              }`}
            >
              {tension} tension
            </Badge>
            <div className="text-xs text-foreground-subtle">
              SRT: {srt.toFixed(2)}
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="text-xs text-foreground-subtle">
              Throughput: {currentThroughput.toFixed(1)}
            </div>
            <div className="text-xs text-foreground-subtle">
              Response: {currentResponseTime.toFixed(1)}s
            </div>
          </div>
        </div>

        {/* Bottom Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div className="text-xs text-foreground-subtle">
            Digital Twin Preview
          </div>
          
          <div className="text-xs text-foreground-subtle">
            CPU: {resourceUtilization}%
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ width, height }}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          style={{ 
            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.8) 0%, rgba(26, 26, 46, 0.6) 100%)',
            borderRadius: 'inherit'
          }}
        >
          <DigitalTwinScene
            srt={srt}
            tension={tension}
            resourceUtilization={resourceUtilization}
          />
        </Canvas>
      </div>
    </Card>
  );
};