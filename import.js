var http = require('http')
var db = require('./modules/db')

db.query("SELECT MAX(tv_maze_id) as max_maze_id FROM tv_show",function(error,rows,fields){
    // console.log(error,rows,fields)
    page = Math.floor(parseInt(rows[0].max_maze_id+1)/250);
    checkShows(page)
})

function checkShows(page){
    var options = {
        host: 'api.tvmaze.com',
        port: 80,
        path: '/shows?page='+page,
        method: 'GET'
    };
    http.request(options, function(res) {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('close',function(){
            let shows = JSON.parse(data)
            if(shows.length>0) {
                shows.forEach(function (show) {
                    addShow(show.id, show.name)
                    checkCast(show.id)
                })
            }
        })
    }).end();
}
function checkCast(showId){
    var options = {
        host: 'api.tvmaze.com',
        port: 80,
        path: '/shows/'+showId+'/cast',
        method: 'GET'
    };
    http.request(options, function(res) {
        res.setEncoding('utf8');
        let data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('close',function(){
            let castMembers = JSON.parse(data)
            if(castMembers.length>0) {
                let actors = {};
                castMembers.forEach(function (castMember) {
                    if(!actors.hasOwnProperty(castMember.person.id)) {
                        let actor = castMember.person;
                        actors[actor.id] = actor;
                        addCast(actor.id,showId,actor.name,actor.birthday)
                    }
                })

            }
        })
    }).end();
}


function addShow(id,name){
    db.query('SELECT * FROM tv_show WHERE tv_maze_id = "'+id+"'",function(error,rows){
        if(!rows||rows.length === 0 ){
            db.query('INSERT INTO tv_show (tv_maze_id,title,created_at) VALUES ("'+id+'","'+name+'",NOW())',function (error,rows) {
                console.log('added show: '+name);
            })
        }
    })
}

function addCast(actorId,showId,name,birthday){
    db.query('SELECT * FROM `tv_show_cast_member` WHERE `tv_maze_id`="'+showId+'" AND actor_id = "'+actorId+'"',function(error,rows) {
        if (!rows || rows.length === 0) {
            db.query('SELECT * FROM actor WHERE actor_id = "' + actorId + '"', function (error, rows) {
                if (!rows || rows.length === 0) {
                    db.query('INSERT INTO `actor`(`actor_id`, `name`, `birthday`) VALUES ("' + actorId + '","' + name + '","' + birthday + '")')
                    console.log('added actor')
                }

                db.query('INSERT INTO `tv_show_cast_member`(`tv_maze_id`, `actor_id`) VALUES ("' + showId + '","' + actorId + '")')
            })
        }
    })
}