"use client";

import { Users, MessageCircle, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 1.2 + i * 0.3,
            duration: 0.7,
            type: "spring",
            stiffness: 80,
            damping: 10,
        },
    }),
};

const Features = () => {
    return (
        <section className="flex flex-wrap justify-center gap-4 mb-8">
            {[
                { icon: Edit3, label: "Create Posts" },
                { icon: Users, label: "Make Connections" },
                { icon: MessageCircle, label: "Real-time Chats" },
            ].map((feature, i) => (
                <motion.div
                    key={feature.label}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                >
                    <Card className="w-[160px] hover:bg-blue-100">
                        <CardContent className="flex flex-col items-center p-4">
                            <feature.icon className="text-blue-600 mb-2" size={28} />
                            <p className="text-sm font-semibold text-gray-700">{feature.label}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </section>
    );
};

export default Features;
