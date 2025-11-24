import React, { useState, useEffect } from 'react'
import { fetchCategories } from '../services/api'

const Footer = () => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories()
        setCategories(data.slice(0, 6)) // Show only first 6 categories in footer
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              <span className="text-teal-400">OVEES</span>{' '}
              <span className="text-yellow-400">ELEGANZA</span>
            </h3>
            <div className="space-y-2 text-sm sm:text-base">
              <p className="flex items-center gap-2">
                <span>📱 Whats App</span>
              </p>
              <p>+91 95626 54307</p>
              <p className="flex items-center gap-2 mt-4">
                <span>📞 Call Us</span>
              </p>
              <p>+91 95626 54307</p>
              <p className="flex items-center gap-2 mt-4">
                <span>📧 Email</span>
              </p>
              <a href="mailto:oveeseleganza@gmail.com" className="hover:text-teal-400 transition">
                oveeseleganza@gmail.com
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-sm">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id} className="hover:text-teal-400 cursor-pointer">
                    {cat.name}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Loading...</li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Customer Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-teal-400 cursor-pointer">About Us</li>
              <li className="hover:text-teal-400 cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-teal-400 cursor-pointer">FAQ</li>
              {/* <li className="hover:text-teal-400 cursor-pointer">Privacy Policy</li> */}
              {/* <li className="hover:text-teal-400 cursor-pointer">E-waste Policy</li> */}
              {/* <li className="hover:text-teal-400 cursor-pointer">Cancellation & Return Policy</li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Download App</h4>
            <div className="space-y-3">
              <div className="bg-black rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800 transition">
                <p className="text-xs">Download on the</p>
                <p className="font-semibold">App Store</p>
              </div>
              <div className="bg-black rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800 transition">
                <p className="text-xs">GET IT ON</p>
                <p className="font-semibold">Google Play</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs sm:text-sm">
          <p> 2025 All rights reserved, Ovees Eleganza</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
