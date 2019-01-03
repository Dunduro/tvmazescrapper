var express = require('express'),
    app = express(),
    port = 1337,
    db = require('./modules/db');


const ItemCount = 25;

app.get('/api/shows/:pageId',function (req,res) {
    db.query('SELECT * FROM (SELECT * FROM `tv_show` ORDER BY `tv_show`.`tv_maze_id` LIMIT ' + (req.params.pageId * ItemCount)+','+ItemCount+'  ) AS ts ' +
        'LEFT JOIN `tv_show_cast_member` AS cm ON ts.tv_maze_id = cm.tv_maze_id ' +
        'LEFT JOIN `actor` ON cm.actor_id = actor.actor_id ' +
        "GROUP BY CONCAT(ts.tv_maze_id,'_',actor.actor_id) " +
        'ORDER BY ts.tv_maze_id ASC, actor.birthday DESC',function (err,rows,fields) {
        let shows = {};
        rows.forEach(function(show){
            if(!shows.hasOwnProperty(show.tv_maze_id)){
                shows[show.tv_maze_id] = {id: show.tv_maze_id, name: show.title,cast:[]}
            }
            shows[show.tv_maze_id].cast.push({id:show.actor_id,name:show.name,birthday:show.birthday})
        })
        res.writeHead(200,{'Content-Type': 'application/json'})
        res.end(JSON.stringify(Object.values(shows)))
    })
});

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);

