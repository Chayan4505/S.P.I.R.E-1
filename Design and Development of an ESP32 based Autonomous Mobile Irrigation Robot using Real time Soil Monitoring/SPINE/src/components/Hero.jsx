import { useState, useEffect } from 'react';
import { ArrowRightIcon, PlayIcon, ZapIcon, CheckIcon, Bot } from 'lucide-react';
import { PrimaryButton, GhostButton } from './Buttons';
import { motion } from 'framer-motion';
import heroImage from "../assets/hero.jpg"
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import AddSpineModal from "./AddSpireModal";
import PairRobotModal from "../components/PairRobotModal";
import api from "../api/axios";

export default function Hero() {
    const { user } = useAuth();
    const [showAddSpine, setShowAddSpine] = useState(false);
    const [showPairRobot, setShowPairRobot] = useState(false);
    const [robots, setRobots] = useState([]);
    const [robotsLoading, setRobotsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            setRobots([]);
            setRobotsLoading(false);
            return;
        }
        const fetchRobots = async () => {
            try {
                const res = await api.get("/robot/");
                setRobots(res.data.robots || []);
            } catch (error) {
                console.error("Failed to fetch SPIRE robots:", error);
            } finally {
                setRobotsLoading(false);
            }
        };

        fetchRobots();
    }, [user]);

    const hasPairedRobot = robots.length > 0;

    const trustedLogosText = [
        'Precision Agriculture',
        'Internet of Things (IoT)',
        'Agricultural Robotics',
        'Multi-parameter Soil Sensing',
        'Georeferencing',
        'Autonomous Irrigation'
    ];

    return (
        <>
            <section id="home" className="relative z-10">
                <div className="max-w-6xl mx-auto px-4 min-h-screen max-md:w-screen max-md:overflow-hidden pt-22 md:pt-12 flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                        <div className="text-left">

                            <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-xl"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                Agricultural Robotics <br />
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-green-400 to-green-700">
                                    Intelligent robotics for precision agriculture
                                </span>
                            </motion.h1>

                            <motion.p className="text-gray-800 max-w-lg mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                            >
                                S.P.I.R.E. is an autonomous agricultural robot that monitors soil conditions in real time, navigates farmland, and delivers precise irrigation where it is needed.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row items-center gap-4 mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    type: "spring",
                                    stiffness: 250,
                                    damping: 70,
                                    mass: 1,
                                    delay: 0.3
                                }}
                            >
                                {!user ? (
                                    <>
                                        <Link to="/login" className="w-full sm:w-auto">
                                            <PrimaryButton className="max-sm:w-full py-3 px-7">
                                                Explore S.P.I.R.E.
                                                <ArrowRightIcon className="size-4" />
                                            </PrimaryButton>
                                        </Link>

                                        <GhostButton
                                            type="button"
                                            className="max-sm:w-full max-sm:justify-center py-3 px-5"
                                        >
                                            <PlayIcon className="size-4" />
                                            See How It Works
                                        </GhostButton>
                                    </>
                                ) : !hasPairedRobot ? (
                                    <>
                                        <PrimaryButton
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowAddSpine(true);
                                            }}
                                            className="max-sm:w-full py-3 px-7"
                                        >
                                            Add S.P.I.R.E.
                                            <ArrowRightIcon className="size-4" />
                                        </PrimaryButton>

                                        <GhostButton
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setShowPairRobot(true);
                                            }}
                                            className="max-sm:w-full max-sm:justify-center py-3 px-5"
                                        >
                                            <Bot className="size-4" />
                                            Pair a Robot
                                        </GhostButton>
                                    </>
                                ) : (
                                    <>
                                        <PrimaryButton
                                            type="button"
                                            onClick={() => navigate("/dashboard/latest-telemetry")}
                                            className="max-sm:w-full py-3 px-7"
                                        >
                                            Open Dashboard
                                            <ArrowRightIcon className="size-4" />
                                        </PrimaryButton>

                                        <GhostButton
                                            type="button"
                                            className="max-sm:w-full max-sm:justify-center py-3 px-5"
                                        >
                                            <PlayIcon className="size-4" />
                                            See How It Works
                                        </GhostButton>
                                    </>
                                )}
                            </motion.div>

                            <motion.div className="flex sm:inline-flex overflow-hidden items-center max-sm:justify-center text-sm text-gray-200 bg-white/5 rounded"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6.5 hover:bg-black/3 transition-colors">
                                    <ZapIcon className="size-4 text-green-500" />
                                    <div>
                                        <div className="text-black/80">Real-Time Soil Intelligence</div>
                                        <div className="text-xs text-gray-700">
                                            Multi-parameter soil monitoring
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block h-6 w-px bg-green-500/30" />

                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6.5 hover:bg-black/3 transition-colors">
                                    <CheckIcon className="size-4 text-green-500" />
                                    <div>
                                        <div className="text-black/80">Autonomous Irrigation</div>
                                        <div className="text-xs text-gray-700">
                                            Data-driven water delivery
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: modern mockup card */}
                        <motion.div className="mx-auto w-full max-w-lg"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.5 }}
                        >
                            <motion.div className="rounded-3xl overflow-hidden border border-white/6 shadow-2xl bg-linear-to-b from-black/50 to-transparent">
                                <div className="relative aspect-16/10 bg-gray-900">
                                    <img
                                        src={heroImage}
                                        alt="agency-work-preview"
                                        className="w-full h-full object-cover object-center"
                                    />

                                    <div className="absolute left-4 top-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-sm">
                                        Mobile • Web • AI
                                    </div>
                                </div>
                            </motion.div>

                            <div className="mt-4 flex gap-3 items-center justify-start">
                                <motion.div className="text-sm text-black ml-2 flex items-center gap-2"
                                    initial={{ y: 60, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                                >
                                    <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping duration-300" />

                                        <span className="relative inline-flex size-2 rounded-full bg-green-600" />
                                    </div>
                                    10+ deployed robots
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* LOGO MARQUEE */}
            <motion.section className="border-y border-white/6 bg-white/1 max-md:mt-10"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="w-full overflow-hidden py-6">
                        <div className="flex gap-14 items-center justify-center animate-marquee whitespace-nowrap">
                            {trustedLogosText.concat(trustedLogosText).map((logo, i) => (
                                <span
                                    key={i}
                                    className="mx-6 text-sm md:text-base font-semibold text-green-800/75 hover:text-green-800 tracking-wide transition-colors"
                                >
                                    {logo}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {showAddSpine && (
                <AddSpineModal
                    onClose={() => setShowAddSpine(false)}
                    onPairRobot={() => {
                        setShowAddSpine(false);
                        setShowPairRobot(true);
                    }}
                />
            )}

            {showPairRobot && (
                <PairRobotModal
                    onClose={() => setShowPairRobot(false)}
                />
            )}
        </>
    );
};