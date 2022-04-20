
require('dotenv').config();
require('colors');

const { leerInput, inquirerMenu, pausa, listadoCiudades } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');


const main = async () => {

    //instancia de la clase busqueda, por fuera del do while asi no se reinicia cada vez que se ejecuta ese bucle
    const busquedas = new Busquedas;
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:


                //muestro mensaje
                const lugarBusqueda = await leerInput('Ciudad: ');
                //hago la busqueda en base al mensaje enviado por el usurario
                const lugares = await busquedas.ciudad(lugarBusqueda);
                //selecciono el lugar 
                const idSeleccionado = await listadoCiudades(lugares);
                if(idSeleccionado == '0') continue;
                const lugarSelect = lugares.find(l => l.id === idSeleccionado);
                //console.log({idSeleccionado});
                busquedas.grabarHistorial(lugarSelect.nombre);

                //info clima

                const lat = lugarSelect.lat;
                const lon = lugarSelect.lon;

                const infoClima = await busquedas.climaLugar(lat, lon);
                // console.log(infoClima);



                console.log('\nInformación de la Ciudad:\n'.green);
                console.log('Ciudad: ', lugarSelect.nombre);
                console.log('Lat: ', lugarSelect.lat);
                console.log('Long: ', lugarSelect.lon);
                console.log('Temperatura: ', infoClima.temp);
                console.log('Temp Mínima: ', infoClima.min);
                console.log('Temp Máxima: ', infoClima.max);
                console.log('Como está el clima: ', infoClima.desc);
                console.log('Velocidad del Viento: ', (infoClima.wind * 3.6), 'km/h');
                if (!infoClima.rfga == NaN) { return console.log('Ráfagas de: ', (infoClima.rfga * 3.6), 'km/h'); }

                break;

            case 2 :
                busquedas.historial.forEach((lugar, i)=>{
                    const idx = `${i +1}`.green;
                    console.log(`\n${idx} ${lugar}\n`);
                })

                

                break    

        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();