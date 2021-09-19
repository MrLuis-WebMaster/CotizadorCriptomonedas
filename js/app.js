const SelectCriptomonedas = document.querySelector("#criptomonedas");
const formulario = document.querySelector("#formulario");
const SelectMoneda = document.querySelector("#moneda");

const resultado = document.querySelector("#resultado");

const ObjDatos = {
    moneda:"",
    criptomoneda:""
}


const ObtenerCriptomonedas = Criptomonedas => new Promise (resolve => {
        resolve (Criptomonedas);
    }
)

document.addEventListener("DOMContentLoaded", ()=>{
    ConsultarCriptomonedas();
    formulario.addEventListener("submit",ValidarFormulario);
    SelectCriptomonedas.addEventListener("change",LeerValor);
    SelectMoneda.addEventListener("change",LeerValor);

})

function ConsultarCriptomonedas () {
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
    fetch (url)
        .then ( 
            respuesta => respuesta.json()
        )
        .then ( resultado => ObtenerCriptomonedas(resultado.Data) )
        .then (
            Criptomonedas => CriptomonedasSelect(Criptomonedas)
        )
}

function CriptomonedasSelect (Criptomonedas) {
    Criptomonedas.forEach(cripto => {
        console.log(cripto);
        const {Name,FullName} = cripto.CoinInfo;
        const option = document.createElement("option");
        option.textContent = FullName;
        option.value = Name;
        SelectCriptomonedas.appendChild(option);
    });

}

function LeerValor(e) {
    ObjDatos[e.target.name] = e.target.value; 
}


function ValidarFormulario (e) {
    e.preventDefault();

    const {moneda,criptomoneda} = ObjDatos;

    if ( moneda === "" || criptomoneda === "") {
        MostrarAlerta("Llena todos los campos")
        return;
    }

    //Consultar La API

    ConsultarAPI();

}

function ConsultarAPI () {
    const {moneda,criptomoneda} = ObjDatos;
    url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    MostrarSpinner();

    fetch (url)
        .then (
            resultado => resultado.json()
        )

        .then (
            cotizacion => {
                MostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])
            }
        )
}

function MostrarSpinner() {
    LimpiarHTML();
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    resultado.appendChild(spinner);
}

function MostrarCotizacionHTML (cotizacion) {
    LimpiarHTML();
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;

    const precio = document.createElement("p");
    const precioAlto = document.createElement("p");
    const precioBajo = document.createElement("p");
    const CambiosPrecios = document.createElement("p");
    const ActualizacionPrecios = document.createElement("p");

    precio.innerHTML = `
        El precio es: <span>${PRICE}</span>
    `;
    precioAlto.innerHTML = `
        <p> El precio mas alto es <span>${HIGHDAY}</span></p>
    `;
    precioBajo.innerHTML = `
    <p> El precio mas bajo es  <span>${LOWDAY}</span></p>
    `;
    CambiosPrecios.innerHTML = `
    <p> Variaciones ultimas 24 horas <span>${CHANGEPCT24HOUR} %</span></p>
    `;
    ActualizacionPrecios.innerHTML = `
    <p> Ultima actulizacion <span>${LASTUPDATE}</span></p>
    `;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(CambiosPrecios);
    resultado.appendChild(ActualizacionPrecios);

    

}
function LimpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
function MostrarAlerta (message) {
    const flag = document.querySelector(".error");

    if (!flag) {
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("error");
        divMensaje.textContent = message;
    
        formulario.appendChild(divMensaje);
        setTimeout(() => {
            divMensaje.remove();
        }, 2500);
    }

}