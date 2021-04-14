let frames = 0;
const hit = new Audio();
hit.src = './effects/fail.wav';
hit.volume = 1;

const csh = new Audio();
csh.src = './effects/crash.wav';
csh.volume = 1;


const sprities = new Image();
sprities.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const background = 
{
    spriteX: 390,
    spriteY: 0,
    width: 275.69,
    height: 198,
    x: 0,
    y: canvas.height - 204,
    desenha()
    {
        contexto.fillStyle = '#49bfe5';
        contexto.fillRect(0,-204, canvas.width, canvas.height)

        contexto.drawImage
        (
            sprities, background.spriteX, background.spriteY,
            background.width, background.height, 
            background.x, background.y, 
            background.width, background.height
        );
    
        contexto.drawImage
        (
            sprities, background.spriteX, background.spriteY,
            background.width, background.height, 
            (background.x + background.width), background.y, 
            background.width, background.height
        );
    }
}

function collision(bolsonaro, floor) 
{
    const bolsonaroY = bolsonaro.y + bolsonaro.height;
    const floorY = floor.y;

    if(bolsonaroY >= floorY)
    {
        return true;
    }

    return false;
}

function criaBolsonaro()
{
    const bolsonaro = 
    { 
        spriteX: 0,
        spriteY: 0,
        width: 36,
        height: 36,
        x: 15,
        y: 50,
        jump_: 4,
        g: 0.25,
        velocity: 0,
        jump()
        {
           bolsonaro.velocity = -bolsonaro.jump_;
        },
        atualiza()
        {
            if(collision(bolsonaro, globais.floor))
            {
                hit.play();
                switchScreen(screen.GAME_OVER);
                return;
            }
            bolsonaro.velocity = bolsonaro.velocity + bolsonaro.g;
            bolsonaro.y = bolsonaro.y + bolsonaro.velocity;
        },
        desenha()
        {
            contexto.drawImage
            (
                sprities, bolsonaro.spriteX, bolsonaro.spriteY, 
                bolsonaro.width, bolsonaro.height, 
                bolsonaro.x ,bolsonaro.y, 
                bolsonaro.width, bolsonaro.height
            );
        },
    };

    return bolsonaro;
}

function criaObj(){
    const obj =
    {
        width: 52,
        height: 400,
        floor:{
            spriteX: 0,
            spriteY: 169,
        },
        sky:{
            spriteX: 52,
            spriteY: 170,
        },
        space: 80,
        desenha()
        {
           
            obj.pares.forEach(function(par){
                const yRandom = par.y;
                const spaceBtw = 90;
    
                const objskyX = par.x;
                const objskyY = 0 + yRandom;
                    //OBJ SKY
                contexto.drawImage
                (
                    sprities,
                    obj.sky.spriteX, obj.sky.spriteY,
                    obj.width, obj.height,
                    objskyX, objskyY,
                    obj.width, obj.height,
                )
                
                //OBJ FLOOR
                const objfloorX = par.x;
                const objfloorY = obj.height + spaceBtw + yRandom;

                contexto.drawImage
                (
                    sprities,
                    obj.floor.spriteX, obj.floor.spriteY,
                    obj.width, obj.height,
                    objfloorX, objfloorY,
                    obj.width, obj.height,
                )

                par.objsky = 
                {
                    x: objskyX,
                    y: obj.height + objskyY
                }

                par.objfloor =
                {
                    x: objfloorX,
                    y: objfloorY
                }

            })

           
        },
        crash(par){
            const head = globais.bolsonaro.y + 4;
            const feet = (globais.bolsonaro.y + globais.bolsonaro.height - 6);

            if((globais.bolsonaro.x + globais.bolsonaro.width - 4) >= par.x){

                if(head <= par.objsky.y){
                    return true;
                }

                if(feet >= par.objfloor.y){
                    return true;
                }

            }
            return false;
        },
        pares: [],
        atualiza()
        {
            const fps = frames % 100 === 0;
            if(fps)
                {
                    obj.pares.push({
                        x: canvas.width,
                        y: -130 * (Math.random() + 1),
                    });
                }
            obj.pares.forEach(function(par)
                {
                    par.x = par.x - 2;
                    
                    if(obj.crash(par)){
                        csh.play();
                        switchScreen(screen.GAME_OVER);                      
                    }

                    if(par.x + obj.width <= 0){
                        obj.pares.shift();
                    }
                });

            }
        }

    return obj;
}

