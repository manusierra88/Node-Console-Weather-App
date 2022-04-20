const fs = require('fs');

const axios = require('axios');

class Busquedas {

    historial = [];
    pathDB = './db/database.json';

    constructor() {
        //leer DB si existe
        this.leerDB();
    }

    // creamos un get para que pase simepre la misma info de los parametros de busqueda en la peticion get

    get paramMapBox() {
        return {

            'access_token': process.env.MAPBOX_KEY, //el token lo delcaramos como una variable de entorno usando dotenv
            'limit': 5,
            'languaje': 'es'

        }

    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            lang: 'es',
            units: 'metric',
        }
    }

    async ciudad(lugar = '') {

        //hacer peticion http para obtener la info

        try {

            //creamos una instancia de axios para que haga la peticion get 

            const instancia = axios.create({
                baseURL: `https://api.mapbox.com/`,
                params: this.paramMapBox
            });


            const resp = await instancia.get(`geocoding/v5/mapbox.places/${lugar}.json`);
            // console.log(resp.data.features);//retorno un arreglo con las opciones posibles en base al input del lugar escrito por el usuario

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lon: lugar.center[0],
                lat: lugar.center[1],
            }))
        } catch (error) {

            return [];

        }

    }

    async climaLugar(lat, lon) {
        try {
            const instanciaClima = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: { ...this.paramsWeather, lat, lon }
            });

            const respClima = await instanciaClima.get()

            const { weather, main, wind } = respClima.data;


            return {

                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                wind: wind.speed,
                rfga: wind.gust

            }

        } catch (error) {
            return (error);
        }
    }



    guardarDB() {
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.pathDB, JSON.stringify(payload));

    }

    grabarHistorial(lugar = '') {
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase());

        //usamos unshift y no push porque queremos que lo agregue al comienzo
        this.guardarDB();
    }


    leerDB(){
        if(!fs.existsSync(this.pathDB)){
            return;
        }

        const info = fs.readFileSync(this.pathDB, {encoding : 'utf-8'});

        const data = JSON.parse(info);

        this.historial = data.historial;
        
        
    }


}


module.exports = Busquedas;