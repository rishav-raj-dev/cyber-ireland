import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cyberIrelandData } from "@/lib/data";
import { useContext } from "react";
import { AppContext } from "@/app/page";

export default function TaxonomyGraph() {
    const { COLORS } = useContext(AppContext);
    const taxonomyData = Object.values(cyberIrelandData.taxonomy).map(item => ({
        name: item.label,
        value: item.firms
    }));

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="glass rounded-2xl p-6 mb-12"
            >
                <h2 className="text-2xl font-display font-bold mb-6">Services Taxonomy</h2>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={taxonomyData} >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#94a3b8" angle={-15} textAnchor="end" height={100} fontSize={10} />
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
        </>
    )
}