import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Text, Line } from '@react-three/drei';
import { SimulationCanvas } from '../../../components/SimulationCanvas';
import { markSimulationInteracted, logSimulationEvent } from '../../../lib/storage';

export default function ParallelLines() {
  const [angleDeg, setAngleDeg] = useState<number>(60);
  const [showAngles, setShowAngles] = useState<boolean>(true);

  useEffect(() => {
    markSimulationInteracted('lesson-parallel-lines');
    logSimulationEvent({
      simulationSlug: 'parallel-lines',
      eventType: 'open',
      occurredAt: new Date().toISOString(),
    });
  }, []);

  const handleReset = () => {
    setAngleDeg(60);
    setShowAngles(true);
    logSimulationEvent({
      simulationSlug: 'parallel-lines',
      eventType: 'reset',
      occurredAt: new Date().toISOString(),
    });
  };

  const handleAngleChange = (val: number) => {
    setAngleDeg(val);
    logSimulationEvent({
      simulationSlug: 'parallel-lines',
      eventType: 'parameter_change',
      payload: { angleDeg: val },
      occurredAt: new Date().toISOString(),
    });
  };

  const angleRad = (angleDeg * Math.PI) / 180;
  const slope = Math.tan(angleRad);
  
  // Parallel lines at y = 2 and y = -2
  const y1 = 2;
  const y2 = -2;

  // Intersections
  // x = y / slope
  const x1 = y1 / slope;
  const x2 = y2 / slope;

  // 8 Angles
  // At intersection 1 (top):
  // A1 (top-right, acute if angle < 90) = 180 - angleDeg
  // A2 (top-left) = angleDeg
  // A3 (bottom-left) = 180 - angleDeg
  // A4 (bottom-right) = angleDeg

  const acute = angleDeg < 90 ? angleDeg : 180 - angleDeg;
  const obtuse = 180 - acute;

  const a1 = obtuse;
  const a2 = angleDeg;
  const a3 = obtuse;
  const a4 = angleDeg;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationCanvas cameraPosition={[0, 0, 15]} fov={50} onReset={handleReset}>
        <group position={[0, 0, 0]}>
          {/* Parallel Line 1 */}
          <Line points={[[-10, y1, 0], [10, y1, 0]]} color="#2563eb" lineWidth={3} />
          <Text position={[8, y1 + 0.5, 0]} fontSize={0.5} color="#2563eb">d1</Text>
          
          {/* Parallel Line 2 */}
          <Line points={[[-10, y2, 0], [10, y2, 0]]} color="#dc2626" lineWidth={3} />
          <Text position={[8, y2 + 0.5, 0]} fontSize={0.5} color="#dc2626">d2</Text>
          
          {/* Transversal Line */}
          <Line points={[[-10 / slope, -10, 0], [10 / slope, 10, 0]]} color="#059669" lineWidth={3} />
          <Text position={[8 / slope, 8.5, 0]} fontSize={0.5} color="#059669">t</Text>

          {/* Intersections */}
          <mesh position={[x1, y1, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          <Text position={[x1 - 0.5, y1 + 0.5, 0]} fontSize={0.4} color="#d97706">A</Text>

          <mesh position={[x2, y2, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#d97706" />
          </mesh>
          <Text position={[x2 - 0.5, y2 + 0.5, 0]} fontSize={0.4} color="#d97706">B</Text>

          {showAngles && (
            <>
              {/* Angles at A */}
              <Text position={[x1 + 1, y1 + 0.5, 0]} fontSize={0.4} color="#7c3aed">A1: {a1}°</Text>
              <Text position={[x1 - 1, y1 + 0.5, 0]} fontSize={0.4} color="#b45309">A2: {a2}°</Text>
              <Text position={[x1 - 1, y1 - 0.5, 0]} fontSize={0.4} color="#7c3aed">A3: {a3}°</Text>
              <Text position={[x1 + 1, y1 - 0.5, 0]} fontSize={0.4} color="#b45309">A4: {a4}°</Text>

              {/* Angles at B */}
              <Text position={[x2 + 1, y2 + 0.5, 0]} fontSize={0.4} color="#7c3aed">B1: {a1}°</Text>
              <Text position={[x2 - 1, y2 + 0.5, 0]} fontSize={0.4} color="#b45309">B2: {a2}°</Text>
              <Text position={[x2 - 1, y2 - 0.5, 0]} fontSize={0.4} color="#7c3aed">B3: {a3}°</Text>
              <Text position={[x2 + 1, y2 - 0.5, 0]} fontSize={0.4} color="#b45309">B4: {a4}°</Text>
            </>
          )}
        </group>
        <gridHelper args={[20, 20, '#cbd5e1', '#e2e8f0']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -1]} />
      </SimulationCanvas>

      <div className="sim-info">
        <div className="sim-info-item">
          <div className="label">Góc tạo bởi d1, d2 và cát tuyến t</div>
          <div className="value" style={{ color: '#10b981' }}>{angleDeg}°</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Góc nhọn</div>
          <div className="value" style={{ color: '#eab308' }}>{acute}°</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Góc tù</div>
          <div className="value" style={{ color: '#a855f7' }}>{obtuse}°</div>
        </div>
      </div>

      <div className="theorem-block">
        <div className="theorem-title">
          TÍNH CHẤT CÁC CẶP GÓC
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          <div>• <strong>Đồng vị:</strong> A2 = B2 = {a2}°</div>
          <div>• <strong>So le trong:</strong> A3 = B1 = {a3}°</div>
          <div>• <strong>So le ngoài:</strong> A2 = B4 = {a2}°</div>
          <div>• <strong>Trong cùng phía:</strong> A4 + B1 = {a4} + {a1} = 180°</div>
        </div>
      </div>

      <div className="sim-controls">
        <div className="sim-control-group">
          <label>
            Góc nghiêng cát tuyến: <span>{angleDeg}°</span>
          </label>
          <input
            type="range"
            min="10"
            max="170"
            step="1"
            value={angleDeg}
            onChange={(e) => handleAngleChange(Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', width: '100%', marginTop: 8 }}>
          <button
            className={`btn btn-sm ${showAngles ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowAngles(!showAngles)}
          >
            {showAngles ? 'Ẩn số đo góc' : 'Hiện số đo góc'}
          </button>
        </div>
      </div>
    </div>
  );
}
