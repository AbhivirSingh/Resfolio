import React from 'react';
import { Mail } from 'lucide-react';
import { motion } from "framer-motion";
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
import { PortfolioData } from "@/types/portfolio";

interface FooterProps {
    data: PortfolioData;
}

const Footer = ({ data }: FooterProps) => {
    return (
        <motion.footer
            id="contact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="py-20 border-t border-white/10 bg-black relative overflow-hidden"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <RevealOnScroll>
                    <h2 className="text-4xl font-bold mb-8 text-white">Let&apos;s Connect</h2>
                    <p className="text-gray-400 mb-12 max-w-xl mx-auto">
                        I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
                        <a href={`mailto:${data.personalInfo.email}`} className="flex items-center gap-3 text-gray-300 hover:text-neon-blue transition-colors px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:border-neon-blue/50">
                            <Mail size={20} />
                            <span>{data.personalInfo.email}</span>
                        </a>
                    </div>
                </RevealOnScroll>
            </div>
        </motion.footer>
    );
};

export default Footer;
