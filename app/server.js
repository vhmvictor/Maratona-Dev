const express = require("express");
const server = express();
const mysql = require("mysql");

//configurar servidor para apresentar arquivos estáticos, como css, javascript
server.use(express.static("public"))

//habilitar body do formulário(em html)
server.use(express.urlencoded({ extended: true }));

//configurar conexão com banco de dados - MySQL
//usa-se pool para manter conexão automática com BD
const connection = mysql.createConnection ({
    host: "localhost",
    user: "root",
    password: "",
    database: "doe"
})

//configurando a template engine - conexão com html
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true //config necessária para apresentar informações dos donors
})

//quando enviamos arquivos html diretamente pelo server, precisamos fazer a configuração de seus arquivos estáticos atravpes de alguma biblioteca (nunjuncks)
server.get("/", function(request, response) {
    const sql = 'SELECT * FROM donors';
    
    connection.query(sql, function(err, results) {
        if (err) return response.send("erro no banco de dados");

        const donors = results;
        return response.render("index.html", { donors });
    });

});

server.post("/", function(request, response){
    const name = request.body.name;
    const email = request.body.email;
    const blood = request.body.blood;

    if(name == "" || email === "" || blood == "" ) {
        return response.send("Todos os campos são obrigatórios")
    }

    //coloco valores dentro do banco de dados
    const post = {name: name, email: email, blood: blood};
    const sql = 'INSERT INTO donors SET ?';
    
    connection.query(sql, post, function(err) {
        if (err) return response.send("erro no banco de dados");
        
        return response.redirect("/");
    });

});

server.listen(3000, () => {
    console.log("Server conectado.");
});