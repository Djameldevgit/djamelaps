import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Badge,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  Alert,
  Modal
} from 'react-bootstrap';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unLikePost, savePost, unSavePost, updatePost, deletePost } from '../../../redux/actions/postAction';
import Carousel from '../../Carousel';
import AuthModalAddLikesCommentsSave from '../../AuthModalAddLikesCommentsSave';
import CommentsModal from './CommentsModal';
import ShareModal from '../../ShareModal';
import { BASE_URL } from '../../../utils/config';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { useTranslation } from 'react-i18next';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const CardBodyCarousel = ({ post, hideCard = false }) => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation(['descripcion']);
    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);
    const { auth, socket, theme } = useSelector(state => state);
    const [saved, setSaved] = useState(false);
    const [saveLoad, setSaveLoad] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isShare, setIsShare] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [showDownloadAlert, setShowDownloadAlert] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [showCustomAlert, setShowCustomAlert] = useState(false);
    const [customAlertMessage, setCustomAlertMessage] = useState('');
    const [customAlertVariant, setCustomAlertVariant] = useState('info');
    const [isInstallingPWA, setIsInstallingPWA] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 🔷 NUEVO: Modal para confirmar eliminación

    // Detectar si estamos en la página de detalle del post
    const isDetailPage = location.pathname === `/post/${post._id}`;
    
    // Detectar si es RTL (árabe)
    const isRTL = i18n.language === 'ar';
    const getIconClass = (iconName) => {
        return isRTL ? `${iconName} ms-2` : `${iconName} me-2`;
    };
    const getFlexClass = () => isRTL ? 'flex-row-reverse' : 'flex-row';

    // 🔷 Verificar si el usuario puede editar/eliminar el post (dueño O admin)
    const canEditPost = auth.user && (
        auth.user._id === post.user?._id || 
        auth.user.role === "admin"
    );

    const canDeletePost = auth.user && (
        auth.user._id === post.user?._id || 
        auth.user.role === "admin"
    );

    // 🔷 NUEVA FUNCIÓN: Eliminar post
    const handleDeletePost = async () => {
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }

        if (!canDeletePost) {
            showAlert(t('not_authorized_delete'), 'warning');
            return;
        }

        try {
            // Cerrar el modal de confirmación
            setShowDeleteModal(false);
            
            // Mostrar alerta de carga
            showAlert(t('deleting_post'), 'info');
            
            // Dispatch de la acción deletePost
            await dispatch(deletePost({ post, auth }));
            
            // Mostrar mensaje de éxito
            showAlert(t('post_deleted_success'), 'success');
            
            // Redirigir a home después de eliminar (opcional)
            setTimeout(() => {
                history.push('/');
            }, 1500);
            
        } catch (error) {
            console.error('Error deleting post:', error);
            showAlert(t('error_deleting_post'), 'danger');
        }
    };

    // 🔷 NUEVA FUNCIÓN: Abrir modal de confirmación para eliminar
    const handleDeleteClick = (e) => {
        e?.stopPropagation();
        
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }

        if (!canDeletePost) {
            showAlert(t('not_authorized_delete'), 'warning');
            return;
        }

        setShowDeleteModal(true);
    };

    // 🔷 Función para formatear fecha
    const formatTravelDate = () => {
        if (post.datedepar) {
            return new Date(post.datedepar).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
        return null;
    };

    const travelDate = formatTravelDate();

    // 🔷 Función para obtener icono de agencia
    const getAgencyIcon = () => {
        if (post.promoteurimmobilier) {
            return "fas fa-building text-warning";
        }
        return "fas fa-plane text-primary";
    };

    // Resto del código existente (useEffects y funciones) se mantiene igual...
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // Likes
    useEffect(() => {
        if (post.likes.find(like => like._id === auth.user?._id)) {
            setIsLike(true);
        } else {
            setIsLike(false);
        }
    }, [post.likes, auth.user?._id]);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (loadLike) return;
        setLoadLike(true);
        await dispatch(likePost({ post, auth, socket }));
        setLoadLike(false);
    };

    const handleUnLike = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (loadLike) return;
        setLoadLike(true);
        await dispatch(unLikePost({ post, auth, socket }));
        setLoadLike(false);
    };

    // Saved
    useEffect(() => {
        if (auth.user?.saved.find(id => id === post._id)) {
            setSaved(true);
        } else {
            setSaved(false);
        }
    }, [auth.user?.saved, post._id]);

    const handleSavePost = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (saveLoad) return;
        setSaveLoad(true);
        await dispatch(savePost({ post, auth }));
        setSaveLoad(false);
    };

    const handleUnSavePost = async (e) => {
        e.stopPropagation();
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        if (saveLoad) return;
        setSaveLoad(true);
        await dispatch(unSavePost({ post, auth }));
        setSaveLoad(false);
    };

    const redirectToLogin = () => {
        history.push('/login');
        setShowAuthModal(false);
    };

    const redirectToRegister = () => {
        history.push('/register');
        setShowAuthModal(false);
    };

    const closeModal = () => setShowAuthModal(false);

    const handleViewDetails = () => {
        history.push(`/post/${post._id}`);
    };

    // 🔷 FUNCIÓN PARA MOSTRAR ALERTAS PERSONALIZADAS
    const showAlert = (message, variant = 'info') => {
        setCustomAlertMessage(message);
        setCustomAlertVariant(variant);
        setShowCustomAlert(true);
        setTimeout(() => {
            setShowCustomAlert(false);
        }, 3000);
    };

    // 🔷 LÓGICA MEJORADA PARA CHAT CON EL DUEÑO (CORREGIDA)
    const handleAddUser = useCallback((user) => {
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
        history.push(`/message/${user._id}`);
    }, [auth.user, dispatch, history]);

    // 🔷 FUNCIÓN CORREGIDA - Maneja tanto eventos como llamadas directas
    const handleChatWithOwner = (e) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }

        if (auth.user._id === post.user?._id) {
            showAlert(t('cannot_chat_yourself'), 'warning');
            return;
        }

        handleAddUser(post.user);

        if (socket) {
            socket.emit('createConversation', {
                recipients: [post.user?._id, auth.user._id],
                postId: post._id,
                sender: auth.user
            });
        }
    };

    // Resto de funciones existentes se mantienen igual...
    const handleVisitApp = (e) => {
        e?.stopPropagation();
        const appLink = post.link || post.productionUrl;
        
        if (appLink) {
            const finalUrl = appLink.startsWith('http') ? appLink : `https://${appLink}`;
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
            
            if (window.gtag) {
                window.gtag('event', 'visit_app', {
                    'event_category': 'engagement',
                    'event_label': post.title,
                    'post_id': post._id
                });
            }
            
            showAlert(t('redirecting_to_app'), 'success');
        } else {
            showAlert(t('no_app_link'), 'warning');
        }
    };

    const handleInstallPostPWA = async (e) => {
        e?.stopPropagation();
        
        if (isInstallingPWA) return;
        
        setIsInstallingPWA(true);

        const appLink = post.link || post.productionUrl;
        
        if (!appLink) {
            showAlert(t('no_app_link_available'), 'warning');
            setIsInstallingPWA(false);
            return;
        }

        try {
            const currentOrigin = window.location.origin;
            const targetOrigin = new URL(appLink).origin;
            
            if (currentOrigin === targetOrigin) {
                showAlert(t('cannot_install_current_app'), 'info');
                setIsInstallingPWA(false);
                return;
            }
        } catch (error) {
            console.error('Error parsing URL:', error);
        }

        try {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    showAlert(t('pwa_install_started'), 'success');
                } else {
                    showAlert(t('pwa_install_declined'), 'info');
                }
                
                setDeferredPrompt(null);
            } else {
                const newWindow = window.open(appLink, '_blank', 'noopener,noreferrer');
                
                if (newWindow) {
                    showAlert(t('opening_app_for_installation'), 'success');
                    
                    setTimeout(() => {
                        if (newWindow && !newWindow.closed) {
                            newWindow.close();
                            showAlert(t('pwa_install_guide'), 'info');
                        }
                    }, 8000);
                } else {
                    showAlert(t('popup_blocked'), 'warning');
                    window.open(appLink, '_blank', 'noopener,noreferrer');
                    showAlert(t('check_browser_menu'), 'info');
                }
            }
            
        } catch (error) {
            console.error('Error al instalar la aplicación:', error);
            showAlert(t('error_opening_app'), 'danger');
        } finally {
            setTimeout(() => setIsInstallingPWA(false), 2000);
        }
    };

    // 🔷 **FUNCIÓN DE EDICIÓN MEJORADA**
    const handleEditPost = (e) => {
        e?.stopPropagation();
        
        console.group('🛠 EDIT POST CLICKED');
        console.log('📝 Post Data:', post);
        console.log('👤 Auth User:', auth.user);
        console.log('🔑 Can Edit Result:', canEditPost);
        console.groupEnd();

        if (!auth.user) {
            console.log('❌ No user logged in');
            setShowAuthModal(true);
            return;
        }

        // Verificación directa para mayor seguridad
        const userCanEdit = auth.user && (
            auth.user._id === post.user?._id || 
            auth.user._id === post.user || 
            auth.user.role === "admin"
        );

        if (!userCanEdit) {
            console.log('❌ User cannot edit this post');
            showAlert(t('not_post_owner_or_admin'), 'warning');
            return;
        }

        console.log('✅ User CAN edit, navigating to edit page');
        
        // 🔷 **CAMBIAR LA RUTA: Usar /createpost en lugar de /editpost/:id**
        history.push('/createpost', { 
            isEdit: true,
            postData: {
                ...post,
                // Asegurar que todos los campos necesarios estén presentes
                title: post.title || '',
                description: post.description || post.content || '',
                images: post.images || [],
                category: post.category || 'Agence de Voyage',
                subCategory: post.subCategory || '',
                price: post.price || '',
                wilaya: post.wilaya || '',
                commune: post.commune || '',
                contacto: post.contacto || '',
                datedepar: post.datedepar || '',
                destinacionvoyage1: post.destinacionvoyage1 || '',
                duracionviaje: post.duracionviaje || '',
                transporte: post.transporte || '',
                // Incluir todos los campos de tu schema
            }
        });

        console.log('🎯 Navegación ejecutada a:', '/createpost');
    };

    const handleThreeDotsMenu = (action) => {
        switch (action) {
            case 'contact':
                handleChatWithOwner();
                break;
            case 'install':
                handleInstallPostPWA();
                break;
            case 'visit':
                handleVisitApp();
                break;
            case 'edit':
                handleEditPost();
                break;
            case 'delete': // 🔷 NUEVO: Opción eliminar
                handleDeleteClick();
                break;
            case 'details':
                handleViewDetails();
                break;
            case 'report':
                history.push('/report', { 
                    postId: post._id, 
                    postTitle: post.title 
                });
                break;
            default:
                break;
        }
    };

    // 🔷 NUEVA FUNCIÓN: Compartir en redes sociales
    const handleShare = (platform) => {
        const postUrl = `${BASE_URL}/post/${post._id}`;
        const shareText = `🌍 ${post.title} - Agencia de Viajes`;
        
        let shareUrl = '';
        
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + postUrl)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
                break;
            case 'tiktok':
                // TikTok no tiene API directa de sharing, abrir app o web
                shareUrl = `https://www.tiktok.com/share?url=${encodeURIComponent(postUrl)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(postUrl)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareText)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(postUrl);
                showAlert('Enlace copiado al portapapeles', 'success');
                setShowShareModal(false);
                return;
            default:
                return;
        }
        
        window.open(shareUrl, '_blank', 'width=600,height=400');
        setShowShareModal(false);
    };

    if (isDetailPage && hideCard) {
        return null;
    }

    return (
        <>
            <Card className="border-0 shadow-sm" style={{
                background: theme ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                <Card.Body className="p-0">
                    {/* Alert de descarga */}
                    {showDownloadAlert && (
                        <Alert variant="info" className="py-2 m-3 mb-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <span>{t('downloading_app')}</span>
                                <small>{downloadProgress}%</small>
                            </div>
                            <div className="progress mt-1" style={{ height: '4px' }}>
                                <div 
                                    className="progress-bar progress-bar-striped progress-bar-animated" 
                                    style={{ width: `${downloadProgress}%` }}
                                />
                            </div>
                        </Alert>
                    )}

                    {/* Alert personalizado para mensajes */}
                    {showCustomAlert && (
                        <Alert variant={customAlertVariant} className="py-2 m-3 mb-0">
                            {customAlertMessage}
                        </Alert>
                    )}

                    {/* 🔷 HEADER MEJORADO Y ESTILIZADO */}
                    <div className="p-3 pb-2">
                        <Row className={`align-items-start ${getFlexClass()}`}>
                            <Col>
                                <div className={`d-flex align-items-start gap-3 ${getFlexClass()}`}>
                                    {/* Icono de agencia con mejor estilo */}
                                    <div className="flex-shrink-0">
                                        <div 
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '12px',
                                                background: theme 
                                                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)' 
                                                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: theme ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <i 
                                                className={getAgencyIcon()}
                                                style={{ 
                                                    fontSize: '1.3rem',
                                                    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Título e información mejorados */}
                                    <div style={{ flex: 1 }}>
                                        <Card.Title 
                                            className="mb-2" 
                                            style={{
                                                fontSize: '1.2rem',
                                                fontWeight: '800',
                                                color: theme ? '#fff' : '#1a1a1a',
                                                lineHeight: '1.3',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {post.category}
                                        </Card.Title>
                                        
                                        {/* Información del viaje en fila compacta */}
                                        <div className="d-flex flex-wrap align-items-center gap-3">
                                            {/* 🔷 FECHA DEL VIAJE */}
                                            {travelDate && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="far fa-calendar-alt text-primary small" />
                                                    <small className="fw-semibold" style={{
                                                        color: theme ? '#ccc' : '#666'
                                                    }}>
                                                        {travelDate}
                                                    </small>
                                                </div>
                                            )}
                                            
                                            {/* Destino del viaje */}
                                            {(post.destinacionvoyage1 || post.destinacionhadj) && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="fas fa-map-marker-alt text-danger small" />
                                                    <small className="fw-semibold" style={{
                                                        color: theme ? '#ccc' : '#666'
                                                    }}>
                                                        {post.destinacionvoyage1 || post.destinacionhadj}
                                                    </small>
                                                </div>
                                            )}

                                            {/* Precio si está disponible */}
                                            {post.price && (
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="fas fa-tag text-success small" />
                                                    <small className="fw-bold text-success">
                                                        {post.price} {post.priceType}
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Badge del tipo de aplicación */}
                                        {post.appType && (
                                            <Badge 
                                                bg="primary"
                                                className="mt-2"
                                                style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: '600',
                                                    padding: '4px 8px',
                                                    borderRadius: '8px',
                                                    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                                                    border: 'none'
                                                }}
                                            >
                                                {t(`createpost:app_${post.appType.replace(/-/g, '_')}`, post.appType)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            
                            <Col xs="auto">
                                {/* Menú de tres puntos mejorado */}
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant={theme ? "dark" : "light"} 
                                        size="sm"
                                        className="border-0 shadow-none"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                            padding: '8px',
                                            borderRadius: '10px',
                                            width: '36px',
                                            height: '36px'
                                        }}
                                    >
                                        <i className="fas fa-ellipsis-h" style={{
                                            color: theme ? '#fff' : '#666'
                                        }} />
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className={theme ? 'bg-dark text-light border-0 shadow-lg' : 'shadow-lg border-0'}>
                                        {/* Opciones del menú... */}
                                        <Dropdown.Item 
                                            onClick={() => handleThreeDotsMenu('contact')}
                                            className={theme ? 'text-light' : ''}
                                        >
                                            <i className={getIconClass("fas fa-comments")} />
                                            {t('chat_with_developer')}
                                        </Dropdown.Item>

                                        <Dropdown.Item 
                                            onClick={() => handleThreeDotsMenu('install')}
                                            className={theme ? 'text-light' : ''}
                                            disabled={isInstallingPWA}
                                        >
                                            <i className={getIconClass(isInstallingPWA ? "fas fa-spinner fa-spin" : "fas fa-rocket")} />
                                            {isInstallingPWA ? t('installing_app') : t('install_this_app')}
                                        </Dropdown.Item>

                                        <Dropdown.Item 
                                            onClick={() => handleThreeDotsMenu('visit')}
                                            className={theme ? 'text-light' : ''}
                                        >
                                            <i className={getIconClass("fas fa-external-link-alt")} />
                                            {t('visit_live_app')}
                                        </Dropdown.Item>

                                        <Dropdown.Divider />

                                        {canEditPost && (
                                            <>
                                                <Dropdown.Item 
                                                    onClick={() => handleThreeDotsMenu('edit')}
                                                    className={theme ? 'text-light' : ''}
                                                >
                                                    <i className={getIconClass("fas fa-edit")} />
                                                    {auth.user.role === "admin" ? `${t('edit_post')} (Admin)` : t('edit_post')}
                                                </Dropdown.Item>
                                                
                                                {/* 🔷 NUEVO: Opción Eliminar Post */}
                                                <Dropdown.Item 
                                                    onClick={() => handleThreeDotsMenu('delete')}
                                                    className="text-danger"
                                                >
                                                    <i className={getIconClass("fas fa-trash-alt")} />
                                                    {auth.user.role === "admin" ? `${t('delete_post')} (Admin)` : t('delete_post')}
                                                </Dropdown.Item>
                                                
                                                <Dropdown.Divider />
                                            </>
                                        )}

                                        <Dropdown.Item 
                                            onClick={() => handleThreeDotsMenu('details')}
                                            className={theme ? 'text-light' : ''}
                                        >
                                            <i className={getIconClass("fas fa-info-circle")} />
                                            {t('view_details')}
                                        </Dropdown.Item>

                                        <Dropdown.Divider />

                                        <Dropdown.Item 
                                            onClick={() => handleThreeDotsMenu('report')}
                                            className="text-danger"
                                        >
                                            <i className={getIconClass("fas fa-flag")} />
                                            {t('report')}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </div>

                    {/* 🔷 CONTENEDOR DEL CAROUSEL CON ICONOS SUPERPUESTOS */}
                    <div className="position-relative">
                        {/* Carousel */}
                        <div 
                            className="card-image"
                            onClick={() => !isDetailPage && history.push(`/post/${post._id}`)}
                            style={{ cursor: isDetailPage ? 'default' : 'pointer' }}
                        >
                            <Carousel images={post.images} id={post._id} />
                        </div>

                        {/* 🔷 ICONOS EN COLUMNA A LA DERECHA - SOLO LIKE, SAVE Y SHARE */}
                        {!isDetailPage && (
                            <div 
                                className="position-absolute"
                                style={{
                                    bottom: '20px',
                                    right: '15px',
                                    zIndex: 10
                                }}
                            >
                                <div className="d-flex flex-column align-items-center gap-3">
                                    {/* Like */}
                                    <div className="text-center">
                                        <div 
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                borderRadius: '50%',
                                                width: '48px',
                                                height: '48px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)'
                                            }}
                                        >
                                            <LikeButton
                                                isLike={isLike}
                                                handleLike={handleLike}
                                                handleUnLike={handleUnLike}
                                                size="lg"
                                                iconStyle={{ 
                                                    color: '#fff',
                                                    fontSize: '1.2rem'
                                                }}
                                            />
                                        </div>
                                        <div 
                                            className="fw-bold mt-1 small"
                                            style={{ 
                                                color: '#fff',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            {post.likes.length}
                                        </div>
                                    </div>

                                    {/* Save */}
                                    <div className="text-center">
                                        <div 
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                borderRadius: '50%',
                                                width: '48px',
                                                height: '48px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={saved ? handleUnSavePost : handleSavePost}
                                        >
                                            <i 
                                                className={saved ? "fas fa-bookmark" : "far fa-bookmark"}
                                                style={{ 
                                                    fontSize: '1.2rem',
                                                    color: saved ? '#ffc107' : '#fff'
                                                }}
                                            />
                                        </div>
                                        <div 
                                            className="fw-bold mt-1 small"
                                            style={{ 
                                                color: '#fff',
                                                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            {post.saves || 0}
                                        </div>
                                    </div>

                                    {/* Share */}
                                    <div className="text-center">
                                        <div 
                                            style={{
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                borderRadius: '50%',
                                                width: '48px',
                                                height: '48px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setShowShareModal(true)}
                                        >
                                            <i 
                                                className="fas fa-share-alt"
                                                style={{ 
                                                    fontSize: '1.2rem',
                                                    color: '#fff'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 🔷 BOTÓN VER DETALLES DEBAJO DEL CAROUSEL */}
                    {!isDetailPage && (
                        <div className="p-3 pt-2">
                            <Button
                                variant="primary"
                                className="w-100 py-3"
                                onClick={handleViewDetails}
                                style={{
                                    fontWeight: '700',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                <i className={getIconClass("fas fa-eye")} />
                                {t('view_full_details')}
                            </Button>
                        </div>
                    )}
                </Card.Body>

                {/* 🔷 NUEVO: Modal de confirmación para eliminar post */}
                <Modal 
                    show={showDeleteModal} 
                    onHide={() => setShowDeleteModal(false)}
                    centered
                    className={theme ? 'dark-modal' : ''}
                >
                    <Modal.Header 
                        closeButton 
                        className={theme ? 'bg-dark text-light border-secondary' : ''}
                    >
                        <Modal.Title>
                            <i className={getIconClass("fas fa-exclamation-triangle text-warning")} />
                            {t('confirm_delete')}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={theme ? 'bg-dark text-light' : ''}>
                        <div className="text-center">
                            <i className="fas fa-trash-alt text-danger mb-3" style={{ fontSize: '3rem' }} />
                            <h5 className="mb-3">{t('delete_post_question')}</h5>
                            <p className="text-muted">
                                "{post.title || post.category}"
                            </p>
                            <p className="small text-warning">
                                <i className="fas fa-exclamation-circle me-2" />
                                {t('delete_warning')}
                            </p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className={theme ? 'bg-dark border-secondary' : ''}>
                        <Button 
                            variant="secondary" 
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4"
                        >
                            <i className={getIconClass("fas fa-times")} />
                            {t('cancel')}
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={handleDeletePost}
                            className="px-4"
                        >
                            <i className={getIconClass("fas fa-trash-alt")} />
                            {t('delete_confirm')}
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* 🔷 MODAL DE COMPARTIR PROFESIONAL */}
                <Modal 
                    show={showShareModal} 
                    onHide={() => setShowShareModal(false)}
                    centered
                    className={theme ? 'dark-modal' : ''}
                >
                    <Modal.Header 
                        closeButton 
                        className={theme ? 'bg-dark text-light border-secondary' : ''}
                    >
                        <Modal.Title>
                            <i className={getIconClass("fas fa-share-alt")} />
                            Compartir Viaje
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={theme ? 'bg-dark text-light' : ''}>
                        <div className="text-center">
                            <p className="mb-4">Comparte este increíble viaje con tus amigos</p>
                            
                            <div className="row g-3">
                                {/* WhatsApp */}
                                <div className="col-4">
                                    <div 
                                        className="share-option p-3 rounded-3 text-center cursor-pointer"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(37, 211, 102, 0.1)',
                                            border: theme ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(37, 211, 102, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleShare('whatsapp')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-5px)';
                                            e.target.style.background = theme 
                                                ? 'rgba(37, 211, 102, 0.2)' 
                                                : 'rgba(37, 211, 102, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.background = theme 
                                                ? 'rgba(255,255,255,0.1)' 
                                                : 'rgba(37, 211, 102, 0.1)';
                                        }}
                                    >
                                        <i 
                                            className="fab fa-whatsapp mb-2" 
                                            style={{ fontSize: '2rem', color: '#25D366' }}
                                        />
                                        <div className="small fw-semibold">WhatsApp</div>
                                    </div>
                                </div>
                                
                                {/* Facebook */}
                                <div className="col-4">
                                    <div 
                                        className="share-option p-3 rounded-3 text-center cursor-pointer"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(59, 89, 152, 0.1)',
                                            border: theme ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(59, 89, 152, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleShare('facebook')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-5px)';
                                            e.target.style.background = theme 
                                                ? 'rgba(59, 89, 152, 0.2)' 
                                                : 'rgba(59, 89, 152, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.background = theme 
                                                ? 'rgba(255,255,255,0.1)' 
                                                : 'rgba(59, 89, 152, 0.1)';
                                        }}
                                    >
                                        <i 
                                            className="fab fa-facebook mb-2" 
                                            style={{ fontSize: '2rem', color: '#3b5998' }}
                                        />
                                        <div className="small fw-semibold">Facebook</div>
                                    </div>
                                </div>
                                
                                {/* TikTok */}
                                <div className="col-4">
                                    <div 
                                        className="share-option p-3 rounded-3 text-center cursor-pointer"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0, 0, 0, 0.1)',
                                            border: theme ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0, 0, 0, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleShare('tiktok')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-5px)';
                                            e.target.style.background = theme 
                                                ? 'rgba(0, 0, 0, 0.2)' 
                                                : 'rgba(0, 0, 0, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.background = theme 
                                                ? 'rgba(255,255,255,0.1)' 
                                                : 'rgba(0, 0, 0, 0.1)';
                                        }}
                                    >
                                        <i 
                                            className="fab fa-tiktok mb-2" 
                                            style={{ fontSize: '2rem', color: '#000' }}
                                        />
                                        <div className="small fw-semibold">TikTok</div>
                                    </div>
                                </div>
                                
                                {/* Twitter */}
                                <div className="col-4">
                                    <div 
                                        className="share-option p-3 rounded-3 text-center cursor-pointer"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(29, 161, 242, 0.1)',
                                            border: theme ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(29, 161, 242, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleShare('twitter')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-5px)';
                                            e.target.style.background = theme 
                                                ? 'rgba(29, 161, 242, 0.2)' 
                                                : 'rgba(29, 161, 242, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.background = theme 
                                                ? 'rgba(255,255,255,0.1)' 
                                                : 'rgba(29, 161, 242, 0.1)';
                                        }}
                                    >
                                        <i 
                                            className="fab fa-twitter mb-2" 
                                            style={{ fontSize: '2rem', color: '#1da1f2' }}
                                        />
                                        <div className="small fw-semibold">Twitter</div>
                                    </div>
                                </div>
                                
                                {/* Telegram */}
                                <div className="col-4">
                                    <div 
                                        className="share-option p-3 rounded-3 text-center cursor-pointer"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(0, 136, 204, 0.1)',
                                            border: theme ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0, 136, 204, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleShare('telegram')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-5px)';
                                            e.target.style.background = theme 
                                                ? 'rgba(0, 136, 204, 0.2)' 
                                                : 'rgba(0, 136, 204, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.background = theme 
                                                ? 'rgba(255,255,255,0.1)' 
                                                : 'rgba(0, 136, 204, 0.1)';
                                        }}
                                    >
                                        <i 
                                            className="fab fa-telegram mb-2" 
                                            style={{ fontSize: '2rem', color: '#0088cc' }}
                                        />
                                        <div className="small fw-semibold">Telegram</div>
                                    </div>
                                </div>
                                
                                {/* Copiar enlace */}
                                <div className="col-4">
                                    <div 
                                        className="share-option p-3 rounded-3 text-center cursor-pointer"
                                        style={{
                                            background: theme ? 'rgba(255,255,255,0.1)' : 'rgba(108, 117, 125, 0.1)',
                                            border: theme ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(108, 117, 125, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleShare('copy')}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-5px)';
                                            e.target.style.background = theme 
                                                ? 'rgba(108, 117, 125, 0.2)' 
                                                : 'rgba(108, 117, 125, 0.15)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.background = theme 
                                                ? 'rgba(255,255,255,0.1)' 
                                                : 'rgba(108, 117, 125, 0.1)';
                                        }}
                                    >
                                        <i 
                                            className="fas fa-link mb-2" 
                                            style={{ fontSize: '2rem', color: theme ? '#fff' : '#6c757d' }}
                                        />
                                        <div className="small fw-semibold">Copiar</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </Card>

            <AuthModalAddLikesCommentsSave
                showModal={showAuthModal}
                closeModal={closeModal}
                redirectToLogin={redirectToLogin}
                redirectToRegister={redirectToRegister}
            />
        </>
    );
};

export default CardBodyCarousel;