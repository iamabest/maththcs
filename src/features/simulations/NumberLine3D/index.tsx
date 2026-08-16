import { useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import { SimulationCanvas } from '../../../components/SimulationCanvas';
import { markSimulationInteracted, logSimulationEvent } from '../../../lib/storage';

export default function NumberLine3D() {
  const [numA, setNumA] = useState<number>(-3);
  const [numB, setNumB] = useState<number>(4);
  const [showOpposite, setShowOpposite] = useState<boolean>(false);
  const [showDistance, setShowDistance] = useState<boolean>(true);

  useEffect(() => {
    markSimulationInteracted('lesson-number-line');
    logSimulationEvent({
      simulationSlug: 'number-line-3d',
      eventType: 'open',
      occurredAt: new Date().toISOString(),
    });
  }, []);

  const handleReset = () => {
    setNumA(-3);
    setNumB(4);
    setShowOpposite(false);
    setShowDistance(true);
    logSimulationEvent({
      simulationSlug: 'number-line-3d',
      eventType: 'reset',
      occurredAt: new Date().toISOString(),
    });
  };

  const handleParamChange = (a: number, b: number) => {
    setNumA(a);
    setNumB(b);
    logSimulationEvent({
      simulationSlug: 'number-line-3d',
      eventType: 'parameter_change',
      payload: { numA: a, numB: b },
      occurredAt: new Date().toISOString(),
    });
  };

  const diff = Math.abs(numA - numB);
  const comparison = numA < numB ? `${numA} < ${numB}` : numA > numB ? `${numA} > ${numB}` : `${numA} = ${numB}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 3D Scene */}
      <SimulationCanvas cameraPosition={[0, 4, 14]} fov={45} onReset={handleReset}>
        {/* Main Axis Line */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 24, 32]} />
          <meshStandardMaterial color="#475569" metalness={0.2} roughness={0.5} />
        </mesh>

        {/* Positive Arrow Head */}
        <mesh position={[12.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.3, 0.8, 16]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <Text position={[12.5, 0.8, 0]} fontSize={0.6} color="#0284c7" anchorX="center">
          + chiều dương
        </Text>

        {/* Ticks and Number Labels from -10 to 10 */}
        {Array.from({ length: 21 }, (_, i) => i - 10).map((n) => {
          const isOrigin = n === 0;
          return (
            <group key={n} position={[n, 0, 0]}>
              {/* Tick line */}
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[isOrigin ? 0.08 : 0.04, isOrigin ? 0.08 : 0.04, isOrigin ? 0.8 : 0.4, 16]} />
                <meshStandardMaterial color={isOrigin ? '#d97706' : '#64748b'} />
              </mesh>

              {/* Number Label */}
              <Text
                position={[0, -0.6, 0]}
                fontSize={isOrigin ? 0.5 : 0.38}
                color={isOrigin ? '#d97706' : n > 0 ? '#0284c7' : '#dc2626'}
                anchorX="center"
                anchorY="top"
              >
                {n.toString()}
              </Text>
            </group>
          );
        })}

        {/* Point A Marker */}
        <group position={[numA, 0.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <Text position={[0, 0.7, 0]} fontSize={0.45} color="#dc2626" anchorX="center" fontWeight="bold">
            {`A (${numA})`}
          </Text>
          {/* Drop line */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>

        {/* Point B Marker */}
        <group position={[numB, 0.8, 0]}>
          <mesh>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
          <Text position={[0, 0.7, 0]} fontSize={0.45} color="#2563eb" anchorX="center" fontWeight="bold">
            {`B (${numB})`}
          </Text>
          {/* Drop line */}
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
            <meshStandardMaterial color="#2563eb" />
          </mesh>
        </group>

        {/* Opposite of A (-numA) if toggled */}
        {showOpposite && numA !== 0 && (
          <group position={[-numA, 0.8, 0]}>
            <mesh>
              <sphereGeometry args={[0.28, 32, 32]} />
              <meshStandardMaterial color="#7c3aed" wireframe />
            </mesh>
            <Text position={[0, 0.7, 0]} fontSize={0.4} color="#7c3aed" anchorX="center">
              {`-A (${-numA})`}
            </Text>
          </group>
        )}

        {/* Distance interval bar between A and B */}
        {showDistance && numA !== numB && (
          <group position={[(numA + numB) / 2, 1.8, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.04, 0.04, Math.abs(numA - numB), 16]} />
              <meshStandardMaterial color="#059669" />
            </mesh>
            <Text position={[0, 0.4, 0]} fontSize={0.4} color="#059669" anchorX="center">
              {`Khoảng cách AB = ${diff}`}
            </Text>
          </group>
        )}

        {/* Grid floor for 3D depth perception */}
        <gridHelper args={[26, 26, '#cbd5e1', '#e2e8f0']} position={[0, -1, 0]} />
      </SimulationCanvas>

      {/* Realtime Mathematics Info Panel */}
      <div className="sim-info">
        <div className="sim-info-item">
          <div className="label">Điểm A</div>
          <div className="value" style={{ color: '#ec4899' }}>{numA}</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Điểm B</div>
          <div className="value" style={{ color: '#3b82f6' }}>{numB}</div>
        </div>
        <div className="sim-info-item">
          <div className="label">So sánh</div>
          <div className="value" style={{ color: '#f59e0b' }}>{comparison}</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Giá trị tuyệt đối |A|</div>
          <div className="value" style={{ color: '#06b6d4' }}>{Math.abs(numA)}</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Khoảng cách AB</div>
          <div className="value" style={{ color: '#10b981' }}>{diff}</div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="sim-controls">
        <div className="sim-control-group">
          <label>
            Vị trí điểm A: <span>{numA}</span>
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={numA}
            onChange={(e) => handleParamChange(Number(e.target.value), numB)}
          />
        </div>

        <div className="sim-control-group">
          <label>
            Vị trí điểm B: <span>{numB}</span>
          </label>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={numB}
            onChange={(e) => handleParamChange(numA, Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', width: '100%', marginTop: 8 }}>
          <button
            className={`btn btn-sm ${showOpposite ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowOpposite(!showOpposite)}
          >
            {showOpposite ? 'Ẩn số đối (-A)' : 'Hiện số đối (-A)'}
          </button>
          <button
            className={`btn btn-sm ${showDistance ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowDistance(!showDistance)}
          >
            {showDistance ? 'Ẩn khoảng cách AB' : 'Hiện khoảng cách AB'}
          </button>
        </div>
      </div>
    </div>
  );
}
