import { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { SimulationCanvas } from '../../../components/SimulationCanvas';
import { markSimulationInteracted, logSimulationEvent } from '../../../lib/storage';

export default function RectangularPrism() {
  const [length, setLength] = useState<number>(5); // a (x)
  const [width, setWidth] = useState<number>(3); // b (z)
  const [height, setHeight] = useState<number>(4); // c (y)
  const [wireframeOnly, setWireframeOnly] = useState<boolean>(false);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  useEffect(() => {
    markSimulationInteracted('lesson-rectangular-prism');
    logSimulationEvent({
      simulationSlug: 'rectangular-prism',
      eventType: 'open',
      occurredAt: new Date().toISOString(),
    });
  }, []);

  const handleReset = () => {
    setLength(5);
    setWidth(3);
    setHeight(4);
    setWireframeOnly(false);
    setShowDimensions(true);
    logSimulationEvent({
      simulationSlug: 'rectangular-prism',
      eventType: 'reset',
      occurredAt: new Date().toISOString(),
    });
  };

  const handleParamChange = (a: number, b: number, c: number) => {
    setLength(a);
    setWidth(b);
    setHeight(c);
    logSimulationEvent({
      simulationSlug: 'rectangular-prism',
      eventType: 'parameter_change',
      payload: { a, b, c },
      occurredAt: new Date().toISOString(),
    });
  };

  // Calculations
  const bottomPerimeter = 2 * (length + width);
  const bottomArea = length * width;
  const lateralArea = bottomPerimeter * height;
  const totalArea = lateralArea + 2 * bottomArea;
  const volume = length * width * height;

  // Box geometry for edge lines
  const boxGeo = new THREE.BoxGeometry(length, height, width);
  const edgesGeo = new THREE.EdgesGeometry(boxGeo);

  // Vertices for labels
  const halfX = length / 2;
  const halfY = height / 2;
  const halfZ = width / 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 3D Scene */}
      <SimulationCanvas cameraPosition={[8, 7, 10]} fov={50} onReset={handleReset}>
        <group position={[0, 0, 0]}>
          {/* Main Translucent Box */}
          {!wireframeOnly && (
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[length, height, width]} />
              <meshStandardMaterial
                color="#3b82f6"
                transparent
                opacity={0.35}
                roughness={0.2}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Edge Lines */}
          <lineSegments geometry={edgesGeo}>
            <lineBasicMaterial color="#1d4ed8" linewidth={2} />
          </lineSegments>

          {/* Vertices spheres and labels */}
          {[
            { name: 'A', x: -halfX, y: -halfY, z: halfZ },
            { name: 'B', x: halfX, y: -halfY, z: halfZ },
            { name: 'C', x: halfX, y: -halfY, z: -halfZ },
            { name: 'D', x: -halfX, y: -halfY, z: -halfZ },
            { name: "A'", x: -halfX, y: halfY, z: halfZ },
            { name: "B'", x: halfX, y: halfY, z: halfZ },
            { name: "C'", x: halfX, y: halfY, z: -halfZ },
            { name: "D'", x: -halfX, y: halfY, z: -halfZ },
          ].map((v) => (
            <group key={v.name} position={[v.x, v.y, v.z]}>
              <mesh>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#d97706" />
              </mesh>
              <Text
                position={[
                  v.x > 0 ? 0.35 : -0.35,
                  v.y > 0 ? 0.35 : -0.35,
                  v.z > 0 ? 0.35 : -0.35,
                ]}
                fontSize={0.4}
                color="#0f172a"
                anchorX="center"
                anchorY="middle"
              >
                {v.name}
              </Text>
            </group>
          ))}

          {/* Dimension texts along edges */}
          {showDimensions && (
            <>
              {/* Length a (along X) */}
              <Text
                position={[0, -halfY - 0.4, halfZ + 0.3]}
                fontSize={0.45}
                color="#0284c7"
                anchorX="center"
              >
                {`a = ${length} cm`}
              </Text>

              {/* Height c (along Y) */}
              <Text
                position={[halfX + 0.4, 0, halfZ + 0.3]}
                fontSize={0.45}
                color="#dc2626"
                anchorX="left"
              >
                {`c = ${height} cm`}
              </Text>

              {/* Width b (along Z) */}
              <Text
                position={[halfX + 0.4, -halfY - 0.4, 0]}
                fontSize={0.45}
                color="#059669"
                anchorX="left"
              >
                {`b = ${width} cm`}
              </Text>
            </>
          )}
        </group>

        {/* Floor grid */}
        <gridHelper args={[20, 20, '#cbd5e1', '#e2e8f0']} position={[0, -halfY - 0.5, 0]} />
      </SimulationCanvas>

      {/* Realtime Mathematics Info Panel */}
      <div className="sim-info">
        <div className="sim-info-item">
          <div className="label">Kích thước (a × b × c)</div>
          <div className="value" style={{ fontSize: '1rem', color: '#38bdf8' }}>
            {length} × {width} × {height} cm
          </div>
        </div>
        <div className="sim-info-item">
          <div className="label">Chu vi đáy (P_đáy)</div>
          <div className="value" style={{ color: '#22d3ee' }}>{bottomPerimeter} cm</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Diện tích xung quanh (S_xq)</div>
          <div className="value" style={{ color: '#ec4899' }}>{lateralArea} cm²</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Diện tích toàn phần (S_tp)</div>
          <div className="value" style={{ color: '#a855f7' }}>{totalArea} cm²</div>
        </div>
        <div className="sim-info-item">
          <div className="label">Thể tích (V)</div>
          <div className="value" style={{ color: '#10b981' }}>{volume} cm³</div>
        </div>
      </div>

      {/* Formulas Card */}
      <div className="theorem-block">
        <div className="theorem-title">
          CÔNG THỨC HÌNH HỌP CHỮ NHẬT
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          <div>• <strong>S_xq</strong> = 2(a + b) × c = 2({length} + {width}) × {height} = <strong>{lateralArea} cm²</strong></div>
          <div>• <strong>S_đáy</strong> = a × b = {length} × {width} = <strong>{bottomArea} cm²</strong></div>
          <div>• <strong>S_tp</strong> = S_xq + 2S_đáy = {lateralArea} + 2({bottomArea}) = <strong>{totalArea} cm²</strong></div>
          <div>• <strong>V</strong> = a × b × c = {length} × {width} × {height} = <strong>{volume} cm³</strong></div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="sim-controls">
        <div className="sim-control-group">
          <label>
            Chiều dài (a): <span>{length} cm</span>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={length}
            onChange={(e) => handleParamChange(Number(e.target.value), width, height)}
          />
        </div>

        <div className="sim-control-group">
          <label>
            Chiều rộng (b): <span>{width} cm</span>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={width}
            onChange={(e) => handleParamChange(length, Number(e.target.value), height)}
          />
        </div>

        <div className="sim-control-group">
          <label>
            Chiều cao (c): <span>{height} cm</span>
          </label>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            value={height}
            onChange={(e) => handleParamChange(length, width, Number(e.target.value))}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', width: '100%', marginTop: 8 }}>
          <button
            className={`btn btn-sm ${showDimensions ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowDimensions(!showDimensions)}
          >
            {showDimensions ? 'Ẩn kích thước cạnh' : 'Hiện kích thước cạnh'}
          </button>
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
