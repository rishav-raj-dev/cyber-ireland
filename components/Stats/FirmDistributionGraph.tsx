import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cyberIrelandData } from "@/lib/data";
import { useContext } from "react";
import { AppContext } from "@/lib/AppContext";
export default function FirmDistributionGraph() {
    const { showPdfModal } = useContext(AppContext);    
    const firmSizeData = Object.entries(cyberIrelandData.firmSizes).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        count: value.count,
        percentage: value.percentage
    }));
    return (
        <div className={`grid grid-cols-1 gap-8 ${showPdfModal ? 'xl:grid-cols-1' : 'lg:grid-cols-1'
                }`}>
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
    )

}