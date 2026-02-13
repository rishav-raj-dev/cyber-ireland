import { motion } from "framer-motion";
import { FileText } from "lucide-react";


export default function Header({setShowPdfModal}: {setShowPdfModal: (show: boolean) => void}) {
    return (
        <>
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl md:text-6xl font-display font-bold">
                    <span className=" text-blue-300 animated-gradient bg-clip-text text-transparent">
                    CYBER IRELAND
                    </span>
                </h1>
                <a
                    href="/State-of-the-Cyber-Security-Sector-in-Ireland-2022-Report.pdf"
                    target="_blank"
                    className="glass px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-white/10 transition"
                >
                    <FileText className="w-4 h-4" />
                    <span className="hidden md:inline">Open Source</span>
                </a>
                </div>
                <p className="text-cyan-300 text-lg font-mono">
                State of the Cyber Security Sector 2022 • Digital Twin Dashboard
                </p>
            </motion.header>
        </>
    )
}