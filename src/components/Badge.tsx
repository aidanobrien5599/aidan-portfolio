import React from "react";
import { motion } from "framer-motion";

export const Badge = ({
  text,
  icon,
  download,
  ...props
}: {
  text: string;
  icon?: React.ReactNode;
  download?: string;
  props?: React.ComponentProps<"a">;
}) => {
  return (
    <a
      href={download}
      download
      className="bg-green-700 hover:bg-green-800 no-underline group cursor-pointer relative shadow-lg shadow-green-700/20 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block transition-all duration-300 hover:shadow-xl hover:shadow-green-700/30"
      {...props}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full ">
        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(21,128,61,0.4)_0%,rgba(21,128,61,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
      </span>
      <div className="relative flex space-x-2 items-center z-10 rounded-full bg-transparent py-2 px-4 ring-1 ring-green-600/15 ">
        <span>{text}</span>
        {icon ?? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M10.75 8.75L14.25 12L10.75 15.25"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
            />
          </svg>
        )}
      </div>
      <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-green-600/0 via-green-600/70 to-green-600/0 transition-opacity duration-500 group-hover:opacity-50"></span>
    </a>
  );
};