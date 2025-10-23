import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { fetchBanners } from '../services/api'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const [banners, setBanners] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch banners from API
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners()
        setBanners(data)
        console.log(`✅ Loaded ${data.length} banners`)
      } catch (error) {
        console.error('Failed to load banners:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBanners()
  }, [])

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length)
  }

  const handleBannerClick = (banner) => {
    if (banner.link_url) {
      navigate(banner.link_url)
    }
  }

  if (loading) {
    return (
      <section className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-gray-200 animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 bg-[length:200%_100%] animate-shimmer"></div>
      </section>
    )
  }

  if (banners.length === 0) {
    return (
      <section className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden bg-gradient-to-r from-teal-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">ovees</h2>
            <p className="text-sm sm:text-base md:text-lg max-w-md">
              Discover elegant jewelry for every occasion
            </p>
          </div>
        </div>
      </section>
    )
  }

  const currentBanner = banners[currentIndex]

  return (
    <section className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden group">
      {/* Banner Images with Zoom Effect */}
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          onClick={() => handleBannerClick(banner)}
        >
          <img
            src={banner.image_url}
            alt={banner.title}
            className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
              index === currentIndex ? 'scale-110' : 'scale-100'
            } ${banner.link_url ? 'cursor-pointer' : ''}`}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>
      ))}

      {/* Banner Content */}
      <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg animate-fade-in">
              {currentBanner.title}
            </h2>
            {currentBanner.link_url && (
              <button
                onClick={() => handleBannerClick(currentBanner)}
                className="pointer-events-auto mt-4 bg-white text-teal-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Shop Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next banner"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-gray-800" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSection