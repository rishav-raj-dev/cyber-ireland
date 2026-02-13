import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cyberIrelandData } from "@/lib/data";
import { useContext, useState } from "react";
import { AppContext } from "@/app/page";


export default function SliderGraph() {
    const [selectedYear, setSelectedYear] = useState(2021);
    const { showPdfModal, setShowPdfModal, COLORS } = useContext(AppContext);
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
        <>
            <div className={`grid grid-cols-1 gap-8 mb-12 ${showPdfModal ? 'xl:grid-cols-2' : 'lg:grid-cols-3'
                }`}>
                {/* Growth Projection with Year Slider */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`glass rounded-2xl p-6 ${showPdfModal ? 'xl:col-span-2' : 'lg:col-span-2'
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
            <div className={`grid grid-cols-1 gap-8 ${showPdfModal ? 'xl:grid-cols-1' : 'lg:grid-cols-2'
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
        </>
    )
}