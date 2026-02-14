import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cyberIrelandData } from "@/lib/data";
import { useContext } from "react";
import { AppContext } from "@/lib/AppContext";

export default function TaxonomyGraph() {
    const { showPdfModal, COLORS } = useContext(AppContext);
    const taxonomyData = Object.values(cyberIrelandData.taxonomy).map(item => ({
        name: item.label,
        value: item.firms
    }));

    return (
        <>
            <div className={`grid grid-cols-1 gap-8 mb-12 ${showPdfModal ? 'xl:grid-cols-1' : 'lg:grid-cols-2'
                }`}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-2xl p-6 h-full"
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

                    <div className="space-y-3 mt-3">
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

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass rounded-2xl p-6 h-full"
                >
                    <h2 className="text-2xl font-display font-bold mb-6">Services Taxonomy</h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={taxonomyData} >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#94a3b8" angle={-15} textAnchor="end" height={100} fontSize={9} />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(10, 22, 40, 0.95)',
                                    border: '1px solid rgba(0, 217, 192, 0.3)',
                                    borderRadius: '8px',
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
            </div>
        </>
    )
}