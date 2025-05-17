"use client";
import { Paragraph } from "@/components/Paragraph";
import Image from "next/image";

import { motion } from "framer-motion";

export default function About() {
  const images = [
    "/images/Banff.png",
    "/images/Family.png",
    "/images/Surfing.JPG",
    "/images/Yankee.JPG",
  ];
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 my-10">
        {images.map((image, index) => (
          <motion.div
            key={image}
            initial={{
              opacity: 0,
              y: -50,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: index % 2 === 0 ? 3 : -3,
            }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
          >
            <Image
              src={image}
              width={200}
              height={400}
              alt="about"
              className="rounded-md object-cover transform rotate-3 shadow-xl block w-full h-40 md:h-60 hover:rotate-0 transition duration-200"
            />
          </motion.div>
        ))}
        {/* 
        // <Image
        //   src="https://images.unsplash.com/photo-1692544350322-ac70cfd63614?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60"
        //   width={200}
        //   height={400}
        //   alt="about"
        //   className="rounded-md object-cover transform rotate-3 shadow-xl block w-full h-40 md:h-60 hover:rotate-0 transition duration-200"
        // />
        // <Image
        //   src="https://images.unsplash.com/photo-1692374227159-2d3592f274c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=800&q=60"
        //   width={200}
        //   height={400}
        //   alt="about"
        //   className="rounded-md object-cover transform -rotate-3 shadow-xl block w-full h-40 md:h-60  hover:rotate-0 transition duration-200"
        // />
        // <Image
        //   src="https://images.unsplash.com/photo-1692005561659-cdba32d1e4a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
        //   width={200}
        //   height={400}
        //   alt="about"
        //   className="rounded-md object-cover transform rotate-3 shadow-xl block w-full h-40 md:h-60  hover:rotate-0 transition duration-200"
        // />
        // <Image
        //   src="https://images.unsplash.com/photo-1692445381633-7999ebc03730?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzM3x8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
        //   width={200}
        //   height={400}
        //   alt="about"
        //   className="rounded-md object-cover transform -rotate-3 shadow-xl block w-full h-40 md:h-60  hover:rotate-0 transition duration-200"
        // /> */}
      </div>

      <div className="max-w-4xl">
        <Paragraph className="mt-4">
          Hi, I&#39;m Aidan O&#39;Brien, and I am a computer science major at the
          University of Wisconsin-Madison with a strong interest in software
          development, big data systems, and machine learning. I&#39;m passionate
          about building scalable tools that solve complex real-world problems.
        </Paragraph>

        <Paragraph className="mt-4">
          This past summer, I worked as one of the first full-stack engineers at{" "}
          <strong>Collectwise</strong>, an AI-powered debt collection startup in
          Y Combinator&#39;s Fall &#39;24 batch. There, I helped build the company&#39;s
          early infrastructure, contributing to both backend APIs and frontend
          experiences in a fast-paced, high-ownership environment.
        </Paragraph>

        <Paragraph className="mt-4">
          Previously, I conducted research on generative AI as part of a team
          exploring how to generate high-fidelity materials from unstable
          datasets using diffusion models. This experience deepened my
          understanding of model optimization, training dynamics, and real-world
          ML deployment challenges.
        </Paragraph>

        <Paragraph className="mt-4">
          Outside of work, I&#39;m an avid outdoors enthusiast and fitness junkie. I
          enjoy lifting, snowboarding, hiking, and I actively train in Brazilian
          Jiu-Jitsu. Growing up on the Jersey Shore, I also developed a love for
          surfing, New York sports, and classic boardwalk pizza.
        </Paragraph>

        <Paragraph className="mt-4">
          When I&#39;m not coding or on the mats, you&#39;ll often find me reading,
          playing chess, or experimenting with new recipes in the kitchen. I&#39;m
          always looking to expand my skills and connect with others who are
          passionate about technology, design, and building things that matter.
        </Paragraph>
      </div>
    </div>
  );
}
