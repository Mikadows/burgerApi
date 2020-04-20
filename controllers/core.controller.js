const mongoose = require('mongoose')
class Core {
    // -------------------------
    // Prend les paramètres de recherche et les traite
    // pour qu'ils soient compréhensibles pour mongoDB
    // -------------------------
    static paramize(params) {
        return params
    }
    // -------------------------
    // Vérifie les données passées en paramètre pour
    // contrôler qu'elles correspondent bien au model du service
    // -------------------------
    static checkData(data) {
        return data
    }
    // -------------------------
    // Prend une liste de models en paramètre et
    // applique si nécessaire les populate ou autre
    // opération de cosmétiques sur les données
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
        // On récupère la limite si il y en a une
        let limit = options.limit || 300
        if (!options.force && limit > 300) limit = 300;
        return (
            Promise.resolve()
                .then(() => this.cleanModelData(search))
                // On construit l'objet de recherche
                .then(s => this.paramize(s))
                .then(s =>
                    this.getModel()
                        .find(s)
                        // On limite toujours le nombre de résultats
                        .limit(limit)
                        .sort(options.order || '-created_at')
                        .exec()
                )
        )
    }
    // -------------------------
    // Retourne le render d'un document
    // Note : "id" peut être un ID ou un
    // objet de recherche
    // -------------------------
    static read(id, options = {}) {
        return Promise.resolve()
            .then(() =>
                typeof id === 'object'
                    ? this.getModel()
                        .findOne(id)
                        .exec()
                    : this.getModel()
                        .findById(id)
                        .exec()
            )
            .then(model => {
                if (!model) {
                    throw new Error(`Unknow item ${id}`)
                }
                return this.render(model, options)
            })
    }
    // -------------------------
    // Supprime un ou des documents
    // -------------------------
    static remove(id) {
        return Promise.resolve().then(() =>
            typeof id === 'object'
                ? // On lance la suppression des documents
                this.getModel()
                    // On recherche la liste à supprimer
                    .find(id, '_id')
                    .then(list =>
                        Promise.all([
                            // On récupère les ID des documents
                            list.map(l => l.get('id')),
                            // On supprime avec la recherche
                            this.getModel().deleteMany(id),
                        ])
                    )
                    // On retourne la liste des ID supprimés
                    .then(([ids]) => ids)
                : // On supprime le document
                this.getModel()
                    .findOneAndDelete({ _id: id })
                    .exec()
                    .then(() => id)
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
                .then(([cleanedData, model]) =>
                    Promise.all([model, this.checkData(cleanedData)])
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
                // On vérifie les données
                .then(cleanedData => this.checkData(cleanedData))
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
                // On vérifie les données
                .then(cleanedList => cleanedList.map(this.checkData.bind(this)))
                // Création du document
                .then(checkedList => this.getModel().insertMany(checkedList))
        )
    }
    // -------------------------
    // Nettoie les données passées en paramètre
    // -------------------------
    static cleanModelData(data) {
        const result = {}
        const emptyValues = ['', null, 'null', undefined]
        const castValues = [
            // Si on trouve un texte "true" ou
            // "false", on le cast en Boolean
            [/true|false/i, value => value === 'true'],
        ]
        Object.keys(data).forEach(key => {
            // On exclue les valeurs vides
            if (emptyValues.includes(data[key])) return
            // On gère les chaines de caractères dans la recherche
            if (typeof data[key] === 'string') {
                // On transforme les données qui en ont besoin
                castValues.find(regs => {
                    // On récupère le cast
                    const cast = regs.pop()
                    // On parcours chaque regex pour voir si il y en a une qui match
                    const reg = regs.find(r => r.test(data[key]))
                    if (reg) {
                        // On a trouvé une correspondance, on cast
                        data[key] = cast(data[key].trim())
                        // On s'arrête là
                        return true
                    }
                    return false
                })
            }
            // On sauvegarde les données dans l'objet
            result[key] = data[key]
        });
        
        return result
    }
    // -------------------------
    // Filtre un objet de données pour
    // ne garder que les champs listés
    // -------------------------
    static filterFields(data, fields) {
        if (!fields) return data
        const isRemoveMode = fields.find(f => f.startsWith('-'))
        // On construit un nouvel objet qui ne
        // va contenir que les données finale
        let filteredFields = {}
        if (isRemoveMode) {
            filteredFields = data
            fields = fields.map(f => f.replace(/^\-/i, ''))
        }
        // On parcours les champs autorisés
        fields.forEach(key => {
            if (isRemoveMode) delete filteredFields[key]
            else if (data[key] !== undefined) filteredFields[key] = data[key]
        })
        return filteredFields
    }
    // -------------------------
    // Transforme une chaine de caractères
    // comportant des séparateurs en tableau
    // -------------------------
    static splitString(value, sep, cast = String) {
        if (typeof value === 'number') return [value]
        if (value.indexOf(sep) >= 0) {
            // Il y a plusieurs valeurs, on les transforme en tableau
            return value.split(sep).map(val => cast(val.trim()))
        }
        return [value]
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