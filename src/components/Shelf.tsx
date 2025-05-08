import { ReactNode } from 'react';
import * as THREE from 'three';
import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

export interface ShelfParams {
  width: number;   // cm
  height: number;  // cm
  depth: number;   // cm
  columns: number;
  rows: number;
  booksPerSection?: number; // 各セクションに配置する本の数
  showBooks?: boolean;      // 本を表示するかどうか
}

type ShelfProps = ShelfParams & {
  [key: string]: any;
};

// 本のバリエーション定義
const BOOK_COLORS = [
  '#8B4513', // 茶色
  '#A52A2A', // 茶色
  '#D2691E', // チョコレート色
  '#CD853F', // ペルー色
  '#800000', // マルーン
  '#B22222', // 煉瓦色
  '#A0522D', // シエナ色
  '#6B8E23', // オリーブドラブ
  '#556B2F', // ダークオリーブグリーン
  '#2F4F4F', // ダークスレートグレー
  '#483D8B', // ダークスレートブルー
  '#4682B4', // スティールブルー
  '#000080', // ネイビー
  '#191970', // ミッドナイトブルー
  '#8B008B', // ダークマゼンタ
  '#4B0082', // インディゴ
  '#800080', // パープル
  '#BC8F8F', // ローズブラウン
];

// 本を作成する関数コンポーネント
interface BookProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color?: string;
  variant?: number; // 本のバリエーション（デザイン）
}

// @ts-ignore
const Book = ({ position, rotation = [0, 0, 0], width, height, depth, color, variant = 0 }: BookProps) => {
  // バリエーションに基づいた色を選択
  const bookColor = color || BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
  
  // 本のスタイルを決定（バリエーションで変更）
  const hasBinding = Math.random() > 0.3; // 70%の確率で背表紙の装飾あり
  const hasCover = Math.random() > 0.5;   // 50%の確率で表紙模様あり
  
  // メッシュの共通プロパティ
  const meshProps = {
    position,
    rotation,
    castShadow: true,
    receiveShadow: true,
  };
  
  return (
    // @ts-ignore
    <group {...meshProps}>
      {/* 本の本体 */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={bookColor} 
          roughness={0.7 + Math.random() * 0.3}
          metalness={0}
        />
      </mesh>
      
      {/* 本の背表紙（装飾） */}
      {hasBinding && (
        <mesh position={[0, 0, depth/2 + 0.0005]}>
          <boxGeometry args={[width, height, 0.001]} />
          <meshStandardMaterial 
            color={new THREE.Color(bookColor).multiplyScalar(0.8).getHex()} 
            roughness={0.5}
          />
        </mesh>
      )}
      
      {/* 本の表紙（装飾） */}
      {hasCover && (
        <>
          <mesh position={[0, 0, -depth/2 - 0.0005]}>
            <boxGeometry args={[width, height, 0.001]} />
            <meshStandardMaterial 
              color={new THREE.Color(bookColor).multiplyScalar(1.2).getHex()}
              roughness={0.3}
            />
          </mesh>
          
          {/* タイトル（簡易的な表現） */}
          {Math.random() > 0.5 && (
            <mesh position={[0, 0, -depth/2 - 0.001]} rotation={[0, 0, 0]}>
              <planeGeometry args={[width * 0.7, height * 0.1]} />
              <meshBasicMaterial 
                color="#ffffff" 
                opacity={0.3 + Math.random() * 0.3}
                transparent={true}
              />
            </mesh>
          )}
        </>
      )}
    </group>
  );
};

// 様々な小物アイテムを作成する関数コンポーネント
// @ts-ignore
const ShelfItem = ({ position, type = 'plant' }) => {
  const itemColor = useMemo(() => {
    // アイテムのタイプに応じた色を返す
    switch(type) {
      case 'plant': return '#4CAF50';
      case 'photo': return '#E0E0E0';
      case 'vase': return '#81D4FA';
      case 'box': return '#FFCC80';
      default: return '#CCCCCC';
    }
  }, [type]);

  // アイテムのタイプに応じた形状を返す
  switch(type) {
    case 'plant':
      return (
        // @ts-ignore
        <group position={position}>
          {/* 植木鉢 */}
          <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.03, 0.02, 0.04, 16]} />
            <meshStandardMaterial color="#8D6E63" roughness={0.8} />
          </mesh>
          {/* 植物 */}
          <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.04, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={itemColor} roughness={0.7} />
          </mesh>
        </group>
      );
    
    case 'photo':
      return (
        // @ts-ignore
        <group position={position}>
          {/* フレーム */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.06, 0.08, 0.01]} />
            <meshStandardMaterial color="#5D4037" roughness={0.5} />
          </mesh>
          {/* 写真 */}
          <mesh position={[0, 0, 0.006]} castShadow receiveShadow>
            <boxGeometry args={[0.055, 0.075, 0.001]} />
            <meshStandardMaterial color={itemColor} roughness={0.3} />
          </mesh>
        </group>
      );
      
    case 'vase':
      return (
        // @ts-ignore
        <mesh position={position} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.08, 16]} />
          <meshStandardMaterial color={itemColor} roughness={0.2} metalness={0.3} />
        </mesh>
      );
      
    case 'box':
      return (
        // @ts-ignore
        <mesh position={position} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.03, 0.05]} />
          <meshStandardMaterial color={itemColor} roughness={0.5} />
        </mesh>
      );
      
    default:
      return null;
  }
};

