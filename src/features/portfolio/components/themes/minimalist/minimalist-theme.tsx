import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";

export function MinimalistTheme({ data }: { data: PortfolioData }) {
    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <main className="max-w-3xl mx-auto px-6 py-20 space-y-24">
                {/* Header */}
                <section className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-6xl font-bold tracking-tighter mb-4">
                            {data.personalInfo.name}
                        </h1>
                        <p className="text-xl text-gray-600 font-light">
                            {data.personalInfo.title}
                        </p>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-lg leading-relaxed max-w-2xl"
                    >
                        {data.personalInfo.bio}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4 text-sm uppercase tracking-widest"
                    >
                        <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">
                            Email
                        </a>
                        {/* Add more social links if available in data */}
                    </motion.div>
                </section>

                {/* Experience */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-12 border-b border-black pb-4">
                        Experience
                    </h2>
                    <div className="space-y-12">
                        {data.experience.map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                            >
                                <div className="text-sm text-gray-500 font-mono">{exp.date}</div>
                                <div className="md:col-span-3 space-y-2">
                                    <h3 className="text-xl font-medium">{exp.company}</h3>
                                    <p className="text-gray-600 italic">{exp.role}</p>
                                    <p className="text-gray-800 leading-relaxed">
                                        {exp.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Projects */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-12 border-b border-black pb-4">
                        Selected Projects
                    </h2>
                    <div className="grid grid-cols-1 gap-12">
                        {data.projects.map((project, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-2xl font-medium group-hover:underline decoration-1 underline-offset-4">
                                        {project.title}
                                    </h3>
                                    <div className="flex gap-4">
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-400 group-hover:text-black transition-colors"
                                            >
                                                Code ↗
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-gray-400 group-hover:text-black transition-colors"
                                            >
                                                Live ↗
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {project.techStack.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="text-xs border border-gray-200 px-2 py-1 rounded-full text-gray-600"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                {project.bullets && project.bullets.length > 0 && (
                                    <ul className="mt-4 space-y-2">
                                        {project.bullets.map((bullet, i) => (
                                            <li key={i} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                                                <span className="mt-2 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Skills */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-black pb-4">
                        Skills
                    </h2>
                    <div className="space-y-8">
                        {data.skills.map((cat, index) => (
                            <div key={index}>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">{cat.category}</h3>
                                <div className="flex flex-wrap gap-x-8 gap-y-4">
                                    {cat.items.map((skill, i) => (
                                        <span key={i} className="text-lg text-gray-800">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Custom Sections */}
                {data.customSections && data.customSections.length > 0 && (
                    <section>
                        {data.customSections.map((section, index) => (
                            <div key={index} className="mb-12 last:mb-0">
                                <h2 className="text-sm font-bold uppercase tracking-widest mb-8 border-b border-black pb-4">
                                    {section.title}
                                </h2>
                                <ul className="space-y-4">
                                    {section.items.map((item, i) => (
                                        <li key={i} className="text-lg text-gray-800 leading-relaxed flex items-start gap-3">
                                            <span className="mt-2.5 w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}
