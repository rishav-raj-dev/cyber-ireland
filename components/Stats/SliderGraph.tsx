import { AnimatePresence, motion } from "framer-motion";
import { div } from "framer-motion/client";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cyberIrelandData } from "@/lib/data";
import { useContext, useState } from "react";
import { AppContext } from "@/lib/AppContext";
import TrajectoryGraph from "./TrajectoryGraph";
import TaxonomyGraph from "./TaxonomyGraph";
import FirmDistributionGraph from "./FirmDistributionGraph";


export default function SliderGraph() {
    return (
        <>
            <TrajectoryGraph />

            <TaxonomyGraph />

            <FirmDistributionGraph />
        </>
    )
}