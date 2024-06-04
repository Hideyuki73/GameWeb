let _GAMESTATE = {
    placar: {
        pontos: 0,
        highscore: 0,
    },
    player: {
        x: 0,
        lane: 0,
    },
    obstaculo: [],
    count: 3,
    velocity: 7,
    tick: 0,
    max_tick: 120,
    color: "",
    right: [],
    rotation: 0 ,
}

let flag = false;
let pnts = 1;

function makeObstacle(x, lane, speed) {
    _GAMESTATE.obstaculo.push({
        x: x,
        lane: lane,
        speed: speed,
    })
}

function makeRight(x, lane, speed) {
    _GAMESTATE.right.push({
        x: x,
        lane: lane,
        speed: speed,
    })
}

function fazerObstaculo(offset, ctx) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    if (_GAMESTATE.obstaculo.length < _GAMESTATE.count) {
        let nuhuh = false;
        let watToRemove = (parseInt(Math.random() * 4));
        for (let i = 0; i < 5; i++) {
            if (!nuhuh && watToRemove == i) {
                nuhuh = true;
                makeRight(offset + (width / 5) * 3, i, _GAMESTATE.velocity);
                continue
            }
            makeObstacle(offset + (width / 5) * 3, i, _GAMESTATE.velocity);
        }
    }
}

function update(ctx) {
    _GAMESTATE.rotation = (_GAMESTATE.rotation + 1) % 360
    ctx.canvas.style = `background-image: linear-gradient(${_GAMESTATE.rotation}deg, darkblue, black);`
    _GAMESTATE.tick++;

    if (_GAMESTATE.tick % _GAMESTATE.max_tick == 0) {
        fazerObstaculo(0, ctx)

        _GAMESTATE.max_tick -= 5
        if (_GAMESTATE.max_tick < 50) {
            _GAMESTATE.max_tick = 50
        }
    }

    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    for (let i = 0; i < _GAMESTATE.right.length; i++) {
        _GAMESTATE.right[i].x -= _GAMESTATE.right[i].speed;
    }

    for (let i = 0; i < _GAMESTATE.obstaculo.length; i++) {
        _GAMESTATE.obstaculo[i].x -= _GAMESTATE.obstaculo[i].speed;

        if (_GAMESTATE.obstaculo[i].x < -35) {
            _GAMESTATE.obstaculo.splice(i, 1);

            if (_GAMESTATE.velocity < 30) {
                _GAMESTATE.velocity += 0.10;
                pnts += 1;
            }

            _GAMESTATE.placar.pontos += pnts;

            let colors = [
                "green",
                "red",
                "yellow",
                "orange",
                "blue",
            ]

            _GAMESTATE.color = colors[parseInt(Math.random() * colors.length-1)]
        }
        const player = _GAMESTATE.player;
        const obstaculo = _GAMESTATE.obstaculo[i];
        if (obstaculo != undefined && rectRect(player.x, player.lane * 36, 32, 32, obstaculo.x, obstaculo.lane * 36, 32, 32) == true) {
            if (flag == false) {
                _GAMESTATE.velocity = 0;
                
                aviso(_GAMESTATE.placar.pontos);
            }
            flag = true;
        }
    }

}


async function aviso(highscore){
    const { value: text } = await Swal.fire({
        input: "textarea",
        inputLabel: "Nome",
        inputPlaceholder: "Digite seu nome aqui",
        inputAttributes: {
          "aria-label": "Digite seu nome aqui"
        },
    });
    
    let history = localStorage.getItem("highscores")  
    if(history == null){
        history = {}
    }else {
        history = JSON.parse(history);
    }

    history[text.toLowerCase()] = highscore;
    

    localStorage.setItem("highscores", JSON.stringify(history))
    let toDisplay = [];

    var items = Object.keys(history).map(function(key) {
        return [key, history[key]];
      });
      
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
      
    items = items.slice(0,5)

    for(var i = 0; i < items.length; i++){
        toDisplay.push(`${items[i][0]}: ${items[i][1]}`)
    }

    Swal.fire({
        title: "Perdeu",
        html: toDisplay.join("<br>"),
        icon: "error",
        showConfirmButton: true,
        confirmButtonColor: "red",
        width: 300,
        padding: "3em",
        color: "black",
        backdrop: `
        rgba(100,0,0,0.4)
        `,
    }).then((result) => {
        if(result.isConfirmed){
            window.location.reload();
        }
    });
}

function rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    if (r1x + r1w >= r2x &&
        r1x <= r2x + r2w &&
        r1y + r1h >= r2y &&
        r1y <= r2y + r2h) {
        return true;
    }
    return false;
}

document.addEventListener('keydown', function (event) {
    if (event.key == "ArrowDown") {
        down();
    }
    else if (event.key == "ArrowUp") {
        up();
    }
});

function up() {
    if (_GAMESTATE.player.lane != 0) {
        _GAMESTATE.player.lane -= 1;
    }
}

function down() {
    if (_GAMESTATE.player.lane < 4) {
        _GAMESTATE.player.lane += 1;
    }
}
/**
 * 
 * @param {RenderingContext} ctx 
 */
function render(ctx) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height
      
    if(!flag){
        ctx.fillStyle = _GAMESTATE.color;
        ctx.fillRect(_GAMESTATE.player.x, _GAMESTATE.player.lane * 38, 32, 32)
        for (let i = 0; i < _GAMESTATE.obstaculo.length; i++) {
            ctx.fillStyle = "white";
            ctx.fillRect(_GAMESTATE.obstaculo[i].x, _GAMESTATE.obstaculo[i].lane * 38, 32, 32);
        }

        ctx.fillStyle = _GAMESTATE.color;
        for (let i = 0; i < _GAMESTATE.right.length; i++) {
            ctx.fillRect(_GAMESTATE.right[i].x, _GAMESTATE.right[i].lane * 38, 32, 32);
        }

        let history = localStorage.getItem("highscores")  
        if(history == null){
            history = {}
        }else {
            history = JSON.parse(history);
        }
    
        var items = Object.keys(history).map(function(key) {
            return [key, history[key]];
          });
          
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
          
        items = items.slice(0,5)

        ctx.fillStyle = "white";
        ctx.font = "28px arial"
        ctx.fillText(`Highscore: ${items[0][1]}`, 5, 215);
        ctx.font = "36px arial"
        ctx.fillText(_GAMESTATE.placar.pontos, 5, 250);
    }
    
}

window.addEventListener("load", () => {
    let canvas = document.getElementById("canvas");

    let ctx = canvas.getContext("2d");

    _GAMESTATE.placar.highscore = localStorage.getItem("highscore")
    _GAMESTATE.color = "green"
    if(_GAMESTATE.placar.highscore == null){
        _GAMESTATE.placar.highscore = 0
    }

    setInterval(() => {

        update(ctx);

    }, 1000 / 60)

    setInterval(() => {
        canvas.width = window.innerWidth - 30;
        canvas.height = window.innerHeight - 30;
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        render(ctx);
    }, 1000 / 60)
})