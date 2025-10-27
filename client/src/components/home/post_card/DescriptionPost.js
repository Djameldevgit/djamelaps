import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Row, 
  Col, 
  Badge, 
  Button,
  ListGroup,
  ListGroupItem,
  Container,
  Alert
} from 'react-bootstrap';

const DescriptionPost = ({ post }) => {
  const [readMore, setReadMore] = useState(false);
  const { languageReducer, theme } = useSelector(state => state);
  const { t, i18n } = useTranslation('descripcion');
  const lang = languageReducer.language || 'fr';
  const isRTL = i18n.language === 'ar';

  // Función para obtener iconos basados en RTL
  const getIconClass = (iconName) => {
    return isRTL ? `${iconName} ms-2` : `${iconName} me-2`;
  };

  // Función para obtener clases de alineación
  const getAlignClass = () => {
    return isRTL ? 'text-end' : 'text-start';
  };

  // Función para obtener clases flex
  const getFlexClass = () => {
    return isRTL ? 'flex-row-reverse' : 'flex-row';
  };

  // Función para formatear arrays
  const formatArray = (array) => {
    if (!array || !Array.isArray(array)) return [];
    return array.filter(item => item && item.trim() !== '');
  };

  // Función para renderizar servicios incluidos
  const renderServices = () => {
    const services = [];
    
    // Servicios booleanos
    if (post.assurancesIncluses) services.push(t('insurance_included'));
    if (post.guideLocal) services.push(t('local_guide'));
    if (post.repasInclus) services.push(t('meals_included'));
    if (post.transfertAeroport) services.push(t('airport_transfer'));
    if (post.animauxAcceptes) services.push(t('pets_allowed'));
    if (post.parking) services.push(t('parking_available'));
    if (post.piscine) services.push(t('swimming_pool'));
    if (post.climatisation) services.push(t('air_conditioning'));
    if (post.cuisineEquipee) services.push(t('equipped_kitchen'));
    if (post.wifiGratuit) services.push(t('free_wifi'));
    if (post.television) services.push(t('television'));
    if (post.menageInclus) services.push(t('cleaning_included'));

    // Servicios de arrays
    if (post.servicesInclus && Array.isArray(post.servicesInclus)) {
      services.push(...post.servicesInclus.map(service => t(`service_${service}`)));
    }

    return services;
  };

  return (
    <Container fluid className="px-2 py-3">
      {/* HEADER DESTACADO */}
      <Card className={`border-0 shadow-lg mb-4 overflow-hidden ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
        <div className={`bg-gradient p-4 text-white position-relative`} style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '0.5rem 0.5rem 0 0'
        }}>
          <div className="position-absolute top-0 end-0 p-3">
            {post.subCategory && (
              <Badge bg="light" text="dark" className="fs-6 px-3 py-2 shadow">
                <i className={getIconClass("fas fa-suitcase-rolling")}></i>
                {t(`category_${post.subCategory}`)}
              </Badge>
            )}
          </div>
          
          <Row className="align-items-center">
            <Col xs={12} lg={8}>
              <div className={`d-flex align-items-center mb-3 ${getFlexClass()}`}>
                <div className="bg-white bg-opacity-25 rounded-circle p-3 me-3">
                  <i className="fas fa-plane-departure fs-1"></i>
                </div>
                <div>
                  <h2 className="mb-1 fw-bold">{post.title || t('travel_agency')}</h2>
                  <p className="mb-0 opacity-90">
                    <i className={getIconClass("fas fa-map-location-dot")}></i>
                    {t('discover_adventure')}
                  </p>
                </div>
              </div>
            </Col>
            
            <Col xs={12} lg={4} className="text-lg-end">
              {post.price && (
                <div className="bg-white bg-opacity-25 rounded-3 p-3 d-inline-block">
                  <div className="text-white text-opacity-75 small">{t('desde')}</div>
                  <div className="fs-2 fw-bold">{post.price} <small>DA</small></div>
                  <div className="text-white text-opacity-75 small">{t('per_person')}</div>
                </div>
              )}
            </Col>
          </Row>

          {/* BADGES INFORMATIVOS MEJORADOS */}
          <div className={`d-flex flex-wrap gap-2 mt-3 ${isRTL ? 'justify-content-end' : ''}`}>
            {post.typeVoyage && (
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6 shadow-sm">
                <i className={getIconClass("fas fa-route")}></i>
                {t(`type_${post.typeVoyage}`)}
              </Badge>
            )}
            {post.niveauConfort && (
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6 shadow-sm">
                <i className={getIconClass("fas fa-star")}></i>
                {t(`comfort_${post.niveauConfort}`)}
              </Badge>
            )}
            {post.duracionviaje && (
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6 shadow-sm">
                <i className={getIconClass("fas fa-hourglass-half")}></i>
                {post.duracionviaje}
              </Badge>
            )}
            {post.transporte && (
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6 shadow-sm">
                <i className={getIconClass("fas fa-bus-simple")}></i>
                {post.transporte}
              </Badge>
            )}
            {post.publicCible && (
              <Badge bg="light" text="dark" className="px-3 py-2 fs-6 shadow-sm">
                <i className={getIconClass("fas fa-users")}></i>
                {t(`public_${post.publicCible}`)}
              </Badge>
            )}
          </div>
        </div>

        <Card.Body className="p-4">
          {/* DESCRIPCIÓN */}
          {(post.description || post.content) && (
            <Alert variant={theme ? 'secondary' : 'light'} className="border-start border-4 border-primary">
              <div className={`d-flex align-items-start ${getFlexClass()}`}>
                <i className="fas fa-circle-info text-primary fs-4 mt-1 me-3"></i>
                <div className="flex-grow-1">
                  <h5 className="alert-heading mb-2">
                    <i className={getIconClass("fas fa-file-lines")}></i>
                    {t('about_trip')}
                  </h5>
                  <p className="mb-0" style={{ lineHeight: '1.8' }}>
                    {readMore ? (post.description || post.content) : `${(post.description || post.content).substring(0, 250)}...`}
                  </p>
                  {(post.description || post.content).length > 250 && (
                    <Button
                      variant="link"
                      className="p-0 mt-2 text-decoration-none fw-bold"
                      onClick={() => setReadMore(!readMore)}
                    >
                      {readMore ? (
                        <><i className="fas fa-chevron-up me-2"></i>{t('show_less')}</>
                      ) : (
                        <><i className="fas fa-chevron-down me-2"></i>{t('read_more')}</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* INFORMACIÓN GENERAL MEJORADA */}
      <Row className="g-3">
        {/* INFORMACIÓN DE SALIDA */}
        {(post.wilaya || post.commune || post.horadudepar || post.datedepar) && (
          <Col xs={12} lg={6}>
            <Card className={`h-100 border-0 shadow-sm ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
              <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-light'}`}>
                <h5 className="mb-0 d-flex align-items-center">
                  <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-2">
                    <i className="fas fa-location-arrow text-danger"></i>
                  </div>
                  {t('departure_info')}
                </h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {(post.wilaya || post.commune) && (
                    <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                      <Row className="align-items-center">
                        <Col xs={4} className="text-muted">
                          <i className="fas fa-map-pin text-danger me-2"></i>
                          {t('location')}
                        </Col>
                        <Col xs={8} className="text-end">
                          <span className="fw-bold">{post.wilaya}</span>
                          {post.commune && <span className="text-muted">, {post.commune}</span>}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  {post.datedepar && (
                    <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                      <Row className="align-items-center">
                        <Col xs={4} className="text-muted">
                          <i className="fas fa-calendar-day text-info me-2"></i>
                          {t('date')}
                        </Col>
                        <Col xs={8} className="text-end fw-bold">
                          {new Date(post.datedepar).toLocaleDateString(lang, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  {post.horadudepar && (
                    <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                      <Row className="align-items-center">
                        <Col xs={4} className="text-muted">
                          <i className="fas fa-clock text-warning me-2"></i>
                          {t('time')}
                        </Col>
                        <Col xs={8} className="text-end fw-bold">
                          {post.horadudepar}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* INFORMACIÓN DEL VIAJE MEJORADA */}
        <Col xs={12} lg={6}>
          <Card className={`h-100 border-0 shadow-sm ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
            <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-light'}`}>
              <h5 className="mb-0 d-flex align-items-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                  <i className="fas fa-route text-success"></i>
                </div>
                {t('travel_details')}
              </h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {post.duracionviaje && (
                  <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                    <Row className="align-items-center">
                      <Col xs={5} className="text-muted">
                        <i className="fas fa-hourglass-half text-warning me-2"></i>
                        {t('duration')}
                      </Col>
                      <Col xs={7} className="text-end fw-bold">
                        {post.duracionviaje}
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}
                {post.transporte && (
                  <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                    <Row className="align-items-center">
                      <Col xs={5} className="text-muted">
                        <i className="fas fa-bus text-info me-2"></i>
                        {t('transport')}
                      </Col>
                      <Col xs={7} className="text-end fw-bold">
                        {post.transporte}
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}
                {post.fecharegreso && (
                  <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                    <Row className="align-items-center">
                      <Col xs={5} className="text-muted">
                        <i className="fas fa-calendar-check text-success me-2"></i>
                        {t('return')}
                      </Col>
                      <Col xs={7} className="text-end fw-bold">
                        {new Date(post.fecharegreso).toLocaleDateString(lang)}
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}
                {/* NUEVOS CAMPOS */}
                {post.typeVisa && (
                  <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                    <Row className="align-items-center">
                      <Col xs={5} className="text-muted">
                        <i className="fas fa-passport text-primary me-2"></i>
                        {t('visa_type')}
                      </Col>
                      <Col xs={7} className="text-end fw-bold">
                        {t(`visa_${post.typeVisa}`)}
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}
                {post.delaiTraitement && (
                  <ListGroupItem className={`border-0 px-0 ${theme ? 'bg-dark' : ''}`}>
                    <Row className="align-items-center">
                      <Col xs={5} className="text-muted">
                        <i className="fas fa-hourglass text-warning me-2"></i>
                        {t('processing_time')}
                      </Col>
                      <Col xs={7} className="text-end fw-bold">
                        {post.delaiTraitement}
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* CARACTERÍSTICAS DEL ALOJAMIENTO (NUEVO) */}
      {(post.capacitePersonnes || post.nombreChambres || post.nombreSallesBain || post.superficie) && (
        <Card className={`border-0 shadow-sm mt-3 ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
          <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-light'}`}>
            <h5 className="mb-0 d-flex align-items-center">
              <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                <i className="fas fa-home text-info"></i>
              </div>
              {t('accommodation_features')}
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {post.capacitePersonnes && (
                <Col xs={6} md={3}>
                  <div className={`text-center p-3 rounded-3 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-users fs-2 text-primary mb-2"></i>
                    <div className="fw-bold fs-5">{post.capacitePersonnes}</div>
                    <div className="text-muted small">{t('capacity')}</div>
                  </div>
                </Col>
              )}
              {post.nombreChambres && (
                <Col xs={6} md={3}>
                  <div className={`text-center p-3 rounded-3 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-bed fs-2 text-success mb-2"></i>
                    <div className="fw-bold fs-5">{post.nombreChambres}</div>
                    <div className="text-muted small">{t('bedrooms')}</div>
                  </div>
                </Col>
              )}
              {post.nombreSallesBain && (
                <Col xs={6} md={3}>
                  <div className={`text-center p-3 rounded-3 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-bath fs-2 text-info mb-2"></i>
                    <div className="fw-bold fs-5">{post.nombreSallesBain}</div>
                    <div className="text-muted small">{t('bathrooms')}</div>
                  </div>
                </Col>
              )}
              {post.superficie && (
                <Col xs={6} md={3}>
                  <div className={`text-center p-3 rounded-3 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-ruler-combined fs-2 text-warning mb-2"></i>
                    <div className="fw-bold fs-5">{post.superficie}m²</div>
                    <div className="text-muted small">{t('surface')}</div>
                  </div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* SERVICIOS INCLUIDOS MEJORADOS */}
      {renderServices().length > 0 && (
        <Card className={`border-0 shadow-sm mt-3 ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
          <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-light'}`}>
            <h5 className="mb-0 d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                <i className="fas fa-check-circle text-success"></i>
              </div>
              {t('included_services')}
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-2">
              {renderServices().map((service, index) => (
                <Col key={index} xs={12} sm={6} lg={4}>
                  <div className={`p-3 rounded ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-check text-success me-2"></i>
                    <span>{service}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* ACTIVIDADES Y EXCURSIONES (NUEVO) */}
      {(formatArray(post.activites).length > 0 || formatArray(post.excursions).length > 0) && (
        <Card className={`border-0 shadow-sm mt-3 ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
          <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-light'}`}>
            <h5 className="mb-0 d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-2">
                <i className="fas fa-hiking text-warning"></i>
              </div>
              {t('activities_excursions')}
            </h5>
          </Card.Header>
          <Card.Body>
            {formatArray(post.activites).length > 0 && (
              <div className="mb-3">
                <h6 className="mb-3 text-muted">
                  <i className="fas fa-running me-2"></i>
                  {t('activities')}
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {formatArray(post.activites).map((activity, index) => (
                    <Badge key={index} bg="warning" text="dark" className="px-3 py-2 fs-6">
                      {t(`activity_${activity}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {formatArray(post.excursions).length > 0 && (
              <div>
                <h6 className="mb-3 text-muted">
                  <i className="fas fa-map-marked-alt me-2"></i>
                  {t('excursions')}
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {formatArray(post.excursions).map((excursion, index) => (
                    <Badge key={index} bg="info" className="px-3 py-2 fs-6">
                      {t(`excursion_${excursion}`)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* DESTINOS MEJORADO */}
      {(post.destinacionvoyage1 || post.destinacionvoyage2 || post.destinacionhadj || post.paysDestination) && (
        <Card className={`border-0 shadow-sm mt-3 ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
          <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-light'}`}>
            <h5 className="mb-0 d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                <i className="fas fa-map-marked-alt text-primary"></i>
              </div>
              {t('destinations')}
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {post.destinacionvoyage1 && (
                <Col xs={12} md={6} lg={4}>
                  <div className={`p-3 rounded-3 h-100 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <div className="d-flex align-items-start mb-2">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-2">
                        <i className="fas fa-location-dot text-primary"></i>
                      </div>
                      <div>
                        <div className="text-muted small">{t('destination')} 1</div>
                        <h6 className="mb-0 fw-bold">{post.destinacionvoyage1}</h6>
                      </div>
                    </div>
                    {post.voyage1hotel1 && (
                      <div className={`mt-2 p-2 rounded ${theme ? 'bg-dark' : 'bg-white'}`}>
                        <div className="small">
                          <i className="fas fa-hotel text-info me-2"></i>
                          <span className="text-muted">{post.voyage1hotel1}</span>
                        </div>
                        {post.voyage1nombrehotel1 && (
                          <div className="small fw-bold mt-1">{post.voyage1nombrehotel1}</div>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
              )}

              {post.destinacionvoyage2 && (
                <Col xs={12} md={6} lg={4}>
                  <div className={`p-3 rounded-3 h-100 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <div className="d-flex align-items-start mb-2">
                      <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                        <i className="fas fa-location-dot text-success"></i>
                      </div>
                      <div>
                        <div className="text-muted small">{t('destination')} 2</div>
                        <h6 className="mb-0 fw-bold">{post.destinacionvoyage2}</h6>
                      </div>
                    </div>
                    {post.voyage2hotel2 && (
                      <div className={`mt-2 p-2 rounded ${theme ? 'bg-dark' : 'bg-white'}`}>
                        <div className="small">
                          <i className="fas fa-hotel text-info me-2"></i>
                          <span className="text-muted">{post.voyage2hotel2}</span>
                        </div>
                        {post.voyage1nombrehotel2 && (
                          <div className="small fw-bold mt-1">{post.voyage1nombrehotel2}</div>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
              )}

              {post.destinacionhadj && (
                <Col xs={12} md={6} lg={4}>
                  <div className={`p-3 rounded-3 h-100 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <div className="d-flex align-items-start">
                      <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-2">
                        <i className="fas fa-kaaba text-warning"></i>
                      </div>
                      <div>
                        <div className="text-muted small">{t('holy_destination')}</div>
                        <h6 className="mb-0 fw-bold">{post.destinacionhadj}</h6>
                      </div>
                    </div>
                  </div>
                </Col>
              )}

              {post.paysDestination && (
                <Col xs={12} md={6} lg={4}>
                  <div className={`p-3 rounded-3 h-100 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <div className="d-flex align-items-start">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2 me-2">
                        <i className="fas fa-globe text-info"></i>
                      </div>
                      <div>
                        <div className="text-muted small">{t('destination_country')}</div>
                        <h6 className="mb-0 fw-bold">{post.paysDestination}</h6>
                      </div>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* PRECIOS DETALLADOS (NUEVO) */}
      {(post.prixAdulte || post.prixEnfant || post.prixBebe) && (
        <Card className={`border-0 shadow-sm mt-3 ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
          <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-success bg-opacity-10'}`}>
            <h5 className="mb-0 d-flex align-items-center text-success">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-2">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              {t('detailed_prices')}
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {post.prixAdulte && (
                <Col xs={12} md={4}>
                  <div className={`text-center p-4 rounded-3 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-user fs-1 text-primary mb-2"></i>
                    <div className="fw-bold fs-4">{post.prixAdulte} DA</div>
                    <div className="text-muted">{t('adult_price')}</div>
                  </div>
                </Col>
              )}
              {post.prixEnfant && (
                <Col xs={12} md={4}>
                  <div className={`text-center p-4 rounded-3 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-child fs-1 text-success mb-2"></i>
                    <div className="fw-bold fs-4">{post.prixEnfant} DA</div>
                    <div className="text-muted">{t('child_price')}</div>
                  </div>
                </Col>
              )}
              {post.prixBebe && (
                <Col xs={12} md={4}>
                  <div className={`text-center p-4 rounded-3 ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-baby fs-1 text-info mb-2"></i>
                    <div className="fw-bold fs-4">{post.prixBebe} DA</div>
                    <div className="text-muted">{t('baby_price')}</div>
                  </div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* DOCUMENTOS REQUERIDOS (NUEVO) */}
      {formatArray(post.documentsRequises).length > 0 && (
        <Card className={`border-0 shadow-sm mt-3 ${theme ? 'bg-dark text-light' : 'bg-white'}`}>
          <Card.Header className={`border-0 ${theme ? 'bg-dark' : 'bg-warning bg-opacity-10'}`}>
            <h5 className="mb-0 d-flex align-items-center text-warning">
              <div className="bg-warning bg-opacity-10 rounded-circle p-2 me-2">
                <i className="fas fa-file-alt"></i>
              </div>
              {t('required_documents')}
            </h5>
          </Card.Header>
          <Card.Body>
            <Row className="g-2">
              {formatArray(post.documentsRequises).map((document, index) => (
                <Col key={index} xs={12} sm={6} lg={4}>
                  <div className={`p-3 rounded ${theme ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                    <i className="fas fa-file-circle-check text-warning me-2"></i>
                    <span>{t(`document_${document}`)}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* BOTÓN DE CONTACTO MEJORADO */}
      {post.contacto && (
        <Card className={`border-0 shadow-lg mt-4 ${theme ? 'bg-dark text-light' : 'bg-success text-white'}`}>
          <Card.Body className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-phone-volume fs-1 mb-3"></i>
              <h3 className="mb-3">{t('ready_to_travel')}</h3>
              <p className="fs-5 opacity-90 mb-4">{t('contact_for_booking')}</p>
            </div>
            
            <Button
              variant="light"
              size="lg"
              className="px-5 py-3 shadow-lg fw-bold fs-5"
              style={{ borderRadius: '50px' }}
              onClick={() => window.open(`tel:${post.contacto}`, '_self')}
            >
              <i className="fas fa-phone me-3"></i>
              {t('call_now')}
              <div className="small mt-1">{post.contacto}</div>
            </Button>
            
            <div className="mt-4 opacity-75">
              <i className="fas fa-headset me-2"></i>
              {t('available_24_7')}
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default DescriptionPost;