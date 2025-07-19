'use client'

import { motion } from 'framer-motion'

const sentence = "Welcome to LinkUp"

const Hero = () => {
    const container = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    const letter = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    }

    return (
        <section>
            <motion.h1
                className="text-4xl md:text-5xl font-bold text-green-600 mb-3 flex"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                {sentence.split("").map((char, index) => (
                    <motion.span key={index} variants={letter}>
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </motion.h1>

            <motion.p
                className="text-gray-600 max-w-xl mb-8 text-base md:text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25 }}
            >
                Connect with people, share moments, and grow your social circle — all in one place with LinkUp.
            </motion.p>
        </section>
    )
}

export default Hero
