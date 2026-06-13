import React from 'react'
import { motion } from 'framer-motion'
import aboutData from '../data/about.json'
import { AboutFeatureIcon } from './Icons'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
} as const


export const AboutView: React.FC = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="about-grid">
        <motion.div variants={itemVariants}>
          <h2 className="about-title">{aboutData.companyName}</h2>
          <p className="about-tagline">{aboutData.tagline}</p>
          <p className="about-text">{aboutData.description}</p>
          <p className="about-text">Год основания сети: <strong>{aboutData.founded} г.</strong></p>
          <p className="about-text">Центральный офис: <strong>{aboutData.address}, г. {aboutData.city}</strong></p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="about-stats">
          {aboutData.stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              className="stat-box"
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="stat-val">{stat.value}</div>
              <div className="stat-lbl">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Brand Images Section ────────────────────────────────────────── */}
      <motion.div 
        variants={itemVariants} 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          margin: '40px 0 56px'
        }}
      >
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-card)', boxShadow: 'var(--shadow-md)', height: '300px' }}>
          <img src="/paykar_about_store.png" alt="Супермаркет Пайкар" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: 'var(--border-card)', boxShadow: 'var(--shadow-md)', height: '300px' }}>
          <img src="/paykar_about_team.png" alt="Команда Пайкар" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="section-header">
        <h2 className="section-title">Наши преимущества</h2>
      </motion.div>

      <motion.div variants={containerVariants} className="about-features">
        {aboutData.features.map((feature, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            className="feature-box"
            whileHover={{ y: -6 }}
          >
            <div className="feature-icon">
              <AboutFeatureIcon title={feature.title} />
            </div>
            <div className="feature-details">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
