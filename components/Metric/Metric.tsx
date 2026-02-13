import { motion } from "framer-motion";
import { Building2, DollarSign, ExternalLink, TrendingUp, Users } from "lucide-react";
import { cyberIrelandData } from "@/lib/data";
import Card from "./Card";

export default function Metric({handleMetricClick}: {handleMetricClick: (label: string, page: number) => void}) {
    const metricData = [
        { icon: Users, label: 'Total Jobs', value: cyberIrelandData.totalJobs.toLocaleString(), color: 'teal', page: 12 },
        { icon: Building2, label: 'Total Firms', value: cyberIrelandData.totalFirms, color: 'cyan', page: 23 },
        { icon: DollarSign, label: 'Total Revenue', value: cyberIrelandData.totalRevenue, color: 'purple', page: 36 },
        { icon: TrendingUp, label: 'GVA per Employee', value: cyberIrelandData.gvaPerEmployee, color: 'cyan', page: 36 }
    ];
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
                {metricData.map((metric, idx) => (
                    <Card metric={metric} idx={idx} handleMetricClick={handleMetricClick} />
                ))}
            </motion.div>
        </>
    )
}