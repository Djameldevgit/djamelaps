import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { createPost, updatePost } from '../redux/actions/postAction'
import { imageShow } from '../utils/mediaShow'

const CreatePost = () => {
    const { auth, theme, status, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const { t } = useTranslation('createpost')

    // Estados iniciales con los nuevos campos
    const [content, setContent] = useState('')
    const [images, setImages] = useState([])
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [priceType, setPriceType] = useState('')
    const [offerType, setOfferType] = useState('')
    const [features, setFeatures] = useState([])
    
    // Opciones para tipos de aplicaciones/proyectos
    const apptitleOptions = [
        { value: '', label: t('select_app_type') },
        
        // Marketplaces y E-commerce
        { value: 'marketplace', label: t('app_marketplace') },
        { value: 'ecommerce', label: t('app_ecommerce') },
        { value: 'tienda-online', label: t('app_tienda_online') },
        { value: 'venta-productos', label: t('app_venta_productos') },
        { value: 'subastas', label: t('app_subastas') },
        
        // Redes Sociales
        { value: 'red-social', label: t('app_red_social') },
        { value: 'comunidad', label: t('app_comunidad') },
        { value: 'foro', label: t('app_foro') },
        { value: 'blog', label: t('app_blog') },
        { value: 'chat-grupal', label: t('app_chat_grupal') },
        
        // Aplicaciones Web
        { value: 'web-app', label: t('app_web_app') },
        { value: 'site-web', label: t('app_site_web') },
        { value: 'pagina-web', label: t('app_pagina_web') },
        { value: 'portal-web', label: t('app_portal_web') },
        
        // Aplicaciones Móviles
        { value: 'android-app', label: t('app_android_app') },
        { value: 'ios-app', label: t('app_ios_app') },
        { value: 'mobile-app', label: t('app_mobile_app') },
        { value: 'hibrida-app', label: t('app_hibrida_app') },
        
        // Servicios y Plataformas
        { value: 'servicio-online', label: t('app_servicio_online') },
        { value: 'plataforma-educativa', label: t('app_plataforma_educativa') },
        { value: 'sistema-gestion', label: t('app_sistema_gestion') },
        { value: 'crm', label: t('app_crm') },
        { value: 'cms', label: t('app_cms') },
        
        // Entretenimiento
        { value: 'juego-online', label: t('app_juego_online') },
        { value: 'streaming', label: t('app_streaming') },
        { value: 'musica', label: t('app_musica') },
        { value: 'video', label: t('app_video') },
        
        // Utilidades
        { value: 'herramienta-productividad', label: t('app_herramienta_productividad') },
        { value: 'app-finanzas', label: t('app_finanzas') },
        { value: 'salud-fitness', label: t('app_salud_fitness') },
        { value: 'viajes', label: t('app_viajes') },
        
        // Otros
        { value: 'otro', label: t('app_otro') }
    ]

    // Opciones corregidas para tipo de oferta
    const offerTypeOptions = [
        { value: '', label: t('select_offer_type') },
        { value: 'fixed', label: t('fixed_price') },
        { value: 'negotiable', label: t('negotiable_price') },
        { value: 'on_sale', label: t('on_sale') },
        { value: 'free', label: t('free') },
        { value: 'exchange', label: t('exchange') }
    ]

    // Opciones para tipo de precio/unidad
    const priceTypeOptions = [
        { value: '', label: t('select_currency') },
        { value: 'DINAR-argelia', label: t('dinar_argelia') },
        { value: 'CIENTIME', label: t('centime_argelia') },
        { value: 'EURO', label: t('euro') },
        { value: 'DOLAR', label: t('dolar') },
        { value: 'LIBRA-esterlina', label: t('libra_esterlina') },
        { value: 'YEN', label: t('yen') },
        { value: 'FRANCO-suizo', label: t('franco_suizo') },
        { value: 'DINAR-tunecino', label: t('dinar_tunecino') },
        { value: 'DIRHAM-marroqui', label: t('dirham_marroqui') },
        { value: 'RIAL-saudi', label: t('rial_saudi') }
    ]

    const featuresOptions = [
        // Categoría: Interacción y Social
        { value: 'sistema-de-comments', label: t('feature_comments') },
        { value: 'likes-en-tiempo-real', label: t('feature_likes') },
        { value: 'save', label: t('feature_save') },
        { value: 'follow', label: t('feature_follow') },

        // Categoría: Comunicación en Tiempo Real
        { value: 'live-chat-profesional', label: t('feature_live_chat') },
        { value: 'notifications-en-tiempo-real', label: t('feature_notifications') },

        // Categoría: Autenticación y Seguridad
        { value: 'registro-con-google-login', label: t('feature_google_login') },
        { value: 'registro-con-facebook-login', label: t('feature_facebook_login') },
        { value: 'authentication', label: t('feature_authentication') },
        { value: 'authorization', label: t('feature_authorization') },
        { value: 'email-verification', label: t('feature_email_verification') },
        { value: 'activacion', label: t('feature_activation') },
        { value: 'incriptacion-de-datos', label: t('feature_encryption') },
        { value: 'blocking', label: t('feature_blocking') },

        // Categoría: Sistema y Administración
        { value: 'admin-panel', label: t('feature_admin_panel') },
        { value: 'user-tracking', label: t('feature_user_tracking') },
        { value: 'post-validation', label: t('feature_post_validation') },
        { value: 'user-posts', label: t('feature_user_posts') },

        // Categoría: Tecnología y Infraestructura
        { value: 'database-propia-independiente', label: t('feature_database') },
        { value: 'modern-css', label: t('feature_modern_css') },
        { value: 'sistema-propio-multiples-lenguajes', label: t('feature_multilingual') },
        { value: 'envios-de-email-system', label: t('feature_email_system') }
    ]

    const isEdit = location.state?.isEdit || status.onEdit
    const postToEdit = location.state?.post || status

    useEffect(() => {
        if (isEdit && postToEdit) {
            setContent(postToEdit.content || '')
            setImages(postToEdit.images || [])
            setTitle(postToEdit.title || '')
            setPrice(postToEdit.price || '')
            setPriceType(postToEdit.priceType || '')
            setOfferType(postToEdit.offerType || '')
            setFeatures(postToEdit.features || [])
            
        }
    }, [isEdit, postToEdit])

    const handleChangeImages = e => {
        const files = [...e.target.files]
        let err = ""
        let newImages = []

        files.forEach(file => {
            if (!file) return err = t('file_not_exist')
            if (file.size > 1024 * 1024 * 5) {
                return err = t('image_too_large')
            }
            return newImages.push(file)
        })

        if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err } })
        setImages([...images, ...newImages])
    }

    const deleteImages = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
    }

    // Manejar cambios en los checkboxes de features
    const handleFeatureChange = (e) => {
        const { value, checked } = e.target

        if (checked) {
            setFeatures([...features, value])
        } else {
            setFeatures(features.filter(feature => feature !== value))
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (images.length === 0) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('validation_no_images') }
            })
        }

        // Validación adicional para los nuevos campos
        if (!title) {
            return dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: t('validation_no_app_type') }
            })
        }

        const postData = {
            content,
            images,
            title,
            price,
            priceType,
            offerType,
            features,
              auth
        }

        if (isEdit && postToEdit) {
            dispatch(updatePost({
                ...postData,
                status: { ...postToEdit, onEdit: true }
            }))
        } else {
            dispatch(createPost({
                ...postData,
                socket
            }))
        }

        // Resetear todos los campos
        setContent('')
        setImages([])
        setTitle('')
        setPrice('')
        setPriceType('')
        setOfferType('')
        setFeatures([])
    
        dispatch({ type: GLOBALTYPES.STATUS, payload: false })
        history.push('/')
    }

    const handleCancel = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: false })
        history.goBack()
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: theme ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '0.5rem 0.2rem'
        }}>
            <div style={{
                maxWidth: '680px',
                margin: '0 auto'
            }}>
                {/* Header Card */}
                <div style={{
                    background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '0.5rem',
                    marginBottom: '1.5rem',
                    border: theme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: theme ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {auth.user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: '1.5rem',
                                    color: theme ? '#fff' : '#1a1a2e',
                                    fontWeight: '700'
                                }}>
                                    {isEdit ? t('edit_post') : t('create_post')}
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.875rem',
                                    color: theme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
                                }}>
                                    {t('share_your_moment')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleCancel}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: 'none',
                                background: theme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                                color: theme ? '#fff' : '#1a1a2e',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={e => e.target.style.background = theme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
                            onMouseLeave={e => e.target.style.background = theme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Main Content Card */}
                <div style={{
                    background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '0.5rem',
                    border: theme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: theme ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                    <form onSubmit={handleSubmit}>
                        
                        {/* Sección: Información del Proyecto */}
                        <div style={{
                            marginBottom: '2rem',
                            padding: '0.5rem',
                            background: theme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: '16px',
                            border: theme ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'
                        }}>
                            <h4 style={{
                                margin: '0 0 1.5rem 0',
                                color: theme ? '#fff' : '#1a1a2e',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="fas fa-info-circle" style={{ color: '#667eea' }}></i>
                                
                            </h4>

                            {/* Campo Tipo de Aplicación */}
                            <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    color: theme ? '#fff' : '#1a1a2e',
                                    fontWeight: '600',
                                    fontSize: '1rem'
                                }}>
                                    <i className="fas fa-heading" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
                                    {t('custom_title_label')}
                                </label>
                                <select
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        border: theme ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.08)',
                                        borderRadius: '16px',
                                        fontSize: '1rem',
                                        background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                        color: theme ? '#fff' : '#1a1a2e',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#667eea'}
                                    onBlur={e => e.target.style.borderColor = theme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}
                                >
                                    {apptitleOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                             
                            </div>

                       

                          
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    color: theme ? '#fff' : '#1a1a2e',
                                    fontWeight: '600',
                                    fontSize: '1rem'
                                }}>
                                    <i className="fas fa-align-left" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
                                    {t('description_label')}
                                </label>
                                <textarea
                                    placeholder={t('post_content_placeholder', { username: auth.user.username })}
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    style={{
                                        width: '100%',
                                        minHeight: '120px',
                                        padding: '1.25rem',
                                        border: theme ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.08)',
                                        borderRadius: '16px',
                                        fontSize: '1rem',
                                        resize: 'vertical',
                                        background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                        color: theme ? '#fff' : '#1a1a2e',
                                        transition: 'all 0.3s ease',
                                        fontFamily: 'inherit'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#667eea'}
                                    onBlur={e => e.target.style.borderColor = theme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}
                                />
                            </div>
                        </div>

                        {/* Sección: Información de Precios */}
                        <div style={{
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            background: theme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: '16px',
                            border: theme ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'
                        }}>
                            <h4 style={{
                                margin: '0 0 1.5rem 0',
                                color: theme ? '#fff' : '#1a1a2e',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="fas fa-tag" style={{ color: '#667eea' }}></i>
                                {t('pricing_section')}
                            </h4>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                gap: '1rem'
                            }}>
                                {/* Precio */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.75rem',
                                        color: theme ? '#fff' : '#1a1a2e',
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}>
                                        <i className="fas fa-dollar-sign" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
                                        {t('price_label')}
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            border: theme ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.08)',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                            color: theme ? '#fff' : '#1a1a2e',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>

                                {/* Moneda */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.75rem',
                                        color: theme ? '#fff' : '#1a1a2e',
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}>
                                        <i className="fas fa-coins" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
                                        {t('currency_label')}
                                    </label>
                                    <select
                                        value={priceType}
                                        onChange={e => setPriceType(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            border: theme ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.08)',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                            color: theme ? '#fff' : '#1a1a2e',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {priceTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tipo de Oferta */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.75rem',
                                        color: theme ? '#fff' : '#1a1a2e',
                                        fontWeight: '600',
                                        fontSize: '1rem'
                                    }}>
                                        <i className="fas fa-handshake" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
                                        {t('offer_type_label')}
                                    </label>
                                    <select
                                        value={offerType}
                                        onChange={e => setOfferType(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            border: theme ? '2px solid rgba(255, 255, 255, 0.1)' : '2px solid rgba(0, 0, 0, 0.08)',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                            color: theme ? '#fff' : '#1a1a2e',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        {offerTypeOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sección: Características */}
                        <div style={{
                            marginBottom: '2rem',
                            padding: '0.5rem',
                            background: theme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: '16px',
                            border: theme ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'
                        }}>
                            <h4 style={{
                                margin: '0 0 1.5rem 0',
                                color: theme ? '#fff' : '#1a1a2e',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                            }}>
                                <i className="fas fa-cogs" style={{ color: '#667eea' }}></i>
                                {t('features_section')}
                            </h4>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '0.75rem',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                padding: '0.5rem'
                            }}>
                                {featuresOptions.map(option => (
                                    <label
                                        key={option.value}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '1rem',
                                            background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                                            borderRadius: '12px',
                                            border: features.includes(option.value)
                                                ? '2px solid #667eea'
                                                : theme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={e => {
                                            if (!features.includes(option.value)) {
                                                e.target.style.background = theme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                                                e.target.style.borderColor = theme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!features.includes(option.value)) {
                                                e.target.style.background = theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)'
                                                e.target.style.borderColor = theme ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.08)'
                                            }
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            value={option.value}
                                            checked={features.includes(option.value)}
                                            onChange={handleFeatureChange}
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                accentColor: '#667eea',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <span style={{
                                            color: theme ? '#fff' : '#1a1a2e',
                                            fontSize: '0.95rem',
                                            fontWeight: features.includes(option.value) ? '600' : '400',
                                            flex: 1
                                        }}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <div style={{
                                marginTop: '1rem',
                                fontSize: '0.875rem',
                                color: theme ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                                fontStyle: 'italic',
                                textAlign: 'center'
                            }}>
                                {t('features_selected_count', { count: features.length })}
                            </div>
                        </div>

                        {/* Sección: Multimedia */}
                        <div style={{
                            marginBottom: '2rem',
                            padding: '1.5rem',
                            background: theme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: '16px',
                            border: theme ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'
                        }}>
                            <h4 style={{
                                margin: '0 0 1.5rem 0',
                                color: theme ? '#fff' : '#1a1a2e',
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="fas fa-images" style={{ color: '#667eea' }}></i>
                                {t('media_section')}
                            </h4>

                            {/* Image Preview Grid */}
                            {images.length > 0 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                    gap: '1rem',
                                    marginBottom: '1.5rem'
                                }}>
                                    {images.map((img, index) => (
                                        <div key={index} style={{
                                            position: 'relative',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            aspectRatio: '1',
                                            background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'
                                        }}>
                                            <div style={{ width: '100%', height: '100%' }}>
                                                {img.url ?
                                                    imageShow(img.url, theme)
                                                    :
                                                    imageShow(URL.createObjectURL(img), theme)
                                                }
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => deleteImages(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    background: 'rgba(239, 68, 68, 0.95)',
                                                    color: 'white',
                                                    fontSize: '1.25rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.3s ease',
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                                                }}
                                                onMouseEnter={e => {
                                                    e.target.style.transform = 'scale(1.1)'
                                                    e.target.style.background = 'rgba(220, 38, 38, 0.95)'
                                                }}
                                                onMouseLeave={e => {
                                                    e.target.style.transform = 'scale(1)'
                                                    e.target.style.background = 'rgba(239, 68, 68, 0.95)'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Button */}
                            <div style={{
                                position: 'relative'
                            }}>
                                <input
                                    type="file"
                                    id="fileInput"
                                    multiple
                                    accept="image/*"
                                    onChange={handleChangeImages}
                                    style={{ display: 'none' }}
                                />
                                <label
                                    htmlFor="fileInput"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        padding: '1.5rem',
                                        border: theme ? '2px dashed rgba(255, 255, 255, 0.2)' : '2px dashed rgba(0, 0, 0, 0.15)',
                                        borderRadius: '16px',
                                        background: theme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        color: theme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                                    }}
                                    onMouseEnter={e => {
                                        e.target.style.borderColor = '#667eea'
                                        e.target.style.background = theme ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'
                                    }}
                                    onMouseLeave={e => {
                                        e.target.style.borderColor = theme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)'
                                        e.target.style.background = theme ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'
                                    }}
                                >
                                    <i className="fas fa-image" style={{ fontSize: '1.5rem', color: '#667eea' }}></i>
                                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                                        {images.length > 0 ? t('add_more_photos') : t('add_photos_to_post')}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            <button
                                type="button"
                                onClick={handleCancel}
                                style={{
                                    flex: '1',
                                    padding: '1.25rem',
                                    border: theme ? '2px solid rgba(255, 255, 255, 0.2)' : '2px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: '12px',
                                    background: 'transparent',
                                    color: theme ? '#fff' : '#1a1a2e',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => {
                                    e.target.style.background = theme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                                }}
                                onMouseLeave={e => {
                                    e.target.style.background = 'transparent'
                                }}
                            >
                                {t('cancel_button')}
                            </button>
                            <button
                                type="submit"
                                style={{
                                    flex: '2',
                                    padding: '1.25rem',
                                    border: 'none',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                                }}
                                onMouseEnter={e => {
                                    e.target.style.transform = 'translateY(-2px)'
                                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)'
                                }}
                                onMouseLeave={e => {
                                    e.target.style.transform = 'translateY(0)'
                                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                                }}
                            >
                                {isEdit ? t('update_post_button') : t('create_post_button')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreatePost