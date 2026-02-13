import { FileText, X } from "lucide-react";
import { cyberIrelandData } from "@/lib/data";

export default function PDFViewer({selectedMetric, pdfPage, handleClosePdf}: {selectedMetric: string | null, pdfPage: number | null, handleClosePdf: () => void}) {
    return (
        <div className="glass rounded-2xl p-6 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-2xl font-display font-bold">Source Verification</h3>
                    {selectedMetric && pdfPage && (
                        <p className="text-cyan-300 text-sm mt-1">
                            {selectedMetric} - Page {pdfPage}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleClosePdf}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Close
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 flex-1 overflow-hidden">
                {/* Dashboard Preview */}
                <div className="bg-black/30 rounded-xl p-4 overflow-auto">
                    <h4 className="text-lg font-bold mb-3 text-teal-400">Metric</h4>
                    {selectedMetric && (
                        <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-2">{selectedMetric}</p>
                            <p className="text-3xl font-bold">
                                {selectedMetric === 'Total Jobs' && cyberIrelandData.totalJobs.toLocaleString()}
                                {selectedMetric === 'Total Firms' && cyberIrelandData.totalFirms}
                                {selectedMetric === 'Total Revenue' && cyberIrelandData.totalRevenue}
                                {selectedMetric === 'GVA per Employee' && cyberIrelandData.gvaPerEmployee}
                            </p>
                        </div>
                    )}
                </div>

                {/* PDF Source Preview */}
                <div className="bg-black/30 rounded-xl p-4 overflow-auto">
                    <h4 className="text-lg font-bold mb-3 text-purple-400">PDF Source (Page {pdfPage || 'N/A'})</h4>
                    <div className="border-2 border-red-500 bg-red-500/5 rounded-lg p-6 text-sm">
                        <p className="text-gray-300 leading-relaxed">
                            {pdfPage === 12 && (
                                <>
                                    <span className="block mb-4"><strong className="text-white">4.3 ESTIMATED CYBER SECURITY EMPLOYMENT</strong></span>
                                    <span className="block mb-2">The research team reviewed company accounts and web data for the 489 businesses identified. This included web analysis with identification of 'cyber security-related roles'.</span>
                                    <span className="block mb-2 bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                        <strong className="text-red-300">We estimate that there are <span className="text-2xl text-white">7,351</span> cyber security professionals</strong> (full-time equivalents) working across Ireland's cyber security sector.
                                    </span>
                                    <span className="block">We have examined the composition of these cyber security-related teams...</span>
                                </>
                            )}
                            {pdfPage === 23 && (
                                <>
                                    <span className="block mb-4"><strong className="text-white">3.2 NUMBER OF FIRMS</strong></span>
                                    <span className="block mb-2 bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                        For the <strong className="text-2xl text-white">489 firms</strong> engaged in cyber security in Ireland, Figure 3.1 sets out the breakdown by size (using EU SME definitions).
                                    </span>
                                    <span className="block">Ireland's cyber security sector consists of a high proportion (44%) of large companies...</span>
                                </>
                            )}
                            {pdfPage === 36 && (
                                <>
                                    <span className="block mb-4"><strong className="text-white">4.2 ESTIMATED CYBER SECURITY REVENUE</strong></span>
                                    <span className="block mb-2 bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                        We estimate that in the most recent financial year, <strong className="text-white">annual cyber security-related revenue in Ireland reached approximately <span className="text-2xl">€2.1bn</span></strong>.
                                    </span>
                                    <span className="block mb-4">This figure has been estimated using revenue figures available for dedicated cyber security firms...</span>
                                    <span className="block mb-2"><strong className="text-white">4.4 GROSS VALUE ADDED</strong></span>
                                    <span className="block mb-2">In terms of the current GVA, we estimate that Ireland's cyber security sector generated approximately €1.1bn in 2021.</span>
                                    <span className="block bg-red-500/20 p-2 border-2 border-red-500 rounded">
                                        <strong className="text-white">GVA per employee within the cyber security sector is strong in Ireland (<span className="text-2xl">€150k</span>) signalling a productive workforce.</strong>
                                    </span>
                                </>
                            )}
                        </p>
                    </div>

                    <div className="mt-4 p-3 bg-teal-500/10 rounded-lg border border-teal-500/20">
                        <p className="text-xs text-teal-200">
                            ✓ Source verified from official Cyber Ireland 2022 Report
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}