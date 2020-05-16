const mongoose = require('mongoose')
class Core {
    // -------------------------
    // Prend une liste de models en paramètre et
    // applique si nécessaire les populate ou autre
    // opération de cosmétiques sur les données
    // -------------------------
    static render(list, options = {}) {
        const isAlone = !Array.isArray(list);
        // On s'arrange pour traiter une liste
        if (isAlone) list = [list];
        console.log('avant return')
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
                    console.log(list);
                    console.log('toto');
                    return list
                })
                // On retourne le résultat attendu
                .then(renderedList => (isAlone ? renderedList.pop() : renderedList))
        )
    }
    // -------------------------
    // Lance une recherche sur les documents
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
        )
    }

    // -------------------------
    // Méthode de mise à jour d'un document
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
    // Processus de création d'un nouveau model
    // -------------------------
    static create(data, options = {}) {
        if (Array.isArray(data)) return this.createMany(data, options)
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
    // Processus de création de plusieurs nouveaux models
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
        )
    }
    // -------------------------
    // Nettoie les données passées en paramètre
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

        return result
    }
    // -------------------------
    // Filtre un objet de données pour
    // ne garder que les champs listés
    // -------------------------
    static filterFields(data, fields) {
        if (!fields) return data;
        // On construit un nouvel objet qui ne
        // va contenir que les données finale
        let filteredFields = {};
        // On parcours les champs autorisés
        fields.forEach(key => {
            if (data[key] !== undefined) filteredFields[key] = data[key]
        });
        return filteredFields
    }
    // -------------------------
    // Retourne le model mongoose associé
    // -------------------------
    static getModel() {
        return mongoose.model(this.prototype.modelName)
    }
}

// Nom du model associé au service
Core.prototype.modelName = 'Default';
module.exports = Core;
