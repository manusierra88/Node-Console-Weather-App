const inquirer = require('inquirer');


require('colors');


const preguntas = [{
    type: 'list',
    name: 'opciones',
    message: '¿Que desea hacer?',
    choices: [
        {
            value: 1,
            name: `${'1'.blue}. Buscar una Ciudad.`
        },
        {
            value: 2,
            name: `${'2'.blue}. Historial de busquedas.`
        },
        {
            value: 0,
            name: `${'0'.blue}. Salir.`
        },
        
    ]
}]

const inquirerMenu = async () => {

    console.clear();
    console.log('=======================================');
    console.log('           Menú de opciones           ');
    console.log('=======================================\n');

    const { opciones } = await inquirer.prompt(preguntas);

    return opciones;
}


const pausa = async () => {
    const input = [{
        type: 'input',
        name: 'inputOpcion',
        message: `\n Oprima ${'ENTER'.green} para continuar`
    }];
    await inquirer.prompt(input);


}


const leerInput = async (message) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,//message no se iguala a nada porque es igual al input que ponga el  usario y en ES6 es redundante igualarlo al mismo nombre
            validate(value) {
                if (value.length === 0) {
                    return 'Porfavor ingrese un valor';
                }
                return true;

            }
        }
    ];

    const { desc } = await inquirer.prompt(question);

    return desc;


}

const listadoCiudades = async (lugares = []) => {
    //la funcon map me permite pasar un array de tareas y convertirlo a lo que yo quiera como otro array
    //paso la tarea y el id como parametros
    const choices = lugares.map((lugar, i) => {

        const idx = `${i + 1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })
    //creo un array de opciones para el menu y paso las choices en dicha propiedad
    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione una Ciudad \n',
            choices,
        }
    ]

    const { id } = await inquirer.prompt(preguntas);
    return id;



}

const confirmar = async (message) => {
    const questions = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }]

    const {ok} = await inquirer.prompt(questions);
    return ok;
}

const listadoParaCompletar = async(tareas = [])=>{

    const choices = tareas.map((tarea, i)=>{
        const idx = `${i +1}`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.description} `,
            checked: (tarea.completadoEn) ? true : false 
        }
    })

    const pregunta = ({
        type: 'checkbox',
        name:'ids',
        message:'Selecciones',
        choices
    })

    const {ids} = await inquirer.prompt(pregunta);
    return ids;
}





module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoCiudades,
    confirmar,
    listadoParaCompletar
}