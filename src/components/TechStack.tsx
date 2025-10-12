"use client"

import Image from "next/image"
import { useRef } from "react"
import { Heading } from "./Heading"
import { twMerge } from "tailwind-merge"
import { motion, useInView } from "framer-motion"
import { Paragraph } from "./Paragraph" // Assuming Paragraph is available

export const TechStack = () => {
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
        staggerChildren: 0.1, // Stagger each tech logo
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const stack = [
    { title: "Next.js", src: "/images/logos/next.png", className: "h-10 w-14" },
    { title: "AWS", src: "/images/logos/aws.webp", className: "h-10 w-10" },
    { title: "C", src: "/images/logos/c.png", className: "h-10 w-10" },
    { title: "TypeScript", src: "/images/logos/typescript.png", className: "h-10 w-10" },
    { title: "Docker", src: "/images/logos/docker.png", className: "h-10 w-10" },
    { title: "Framer Motion", src: "/images/logos/framer.webp", className: "h-10 w-10" },
    { title: "Node.js", src: "/images/logos/node.png", className: "h-10 w-12" },
    { title: "Tailwind CSS", src: "/images/logos/tailwind.png", className: "h-10 w-24" },
    { title: "Vercel", src: "/images/logos/vercel.png", className: "h-10 w-24" },
    { title: "Python", src: "/images/logos/python.png", className: "h-10 w-12" },
    { title: "PyTorch", src: "/images/logos/pytorch.png", className: "h-10 w-12" },
    { title: "Java", src: "/images/logos/java.png", className: "h-10 w-12" },
    { title: "Firebase", src: "/images/logos/firebase.png", className: "h-10 w-10" },
    { title: "Railway", src: "/images/logos/railway.svg", className: "h-10 w-10" },
    { title: "MySQL", src: "/images/logos/mysql.png", className: "h-10 w-10" },
    



  ]

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="container mx-auto py-12 px-4 md:px-6"
    >

      <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 justify-items-center">
        {stack.map((item) => (
          <motion.div
            key={item.src}
            variants={itemVariants}
            className="flex flex-col items-center hover:text-green-600 hover:font-bold  justify-center p-4 bg-white rounded-lg shadow-sm w-full max-w-[150px] h-[120px] hover:bg-green-50 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <Image
              src={item.src || "/placeholder.svg"}
              width={100} // Base width
              height={100} // Base height
              alt={item.title}
              className={twMerge("object-contain", item.className)} // item.className can override h/w
            />
            <Paragraph className="mt-2 text-sm font-medium text-center text-gray-800transition-colors duration-300">{item.title}</Paragraph>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}