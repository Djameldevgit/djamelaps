// src/pages/appinfo.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Accordion,
  ListGroup,
  Alert,
  Button
} from 'react-bootstrap';
import FeatureCard from '../components/FeatureCard';

const appinfo2 = () => {
  const { t } = useTranslation('appinfo2');
  const { theme, languageReducer,auth } = useSelector(state => state);
  const currentLanguage = languageReducer?.language || 'en';
  const isRTL = ['ar', 'he'].includes(currentLanguage);

  // Estilos inline
  const styles = {
    container: {
      minHeight: '100vh',
      padding: '30px 0',
      backgroundColor: theme ? '#1a1a1a' : '#f8f9fa',
      direction: isRTL ? 'rtl' : 'ltr'
    },
    heroSection: {
      background: theme ? 
        'linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%)' :
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '60px 0',
      borderRadius: '15px',
      marginBottom: '40px',
      textAlign: isRTL ? 'right' : 'left'
    },
    section: {
      marginBottom: '40px'
    },
    sectionTitle: {
      color: theme ? '#ffffff' : '#2c3e50',
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '30px',
      textAlign: isRTL ? 'right' : 'left',
      borderBottom: `3px solid ${theme ? '#e74c3c' : '#e74c3c'}`,
      paddingBottom: '10px'
    },
    subsectionTitle: {
      color: theme ? '#ffffff' : '#34495e',
      fontSize: '22px',
      fontWeight: '600',
      margin: '30px 0 20px 0',
      textAlign: isRTL ? 'right' : 'left'
    },
    card: {
      background: theme ? '#2c3e50' : '#ffffff',
      border: 'none',
      borderRadius: '15px',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      marginBottom: '20px',
      color: theme ? '#ffffff' : '#2c3e50'
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    },
    badge: {
      fontSize: '12px',
      padding: '5px 10px',
      margin: '2px'
    },
    techStack: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '15px'
    },
    // Nuevos estilos para la sección About Me
    aboutSection: {
      background: theme ? 
        'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' :
        'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '50px 0',
      borderRadius: '15px',
      marginBottom: '40px'
    },
    profileImage: {
      width: '150px',
      height: '150px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `4px solid ${theme ? '#e74c3c' : '#667eea'}`,
      marginBottom: '20px'
    },
    socialLinks: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      justifyContent: 'center',
      marginTop: '25px'
    },
    appLinks: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '15px',
      marginTop: '25px'
    },
    socialButton: {
      background: theme ? 
        'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' :
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      borderRadius: '25px',
      padding: '12px 25px',
      color: 'white',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      textAlign: 'center',
      justifyContent: 'center'
    },
    appButton: {
      background: theme ? 
        'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' :
        'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      border: `2px solid ${theme ? '#e74c3c' : '#667eea'}`,
      borderRadius: '15px',
      padding: '20px 15px',
      color: theme ? '#ffffff' : '#2c3e50',
      fontWeight: '600',
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      textAlign: 'center',
      height: '100%'
    },
    journeyCard: {
      background: theme ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
      border: `1px solid ${theme ? '#34495e' : '#dee2e6'}`,
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px'
    },
    appIcon: {
      fontSize: '32px',
      marginBottom: '10px'
    }
  };

  // Datos para las características
  const features = [
    {
      icon: '🌍',
      title: t('features.multi_language.title'),
      description: t('features.multi_language.description'),
      badges: ['React i18n', 'Instantáneo', '4+ Idiomas']
    },
    {
      icon: '🔐',
      title: t('features.authentication.title'),
      description: t('features.authentication.description'),
      badges: ['JWT', 'OAuth', 'Email Verification']
    },
    {
      icon: '💬',
      title: t('features.real_time_chat.title'),
      description: t('features.real_time_chat.description'),
      badges: ['Socket.io', 'Tiempo Real', 'Imágenes']
    },
    {
      icon: '🛒',
      title: t('features.ecommerce.title'),
      description: t('features.ecommerce.description'),
      badges: ['Carrito', 'Checkout', 'Bancos']
    },
    {
      icon: '📱',
      title: t('features.responsive.title'),
      description: t('features.responsive.description'),
      badges: ['Mobile', 'Tablet', 'Desktop']
    },
    {
      icon: '⚡',
      title: t('features.performance.title'),
      description: t('features.performance.description'),
      badges: ['MERN', 'MongoDB', 'Optimizado']
    }
  ];

  // Enlaces de aplicaciones en producción - ACTUALIZADO
  const appLinks = [
    {
      name: t('apps.art_marketplace'),
      description: t('apps.art_marketplace_desc'),
      icon: 'fas fa-palette',
      url: 'https://djamelart.onrender.com',
      color: '#e74c3c',
      type: 'marketplace'
    },
    {
      name: t('apps.real_estate'),
      description: t('apps.real_estate_desc'),
      icon: 'fas fa-home',
      url: 'https://immo-fpck.onrender.com',
      color: '#3498db',
      type: 'marketplace'
    },
    {
      name: t('apps.automobiles'),
      description: t('apps.automobiles_desc'),
      icon: 'fas fa-car',
      url: 'https://automobiles-rq6t.onrender.com',
      color: '#2ecc71',
      type: 'marketplace'
    },
    {
      name: t('apps.smartphones'),
      description: t('apps.smartphones_desc'),
      icon: 'fas fa-mobile-alt',
      url: 'https://telephones.onrender.com',
      color: '#9b59b6',
      type: 'marketplace'
    },
    {
      name: t('apps.travel_agency'),
      description: t('apps.travel_agency_desc'),
      icon: 'fas fa-plane',
      url: 'https://agence-ahy1.onrender.com',
      color: '#f39c12',
      type: 'marketplace'
    }
  ];

  // Enlaces sociales
  const socialLinks = [
    {
      name: 'Facebook Djamel Art',
      icon: 'fab fa-facebook-f',
      url: 'https://www.facebook.com/DjamelArtPainting',
      color: '#1877f2'
    },
  
    
  ];

  return (
    <Container fluid style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <Container>
          <Row>
            <Col lg={8}>
              <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '20px' }}>
                {t('hero.title')}
              </h1>
              <p style={{ fontSize: '20px', opacity: 0.9, marginBottom: '30px' }}>
                {t('hero.subtitle')}
              </p>
              <div style={styles.techStack}>
                <Badge bg="light" text="dark" style={styles.badge}>MongoDB</Badge>
                <Badge bg="light" text="dark" style={styles.badge}>Express.js</Badge>
                <Badge bg="light" text="dark" style={styles.badge}>React</Badge>
                <Badge bg="light" text="dark" style={styles.badge}>Node.js</Badge>
                <Badge bg="light" text="dark" style={styles.badge}>Redux</Badge>
                <Badge bg="light" text="dark" style={styles.badge}>Socket.io</Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {/* Sección About Me - ACTUALIZADA */}
        <section style={styles.aboutSection}>
          <Row className="align-items-center">
            <Col md={4} className="text-center">
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: theme ? 
                  'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' :
                  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '48px'
              }}>
                <i className="fas fa-palette"></i>
              </div>
              <h3 style={{ 
                color: theme ? '#ffffff' : '#2c3e50',
                marginBottom: '10px'
              }}>
                {t('about.name')}
              </h3>
              <p style={{ 
                color: theme ? '#bdc3c7' : '#6c757d',
                fontStyle: 'italic'
              }}>
                {t('about.title')}
              </p>
            </Col>
            <Col md={8}>
              <div style={styles.journeyCard}>
                <h4 style={{ 
                  color: theme ? '#ffffff' : '#2c3e50',
                  marginBottom: '15px'
                }}>
                  {t('about.greeting')}
                </h4>
                <p style={{ 
                  color: theme ? '#ecf0f1' : '#495057',
                  lineHeight: '1.6',
                  marginBottom: '15px'
                }}>
                  {t('about.description')}
                </p>
                <p style={{ 
                  color: theme ? '#ecf0f1' : '#495057',
                  lineHeight: '1.6',
                  marginBottom: '15px'
                }}>
                  {t('about.journey')}
                </p>
                <p style={{ 
                  color: theme ? '#ecf0f1' : '#495057',
                  lineHeight: '1.6',
                  fontStyle: 'italic'
                }}>
                  {t('about.philosophy')}
                </p>
              </div>

              {/* Enlaces Sociales */}
              <div style={styles.socialLinks}>
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.socialButton,
                      background: link.color
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className={link.icon}></i>
                    {link.name}
                  </a>
                ))}
              </div>
            </Col>
          </Row>
        </section>

        {/* Sección de Aplicaciones en Producción - NUEVA */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('apps.title')}</h2>
          <p style={{ 
            color: theme ? '#bdc3c7' : '#6c757d',
            textAlign: isRTL ? 'right' : 'left',
            marginBottom: '30px',
            fontSize: '16px'
          }}>
            {t('apps.subtitle')}
          </p>
          <div style={styles.appLinks}>
            {appLinks.map((app, index) => (
              <a
                key={index}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.appButton,
                  borderColor: app.color
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                  e.currentTarget.style.background = theme ? 
                    `linear-gradient(135deg, ${app.color}20 0%, ${app.color}40 100%)` :
                    `linear-gradient(135deg, ${app.color}10 0%, ${app.color}20 100%)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = theme ? 
                    'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' :
                    'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)';
                }}
              >
                <div style={{...styles.appIcon, color: app.color}}>
                  <i className={app.icon}></i>
                </div>
                <h5 style={{ 
                  color: theme ? '#ffffff' : '#2c3e50',
                  margin: '0 0 8px 0',
                  fontSize: '16px'
                }}>
                  {app.name}
                </h5>
                <p style={{ 
                  color: theme ? '#bdc3c7' : '#6c757d',
                  margin: 0,
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}>
                  {app.description}
                </p>
                <Badge 
                  bg="secondary" 
                  style={{
                    marginTop: '10px',
                    fontSize: '10px',
                    background: app.color,
                    border: 'none'
                  }}
                >
                  {t('apps.marketplace')}
                </Badge>
              </a>
            ))}
          </div>
        </section>

        {/* Características Principales */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('sections.features')}</h2>
          <div style={styles.featureGrid}>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                badges={feature.badges}
                theme={theme}
                isRTL={isRTL}
              />
            ))}
          </div>
        </section>

        {/* Resto del componente... */}
        {/* Arquitectura Técnica */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('sections.architecture')}</h2>
          <Row>
            <Col md={6}>
              <Card style={styles.card}>
                <Card.Body>
                  <h5 style={styles.subsectionTitle}>🏗️ {t('architecture.frontend')}</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>React.js</strong> - {t('architecture.frontend_points.react')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>Redux</strong> - {t('architecture.frontend_points.redux')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>React Bootstrap</strong> - {t('architecture.frontend_points.bootstrap')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>i18next</strong> - {t('architecture.frontend_points.i18n')}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card style={styles.card}>
                <Card.Body>
                  <h5 style={styles.subsectionTitle}>⚙️ {t('architecture.backend')}</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>Node.js + Express</strong> - {t('architecture.backend_points.express')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>MongoDB</strong> - {t('architecture.backend_points.mongodb')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>JWT</strong> - {t('architecture.backend_points.jwt')}
                    </ListGroup.Item>
                    <ListGroup.Item style={{ background: 'transparent', color: 'inherit' }}>
                      <strong>Socket.io</strong> - {t('architecture.backend_points.socket')}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* FAQ - Preguntas Frecuentes */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('sections.faq')}</h2>
          <Accordion>
            <Accordion.Item eventKey="0" style={styles.card}>
              <Accordion.Header>
                <strong>{t('faq.how_register.question')}</strong>
              </Accordion.Header>
              <Accordion.Body>
                {t('faq.how_register.answer')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1" style={styles.card}>
              <Accordion.Header>
                <strong>{t('faq.language_change.question')}</strong>
              </Accordion.Header>
              <Accordion.Body>
                {t('faq.language_change.answer')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2" style={styles.card}>
              <Accordion.Header>
                <strong>{t('faq.post_validation.question')}</strong>
              </Accordion.Header>
              <Accordion.Body>
                {t('faq.post_validation.answer')}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3" style={styles.card}>
              <Accordion.Header>
                <strong>{t('faq.security.question')}</strong>
              </Accordion.Header>
              <Accordion.Body>
                {t('faq.security.answer')}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </section>

        {/* Estadísticas del Sistema */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('sections.statistics')}</h2>
          <Row>
            <Col md={3} sm={6}>
              <Card style={{...styles.card, textAlign: 'center'}}>
                <Card.Body>
                  <h1 style={{color: '#e74c3c', fontSize: '48px', margin: 0}}>⚡</h1>
                  <h4 style={{margin: '10px 0'}}>{t('stats.validation_time')}</h4>
                  <p style={{margin: 0, opacity: 0.8}}>{t('stats.validation_time_desc')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card style={{...styles.card, textAlign: 'center'}}>
                <Card.Body>
                  <h1 style={{color: '#3498db', fontSize: '48px', margin: 0}}>🌍</h1>
                  <h4 style={{margin: '10px 0'}}>{t('stats.languages')}</h4>
                  <p style={{margin: 0, opacity: 0.8}}>{t('stats.languages_desc')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card style={{...styles.card, textAlign: 'center'}}>
                <Card.Body>
                  <h1 style={{color: '#2ecc71', fontSize: '48px', margin: 0}}>🛡️</h1>
                  <h4 style={{margin: '10px 0'}}>{t('stats.verification_rate')}</h4>
                  <p style={{margin: 0, opacity: 0.8}}>{t('stats.verification_rate_desc')}</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card style={{...styles.card, textAlign: 'center'}}>
                <Card.Body>
                  <h1 style={{color: '#9b59b6', fontSize: '48px', margin: 0}}>💬</h1>
                  <h4 style={{margin: '10px 0'}}>{t('stats.chat_response')}</h4>
                  <p style={{margin: 0, opacity: 0.8}}>{t('stats.chat_response_desc')}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Call to Action */}
        <Alert variant="info" style={{...styles.card, textAlign: 'center'}}>
          <h4>{t('cta.title')}</h4>
          <p>{t('cta.description')}</p>
      {
auth.user? (
  <Link to ={'/'} >
  <Button 
    variant="primary" 
    size="lg"
    style={styles.socialButton}
  >
    <i className="fas fa-rocket"></i>
    {t('cta.button')}
  </Button></Link>
):(

  <Link to ={'/login'} >
  <Button 
    variant="primary" 
    size="lg"
    style={styles.socialButton}
  >
    <i className="fas fa-rocket"></i>
    {t('cta.button')}
  </Button></Link>

)


      }
        </Alert>
      </Container>
    </Container>
  );
};

export default appinfo2;