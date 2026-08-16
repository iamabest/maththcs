import { useState, useEffect } from 'react';
import { Text, Line } from '@react-three/drei';
import { SimulationCanvas } from '../../../components/SimulationCanvas';
import { markSimulationInteracted, logSimulationEvent } from '../../../lib/storage';

export default function LinearFunction() {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(2);

  useEffect(() => {
    markSimulationInteracted('lesson-linear-function');
    logSimulationEvent({
      simulationSlug: 'linear-function',
      eventType: 'open',
      occurredAt: new Date().toISOString(),
    });
  }, []);

  const handleReset = () => {
    setA(1);
    setB(2);
    logSimulationEvent({
      simulationSlug: 'linear-function',
      eventType: 'reset',
      occurredAt: new Date().toISOString(),
    });
  };

  const handleParamChange = (newA: number, newB: number) => {
    setA(newA);
    setB(newB);
    logSimulationEvent({
      simulationSlug: 'linear-function',
      eventType: 'parameter_change',
      payload: { a: newA, b: newB },
      occurredAt: new Date().toISOString(),
    });
  };

  // Line points
  const points: [number, number, number][] = [
    [-10, a * -10 + b, 0],
    [10, a * 10 + b, 0]
  ];

  const xIntercept = a !== 0 ? -b / a : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationCanvas cameraPosition={[0, 0, 15]} fov={50} onReset={handleReset}>
        <group position={[0, 0, 0]}>
          {/* Axes */}
          <Line points={[[-12, 0, 0], [12, 0, 0]]} color="#64748b" lineWidth={2} />
          <Line points={[[0, -12, 0], [0, 12, 0]]} color="#64748b" lineWidth={2} />
          <Text position={[12.5, 0, 0]} fontSize={0.5} color="#1e293b">x</Text>
          <Text position={[0, 12.5, 0]} fontSize={0.5} color="#1e293b">y</Text>
          
          {/* Origin */}
          <Text position={[-0.5, -0.5, 0]} fontSize={0.4} color="#64748b">O</Text>

          {/* Function Line */}
          <Line points={points} color="#2563eb" lineWidth={3} />
          
          {/* Intersections */}
          <mesh position={[0, b, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <Text position={[-0.8, b + 0.3, 0]} fontSize={0.4} color="#dc2626">(0, {b})</Text>

          {xIntercept !== null && (
            <>
              <mesh position={[xIntercept, 0, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#059669" />
              </mesh>
              <Text position={[xIntercept, -0.6, 0]} fontSize={0.4} color="#059669">({xIntercept.toFixed(1)}, 0)</Text>
            </>
          )}

        </group>
        <gridHelper args={[24, 24, '#cbd5e1', '#e2e8f0']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]} />
      </SimulationCanvas>

      <div className="sim-info">
        <div className="sim-info-item">
          <div className="label">Phương trình</div>
          <div className="value" style={{ color: '#2563eb' }}>y = {a}x {b >= 0 ? '+' : '-'} {Math.abs(b)}</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Hệ số góc (a)</div>
          <div className="value" style={{ color: '#0284c7' }}>{a} ({a > 0 ? 'Đồng biến' : a < 0 ? 'Nghịch biến' : 'Hằng số'})</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Tung độ gốc (b)</div>
          <div className="value" style={{ color: '#dc2626' }}>{b}</div>
        </div>
      </div>

      <div className="sim-controls">
        <div className="sim-control-group">
          <label>
            Hệ số góc (a): <span>{a}</span>
          </label>
          <input
            type="range"
            min="-5"
            max="5"
            step="0.5"
            value={a}
            onChange={(e) => handleParamChange(Number(e.target.value), b)}
          />
        </div>

        <div className="sim-control-group">
          <label>
            Tung độ gốc (b): <span>{b}</span>
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={b}
            onChange={(e) => handleParamChange(a, Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
