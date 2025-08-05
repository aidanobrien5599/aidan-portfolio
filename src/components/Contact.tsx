"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Heading } from "./Heading"
import { Paragraph } from "./Paragraph"

const defaultFormState = {
  name: {
    value: "",
    error: "",
  },
  email: {
    value: "",
    error: "",
  },
  message: {
    value: "",
    error: "",
  },
}

export const Contact = () => {
  const [formData, setFormData] = useState(defaultFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

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
        staggerChildren: 0.1, // Stagger form elements
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    // Basic validation (can be expanded)
    if (!formData.name.value || !formData.email.value || !formData.message.value) {
      setSubmitMessage({ type: "error", text: "Please fill in all fields." })
      setIsSubmitting(false)
      return
    }

    const payload = {
      name: formData.name.value,
      email: formData.email.value,
      message: formData.message.value,
    }

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        console.log("Message sent successfully")
        setSubmitMessage({ type: "success", text: "Message sent successfully! I'll get back to you soon." })
        setFormData(defaultFormState) // Clear form
      } else {
        console.error("Failed to send message")
        setSubmitMessage({ type: "error", text: "Failed to send message. Please try again later." })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Paragraph className="text-left text-gray-700 mb-10 max-w-2xl">
        Have a question, a project idea, or just want to say hello? Feel free to reach out! I&apos;d love to hear from you.
      </Paragraph>

      <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between gap-5">
          <label htmlFor="name" className="sr-only">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            className="bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 px-2 py-2 rounded-md text-sm text-neutral-700 w-full"
            value={formData.name.value}
            onChange={(e) => {
              setFormData({
                ...formData,
                name: { value: e.target.value, error: "" },
              })
            }}
            required
          />
          <label htmlFor="email" className="sr-only">
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Your email address"
            className="bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 px-2 py-2 rounded-md text-sm text-neutral-700 w-full"
            value={formData.email.value}
            onChange={(e) => {
              setFormData({
                ...formData,
                email: { value: e.target.value, error: "" },
              })
            }}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <label htmlFor="message" className="sr-only">
            Your Message
          </label>
          <textarea
            id="message"
            placeholder="Your Message"
            rows={10}
            className="bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-200 px-2 mt-4 py-2 rounded-md text-sm text-neutral-700 w-full"
            value={formData.message.value}
            onChange={(e) => {
              setFormData({
                ...formData,
                message: { value: e.target.value, error: "" },
              })
            }}
            required
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            className="w-full px-2 py-2 mt-4 bg-neutral-100 rounded-md font-bold text-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </motion.div>

        {submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-4 text-center text-sm font-medium ${
              submitMessage.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {submitMessage.text}
          </motion.div>
        )}
      </form>
    </motion.section>
  )
}
