class Objects {
    dibuja(){}
    actualiza(){};
}

class Background extends Objects{
    constructor(){
        super();
        this.sprites = 'background.jpg';
        this.indexSprite = 0;
        this.imagen = new Image();
        this.imagen.src = this.sprites;
        this.inc = 0;
        this.x = 0;
        this.y = 0;
    }
    dibuja(context){
        context.drawImage(this.imagen,0 ,0, 
            this.imagen.width, 
            this.imagen.height, 
            this.x, this.y, 
            300, 
            500);
    }
}

class Nave extends Objects{
    constructor(){
        super();
        this.sprites = 'nave.png';
        this.indexSprite = 0;
        this.imagen = new Image();
        this.imagen.src = this.sprites;
        this.inc = 0;
        this.x = 100;
        this.y = 400;
        this.w = 50;
        this.vida = 3;
    }

    dibuja(context){
        context.drawImage(this.imagen,0 ,0, 
            this.imagen.width, 
            this.imagen.height, 
            this.x, this.y, 
            50, 
            50);
    }
}

class Invader extends Objects{
    constructor(type){
        super();
        this.sprites = 'invaders.png';
        this.indexSprite = 0;
        this.imagen = new Image();
        this.imagen.src = this.sprites;
        this.inc = 1;
        this.y = -67;
        this.frames = 2;
        this.wf = 20;
        this.hf = 20;
        this.vida = 1;
        switch(type){
            case 1: this.off = 0; this.h = 64; this.w = 64; break;
            case 2: this.off = 67; this.h = 64; this.w = 88; break;
            case 3: this.off = 135; this.h = 64; this.w = 96; break;
            case 4: this.off = 202; this.h = 66; this.w = 192; this.frames = 1;
                    this.hf = 40; this.wf = 80; this.vida = 3;
                    break;
        }
        this.x = Math.floor((Math.random(1) * (300-this.wf)) + 0);
    }

    actualiza(fps,FPS){
        if((fps)%(FPS/this.frames) == 0)
            this.indexSprite+=this.inc;        
        if(this.indexSprite >= this.frames )
            this.indexSprite = 0;
        this.y = this.y+2;            
    }

    dibuja(context){
        context.fillStyle = "red";
        context.font = "20px Arial ";
        context.fillText("v:"+this.vida,this.x-2,this.y);
        context.drawImage(this.imagen,this.w*this.indexSprite,this.off,this.w,this.h, this.x, this.y, this.wf,this.hf);
    }
}

class Bala extends Objects{
    constructor(x, y, direccion){
        super();
        this.inc = direccion;
        this.x = x;
        this.y = y;
        this.frames = 1;
        this.wf = 5;
        this.hf = 15;
        this.vida = 1;        
    }

    actualiza(fps,FPS){
        if((fps)%(FPS/this.frames) == 0)
            this.indexSprite+=this.inc;        
        if(this.indexSprite >= this.frames )
            this.indexSprite = 0;
        this.y = this.y+this.inc;            
    }

    dibuja(context){
        context.fillStyle = "#71ECEC";
        context.fillRect(this.x, this.y, this.wf, this.hf);
    }
}

class Coin extends Objects{
    constructor(){
        super();
        this.sprites = 'coinsprite.png';
        this.indexSprite = 0;
        this.coinImage = new Image();
        this.coinImage.src = this.sprites;
        this.inc = 1;
        this.x = Math.floor((Math.random() * 200) + 50);
        this.y = -50;
        this.wf = 15;
        this.hf = 15;
    }

    actualiza(fps, FPS){
        if((fps)%(FPS/10) == 0)
            this.indexSprite+=this.inc;        
        if(this.indexSprite > 9 )
            this.indexSprite = 0;
        if(this.y > 500){
            this.y = -50;
            this.x = Math.floor((Math.random() * 200) + 50);
        }else{
            this.y = this.y+2;
        }            
    }

    dibuja(context){
        context.drawImage(this.coinImage,44*this.indexSprite,0,44,44, this.x, this.y, this.wf,this.hf);
    }
}

class Sound{
    constructor(src){
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
    }
    play (){
      this.sound.play();
    }
    stop(){
      this.sound.pause();
    }
  }


