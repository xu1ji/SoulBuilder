import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SoulBuilder</span>
            <span className="text-[10px] text-gray-400 font-medium">2.0</span>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
              Agent 列表
            </a>
            <a href="#" className="text-xs font-semibold text-gray-500 hover:text-black transition-colors">
              文档
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 bg-white border-b border-gray-100 md:hidden"
          >
            <nav className="px-6 py-4 flex flex-col gap-3">
              <a href="/" className="text-sm font-semibold text-gray-700">Agent 列表</a>
              <a href="#" className="text-sm font-semibold text-gray-700">文档</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="pt-14 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
