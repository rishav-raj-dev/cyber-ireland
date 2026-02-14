import { motion } from "framer-motion";
import { Building2, DollarSign, ExternalLink, TrendingUp, Users } from "lucide-react";
import { cyberIrelandData } from "@/lib/data";
import Card from "./Card";
import { useContext, useState } from "react";
import { createContext } from "vm";
import { AppContext } from "@/lib/AppContext";



export default function Metric({ handleMetricClick }: { handleMetricClick: (label: string, page: number, box: any) => void }) {
    const metricData = [
        {
            icon: Users, label: 'Total Jobs', value: cyberIrelandData.totalJobs.toLocaleString(), color: 'teal', page: 17,
            box: { x: 640, y: 550, width: 500, height: 60 }
        },
        {
            icon: Building2, label: 'Total Firms', value: cyberIrelandData.totalFirms, color: 'cyan', page: 4,
            box: { x: 680, y: 500, width: 200, height: 80 }
        }
    ];
    const { showPdfModal, setShowPdfModal } = useContext(AppContext);
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12"
            >
                {metricData.map((metric, idx) => (
                    <Card key={metric.label} metric={metric} idx={idx} handleMetricClick={handleMetricClick} />
                ))}
            </motion.div>
        </>
    )
}