import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../Avatar';
import Card from 'react-bootstrap/Card';
import {
  FaPlus,
  FaHome,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaBell,
  FaInfoCircle,
  FaFacebookMessenger,
  FaDownload, // ✅ NUEVO ICONO
  FaRocket    // ✅ NUEVO ICONO ALTERNATIVO
} from 'react-icons/fa';
import { Navbar, Container, NavDropdown, Badge, Alert } from 'react-bootstrap';
import LanguageSelectorpc from '../LanguageSelectorpc';

const Navbar2 = () => {
  const { auth, cart, notify, settings } = useSelector((state) => state);
  const history = useHistory();
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('navbar2');
  const lang = languageReducer.language || 'es';
  
  const [userRole, setUserRole] = useState(auth.user?.role);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  
  // ✅ NUEVO: Estados para instalación PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstallAlert, setShowInstallAlert] = useState(false);
  const [installAlertMessage, setInstallAlertMessage] = useState('');
// En tu useEffect del Navbar2, agrega:
useEffect(() => {
  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setCanInstall(true);
    console.log('✅ PWA Install Prompt disponible!');
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  // FORZAR: Simular el evento si no aparece (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      if (!deferredPrompt) {
        console.log('🔄 Forzando verificación PWA en desarrollo...');
        // Puedes simular el evento manualmente para testing
        const fakeEvent = {
          prompt: () => Promise.resolve({ outcome: 'accepted' }),
          userChoice: Promise.resolve({ outcome: 'accepted' })
        };
        handleBeforeInstallPrompt(fakeEvent);
      }
    }, 3000);
  }

  return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
}, []);
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    if (auth.user?.role && auth.user.role !== userRole) {
      setUserRole(auth.user.role);
    }
  }, [auth.user?.role, userRole]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ NUEVO: Effect para capturar el evento de instalación PWA
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      console.log('PWA: beforeinstallprompt event captured');
    };

    const handleAppInstalled = () => {
      console.log('PWA: App installed successfully');
      setDeferredPrompt(null);
      setCanInstall(false);
      showInstallMessage(t('pwa_install_success') || '¡App instalada correctamente!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [t]);

  // ✅ NUEVO: Función para mostrar mensajes de instalación
  const showInstallMessage = (message, variant = 'info') => {
    setInstallAlertMessage(message);
    setShowInstallAlert(true);
    setTimeout(() => {
      setShowInstallAlert(false);
    }, 4000);
  };

  // ✅ NUEVO: Función principal para instalar PWA
  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      showInstallMessage(
        t('pwa_not_supported') || 'Tu navegador no soporta instalación de apps', 
        'warning'
      );
      return;
    }

    if (isInstalling) return;

    setIsInstalling(true);

    try {
      // Mostrar el prompt nativo de instalación
      deferredPrompt.prompt();
      
      // Esperar la decisión del usuario
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        showInstallMessage(
          t('pwa_install_started') || 'Instalación iniciada...', 
          'success'
        );
      } else {
        console.log('PWA: User dismissed the install prompt');
        showInstallMessage(
          t('pwa_install_declined') || 'Instalación cancelada', 
          'info'
        );
      }
      
      // Limpiar el prompt
      setDeferredPrompt(null);
      setCanInstall(false);
      
    } catch (error) {
      console.error('PWA: Error during installation:', error);
      showInstallMessage(
        t('pwa_install_error') || 'Error durante la instalación', 
        'danger'
      );
    } finally {
      setIsInstalling(false);
    }
  };

  // ✅ NUEVO: Verificar si ya está instalado
  const isAppInstalled = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
  };

  if (!settings) {
    return (
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand">{t('loading')}</span>
      </nav>
    );
  }

  const handleCreatePost = () => {
    history.push('/createpost');
  };

  const unreadNotifications = notify.data.filter(n => !n.isRead).length;
  const unreadMessages = 0;

  // MenuItem simplificado solo para dropdown de usuarios NO autenticados
  const MenuItem = ({ icon: Icon, iconColor, to, onClick, children }) => (
    <NavDropdown.Item
      as={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      className="custom-menu-item"
      style={{
        padding: '12px 20px',
        transition: 'all 0.2s ease',
        borderRadius: '8px',
        margin: '2px 8px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
        direction: lang === 'ar' ? 'rtl' : 'ltr',
        textAlign: lang === 'ar' ? 'right' : 'left'
      }}
    >
      <Icon className={lang === 'ar' ? "ms-3" : "me-3"} style={{ color: iconColor, fontSize: '1.1rem' }} />
      <span>{children}</span>
    </NavDropdown.Item>
  );

  return (
    <div>
      {/* ✅ NUEVO: Alert para mensajes de instalación */}
      {showInstallAlert && (
        <Alert 
          variant={installAlertMessage.includes('éxito') || installAlertMessage.includes('correctamente') ? 'success' : 
                  installAlertMessage.includes('Error') ? 'danger' : 'info'}
          className="mb-0 text-center py-2"
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '300px',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          {installAlertMessage}
        </Alert>
      )}

      <Navbar
        expand="lg"
        style={{
          zIndex: 1030,
          marginTop: isMobile ? '55px' : '0',
          background: settings.style
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          padding: isMobile ? '8px 0' : '12px 0',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)'
        }}
        className={settings.style ? "navbar-dark" : "navbar-light"}
      >
        <Container fluid className="align-items-center justify-content-between">
          {/* Logo y título */}
          <div className="d-flex align-items-center">
            <Link
              to="/"
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '45px' : '55px',
                height: isMobile ? '45px' : '55px',
                marginLeft: lang === 'ar' ? '0' : '8px',
                marginRight: lang === 'ar' ? '8px' : (isMobile ? '8px' : '12px'),
                padding: '0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
              }}
            >
              <FaHome size={isMobile ? 24 : 28} style={{ color: 'white' }} />
            </Link>

            <Navbar.Brand href="/" className="py-2 d-none d-lg-block mb-0">
              <Card.Title
                className="mb-0"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}
              >
                {t('appName')}
              </Card.Title>
            </Navbar.Brand>
          </div>

          {/* Iconos de navegación */}
          <div className="d-flex align-items-center" style={{ gap: isMobile ? '8px' : '16px' }}>
            {/* Selector de idioma para desktop */}
            <div className="d-none d-lg-block">
              <LanguageSelectorpc />
            </div>

            {/* ✅ NUEVO: Botón Instalar App PWA */}
            {canInstall && !isAppInstalled() && (
              <div
                onClick={handleInstallPWA}
                className="d-flex align-items-center justify-content-center icon-button"
                style={{
                  cursor: isInstalling ? 'not-allowed' : 'pointer',
                  width: isMobile ? '40px' : '45px',
                  height: isMobile ? '40px' : '45px',
                  borderRadius: '12px',
                  background: isInstalling 
                    ? 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)'
                    : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  opacity: isInstalling ? 0.7 : 1
                }}
                title={isInstalling 
                  ? (t('pwa_installing') || 'Instalando...') 
                  : (t('install_app') || 'Instalar App')
                }
              >
                {isInstalling ? (
                  <div className="spinner-border spinner-border-sm" style={{ color: 'white' }} />
                ) : (
                  <FaDownload
                    size={isMobile ? 18 : 20}
                    style={{ color: 'white' }}
                  />
                )}
              </div>
            )}

            {/* Botón Agregar Post (solo para usuarios autenticados con rol especial) */}
            {auth.user && (userRole === "Super-utilisateur" || userRole === "admin") && (
              <div
                onClick={handleCreatePost}
                className="d-flex align-items-center justify-content-center icon-button"
                style={{
                  cursor: 'pointer',
                  width: isMobile ? '40px' : '45px',
                  height: isMobile ? '40px' : '45px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}
                title={t('addPost')}
              >
                <FaPlus
                  size={isMobile ? 18 : 20}
                  style={{ color: 'white' }}
                />
              </div>
            )}

            {/* Messenger (solo usuarios autenticados) */}
            {auth.user && (
              <Link
                to="/message"
                className="position-relative d-flex align-items-center justify-content-center icon-button text-decoration-none"
                style={{
                  width: isMobile ? '40px' : '45px',
                  height: isMobile ? '40px' : '45px',
                  borderRadius: '12px',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                title={t('messages')}
              >
                <FaFacebookMessenger
                  size={isMobile ? 20 : 22}
                  style={{ color: unreadMessages > 0 ? '#00b2ff' : '#667eea' }}
                />
                {unreadMessages > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: '0.65rem',
                      position: 'absolute',
                      top: '-2px',
                      [lang === 'ar' ? 'left' : 'right']: '-2px',
                      padding: '4px 7px',
                      background: 'linear-gradient(135deg, #00b2ff 0%, #006aff 100%)',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(0, 178, 255, 0.4)'
                    }}
                  >
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </Badge>
                )}
              </Link>
            )}

            {/* Notificaciones (solo usuarios autenticados) */}
            {auth.user && (
              <Link
                to="/notify"
                className="position-relative d-flex align-items-center justify-content-center icon-button text-decoration-none"
                style={{
                  width: isMobile ? '40px' : '45px',
                  height: isMobile ? '40px' : '45px',
                  borderRadius: '12px',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                title={t('notifications')}
              >
                <FaBell
                  size={isMobile ? 20 : 22}
                  style={{ color: unreadNotifications > 0 ? '#f5576c' : '#667eea' }}
                />
                {unreadNotifications > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: '0.65rem',
                      position: 'absolute',
                      top: '-2px',
                      [lang === 'ar' ? 'left' : 'right']: '-2px',
                      padding: '4px 7px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(245, 87, 108, 0.4)'
                    }}
                  >
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Badge>
                )}
              </Link>
            )}

            {/* Avatar o Dropdown según autenticación */}
            {auth.user ? (
              <Link
                to="/profileinfouser"
                className="text-decoration-none"
                title={t('profile')}
              >
                <div
                  className="dropdown-avatar icon-button"
                  style={{
                    width: isMobile ? '40px' : '45px',
                    height: isMobile ? '40px' : '45px',
                    borderRadius: '12px',
                    padding: '0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}
                >
                  <Avatar
                    src={auth.user.avatar}
                    size="medium-avatar"
                    style={{
                      borderRadius: '10px',
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                      margin: '0',
                      padding: '0',
                      display: 'block'
                    }}
                  />
                </div>
              </Link>
            ) : (
              <NavDropdown
                align="end"
                title={
                  <div
                    style={{
                      width: isMobile ? '40px' : '45px',
                      height: isMobile ? '40px' : '45px',
                      borderRadius: '12px',
                      backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}
                    className="icon-button"
                  >
                    <FaUserCircle size={isMobile ? 24 : 28} style={{ color: '#667eea' }} />
                  </div>
                }
                id="nav-guest-dropdown"
                className="custom-dropdown"
              >
                <MenuItem icon={FaSignInAlt} iconColor="#28a745" to="/login">
                  {t('login')}
                </MenuItem>
                <MenuItem icon={FaUserPlus} iconColor="#667eea" to="/register">
                  {t('register')}
                </MenuItem>
                <NavDropdown.Divider style={{ margin: '8px 16px' }} />
                <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/infoaplicacionn">
                  {t('appInfo')}
                </MenuItem>
              </NavDropdown>
            )}
          </div>
        </Container>
      </Navbar>

      {/* CSS personalizado */}
      <style jsx>{`
        .icon-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3) !important;
        }

        .custom-menu-item:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
          transform: translateX(4px);
        }

        .dropdown-menu {
          border: none !important;
          boxShadow: 0 10px 40px rgba(0,0,0,0.15) !important;
          borderRadius: 15px !important;
        }
      `}</style>
    </div>
  );
};

export default Navbar2;