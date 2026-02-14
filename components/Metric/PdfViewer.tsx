'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface PDFViewerProps {
  selectedMetric: string | null;
  pdfPage: number | null;
  handleClosePdf: () => void;
}

export default function PDFViewer({ selectedMetric, pdfPage, pdfPageBox, handleClosePdf }: PDFViewerProps & { pdfPageBox: {x: number, y: number, width: number, height: number} | null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(0.5);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [renderError, setRenderError] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [highlightBox, setHighlightBox] = useState<{x: number, y: number, width: number, height: number} | null>(null);
  console.log('PDFViewer rendered with props:', { selectedMetric, pdfPage, pdfPageBox });
  useEffect(() => {
    loadPDF();
    
    return () => {
      // Cleanup on unmount
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (pdfPage && pdfDoc) {
      setCurrentPage(pdfPage);
      
      if (pdfPageBox) {
        setHighlightBox(pdfPageBox);
      }
    }
  }, [pdfPage, pdfDoc, pdfPageBox]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage);
    }
  }, [currentPage, pdfDoc, scale]);

  const loadPDF = async () => {
    try {
      setRenderError(false);
      setIsInverted(false);
      
      const pdfjsLib = await import('pdfjs-dist');
      
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const loadingTask = pdfjsLib.getDocument('/State-of-the-Cyber-Security-Sector-in-Ireland-2022-Report.pdf');
      const pdf = await loadingTask.promise;
      
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      setCurrentPage(pdfPage || 1);
    } catch (error) {
      console.error('Error loading PDF:', error);
      setRenderError(true);
    }
  };

  const detectInverted = (context: CanvasRenderingContext2D, width: number, height: number): boolean => {
    try {
      // Sample pixels from top and bottom of canvas
      const topSample = context.getImageData(width / 2, 10, 1, 1).data;
      const bottomSample = context.getImageData(width / 2, height - 10, 1, 1).data;
      
      // Check if the transform matrix is inverted
      const transform = context.getTransform();
      const isMatrixInverted = transform.d < 0; // Negative d value indicates vertical flip
      
      return isMatrixInverted;
    } catch (error) {
      return false;
    }
  };

  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      // Cancel previous render task if exists
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale, rotation: 0 });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { 
        alpha: false,
        willReadFrequently: false 
      });
      
      if (!context) {
        setRenderError(true);
        return;
      }
      
      // Set canvas dimensions
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + 'px';
      canvas.style.height = Math.floor(viewport.height) + 'px';
      
      // Reset transform to identity
      context.setTransform(1, 0, 0, 1, 0, 0);
      
      // Clear with white background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Scale for device pixel ratio
      context.scale(outputScale, outputScale);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        intent: 'display',
        enableWebGL: false,
        renderInteractiveForms: false,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
      renderTaskRef.current = null;

      // Check if rendering is inverted after a short delay
      setTimeout(() => {
        const inverted = detectInverted(context, canvas.width, canvas.height);
        if (inverted) {
          setIsInverted(true);
          setRenderError(true);
        } else {
          setIsInverted(false);
          setRenderError(false);
        }
      }, 100);

      // Scroll to highlight if exists
      if (highlightBox && containerRef.current) {
        setTimeout(() => {
          const scrollY = highlightBox.y * scale - 100;
          containerRef.current?.scrollTo({
            top: scrollY,
            behavior: 'smooth'
          });
        }, 200);
      }
    } catch (error: any) {
      if (error.name === 'RenderingCancelledException') {
        return; // Ignore cancellation errors
      }
      console.error('Error rendering page:', error);
      setRenderError(true);
    }
  };

  const handleReload = () => {
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }
    setRenderError(false);
    setIsInverted(false);
    setPdfDoc(null);
    
    // Force a clean reload
    setTimeout(() => {
      loadPDF();
    }, 100);
  };

  return (
    <div className="glass rounded-2xl p-2 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold gradient-text">
          {selectedMetric || 'Source Document'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.2))}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-400">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale(Math.min(3, scale + 0.2))}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReload}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Reload PDF"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleClosePdf}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {renderError && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm mb-2">
            {isInverted ? 'PDF rendered incorrectly. Please reload.' : 'PDF rendering error occurred.'}
          </p>
          <button
            onClick={handleReload}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload PDF
          </button>
        </div>
      )}
      
      <div ref={containerRef} className="flex-1 overflow-auto bg-gray-800/50 rounded-lg relative">
        <div className="relative inline-block">
          <canvas ref={canvasRef} className="max-w-none" />
          
          {highlightBox && !renderError && (
            <div
              className="absolute border-4 border-red-500 bg-red-500/10 animate-pulse"
              style={{
                left: `${highlightBox.x * scale}px`,
                top: `${highlightBox.y * scale}px`,
                width: `${highlightBox.width * scale}px`,
                height: `${highlightBox.height * scale}px`,
                pointerEvents: 'none'
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}