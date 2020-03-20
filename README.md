# API
Nous avons choisie de travailler avec une apiRest nodejs pour raison de simplicité et d'apprentissage.
Nous avons également choisie mongoose qui est basé sur mongodb qui est un SGBD NoSQL, nous l'avons choisie pour des raison d'apprentissage et de facilité de conpatibilité avec nodeJs.

## Installation
### recupérer le repertoire api
```
git clone https://github.com/barder60/dockerTrelloApi.git
cd api 
```

## Contribuer
Dans le docker-compose.yml :

preparation du volume qui va enregistrer 
les modifications avant/aprés instanciation du container api :

``` volumes:
      - '.:/app'
      - '/app/node_modules' 
```
On expose les ports de la machine et du container :

```
ports:
      - "9000:9000"
```
On va chercher l'endroit et le nom de l'image a build :
```
build:
      context: .
      dockerfile: Dockerfile
```
On va d'abord démarrer mongo avant la partie api :
```
depends_on: 
      - "mongo"
```

meme principe que api pour mongo ici : 
```
    volumes:
      - ./mongo-volume:/data/db
    ports:
      - "27017:27017"
```


## Déploiement

Puis via docker :
``` docker-compose up --build ```

Aprés l'installation de la BDD et du server :
``` docker container ls ```
Copier coller l'id du container de mongo :
puis écrire :
```docker exec -ti <id du container> bash ```
Ensuite préparer la BDD:
``` 
mongo
use burgerApi 
exit 
exit 
```
