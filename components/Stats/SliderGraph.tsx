import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cyberIrelandData } from "@/lib/data";
import { useContext, useState } from "react";
import { AppContext } from "@/app/page";
import TrajectoryGraph from "./TrajectoryGraph";
import FirmTypeGraph from "./FirmTypeGraph";
import TaxonomyGraph from "./TaxonomyGraph";
import FirmDistributionGraph from "./FirmDistributionGraph";


export default function SliderGraph() {
    const [selectedYear, setSelectedYear] = useState(2022);
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

    const currentYearData = cyberIrelandData.yearlyGrowth.find(d => d.year === selectedYear);

    return (
        <>
            <TrajectoryGraph />

            <TaxonomyGraph />

            <FirmDistributionGraph />
        </>
    )
}