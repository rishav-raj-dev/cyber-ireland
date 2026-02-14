import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { cyberIrelandData } from "@/lib/data";

export default function FirmTypeGraph() {
    return (
        <>
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
        </>
    )
}