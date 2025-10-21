import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert,
  Badge,
  InputGroup
} from 'react-bootstrap'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { createPost, updatePost } from '../redux/actions/postAction'
import { imageShow } from '../utils/mediaShow'

const CreatePost = () => {
    const { auth, theme, status, socket } = useSelector(state => state)
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const { t } = useTranslation('createpost')

    // Estados iniciales con el nuevo campo link
    const [content, setContent] = useState('')
    const [images, setImages] = useState([])
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [priceType, setPriceType] = useState('')
    const [offerType, setOfferType] = useState('')
    const [features, setFeatures] = useState([])
    const [link, setLink] = useState('') // Nuevo campo
    
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
            setLink(postToEdit.link || '') // Cargar link si existe
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
            link, // Incluir el link en los datos
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
        setLink('') // Resetear link
    
        dispatch({ type: GLOBALTYPES.STATUS, payload: false })
        history.push('/')
    }

    const handleCancel = () => {
        dispatch({ type: GLOBALTYPES.STATUS, payload: false })
        history.goBack()
    }

    // Función para validar URL
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    return (
        <Container fluid className="py-3" style={{
            minHeight: '100vh',
            background: theme ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <Row className="justify-content-center">
                <Col xs={12} lg={8} xl={6}>
                    {/* Header Card */}
                    <Card className={`mb-4 ${theme ? 'bg-dark text-white' : 'bg-light'}`} 
                          style={{ 
                              border: 'none', 
                              borderRadius: '20px',
                              backdropFilter: 'blur(10px)',
                              background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)'
                          }}>
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                                         style={{
                                             width: '50px',
                                             height: '50px',
                                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                             fontSize: '1.5rem',
                                             fontWeight: 'bold',
                                             color: 'white'
                                         }}>
                                        {auth.user.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h4 className="mb-1 fw-bold">
                                            {isEdit ? t('edit_post') : t('create_post')}
                                        </h4>
                                        <p className="mb-0 text-muted">
                                            {t('share_your_moment')}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant={theme ? "outline-light" : "outline-dark"}
                                    className="rounded-circle p-0 d-flex align-items-center justify-content-center"
                                    style={{ width: '40px', height: '40px' }}
                                    onClick={handleCancel}
                                >
                                    ×
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Main Content Card */}
                    <Card className={`${theme ? 'bg-dark text-white' : 'bg-light'}`}
                          style={{ 
                              border: 'none', 
                              borderRadius: '20px',
                              backdropFilter: 'blur(10px)',
                              background: theme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.95)'
                          }}>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                
                                {/* Sección: Información del Proyecto */}
                                <Card className={`mb-4 ${theme ? 'bg-dark' : 'bg-light'}`} 
                                      style={{ border: 'none', borderRadius: '16px' }}>
                                    <Card.Body className="p-4">
                                        <h5 className="mb-3 d-flex align-items-center gap-2">
                                            <i className="fas fa-info-circle text-primary"></i>
                                            {t('project_info_section')}
                                        </h5>

                                        {/* Campo Tipo de Aplicación */}
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <i className="fas fa-heading me-2 text-primary"></i>
                                                {t('custom_title_label')}
                                            </Form.Label>
                                            <Form.Select
                                                value={title}
                                                onChange={e => setTitle(e.target.value)}
                                                className={theme ? 'bg-dark text-white' : ''}
                                                size="lg"
                                            >
                                                {apptitleOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        {/* Campo Link */}
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">
                                                <i className="fas fa-link me-2 text-primary"></i>
                                                {t('link_label') || 'Enlace de la aplicación'}
                                            </Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <i className="fas fa-globe"></i>
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="url"
                                                    placeholder="https://tu-aplicacion.com"
                                                    value={link}
                                                    onChange={e => setLink(e.target.value)}
                                                    className={theme ? 'bg-dark text-white' : ''}
                                                    isValid={link && isValidUrl(link)}
                                                    isInvalid={link && !isValidUrl(link)}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {t('invalid_url') || 'Por favor ingresa una URL válida'}
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                            <Form.Text className="text-muted">
                                                {t('link_help_text') || 'Ingresa el enlace donde se puede ver o probar tu aplicación'}
                                            </Form.Text>
                                        </Form.Group>

                                        {/* Campo Descripción */}
                                        <Form.Group>
                                            <Form.Label className="fw-semibold">
                                                <i className="fas fa-align-left me-2 text-primary"></i>
                                                {t('description_label')}
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                placeholder={t('post_content_placeholder', { username: auth.user.username })}
                                                value={content}
                                                onChange={e => setContent(e.target.value)}
                                                className={theme ? 'bg-dark text-white' : ''}
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>

                                {/* Sección: Información de Precios */}
                                <Card className={`mb-4 ${theme ? 'bg-dark' : 'bg-light'}`} 
                                      style={{ border: 'none', borderRadius: '16px' }}>
                                    <Card.Body className="p-4">
                                        <h5 className="mb-3 d-flex align-items-center gap-2">
                                            <i className="fas fa-tag text-primary"></i>
                                            {t('pricing_section')}
                                        </h5>

                                        <Row>
                                            {/* Precio */}
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-semibold">
                                                        <i className="fas fa-dollar-sign me-2 text-primary"></i>
                                                        {t('price_label')}
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        placeholder="0.00"
                                                        value={price}
                                                        onChange={e => setPrice(e.target.value)}
                                                        className={theme ? 'bg-dark text-white' : ''}
                                                    />
                                                </Form.Group>
                                            </Col>

                                            {/* Moneda */}
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-semibold">
                                                        <i className="fas fa-coins me-2 text-primary"></i>
                                                        {t('currency_label')}
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={priceType}
                                                        onChange={e => setPriceType(e.target.value)}
                                                        className={theme ? 'bg-dark text-white' : ''}
                                                    >
                                                        {priceTypeOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>

                                            {/* Tipo de Oferta */}
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className="fw-semibold">
                                                        <i className="fas fa-handshake me-2 text-primary"></i>
                                                        {t('offer_type_label')}
                                                    </Form.Label>
                                                    <Form.Select
                                                        value={offerType}
                                                        onChange={e => setOfferType(e.target.value)}
                                                        className={theme ? 'bg-dark text-white' : ''}
                                                    >
                                                        {offerTypeOptions.map(option => (
                                                            <option key={option.value} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {/* Sección: Características */}
                                <Card className={`mb-4 ${theme ? 'bg-dark' : 'bg-light'}`} 
                                      style={{ border: 'none', borderRadius: '16px' }}>
                                    <Card.Body className="p-4">
                                        <h5 className="mb-3 d-flex align-items-center gap-2">
                                            <i className="fas fa-cogs text-primary"></i>
                                            {t('features_section')}
                                        </h5>

                                        <div style={{ 
                                            maxHeight: '400px', 
                                            overflowY: 'auto',
                                            padding: '0.5rem'
                                        }}>
                                            <Row>
                                                {featuresOptions.map(option => (
                                                    <Col xs={12} md={6} key={option.value} className="mb-2">
                                                        <Form.Check
                                                            type="checkbox"
                                                            id={`feature-${option.value}`}
                                                            label={option.label}
                                                            value={option.value}
                                                            checked={features.includes(option.value)}
                                                            onChange={handleFeatureChange}
                                                            className={theme ? 'text-white' : ''}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                        
                                        <div className="text-center mt-3">
                                            <Badge bg="primary" className="p-2">
                                                {t('features_selected_count', { count: features.length })}
                                            </Badge>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* Sección: Multimedia */}
                                <Card className={`mb-4 ${theme ? 'bg-dark' : 'bg-light'}`} 
                                      style={{ border: 'none', borderRadius: '16px' }}>
                                    <Card.Body className="p-4">
                                        <h5 className="mb-3 d-flex align-items-center gap-2">
                                            <i className="fas fa-images text-primary"></i>
                                            {t('media_section')}
                                        </h5>

                                        {/* Image Preview Grid */}
                                        {images.length > 0 && (
                                            <Row className="mb-3 g-2">
                                                {images.map((img, index) => (
                                                    <Col xs={6} sm={4} md={3} key={index}>
                                                        <div className="position-relative rounded" 
                                                             style={{ aspectRatio: '1/1' }}>
                                                            <div className="w-100 h-100 rounded">
                                                                {img.url ?
                                                                    imageShow(img.url, theme)
                                                                    :
                                                                    imageShow(URL.createObjectURL(img), theme)
                                                                }
                                                            </div>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="position-absolute top-0 end-0 m-1 rounded-circle"
                                                                style={{ width: '30px', height: '30px' }}
                                                                onClick={() => deleteImages(index)}
                                                            >
                                                                ×
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                ))}
                                            </Row>
                                        )}

                                        {/* Upload Button */}
                                        <Form.Group>
                                            <Form.Label 
                                                htmlFor="fileInput"
                                                className="d-flex flex-column align-items-center justify-content-center border-dashed rounded p-4 cursor-pointer"
                                                style={{
                                                    border: theme ? '2px dashed rgba(255, 255, 255, 0.2)' : '2px dashed #dee2e6',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <i className="fas fa-image text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                                                <span className={theme ? 'text-white' : 'text-muted'}>
                                                    {images.length > 0 ? t('add_more_photos') : t('add_photos_to_post')}
                                                </span>
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                id="fileInput"
                                                multiple
                                                accept="image/*"
                                                onChange={handleChangeImages}
                                                className="d-none"
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>

                                {/* Action Buttons */}
                                <Row className="mt-4">
                                    <Col>
                                        <div className="d-flex gap-3">
                                            <Button
                                                variant={theme ? "outline-light" : "outline-secondary"}
                                                size="lg"
                                                className="flex-fill"
                                                onClick={handleCancel}
                                            >
                                                {t('cancel_button')}
                                            </Button>
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                className="flex-fill"
                                                type="submit"
                                                style={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none'
                                                }}
                                            >
                                                {isEdit ? t('update_post_button') : t('create_post_button')}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default CreatePost