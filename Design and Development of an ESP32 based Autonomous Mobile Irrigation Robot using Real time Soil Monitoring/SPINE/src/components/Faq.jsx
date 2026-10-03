import { ChevronDownIcon } from 'lucide-react';
import Title from './Title';
import { faqData } from '../assets/Data';
import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function Faq() {
    const refs = useRef([]);
    return (
        <section id="faq" className="py-20 2xl:py-32">
            <div className="max-w-3xl mx-auto px-4">

                <Title
                    title="FAQ"
                    heading="Frequently asked questions"
                    description="Learn more about S.P.I.R.E., its autonomous capabilities, soil monitoring system, precision irrigation, and the technology behind the robot."
                />

                <div className="space-y-5">
                    {faqData.map((faq, i) => (
                        <motion.details
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            key={i}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-300");
                                }
                            }}
                            className="group bg-green-800/8 rounded-xl select-none"
                        >
                            <summary className="flex items-center justify-between p-4 cursor-pointer">
                                <h6 className="font-medium">{faq.question}</h6>
                                <ChevronDownIcon className="w-5 h-5 text-black group-open:rotate-180 transition-transform" />
                            </summary>
                            <p className="p-4 pt-0 text-sm text-gray-800 leading-relaxed">
                                {faq.answer}
                            </p>
                        </motion.details>
                    ))}
                </div>
            </div>
        </section>
    );
};