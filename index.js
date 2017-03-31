var shell = require('shelljs').exec
var fs = require('fs')

//var data = JSON.parse(fs.readFileSync('server.json', 'utf8'))



window.vm = new Vue({
    el: '#app',
    data: {
        searchServer: '',
        servers: [],
        config: false,
        errormsg: '',
        successmsg: '',
        settings: {
            keyfile: '',
            listurl: 'http://localhost/server.json'
        }
    },
    methods: {
        load: function (type, server) {
            if (!fs.existsSync(this.$get('settings').keyfile)) {
                this.$set('errormsg', 'Key nicht gefunden.')
                this.$set('config', true)
                return false
            }

            switch (type) {
                case 'nautilus':
                    shell('ssh-add ' + this.$get('settings').keyfile + ' ; nautilus '+ server.type +'://'+server.user+'@'+server.url+':'+server.port, {async:true})
                    break;
                case 'shell':
                    // shell('gnome-terminal -e "ping '+ server.url + '"')
                    shell('gnome-terminal -e "ssh -i '+ this.$get('settings').keyfile + ' -p ' + server.port +  ' ' + server.user + '@' + server.url + '" 2>&1', {async:true})
                    break;
            }

        },
        toggleConfig: function (e) {
            e.preventDefault()
            this.$set('config', !this.$get('config'))
        },
        saveConfig: function(e) {
            var self = this
            //if (fs.existsSync(this.$get('settings').keyfile)) {

                if (document.getElementById('keyfile').files[0]) {
                    var path = document.getElementById('keyfile').files[0].path
                    this.$set('settings.keyfile', path)
                }

                fs.writeFile('settings.rl', JSON.stringify(this.$get('settings')), 'utf8',  function(err) {
                    self.$set('successmsg','Konfigurationen wurden gespeichert.')
                    self.$set('config', false)
                })

            //}
        },
        updateServerList: function() {
            var self = this
            if (!self.$get('settings').listurl.length) {
                alert('Bitte tragen Sie die Repository-URL für die Servers ein.')
                return false
            }
            request(self.$get('settings').listurl).pipe(fs.createWriteStream('server.json').on('close', function() {
                self.$set('servers', JSON.parse(fs.readFileSync('server.json', 'utf8')))
            }))
        },
        dismiss : function (msg) {
            this.$set(msg, '')
        }
    },
    ready: function () {
        var self = this

        if (!fs.existsSync('server.json')) {
            self.updateServerList()
        } else {
            self.$set('servers', JSON.parse(fs.readFileSync('server.json', 'utf8')))
        }

        if (fs.existsSync('settings.rl')) {
            var file = JSON.parse(fs.readFileSync('settings.rl', 'utf8'))
            self.$set('settings', file)
        }
    }
})