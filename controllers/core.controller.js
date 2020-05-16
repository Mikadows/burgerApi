const mongoose = require('mongoose')
class Core {
    // -------------------------
    // We take a list of models in param and if necessary
    // apply populate on it to render correctly
    // -------------------------
    static render(list, options = {}) {
        const isAlone = !Array.isArray(list);
        // On s'arrange pour traiter une liste
        if (isAlone) list = [list];
        return (
            Promise.resolve()
                .then(() => {
                    // On regarde si on ne doit afficher que certains champs
                    if (options.fields) {
                        // Si la liste des champs est une
                        // chaine de caractère, on la découpe
                        if (typeof options.fields === 'string')
                            options.fields = options.fields.split(' ');
                        // On fait le tri des champs
                        list = list.map(model => {
                            return this.filterFields(model.toObject(), options.fields)
                        })
                    }
                    // On regarde si on doit gérer des populates
                    if (options.populates) {
                        return this.getModel().populate(list, options.populates)
                    }
                    return list;
                })
                // On retourne le résultat attendu
                .then(renderedList => (isAlone ? renderedList.pop() : renderedList))
        )
    }
    // -------------------------
    // Start a find on documents
    // -------------------------
    static find(search, options = {}) {
        return (
            Promise.resolve()
                .then(() => this.cleanModelData(search))
                .then(s =>
                    this.getModel()
                        .find(s)
                        .sort(options.order || 'created_at')
                        .exec()
                )
        );
    }

    // -------------------------
    // Update a document by his ID
    // -------------------------
    static update(id, data, options = {}) {
        return (
            Promise.resolve()
                // On ne garde que les champs qu'il est possible de modifier
                .then(() => this.filterFields(data, options.authorizedFields))
                .then(filteredData =>
                    Promise.all([
                        // On nettoie les données avant l'ajout en BDD
                        this.cleanModelData(filteredData),
                        // On récupère le document
                        typeof id === 'object'
                            ? this.getModel()
                                .findOne(id)
                                .exec()
                            : this.getModel()
                                .findById(id)
                                .exec(),
                    ])
                )
                .then(([model, checkedData]) => {
                    if (!model)
                        throw new Error(
                            `Unknow ${this.prototype.modelName} document ID ${id}`
                        );
                    // Si pas de données à modifier, on retourne le model
                    if (!Object.keys(checkedData).length) return model;
                    // On met les données à jour
                    model.set(checkedData);
                    // Pour être sûr, on indique le changement de chacune des données
                    Object.keys(checkedData).forEach(key => model.markModified(key));
                    // On lance la sauvegarde
                    return model.save();
                })
        )
    }

    // -------------------------
    // Return the render of a documents
    // id can be a document or an ID
    // -------------------------
    static read(id, options = {}) {
        return Promise.resolve()
            .then(() =>
                {
                    if(typeof id === 'object' && id.length > 1) {
                        return this.getModel().find();
                    }
                    return typeof id === 'object'
                        ? this.getModel().findOne(id).exec()
                        : this.getModel().findById(id).exec()
                }
            )
            .then((model) => {
                if (!model) {
                    throw new Error(`Unknow item ${id}`)
                }
                return this.render(model, options)
            })
    }

    // -------------------------
    // Create a new document in collections
    // -------------------------
    static create(data, options = {}) {
        if (Array.isArray(data)) return this.createMany(data, options);
        return (
            Promise.resolve()
                // On filtre les données
                .then(() => this.filterFields(data, options.authorizedFields))
                // On nettoie les données
                .then(filteredData => this.cleanModelData(filteredData))
                // Création du document
                .then(checkedData => this.getModel().create(checkedData))
        )
    }

    // -------------------------
    // Create a lot of new documents in collections
    // -------------------------
    static createMany(list, options = {}) {
        return (
            Promise.resolve()
                // On filtre les données
                .then(() =>
                    list.map(m => this.filterFields(m, options.authorizedFields))
                )
                // On nettoie les données
                .then(filteredList => filteredList.map(this.cleanModelData.bind(this)))
                // Création du document
                .then(checkedList => this.getModel().insertMany(checkedList))
        );
    }
    // -------------------------
    // Clean data pass in param by removing
    // example: {key: xxx, value: null}
    // -------------------------
    static cleanModelData(data) {
        const result = {};
        const emptyValues = ['', null, 'null', undefined];
        Object.keys(data).forEach(key => {
            // On exclue les valeurs vides
            if (emptyValues.includes(data[key])) return;
            // On sauvegarde les données dans l'objet
            result[key] = data[key];
        });

        return result;
    }
    // -------------------------
    // Use a filter that as been declare in the object with authorizedFields
    // and only save data that's in it
    // -------------------------
    static filterFields(data, fields) {
        if (!fields) return data;
        // On construit un nouvel objet qui ne
        // va contenir que les données finale
        let filteredFields = {};
        // On parcours les champs autorisés
        fields.forEach(key => {
            if (data[key] !== undefined) filteredFields[key] = data[key];
        });
        return filteredFields;
    }
    // -------------------------
    // Return the model from mongoose with a string that's as been load in memory of mongoose
    // -------------------------
    static getModel() {
        return mongoose.model(this.prototype.modelName);
    }
}

// Nom du model associé au service
Core.prototype.modelName = 'Default';
module.exports = Core;
