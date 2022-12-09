const db = require('../models/db');

// Devuelve todos los tickets
exports.findAll = (req, res) => {
    var condition = {};

    db.getInstance().collection('tickets').find(condition).toArray().then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};

// 1. Listar tickets de tipo "Desperfecto" ordenados por motivo
exports.listarDesperfectos = (req, res) => {
    db.getInstance().collection('tickets').find({ "tipo_ticket": { $eq: "Desperfecto" } }).sort({ motivo: 1 }).toArray().then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};

// 3. Cantidad de tickets sin resolver agrupando por localidad
exports.cantTicketsSinResolverLoc = (req, res) => {
    var condition = [ 
        { 
            $match: { 
                "solucion": { $exists: false } 
            } 
        }, 
        { 
            $group: { 
                _id: "$cliente.ubicacion.localidad.nombre", 
                total: { $sum: 1 } 
            } 
        },
        {
            $project: {
                _id: 0,
                localidad: "$_id",
                tickets_sin_resolver: "$total"
            }
        }
    ];

    db.getInstance().collection('tickets').aggregate(condition).toArray().then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};

// 6. Operaciones del área de soporte técnico (Lanús, Banfield, Avellaneda)
exports.operacSopTecLanBanAvell = (req, res) => {
    var condition = [ 
        {
            $match: {
                "cliente.ubicacion.localidad.nombre": { $in: [ 'Lanús', 'Banfield', 'Avellaneda' ] }
            }
        },
        { 
            $match: { 
                historial: { 
                    $elemMatch: { "empleado.area": "Soporte técnico" } 
                } 
            } 
        }, 
        { $unwind: "$historial" }, 
        { $match: { "historial.empleado.area": "Soporte técnico" } }, 
        { 
            $project: { 
                _id: 0,
                area: "$historial.empleado.area", 
                localidad: "$cliente.ubicacion.localidad.nombre",
                operacion: "$historial.operacion" 
            } 
        } 
    ];

    db.getInstance().collection('tickets').aggregate(condition).toArray().then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};

// 8. Cantidad de tickets en una zona determinada
exports.ticketsZona1 = (req, res) => {
    var condition = { 
        "cliente.ubicacion.ubicacion_geo": { 
            $geoWithin: { 
                $geometry: { 
                    type: "Polygon", 
                    coordinates: [ [ 
                        [ -58.41688156127929, -34.63221919607081 ],
                        [ -58.38993072509765, -34.63221919607081 ],
                        [ -58.38993072509765, -34.61837594446456 ],
                        [ -58.41688156127929, -34.61837594446456 ],
                        [ -58.41688156127929, -34.63221919607081 ] 
                    ] ] 
                } 
            } 
        } 
    };

    db.getInstance().collection('tickets').find(condition).count().then(data => {
        res.send({ "cantidad_tickets": data });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};

// 9. Tickets generados en calle "Combate de los Pozos" (CABA)
exports.ticketsCombateDeLosPozos = (req, res) => {
    var condition = { 
        $and: [ 
            { $text: { $search: "\"Combate de los Pozos\"" } }, 
            { "cliente.ubicacion.provincia": "CABA" } 
        ] 
    };

    db.getInstance().collection('tickets').find(condition).toArray().then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};

// 11. Último ticket generado en Lanús o Banfield
exports.ticketsBanfieldLanus = (req, res) => {
    var condition = { 
        $or: [ 
            { "cliente.ubicacion.localidad.nombre": "Banfield" }, 
            { "cliente.ubicacion.localidad.nombre": "Lanús" } 
        ] 
    };

    db.getInstance().collection('tickets').find(condition).limit(1).toArray().then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};

// 12. Tickets creados fuera de Lanús o Banfield
exports.todosMenosBanfieldLanus = (req, res) => {
    var condition = { 
        "cliente.ubicacion.localidad.nombre": { $nin: [ "Banfield", "Lanús" ] } 
    };

    db.getInstance().collection('tickets').find(condition).toArray().then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    });
};















