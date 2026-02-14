import { AnimatePresence, motion } from "framer-motion";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cyberIrelandData } from "@/lib/data";
import { useContext, useState } from "react";
import { AppContext } from "@/lib/AppContext";
export default function TrajectoryGraph() {
    const [selectedYear, setSelectedYear] = useState(2022);
    const { showPdfModal } = useContext(AppContext);
    const currentYearData = cyberIrelandData.yearlyGrowth.find(d => d.year === selectedYear);
    return (
        <div className={`grid grid-cols-1 gap-8 mb-12 ${showPdfModal ? 'xl:grid-cols-2' : 'lg:grid-cols-1'
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
                    <h2 className="text-2xl font-display font-bold">Growth Trajectory 2022-2030</h2>
                    <div className="text-sm text-cyan-300">10% CAGR Projection</div>
                </div>

                {/* Year Slider */}
                <div className="mb-8">
                    

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
                        <XAxis dataKey="year" stroke="#94a3b8"/>
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
                        <strong>Gap Analysis:</strong> From {selectedYear === 2022 ? 'baseline' : selectedYear} to 2030, sector needs to add{' '}
                        <strong>{(17333 - (currentYearData?.employment || 7351)).toLocaleString()} jobs</strong> to meet projections. <br />
                        <strong> Annual growth rate required:</strong> ~10% CAGR. 
                    </p>
                </div>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400 font-mono">Select Year</span>
                    <span className="text-2xl font-bold text-teal-400">{selectedYear}</span>
                </div>
                <input
                    type="range"
                    min="2022"
                    max="2030"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-500"
                    style={{
                        background: `linear-gradient(to right, #00D9C0 0%, #00D9C0 ${((selectedYear - 2022) / 8) * 100}%, #374151 ${((selectedYear - 2022) / 8) * 100}%, #374151 100%)`
                    }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>2022</span>
                    <span>2025</span>
                    <span>2030</span>
                </div>
            </motion.div>
        </div>
    )
}