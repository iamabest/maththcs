import { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Text, Line } from '@react-three/drei';
import { SimulationCanvas } from '../../../components/SimulationCanvas';
import { markSimulationInteracted, logSimulationEvent } from '../../../lib/storage';

export default function InscribedAngle() {
  const radius = 4;
  // Arc angle of chord AB in degrees (angle at center)
  const [centralAngleDeg, setCentralAngleDeg] = useState<number>(120);
  // Position of M on major arc in normalized param [0..1]
  const [mPositionRatio, setMPositionRatio] = useState<number>(0.5);
  // Toggle show central angle lines
  const [showCentralAngle, setShowCentralAngle] = useState<boolean>(true);

  useEffect(() => {
    markSimulationInteracted('lesson-inscribed-angle');
    logSimulationEvent({
      simulationSlug: 'inscribed-angle',
      eventType: 'open',
      occurredAt: new Date().toISOString(),
    });
  }, []);

  const handleReset = () => {
    setCentralAngleDeg(120);
    setMPositionRatio(0.5);
    setShowCentralAngle(true);
    logSimulationEvent({
      simulationSlug: 'inscribed-angle',
      eventType: 'reset',
      occurredAt: new Date().toISOString(),
    });
  };

  // Points coordinates on circle (lying in XY plane, Z=0)
  const halfCentralRad = (centralAngleDeg * Math.PI) / 360;
  const posA: [number, number, number] = [
    radius * Math.cos(-halfCentralRad),
    radius * Math.sin(-halfCentralRad),
    0,
  ];
  const posB: [number, number, number] = [
    radius * Math.cos(halfCentralRad),
    radius * Math.sin(halfCentralRad),
    0,
  ];
  const posO: [number, number, number] = [0, 0, 0];

  // Point M moves along the major arc
  const marginRad = (15 * Math.PI) / 180;
  const startAngle = halfCentralRad + marginRad;
  const endAngle = 2 * Math.PI - halfCentralRad - marginRad;
  const angleM = startAngle + mPositionRatio * (endAngle - startAngle);

  const posM: [number, number, number] = [
    radius * Math.cos(angleM),
    radius * Math.sin(angleM),
    0,
  ];

  // Calculations
  const inscribedAngleDeg = centralAngleDeg / 2;

  // Arc curve for minor arc AB (subtended arc)
  const minorArcPoints = useMemo(() => {
    const curve = new THREE.EllipseCurve(
      0, 0,
      radius, radius,
      -halfCentralRad, halfCentralRad,
      false,
      0
    );
    return curve.getPoints(50).map((p) => [p.x, p.y, 0] as [number, number, number]);
  }, [radius, halfCentralRad]);

  // Full Circle Ring Points
  const circlePoints = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    return curve.getPoints(100).map((p) => [p.x, p.y, 0] as [number, number, number]);
  }, [radius]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 3D Scene */}
      <SimulationCanvas cameraPosition={[0, 0, 12]} fov={45} onReset={handleReset}>
        <group position={[0, 0, 0]}>
          {/* Main Circle Outline */}
          <Line points={circlePoints} color="#64748b" lineWidth={2} />

          {/* Minor Arc AB (Subtended arc - highlighted in red) */}
          <Line points={minorArcPoints} color="#dc2626" lineWidth={4} />

          {/* Chords MA and MB (Inscribed Angle Arms) */}
          <Line points={[posM, posA]} color="#0284c7" lineWidth={3} />
          <Line points={[posM, posB]} color="#0284c7" lineWidth={3} />

          {/* Central Angle Lines OA and OB (if enabled) */}
          {showCentralAngle && (
            <>
              <Line points={[posO, posA]} color="#d97706" lineWidth={2} dashed dashScale={10} />
              <Line points={[posO, posB]} color="#d97706" lineWidth={2} dashed dashScale={10} />
            </>
          )}

          {/* Center Point O */}
          <group position={posO}>
            <mesh>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#d97706" />
            </mesh>
            <Text position={[0.4, 0.4, 0]} fontSize={0.4} color="#0f172a">
              O (tâm)
            </Text>
          </group>

          {/* Point A */}
          <group position={posA}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <Text position={[0.5, -0.3, 0]} fontSize={0.45} color="#dc2626" fontWeight="bold">
              A
            </Text>
          </group>

          {/* Point B */}
          <group position={posB}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <Text position={[0.5, 0.3, 0]} fontSize={0.45} color="#dc2626" fontWeight="bold">
              B
            </Text>
          </group>

          {/* Point M (Inscribed Vertex) */}
          <group position={posM}>
            <mesh>
              <sphereGeometry args={[0.26, 32, 32]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
            <Text
              position={[posM[0] * 0.25, posM[1] * 0.25 + 0.6, 0]}
              fontSize={0.5}
              color="#0284c7"
              fontWeight="bold"
            >
              {`M (Đỉnh = ${inscribedAngleDeg}°)`}
            </Text>
          </group>
        </group>
      </SimulationCanvas>

      {/* Realtime Mathematics Info Panel */}
      <div className="sim-info">
        <div className="sim-info-item">
          <div className="label">Cung bị chắn AB</div>
          <div className="value" style={{ color: '#f43f5e' }}>{centralAngleDeg}°</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Góc ở tâm (AOB)</div>
          <div className="value" style={{ color: '#f59e0b' }}>{centralAngleDeg}°</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Góc nội tiếp (AMB)</div>
          <div className="value" style={{ color: '#22d3ee' }}>{inscribedAngleDeg}°</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Quan hệ</div>
          <div className="value" style={{ color: '#10b981', fontSize: '1.05rem' }}>
            AMB = ½ AOB
          </div>
        </div>
      </div>

      {/* Guided Discovery Insight */}
      <div className="theorem-block">
        <div className="theorem-title">
          QUAN SÁT & RÚT RA QUY LUẬT
        </div>
        <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>
          • Khi di chuyển slider <strong>"Vị trí điểm M trên cung"</strong>: Đỉnh M thay đổi vị trí nhưng số đo góc <strong>AMB vẫn luôn bằng {inscribedAngleDeg}°</strong> không đổi.
          <br />
          • Khi cung AB = <strong>180° (nửa đường tròn)</strong>: Góc nội tiếp AMB = <strong>90° (góc vuông)</strong>.
        </div>
      </div>

      {/* Controls Panel */}
      <div className="sim-controls">
        <div className="sim-control-group">
          <label>
            Độ lớn cung AB (góc ở tâm): <span>{centralAngleDeg}°</span>
          </label>
          <input
            type="range"
            min="30"
            max="260"
            step="10"
            value={centralAngleDeg}
            onChange={(e) => setCentralAngleDeg(Number(e.target.value))}
          />
        </div>

        <div className="sim-control-group">
          <label>
            Di chuyển vị trí điểm M trên cung lớn: <span>{Math.round(mPositionRatio * 100)}%</span>
          </label>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.01"
            value={mPositionRatio}
            onChange={(e) => setMPositionRatio(Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', width: '100%', marginTop: 8 }}>
          <button
            className={`btn btn-sm ${centralAngleDeg === 180 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCentralAngleDeg(180)}
          >
            Nửa đường tròn (180°)
          </button>
          <button
            className={`btn btn-sm ${showCentralAngle ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowCentralAngle(!showCentralAngle)}
          >
            {showCentralAngle ? 'Ẩn góc ở tâm AOB' : 'Hiện góc ở tâm AOB'}
          </button>
        </div>
      </div>
    </div>
  );
}
