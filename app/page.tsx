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
        <div ref={containerRef} className="flex h-screen overflow-hidden">
            {/* Main Dashboard Content */}
            <div 
                className="min-h-screen overflow-y-auto p-4 md:p-8 transition-all"
                style={{ 
                    width: showPdfModal ? `${sidebarWidth}%` : '100%' 
                }}

            >

                <Header setShowPdfModal={setShowPdfModal} />

                <Metric handleMetricClick={handleMetricClick} />

                <RegionMap showPdfModal={showPdfModal} />

                {/* Main Content Grid */}
                <div className={`grid grid-cols-1 gap-8 mb-12 ${
                    showPdfModal ? 'xl:grid-cols-2' : 'lg:grid-cols-3'
                }`}>
                    {/* Growth Projection with Year Slider */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`glass rounded-2xl p-6 ${
                            showPdfModal ? 'xl:col-span-2' : 'lg:col-span-2'
                        }`}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-display font-bold">Growth Trajectory 2021-2030</h2>
                            <div className="text-sm text-cyan-300">10% CAGR Projection</div>
                        </div>

                        {/* Year Slider */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-400 font-mono">Select Year</span>
                                <span className="text-2xl font-bold text-teal-400">{selectedYear}</span>
                            </div>
                            <input
                                type="range"
                                min="2021"
                                max="2030"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                                style={{
                                    background: `linear-gradient(to right, #00D9C0 0%, #00D9C0 ${((selectedYear - 2021) / 9) * 100}%, #374151 ${((selectedYear - 2021) / 9) * 100}%, #374151 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>2021</span>
                                <span>2025</span>
                                <span>2030</span>
                            </div>

                            {/* Current Year Stats */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedYear}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-6 grid grid-cols-2 gap-4"
                                >
                                    <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/20">
                                        <p className="text-xs text-gray-400 mb-1">GVA (Million €)</p>
                                        <p className="text-2xl font-bold text-teal-400">€{currentYearData?.gva.toFixed(1)}M</p>
                                    </div>
                                    <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                                        <p className="text-xs text-gray-400 mb-1">Employment</p>
                                        <p className="text-2xl font-bold text-purple-400">{currentYearData?.employment.toLocaleString()}</p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Growth Chart */}
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={cyberIrelandData.yearlyGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="year" stroke="#94a3b8" />
                                <YAxis yAxisId="left" stroke="#00D9C0" />
                                <YAxis yAxisId="right" orientation="right" stroke="#7C3AED" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 22, 40, 0.95)',
                                        border: '1px solid rgba(0, 217, 192, 0.3)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="gva" stroke="#00D9C0" strokeWidth={3} name="GVA (€M)" dot={{ fill: '#00D9C0', r: 4 }} />
                                <Line yAxisId="right" type="monotone" dataKey="employment" stroke="#7C3AED" strokeWidth={3} name="Employment" dot={{ fill: '#7C3AED', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>

                        <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                            <p className="text-sm text-yellow-200">
                                <strong>Gap Analysis:</strong> From {selectedYear === 2021 ? 'baseline' : selectedYear} to 2030, sector needs to add{' '}
                                <strong>{(17333 - (currentYearData?.employment || 7351)).toLocaleString()} jobs</strong> to meet projections.
                            </p>
                        </div>
                    </motion.div>

                    {/* Firm Types Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass rounded-2xl p-6"
                    >
                        <h2 className="text-2xl font-display font-bold mb-6">Firm Types</h2>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Dedicated', value: cyberIrelandData.firmTypes.dedicated.count },
                                        { name: 'Diversified', value: cyberIrelandData.firmTypes.diversified.count }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#00D9C0" />
                                    <Cell fill="#7C3AED" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="space-y-3 mt-6">
                            {[
                                { label: 'Dedicated', count: cyberIrelandData.firmTypes.dedicated.count, employees: cyberIrelandData.firmTypes.dedicated.employees, color: 'teal' },
                                { label: 'Diversified', count: cyberIrelandData.firmTypes.diversified.count, employees: cyberIrelandData.firmTypes.diversified.employees, color: 'purple' }
                            ].map((type) => (
                                <div key={type.label} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full bg-${type.color}-500`} />
                                        <span className="font-mono text-sm">{type.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{type.count} firms</p>
                                        <p className="text-xs text-gray-400">{type.employees.toLocaleString()} employees</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                

                {/* Taxonomy & Firm Sizes */}
                <div className={`grid grid-cols-1 gap-8 ${
                    showPdfModal ? 'xl:grid-cols-1' : 'lg:grid-cols-2'
                }`}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass rounded-2xl p-6"
                    >
                        <h2 className="text-2xl font-display font-bold mb-6">Services Taxonomy</h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={taxonomyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} fontSize={10} />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 22, 40, 0.95)',
                                        border: '1px solid rgba(0, 217, 192, 0.3)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="value" name="Number of Firms">
                                    {taxonomyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="glass rounded-2xl p-6"
                    >
                        <h2 className="text-2xl font-display font-bold mb-6">Firm Size Distribution</h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={firmSizeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 22, 40, 0.95)',
                                        border: '1px solid rgba(0, 217, 192, 0.3)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Bar dataKey="count" fill="#00D9C0" name="Number of Firms" />
                            </BarChart>
                        </ResponsiveContainer>

                        <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <p className="text-sm text-blue-200">
                                <strong>44% Large Firms</strong> - significantly higher than typical Irish economy (99% SMEs)
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* PDF Modal - Click-to-Source */}
                
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
    );
}
