import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert,
  Accordion
} from 'react-bootstrap';

// Importar todos los componentes modulares
import CategorySelector from '../components/forms/CategorySelector';
import TitleInput from '../components/forms/TitleInput';
import DescriptionTextarea from '../components/forms/DescriptionTextarea';
import AddressInput from '../components/forms/AddressInput';
import Horariodesalida from '../components/forms/Horariodesalida';
import DurationInput from '../components/forms/DurationInput';
import TransportSelect from '../components/forms/TransportSelect';
import DestinationManager from '../components/forms/DestinationManager';
import PensionSelect from '../components/forms/PensionSelect';
import ReturnDateInput from '../components/forms/ReturnDateInput';
import PriceSlider from '../components/forms/PriceSlider';
import CancellationPolicy from '../components/forms/CancellationPolicy';
import ContactReservation from '../components/forms/ContactReservation';
import ImageUpload from '../components/forms/ImageUpload';

// Importar acciones y tipos
import { createPost, updatePost } from '../redux/actions/postAction';
import communesjson from "../json/communes.json";

const Createpost = () => {
    const { auth, theme, socket, languageReducer } = useSelector((state) => state);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const { t, i18n } = useTranslation('createpost');

    // 🔷 OBTENER DATOS DE EDICIÓN DESDE location.state
    const isEdit = location.state?.isEdit || false;
    const postToEdit = location.state?.postData || null;

    // Estado inicial
    const initialState = {
        category: "Agence de Voyage",
        subCategory: "",
        title: "",
        description: "",
        price: "",
        wilaya: "",
        commune: "",
        contacto: "",
        itemsReservations_Visa: "",
        Location_Vacances: '',
        alquilergeneral: "",
        superficie: "",
        etage: "",
        promoteurimmobilier: false,
        specifications: [],
        adress: "",
        nombredelhotel: "",
        adresshotel: "",
        totalhabitaciones: "",
        tipodehabutaciones: [],
        estrellas: "",
        wifi: [],
        language: [],
        tarifnuit: "",
        reservacionenlinea: "",
        politiqueAnnulation: "",
        hotelWebsite: "",
        horariollegada: "",
        horadudepar: "",
        datedepar: "",
        duracionviaje: "",
        transporte: "",
        destinacionvoyage1: "",
        voyage1hotel1: "",
        voyage1nombrehotel1: "",
        destinacionvoyage2: "",
        voyage2hotel2: "",
        voyage1nombrehotel2: "",
        fecharegreso: "",
        serviciosdelhotel: "",
        incluidoenelprecio: "",
        cancelarreserva: "",
        destinacionhadj: "",
        // Nuevos campos para mejor experiencia
        typeVoyage: "",
        niveauConfort: "",
        servicesInclus: [],
        activites: [],
        publicCible: "",
        animauxAcceptes: false,
        parking: false,
        piscine: false,
        climatisation: false,
        cuisineEquipee: false,
        wifiGratuit: false,
        television: false,
        menageInclus: false,
        capacitePersonnes: "",
        nombreChambres: "",
        nombreSallesBain: "",
        checkInTime: "",
        checkOutTime: "",
        conditionsAnnulation: "",
        documentsRequises: [],
        delaiTraitement: "",
        paysDestination: "",
        typeVisa: "",
        dureeValidite: "",
        formalites: "",
        assurancesIncluses: false,
        guideLocal: false,
        repasInclus: false,
        transfertAeroport: false,
        excursions: [],
        prixAdulte: "",
        prixEnfant: "",
        prixBebe: "",
        optionsPaiement: [],
        acompteRequise: false,
        pourcentageAcompte: "",
    };

    // Estados
    const [postData, setPostData] = useState(initialState);
    const [images, setImages] = useState([]);
    const [selectedWilaya, setSelectedWilaya] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState("info");
    const [activeAccordion, setActiveAccordion] = useState(['0']);

    // 🔷 EFFECT PARA CAMBIO DE IDIOMA
    useEffect(() => {
        const lang = languageReducer?.language || 'fr';
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [languageReducer?.language, i18n]);

    // 🔷 EFFECT PARA CARGAR DATOS DE EDICIÓN
    useEffect(() => {
        if (isEdit && postToEdit) {
            setPostData({
                ...initialState,
                ...postToEdit,
                category: postToEdit.category || "Agence de Voyage",
                subCategory: postToEdit.subCategory || "",
                description: postToEdit.description || postToEdit.content || "",
                title: postToEdit.title || "",
            });

            if (postToEdit.images && postToEdit.images.length > 0) {
                setImages(postToEdit.images.map(img => ({
                    url: typeof img === 'string' ? img : img.url,
                    file: null
                })));
            } else {
                setImages([]);
            }

            setSelectedWilaya(postToEdit.wilaya || "");
        } else {
            setPostData(initialState);
            setImages([]);
            setSelectedWilaya("");
        }
    }, [isEdit, postToEdit]);

    // Handlers para el formulario
    const handleChangeInput = (e) => {
        const { name, value, type, checked } = e.target;
        setPostData(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Handler para arrays (servicios, activites, etc.)
    const handleArrayChange = (field, value, isChecked) => {
        setPostData(prevState => {
            const currentArray = prevState[field] || [];
            let newArray;
            
            if (isChecked) {
                newArray = [...currentArray, value];
            } else {
                newArray = currentArray.filter(item => item !== value);
            }
            
            return {
                ...prevState,
                [field]: newArray
            };
        });
    };

    const handleWilayaChange = (event) => {
        const selectedWilaya = event.target.value;
        setSelectedWilaya(selectedWilaya);
        const wilayaEncontrada = communesjson.find((wilaya) => wilaya.wilaya === selectedWilaya);
        const communes = wilayaEncontrada ? wilayaEncontrada.commune : [];
        
        setPostData((prevState) => ({
            ...prevState,
            wilaya: selectedWilaya,
            commune: communes.length > 0 ? communes[0] : "",
        }));
    };

    const handleCommuneChange = (event) => {
        const selectedCommune = event.target.value;
        setPostData((prevState) => ({
            ...prevState,
            commune: selectedCommune,
        }));
    };

    // Handler para manejar imágenes
    const handleChangeImages = (e) => {
        const files = [...e.target.files];
        let err = "";
        let newImages = [];

        files.forEach(file => {
            if (!file) return err = t('validation_images_required');
            if (file.size > 1024 * 1024 * 5) {
                return err = "La taille de l'image/vidéo ne doit pas dépasser 5mb.";
            }
            return newImages.push(file);
        });

        if (err) {
            setAlertMessage(err);
            setAlertVariant("danger");
            setShowAlert(true);
            return;
        }

        setImages([...images, ...newImages]);
    };

    // Handler para eliminar imágenes
    const deleteImages = (index) => {
        const newArr = [...images];
        newArr.splice(index, 1);
        setImages(newArr);
    };

    // 🔷 HANDLER SUBMIT MEJORADO
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones
        if (!postData.subCategory) {
            setAlertMessage(t('validation_category_required'));
            setAlertVariant("danger");
            setShowAlert(true);
            return;
        }

        if (!postData.wilaya || !postData.commune) {
            setAlertMessage(t('validation_wilaya_required'));
            setAlertVariant("danger");
            setShowAlert(true);
            return;
        }

        if (images.length === 0) {
            setAlertMessage(t('validation_images_required'));
            setAlertVariant("danger");
            setShowAlert(true);
            return;
        }

        try {
            if (isEdit && postToEdit) {
                const status = {
                    _id: postToEdit._id,
                    ...postToEdit
                };

                await dispatch(updatePost({ 
                    postData, 
                    images, 
                    auth, 
                    status 
                }));

                setAlertMessage(t('success_update'));
                setAlertVariant("success");
            } else {
                await dispatch(createPost({ 
                    postData, 
                    images, 
                    auth, 
                    socket 
                }));

                setAlertMessage(t('success_create'));
                setAlertVariant("success");
            }

            setShowAlert(true);

            setTimeout(() => {
                history.push('/');
            }, 2000);

        } catch (error) {
            setAlertMessage(t('error_publication'));
            setAlertVariant("danger");
            setShowAlert(true);
        }
    };

    // 🔷 HANDLER CANCELAR
    const handleCancel = () => {
        history.goBack();
    };

    // Opciones para wilayas y communes
    const wilayasOptions = communesjson.map((wilaya, index) => (
        <option key={index} value={wilaya.wilaya}>
            {wilaya.wilaya}
        </option>
    ));

    const communesOptions = selectedWilaya
        ? communesjson
            .find((wilaya) => wilaya.wilaya === selectedWilaya)
            ?.commune?.map((commune, index) => (
                <option key={index} value={commune}>
                    {commune}
                </option>
            ))
        : [];

    // 🔷 COMPONENTES DINÁMICOS SEGÚN SUBCATEGORÍA
    const renderVoyageOrganiseFields = () => (
        <>
            <Accordion activeKey={activeAccordion} onSelect={setActiveAccordion} className="mb-3">
                {/* Informations Générales */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="fas fa-info-circle me-2 text-primary"></i>
                        {t('informations_generales')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('type_voyage')}</Form.Label>
                                    <Form.Select 
                                        name="typeVoyage"
                                        value={postData.typeVoyage}
                                        onChange={handleChangeInput}
                                    >
                                        <option value="">{t('select_type')}</option>
                                        <option value="culturel">{t('type_culturel')}</option>
                                        <option value="aventure">{t('type_aventure')}</option>
                                        <option value="detente">{t('type_detente')}</option>
                                        <option value="religieux">{t('type_religieux')}</option>
                                        <option value="affaires">{t('type_affaires')}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('niveau_confort')}</Form.Label>
                                    <Form.Select 
                                        name="niveauConfort"
                                        value={postData.niveauConfort}
                                        onChange={handleChangeInput}
                                    >
                                        <option value="">{t('select_confort')}</option>
                                        <option value="economique">{t('comfort_economique')}</option>
                                        <option value="standard">{t('comfort_standard')}</option>
                                        <option value="confort">{t('comfort_confort')}</option>
                                        <option value="luxe">{t('comfort_luxe')}</option>
                                        <option value="premium">{t('comfort_premium')}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mt-3">
                            <Form.Label>{t('public_cible')}</Form.Label>
                            <Form.Select 
                                name="publicCible"
                                value={postData.publicCible}
                                onChange={handleChangeInput}
                            >
                                <option value="">{t('select_public')}</option>
                                <option value="familles">{t('public_familles')}</option>
                                <option value="couples">{t('public_couples')}</option>
                                <option value="seniors">{t('public_seniors')}</option>
                                <option value="jeunes">{t('public_jeunes')}</option>
                                <option value="groupes">{t('public_groupes')}</option>
                                <option value="tous">{t('public_tous')}</option>
                            </Form.Select>
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Dates et Durée */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <i className="fas fa-calendar-alt me-2 text-success"></i>
                        {t('dates_duree')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Horariodesalida postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        <DurationInput postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        <ReturnDateInput postData={postData} handleChangeInput={handleChangeInput} t={t} />
                    </Accordion.Body>
                </Accordion.Item>

                {/* Transport et Destinations */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <i className="fas fa-plane me-2 text-info"></i>
                        {t('transport_destinations')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <TransportSelect postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        <DestinationManager postData={postData} handleChangeInput={handleChangeInput} t={t} />
                    </Accordion.Body>
                </Accordion.Item>

                {/* Hébergement et Pension */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        <i className="fas fa-hotel me-2 text-warning"></i>
                        {t('hebergement_pension')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <PensionSelect postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        
                        <Form.Group className="mt-3">
                            <Form.Label>{t('services_hotel_inclus')}</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {['wifi', 'piscine', 'spa', 'restaurant', 'gym', 'room_service'].map(service => (
                                    <Form.Check
                                        key={service}
                                        type="checkbox"
                                        label={t(`service_${service}`)}
                                        checked={postData.servicesInclus?.includes(service) || false}
                                        onChange={(e) => handleArrayChange('servicesInclus', service, e.target.checked)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Activités et Excursions */}
                <Accordion.Item eventKey="4">
                    <Accordion.Header>
                        <i className="fas fa-hiking me-2 text-primary"></i>
                        {t('activites_excursions')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form.Group>
                            <Form.Label>{t('activites_incluses')}</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {['visite_guidee', 'randonnee', 'plongee', 'shopping', 'degustation', 'spectacle'].map(activite => (
                                    <Form.Check
                                        key={activite}
                                        type="checkbox"
                                        label={t(`activite_${activite}`)}
                                        checked={postData.activites?.includes(activite) || false}
                                        onChange={(e) => handleArrayChange('activites', activite, e.target.checked)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Prix et Conditions */}
                <Accordion.Item eventKey="5">
                    <Accordion.Header>
                        <i className="fas fa-euro-sign me-2 text-success"></i>
                        {t('prix_conditions')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <PriceSlider postData={postData} setPostData={setPostData} t={t} />
                        
                        <Row className="g-3 mt-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('prix_adulte')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="prixAdulte"
                                        value={postData.prixAdulte}
                                        onChange={handleChangeInput}
                                        placeholder={t('prix_par_adulte')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('prix_enfant')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="prixEnfant"
                                        value={postData.prixEnfant}
                                        onChange={handleChangeInput}
                                        placeholder={t('prix_par_enfant')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('prix_bebe')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="prixBebe"
                                        value={postData.prixBebe}
                                        onChange={handleChangeInput}
                                        placeholder={t('prix_par_bebe')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <CancellationPolicy postData={postData} handleChangeInput={handleChangeInput} t={t} />
                    </Accordion.Body>
                </Accordion.Item>

                {/* Services Inclus */}
                <Accordion.Item eventKey="6">
                    <Accordion.Header>
                        <i className="fas fa-check-circle me-2 text-info"></i>
                        {t('services_inclus')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="row g-3">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="assurancesIncluses"
                                    label={t('assurances_incluses')}
                                    checked={postData.assurancesIncluses || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="guideLocal"
                                    label={t('guide_local_francophone')}
                                    checked={postData.guideLocal || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="repasInclus"
                                    label={t('repas_inclus')}
                                    checked={postData.repasInclus || false}
                                    onChange={handleChangeInput}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="transfertAeroport"
                                    label={t('transfert_aeroport')}
                                    checked={postData.transfertAeroport || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="excursions"
                                    label={t('excursions_incluses')}
                                    checked={postData.excursions?.length > 0 || false}
                                    onChange={(e) => handleArrayChange('excursions', 'incluses', e.target.checked)}
                                />
                            </Col>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <ContactReservation postData={postData} handleChangeInput={handleChangeInput} t={t} />
        </>
    );

    const renderLocationVacancesFields = () => (
        <>
            <Accordion activeKey={activeAccordion} onSelect={setActiveAccordion} className="mb-3">
                {/* Caractéristiques du Logement */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="fas fa-home me-2 text-primary"></i>
                        {t('caracteristiques_logement')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('capacite_personnes')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="capacitePersonnes"
                                        value={postData.capacitePersonnes}
                                        onChange={handleChangeInput}
                                        placeholder={t('capacite_personnes')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('nombre_chambres')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="nombreChambres"
                                        value={postData.nombreChambres}
                                        onChange={handleChangeInput}
                                        placeholder={t('nombre_chambres')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('nombre_salles_bain')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="nombreSallesBain"
                                        value={postData.nombreSallesBain}
                                        onChange={handleChangeInput}
                                        placeholder={t('nombre_salles_bain')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3 mt-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('superficie')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="superficie"
                                        value={postData.superficie}
                                        onChange={handleChangeInput}
                                        placeholder={t('superficie')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('etage')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="etage"
                                        value={postData.etage}
                                        onChange={handleChangeInput}
                                        placeholder={t('etage')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Équipements et Services */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <i className="fas fa-tv me-2 text-success"></i>
                        {t('equipements_services')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="wifiGratuit"
                                    label={t('wifi_gratuit')}
                                    checked={postData.wifiGratuit || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="climatisation"
                                    label={t('climatisation')}
                                    checked={postData.climatisation || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="cuisineEquipee"
                                    label={t('cuisine_equipee')}
                                    checked={postData.cuisineEquipee || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="television"
                                    label={t('television')}
                                    checked={postData.television || false}
                                    onChange={handleChangeInput}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="piscine"
                                    label={t('piscine')}
                                    checked={postData.piscine || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="parking"
                                    label={t('parking')}
                                    checked={postData.parking || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="animauxAcceptes"
                                    label={t('animaux_acceptes')}
                                    checked={postData.animauxAcceptes || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="menageInclus"
                                    label={t('menage_inclus')}
                                    checked={postData.menageInclus || false}
                                    onChange={handleChangeInput}
                                />
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Informations de Séjour */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <i className="fas fa-calendar-check me-2 text-info"></i>
                        {t('informations_sejour')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('check_in')}</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="checkInTime"
                                        value={postData.checkInTime}
                                        onChange={handleChangeInput}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('check_out')}</Form.Label>
                                    <Form.Control
                                        type="time"
                                        name="checkOutTime"
                                        value={postData.checkOutTime}
                                        onChange={handleChangeInput}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mt-3">
                            <Form.Label>{t('conditions_annulation')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="conditionsAnnulation"
                                value={postData.conditionsAnnulation}
                                onChange={handleChangeInput}
                                placeholder={t('conditions_annulation')}
                            />
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Prix et Réservation */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        <i className="fas fa-euro-sign me-2 text-warning"></i>
                        {t('prix_reservation')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <PriceSlider postData={postData} setPostData={setPostData} t={t} />
                        
                        <Form.Group className="mt-3">
                            <Form.Label>{t('options_paiement')}</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {['especes', 'carte_credit', 'virement', 'cheque'].map(option => (
                                    <Form.Check
                                        key={option}
                                        type="checkbox"
                                        label={t(`option_${option}`)}
                                        checked={postData.optionsPaiement?.includes(option) || false}
                                        onChange={(e) => handleArrayChange('optionsPaiement', option, e.target.checked)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Row className="g-3 mt-3">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="acompteRequise"
                                    label={t('acompte_requise')}
                                    checked={postData.acompteRequise || false}
                                    onChange={handleChangeInput}
                                />
                            </Col>
                            <Col md={6}>
                                {postData.acompteRequise && (
                                    <Form.Group>
                                        <Form.Label>{t('pourcentage_acompte')}</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="pourcentageAcompte"
                                            value={postData.pourcentageAcompte}
                                            onChange={handleChangeInput}
                                            placeholder="30%"
                                        />
                                    </Form.Group>
                                )}
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <ContactReservation postData={postData} handleChangeInput={handleChangeInput} t={t} />
        </>
    );

    const renderHadjOmraFields = () => (
        <>
            <Accordion activeKey={activeAccordion} onSelect={setActiveAccordion} className="mb-3">
                {/* Informations du Pèlerinage */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="fas fa-kaaba me-2 text-primary"></i>
                        {t('informations_peletinage')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('type_peletinage')}</Form.Label>
                                    <Form.Select 
                                        name="typeVoyage"
                                        value={postData.typeVoyage}
                                        onChange={handleChangeInput}
                                    >
                                        <option value="">{t('select_type')}</option>
                                        <option value="hadj">{t('type_hadj')}</option>
                                        <option value="omra">{t('type_omra')}</option>
                                        <option value="hadj_omra">{t('type_hadj_omra')}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('niveau_confort')}</Form.Label>
                                    <Form.Select 
                                        name="niveauConfort"
                                        value={postData.niveauConfort}
                                        onChange={handleChangeInput}
                                    >
                                        <option value="">{t('select_confort')}</option>
                                        <option value="economique">{t('comfort_economique')}</option>
                                        <option value="standard">{t('comfort_standard')}</option>
                                        <option value="confort">{t('comfort_confort')}</option>
                                        <option value="luxe">{t('comfort_luxe')}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mt-3">
                            <Form.Label>{t('destination_principale')}</Form.Label>
                            <Form.Control
                                type="text"
                                name="destinacionhadj"
                                value={postData.destinacionhadj}
                                onChange={handleChangeInput}
                                placeholder={t('destination_principale')}
                            />
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Dates et Durée */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <i className="fas fa-calendar-alt me-2 text-success"></i>
                        {t('dates_duree')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Horariodesalida postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        <DurationInput postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        <ReturnDateInput postData={postData} handleChangeInput={handleChangeInput} t={t} />
                    </Accordion.Body>
                </Accordion.Item>

                {/* Transport et Hébergement */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <i className="fas fa-hotel me-2 text-info"></i>
                        {t('transport_destinations')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <TransportSelect postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        <PensionSelect postData={postData} handleChangeInput={handleChangeInput} t={t} />
                        
                        <Form.Group className="mt-3">
                            <Form.Label>{t('distance_lieux_saints')}</Form.Label>
                            <Form.Select 
                                name="niveauConfort"
                                value={postData.niveauConfort}
                                onChange={handleChangeInput}
                            >
                                <option value="">{t('select_type')}</option>
                                <option value="tres_proche">{t('distance_tres_proche')}</option>
                                <option value="proche">{t('distance_proche')}</option>
                                <option value="moyenne">{t('distance_moyenne')}</option>
                                <option value="eloigne">{t('distance_eloigne')}</option>
                            </Form.Select>
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Services Spirituels */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        <i className="fas fa-book-quran me-2 text-warning"></i>
                        {t('services_spirituels')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form.Group>
                            <Form.Label>{t('services_religieux_inclus')}</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {['guide_religieux', 'cours_rituels', 'assistance_ihram', 'groupe_etude', 'prieres_collectives'].map(service => (
                                    <Form.Check
                                        key={service}
                                        type="checkbox"
                                        label={t(`service_${service}`)}
                                        checked={postData.servicesInclus?.includes(service) || false}
                                        onChange={(e) => handleArrayChange('servicesInclus', service, e.target.checked)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>{t('langue_guide')}</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {['arabe', 'francais', 'anglais', 'berbere'].map(langue => (
                                    <Form.Check
                                        key={langue}
                                        type="checkbox"
                                        label={t(`langue_${langue}`)}
                                        checked={postData.language?.includes(langue) || false}
                                        onChange={(e) => handleArrayChange('language', langue, e.target.checked)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Prix et Conditions */}
                <Accordion.Item eventKey="4">
                    <Accordion.Header>
                        <i className="fas fa-euro-sign me-2 text-success"></i>
                        {t('prix_conditions')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <PriceSlider postData={postData} setPostData={setPostData} t={t} />
                        
                        <Row className="g-3 mt-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('prix_adulte')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="prixAdulte"
                                        value={postData.prixAdulte}
                                        onChange={handleChangeInput}
                                        placeholder={t('prix_par_adulte')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('prix_enfant')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="prixEnfant"
                                        value={postData.prixEnfant}
                                        onChange={handleChangeInput}
                                        placeholder={t('prix_par_enfant')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>{t('prix_bebe')}</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="prixBebe"
                                        value={postData.prixBebe}
                                        onChange={handleChangeInput}
                                        placeholder={t('prix_par_bebe')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <CancellationPolicy postData={postData} handleChangeInput={handleChangeInput} t={t} />
                    </Accordion.Body>
                </Accordion.Item>

                {/* Documents Requis */}
                <Accordion.Item eventKey="5">
                    <Accordion.Header>
                        <i className="fas fa-passport me-2 text-danger"></i>
                        {t('documents_requis')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form.Group>
                            <Form.Label>{t('documents_necessaires')}</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {['passeport', 'photos_identite', 'certificat_vaccination', 'reservation_hotel', 'billet_avion'].map(doc => (
                                    <Form.Check
                                        key={doc}
                                        type="checkbox"
                                        label={t(`document_${doc}`)}
                                        checked={postData.documentsRequises?.includes(doc) || false}
                                        onChange={(e) => handleArrayChange('documentsRequises', doc, e.target.checked)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Row className="g-3 mt-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('delai_traitement')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="delaiTraitement"
                                        value={postData.delaiTraitement}
                                        onChange={handleChangeInput}
                                        placeholder={t('delai_traitement')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('assistance_administrative')}</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="assurancesIncluses"
                                        label={t('assistance_administrative')}
                                        checked={postData.assurancesIncluses || false}
                                        onChange={handleChangeInput}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <ContactReservation postData={postData} handleChangeInput={handleChangeInput} t={t} />
        </>
    );

    const renderReservationsVisaFields = () => (
        <>
            <Accordion activeKey={activeAccordion} onSelect={setActiveAccordion} className="mb-3">
                {/* Informations Visa */}
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <i className="fas fa-passport me-2 text-primary"></i>
                        {t('informations_visa')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Row className="g-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('type_visa')}</Form.Label>
                                    <Form.Select 
                                        name="typeVisa"
                                        value={postData.typeVisa}
                                        onChange={handleChangeInput}
                                    >
                                        <option value="">{t('select_type')}</option>
                                        <option value="touristique">{t('type_touristique')}</option>
                                        <option value="affaires">{t('type_affaires')}</option>
                                        <option value="etudiant">{t('type_etudiant')}</option>
                                        <option value="medical">{t('type_medical')}</option>
                                        <option value="transit">{t('type_transit')}</option>
                                        <option value="familial">{t('type_familial')}</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('pays_destination')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="paysDestination"
                                        value={postData.paysDestination}
                                        onChange={handleChangeInput}
                                        placeholder={t('pays_destination')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="g-3 mt-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('duree_validite')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="dureeValidite"
                                        value={postData.dureeValidite}
                                        onChange={handleChangeInput}
                                        placeholder={t('duree_validite')}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>{t('delai_traitement')}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="delaiTraitement"
                                        value={postData.delaiTraitement}
                                        onChange={handleChangeInput}
                                        placeholder={t('delai_traitement')}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Formalités et Documents */}
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        <i className="fas fa-file-alt me-2 text-success"></i>
                        {t('formalites_documents')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <Form.Group>
                            <Form.Label>{t('documents_necessaires')}</Form.Label>
                            <div className="d-flex flex-wrap gap-3">
                                {['passeport', 'photos_identite', 'justificatif_domicile', 'releve_bancaire', 'billet_avion', 'reservation_hotel', 'assurance_voyage', 'lettre_invitation'].map(doc => (
                                    <Form.Check
                                        key={doc}
                                        type="checkbox"
                                        label={t(`document_${doc}`)}
                                        checked={postData.documentsRequises?.includes(doc) || false}
                                        onChange={(e) => handleArrayChange('documentsRequises', doc, e.target.checked)}
                                    />
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>{t('formalites_speciales')}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="formalites"
                                value={postData.formalites}
                                onChange={handleChangeInput}
                                placeholder={t('formalites_speciales')}
                            />
                        </Form.Group>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Services Inclus */}
                <Accordion.Item eventKey="2">
                    <Accordion.Header>
                        <i className="fas fa-concierge-bell me-2 text-info"></i>
                        {t('services_inclus')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <div className="row g-3">
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="assurancesIncluses"
                                    label={t('assistance_complete_dossier')}
                                    checked={postData.assurancesIncluses || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="guideLocal"
                                    label={t('remplissage_formulaires')}
                                    checked={postData.guideLocal || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="repasInclus"
                                    label={t('prise_rendez_vous')}
                                    checked={postData.repasInclus || false}
                                    onChange={handleChangeInput}
                                />
                            </Col>
                            <Col md={6}>
                                <Form.Check
                                    type="checkbox"
                                    name="transfertAeroport"
                                    label={t('accompagnement_ambassade')}
                                    checked={postData.transfertAeroport || false}
                                    onChange={handleChangeInput}
                                />
                                <Form.Check
                                    type="checkbox"
                                    name="excursions"
                                    label={t('suivi_dossier_temps_reel')}
                                    checked={postData.excursions?.length > 0 || false}
                                    onChange={(e) => handleArrayChange('excursions', 'suivi', e.target.checked)}
                                />
                            </Col>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>

                {/* Tarifs et Conditions */}
                <Accordion.Item eventKey="3">
                    <Accordion.Header>
                        <i className="fas fa-euro-sign me-2 text-warning"></i>
                        {t('tarifs_conditions')}
                    </Accordion.Header>
                    <Accordion.Body>
                        <PriceSlider postData={postData} setPostData={setPostData} t={t} />
                        
                        <Form.Group className="mt-3">
                            <Form.Label>{t('frais_dossier')}</Form.Label>
                            <Form.Control
                                type="number"
                                name="prixAdulte"
                                value={postData.prixAdulte}
                                onChange={handleChangeInput}
                                placeholder={t('frais_dossier')}
                            />
                        </Form.Group>

                        <Form.Group className="mt-3">
                            <Form.Label>{t('frais_ambassade')}</Form.Label>
                            <Form.Control
                                type="number"
                                name="prixEnfant"
                                value={postData.prixEnfant}
                                onChange={handleChangeInput}
                                placeholder={t('frais_ambassade')}
                            />
                        </Form.Group>

                        <CancellationPolicy postData={postData} handleChangeInput={handleChangeInput} t={t} />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <ContactReservation postData={postData} handleChangeInput={handleChangeInput} t={t} />
        </>
    );

    return (
        <Container className="my-4">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <Card>
                        <Card.Header className={isEdit ? "bg-warning text-dark" : "bg-primary text-white"}>
                            <h4 className="mb-0">
                                {isEdit ? `✏️ ${t('edit_title')}` : `📢 ${t('create_title')}`}
                            </h4>
                            {isEdit && postToEdit?.title && (
                                <small>{t('modification')}: "{postToEdit.title}"</small>
                            )}
                        </Card.Header>
                        <Card.Body>
                            {/* 🔷 DEBUG INFO */}
                            {process.env.NODE_ENV === 'development' && (
                                <Alert variant="info" className="mb-3">
                                    <strong>Debug:</strong> {t('debug_mode')}: {isEdit ? t('edit_title') : t('create_title')} | 
                                    {t('debug_id')}: {postToEdit?._id || 'N/A'} | 
                                    {t('debug_category')}: {postData.subCategory || t('debug_not_selected')}
                                </Alert>
                            )}

                            {showAlert && (
                                <Alert 
                                    variant={alertVariant} 
                                    dismissible 
                                    onClose={() => setShowAlert(false)}
                                    className="mb-4"
                                >
                                    {alertMessage}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                
                                {/* Selector de Categoría */}
                                <CategorySelector 
                                    postData={postData} 
                                    handleChangeInput={handleChangeInput} 
                                    t={t}
                                />

                                {/* Campos comunes a todas las categorías */}
                                {postData.subCategory && (
                                    <>
                                        <TitleInput 
                                            postData={postData} 
                                            handleChangeInput={handleChangeInput} 
                                            placeholder={
                                                postData.subCategory === "Voyage_Organise" ? t('placeholder_voyage') :
                                                postData.subCategory === "Location_Vacances" ? t('placeholder_location') :
                                                postData.subCategory === "hadj_Omra" ? t('placeholder_hadj') :
                                                t('placeholder_visa')
                                            }
                                            t={t}
                                        />
                                        <DescriptionTextarea 
                                            postData={postData} 
                                            handleChangeInput={handleChangeInput} 
                                            t={t}
                                        />
                                        <AddressInput 
                                            postData={postData}
                                            handleChangeInput={handleChangeInput}
                                            wilayasOptions={wilayasOptions}
                                            communesOptions={communesOptions}
                                            handleWilayaChange={handleWilayaChange}
                                            handleCommuneChange={handleCommuneChange}
                                            t={t}
                                        />
                                    </>
                                )}

                                {/* Campos dinámicos según subcategoría */}
                                {postData.subCategory === "Voyage_Organise" && renderVoyageOrganiseFields()}
                                {postData.subCategory === "Location_Vacances" && renderLocationVacancesFields()}
                                {postData.subCategory === "hadj_Omra" && renderHadjOmraFields()}
                                {postData.subCategory === "Reservations_Visa" && renderReservationsVisaFields()}

                                {/* Componente de imágenes */}
                                <ImageUpload 
                                    images={images}
                                    handleChangeImages={handleChangeImages}
                                    deleteImages={deleteImages}
                                    theme={theme}
                                    t={t}
                                />

                                {/* Botones */}
                                <div className="d-flex gap-2 mt-4">
                                    <Button 
                                        variant={isEdit ? "warning" : "success"} 
                                        type="submit" 
                                        size="lg"
                                        className="flex-fill"
                                    >
                                        {isEdit ? `💾 ${t('button_update')}` : `📢 ${t('button_publish')}`}
                                    </Button>
                                    
                                    <Button 
                                        variant="secondary" 
                                        type="button" 
                                        size="lg"
                                        onClick={handleCancel}
                                    >
                                        ❌ {t('button_cancel')}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Createpost;