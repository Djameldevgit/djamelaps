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
  FaDownload,
  FaRocket,
  FaMobileAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { Navbar, Container, NavDropdown, Badge, Alert, Tooltip, OverlayTrigger } from 'react-bootstrap';
import LanguageSelectorpc from '../LanguageSelectorpc';

const Navbar2 = () => {
  const { auth, cart, notify, settings } = useSelector((state) => state);
  const history = useHistory();
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('navbar2');
  const lang = languageReducer.language || 'es';
  
  const [userRole, setUserRole] = useState(auth.user?.role);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  
  // ✅ ESTADOS PWA MEJORADOS
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstallAlert, setShowInstallAlert] = useState(false);
  const [installAlertMessage, setInstallAlertMessage] = useState('');
  const [pwaStatus, setPwaStatus] = useState('checking');
  const [showPwaTooltip, setShowPwaTooltip] = useState(false);

  // ✅ EFFECT PRINCIPAL PWA MEJORADO
  useEffect(() => {
    console.log('🚀 Iniciando configuración PWA...');
    
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎯 Evento beforeinstallprompt capturado!', e);
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      setPwaStatus('ready');
      
      // DEBUG: Mostrar en consola para testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 PWA DEBUG - Prompt disponible:', {
          platforms: e.platforms,
          canInstall: true
        });
      }
    };

    const handleAppInstalled = () => {
      console.log('🎉 PWA instalada exitosamente!');
      setDeferredPrompt(null);
      setCanInstall(false);
      setPwaStatus('installed');
      showInstallMessage(
        t('pwa_install_success') || '¡App instalada correctamente! ¡Disfruta de la experiencia PWA!', 
        'success'
      );
    };

    // Verificar si ya está instalada
    const checkIfInstalled = () => {
      const installed = isAppInstalled();
      console.log('📱 Verificando instalación PWA:', installed);
      
      if (installed) {
        setPwaStatus('installed');
        setCanInstall(false);
      } else {
        setPwaStatus('not_installed');
      }
    };

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar instalación inicial
    checkIfInstalled();

    // En desarrollo, simular evento después de 3 segundos
    if (process.env.NODE_ENV === 'development' && !deferredPrompt) {
      const simTimeout = setTimeout(() => {
        if (!deferredPrompt && pwaStatus === 'checking') {
          console.log('🔄 Desarrollo: Simulando verificación PWA...');
          // Solo cambiar estado, no simular evento real
          setPwaStatus('not_installed');
        }
      }, 3000);
      
      return () => clearTimeout(simTimeout);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [t, deferredPrompt, pwaStatus]);

  // ✅ EFFECT PARA IDIOMA
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // ✅ EFFECT PARA ROL DE USUARIO
  useEffect(() => {
    if (auth.user?.role && auth.user.role !== userRole) {
      setUserRole(auth.user.role);
    }
  }, [auth.user?.role, userRole]);

  // ✅ EFFECT PARA RESPONSIVE
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ EFFECT PARA DEBUG PWA
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 PWA STATE UPDATE:', {
        canInstall,
        deferredPrompt: !!deferredPrompt,
        pwaStatus,
        isInstalling,
        isAppInstalled: isAppInstalled()
      });
    }
  }, [canInstall, deferredPrompt, pwaStatus, isInstalling]);

  // ✅ FUNCIÓN MEJORADA DE INSTALACIÓN
  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      showInstallMessage(
        t('pwa_not_supported') || 'Tu navegador no soporta instalación de apps. Usa Chrome, Edge o Safari.', 
        'warning'
      );
      return;
    }

    if (isInstalling) {
      showInstallMessage('La instalación ya está en progreso...', 'info');
      return;
    }

    setIsInstalling(true);
    setShowPwaTooltip(false);

    try {
      console.log('📲 Ejecutando prompt de instalación...');
      
      // Mostrar el prompt nativo
      deferredPrompt.prompt();
      
      // Esperar la decisión del usuario
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('📋 Resultado de instalación:', outcome);
      
      if (outcome === 'accepted') {
        showInstallMessage(
          t('pwa_install_started') || '¡Instalación iniciada! La app se agregará a tu pantalla de inicio.', 
          'success'
        );
        
        // Analytics o tracking podría ir aquí
        if (window.gtag) {
          window.gtag('event', 'pwa_install_accepted');
        }
      } else {
        showInstallMessage(
          t('pwa_install_declined') || 'Instalación cancelada. Puedes instalar la app luego desde el menú.', 
          'info'
        );
        
        // Reactivar el botón después de un tiempo
        setTimeout(() => {
          setCanInstall(true);
        }, 30000); // 30 segundos
      }
      
      // Limpiar el prompt independientemente del resultado
      setDeferredPrompt(null);
      
    } catch (error) {
      console.error('❌ Error durante la instalación PWA:', error);
      showInstallMessage(
        t('pwa_install_error') || 'Error durante la instalación. Intenta nuevamente.', 
        'danger'
      );
      
      // Reactivar en caso de error
      setCanInstall(true);
    } finally {
      setIsInstalling(false);
    }
  };

  // ✅ FUNCIÓN MEJORADA DE VERIFICACIÓN DE INSTALACIÓN
  const isAppInstalled = () => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = window.navigator.standalone;
    const isReferrer = document.referrer.includes('android-app://');
    
    const installed = isStandalone || isNavigatorStandalone || isReferrer;
    
    if (installed) {
      console.log('🏠 PWA detectada como instalada');
    }
    
    return installed;
  };

  // ✅ FUNCIÓN MEJORADA DE MENSAJES
  const showInstallMessage = (message, variant = 'info') => {
    setInstallAlertMessage(message);
    setShowInstallAlert(true);
    
    // Auto-ocultar después de tiempo según el tipo
    const timeout = variant === 'success' ? 5000 : 4000;
    setTimeout(() => {
      setShowInstallAlert(false);
    }, timeout);
  };

  // ✅ RENDER CONDICIONAL DEL BOTÓN PWA
  const renderPWAButton = () => {
    // Si ya está instalado, no mostrar botón
    if (isAppInstalled()) {
      return (
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="pwa-installed-tooltip">
              {t('pwa_already_installed') || 'App ya instalada'}
            </Tooltip>
          }
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: isMobile ? '40px' : '45px',
              height: isMobile ? '40px' : '45px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              cursor: 'default'
            }}
          >
            <FaCheckCircle size={isMobile ? 18 : 20} style={{ color: 'white' }} />
          </div>
        </OverlayTrigger>
      );
    }

    // Si puede instalar, mostrar botón de instalación
    if (canInstall) {
      const tooltipText = isInstalling 
        ? (t('pwa_installing') || 'Instalando...')
        : (t('install_app') || 'Instalar App en tu dispositivo');

      return (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="pwa-install-tooltip">{tooltipText}</Tooltip>}
        >
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
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              opacity: isInstalling ? 0.8 : 1,
              animation: isInstalling ? 'none' : 'pulse 2s infinite'
            }}
          >
            {isInstalling ? (
              <div className="spinner-border spinner-border-sm" style={{ color: 'white' }} />
            ) : (
              <FaDownload size={isMobile ? 18 : 20} style={{ color: 'white' }} />
            )}
          </div>
        </OverlayTrigger>
      );
    }

    // Si no puede instalar pero está en desarrollo, mostrar botón informativo
    if (process.env.NODE_ENV === 'development' && pwaStatus === 'not_installed') {
      return (
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="pwa-dev-tooltip">
              PWA disponible en producción o con HTTPS
            </Tooltip>
          }
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: isMobile ? '40px' : '45px',
              height: isMobile ? '40px' : '45px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
              cursor: 'help'
            }}
          >
            <FaMobileAlt size={isMobile ? 18 : 20} style={{ color: 'white' }} />
          </div>
        </OverlayTrigger>
      );
    }

    return null;
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

  // MenuItem simplificado
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
      {/* ✅ ALERT MEJORADO PARA MENSAJES PWA */}
      {showInstallAlert && (
        <Alert 
          variant={
            installAlertMessage.includes('éxito') || installAlertMessage.includes('correctamente') ? 'success' : 
            installAlertMessage.includes('Error') || installAlertMessage.includes('error') ? 'danger' :
            installAlertMessage.includes('cancelada') ? 'info' : 'warning'
          }
          className="mb-0 text-center py-2 fade-in"
          style={{
            position: 'fixed',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '90%',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <div className="d-flex align-items-center justify-content-center">
            {installAlertMessage.includes('éxito') && <FaCheckCircle className="me-2" />}
            {installAlertMessage.includes('Error') && <FaRocket className="me-2" />}
            {installAlertMessage}
          </div>
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
                {t('appName')} {process.env.NODE_ENV === 'development' && '(Dev)'}
              </Card.Title>
            </Navbar.Brand>
          </div>

          {/* Iconos de navegación */}
          <div className="d-flex align-items-center" style={{ gap: isMobile ? '8px' : '16px' }}>
            {/* Selector de idioma para desktop */}
            <div className="d-none d-lg-block">
              <LanguageSelectorpc />
            </div>

            {/* ✅ BOTÓN PWA MEJORADO */}
            {renderPWAButton()}

            {/* Botón Agregar Post */}
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
                <FaPlus size={isMobile ? 18 : 20} style={{ color: 'white' }} />
              </div>
            )}

            {/* Messenger */}
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

            {/* Notificaciones */}
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

            {/* Avatar o Dropdown */}
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

      {/* CSS MEJORADO */}
      <style jsx>{`
        .icon-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
        }

        .custom-menu-item:hover {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
          transform: translateX(4px);
        }

        .dropdown-menu {
          border: none !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
          border-radius: 15px !important;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};

export default Navbar2;