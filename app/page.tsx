'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Building2, Users, DollarSign, FileText, MapPin, ChevronRight, ExternalLink } from 'lucide-react';
import { cyberIrelandData } from '../lib/data';
import Header from '@/components/Header/Header';
import Metric from '@/components/Metric/Metric';


export default function Home() {
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState(2022);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfPage, setPdfPage] = useState<number | null>(null);

    const COLORS = ['#00D9C0', '#00B8D9', '#7C3AED', '#F59E0B', '#EF4444'];

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
        firms: data.firms
    }));

    const currentYearData = cyberIrelandData.yearlyGrowth.find(d => d.year === selectedYear);

    return (
        <div className="min-h-screen p-4 md:p-8">

            <Header setShowPdfModal={setShowPdfModal} />

            <Metric handleMetricClick={handleMetricClick} />


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Growth Projection with Year Slider */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 glass rounded-2xl p-6"
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

            {/* Regional Map - Geospatial Drill-Down */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass rounded-2xl p-6 mb-12"
            >
                <h2 className="text-2xl font-display font-bold mb-6">Regional Distribution</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Interactive Ireland Map */}
                    <div className="relative h-96 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-xl p-8">
                        <div className="relative w-full h-full">
                            {/* Simplified Ireland shape */}
                            <svg viewBox="0 0 200 300" className="w-full h-full">
                                <path
                                    d="M100,20 Q80,40 70,70 Q60,100 70,130 Q80,160 75,190 Q70,220 80,250 Q90,280 100,280 Q110,280 120,250 Q130,220 125,190 Q120,160 130,130 Q140,100 130,70 Q120,40 100,20 Z"
                                    fill="rgba(0, 217, 192, 0.1)"
                                    stroke="#00D9C0"
                                    strokeWidth="2"
                                />

                                {/* Region markers */}
                                {[
                                    { name: 'Dublin', x: 110, y: 90 },
                                    { name: 'Cork', x: 80, y: 200 },
                                    { name: 'Galway', x: 60, y: 110 },
                                    { name: 'Limerick', x: 75, y: 150 }
                                ].map((region) => (
                                    <g
                                        key={region.name}
                                        className="cursor-pointer transition-transform hover:scale-110"
                                        onMouseEnter={() => setSelectedRegion(region.name)}
                                        onMouseLeave={() => setSelectedRegion(null)}
                                    >
                                        <circle
                                            cx={region.x}
                                            cy={region.y}
                                            r={selectedRegion === region.name ? 12 : 8}
                                            fill={selectedRegion === region.name ? '#00D9C0' : '#7C3AED'}
                                            className="transition-all"
                                        >
                                            <animate
                                                attributeName="r"
                                                values={selectedRegion === region.name ? "12;14;12" : "8;10;8"}
                                                dur="2s"
                                                repeatCount="indefinite"
                                            />
                                        </circle>
                                        <text
                                            x={region.x + 15}
                                            y={region.y + 5}
                                            fill="white"
                                            fontSize="12"
                                            fontWeight="bold"
                                            className="font-mono"
                                        >
                                            {region.name}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>

                    {/* Region Stats */}
                    <div>
                        <AnimatePresence mode="wait">
                            {selectedRegion ? (
                                <motion.div
                                    key={selectedRegion}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin className="w-6 h-6 text-teal-400" />
                                        <h3 className="text-3xl font-display font-bold text-teal-400">{selectedRegion}</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/30">
                                            <p className="text-sm text-gray-400 mb-1 font-mono">Offices</p>
                                            <p className="text-4xl font-bold text-teal-400">
                                                {cyberIrelandData.regions[selectedRegion as keyof typeof cyberIrelandData.regions].offices}
                                            </p>
                                        </div>
                                        <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                                            <p className="text-sm text-gray-400 mb-1 font-mono">Firms</p>
                                            <p className="text-4xl font-bold text-purple-400">
                                                {cyberIrelandData.regions[selectedRegion as keyof typeof cyberIrelandData.regions].firms}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                        <p className="text-sm text-cyan-200">
                                            {selectedRegion === 'Cork' && '🏆 Highest concentration of cybersecurity multinationals - home to top 5 employers'}
                                            {selectedRegion === 'Dublin' && '📊 Largest cluster - 50% of all taxonomy offices across sectors'}
                                            {selectedRegion === 'Galway' && '🎓 Second-highest firms per capita - home to HP Global Cyber Defence Centre'}
                                            {selectedRegion === 'Limerick' && '🔧 11% of all operational technology offices nationwide'}
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-center h-full text-gray-400 text-center"
                                >
                                    <div>
                                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="font-mono">Hover over a region on the map to view details</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Taxonomy & Firm Sizes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <AnimatePresence>
                {showPdfModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPdfModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-display font-bold">Source Verification</h3>
                                    {selectedMetric && pdfPage && (
                                        <p className="text-cyan-300 text-sm mt-1">
                                            {selectedMetric} → Page {pdfPage}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowPdfModal(false)}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 h-[70vh]">
                                {/* Dashboard Preview */}
                                <div className="bg-black/30 rounded-xl p-4 overflow-auto">
                                    <h4 className="text-lg font-bold mb-3 text-teal-400">Dashboard View</h4>
                                    {selectedMetric && (
                                        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                                            <p className="text-sm text-gray-400 mb-2">{selectedMetric}</p>
                                            <p className="text-3xl font-bold">
                                                {selectedMetric === 'Total Jobs' && cyberIrelandData.totalJobs.toLocaleString()}
                                                {selectedMetric === 'Total Firms' && cyberIrelandData.totalFirms}
                                                {selectedMetric === 'Total Revenue' && cyberIrelandData.totalRevenue}
                                                {selectedMetric === 'GVA per Employee' && cyberIrelandData.gvaPerEmployee}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* PDF Source Preview */}
                                <div className="bg-black/30 rounded-xl p-4 overflow-auto">
                                    <h4 className="text-lg font-bold mb-3 text-purple-400">PDF Source (Page {pdfPage || 'N/A'})</h4>
                                    <div className="border-2 border-red-500 bg-red-500/5 rounded-lg p-6 text-sm">
                                        <p className="text-gray-300 leading-relaxed">
                                            {pdfPage === 12 && (
                                                <>
                                                    <span className="block mb-4"><strong className="text-white">4.3 ESTIMATED CYBER SECURITY EMPLOYMENT</strong></span>
                                                    <span className="block mb-2">The research team reviewed company accounts and web data for the 489 businesses identified. This included web analysis with identification of 'cyber security-related roles'.</span>
                                                    <span className="block mb-2 bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                                        <strong className="text-red-300">We estimate that there are <span className="text-2xl text-white">7,351</span> cyber security professionals</strong> (full-time equivalents) working across Ireland's cyber security sector.
                                                    </span>
                                                    <span className="block">We have examined the composition of these cyber security-related teams...</span>
                                                </>
                                            )}
                                            {pdfPage === 23 && (
                                                <>
                                                    <span className="block mb-4"><strong className="text-white">3.2 NUMBER OF FIRMS</strong></span>
                                                    <span className="block mb-2 bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                                        For the <strong className="text-2xl text-white">489 firms</strong> engaged in cyber security in Ireland, Figure 3.1 sets out the breakdown by size (using EU SME definitions).
                                                    </span>
                                                    <span className="block">Ireland's cyber security sector consists of a high proportion (44%) of large companies...</span>
                                                </>
                                            )}
                                            {pdfPage === 36 && (
                                                <>
                                                    <span className="block mb-4"><strong className="text-white">4.2 ESTIMATED CYBER SECURITY REVENUE</strong></span>
                                                    <span className="block mb-2 bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                                        We estimate that in the most recent financial year, <strong className="text-white">annual cyber security-related revenue in Ireland reached approximately <span className="text-2xl">€2.1bn</span></strong>.
                                                    </span>
                                                    <span className="block mb-4">This figure has been estimated using revenue figures available for dedicated cyber security firms...</span>
                                                    <span className="block mb-2"><strong className="text-white">4.4 GROSS VALUE ADDED</strong></span>
                                                    <span className="block mb-2">In terms of the current GVA, we estimate that Ireland's cyber security sector generated approximately €1.1bn in 2021.</span>
                                                    <span className="block bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                                        <strong className="text-white">GVA per employee within the cyber security sector is strong in Ireland (<span className="text-2xl">€150k</span>) signalling a productive workforce.</strong>
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    <div className="mt-4 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
                                        <p className="text-xs text-teal-200">
                                            ✓ Source verified from official Cyber Ireland 2022 Report
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <a
                                    href="/State-of-the-Cyber-Security-Sector-in-Ireland-2022-Report.pdf"
                                    target="_blank"
                                    className="flex-1 bg-teal-500/20 hover:bg-teal-500/30 rounded-lg p-3 flex items-center justify-center gap-2 transition"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Open Full PDF Report</span>
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
    );
}
