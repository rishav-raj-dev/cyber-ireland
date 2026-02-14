'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Building2, Users, DollarSign, FileText, MapPin, ChevronRight, ExternalLink, X } from 'lucide-react';
import { cyberIrelandData } from '../lib/data';
import Header from '@/components/Header/Header';
import Metric from '@/components/Metric/Metric';
import PDFViewer from '@/components/Metric/PdfViewer';
import dynamic from 'next/dynamic'
import App from 'next/app';
import SliderGraph from '@/components/Stats/SliderGraph';
import { AppContext } from '@/lib/AppContext';

// Dynamically import the map component with SSR disabled
const RegionMap = dynamic(
  () => import('@/components/Map/RegionMap'),
  { 
    ssr: false,
    loading: () => <div>Loading map...</div>
  }
)

export default function Home() {
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState(2022);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfPage, setPdfPage] = useState<number | null>(null);
    const [sidebarWidth, setSidebarWidth] = useState(50); // percentage
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            const isNowMobile = window.innerWidth < 768;
            setIsMobile(isNowMobile);
            
            // If switching back to desktop and PDF is open, reset to 50/50 split
            if (!isNowMobile && showPdfModal) {
                setSidebarWidth(50);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile, showPdfModal]);

    const COLORS = ['#00D9C0', '#00B8D9', '#7C3AED', '#F59E0B', '#EF4444'];

    // Handle closing PDF modal
    const handleClosePdf = () => {
        setShowPdfModal(false);
        // Reset to desktop view if window is wide enough
        if (window.innerWidth >= 768) {
            setIsMobile(false);
            setSidebarWidth(50);
        }
    };

    // Handle click-to-source
    const handleMetricClick = (metricName: string, pageNum: number) => {
        setSelectedMetric(metricName);
        setPdfPage(pageNum);
        setShowPdfModal(true);
    };

    // Prepare chart data
    const firmSizeData = Object.entries(cyberIrelandData.firmSizes).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: value.count,
        percentage: value.percentage
    }));

    const taxonomyData = Object.values(cyberIrelandData.taxonomy).map(item => ({
        name: item.label,
        value: item.firms
    }));

    const regionData = Object.entries(cyberIrelandData.regions).map(([name, data]) => ({
        name,
        offices: data.offices,
        firms: data.purePlay + data.hybrid,
    }));

    const currentYearData = cyberIrelandData.yearlyGrowth.find(d => d.year === selectedYear);

    return (
        <AppContext.Provider value={{ showPdfModal, setShowPdfModal, COLORS }}>
        <div ref={containerRef} className="flex h-screen overflow-hidden">
            {/* Main Dashboard Content */}
            <div 
                className="min-h-screen overflow-y-auto p-4 md:p-8 transition-all"
                style={{ 
                    width: showPdfModal ? `${sidebarWidth}%` : '100%' 
                }}
            >

                <Header />

                <Metric handleMetricClick={handleMetricClick} />

                <RegionMap showPdfModal={showPdfModal} />

                <SliderGraph />
                
                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center text-gray-400 text-sm pb-8"
                >
                    <p className="font-mono mb-2">Data source: State of the Cyber Security Sector in Ireland 2022 Report</p>
                    <p>Commissioned by Cyber Ireland & Cyber Skills • Funded by Enterprise Ireland</p>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                        <span className="px-3 py-1 glass rounded-full">© 2022 Cyber Ireland</span>
                        <span className="px-3 py-1 glass rounded-full">Digital Twin Dashboard</span>
                        <span className="px-3 py-1 glass rounded-full">Next.js Application</span>
                    </div>
                </motion.footer>
            </div>

            {/* Resizable Divider - Only on desktop
            {showPdfModal && !isMobile && (
                <div
                    className="w-1 bg-gradient-to-b from-teal-500/50 to-purple-500/50 cursor-col-resize hover:w-2 transition-all relative group"
                    onMouseDown={() => setIsDragging(true)}
                >
                    <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-teal-500/20 transition-colors" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-16 bg-gray-800 rounded-full border-2 border-teal-500/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="flex gap-0.5">
                            <div className="w-0.5 h-6 bg-teal-400 rounded" />
                            <div className="w-0.5 h-6 bg-teal-400 rounded" />
                        </div>
                    </div>
                </div>
            )} */}

            {/* PDF Viewer Panel - Desktop Split View */}
            {showPdfModal && !isMobile && (
                <div 
                    className="h-screen overflow-y-auto p-4 md:p-8"
                    style={{ width: `${100 - sidebarWidth}%` }}
                >
                    <PDFViewer selectedMetric={selectedMetric} pdfPage={pdfPage} handleClosePdf={handleClosePdf} />
                </div>
            )}

            {/* PDF Modal - Mobile Only */}
            {showPdfModal && isMobile && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClosePdf}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-full"
                    >
                        <PDFViewer selectedMetric={selectedMetric} pdfPage={pdfPage} handleClosePdf={handleClosePdf} />
                    </motion.div>
                </motion.div>
            )}
        </div>
        </AppContext.Provider>
    );
}
