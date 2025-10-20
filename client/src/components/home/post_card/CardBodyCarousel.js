import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import LikeButton from '../../LikeButton';
import { useSelector, useDispatch } from 'react-redux';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import Carousel from '../../Carousel';
import AuthModalAddLikesCommentsSave from '../../AuthModalAddLikesCommentsSave';
import CardFooterPost from './CardFooterPost';
import ShareModal from '../../ShareModal';
import { BASE_URL } from '../../../utils/config';
import OptionsModal from './OptionsModal';

import CommentsModal from './CommentsModal';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { createReport } from '../../../redux/actions/reportUserAction';

const CardBodyCarousel = ({ post }) => {
  const history = useHistory();
  const location = useLocation();
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const { auth, socket, homeUsers, profile, languageReducer } = useSelector(state => state);
  const dispatch = useDispatch();
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isShare, setIsShare] = useState(false);

  // ✅ NUEVOS ESTADOS PARA HEADER Y COMENTARIOS
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const optionsModalRef = useRef(null);
  const isPostDetailPage = location.pathname === `/post/${post._id}`;

  // Cerrar modal de opciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsModalRef.current && !optionsModalRef.current.contains(event.target)) {
        setShowOptionsModal(false);
      }
    };

    if (showOptionsModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsModal]);

  // Likes
  useEffect(() => {
    if (post.likes.find(like => like._id === auth.user?._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post.likes, auth.user?._id]);

  // ✅ NUEVA LÓGICA MEJORADA PARA COMENTARIOS
  const handleCommentClick = useCallback(() => {
    if (!auth.token) {
      setShowAuthModal(true);
      return;
    }

    const currentPath = window.location.pathname;
    const isOnPostDetail = currentPath === `/post/${post._id}`;

    if (isOnPostDetail) {
      // Si YA estás en el detalle, scroll a comentarios en la página
      const commentsSection = document.getElementById('comments-section');
      if (commentsSection) {
        commentsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Si estás en el HOME, mostrar modal DIRECTAMENTE
      setShowCommentsModal(true);
    }
  }, [auth.token, post._id]);

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

  // ✅ FUNCIONES PARA EL HEADER Y OPCIONES
  const findCompleteUser = useCallback(() => {
    const completeUser = profile.users?.find(u => u._id === post.user?._id);
    return completeUser || post.user;
  }, [post.user, profile.users]);

  const user = findCompleteUser();

  // Verificar si el usuario actual es el dueño del post o es admin
  const isPostOwner = auth.user && post.user && auth.user._id === post.user._id;
  const isAdmin = auth.user && auth.user.role === "admin";

  const adminUser = homeUsers.users?.find(user => user.role === "admin");

  const handleChatWithAdmin = useCallback(() => {
    if (!auth.user) {
      setShowAuthModal(true);
      return;
    }

    if (!adminUser) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'No admin available' }
      });
    }
    handleAddUser(adminUser);
  }, [auth.user, adminUser, dispatch]);

  const handleEditPost = () => {
    history.push('/createpost', { 
      isEdit: true, 
      post: post 
  });

  }
  const handleDeletePost = useCallback(() => {
    if (!auth.user) {
      setShowAuthModal(true);
      return;
    }

    if (window.confirm('Are you sure you want to delete this post?')) {
      // dispatch(deletePost({ post, auth, socket }));
      setShowOptionsModal(false);
    }
  }, [auth.user, post, auth, socket, dispatch]);

  const handleSubmitReport = useCallback(() => {
    if (!auth.user) {
      setShowAuthModal(true);
      return;
    }

    if (!reportReason.trim()) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Report reason is required' }
      });
    }

    const reportData = {
      postId: post._id,
      userId: post.user._id,
      reason: reportReason,
    };

    dispatch(createReport({ auth, reportData }));
    setShowReportModal(false);
    setReportReason('');
    setShowOptionsModal(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Report submitted successfully' }
    });
  }, [auth.user, reportReason, post, auth, dispatch]);

  const handleAddUser = useCallback((user) => {
    if (!auth.user) {
      setShowAuthModal(true);
      return;
    }

    dispatch({ type: MESS_TYPES.ADD_USER, payload: { ...user, text: '', media: [] } });
    history.push(`/message/${user._id}`);
  }, [auth.user, dispatch, history]);

  const handleShare = useCallback(() => {
    setIsShare(true);
    setShowOptionsModal(false);
  }, []);

  const handleContactSeller = useCallback(() => {
    if (!auth.user) {
      setShowAuthModal(true);
      return;
    }
    handleAddUser(post.user);
    setShowOptionsModal(false);
  }, [auth.user, post.user, handleAddUser]);

  const handleSavePostAction = useCallback(async () => {
    if (!auth.user) {
      setShowAuthModal(true);
      return;
    }
    if (saveLoad) return;

    if (saved) {
      setSaveLoad(true);
      await dispatch(unSavePost({ post, auth }));
      setSaveLoad(false);
    } else {
      setSaveLoad(true);
      await dispatch(savePost({ post, auth }));
      setSaveLoad(false);
    }
    setShowOptionsModal(false);
  }, [auth.user, saveLoad, saved, dispatch, post, auth]);

  // Handler para las opciones del modal
  const handleOptionClick = useCallback((option) => {
    switch (option) {
      case 'edit':
        handleEditPost();
        break;
      case 'delete':
        handleDeletePost();
        break;
      case 'contact':
        handleContactSeller();
        break;
      case 'report':
        setShowReportModal(true);
        break;
      case 'share':
        handleShare();
        break;
      case 'save':
        handleSavePostAction();
        break;
      default:
        break;
    }
  }, [handleEditPost, handleDeletePost, handleContactSeller, handleShare, handleSavePostAction]);

  const formatDate = useCallback((dateString) => {
    const lang = languageReducer.language || 'en';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(
      lang === 'es' ? 'es-ES' : lang === 'ar' ? 'ar-AR' : 'en-US',
      options
    );
  }, [languageReducer.language]);

  const redirectToLogin = () => {
    history.push('/login');
    setShowAuthModal(false);
  };

  const redirectToRegister = () => {
    history.push('/register');
    setShowAuthModal(false);
  };

  const closeModal = () => setShowAuthModal(false);

  return (
    <>
      <div className="card" style={{
        marginBottom: '24px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        background: '#ffffff'
      }}>
        {/* ✅ HEADER INTEGRADO - Solo mostrar si NO es página de detalle */}
        {/* ✅ HEADER ESPECIALIZADO PARA APPS */}
        {!isPostDetailPage && (
          <div style={{
            background: "white",
            padding: "12px 16px 8px 16px",
            borderBottom: "1px solid #f0f0f0",
            borderRadius: "12px 12px 0 0",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flex: 1,
                minWidth: 0
              }}>
                {/* ✅ ICONO DE APLICACIÓN */}
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: post.appIcon
                      ? `url(${post.appIcon}) center/cover`
                      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "2px solid #f8f8f8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontWeight: "bold",
                    color: "white",
                    fontSize: "16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                >
                  {!post.appIcon && "📱"}
                </div>

                {/* ✅ INFORMACIÓN DE LA APP */}
                <div style={{
                  minWidth: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}>
                  {/* Nombre de la App */}
                  <span style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#333",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}>
                    {post.title}
                  </span>

                  {/* Metadata de la App */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#666",
                    flexWrap: "wrap"
                  }}>
                    {/* Desarrollador */}
                    <span style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}>
                      <span className="material-icons" style={{
                        fontSize: "12px",
                        color: "#888"
                      }}>
                        person
                      </span>
                      <span>{post.developer || 'Developer'}</span>
                    </span>

                    <span>•</span>

                    {/* Categoría */}
                    <span style={{
                      background: "rgba(102, 126, 234, 0.1)",
                      color: "#667eea",
                      padding: "2px 6px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: "500"
                    }}>
                      {post.category || 'App'}
                    </span>

                    {/* Rating */}
                    {post.rating && (
                      <>
                        <span>•</span>
                        <span style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px"
                        }}>
                          <span className="material-icons" style={{
                            fontSize: "12px",
                            color: "#ffb400"
                          }}>
                            star
                          </span>
                          <span>{post.rating}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de opciones (mantener igual) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptionsModal(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(0, 0, 0, 0.04)";
                  e.target.style.color = "#333";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                  e.target.style.color = "#666";
                }}
              >
                <span className="material-icons" style={{
                  fontSize: "18px"
                }}>
                  more_vert
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Contenido de la imagen */}
        <div className="card__image" onClick={() => history.push(`/post/${post._id}`)}>
          <Carousel images={post.images} id={post._id} />
        </div>

        {/* Acciones */}
        <div className="card__actions">
          <div className="card__actions-left">
            <LikeButton
              isLike={isLike}
              handleLike={handleLike}
              handleUnLike={handleUnLike}
            />
            <span className="card__action-count">{post.likes.length}</span>

            <i className="far fa-comment card__action-icon" onClick={handleCommentClick} />
            <span className="card__action-count">{post.comments.length}</span>

            <i className="fas fa-share card__action-icon" onClick={() => setIsShare(!isShare)} />
          </div>

          <div className="card__actions-right">
            {saved
              ? <i className="fas fa-bookmark card__action-icon" onClick={handleUnSavePost} />
              : <i className="far fa-bookmark card__action-icon" onClick={handleSavePost} />
            }
            <span className="card__action-count">{post.saves || 0}</span>
          </div>
        </div>

        {isShare && <ShareModal url={`${BASE_URL}/post/${post._id}`} />}

        <CardFooterPost post={post} />
      </div>

      {/* ✅ MODALES INTEGRADOS */}
      <OptionsModal
        show={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        innerRef={optionsModalRef}
        isAdmin={isAdmin}
        isPostOwner={isPostOwner}
        saved={saved}
        saveLoad={saveLoad}
        onOptionClick={handleOptionClick}
        onChatWithAdmin={handleChatWithAdmin}
      />

      <CommentsModal
        show={showCommentsModal}
        onHide={() => setShowCommentsModal(false)}
        post={post}
      />



      <AuthModalAddLikesCommentsSave
        showModal={showAuthModal}
        closeModal={closeModal}
        redirectToLogin={redirectToLogin}
        redirectToRegister={redirectToRegister}
      />
    </>
  );
};

export default React.memo(CardBodyCarousel);