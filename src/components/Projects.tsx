"use client"

import { useRef } from "react"
import { Heading } from "./Heading"
import type { Product } from "@/types/products"
import { products } from "@/constants/products"
import Link from "next/link"
import Image from "next/image"
import { Paragraph } from "./Paragraph"
import { motion, useInView } from "framer-motion"

export const Products = () => {
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
        staggerChildren: 0.1, // Stagger each project item
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const featuredProduct = products[0]
  const otherProducts = products.slice(1)

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="container mx-auto py-12 px-4 md:px-6"
    >

      {/* Featured Project */}
      {featuredProduct && (
        <motion.div variants={itemVariants} className="mb-16">
          <Link
            href={featuredProduct.slug ? `/projects/${featuredProduct.slug}` : featuredProduct.href}
            className="group flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100"
          >
            <div className="relative w-full lg:w-1/2 aspect-video overflow-hidden rounded-lg flex-shrink-0">
              <Image
                src={featuredProduct.thumbnail || "/placeholder.svg"}
                alt={featuredProduct.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-between flex-grow text-center lg:text-left">
              <div>
                <Heading as="h3" className="font-extrabold text-3xl md:text-4xl text-green-600 mb-2">
                  {featuredProduct.title} (Featured)
                </Heading>
                <Paragraph className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {featuredProduct.description}
                </Paragraph>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                {featuredProduct.stack?.map((stack: string) => (
                  <span key={stack} className="text-sm font-medium bg-zinc-100 text-green-600 px-3 py-1 rounded-full">
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* Other Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {otherProducts.map((product: Product, idx: number) => (
          <motion.div key={product.slug || product.href} variants={itemVariants}>
            <Link
              href={product.slug ? `/projects/${product.slug}` : product.href}
              className="group flex flex-col space-y-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out border border-gray-100 h-full"
            >
              <div className="relative w-full aspect-video overflow-hidden rounded-md flex-shrink-0">
                <Image
                  src={product.thumbnail || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <Heading
                    as="h4"
                    className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors duration-200"
                  >
                    {product.title}
                  </Heading>
                  <Paragraph className="text-sm text-gray-600 mt-2 line-clamp-3">{product.description}</Paragraph>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {product.stack?.map((stack: string) => (
                    <span key={stack} className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded-sm">
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
