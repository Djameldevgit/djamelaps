// src/pages/CreatePost.js
import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { createPost, updatePost } from '../redux/actions/postAction'
import { useTranslation } from 'react-i18next'
import { 
    Form, 
    Button, 
    Card, 
    Container, 
    Row, 
    Col, 
    Badge,
    Alert,
    FloatingLabel
} from 'react-bootstrap'

const CreatePost = () => {
    const { auth, theme, socket, posts } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()
    const { t, i18n } = useTranslation('createpost')
    
    const currentLanguage = i18n.language || 'en'
    const isRTL = ['ar', 'he'].includes(currentLanguage)

    const isEditMode = !!id

    const [postData, setPostData] = useState({
        content: '',
        images: [],
        title: '',
        unidaddeprecio: '',
        oferta: '',
        features: []
    })

    // Estilos inline MEJORADOS
    const styles = {
        container: {
            minHeight: '100vh',
            padding: '20px 0',
            backgroundColor: '#f8f9fa',
            direction: isRTL ? 'rtl' : 'ltr'
        },
        card: {
            border: 'none',
            borderRadius: '15px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden',
            background: theme ? '#1a1a1a' : '#ffffff'
        },
        // 🔥 HEADER MEJORADO
        cardHeader: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '25px 30px',
            borderBottom: 'none',
            textAlign: isRTL ? 'right' : 'left',
            position: 'relative',
            overflow: 'hidden'
        },
        cardHeaderOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)'
        },
        cardBody: {
            padding: '30px',
            background: theme ? '#1a1a1a' : '#ffffff'
        },
        formLabel: {
            fontWeight: '600',
            marginBottom: '8px',
            color: theme ? '#ffffff' : '#2c3e50',
            textAlign: isRTL ? 'right' : 'left'
        },
        formControl: {
            borderRadius: '10px',
            border: `1px solid ${theme ? '#444' : '#ddd'}`,
            padding: '12px 15px',
            fontSize: '14px',
            textAlign: isRTL ? 'right' : 'left',
            filter: theme ? 'invert(1)' : 'invert(0)',
            color: theme ? 'white' : '#111',
            background: theme ? 'rgba(255,255,255,0.05)' : '#fff',
            transition: 'all 0.3s ease'
        },
        submitButton: {
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            color: 'white'
        },
        cancelButton: {
            background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            color: 'white'
        },
        buttonHover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
        },
        // ESTILOS MEJORADOS PARA PREVIEW DE IMÁGENES
        imagesPreviewContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginTop: '15px',
            padding: '20px',
            backgroundColor: theme ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
            borderRadius: '12px',
            border: `2px dashed ${theme ? '#555' : '#dee2e6'}`,
            minHeight: '150px'
        },
        imagePreviewWrapper: {
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            border: `2px solid ${theme ? '#444' : '#fff'}`,
            width: '120px',
            height: '120px',
            cursor: 'pointer'
        },
        imagePreview: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.3s ease'
        },
        imageOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.9) 0%, rgba(192, 57, 43, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'all 0.3s ease',
            borderRadius: '10px'
        },
        deleteButton: {
            backgroundColor: 'transparent',
            border: '2px solid white',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
        },
        uploadButton: {
            background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 25px',
            color: 'white',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
        },
        imageCountBadge: {
            position: 'absolute',
            top: '8px',
            left: isRTL ? 'auto' : '8px',
            right: isRTL ? '8px' : 'auto',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            color: 'white',
            borderRadius: '12px',
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: '600',
            zIndex: 2,
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        },
        sectionTitle: {
            color: theme ? '#ffffff' : '#2c3e50',
            fontSize: '18px',
            fontWeight: '700',
            margin: '25px 0 20px 0',
            paddingBottom: '12px',
            borderBottom: `3px solid ${theme ? '#e74c3c' : '#e74c3c'}`,
            textAlign: isRTL ? 'right' : 'left',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        debugBox: {
            backgroundColor: theme ? '#2c3e50' : '#e9ecef',
            border: `1px solid ${theme ? '#34495e' : '#dee2e6'}`,
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: theme ? '#ffffff' : '#2c3e50'
        },
        emptyState: {
            textAlign: 'center',
            padding: '40px 20px',
            color: theme ? '#bdc3c7' : '#6c757d',
            width: '100%'
        },
        emptyStateIcon: {
            fontSize: '52px',
            marginBottom: '15px',
            opacity: 0.6,
            color: theme ? '#7f8c8d' : '#95a5a6'
        },
        // 🔥 NUEVO ESTILO PARA EL BOTÓN DE CERRAR DEL HEADER
        closeButton: {
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
        }
    }

    // 🔥 FUNCIÓN CORREGIDA PARA ELIMINACIÓN INDIVIDUAL DE IMÁGENES
    const deleteImage = (index) => {
        console.log('🗑️ Eliminando imagen en índice:', index);
        console.log('📸 Imágenes antes de eliminar:', postData.images);
        
        // Crear una nueva array sin la imagen en el índice especificado
        const updatedImages = postData.images.filter((_, imgIndex) => imgIndex !== index);
        
        console.log('🔄 Imágenes después de eliminar:', updatedImages);
        
        setPostData(prev => ({
            ...prev,
            images: updatedImages
        }));
    }

    // 🔥 NUEVA FUNCIÓN PARA MOSTRAR IMÁGENES ESTILIZADAS
    const styledImageShow = (src, alt = "Preview") => {
        return (
            <img 
                src={src} 
                alt={alt}
                style={styles.imagePreview}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120x120/2c3e50/ffffff?text=Image+Error'
                    e.target.alt = 'Error loading image'
                }}
            />
        )
    }

    // Opciones para el MultiSelect
    const featureOptions = [
        { value: 'comments', label: t('feature_comments') },
        { value: 'live-chat', label: t('feature_live_chat') },
        { value: 'notifications', label: t('feature_notifications') },
        { value: 'likes', label: t('feature_likes') },
        { value: 'save', label: t('feature_save') },
        { value: 'follow', label: t('feature_follow') },
        { value: 'google-login', label: t('feature_google_login') },
        { value: 'facebook-login', label: t('feature_facebook_login') },
        { value: 'email-system', label: t('feature_email_system') },
        { value: 'blocking', label: t('feature_blocking') },
        { value: 'admin-panel', label: t('feature_admin_panel') },
        { value: 'user-tracking', label: t('feature_user_tracking') },
        { value: 'modern-css', label: t('feature_modern_css') },
        { value: 'database', label: t('feature_database') },
        { value: 'authentication', label: t('feature_authentication') },
        { value: 'authorization', label: t('feature_authorization') },
        { value: 'email-verification', label: t('feature_email_verification') },
        { value: 'user-posts', label: t('feature_user_posts') },
        { value: 'post-validation', label: t('feature_post_validation') }
    ]

    useEffect(() => {
        if (isEditMode && id) {
            loadRealPostData()
        }
    }, [isEditMode, id, posts])

    const loadRealPostData = () => {
        const realPost = posts?.find(post => post._id === id)
        
        if (realPost) {
            setPostData({
                content: realPost.content || '',
                images: realPost.images || [],
                title: realPost.title || '',
                unidaddeprecio: realPost.unidaddeprecio || '',
                oferta: realPost.oferta || '',
                features: realPost.features || []
            })
        } else {
            loadPostFromAPI()
        }
    }

    const loadPostFromAPI = async () => {
        try {
            const res = await fetch(`/api/post/${id}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            
            if (res.ok) {
                const data = await res.json()
                if (data.post) {
                    setPostData({
                        content: data.post.content || '',
                        images: data.post.images || [],
                        title: data.post.title || '',
                        unidaddeprecio: data.post.unidaddeprecio || '',
                        oferta: data.post.oferta || '',
                        features: data.post.features || []
                    })
                }
            }
        } catch (error) {
            console.error('❌ Error en loadPostFromAPI:', error)
        }
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setPostData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFeatureChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : []
        setPostData(prev => ({
            ...prev,
            features: selectedValues
        }))
    }

    const handleChangeImages = e => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if(!file) return err = "File does not exist."
            if(file.size > 1024 * 1024 * 5){
                return err = "The image largest is 5mb."
            }
            return newImages.push(file)
        })

        if(err) {
            dispatch({ 
                type: 'GLOBALTYPES.ALERT', 
                payload: {error: err} 
            })
            return
        }
        
        setPostData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(!postData.images || postData.images.length === 0) {
            return dispatch({ 
                type: 'GLOBALTYPES.ALERT', 
                payload: {error: t('add_photo_error')}
            })
        }

        const submitData = {
            content: postData.content || '',
            title: postData.title || '',
            unidaddeprecio: postData.unidaddeprecio || '',
            oferta: postData.oferta || '',
            features: postData.features || [],
            images: postData.images || [],
            auth
        }
    
        if (isEditMode) {
            dispatch(updatePost({
                ...submitData,
                status: {
                    _id: id,
                    content: postData.content || '',
                    images: postData.images || [],
                }
            }))
        } else {
            dispatch(createPost({
                ...submitData,
                socket
            }))
        }
        
        setPostData({
            content: '',
            images: [],
            title: '',
            unidaddeprecio: '',
            oferta: '',
            features: []
        })
        
        setTimeout(() => {
            history.push('/')
        }, 500)
    }

    const handleCancel = () => {
        history.goBack()
    }

    const MultiSelect = ({ options, value, onChange, placeholder }) => {
        const [isOpen, setIsOpen] = useState(false)
        const selectRef = useRef(null)

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (selectRef.current && !selectRef.current.contains(event.target)) {
                    setIsOpen(false)
                }
            }
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }, [])

        const selectedValues = Array.isArray(value) ? value : []
        const selectedOptions = options.filter(option => selectedValues.includes(option.value))

        const toggleOption = (optionValue) => {
            const newValues = selectedValues.includes(optionValue)
                ? selectedValues.filter(val => val !== optionValue)
                : [...selectedValues, optionValue]
            
            onChange(newValues.map(val => ({ 
                value: val, 
                label: options.find(opt => opt.value === val)?.label || val 
            })))
        }

        const removeOption = (optionValue, e) => {
            e.stopPropagation()
            const newValues = selectedValues.filter(val => val !== optionValue)
            onChange(newValues.map(val => ({ 
                value: val, 
                label: options.find(opt => opt.value === val)?.label || val 
            })))
        }

        return (
            <div ref={selectRef} className="position-relative">
                <Form.Control
                    readOnly
                    value={selectedOptions.map(opt => opt.label).join(', ')}
                    placeholder={placeholder}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ 
                        ...styles.formControl,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                    dir={isRTL ? 'rtl' : 'ltr'}
                />
                
                {isOpen && (
                    <Card className="position-absolute w-100 mt-1" style={{ 
                        zIndex: 1050, 
                        maxHeight: '200px', 
                        overflowY: 'auto',
                        direction: isRTL ? 'rtl' : 'ltr',
                        background: theme ? '#2c3e50' : '#ffffff'
                    }}>
                        <Card.Body className="p-2">
                            {options.map(option => (
                                <Form.Check
                                    key={option.value}
                                    type="checkbox"
                                    id={`feature-${option.value}`}
                                    label={option.label}
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => toggleOption(option.value)}
                                    className="mb-2"
                                    style={{ 
                                        textAlign: isRTL ? 'right' : 'left',
                                        color: theme ? '#ffffff' : '#000000'
                                    }}
                                />
                            ))}
                        </Card.Body>
                    </Card>
                )}

                {selectedOptions.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap gap-1">
                        {selectedOptions.map(option => (
                            <Badge key={option.value} bg="primary" className="d-flex align-items-center" style={{
                                background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)'
                            }}>
                                {option.label}
                                <span 
                                    className={isRTL ? "me-1" : "ms-1"}
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => removeOption(option.value, e)}
                                >
                                    &times;
                                </span>
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // 🔥 FUNCIÓN MEJORADA PARA RENDERIZAR IMÁGENES CON ELIMINACIÓN INDIVIDUAL
    const renderImagePreview = () => {
        const images = Array.isArray(postData.images) ? postData.images : []
        
        if (images.length === 0) {
            return (
                <div style={styles.emptyState}>
                    <i className="fas fa-images" style={styles.emptyStateIcon}></i>
                    <p style={{fontSize: '16px', margin: 0}}>{t('no_images_uploaded')}</p>
                    <small style={{opacity: 0.7}}>{t('click_to_upload')}</small>
                </div>
            )
        }

        return (
            <div style={styles.imagesPreviewContainer}>
                {images.map((img, index) => (
                    <div 
                        key={`image-${index}-${img.url || img.name || index}`}
                        style={styles.imagePreviewWrapper}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)'
                            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)'
                            const overlay = e.currentTarget.querySelector('.image-overlay')
                            if (overlay) overlay.style.opacity = '1'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)'
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)'
                            const overlay = e.currentTarget.querySelector('.image-overlay')
                            if (overlay) overlay.style.opacity = '0'
                        }}
                    >
                        {/* Badge con número de imagen */}
                        <div style={styles.imageCountBadge}>
                            {index + 1}
                        </div>
                        
                        {/* IMÁGENES ESTILIZADAS PARA AMBOS MODOS */}
                        {img.camera ? (
                            styledImageShow(img.camera, `Image ${index + 1}`)
                        ) : img.url ? (
                            styledImageShow(img.url, `Image ${index + 1}`)
                        ) : (
                            <img 
                                src={URL.createObjectURL(img)} 
                                alt={`Preview ${index + 1}`}
                                style={styles.imagePreview}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/120x120/2c3e50/ffffff?text=Image+Error'
                                }}
                            />
                        )}
                        
                        {/* Overlay con botón de eliminar - CORREGIDO */}
                        <div 
                            className="image-overlay"
                            style={styles.imageOverlay}
                        >
                            <button
                                style={styles.deleteButton}
                                onClick={(e) => {
                                    e.stopPropagation(); // 🔥 IMPORTANTE: Prevenir propagación
                                    deleteImage(index); // 🔥 Usar la función corregida
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'white'
                                    e.target.style.color = '#e74c3c'
                                    e.target.style.transform = 'scale(1.2)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                    e.target.style.color = 'white'
                                    e.target.style.transform = 'scale(1)'
                                }}
                                title={t('delete_image')}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <Container fluid style={styles.container}>
            <Row className="justify-content-center">
                <Col lg={8} md={10}>
                    <Card style={styles.card}>
                        {/* 🔥 HEADER MEJORADO */}
                        <Card.Header style={styles.cardHeader}>
                            <div style={styles.cardHeaderOverlay}></div>
                            <div className="d-flex justify-content-between align-items-center position-relative">
                                <div>
                                    <h2 style={{ 
                                        margin: 0, 
                                        fontSize: '28px', 
                                        fontWeight: '700',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        {isEditMode ? t('edit_post') : t('create_new_post')}
                                    </h2>
                                    <p style={{ 
                                        margin: '8px 0 0 0', 
                                        opacity: 0.9, 
                                        fontSize: '15px',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                    }}>
                                        {isEditMode ? t('edit_post_description') : t('post_creation_description')}
                                    </p>
                                </div>
                                <Button 
                                    variant="link" 
                                    className="text-decoration-none p-0"
                                    onClick={handleCancel}
                                    style={styles.closeButton}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'
                                        e.target.style.transform = 'rotate(90deg)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'
                                        e.target.style.transform = 'rotate(0deg)'
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </Button>
                            </div>
                        </Card.Header>
                        
                        <Card.Body style={styles.cardBody}>
                            {isEditMode && (
                                <Alert variant="info" style={styles.debugBox}>
                                    <small>
                                        <strong>{t('debug')}:</strong> {t('content')}: "{postData.content}" | 
                                        {t('title')}: "{postData.title}" | 
                                        {t('features')}: {Array.isArray(postData.features) ? postData.features.length : 0} | 
                                        {t('images')}: {Array.isArray(postData.images) ? postData.images.length : 0}
                                    </small>
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <h4 style={styles.sectionTitle}>
                                    {t('basic_information')}
                                </h4>

                                <FloatingLabel
                                    controlId="content"
                                    label={t('content')}
                                    className="mb-3"
                                >
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        name="content"
                                        value={postData.content || ''}
                                        placeholder={`${auth.user?.username || 'User'}, ${t('content_placeholder')}`}
                                        onChange={handleChangeInput}
                                        style={styles.formControl}
                                        dir={isRTL ? 'rtl' : 'ltr'}
                                    />
                                </FloatingLabel>

                                <h4 style={styles.sectionTitle}>
                                    {t('application_details')}
                                </h4>

                                <Row>
                                    <Col md={6}>
                                        <FloatingLabel
                                            controlId="title"
                                            label={t('application_type')}
                                            className="mb-3"
                                        >
                                            <Form.Select
                                                name="title"
                                                value={postData.title || ''}
                                                onChange={handleChangeInput}
                                                style={styles.formControl}
                                                dir={isRTL ? 'rtl' : 'ltr'}
                                            >
                                                <option value="">{t('select_application_type')}</option>
                                                <option value="Application Web">{t('app_web')}</option>
                                                <option value="Application Mobile">{t('app_mobile')}</option>
                                                <option value="Application PWA Web + Mobile">{t('app_pwa')}</option>
                                                <option value="Site Web Responsive">{t('app_web_responsive')}</option>
                                                <option value="Page d'atterrissage">{t('app_landing_page')}</option>
                                                <option value="Boutique en ligne">{t('app_ecommerce')}</option>
                                                <option value="Application de bureau">{t('app_desktop')}</option>
                                                <option value="API/Service Backend">{t('app_api')}</option>
                                                <option value="Jeu Web/Mobile">{t('app_game')}</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>

                                    <Col md={6}>
                                        <FloatingLabel
                                            controlId="unidaddeprecio"
                                            label={t('price_unit')}
                                            className="mb-3"
                                        >
                                            <Form.Select
                                                name="unidaddeprecio"
                                                value={postData.unidaddeprecio || ''}
                                                onChange={handleChangeInput}
                                                style={styles.formControl}
                                                dir={isRTL ? 'rtl' : 'ltr'}
                                            >
                                                <option value="">{t('select_price_unit')}</option>
                                                <option value="DA">DA</option>
                                                <option value="Millions">{t('millions')}</option>
                                                <option value="Milliard">{t('milliard')}</option>
                                                <option value="DA (m²)">DA (m²)</option>
                                                <option value="Millions (m²)">{t('millions_m2')}</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <FloatingLabel
                                            controlId="oferta"
                                            label={t('offer_type')}
                                            className="mb-3"
                                        >
                                            <Form.Select
                                                name="oferta"
                                                value={postData.oferta || ''}
                                                onChange={handleChangeInput}
                                                style={styles.formControl}
                                                dir={isRTL ? 'rtl' : 'ltr'}
                                            >
                                                <option value="">{t('select_offer_type')}</option>
                                                <option value="Fixe">{t('offer_fixed')}</option>
                                                <option value="Négociable">{t('offer_negotiable')}</option>
                                                <option value="Offert">{t('offer_free')}</option>
                                            </Form.Select>
                                        </FloatingLabel>
                                    </Col>

                                    <Col md={6}>
                                        <FloatingLabel
                                            controlId="features"
                                            label={t('application_features')}
                                            className="mb-3"
                                        >
                                            <MultiSelect
                                                options={featureOptions}
                                                value={Array.isArray(postData.features) ? postData.features : []}
                                                onChange={handleFeatureChange}
                                                placeholder={t('select_features_placeholder')}
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <h4 style={styles.sectionTitle}>
                                    {t('images')}
                                </h4>

                                {/* PREVIEW DE IMÁGENES ESTILIZADO Y CORREGIDO */}
                                <Form.Group className="mb-3">
                                    <Form.Label style={styles.formLabel}>
                                        {t('images_count', { count: Array.isArray(postData.images) ? postData.images.length : 0 })}
                                    </Form.Label>
                                    {renderImagePreview()}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label 
                                        htmlFor="file" 
                                        style={styles.uploadButton}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)'
                                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)'
                                            e.target.style.boxShadow = 'none'
                                        }}
                                    >
                                        <i className={`fas fa-cloud-upload-alt ${isRTL ? 'ms-2' : 'me-2'}`} />
                                        {isEditMode ? t('update_photos') : t('add_photos')}
                                    </Form.Label>
                                    <Form.Control
                                        type="file"
                                        id="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleChangeImages}
                                        style={{display: 'none'}}
                                    />
                                    <Form.Text style={{ 
                                        color: theme ? '#bdc3c7' : '#6c757d', 
                                        textAlign: isRTL ? 'right' : 'left',
                                        display: 'block',
                                        marginTop: '10px',
                                        fontSize: '13px'
                                    }}>
                                        <i className={`fas fa-info-circle ${isRTL ? 'ms-2' : 'me-2'}`} />
                                        {t('image_requirements')}
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex gap-2 mt-4">
                                    <Button 
                                        variant="secondary" 
                                        className="flex-fill"
                                        onClick={handleCancel}
                                        style={styles.cancelButton}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)'
                                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)'
                                            e.target.style.boxShadow = 'none'
                                        }}
                                    >
                                        <i className={`fas fa-times ${isRTL ? 'ms-2' : 'me-2'}`} />
                                        {t('cancel')}
                                    </Button>
                                    <Button 
                                        variant="primary" 
                                        className="flex-fill" 
                                        type="submit"
                                        style={styles.submitButton}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)'
                                            e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)'
                                            e.target.style.boxShadow = 'none'
                                        }}
                                    >
                                        <i className={`fas ${isEditMode ? 'fa-save' : 'fa-plus'} ${isRTL ? 'ms-2' : 'me-2'}`} />
                                        {isEditMode ? t('update_post') : t('create_post')}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default CreatePost