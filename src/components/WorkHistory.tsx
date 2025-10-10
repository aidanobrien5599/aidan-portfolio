"use client"

import { timeline } from "@/constants/timeline"
import type React from "react"
import { useRef } from "react"
import { Paragraph } from "./Paragraph"
import { Heading } from "./Heading"
import { IconCircleCheckFilled } from "@tabler/icons-react"
import { motion, useInView } from "framer-motion"

export const WorkHistory = () => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.2 }) // Trigger once when 20% of the element is visible

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2, // Stagger each timeline item
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative py-12 px-4 md:px-6 max-w-4xl mx-auto"
    >
      {/* Central vertical line for desktop */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-300 transform -translate-x-1/2 hidden md:block" />

      {timeline.map((item, index) => {
        /* eslint-disable react-hooks/rules-of-hooks */
  const itemRef = useRef(null);
  const itemInView = useInView(itemRef, { once: true, amount: 0.2 });

  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <motion.div
      key={`timeline-${index}`}
      ref={itemRef}
      initial="hidden"
      animate={itemInView ? "visible" : "hidden"}
      variants={itemVariants}
      className="relative mb-12 last:mb-0"
    >
      {/* Desktop layout */}
      <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-8 items-center">
        {index % 2 === 0 ? (
          <div className="text-right pr-8">
            <Paragraph className="font-semibold text-gray-600">{item.date}</Paragraph>
          </div>
        ) : (
          <div />
        )}

        <div className="relative w-full flex justify-center">
          <div className="h-4 w-4 rounded-full bg-green-500 border-2 border-white z-10" />
          {index % 2 === 0 ? (
            <div className="absolute right-full top-1/2 h-0.5 w-8 bg-gray-300 transform -translate-y-1/2" />
          ) : (
            <div className="absolute left-full top-1/2 h-0.5 w-8 bg-gray-300 transform -translate-y-1/2" />
          )}
        </div>

        {index % 2 === 0 ? (
          <div className="text-left pl-8">
            <Heading as="h5" className="text-lg md:text-xl lg:text-xl text-green-500">
              {item.company}
            </Heading>
            <Paragraph className="text-base md:text-lg lg:text-lg font-semibold text-gray-800">
              {item.title}
            </Paragraph>
            <Paragraph className="text-sm md:text-base lg:text-base mb-4 text-gray-700">
              {item.description}
            </Paragraph>
            <ul className="space-y-2">
              {item.responsibilities.map((responsibility, respIndex) => (
                <Step  key={respIndex}>{responsibility}</Step>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-left pl-8">
            <Paragraph className="font-semibold text-gray-600">{item.date}</Paragraph>
            <Heading as="h5" className="text-lg md:text-xl lg:text-xl text-green-500">
              {item.company}
            </Heading>
            <Paragraph className="text-base md:text-lg lg:text-lg font-semibold text-gray-800">
              {item.title}
            </Paragraph>
            <Paragraph className="text-sm md:text-base lg:text-base mb-4 text-gray-700">
              {item.description}
            </Paragraph>
            <ul className="space-y-2">
              {item.responsibilities.map((responsibility, respIndex) => (
                <Step  key={respIndex}>{responsibility}</Step>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile layout */}
      <div className="flex md:hidden space-x-4">
        <div className="relative flex flex-col items-center">
          <div className="h-4 w-4 rounded-full bg-green-500 border-2 border-white z-10 flex-shrink-0" />
          {index < timeline.length - 1 && (
            <div className="absolute top-4 bottom-0 w-0.5 bg-gray-300" />
          )}
        </div>

        <div className="flex-1">
          <Paragraph className="font-semibold text-gray-600 mb-2">{item.date}</Paragraph>
          <Heading as="h5" className="text-lg text-green-500">
            {item.company}
          </Heading>
          <Paragraph className="text-base font-semibold text-gray-800">{item.title}</Paragraph>
          <Paragraph className="text-sm mb-4 text-gray-700">{item.description}</Paragraph>
          <ul className="space-y-2">
            {item.responsibilities.map((responsibility, respIndex) => (
              <Step key={respIndex}>{responsibility}</Step>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
})}

    </motion.div>
  )
}

const Step = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex space-x-2 items-start">
      <IconCircleCheckFilled className="h-4 w-4 mt-1 text-green-500 flex-shrink-0" />
      <Paragraph className="text-sm md:text-base lg:text-base text-gray-700">{children}</Paragraph>
    </div>
  )
}
