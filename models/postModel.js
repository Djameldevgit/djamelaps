const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    // Campos existentes
    content: String,
    title: String,
    link: String,
    price: String,
    priceType: String,
    offerType: String,
    features: {
        type: Array,
        default: []
    },

    // ✅ CAMPOS EXISTENTES PARA AGENCIA DE VIAJES
    category: {
        type: String,
        default: "Agence de Voyage zemzem"
    },
    subCategory: String,
    description: String,
    wilaya: String,
    commune: String,
    contacto: String,
    itemsReservations_Visa: String,
    Location_Vacances: String,
    alquilergeneral: String,
    superficie: String,
    etage: String,
    promoteurimmobilier: {
        type: Boolean,
        default: false
    },
    specifications: {
        type: Array,
        default: []
    },
    adress: String,
    nombredelhotel: String,
    adresshotel: String,
    totalhabitaciones: String,
    tipodehabutaciones: {
        type: Array,
        default: []
    },
    estrellas: String,
    wifi: {
        type: Array,
        default: []
    },
    language: {
        type: Array,
        default: []
    },
    tarifnuit: String,
    reservacionenlinea: String,
    politiqueAnnulation: String,
    hotelWebsite: String,
    horariollegada: String,
    horadudepar: String,
    datedepar: String,
    duracionviaje: String,
    transporte: String,
    destinacionvoyage1: String,
    voyage1hotel1: String,
    voyage1nombrehotel1: String,
    destinacionvoyage2: String,
    voyage2hotel2: String,
    voyage1nombrehotel2: String,
    fecharegreso: String,
    serviciosdelhotel: String,
    incluidoenelprecio: String,
    cancelarreserva: String,
    destinacionhadj: String,

    // 🆕 NUEVOS CAMPOS AGREGADOS
    typeVoyage: String,
    niveauConfort: String,
    servicesInclus: {
        type: Array,
        default: []
    },
    activites: {
        type: Array,
        default: []
    },
    publicCible: String,
    animauxAcceptes: {
        type: Boolean,
        default: false
    },
    parking: {
        type: Boolean,
        default: false
    },
    piscine: {
        type: Boolean,
        default: false
    },
    climatisation: {
        type: Boolean,
        default: false
    },
    cuisineEquipee: {
        type: Boolean,
        default: false
    },
    wifiGratuit: {
        type: Boolean,
        default: false
    },
    television: {
        type: Boolean,
        default: false
    },
    menageInclus: {
        type: Boolean,
        default: false
    },
    capacitePersonnes: String,
    nombreChambres: String,
    nombreSallesBain: String,
    checkInTime: String,
    checkOutTime: String,
    conditionsAnnulation: String,
    documentsRequises: {
        type: Array,
        default: []
    },
    delaiTraitement: String,
    paysDestination: String,
    typeVisa: String,
    dureeValidite: String,
    formalites: String,
    assurancesIncluses: {
        type: Boolean,
        default: false
    },
    guideLocal: {
        type: Boolean,
        default: false
    },
    repasInclus: {
        type: Boolean,
        default: false
    },
    transfertAeroport: {
        type: Boolean,
        default: false
    },
    excursions: {
        type: Array,
        default: []
    },
    prixAdulte: String,
    prixEnfant: String,
    prixBebe: String,
    optionsPaiement: {
        type: Array,
        default: []
    },
    acompteRequise: {
        type: Boolean,
        default: false
    },
    pourcentageAcompte: String,

    // Campos existentes
    images: {
        type: Array,
        required: true
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema)