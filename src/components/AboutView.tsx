import React from 'react'
import aboutData from '../data/about.json'
import { AboutFeatureIcon } from './Icons'

export const AboutView: React.FC = () => {
  return (
    <div>
      <div className="about-grid">
        <div>
          <h2 className="about-title">{aboutData.companyName}</h2>
          <p className="about-tagline">{aboutData.tagline}</p>
          <p className="about-text">{aboutData.description}</p>
          <p className="about-text">Год основания сети: <strong>{aboutData.founded} г.</strong></p>
          <p className="about-text">Центральный офис: <strong>{aboutData.address}, г. {aboutData.city}</strong></p>
        </div>
        
        <div className="about-stats">
          {aboutData.stats.map((stat, idx) => (
            <div key={idx} className="stat-box">
              <div className="stat-val">{stat.value}</div>
              <div className="stat-lbl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Наши преимущества</h2>
      </div>

      <div className="about-features">
        {aboutData.features.map((feature, idx) => (
          <div key={idx} className="feature-box">
            <div className="feature-icon">
              <AboutFeatureIcon title={feature.title} />
            </div>
            <div className="feature-details">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
