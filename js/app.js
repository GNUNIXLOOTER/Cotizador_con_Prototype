// Constructor para Seguro
function Seguro(marca, anio, tipo) {
     this.marca = marca;
     this.anio = anio;
     this.tipo = tipo;
}


Seguro.prototype.cotizarSeguro = function() {
     /*
          1 = americano 1.15
          2 = asiatico 1.05
          3 = europeo 1.35
     */

     // Se le coloca un let por que la variable no va a tener valor de momento
     let cantidad;

     // Se le coloca un const por que esta si tiene que tener valor
     const base = 2000;

     switch(this.marca){
          case '1':
               cantidad = base * 1.15;
               break;
          case '2':
               cantidad = base * 1.05;
               break;
          case '3':
               cantidad = base * 1.35;
               break;
     }

     // Leer el año actual y le resta this.anio
     const diferencia = new Date().getFullYear() - this.anio;

     // Cada año de diferencia hay que reducir 3% el valor del seguro
     cantidad -= ((diferencia * 3) * cantidad) / 100;
     /*
          Si el seguro es básico se múltiplica por un 30% mas
          Si el seguro es completo un 50% mas
     */
    if(this.tipo === 'basico') {
         cantidad *= 1.30;
    } else {
         cantidad *= 1.50;
    }

     return cantidad;

}

// Todo lo que se muestra
// La interfaz de usuario no requiere datos, esos datos se llenan de acuerdo a lo que vaya sucediendo en la aplicacion.
// por tal este objeto va estar vacio
function Interfaz() {}


// Mensaje que se imprime en el HTML, en este caso muestra un mensaje de error y mensaje de exito.
Interfaz.prototype.mostrarMensaje = function(mensaje, tipo) {
     const div = document.createElement('div');

     //validamos si el mensaje es error o correcto
     if(tipo === 'error') {
          div.classList.add('mensaje','error');
     } else {
          div.classList.add('mensaje','correcto');
     }

     div.classList.add('mt-10');
     div.innerHTML = `${mensaje}`;

      // cuando usamos: insertBefore es Nuevo Nodo y referencia... // Si la referencia no existe se añadira al final
     formulario.insertBefore(div, document.querySelector('#resultado'));

     //setTimeout es para que el mensaje despues de 3 segundos no se muestra mas
     setTimeout( () =>  {
          document.querySelector('.mensaje').remove();
     }, 3000);
} 

// Imprime el resultado de la cotización
Interfaz.prototype.mostrarResultado = function(seguro, total) {

     const resultado = document.querySelector('#resultado');
     let marca;

     switch(seguro.marca) {
          case '1':
               marca = 'Americano';
               break;
          case '2':
               marca = 'Asiatico';
               break;
          case '3':
               marca = 'Europeo';
               break;
     }

     // Crear un div
     const div = document.createElement('div');
     div.classList.add('mt-10');

     // Insertar la informacion, el innerHTML modifica el html y textContent cuando no tiene html
     div.innerHTML = `
          <p class='header'>Tu Resumen: </p>
          <p class="font-bold">Marca: <span class="font-normal"> ${marca} </span> </p>
          <p class="font-bold">Año: <span class="font-normal"> ${seguro.anio} </span> </p>
          <p class="font-bold">Tipo: <span class="font-normal"> ${seguro.tipo} </span> </p>
          <p class="font-bold"> Total: <span class="font-normal"> $ ${total} </span> </p>
     `;


     const spinner = document.querySelector('#cargando');
     spinner.style.display = 'block';

     setTimeout( () =>  {
          spinner.style.display = 'none';
          resultado.appendChild(div);
     }, 3000);
     
}


// Este codigo llena las opciones de los años
Interfaz.prototype.llenarOpciones = function () {
     const max = new Date().getFullYear(),
          min = max - 20;// En este caso muestra 20 años nada mas

     //Este codigo muestra los años del actual al antiguo
     const selectAnios = document.querySelector('#year');
     for(let i = max; i > min; i--) {
          let option = document.createElement('option');
          option.value = i;
          option.innerHTML = i;
          selectAnios.appendChild(option);
     }   
}


// Crear instancia de Interfaz
const interfaz = new Interfaz();

document.addEventListener('DOMContentLoaded', () => {
     interfaz.llenarOpciones(); //Llena el select con los años
});


// DOM Operaciones
const formulario = document.querySelector('#cotizar-seguro');

formulario.addEventListener('submit', e =>  {
     e.preventDefault();

     // leer la marca seleccionada del select y su valor con .value
     const marca = document.querySelector('#marca').value;

     // leer el año seleccionado del <select>
     const year = document.querySelector('#year').value

     // lee el valor del radio button
     // este input[name="tipo"] es un selector de css y en este caso nos interesa el que el usuario le dio al radio check
     // osea :checked
     // de esta forma se lee el input de tipo radio y .value para leer su valor
     const tipo = document.querySelector('input[name="tipo"]:checked').value;

 

     // Revisamos que los campos no esten vacios validando por campo
     if(marca === '' || year === '' || tipo === '') {

          // Interfaz imprimiendo un error
          //aqui se muestra el mensaje de error por que el formulario no esta lleno completamente
          interfaz.mostrarMensaje('Faltan datos, revisar el formulario y prueba de nuevo', 'error');
     } else {

          // Limpiar resultados anteriores
          const resultados = document.querySelector('#resultado div');

          // Si resultados no es igual a null
          if(resultados != null) {
               resultados.remove();
          }

          // Instanciar seguro y mostrar interfaz
          const seguro = new Seguro(marca, year, tipo);

          // Cotizar el seguro
          const cantidad = seguro.cotizarSeguro();

          // Mostrar el resultado
          interfaz.mostrarResultado(seguro, cantidad);
          interfaz.mostrarMensaje('Cotizando...', 'exito');
     }

});
