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
  Alert
} from 'react-bootstrap';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unLikePost, savePost, unSavePost, updatePost } from '../../../redux/actions/postAction';
import Carousel from '../../Carousel';
import AuthModalAddLikesCommentsSave from '../../AuthModalAddLikesCommentsSave';
import CommentsModal from './CommentsModal';
import ShareModal from '../../ShareModal';
import { BASE_URL } from '../../../utils/config';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { useTranslation } from 'react-i18next';

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

    // Detectar si estamos en la página de detalle del post
    const isDetailPage = location.pathname === `/post/${post._id}`;
    
    // Detectar si es RTL (árabe)
    const isRTL = i18n.language === 'ar';
    const getIconClass = (iconName) => {
        return isRTL ? `${iconName} ms-2` : `${iconName} me-2`;
    };
    const getFlexClass = () => isRTL ? 'flex-row-reverse' : 'flex-row';

    // 🔷 **MEJORADO: Verificación robusta de permisos de edición**
    const canEditPost = useCallback(() => {
        if (!auth.user || !post) {
            console.log('❌ No auth user or post');
            return false;
        }
        
        // Debug de la estructura
        console.log('🔍 DEBUG Edit Permissions:', {
            authUserId: auth.user._id,
            postUser: post.user,
            postUserId: post.user?._id,
            userRole: auth.user.role,
            isSameUser: auth.user._id === post.user?._id,
            isSameUserId: auth.user._id === post.user,
            isAdmin: auth.user.role === "admin"
        });

        const isOwner = 
            auth.user._id === post.user?._id || 
            auth.user._id === post.user; // Por si post.user es solo el ID string

        const isAdmin = auth.user.role === "admin";

        const canEdit = isOwner || isAdmin;
        
        console.log('✅ Can Edit Result:', { isOwner, isAdmin, canEdit });
        
        return canEdit;
    }, [auth.user, post]);

    // 🔷 Detectar PWA
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

    const handleCommentClick = useCallback(() => {
        if (!auth.token) {
            setShowAuthModal(true);
            return;
        }

        const currentPath = window.location.pathname;
        const isOnPostDetail = currentPath === `/post/${post._id}`;

        if (isOnPostDetail) {
            const commentsSection = document.getElementById('comments-section');
            if (commentsSection) {
                commentsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            setShowCommentsModal(true);
        }
    }, [auth.token, post._id]);

    // 🔷 FUNCIÓN PARA MOSTRAR ALERTAS PERSONALIZADAS
    const showAlert = (message, variant = 'info') => {
        setCustomAlertMessage(message);
        setCustomAlertVariant(variant);
        setShowCustomAlert(true);
        setTimeout(() => {
            setShowCustomAlert(false);
        }, 3000);
    };

    // 🔷 LÓGICA MEJORADA PARA CHAT CON EL DUEÑO
    const handleAddUser = useCallback((user) => {
        if (!auth.user) {
            setShowAuthModal(true);
            return;
        }
        dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
        history.push(`/message/${user._id}`);
    }, [auth.user, dispatch, history]);

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

    // 🔷 VISITAR APP CON CAMPO LINK
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

    // 🔷 INSTALAR PWA
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

    // 🔷 **MEJORADO: Función de edición con debug completo**
    const handleEditPost = (e) => {
        e?.stopPropagation();
        
        console.group('🛠 EDIT POST CLICKED');
        console.log('📝 Post Data:', post);
        console.log('👤 Auth User:', auth.user);
        console.log('🔑 Can Edit Result:', canEditPost());
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
        
        // Preparar datos del post para edición
        const postToEdit = {
            ...post,
            user: post.user || auth.user,
            // Asegurar que todos los campos necesarios estén presentes
            title: post.title || '',
            description: post.description || '',
            images: post.images || [],
            link: post.link || '',
            productionUrl: post.productionUrl || '',
            appType: post.appType || 'web-app'
        };

        console.log('📤 Post data sent to edit:', postToEdit);

        // Navegar a la página de edición
        history.push('/createpost', { 
            isEdit: true, 
            post: postToEdit 
        });
    };

    // 🔷 FUNCIÓN PARA DESCARGAR APP
    const handleDownloadApp = async (e) => {
        e.stopPropagation();
        
        const isChrome = /Chrome/.test(navigator.userAgent);
        const isEdge = /Edg/.test(navigator.userAgent);
        
        if (!isChrome && !isEdge) {
            showAlert(t('browser_not_supported'), 'warning');
        }

        setShowDownloadAlert(true);
        setDownloadProgress(0);

        const progressInterval = setInterval(() => {
            setDownloadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        try {
            if (post.appDownloadUrl) {
                window.open(post.appDownloadUrl, '_blank', 'noopener,noreferrer');
            } else {
                showAlert(t('no_download_url'), 'info');
            }

            setTimeout(() => {
                setDownloadProgress(100);
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    setShowDownloadAlert(false);
                    setDownloadProgress(0);
                }, 3000);
            }, 2000);

        } catch (error) {
            console.error('Error en la descarga:', error);
            showAlert(t('download_error'), 'danger');
            clearInterval(progressInterval);
            setShowDownloadAlert(false);
        }
    };

    // 🔷 AGREGAR OPCIÓN DE CHAT Y EDITAR AL MENÚ
    const handleThreeDotsMenu = (action) => {
        console.log('📍 Three dots menu action:', action);
        
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

    // 🔷 DEBUG: Log de renderizado
    useEffect(() => {
        console.log('🔄 CardBodyCarousel rendered:', {
            postId: post._id,
            postTitle: post.title,
            postUser: post.user,
            authUser: auth.user?._id,
            canEdit: canEditPost(),
            isDetailPage: isDetailPage
        });
    }, [post, auth.user, isDetailPage]);

    // Si estamos en la página de detalle y hideCard es true, no mostrar el card
    if (isDetailPage && hideCard) {
        return null;
    }

    return (
        <>
            <Card className="border-0 shadow-sm" style={{
                background: theme ? 'rgba(30, 30, 30, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(10px)'
            }}>
                <Card.Body className="p-3">
                    {/* Alert de descarga */}
                    {showDownloadAlert && (
                        <Alert variant="info" className="py-2 mb-3">
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
                        <Alert variant={customAlertVariant} className="py-2 mb-3">
                            {customAlertMessage}
                        </Alert>
                    )}

                    {/* Header con título y acciones */}
                    <Row className={`align-items-center mb-3 ${getFlexClass()}`}>
                        <Col>
                            <div className={`d-flex align-items-center gap-2 ${getFlexClass()}`}>
                                {/* Icono de aplicación web */}
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>{t('web_application')}</Tooltip>}
                                >
                                    <i 
                                        className="fas fa-globe text-primary"
                                        style={{ fontSize: '1.1rem' }}
                                    />
                                </OverlayTrigger>
                                
                                <div style={{ flex: 1 }}>
                                    <Card.Title 
                                        className="mb-0" 
                                        style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            color: theme ? '#fff' : '#1a1a1a',
                                            lineHeight: '1.3',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                    >
                                        {post.title}
                                    </Card.Title>
                                    
                                    {/* Badge del tipo de aplicación */}
                                    {post.appType && (
                                        <Badge 
                                            bg="outline-primary" 
                                            text="primary" 
                                            className="mt-1"
                                            style={{
                                                border: '1px solid #007bff',
                                                fontSize: '0.75rem',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {t(`createpost:app_${post.appType.replace(/-/g, '_')}`, post.appType)}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </Col>
                        
                        <Col xs="auto">
                            {/* Menú de tres puntos */}
                            <Dropdown>
                                <Dropdown.Toggle 
                                    variant={theme ? "dark" : "light"} 
                                    size="sm"
                                    className="border-0 shadow-none"
                                    style={{
                                        background: 'transparent',
                                        padding: '4px 8px'
                                    }}
                                >
                                    <i className="fas fa-ellipsis-h text-muted" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={theme ? 'bg-dark text-light' : ''}>
                                    {/* Chat con el dueño */}
                                    <Dropdown.Item 
                                        onClick={() => handleThreeDotsMenu('contact')}
                                        className={theme ? 'text-light' : ''}
                                    >
                                        <i className={getIconClass("fas fa-comments")} />
                                        {t('chat_with_developer')}
                                    </Dropdown.Item>

                                    {/* Instalar PWA */}
                                    <Dropdown.Item 
                                        onClick={() => handleThreeDotsMenu('install')}
                                        className={theme ? 'text-light' : ''}
                                        disabled={isInstallingPWA}
                                    >
                                        <i className={getIconClass(isInstallingPWA ? "fas fa-spinner fa-spin" : "fas fa-rocket")} />
                                        {isInstallingPWA ? t('installing_app') : t('install_this_app')}
                                    </Dropdown.Item>

                                    {/* Visitar aplicación */}
                                    <Dropdown.Item 
                                        onClick={() => handleThreeDotsMenu('visit')}
                                        className={theme ? 'text-light' : ''}
                                    >
                                        <i className={getIconClass("fas fa-external-link-alt")} />
                                        {t('visit_live_app')}
                                    </Dropdown.Item>

                                    <Dropdown.Divider />

                                    {/* 🔷 **BOTÓN DE EDICIÓN MEJORADO** */}
                                    {canEditPost() && (
                                        <Dropdown.Item 
                                            onClick={() => {
                                                console.log('✏️ Edit button clicked directly');
                                                handleEditPost();
                                            }}
                                            className={theme ? 'text-light' : ''}
                                            style={{
                                                backgroundColor: theme ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 193, 7, 0.1)',
                                                borderLeft: `3px solid #ffc107`
                                            }}
                                        >
                                            <i className={getIconClass("fas fa-edit")} />
                                            {auth.user.role === "admin" 
                                                ? `${t('edit_post')} (Admin)` 
                                                : t('edit_post')
                                            }
                                        </Dropdown.Item>
                                    )}

                                    {/* Ver detalles */}
                                    <Dropdown.Item 
                                        onClick={() => handleThreeDotsMenu('details')}
                                        className={theme ? 'text-light' : ''}
                                    >
                                        <i className={getIconClass("fas fa-info-circle")} />
                                        {t('view_details')}
                                    </Dropdown.Item>

                                    {/* Compartir */}
                                    <Dropdown.Item 
                                        onClick={() => setIsShare(true)}
                                        className={theme ? 'text-light' : ''}
                                    >
                                        <i className={getIconClass("fas fa-share")} />
                                        {t('share')}
                                    </Dropdown.Item>

                                    <Dropdown.Divider />

                                    {/* Reportar */}
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

                    {/* Carousel */}
                    <div 
                        className="card-image mb-3 rounded overflow-hidden"
                        onClick={() => !isDetailPage && history.push(`/post/${post._id}`)}
                        style={{ cursor: isDetailPage ? 'default' : 'pointer' }}
                    >
                        <Carousel images={post.images} id={post._id} />
                    </div>

                    {/* Acciones - SOLO SI NO ESTAMOS EN DETALLE */}
                    {!isDetailPage && (
                        <>
                            <Row className={`align-items-center mb-3 ${getFlexClass()}`}>
                                <Col>
                                    <div className={`d-flex align-items-center gap-3 ${getFlexClass()}`}>
                                        <div className="d-flex align-items-center gap-2">
                                            <LikeButton
                                                isLike={isLike}
                                                handleLike={handleLike}
                                                handleUnLike={handleUnLike}
                                            />
                                            <span className="text-muted small fw-semibold">
                                                {post.likes.length}
                                            </span>
                                        </div>
                                        
                                        <div 
                                            className="d-flex align-items-center gap-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleCommentClick}
                                        >
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>{t('comment')}</Tooltip>}
                                            >
                                                <i className="far fa-comment text-muted" />
                                            </OverlayTrigger>
                                            <span className="text-muted small fw-semibold">
                                                {post.comments?.length || 0}
                                            </span>
                                        </div>

                                        {/* Compartir */}
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>{t('share')}</Tooltip>}
                                        >
                                            <i 
                                                className="fas fa-share-alt text-muted"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setIsShare(!isShare)}
                                            />
                                        </OverlayTrigger>
                                    </div>
                                </Col>
                                
                                <Col xs="auto">
                                    <div className="d-flex align-items-center gap-2">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>{saved ? t('unsave_post') : t('save_post')}</Tooltip>}
                                        >
                                            <i 
                                                className={saved ? "fas fa-bookmark text-warning" : "far fa-bookmark text-muted"}
                                                style={{ cursor: 'pointer', fontSize: '1.1rem' }}
                                                onClick={saved ? handleUnSavePost : handleSavePost}
                                            />
                                        </OverlayTrigger>
                                        <span className="text-muted small fw-semibold">
                                            {post.saves || 0}
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            {/* Botón Ver Detalles */}
                            <Button
                                variant="outline-primary"
                                className="w-100 py-2"
                                onClick={handleViewDetails}
                                style={{
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    borderWidth: '2px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                <i className={getIconClass("fas fa-external-link-alt")} />
                                {t('view_full_details')}
                            </Button>
                        </>
                    )}
                </Card.Body>

                {/* Modales */}
                <CommentsModal
                    show={showCommentsModal}
                    onHide={() => setShowCommentsModal(false)}
                    post={post}
                    onClick={handleCommentClick}
                />

                {isShare && (
                    <ShareModal 
                        url={`${BASE_URL}/post/${post._id}`} 
                        onClose={() => setIsShare(false)}
                    />
                )}
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