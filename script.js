/* jshint esversion: 8 */
'use strict';

const baseURL = "https://bailla01.pythonanywhere.com/api/v1/"

async function sendRequest(specification) {
    return fetch(`${baseURL}${specification}`)
    // .then(response => console.log(response))
    .then(response => response.json())
    .then(data => printData(data.result))
    .catch(error => console.log(error))
}

async function getData(type) {
    if (type=='password') {
        let formObject = document.getElementById('Passwords')
        let formdata = new FormData(formObject);
        let char_pool =  formdata.get('char-pool')
        console.log(char_pool);
        let password_length = formdata.get('password-length');
        let num_passwords = 1;
        if (formdata.has('num-passwords')) {
            num_passwords = formdata.get('num-passwords');
        }
        var specification = `${char_pool}/${password_length}/${num_passwords}`;
        if (formdata.has('exclude')) {
            specification += `?exclude=${formdata.get('exclude')}`;
        }
    }
    else {
        let formdata = new FormData(document.getElementById('Passphrases'));
        let char_pool = "words";
        let password_length = formdata.get('passphrase-length');
        let num_passwords = formdata.get('num-passphrases');
        var specification = `${char_pool}/${password_length}/${num_passwords}`;
        if (formdata.has('separator')) {
            specification += `?separator=${formdata.get('separator')}`;
        }
    } 
    return sendRequest(specification);
}

function printData(data) {
    // hide forms
    document.getElementById("forms").hidden = true;

    // show results
    let table = document.getElementById("resultsBody");
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        cell1.innerHTML = data[i][0];
        row.appendChild(cell1);
        let cell2 = document.createElement("td");

        // determine password strength
        let entropy = parseInt(data[i][1]);
        let strength = "";
        let bootstrapColor = "";
        if (entropy >= 100){
            strength = "Very Strong";
            bootstrapColor = "text-success";
        } else if (entropy >= 80){
            strength = "Strong";
            bootstrapColor = "text-primary";
        } else if (entropy >= 60){
            strength = "Weak";
            bootstrapColor = "text-info";
        } else if (entropy >= 40){
            strength = "Very Weak";
            bootstrapColor = "text-warning";
        } else {
            strength = "Avoid";
            bootstrapColor = "text-danger";
        }

        cell2.innerHTML = strength;
        cell2.setAttribute("class", bootstrapColor);
        row.appendChild(cell2);
        table.appendChild(row);
        document.getElementById("results").hidden = false;
      }
}

function goBack() {
    document.getElementById("results").hidden = true;
    let table = document.getElementById("resultsBody");
    table.innerHTML=''
    document.getElementById("forms").hidden = false;
}
