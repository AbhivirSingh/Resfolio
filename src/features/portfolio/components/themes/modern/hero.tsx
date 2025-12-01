import React from 'react';
import TiltCard from '@/components/ui/tilt-card';
import { Download, Mail, Github, Linkedin, ExternalLink, Code, Terminal, Cpu, Globe, Database } from 'lucide-react';
import { PortfolioData } from "@/types/portfolio";

interface HeroProps {
    personalInfo: PortfolioData["personalInfo"];
    socialProfiles?: PortfolioData["socialProfiles"];
}

const Hero: React.FC<HeroProps> = ({ personalInfo, socialProfiles }) => {
    return (
        <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-blue/20 rounded-full blur-[120px] animate-pulse-glow delay-1000" />
            </div>

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-6 z-10 order-2 lg:order-1">
                    <div className="inline-block px-3 py-1 rounded-full border border-neon-green/30 bg-neon-green/10 text-neon-green text-sm font-semibold tracking-wider mb-2">
                        AVAILABLE FOR HIRE
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        Hi, I'm <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">
                            {personalInfo.name}
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light">
                        {personalInfo.title}
                    </p>
                    <p className="text-gray-400 max-w-lg leading-relaxed">
                        {personalInfo.bio}
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <a href={`mailto:${personalInfo.email}`} className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-neon-blue transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]">
                            <Mail className="w-5 h-5" />
                            Contact Me
                        </a>
                        <a
                            href="https://drive.google.com/file/d/1BqzP6daV1_Q5ZwGz4p_-XzVPvaKEF2fC/view?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
                        >
                            <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            Download Resume
                        </a>
                    </div>

                    <div className="flex gap-6 pt-8 text-gray-400 flex-wrap">
                        {socialProfiles?.github && (
                            <a href={socialProfiles.github} target="_blank" rel="noopener noreferrer" className="hover:text-neon-white transition-colors hover:scale-110 transform duration-200" title="GitHub">
                                <Github className="w-6 h-6" />
                            </a>
                        )}
                        {socialProfiles?.linkedin && (
                            <a href={socialProfiles.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-neon-blue transition-colors hover:scale-110 transform duration-200" title="LinkedIn">
                                <Linkedin className="w-6 h-6" />
                            </a>
                        )}
                        {socialProfiles?.leetcode && (
                            <a href={socialProfiles.leetcode} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors hover:scale-110 transform duration-200" title="LeetCode">
                                <Code className="w-6 h-6" />
                            </a>
                        )}
                        {socialProfiles?.hackerrank && (
                            <a href={socialProfiles.hackerrank} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors hover:scale-110 transform duration-200" title="HackerRank">
                                <Terminal className="w-6 h-6" />
                            </a>
                        )}
                        {socialProfiles?.geeksforgeeks && (
                            <a href={socialProfiles.geeksforgeeks} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors hover:scale-110 transform duration-200" title="GeeksforGeeks">
                                <Database className="w-6 h-6" />
                            </a>
                        )}
                        {socialProfiles?.codeforces && (
                            <a href={socialProfiles.codeforces} target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors hover:scale-110 transform duration-200" title="Codeforces">
                                <Cpu className="w-6 h-6" />
                            </a>
                        )}
                        {socialProfiles?.codechef && (
                            <a href={socialProfiles.codechef} target="_blank" rel="noopener noreferrer" className="hover:text-orange-900 transition-colors hover:scale-110 transform duration-200" title="CodeChef">
                                <Globe className="w-6 h-6" />
                            </a>
                        )}
                        {socialProfiles?.kaggle && (
                            <a href={socialProfiles.kaggle} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors hover:scale-110 transform duration-200" title="Kaggle">
                                <Database className="w-6 h-6" />
                            </a>
                        )}
                    </div>
                </div>

                {/* 3D Visual */}
                <div className="relative z-10 flex justify-center order-1 lg:order-2">
                    <TiltCard className="w-[300px] h-[400px] md:w-[350px] md:h-[450px]" scale={1.1}>
                        <div className="absolute inset-0 z-0" />

                        {/* Decorative Elements inside card */}
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-[100px] blur-2xl pointer-events-none" />

                        <div className="relative h-full w-full flex flex-col items-center justify-end pb-0 overflow-hidden">
                            {/* 3D Pop Out Simulation */}
                            {/* Since we are inside overflow-hidden for the card border, we simulate depth by internal scaling and layering */}

                            {/* Circle Background */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-neon-blue/20 rounded-full" />

                            {/* Image Placeholder */}
                            <img
                                src="profile_photo.jpeg"
                                alt="profile_photo"
                                className="relative z-10 w-full h-full object-cover object-center scale-110 translate-y-4 hover:scale-115 transition-transform duration-700 ease-out"
                            />
                        </div>
                    </TiltCard>
                </div>
            </div>
        </section>
    );
};

export default Hero;