import { db } from "../lib/db";
const sendData = async (URL, DATA) => {
    fetch(URL, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(DATA)
    }).then(response => response.json())
        .then(data => console.log(data))
        .catch(error => {
            console.log("No se pudo guardar los datos en la API");
            console.log("Intentando guardar en IndexDB");
            db.profiles.add(DATA).then(console.log("Se guardo en IndexDB")) //Si falla se envia hacia indexDB
        })
}

export default sendData;