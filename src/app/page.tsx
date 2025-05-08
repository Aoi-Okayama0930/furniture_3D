'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ShelfParams } from '../components/Shelf';

// WebGLコンテキスト関連のエラー検出
const useWebGLErrorDetection = () => {
  useEffect(() => {
    let errorTimeout: NodeJS.Timeout;
    
    const handleError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('WebGL') || 
         (event.error && event.error.message && event.error.message.includes('WebGL'))) {
        
        console.error('WebGLエラーを検出しました:', event);
        
        // 一定時間後に自動でページをリロード試行
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {
          console.log('WebGLエラーによりページをリロードします...');
          // window.location.reload();
        }, 5000);
      }
    };
    
    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      clearTimeout(errorTimeout);
    };
  }, []);
};

// パフォーマンス向上のためにSSRなしで動的インポート
const ShelfCanvas = dynamic(() => import('../components/ShelfCanvas'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-gray-300 border-r-transparent"></div>
        <p className="mt-2">読み込み中...</p>
      </div>
    </div>
  )
});

export default function Page() {
  // WebGLエラー検出フック
  useWebGLErrorDetection();
  
  const [params, setParams] = useState<ShelfParams>({
    width: 100,  // cm
    height: 160, // cm
    depth: 30,   // cm
    columns: 3,
    rows: 4,
    booksPerSection: 5,
    showBooks: true,
  });

  // useCallbackを使用してメモ化
  const update = useCallback((k: keyof ShelfParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    // 有効な数値のみを受け入れる
    if (!isNaN(value)) {
      setParams(prev => {
        // 値が同じ場合は更新しない
        if (prev[k] === value) return prev;
        return { ...prev, [k]: value };
      });
    }
  }, []);
  
  // ブール値の更新
  const updateBoolean = useCallback((k: keyof ShelfParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setParams(prev => {
      if (prev[k] === value) return prev;
      return { ...prev, [k]: value };
    });
  }, []);
  
  // ランダムに本を配置する
  const regenerateBooks = useCallback(() => {
    setParams(prev => ({ ...prev, booksPerSection: prev.booksPerSection }));
  }, []);
  
  // シェルフキャンバスをメモ化
  const shelfCanvasComponent = useMemo(() => {
    return <ShelfCanvas params={params} />;
  }, [params]);

  return (
    <main className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 gap-4 md:gap-8">
      {/* コントロールパネル */}
      <aside className="w-full md:w-80 space-y-4 bg-white p-4 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">棚のパラメータ</h2>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700">サイズ設定</h3>
          {(['width','height','depth'] as const).map(k => (
            <label key={k} className="block">
              <span className="text-sm text-gray-600">{k} (cm)</span>
              <input
                type="number" 
                min={10} 
                max={300}
                value={params[k]} 
                onChange={update(k)}
                className="w-full border p-2 rounded mt-1"
              />
            </label>
          ))}
        </div>
        
        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-medium text-gray-700">区画設定</h3>
          {(['columns','rows'] as const).map(k => (
            <label key={k} className="block">
              <span className="text-sm text-gray-600">{k}</span>
              <input
                type="number" 
                min={1} 
                max={10}
                value={params[k]} 
                onChange={update(k)}
                className="w-full border p-2 rounded mt-1"
              />
            </label>
          ))}
        </div>
        
        <div className="space-y-4 mt-6">
          <h3 className="text-sm font-medium text-gray-700">本の設定</h3>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={params.showBooks}
              onChange={updateBoolean('showBooks')}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm text-gray-600">本を表示する</span>
          </label>
          
          <label className="block">
            <span className="text-sm text-gray-600">セクションごとの最大本数</span>
            <input
              type="number" 
              min={1} 
              max={20}
              value={params.booksPerSection} 
              onChange={update('booksPerSection')}
              disabled={!params.showBooks}
              className={`w-full border p-2 rounded mt-1 ${!params.showBooks ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </label>
          
          <button 
            onClick={regenerateBooks}
            disabled={!params.showBooks}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2 transition-colors ${!params.showBooks ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            本をランダム配置
          </button>
        </div>
        
        <div className="mt-8 text-xs text-gray-500">
          <p>※WebGLコンテキスト喪失が発生した場合は、ページをリロードしてください。</p>
        </div>
      </aside>

      {/* 3-D ビューア */}
      <section className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden min-h-[500px]">
        {shelfCanvasComponent}
      </section>
    </main>
  );
}
