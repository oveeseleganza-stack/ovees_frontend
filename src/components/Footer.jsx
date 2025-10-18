import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-teal-400">OVEES</span>{' '}
              <span className="text-orange-400">ELEGANZA</span>
            </h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span>📱 Whats App</span>
              </p>
              <p>+1 202-918-2132</p>
              <p className="flex items-center gap-2 mt-4">
                <span>📞 Call Us</span>
              </p>
              <p>+1 202-918-2132</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Popular Categories</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-teal-400 cursor-pointer">Fruits & Vegetables</li>
              <li className="hover:text-teal-400 cursor-pointer">Dairy & Breakfasts</li>
              <li className="hover:text-teal-400 cursor-pointer">Egg, Meat & Fish</li>
              <li className="hover:text-teal-400 cursor-pointer">Bath & Body</li>
              <li className="hover:text-teal-400 cursor-pointer">Beauty & Health Juliesh</li>
              <li className="hover:text-teal-400 cursor-pointer">Snacks & Munchies</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Customer Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-teal-400 cursor-pointer">About Us</li>
              <li className="hover:text-teal-400 cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-teal-400 cursor-pointer">FAQ</li>
              <li className="hover:text-teal-400 cursor-pointer">Privacy Policy</li>
              <li className="hover:text-teal-400 cursor-pointer">E-waste Policy</li>
              <li className="hover:text-teal-400 cursor-pointer">Cancellation & Return Policy</li>
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

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>© 2025 All rights reserved, Ovees Eleganza</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer