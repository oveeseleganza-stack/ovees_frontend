import React from 'react'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BannerCards = ({ onCardClick }) => {
  const navigate = useNavigate()
  const cards = [
    {
      id: 'new-arrivals',
      title: 'New Arrivals',
      image: '/banners/newarrrivals.jpg',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      description: 'Latest Products'
    },
    {
      id: 'combos',
      title: 'Combos',
      image: '/banners/combo.jpg',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'Special Deals'
    },
    {
      id: '199-store',
      title: '₹199 Store',
      image: '/banners/199.jpg',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'Under ₹199'
    },
    {
      id: '99-store',
      title: '₹99 Store',
      image: '/banners/99.jpg',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      description: 'Under ₹99'
    }
  ]

  const handleCardClick = (cardId) => {
    const routes = {
      'new-arrivals': '/new-arrivals',
      '99-store': '/99-store',
      '199-store': '/199-store',
      'combos': '/combos'
    }
    navigate(routes[cardId])
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => handleCardClick(card.id)}
          className="relative h-48 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-105 group"
        >
          {/* Background Image */}
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
              {card.title}
            </h3>
            <p className="text-sm text-white/90">
              {card.description}
            </p>
            <div className={`mt-3 h-1 w-12 bg-gradient-to-r ${card.color} rounded-full`}></div>
          </div>
          
          {/* Chevron Icon */}
          <ChevronRight className="absolute top-4 right-4 w-6 h-6 text-white opacity-70 group-hover:opacity-100 transition" />
        </div>
      ))}
    </div>
  )
}

export default BannerCards
