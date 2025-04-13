import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Home,
});
function Home() {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen flex flex-col items-center justify-center">
      <motion.div
        className="flex items-center space-x-4 my-2"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Welcome
        </motion.h1>
        <motion.span
          className="text-4xl"
          role="img"
          aria-label="waving hand"
          style={{ marginLeft: "0.2rem" }}
          initial={{ opacity: 0, rotate: -30 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          👋
        </motion.span>
      </motion.div>
      <motion.p
        className="text-lg font-light leading-relaxed max-w-prose text-center my-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Hi, I'm <span className="font-semibold">Iven Beck</span>, a{" "}
        <span className="font-semibold">Data Science Student</span> at the
        University of Mannheim. I am passionate about leveraging data to solve
        real-world problems and create meaningful insights.
      </motion.p>
      <motion.div
        className="flex space-x-4 justify-center my-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <a
          href="https://github.com/ibveecnk"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/ipbeck"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
        >
          LinkedIn
        </a>
      </motion.div>
    </div>
  );
}
