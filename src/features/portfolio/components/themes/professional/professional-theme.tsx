import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Github } from "lucide-react";

export function ProfessionalTheme({ data }: { data: PortfolioData }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Header / Banner */}
            <header className="bg-slate-900 text-white py-16">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-2">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-2"
                        >
                            {data.personalInfo.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-300 font-light"
                        >
                            {data.personalInfo.title}
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col gap-2 text-slate-300 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <a href={`mailto:${data.personalInfo.email}`} className="hover:text-white">
                                {data.personalInfo.email}
                            </a>
                        </div>
                        {/* Add placeholders for location/socials if not in data, or use static for design */}
                        <div className="flex items-center gap-2">
                            <MapPin size={16} />
                            <span>San Francisco, CA</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Left Column: Skills & Contact */}
                <aside className="space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                            Skills
                        </h2>
                        <div className="space-y-6">
                            {data.skills.map((cat, index) => (
                                <div key={index}>
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{cat.category}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.items.map((skill, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-md font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
                            Summary
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {data.personalInfo.bio}
                        </p>
                    </section>
                </aside>

                {/* Right Column: Experience & Projects */}
                <div className="md:col-span-2 space-y-12">
                    {/* Experience */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-600 rounded-sm"></span>
                            Professional Experience
                        </h2>
                        <div className="space-y-8">
                            {data.experience.map((exp, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative pl-4 border-l-2 border-slate-200"
                                >
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-blue-600 rounded-full" />
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                                        <h3 className="text-xl font-bold text-slate-800">
                                            {exp.company}
                                        </h3>
                                        <span className="text-sm text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                                            {exp.date}
                                        </span>
                                    </div>
                                    <p className="text-blue-700 font-medium mb-2">{exp.role}</p>
                                    <p className="text-gray-600 leading-relaxed">
                                        {exp.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Projects */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-600 rounded-sm"></span>
                            Key Projects
                        </h2>
                        <div className="grid grid-cols-1 gap-6">
                            {data.projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-bold text-slate-800">
                                            {project.title}
                                        </h3>
                                        <div className="flex gap-3">
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors"
                                                >
                                                    <Github size={14} />
                                                    Code
                                                </a>
                                            )}
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                                >
                                                    View Live
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {project.techStack.map((tech, i) => (
                                            <span
                                                key={i}
                                                className="text-xs text-slate-500 border border-slate-200 px-2 py-0.5 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    {project.bullets && project.bullets.length > 0 && (
                                        <ul className="mt-4 space-y-2">
                                            {project.bullets.map((bullet, i) => (
                                                <li key={i} className="text-slate-600 text-sm leading-relaxed flex items-start gap-2">
                                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                                    <span>{bullet}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Custom Sections */}
                    {data.customSections && data.customSections.length > 0 && (
                        <div className="space-y-12">
                            {data.customSections.map((section, index) => (
                                <section key={index}>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="w-2 h-8 bg-blue-600 rounded-sm"></span>
                                        {section.title}
                                    </h2>
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                        <ul className="space-y-3">
                                            {section.items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                                                    <span className="mt-2 w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
