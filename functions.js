var fs = require('fs')
var request = require('request')


function vueapp(_data) {


    function terminal(server) {
        shell('gnome-terminal -e "ping ' + server.url + '"')
    }

    function nautilus(server) {
        shell('nautilus ')
    }

    /*
     window.addEventListener('click', function(e) {
     shell('gnome-terminal -e "ping google.de" ')
     })*/
}

function downloadServers() {
    var pp = fs.createWriteStream('server.json').on('close', function() {
        vueapp(JSON.parse(fs.readFileSync('server.json', 'utf8')))
    })
    request('http://localhost/server.json').pipe(pp)
}
