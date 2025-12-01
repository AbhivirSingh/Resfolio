import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";

export function CreativeTheme({ data }: { data: PortfolioData }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-sans p-8">
            <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-4 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl flex flex-col justify-between"
                >
                    <div>
                        <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                            {data.personalInfo.name}
                        </h1>
                        <p className="text-xl text-purple-100 mb-6">{data.personalInfo.title}</p>
                        <p className="text-white/80 leading-relaxed mb-8">
                            {data.personalInfo.bio}
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        {data.skills.map((cat, index) => (
                            <div key={index}>
                                <h3 className="text-sm font-bold text-purple-200 mb-2 uppercase tracking-wider">{cat.category}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {cat.items.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Projects Grid */}
                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg hover:bg-white/20 transition-all cursor-pointer group"
                        >
                            <div className="h-full flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {project.techStack.map((tech, i) => (
                                            <span key={i} className="text-xs text-purple-200">
                                                #{tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors mr-4"
                                    >
                                        View Code <span className="ml-1">→</span>
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors"
                                    >
                                        Live Demo <span className="ml-1">→</span>
                                    </a>
                                )}
                                {project.bullets && project.bullets.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {project.bullets.map((bullet, i) => (
                                            <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Experience Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="md:col-span-12 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl mt-6"
                >
                    <h2 className="text-2xl font-bold mb-6">Experience Journey</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {data.experience.map((exp, index) => (
                            <div key={index} className="relative pl-6 border-l-2 border-white/30">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-purple-400 border-4 border-purple-900" />
                                <span className="text-sm text-purple-200 block mb-1">
                                    {exp.date}
                                </span>
                                <h3 className="text-xl font-bold">{exp.company}</h3>
                                <p className="text-white/80 italic mb-2">{exp.role}</p>
                                <p className="text-white/70 text-sm">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Custom Sections */}
                {data.customSections && data.customSections.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="md:col-span-12 bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-xl mt-6"
                    >
                        {data.customSections.map((section, index) => (
                            <div key={index} className="mb-8 last:mb-0">
                                <h2 className="text-2xl font-bold mb-6">{section.title}</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {section.items.map((item, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <p className="text-white/80">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
}
