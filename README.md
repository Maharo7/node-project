# Node-Project
Node project est une application qui met en disposition des API chargé d'exposer les informations sur la qualité de l'air d'une ville la plus proche à des coordonnées GPS

## Installation
utiliser npm pour l'installation

```bash
npm install
```
Si vous utiliser docker, pull l'image dans dockerhub et le lancer dans docker
```bash
docker pull maharo7/node-app:myfirstimagepush
```

## Utilisation
Si vous avez telecharger le code sur github :
pour lancer l'application :
```bash
npm start
```
pour lancer le premier test :
```bash
npm test1
```
pour lancer le deuxieme test :
```bash
npm test2
```
Utiliser postman ou un logiciel similaure pour envoyer les requettes

### Liste des requettes

```javascript

# Recupérer la qualité de lair avec les coordonnées longitude et lattitute (lon lat)
GET http://localhost:8081/findAirQuality?lat=<coordonnéesLat>&lon=<coordonnéesLon

# Demarrer le cron
GET http://localhost:8081/startCron
# Si on n'envoie pas des parametres dans le cron, il se lancera toute les minutes/ si non on peut lui donner des parametres tel que :
    {
        "minute": "",
        "hour" :"",
        "dayOfMonth" :"",
        "month" : "",
        "dayOfWeek": ""
    }
GET http://localhost:8081/startCron?minute=<minutes>&hour=<hour>&dayOfWeek=<dayOfWeek>

# récupérer de la date avec la plus haute pollution à Paris
GET http://localhost:8081/mostPollutedDatetime

# récupérer la liste des pollutions dans la base
GET http://localhost:8081/findAllPollutionDb

```