function criaFloor(){
    const floor = 
    {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 90,
        x: 0,
        y: canvas.height - 90,
        atualiza()
        {
            const moveFloor = 1;
            const repete = floor.width/2;
            const move = floor.x - moveFloor;
            
            floor.x = move % repete;
        },
        desenha()
        {
            contexto.drawImage
                (
                    sprities, floor.spriteX, floor.spriteY, 
                    floor.width, floor.height,
                    floor.x, floor.y,
                    floor.width, floor.height
                );
        
            contexto.drawImage
            (
                sprities, floor.spriteX, floor.spriteY, 
                floor.width, floor.height,
                (floor.x+floor.width), floor.y,
                floor.width, floor.height
            );
        }
    }

    return floor;
}

function criaScore(){
    const score =
    {
        points: 0,
        desenha()
        {
            contexto.font = '35px  "VT323"';
            contexto.textAlign = 'right';
            contexto.fillStyle = '#faaa0a';
            contexto.fillText(`SCORE: ${score.points}`, canvas.width - 35, 35);
            
        },
        atualiza()
        {
            const inter = 20;
            const passInter = frames % inter === 0;

            if(passInter){
                score.points = score.points+1;
            }
            
        },
    }

    return score;
}

const getReady = 
{
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha()
    {
        contexto.drawImage
        (
            sprities, getReady.spriteX, getReady.spriteY,
            getReady.width, getReady.height,
            getReady.x, getReady.y,
            getReady.width, getReady.height
        );
    }  
}

const getGameOver = 
{
    spriteX: 134,
    spriteY: 153,
    width: 226,
    height: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha()
    {
        contexto.drawImage
        (
            sprities, getGameOver.spriteX, getGameOver.spriteY,
            getGameOver.width, getGameOver.height,
            getGameOver.x, getGameOver.y,
            getGameOver.width, getGameOver.height
        );
    }  
}

const globais = {};
let screenON = {};
function switchScreen(newScreen)
{
    screenON = newScreen;

    if(screenON.inicializa)
    {
        screenON.inicializa();
    }
}

const screen = 
{
    START:
    {
        inicializa()
        {
            globais.bolsonaro = criaBolsonaro();
            globais.floor = criaFloor();
           
        },
        desenha()
        {
            background.desenha();
            globais.floor.desenha();
            globais.bolsonaro.desenha();
            getReady.desenha();
           
        },
        click()
        {
            switchScreen(screen.GAME);
        },
        atualiza()
        {
            globais.floor.atualiza();
            
        }
    }
}

screen.GAME =
{
    inicializa()
    {
        globais.obj = criaObj();
        globais.score = criaScore();
    },
    desenha()
    {
        background.desenha();
        globais.obj.desenha();
        globais.floor.desenha();
        globais.bolsonaro.desenha();
        globais.score.desenha();
        
    },
    click()
    {
        globais.bolsonaro.jump();
    },
    atualiza()
    {
        globais.bolsonaro.atualiza();
        globais.obj.atualiza();
        globais.floor.atualiza();
        globais.score.atualiza();
    }
}

screen.GAME_OVER =
{

    desenha()
    {
        getGameOver.desenha();
    },
    atualiza()
    {

    },
    click()
    {
        switchScreen(screen.START);
    }
}
function loop()
{
    screenON.desenha();
    screenON.atualiza();
    requestAnimationFrame(loop);
    frames = frames +1;
    
}

window.addEventListener('keydown', function(event)
{
    var key = event.which || event.keyCode;
    if(key === 32){
        if(screenON.click )
        {
            screenON.click();
        }
    }
   
})

window.addEventListener('click', function()
{
    if(screenON.click)
    {
        screenON.click();
    }
})


switchScreen(screen.START);
loop();