// Shelfの実装はメモ化しておく
const MemoizedShelf = ({ width, height, depth, columns, rows, booksPerSection = 5, showBooks = true, ...props }: ShelfProps) => {
  // グループref
  const groupRef = useRef<THREE.Group>(null);
  
  // geometryとmaterialをメモ化
  const woodMaterial = useMemo(() => 
    new THREE.MeshStandardMaterial({ 
      color: '#c8ad7f',
      roughness: 0.65,
      metalness: 0.05
    }),
    []
  );
  
  // 各ジオメトリを保存する参照を作成
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);
  
  // クリーンアップ
  useEffect(() => {
    return () => {
      // コンポーネントのアンマウント時にジオメトリとマテリアルをクリーンアップ
      geometriesRef.current.forEach(geo => geo.dispose());
      woodMaterial.dispose();
    };
  }, [woodMaterial]);
  
  // 小さな回転アニメーション（表示確認用）
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const meshes = useMemo(() => {
    // 以前のジオメトリをクリーンアップ
    geometriesRef.current.forEach(geo => geo.dispose());
    geometriesRef.current = [];
    
    const arr: ReactNode[] = [];
    const t = 0.018;                       // board thickness (m)
    const w = width / 100, h = height / 100, d = depth / 100;

    // 再利用可能なBoxジオメトリの作成関数
    const createBox = (width: number, height: number, depth: number) => {
      const geo = new THREE.BoxGeometry(width, height, depth);
      geometriesRef.current.push(geo);
      return geo;
    };

    // 棚板の配置を記録する配列（各棚板のY座標）
    const shelfPositionsY: number[] = [];

    // top / bottom
    const topGeo = createBox(w, t, d);
    const yTop = h / 2 - t / 2;
    const yBottom = -h / 2 + t / 2;
    // @ts-ignore
    arr.push(<mesh key="top" geometry={topGeo} material={woodMaterial} position={[0, yTop, 0]} receiveShadow castShadow />);
    // @ts-ignore
    arr.push(<mesh key="bottom" geometry={topGeo} material={woodMaterial} position={[0, yBottom, 0]} receiveShadow castShadow />);
    
    // 一番上と一番下の棚板のY座標を記録
    shelfPositionsY.push(yTop);
    shelfPositionsY.push(yBottom);

    // sides
    const sideGeo = createBox(t, h, d);
    const xSide = w / 2 - t / 2;
    // @ts-ignore
    arr.push(<mesh key="left" geometry={sideGeo} material={woodMaterial} position={[-xSide, 0, 0]} receiveShadow castShadow />);
    // @ts-ignore
    arr.push(<mesh key="right" geometry={sideGeo} material={woodMaterial} position={[xSide, 0, 0]} receiveShadow castShadow />);

    // back panel for stability (optional)
    const backGeo = createBox(w - 2*t, h - 2*t, t/2);
    // @ts-ignore
    arr.push(<mesh key="back" geometry={backGeo} material={woodMaterial} position={[0, 0, -d/2 + t/4]} receiveShadow castShadow />);

    // shelves
    const rowH = h / (rows + 1);
    const shelfGeo = createBox(w - 2*t, t, d);
    for (let i=1;i<=rows;i++){
      const y = h/2 - i*rowH;
      // @ts-ignore
      arr.push(<mesh key={`shelf-${i}`} geometry={shelfGeo} material={woodMaterial} position={[0, y, 0]} receiveShadow castShadow />);
      
      // 棚板のY座標を記録
      shelfPositionsY.push(y);
    }

    // dividers
    const colW = w / (columns + 1);
    const divGeo = createBox(t, h - 2*t, d);
    for (let i=1;i<=columns;i++){
      const x = -w/2 + i*colW;
      // @ts-ignore
      arr.push(<mesh key={`div-${i}`} geometry={divGeo} material={woodMaterial} position={[x, 0, 0]} receiveShadow castShadow />);
    }

    // 本を追加
    if (showBooks) {
      // 垂直区画の数（行数+1）
      const verticalSections = rows + 1;
      // 水平区画の数（列数+1）
      const horizontalSections = columns + 1;
      
      // 各区画に対して
      for (let row = 0; row < verticalSections; row++) {
        for (let col = 0; col < horizontalSections; col++) {
          // 現在の区画の境界を計算
          const topShelfY = row === 0 ? yTop : shelfPositionsY[row + 1]; // 区画の上の棚板
          const bottomShelfY = row === verticalSections - 1 ? yBottom : shelfPositionsY[row + 2]; // 区画の下の棚板
          
          // 左右の境界を計算
          const leftX = col === 0 ? -xSide : -xSide + col * colW;
          const rightX = col === horizontalSections - 1 ? xSide : -xSide + (col + 1) * colW;
          
          // 区画の高さと幅
          const sectionHeight = topShelfY - bottomShelfY - t; // 棚板の厚さを引く
          const sectionWidth = rightX - leftX - (col < horizontalSections - 1 ? t : 0); // 区切りの厚さを引く
          
          // 最上段と最下段の場合は何も置かない
          if (row === 0 || sectionHeight <= 0 || sectionWidth <= 0) continue;
          
          // このセクションに小物を置くかどうか
          const addItems = Math.random() > 0.7; // 30%の確率で小物を配置
          
          if (addItems) {
            // 小物のタイプをランダムに選択
            const itemTypes = ['plant', 'photo', 'vase', 'box'];
            const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
            
            // 小物の位置
            const itemX = leftX + sectionWidth / 2;
            const itemY = bottomShelfY + t/2 + 0.01; // 棚板の上に配置
            const itemZ = 0;
            
            arr.push(
              <ShelfItem 
                key={`item-${col}-${row}`}
                position={[itemX, itemY, itemZ]}
                type={itemType}
              />
            );
            
            // 小物があるセクションは本を追加しない
            continue;
          }
          
          // 各セクションの本の数をランダムに決定（1〜booksPerSection）
          const numBooks = 1 + Math.floor(Math.random() * booksPerSection);
          
          // すべての本を左右反転させる確率
          const flipBooks = Math.random() > 0.5;
          
          // セクション内の利用可能な幅
          let availableWidth = sectionWidth - 0.01; // 少し余白を残す
          let currentX = flipBooks ? 
            leftX + sectionWidth - 0.01 : // 右から左へ
            leftX + 0.01; // 左から右へ
          
          for (let k = 0; k < numBooks && availableWidth > 0; k++) {
            // 本のサイズをランダムに決定
            const bookDepth = d * (0.6 + Math.random() * 0.3);
            const bookHeight = Math.min(sectionHeight * (0.4 + Math.random() * 0.55), sectionHeight - 0.01);
            const bookWidth = Math.min(
              availableWidth * 0.3, // 最大でも利用可能幅の30%
              0.02 + Math.random() * 0.04 // 2〜6cm
            );
            
            // 最小幅をチェック
            if (bookWidth < 0.01) break;
            
            // 本を立てるか寝かせるか
            const isLayingDown = Math.random() > 0.9; // 10%の確率で寝かせる
            
            // 本の位置
            const bookX = flipBooks ? 
              currentX - bookWidth/2 : // 右から左へ
              currentX + bookWidth/2;  // 左から右へ
              
            // 本の基本位置 - 棚板の上に配置
            const bookY = isLayingDown
              ? bottomShelfY + t/2 + bookHeight/2 // 寝かせた本は厚みの半分を上に
              : bottomShelfY + t/2 + bookHeight/2; // 立てた本は高さの半分を上に
            
            const bookZ = isLayingDown
              ? 0 // 寝かせた本
              : (-d/2 + bookDepth/2) * Math.random() * 0.8; // 立てた本は少し奥行きをランダムに
            
            // 本の回転（ランダムに少し傾ける）
            const bookRotation: [number, number, number] = isLayingDown
              ? [Math.PI/2 + (Math.random() - 0.5) * 0.1, 0, (Math.random() - 0.5) * 0.2] // 寝かせた本
              : [0, 0, (Math.random() - 0.5) * 0.1]; // 立てた本
            
            // 実際の本の幅や高さを計算
            const finalWidth = isLayingDown ? bookDepth : bookWidth;
            const finalHeight = isLayingDown ? bookWidth : bookHeight;
            const finalDepth = isLayingDown ? bookHeight : bookDepth;
            
            // 本を追加
            arr.push(
              <Book 
                key={`book-${col}-${row}-${k}`}
                position={[bookX, bookY, bookZ]}
                rotation={bookRotation}
                width={finalWidth}
                height={finalHeight}
                depth={finalDepth}
                variant={Math.floor(Math.random() * 3)}
              />
            );
            
            // 次の本の位置を更新
            if (flipBooks) {
              currentX -= (bookWidth + 0.002); // 右から左へ、2mm の隙間
            } else {
              currentX += (bookWidth + 0.002); // 左から右へ、2mm の隙間
            }
            availableWidth -= (bookWidth + 0.002);
          }
        }
      }
    }

    return arr;
  }, [width, height, depth, columns, rows, woodMaterial, booksPerSection, showBooks]);

  // @ts-ignore
  return <group ref={groupRef} {...props}>{meshes}</group>;
};

// React.memo でコンポーネントをメモ化
export default function Shelf(props: ShelfProps) {
  return <MemoizedShelf {...props} />;
} 