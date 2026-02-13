import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { cyberIrelandData } from "@/lib/data";

export default function RegionMap({showPdfModal}: {showPdfModal: boolean}) {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    return (
        <motion.div
            className="glass rounded-2xl p-6 mb-12"
        >
            <h2 className="text-2xl font-display font-bold mb-6">Regional Distribution</h2>

            <div className={`grid grid-cols-1 gap-8 ${showPdfModal ? 'xl:grid-cols-2' : 'lg:grid-cols-2'
                }`}>
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
                                    className="cursor-pointer transition-transform"
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
    )
}