document.addEventListener('keydown',function(evento){
    var map = {};
    switch(evento.keyCode){
        case 37: nave.x -= 5; console.log("LEFT"); break;
        case 39: nave.x += 5; console.log("RIGTH"); break;
        case 32: 
            if(muerto){
                inicializa();
                muerto = false;
            }else{
                var bala = new Bala(nave.x+22,nave.y,-1); aobjects.push(bala);
            }
            break;
    }
});


var canvas, context;
var puntuacion = 0;
var muerto = false;
var FPS = 60;
var fps = 0;
//var moneda = new Coin();
var nave;
var aobjects;
var back = new Background();

function inicializa(){
    canvas = document.getElementById('canvas');
    context= canvas.getContext('2d');
    myMusic = new Sound("Sci-fi Pulse Loop.wav");
    myMusic.play();
    nave = new Nave();
    aobjects = [];
    puntuacion = 0;
    fps = 0;
}

function creainvaders(tc){
    if(fps%(tc*FPS) == 0){
        var rand = Math.floor((Math.random(1) * 4) + 1);
        var invader = new Invader(rand);
        aobjects.push(invader);
    }
}

function coliciones(){
    for( i = aobjects.length-1; i >= 0; i-- ){
        var obj = aobjects[i];
        if((obj.y >= nave.y && obj.y <= (nave.y+nave.w)) //Pasamos la nave
            && 
           (obj.x <= (nave.x+nave.w) && (obj.x+obj.wf) >= nave.x)
           ){                 
                if(aobjects[i] instanceof Invader) {
                    nave.vida -= 1;
                }else if (aobjects[i] instanceof Coin){
                    puntuacion += 10;
                }
                var del = aobjects.splice(i,1);
                delete del;
        }
        var balcolisiono = false;
        if(obj instanceof Bala){
            for( j = aobjects.length-1; j >= 0; j-- ){
                if((aobjects[j] instanceof Invader)
                    && 
                  (obj.y >= aobjects[j].y && obj.y <= (aobjects[j].y+aobjects[j].wf)) //Pasamos la nave
                    && 
                  (obj.x <= (aobjects[j].x+aobjects[j].wf) && (obj.x+obj.wf) >= aobjects[j].x)
                ){
                    aobjects[j].vida -= 1;    
                    puntuacion +=1;  
                    balcolisiono = true;              
                }
            }
        }
        if(balcolisiono){
            var del = aobjects.splice(i,1);
            delete del;
        }
    }
}

function dibujaGui(){
    context.fillStyle = "red";
    context.font = "20px Arial ";
    context.fillText("Vida : "+nave.vida, 5, 20);
    context.fillText("Puntuación : "+puntuacion, 150, 20);
}

function borraCanvas(){
    canvas.width=300;
    canvas.height=500;
}

setInterval(function(){
    fps += 1;
    if(muerto == false)
        principal(); 
    else{
        myMusic.stop();
        context.fillStyle = "red";
        context.font = "30px Arial ";
        context.fillText("Fin del Juego", 0, canvas.height/2);
        context.fillText("presiona espacio para continuar", 0, (canvas.height/2)+40);
        context.fillText("para continuar", 0, (canvas.height/2)+80);
    }
},1000/FPS);

function principal(){
    borraCanvas();
    //LOGICA
    creainvaders(1);    

    aobjects.forEach(obj => {
        obj.actualiza(fps,FPS);
    });    
   
    coliciones();

    //Eliminar Invasores fuera de rango
    for( i = aobjects.length-1; i >= 0; i-- ){
        if(aobjects[i] instanceof Invader){
            if(aobjects[i].y > 500 || aobjects[i].vida <= 0){
                if(aobjects[i].vida <=0 && Math.random()>0.9){
                    var coin = new Coin();
                    aobjects.push(coin);   
                }
                var del = aobjects.splice(i,1);
                delete del;   
            }
        }else if(aobjects[i] instanceof Bala){
            if(aobjects[i].y < 0){
                var del = aobjects.splice(i,1);
                delete del;
            }
        }
    }

    if(nave.vida <= 0){
        nave.vida = 0;
        muerto = true;
    }

    //DIBUJAR TODO
    back.dibuja(context,fps);
    aobjects.forEach(obj => {
        obj.dibuja(context);
    });
    nave.dibuja(context);
    
    dibujaGui();
}