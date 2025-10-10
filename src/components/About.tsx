"use client"

import { Paragraph } from "@/components/Paragraph";
import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function About() {
  const images = [
    "/images/Banff.png",
    "/images/Family.png",
    "/images/Surfing.JPG",
    "/images/Yankee.JPG",
  ];


/* eslint-disable react-hooks/rules-of-hooks */
  const textRef = useRef(null);
  const textInView = useInView(textRef, { once: true, amount: 0.2 });
/* eslint-disable react-hooks/rules-of-hooks */

  return (
    <section className="container mx-auto py-12 px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 my-10">
        {images.map((image, index) => {

/* eslint-disable react-hooks/rules-of-hooks */
          const ref = useRef(null);
          const inView = useInView(ref, { once: true, amount: 0.2 });

/* eslint-disable react-hooks/rules-of-hooks */

          return (
            <motion.div
              ref={ref}
              key={image}
              initial={{ opacity: 0, y: -50, rotate: 0 }}
              animate={
                inView
                  ? {
                      opacity: 1,
                      y: 0,
                      rotate: index % 2 === 0 ? 3 : -3,
                    }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Image
                src={image}
                width={200}
                height={400}
                alt="about"
                className="rounded-md object-cover transform rotate-3 shadow-xl block w-full h-40 md:h-60 hover:rotate-0 transition duration-200"
              />
            </motion.div>
          );
        })}
      </div>


      <motion.div
        ref={textRef}
        initial={{ opacity: 0, y: 20 }}
        animate={textInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl"
      >
        <Paragraph className="mt-4">
          Hi, I&apos;m Aidan O&apos;Brien, a computer science major at the University of
          Wisconsin-Madison with a passion for software development, big data
          systems, and machine learning.
        </Paragraph>

        <Paragraph className="mt-4">
          Currently, I&apos;m a software engineer intern at <strong>CargoLabs</strong>, an
          insurance marketplace startup building the future of supply chain. I&apos;m also
          the creator of <strong>BadgerBase</strong>, a web app with <strong>2000+</strong> users helping
          UW-Madison students find the best courses.
        </Paragraph>

        <Paragraph className="mt-4">
          Previously, I was one of the first full-stack engineers at <strong>Collectwise</strong>, an
          AI-powered debt collection startup in Y Combinator&apos;s Fall &apos;24 batch, and
          conducted research at school on generative AI using diffusion models.
        </Paragraph>

        <Paragraph className="mt-4">
          When I&apos;m not coding, you&apos;ll find me training Brazilian Jiu-Jitsu, playing
          chess or guitar, or just hanging out with friends. Originally from the Jersey
          Shore, I&apos;m a NY sports fan and an avid beach goer.
        </Paragraph>
      </motion.div>
    </section>
  );
}