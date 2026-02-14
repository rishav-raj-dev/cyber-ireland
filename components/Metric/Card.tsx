import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Card(
    { metric, idx, handleMetricClick }:
    {metric: any, idx: number, handleMetricClick: (label: string, page: number, box: any) => void}) {
    return (
        <>
            <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => handleMetricClick(metric.label, metric.page, metric.box)}
                className={`glass rounded-2xl p-6 cursor-pointer transition-all hover:border-${metric.color}-500 group`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${metric.color}-500/20`}>
                        <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                    </div>
                    <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                    >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                    </motion.div>
                </div>
                <h3 className="text-gray-400 text-sm mb-2 font-mono">{metric.label}</h3>
                <p className="text-3xl font-bold font-display">{metric.value}</p>
                <p className="text-xs text-cyan-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view source (Page {metric.page})
                </p>
            </motion.div>
        </>
    )
}