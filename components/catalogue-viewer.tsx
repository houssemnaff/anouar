'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FlipBookViewerProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
}

export function FlipBookViewer({ pdfUrl, title, onClose }: FlipBookViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [scale, setScale] = useState(1);
  const [pageSize, setPageSize] = useState({ width: 550, height: 733 });  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);  const bookRef = useRef<any>(null);

  // Taille responsive dynamique pour s'adapter à l'écran
  useEffect(() => {
    const updateSize = () => {
      const isMobile = window.innerWidth < 768;
      
      // Marges de sécurité (Header + Footer + Padding)
      const verticalSpace = 120; // Espace pour header et footer
      const horizontalSpace = 40; // Padding latéral
      
      const availableHeight = window.innerHeight - verticalSpace;
      const availableWidth = window.innerWidth - horizontalSpace;
      
      // Ratio A4 standard (Largeur / Hauteur = ~0.707)
      const aspectRatio = 0.707;

      let w, h;

      if (isMobile) {
        // Mobile : Une seule page, on maximise l'espace
        h = availableHeight;
        w = h * aspectRatio;
        
        // Si trop large pour l'écran mobile
        if (w > availableWidth) {
          w = availableWidth;
          h = w / aspectRatio;
        }
      } else {
        // Desktop : Double page (spread)
        // La largeur totale disponible doit contenir 2 pages
        // On calcule d'abord basé sur la hauteur disponible
        h = availableHeight;
        w = h * aspectRatio;
        
        // Si largeur totale (2 pages) dépasse l'écran
        if (w * 2 > availableWidth) {
          w = availableWidth / 2;
          h = w / aspectRatio;
        }
      }

      setPageSize({ 
        width: Math.floor(w), 
        height: Math.floor(h) 
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const nextPage = useCallback(() => {
    if (bookRef.current) {
      console.log('Next page clicked');
      bookRef.current.pageFlip().flipNext();
    }
  }, []);

  const prevPage = useCallback(() => {
    if (bookRef.current) {
      console.log('Previous page clicked');
      bookRef.current.pageFlip().flipPrev();
    }
  }, []);

  const goToPage = useCallback((page: number) => {
    if (bookRef.current) {
      console.log('Go to page:', page);
      bookRef.current.pageFlip().flip(page);
    }
  }, []);

  const zoomIn = useCallback(() => setScale(prev => Math.min(prev + 0.1, 1.8)), []);
  const zoomOut = useCallback(() => setScale(prev => Math.max(prev - 0.1, 0.6)), []);
  const resetZoom = useCallback(() => setScale(1), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Navigation clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextPage();
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        goToPage(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        goToPage(numPages - 1);
      }
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          onClose();
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomIn();
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomOut();
      }
      if (e.key === '0') {
        e.preventDefault();
        resetZoom();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPage, prevPage, goToPage, numPages, onClose, toggleFullscreen, zoomIn, zoomOut, resetZoom]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
      {/* Header Minimaliste */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between text-white z-20">
        <h2 className="text-lg font-semibold drop-shadow-md">{title}</h2>
        <div className="flex items-center gap-2">
           {/* Zoom Controls */}
           <div className="flex items-center bg-black/40 backdrop-blur-sm rounded-lg p-1 mr-2">
            <Button onClick={zoomOut} size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs px-2 w-[40px] text-center">{Math.round(scale * 100)}%</span>
            <Button onClick={zoomIn} size="icon" variant="ghost" className="h-8 w-8 text-white hover:bg-white/20">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
          <Button onClick={onClose} size="icon" variant="ghost" className="rounded-full hover:bg-white/20 text-white">
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full flex items-center justify-center relative p-4 overflow-hidden">
        {/* Navigation Arrows */}
        <Button
          onClick={prevPage}
          disabled={currentPage === 0}
          variant="ghost" 
          className="absolute left-4 z-10 text-white hover:bg-white/10 rounded-full h-12 w-12 hidden md:flex items-center justify-center disabled:opacity-30"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        <Button
          onClick={nextPage}
          disabled={currentPage >= numPages - 1}
          variant="ghost"
          className="absolute right-4 z-10 text-white hover:bg-white/10 rounded-full h-12 w-12 hidden md:flex items-center justify-center disabled:opacity-30"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

        {/* FlipBook */}
        <div className="flipbook-container relative z-0">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-white flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Chargement...</span>
              </div>
            }
            error={
              <div className="text-red-400 font-medium">Erreur chargement PDF</div>
            }
          >
            {numPages > 0 && (
              <HTMLFlipBook
                ref={bookRef}
                width={Math.floor(pageSize.width * scale)}
                height={Math.floor(pageSize.height * scale)}
                size="fixed"
                minWidth={0}
                maxWidth={3000}
                minHeight={0}
                maxHeight={3000}
                showCover={true}
                flippingTime={1000}
                usePortrait={false}
                startPage={0}
                drawShadow={true}
                className="flipbook"
                style={{}}
                onFlip={(e: any) => {
                  const newPage = e.data;
                  setCurrentPage(newPage);
                }}
                mobileScrollSupport={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.5}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={false}
                disableFlipByClick={false}
              >
                {Array.from({ length: numPages }, (_, i) => i).map((pageNumber) => (
                  <div
                    key={`page-${pageNumber}`}
                    className="page bg-white shadow-xl overflow-hidden flex items-center justify-center"
                  >
                    <Page
                      pageNumber={pageNumber + 1}
                      width={Math.floor(pageSize.width * scale)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      error={
                         <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-400 text-xs">
                           Page {pageNumber + 1}
                         </div>
                      }
                      loading={
                        <div className="w-full h-full bg-gray-50 animate-pulse" />
                      }
                    />
                    {/* Numéro de page discret */}
                    <div className="absolute bottom-2 right-2 pointer-events-none opacity-50">
                      <span className="text-[10px] text-gray-500 font-mono">
                        {pageNumber + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </HTMLFlipBook>
            )}
          </Document>
        </div>
      </div>

      {/* Footer Navigation Basic */}
      <div className="p-4 w-full flex items-center justify-center gap-4 text-white z-20 pb-8">
        <Button
          onClick={prevPage}
          disabled={currentPage === 0}
          variant="outline"
          size="sm"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
        </Button>

        <span className="font-mono text-sm">
          {currentPage + 1} / {numPages}
        </span>

        <Button
          onClick={nextPage}
          disabled={currentPage >= numPages - 1}
          variant="outline"
          size="sm"
          className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          Suivant <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Styles Flipbook */}
      <style jsx global>{`
        .flipbook-container {
          perspective: 2000px;
        }
        .flipbook .page {
          background-color: #fff;
        }
      `}</style>
    </div>
  );
}

// Export also as CatalogueViewer for backward compatibility
export const CatalogueViewer = FlipBookViewer;