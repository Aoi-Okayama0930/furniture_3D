'use client';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import Shelf, { ShelfParams } from './Shelf';
import { useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';

// WebGLレンダラー管理用コンポーネント
function RendererManager() {
  const { gl, scene, camera } = useThree();
  
  useEffect(() => {
    // レンダラーのWebGLコンテキスト設定
    gl.setClearColor(new THREE.Color('#f5f5f5'), 1);
    gl.outputColorSpace = THREE.SRGBColorSpace;
    
    // 明示的なコンテキストリカバリを有効化
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      console.log('WebGLコンテキスト喪失: 復元を試みます');
    }, false);
    
    canvas.addEventListener('webglcontextrestored', () => {
      console.log('WebGLコンテキスト復元: レンダリング再開');
      requestAnimationFrame(() => gl.render(scene, camera));
    }, false);
    
    // メモリ解放のための切断処理
    return () => {
      canvas.removeEventListener('webglcontextlost', () => {});
      canvas.removeEventListener('webglcontextrestored', () => {});
      gl.dispose();
    };
  }, [gl, scene, camera]);
  
  return null;
}

// ローディングフォールバック
function Loading() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
}

export interface ShelfCanvasProps { params: ShelfParams }

export default function ShelfCanvas({ params }: ShelfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  return (
    <Canvas 
      ref={canvasRef}
      shadows 
      dpr={[1, 1.5]} // デバイスピクセル比を制限
      camera={{ position: [3, 2, 6], fov: 50 }}
      gl={{ 
        antialias: true,
        powerPreference: 'default', // highよりdefaultの方が安定する場合が多い
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true, // コンテキスト喪失時の復元に役立つ
        alpha: false // パフォーマンス向上
      }}
      style={{ touchAction: 'none' }} // モバイルでのジェスチャー競合を防止
      frameloop="demand" // 必要時のみレンダリング
    >
      <RendererManager />
      <color attach="background" args={['#f5f5f5']} />
      <fog attach="fog" args={['#f5f5f5', 8, 20]} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow shadow-mapSize={1024} />
      
      <Suspense fallback={<Loading />}>
        <Grid 
          args={[10, 10]} 
          sectionColor="lightgray" 
          cellThickness={0.5}
          fadeDistance={15}
        />
        <Shelf {...params} />
        <Environment preset="warehouse" />
      </Suspense>
      
      <OrbitControls 
        makeDefault 
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={10}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
} 