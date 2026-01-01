
import React from 'react';
import { useNode, useEditor } from '@craftjs/core';
import TiltCard from '@/components/ui/tilt-card';
import { Download, Mail, Github, Linkedin } from 'lucide-react';
import { PortfolioData } from "@/types/portfolio";
import { COMPONENT_NAMES } from '@/features/admin/utils/helpers';
import { InlineEdit } from '../ui/inline-edit';
import { LinkPopover } from '../ui/link-popover';
import { UploadThingButton } from '../../upload/upload-thing-button';

interface EditableHeroProps {
    personalInfo: PortfolioData["personalInfo"];
    socialProfiles?: PortfolioData["socialProfiles"];
}

const CustomIcon = ({ path, className }: { path: React.ReactNode; className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        color="currentColor"
        className={className}
    >
        {path}
    </svg>
);

export const EditableHero = ({ personalInfo, socialProfiles }: EditableHeroProps) => {
    const { connectors: { connect, drag }, actions: { setProp } } = useNode();
    const { enabled } = useEditor((state) => ({ enabled: state.options.enabled }));

    const handleUpdate = (field: keyof typeof personalInfo, value: string) => {
        setProp((props: any) => props.personalInfo[field] = value);
    };

    const handleSocialUpdate = (field: keyof NonNullable<PortfolioData["socialProfiles"]>, value: string) => {
        setProp((props: any) => {
            if (!props.socialProfiles) props.socialProfiles = {};
            props.socialProfiles[field] = value;
        });
    };

    return (
        <div
            ref={ref => { if (ref) connect(drag(ref)); }}
            className={`relative group min-h-[500px] border border-transparent ${enabled ? 'hover:border-dashed hover:border-blue-500/30' : ''} transition-all`}
        >
            {/* Label */}
            {enabled && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 z-50 pointer-events-none rounded-br">
                    Hero Section
                </div>
            )}

            <section id="hero" className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 relative overflow-hidden bg-[#050505]">
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
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple inline-block">
                                <InlineEdit
                                    value={personalInfo.name}
                                    onChange={(v) => handleUpdate('name', v)}
                                    className="min-w-[200px]"
                                    placeholder="Your Name"
                                />
                            </span>
                        </h1>
                        <div className="text-xl md:text-2xl text-gray-300 font-light">
                            <InlineEdit
                                value={personalInfo.title}
                                onChange={(v) => handleUpdate('title', v)}
                                placeholder="Your Title (e.g. Software Engineer)"
                            />
                        </div>
                        <div className="text-gray-400 max-w-lg leading-relaxed">
                            <InlineEdit
                                value={personalInfo.bio}
                                onChange={(v) => handleUpdate('bio', v)}
                                multiline
                                placeholder="Write a short bio about yourself..."
                            />
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="group flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-neon-blue transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] cursor-pointer">
                                <Mail className="w-5 h-5" />
                                <InlineEdit
                                    value={personalInfo.email}
                                    onChange={(v) => handleUpdate('email', v)}
                                    className="min-w-[150px] bg-transparent border-none hover:bg-transparent"
                                    placeholder="email@example.com"
                                />
                            </div>

                            {enabled ? (
                                <div className="flex items-center">
                                    <UploadThingButton
                                        endpoint="resumePdf"
                                        field="personalInfo.resume"
                                        onUploadComplete={(url) => handleUpdate('resume', url)}
                                        customClass="group flex items-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <a
                                    href={personalInfo.resume || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`group flex items-center gap-2 px-6 py-3 bg-transparent border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-colors ${!personalInfo.resume ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <Download className="w-5 h-5" />
                                    Download Resume
                                </a>
                            )}
                        </div>

                        <div className="flex gap-6 pt-8 text-gray-400 flex-wrap">
                            <LinkPopover value={socialProfiles?.github} onChange={(v) => handleSocialUpdate('github', v)} placeholder="GitHub URL">
                                <Github className="w-6 h-6 hover:text-white cursor-pointer" />
                            </LinkPopover>

                            <LinkPopover value={socialProfiles?.linkedin} onChange={(v) => handleSocialUpdate('linkedin', v)} placeholder="LinkedIn URL">
                                <Linkedin className="w-6 h-6 hover:text-blue-500 cursor-pointer" />
                            </LinkPopover>

                            <LinkPopover value={socialProfiles?.leetcode} onChange={(v) => handleSocialUpdate('leetcode', v)} placeholder="LeetCode URL">
                                <CustomIcon
                                    path={<><path fill="currentColor" className="group-hover/icon:fill-[#B3B1B0] transition-colors" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z" /><path fill="currentColor" className="group-hover/icon:fill-[#E7A41F] transition-colors" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z" /><path fill="currentColor" className="group-hover/icon:fill-[#FFF] transition-colors" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z" /></>}
                                    className="w-6 h-6 text-gray-400 group/icon cursor-pointer transition-colors"
                                />
                            </LinkPopover>

                            <LinkPopover value={socialProfiles?.hackerrank} onChange={(v) => handleSocialUpdate('hackerrank', v)} placeholder="HackerRank URL">
                                <CustomIcon
                                    path={<path fill="currentColor" className="group-hover/icon:fill-[#2FC363] transition-colors" d="M11.999 0C10.626 0 2.195 4.818 1.513 6c-.682 1.182-.686 10.819 0 12 .686 1.181 9.115 6 10.486 6 1.371 0 9.8-4.824 10.487-6 .686-1.176.686-10.83 0-12-.687-1.17-9.115-6-10.487-6zm2.841 19.415v.002c-.188 0-1.939-1.677-1.8-1.814.041-.041.296-.069.832-.086 0-1.23.028-3.215.045-4.046.002-.095-.021-.161-.021-.274h-3.787c0 .333-.022 1.697.065 3.416.011.213-.075.279-.272.278-.48-.001-.96-.005-1.44-.004-.194 0-.278-.072-.272-.286.043-1.567.14-3.938-.007-9.969v-.149c-.46-.016-.778-.045-.82-.086C7.225 6.26 9 4.583 9.187 4.583c.187 0 1.951 1.677 1.813 1.814-.041.041-.374.07-.795.086v.148c-.114 1.207-.096 3.731-.124 4.94h3.803c0-.213.018-1.628-.057-3.921-.005-.159.046-.242.199-.244.525-.004 1.049-.006 1.575-.003.164.001.216.081.213.252-.173 8.967-.031 8.341-.031 9.86.42.016.797.045.838.086.136.136-1.593 1.814-1.781 1.814z" />}
                                    className="w-6 h-6 text-gray-400 group/icon cursor-pointer transition-colors"
                                />
                            </LinkPopover>

                            <LinkPopover value={socialProfiles?.geeksforgeeks} onChange={(v) => handleSocialUpdate('geeksforgeeks', v)} placeholder="GeeksforGeeks URL">
                                <CustomIcon
                                    path={<path fill="currentColor" className="group-hover/icon:fill-[#43a047] transition-colors" d="M14.5175 12A8 8 0 0 1 14.5 11.5c0-3.04 1.43-5 3.5-5 1.7055 0 3.165 1.331 3.5 3.5h1l.0005-4.5H21.5s-.2665.753-.5.58c-.9495-.533-1.8615-.566-3.012-.566C15.088 5.514 12.5 8.13 12.5 11.46c0 .182.0105.3615.0245.54H11.475c.0145-.1785.025-.358.025-.54 0-3.33-2.588-5.946-5.488-5.946-1.1505 0-2.0625.0325-3.012.566-.2335.173-.5-.58-.5-.58H1.4995L1.5 10h1c.335-2.169 1.7945-3.5 3.5-3.5 2.07 0 3.5 1.96 3.5 5q-.001.254-.0175.5H0v1h.5045c.5415 0 .9885.4305.9995.9715.019.923.108 2.0315.496 2.5285.6345.8125 1.5 1.5 4 1.5 2.511 0 4.96-2.2635 5.5-5h1c.54 2.7365 2.989 5 5.5 5 2.5 0 3.3655-.6875 4-1.5.388-.497.477-1.6055.496-2.5285A.997.997 0 0 1 23.4955 13H24v-1zm-8.779 4.865C4.936 16.865 3.661 16.862 3.5 16c-.0545-.2915-.0455-1.2635-.0285-2.023a1 1 0 0 1 1-.977H9.5c-.397 2.3905-1.9925 3.865-3.7615 3.865M20.5 16c-.161.862-1.436.865-2.2385.865-1.7685 0-3.3645-1.4745-3.7615-3.865h5.0285a1 1 0 0 1 1 .977c.017.7595.026 1.7315-.0285 2.023" />}
                                    className="w-6 h-6 text-gray-400 group/icon cursor-pointer transition-colors"
                                />
                            </LinkPopover>

                            <LinkPopover value={socialProfiles?.codeforces} onChange={(v) => handleSocialUpdate('codeforces', v)} placeholder="Codeforces URL">
                                <CustomIcon
                                    path={<><path fill="currentColor" className="group-hover/icon:fill-[#F44336] transition-colors" d="M24 19.5V12a1.5 1.5 0 0 0-1.5-1.5h-3A1.5 1.5 0 0 0 18 12v7.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5z" /><path fill="currentColor" className="group-hover/icon:fill-[#2196F3] transition-colors" d="M13.5 21a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 13.5 3h-3C9.673 3 9 3.672 9 4.5v15c0 .828.673 1.5 1.5 1.5h3z" /><path fill="currentColor" className="group-hover/icon:fill-[#FFC107] transition-colors" d="M0 19.5c0 .828.673 1.5 1.5 1.5h3A1.5 1.5 0 0 0 6 19.5V9a1.5 1.5 0 0 0-1.5-1.5h-3C.673 7.5 0 8.172 0 9v10.5z" /></>}
                                    className="w-6 h-6 text-gray-400 group/icon cursor-pointer transition-colors"
                                />
                            </LinkPopover>

                            <LinkPopover value={socialProfiles?.codechef} onChange={(v) => handleSocialUpdate('codechef', v)} placeholder="CodeChef URL">
                                <CustomIcon
                                    path={<path className="group-hover/icon:fill-[#4a2f1e] transition-colors" d="M11.362.915q-.57.009-1.151.091a6.4 6.4 0 0 0-1.61.582c-.62.282-1.26.572-1.839.613l-.086.015A3.33 3.33 0 0 0 4.719 3.61l-.072.105q-.022.033-.04.07a4.12 4.12 0 0 0-.288 2.705c.137.448.301.88.46 1.298l.048.126a12.2 12.2 0 0 1 .8 2.711q.012.071.044.135c.158.313.281.642.371.997l.08.27c.51-.448 1.123-.788 1.796-1.04-.418-1.084-.68-2.334-.91-3.456-.29-1.425-.54-2.642-1.019-3.025a.6.6 0 0 1-.11-.261.9.9 0 0 1 .107-.525c.083-.178.21-.334.37-.449.1-.07.217-.113.338-.13v.024a.8.8 0 0 0-.336.13q-.159.199-.283.422c-.235.471.262.449.448.706.485.39.525 1.672.819 3.103.227 1.111.361 2.349.68 3.424a9 9 0 0 1 1.152-.32c-.525-1.212-.653-2.62-.765-3.926-.126-1.4-.239-2.685-.821-3.474a.55.55 0 0 1-.138-.403.26.26 0 0 1 .106-.17.43.43 0 0 1 .218-.08 1.07 1.07 0 0 1 .705.195l-.01.011.01.007h-.016l.006-.007a.59.59 0 0 0-.515-.113.43.43 0 0 0-.202.073.23.23 0 0 0-.1.154c0 .095-.073.11 0 .286.588.787 1.049 2.116 1.16 3.518.115 1.302.039 2.705.45 3.913q.67-.13 1.365-.176a24.3 24.3 0 0 1-.99-5.4 7.2 7.2 0 0 1 .179-2.237c.17-.582.469-.965.933-1.033q.256-.033.506.036v.024a1.2 1.2 0 0 0-.504.017c-.388.089-.34.33-.595.877a5.8 5.8 0 0 0-.188 2.168c.259 1.695.565 3.866.854 5.534a13 13 0 0 1 1.445.004c-.378-2.803-.703-6.066.917-8.456h.022c-.71 1.895-.808 5.504-.892 6.668-.028.39 0 1.117.032 1.792.682.043 1.341.134 1.948.26a23 23 0 0 1 .25-3.571 13.3 13.3 0 0 1 1.73-4.82v.023c-.257 1.95-1.237 2.862-1.601 4.791-.11 1.138-.223 2.4-.3 3.596.353.077.69.163 1 .26.275.088.564.197.843.324.184-3.058 1.754-6.494 2.638-6.68-.74 2.276-1.604 4.505-2.489 6.753a4 4 0 0 1 .648.397c.391-.716.962-1.412 1.518-2.089 1.02-1.24 2.075-2.521 1.984-3.954a.5.5 0 0 0-.05-.187 10 10 0 0 0-.527-.907l-.04-.065a5 5 0 0 0-.261-.376l-.041-.055a10 10 0 0 0-.23-.3l-.14-.161q-.13-.15-.262-.288l-.116-.118a7 7 0 0 0-.306-.286l-.074-.064c-1.277-1.089-2.587-1.375-3.385-1.55l-.446-.1c-1.04-.2-2.138-.37-3.275-.35m.356 10.466c-2.042-.029-4.154.425-5.257 1.664l.454 1.3c.045.13.144.233.271.285a.48.48 0 0 0 .393-.011c1.259-.612 4.206-2.043 8.273.5a.48.48 0 0 0 .445.033.48.48 0 0 0 .28-.347c.1-.501.134-1.305.102-1.959l.01-.042c-.094-.206-.564-.585-1.607-.917-.94-.298-2.14-.49-3.364-.506m-3.05 4.161-.218.147q.14.232.352.403c.11.07.24.104.37.097a.7.7 0 0 0 .197-.028l.725-.262a.4.4 0 0 1 .155-.03.37.37 0 0 1 .226.061q.138.114.235.262l.206-.115v-.006a1.5 1.5 0 0 0-.33-.363.6.6 0 0 0-.353-.108.3.3 0 0 0-.124.023l-.785.263a.5.5 0 0 1-.155.02.4.4 0 0 1-.263-.073 1.1 1.1 0 0 1-.238-.29m8.06.523a.28.28 0 0 0-.192.102.3.3 0 0 0-.102.19.1.1 0 0 0 0 .052c.17.178.385.304.624.363q.359.111.71.21c.237.079.437.238.567.452q.003.014 0 .028-.002.066-.314.223c-.105.06-.262.193-.525.392a3.4 3.4 0 0 1-.524.354 1.06 1.06 0 0 0-.401.315q-.004.003-.006.007a.23.23 0 0 0 .022.326.26.26 0 0 0 .187.073.3.3 0 0 0 .141-.036q.507-.32.973-.7a12 12 0 0 1 .98-.731q.282-.174.28-.36a.26.26 0 0 0-.12-.201 3.8 3.8 0 0 0-1.398-.794l-.38-.165a1.2 1.2 0 0 0-.407-.1.5.5 0 0 0-.115 0m-10.456.026a4.8 4.8 0 0 1-1.09.613q-.58.24-1.088.609a.8.8 0 0 0-.262.574.26.26 0 0 0 .158.183q.107.037.215.08a21 21 0 0 1 2.019.981q.124.091.235.199.072.032.152.032a.55.55 0 0 0 .354-.126.34.34 0 0 0 .139-.316.22.22 0 0 0-.134-.209l-1.085-.477a10 10 0 0 1-1.049-.524 1.9 1.9 0 0 1 .918-.629 2.7 2.7 0 0 0 .972-.553.2.2 0 0 0 .063-.149.26.26 0 0 0-.102-.202.42.42 0 0 0-.262-.086zm7.586.742a.8.8 0 0 0-.574.212.72.72 0 0 0-.197.668c.024.228.115.445.263.622a.65.65 0 0 0 .523.261.8.8 0 0 0 .386-.104.86.86 0 0 0 .353-.81c-.013-.354-.096-.593-.261-.708a.85.85 0 0 0-.493-.141m-4.068.017a.8.8 0 0 0-.574.21.72.72 0 0 0-.2.669c.026.228.117.444.263.621a.65.65 0 0 0 .524.262.8.8 0 0 0 .385-.104q.353-.21.352-.81a.85.85 0 0 0-.257-.708.85.85 0 0 0-.493-.14m-.01.564a.263.263 0 1 1 0 .525.263.263 0 0 1 0-.525m3.994.03a.262.262 0 1 1 .002.524.262.262 0 0 1-.002-.523m-2.54 1.84-.012.02v.022q.055.15.136.288.075.133.184.239.098.102.225.165a.8.8 0 0 0 .263.057l.01.011q.11 0 .212-.039.097-.04.182-.101.082-.065.15-.142.066-.073.115-.157a1 1 0 0 0 .084-.155q.028-.058.045-.12v-.024l-.013-.023a1.2 1.2 0 0 1-.251.275.8.8 0 0 1-.263.16.9.9 0 0 1-.306.05 1 1 0 0 1-.263-.037.7.7 0 0 1-.201-.105 1 1 0 0 1-.165-.167 1.4 1.4 0 0 1-.132-.217m-.695 1.006c-1.048.055-1.659 1.401-3.122.159-.398 2.385 2.517 2.622 3.715 1.544.828-.74.595-1.77-.593-1.703m2.402 0c-1.001.061-1.157 1.01-.38 1.704 1.198 1.076 4.111.84 3.713-1.545-1.463 1.242-2.073-.105-3.122-.16a2 2 0 0 0-.211 0" fill="currentColor" />}
                                    className="w-6 h-6 text-gray-400 group/icon cursor-pointer transition-colors"
                                />
                            </LinkPopover>

                            <LinkPopover value={socialProfiles?.kaggle} onChange={(v) => handleSocialUpdate('kaggle', v)} placeholder="Kaggle URL">
                                <CustomIcon
                                    path={<><path fill="currentColor" className="group-hover/icon:fill-[#35b5e2] transition-colors" d="M7.998 0h-2.4q-.349 0-.348.352v23.295q0 .352.348.352h2.401q.348 0 .348-.352v-5.11l1.427-1.374 5.115 6.59q.207.247.485.247h3.097q.242 0 .278-.141l-.07-.353-6.749-8.494 6.471-6.343c.122-.124.078-.493-.244-.493h-3.202q-.242 0-.487.247l-6.123 6.273V.352Q8.348 0 7.998 0" /><path fill="currentColor" className="group-hover/icon:fill-[#2e9ec5] transition-colors" d="M7.998 0h-2.4q-.349 0-.348.352v23.295q0 .352.348.352h2.401q.348 0 .348-.352v-5.11l1.425-1.372v-3.929l-1.425 1.46V.352Q8.347 0 7.998 0" /></>}
                                    className="w-6 h-6 text-gray-400 group/icon cursor-pointer transition-colors"
                                />
                            </LinkPopover>
                        </div>
                    </div>

                    {/* 3D Visual */}
                    <div className="relative z-10 flex justify-center order-1 lg:order-2">
                        <TiltCard className="w-[300px] h-[400px] md:w-[350px] md:h-[450px]" scale={1.1} disabled>
                            <div className="relative h-full w-full flex flex-col items-center justify-end pb-0 overflow-hidden">
                                <img
                                    src={personalInfo.image || "https://placehold.co/400x600/1a1a1a/ffffff?text=No+Image"}
                                    alt="profile_photo"
                                    className="relative z-10 w-full h-full object-cover object-center scale-110 translate-y-4 hover:scale-115 transition-transform duration-700 ease-out"
                                />
                                {/* Image URL Edit Overlay */}
                                {enabled && (
                                    <div className="absolute bottom-0 w-full bg-black/80 p-2 z-20 flex flex-col items-center">
                                        <p className="text-xs text-gray-400 mb-1">Upload Photo</p>
                                        <UploadThingButton
                                            endpoint="profileImage"
                                            field="personalInfo.image"
                                            onUploadComplete={(url) => handleUpdate('image', url)}
                                        />
                                    </div>
                                )}
                            </div>
                        </TiltCard>
                    </div>
                </div>
            </section>
        </div>
    );
};

const HeroSettings = () => {
    return <div className="p-4 text-sm text-gray-500 text-center">Edit directly on canvas</div>;
};

EditableHero.craft = {
    displayName: COMPONENT_NAMES.HERO,
    related: {
        settings: HeroSettings
    }
};
