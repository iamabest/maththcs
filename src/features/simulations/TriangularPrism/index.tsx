import { useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { SimulationCanvas } from '../../../components/SimulationCanvas';
import { markSimulationInteracted, logSimulationEvent } from '../../../lib/storage';

export default function TriangularPrism() {
  const [baseA, setBaseA] = useState<number>(4);
  const [baseH, setBaseH] = useState<number>(3);
  const [prismH, setPrismH] = useState<number>(5);
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);

  useEffect(() => {
    markSimulationInteracted('lesson-triangular-prism');
    logSimulationEvent({
      simulationSlug: 'triangular-prism',
      eventType: 'open',
      occurredAt: new Date().toISOString(),
    });
  }, []);

  const handleReset = () => {
    setBaseA(4);
    setBaseH(3);
    setPrismH(5);
    setWireframeOnly(false);
    logSimulationEvent({
      simulationSlug: 'triangular-prism',
      eventType: 'reset',
      occurredAt: new Date().toISOString(),
    });
  };

  const handleParamChange = (a: number, h: number, H: number) => {
    setBaseA(a);
    setBaseH(h);
    setPrismH(H);
    logSimulationEvent({
      simulationSlug: 'triangular-prism',
      eventType: 'parameter_change',
      payload: { a, h, H },
      occurredAt: new Date().toISOString(),
    });
  };

  // Calculations
  const side = Math.sqrt(Math.pow(baseA / 2, 2) + Math.pow(baseH, 2));
  const bottomPerimeter = baseA + 2 * side;
  const bottomArea = 0.5 * baseA * baseH;
  const lateralArea = bottomPerimeter * prismH;
  const totalArea = lateralArea + 2 * bottomArea;
  const volume = bottomArea * prismH;

  // Geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-baseA / 2, -baseH / 2);
    shape.lineTo(baseA / 2, -baseH / 2);
    shape.lineTo(0, baseH / 2);
    shape.lineTo(-baseA / 2, -baseH / 2);

    const extrudeSettings = {
      depth: prismH,
      bevelEnabled: false,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.center(); // Center the geometry
    return geo;
  }, [baseA, baseH, prismH]);

  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  // Vertices for labels (centered)
  const halfA = baseA / 2;
  const yBase = -baseH / 2;
  const yTop = baseH / 2;
  const halfH = prismH / 2;

  const vertices = [
    { name: 'A', x: 0, y: yTop, z: halfH },
    { name: 'B', x: -halfA, y: yBase, z: halfH },
    { name: 'C', x: halfA, y: yBase, z: halfH },
    { name: "A'", x: 0, y: yTop, z: -halfH },
    { name: "B'", x: -halfA, y: yBase, z: -halfH },
    { name: "C'", x: halfA, y: yBase, z: -halfH },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SimulationCanvas cameraPosition={[6, 6, 8]} fov={50} onReset={handleReset}>
        <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {!wireframeOnly && (
            <mesh geometry={geometry}>
              <meshStandardMaterial
                color="#059669"
                transparent
                opacity={0.35}
                roughness={0.2}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          <lineSegments geometry={edgesGeo}>
            <lineBasicMaterial color="#047857" linewidth={2} />
          </lineSegments>

          {vertices.map((v) => (
            <group key={v.name} position={[v.x, v.y, v.z]}>
              <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#d97706" />
              </mesh>
              <Text
                position={[v.x > 0 ? 0.35 : v.x < 0 ? -0.35 : 0, v.y > 0 ? 0.35 : -0.35, v.z > 0 ? 0.35 : -0.35]}
                fontSize={0.4}
                color="#0f172a"
                anchorX="center"
                anchorY="middle"
              >
                {v.name}
              </Text>
            </group>
          ))}
        </group>

        <gridHelper args={[20, 20, '#cbd5e1', '#e2e8f0']} position={[0, -prismH/2 - 0.5, 0]} />
      </SimulationCanvas>

      <div className="sim-info">
        <div className="sim-info-item">
          <div className="label">Chu vi đáy (P_đáy)</div>
          <div className="value" style={{ color: '#22d3ee' }}>{bottomPerimeter.toFixed(2)} cm</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Diện tích đáy (S_đáy)</div>
          <div className="value" style={{ color: '#ec4899' }}>{bottomArea.toFixed(2)} cm²</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Diện tích xung quanh (S_xq)</div>
          <div className="value" style={{ color: '#a855f7' }}>{lateralArea.toFixed(2)} cm²</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Thể tích (V)</div>
          <div className="value" style={{ color: '#10b981' }}>{volume.toFixed(2)} cm³</div>
        </div>
      </div>

      <div className="theorem-block">
        <div className="theorem-title">
          CÔNG THỨC LĂNG TRỤ ĐỨNG TAM GIÁC
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          <div>• <strong>S_đáy</strong> = ½ a × h = ½({baseA} × {baseH}) = <strong>{bottomArea.toFixed(2)} cm²</strong></div>
          <div>• <strong>S_xq</strong> = C_đáy × H = {bottomPerimeter.toFixed(2)} × {prismH} = <strong>{lateralArea.toFixed(2)} cm²</strong></div>
          <div>• <strong>S_tp</strong> = S_xq + 2S_đáy = <strong>{(lateralArea + 2 * bottomArea).toFixed(2)} cm²</strong></div>
          <div>• <strong>V</strong> = S_đáy × H = {bottomArea.toFixed(2)} × {prismH} = <strong>{volume.toFixed(2)} cm³</strong></div>
        </div>
      </div>

      <div className="sim-controls">
        <div className="sim-control-group">
          <label>
            Cạnh đáy (a): <span>{baseA} cm</span>
          </label>
          <input
            type="range"
            min="2"
            max="10"
            step="1"
            value={baseA}
            onChange={(e) => handleParamChange(Number(e.target.value), baseH, prismH)}
          />
        </div>

        <div className="sim-control-group">
          <label>
            Chiều cao đáy (h): <span>{baseH} cm</span>
          </label>
          <input
            type="range"
            min="2"
            max="10"
            step="1"
            value={baseH}
            onChange={(e) => handleParamChange(baseA, Number(e.target.value), prismH)}
          />
        </div>

        <div className="sim-control-group">
          <label>
            Chiều cao lăng trụ (H): <span>{prismH} cm</span>
          </label>
          <input
            type="range"
            min="2"
            max="10"
            step="1"
            value={prismH}
            onChange={(e) => handleParamChange(baseA, baseH, Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', width: '100%', marginTop: 8 }}>
          <button
            className={`btn btn-sm ${wireframeOnly ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setWireframeOnly(!wireframeOnly)}
          >
            {wireframeOnly ? 'Hiện bề mặt' : 'Chỉ xem khung dây'}
          </button>
        </div>
      </div>
    </div>
  );
}
