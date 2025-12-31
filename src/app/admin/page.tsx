"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle, AlertCircle, Eye, Save } from "lucide-react";
import { ThemeSwitcher } from "@/features/portfolio/components/theme-switcher";
import { PortfolioData } from "@/types/portfolio";
import { ResumeReview } from "@/features/admin/components/resume-review/resume-review-container";
import { Login } from "@/features/auth/components/login-form";
import { mergePortfolioData } from "@/lib/merge";
import { EditButton } from "@/features/admin/components/edit-button";

type Step = "upload" | "review" | "success";

interface SectionSelection {
    personalInfo: boolean;
    skills: boolean;
    experience: boolean;
    projects: boolean;
}

export default function AdminPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [step, setStep] = useState<Step>("upload");
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "uploading" | "reviewing" | "saving" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [parsedData, setParsedData] = useState<PortfolioData | null>(null);
    const [currentData, setCurrentData] = useState<PortfolioData | null>(null);
    const [sectionSelection, setSectionSelection] = useState<SectionSelection>({
        personalInfo: true,
        skills: true,
        experience: true,
        projects: true,
    });

    // Fetch current portfolio data on mount
    useEffect(() => {
        const fetchCurrentData = async () => {
            try {
                const res = await fetch("/api/update-portfolio");
                if (res.ok) {
                    const data = await res.json();
                    setCurrentData(data);
                }
            } catch (error) {
                console.error("Failed to fetch current portfolio data:", error);
            }
        };
        if (isAuthenticated) {
            fetchCurrentData();
        }
    }, [isAuthenticated]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setStatus("idle");
            setMessage("");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus("uploading");
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/parse-resume", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const result = await res.json();
            console.log("Resume parsed successfully:", result.data);

            // Merge parsed data with current data if available
            let dataToReview = result.data;
            if (currentData) {
                console.log("Merging with existing data...");
                dataToReview = mergePortfolioData(currentData, result.data);
            }

            // Store parsed data and move to review step
            setParsedData(dataToReview);
            setStatus("reviewing");
            setStep("review");
        } catch (error) {
            console.error("Upload error:", error);
            setStatus("error");
            setMessage("Failed to process resume. Please try again.");
        }
    };

    const toggleSection = (section: keyof SectionSelection) => {
        setSectionSelection(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFinalSubmit = async (dataToSubmit?: PortfolioData) => {
        const data = dataToSubmit || parsedData;
        if (!data) return;

        setStatus("saving");

        // Filter data based on selections
        // Data is already filtered by ResumeReview if passed, or we use it as is
        // If we are using the old selection logic (which we are replacing), we would filter here.
        // But since ResumeReview returns the final filtered data, we can just use 'data'.
        const filteredData = data;

        try {
            const res = await fetch("/api/update-portfolio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filteredData),
            });

            if (!res.ok) throw new Error("Update failed");

            setStatus("success");
            setStep("success");
            setMessage("Portfolio updated successfully! Redirecting...");

            setTimeout(() => {
                router.refresh();
                router.push("/");
            }, 2000);
        } catch (error) {
            console.error("Update error:", error);
            setStatus("error");
            setMessage("Failed to update portfolio. Please try again.");
        }
    };

    const renderUploadStep = () => (
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
                <p className="text-gray-500">Upload your resume to automatically update your portfolio.</p>
            </div>

            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-blue-500 transition-colors bg-gray-50/50">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center pointer-events-none">
                    {file ? <FileText size={32} /> : <Upload size={32} />}
                </div>
                <div className="text-center pointer-events-none">
                    {file ? (
                        <p className="font-medium text-gray-900">{file.name}</p>
                    ) : (
                        <>
                            <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500 mt-1">PDF or DOCX (Max 5MB)</p>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>

            {status === "error" && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{message}</p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || status === "uploading"}
                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
                {status === "uploading" ? (
                    "Processing..."
                ) : (
                    <>
                        <Eye size={20} />
                        Parse & Review
                    </>
                )}
            </button>
        </div>
    );

    const renderReviewStep = () => {
        if (!parsedData) return null;

        return (
            <ResumeReview
                initialData={parsedData}
                onSave={(finalData) => {
                    // Update the parsed data with the edited/filtered version
                    setParsedData(finalData);
                    // Trigger the final submit logic immediately with this new data
                    // We need to slightly modify handleFinalSubmit to accept data or use state
                    // For now, let's update state and call a modified submit
                    handleFinalSubmit(finalData);
                }}
                onCancel={() => {
                    setStep("upload");
                    setStatus("idle");
                    setParsedData(null);
                    setFile(null);
                }}
            />
        );
    };

    const renderSuccessStep = () => (
        <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Success!</h1>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Login onLogin={() => setIsAuthenticated(true)} />
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                {step === "upload" && renderUploadStep()}
                {step === "review" && renderReviewStep()}
                {step === "success" && renderSuccessStep()}
            </div>
            {currentData && <EditButton portfolioId={(currentData as any)._id || "default"} />}
            <ThemeSwitcher />
        </>
    );
}
