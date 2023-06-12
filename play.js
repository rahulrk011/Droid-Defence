const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth*0.5;
canvas.height=window.innerHeight*0.8;
var bullets=[];
var keys={};
var bullet_speed=25;
var enemy_speed=0.5;
var enemies=[];
var ltime=0
var ctime=0;
var xx=[];
var mouseX,mouseY;
var yy=[];
var gameStatus=0;
var blasts=[];
var entime=0;
var lentime=0;
var angle;
var lentime=0;
var score=0;
var width_player=120;
var width_home=120;
var playerHit=new Audio('player_hit.mp3');
var playerimp=new Audio('player_impact.mp3')
var bullethit=new Audio('bullethit.mp3');
var enemyhit=new Audio('enemyhit.mp3');
var bullet_sound=new Audio('bullet.mp3');
var bg=new Audio('bgm.mp3');
var gameover=new Audio('gameover.mp3');
gameover.volume=1;
var time=0;

document.querySelector('.pa').addEventListener('click',()=>{
    window.location.reload();
})
let start=document.querySelector('.start');
start.classList.add('activ')
document.querySelector('.play').addEventListener('click',()=>{
    gameStatus=1;
    start.classList.remove('activ');
    bg.play();
})
var exit=0;
var hiscore;
if(!(localStorage.getItem('Hiscore'))){
    localStorage.setItem('Hiscore',0)
}
hiscore=localStorage.getItem('Hiscore');

setInterval(()=>{
    if(gameStatus==1){
        time++;
        if(time%60==0){
            score+=30
        }
        else if(time%30==0){
            score+=10;
        }
    }
},1000)
setInterval(()=>{
    if(bulletactiv==1){
        
        let b = new bullet(player.x, player.y,angle);
        b.create();
        bullet_sound.play();
        bullets.push(b);
    }
},300)

setInterval(()=>{
    if(gameStatus==1)
        ctime++;
},300)

setInterval(()=>{
    if(gameStatus==1){
        entime++;
        enemy_speed+=0.02
    }
   },1500)

   document.addEventListener('mousemove',(e)=>{
    angle=calAngle(e.clientX,e.clientY,player.x+380,player.y+80)*Math.PI/180;
})


const pl=document.querySelector('#player');
const hm=document.querySelector('#home');   
const bu=document.querySelector('#bullet');
const en=document.querySelector('#enemy');
const blast=document.querySelector('#blast')

const player={
    w:50,
    h:60,
    x:canvas.width/2,
    y:canvas.height-80,
    size:20,
    speed:12,
    dx:0,
    dy:0
}

const home={
    x:130,
    y:canvas.height/2 -100,
    w:500,
    h:300,
}

class Blast {
    constructor(x, y, duration) {
      this.x = x;
      this.y = y;
      this.duration = duration;
      this.startTime = Date.now();
    }
    
    create() {
      ctx.drawImage(blast, this.x, this.y, 50, 50);
    }
  }

class Enemy{
    constructor(x,y){
        this.x=x;
        this.y=y;
    }
    create(){
        ctx.drawImage(en,this.x,this.y,30,40)
    }
    update(){
        this.y+=enemy_speed
    }
    check(i){
        if(this.y>canvas.height){
            enemies.splice(i,1);
            score-=2;
        }
    }
    //r is basically a bullet
    hit(r,i){
        if(!enemies.length==0){
        if(r.x>this.x-20 && r.x<this.x+30 && r.y>this.y-20 && r.y<this.y+20){
            bullethit.play();
            enemies.splice(i,1);
            let k=bullets.indexOf(r);
            bullets.splice(k,1);
            let blast = new Blast(this.x, this.y, 500);  
            blasts.push(blast);
            score++;
            
        }
    }else{
        return;
    }
    
    }

    hitHome(i){
        if(!(enemies.length==0)){
            if(this.x+20>300 && this.x+20<472 && this.y+50<430 && this.y-20 > 265){
                enemyhit.play();
                playerHit.play();
                enemies.splice(i,1);
                let blast = new Blast(this.x, this.y, 500);  
                blasts.push(blast);
                width_home-=10
                if(width_home<=0){
                    // make a popup appear that game over then a play again button
                    if(score>hiscore){
                        hiscore=score;
                        localStorage.setItem('Hiscore',hiscore);
                    }
                    gameover.play();
                    exit=1;
                }
            }
        }else{
            return false;
        }
    }

    hitPlayer(i){
        if(this.x+20>player.x-player.w+20 && this.x+20<player.x+player.w && this.y+50<player.y+player.h && this.y-20 > player.y-player.h){
            playerimp.play();
            playerHit.play();
            enemies.splice(i,1);
            let blast = new Blast(this.x, this.y, 500);  
            blasts.push(blast);
            score+=5;
            width_player-=20
            if(width_player<0){
                // make a popup appear that game over then a play again button
                if(score>hiscore){
                    hiscore=score;
                    localStorage.setItem('Hiscore',hiscore);
                }
                gameover.play();
               exit=1
            }

        }
    }



}





//updating Player position
function updatePos(){
    
    if(keys['d']){

        if(!(player.x+player.w-20 > canvas.width)){
            
            player.x+=player.speed;
        
    }}
    if(keys['a']){
            if(!(player.x-25 <0)){
                
                player.x-=player.speed;
            }
}

if(keys[' ']){
    bulletactiv=1; 
}else{
    bulletactiv=0;
}


}
// createEnemies();

function update(){
    if(gameStatus==0){
        ctx.fillStyle='white';
        ctx.font='50px serif'
        ctx.fillText('Press ENTER to start',canvas.width/2-200,canvas.height/2)
    }
    else if(gameStatus==1){
    Checkexit()
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.font='15px serif';
    ctx.fillStyle='white';
    ctx.fillText('press ESCAPE to pause',canvas.width-150,canvas.height-10);

    ctx.font='20px serif';
    ctx.fillStyle='white';
    ctx.fillText(`TIME SURVIVED : ${time}`,10,canvas.height-10);

    ctx.font="30px serif";
    ctx.fillStyle='white'
    ctx.fillText(`Score : ${score}` , canvas.width-150,80);

    ctx.font="30px serif";
    ctx.fillStyle='white'
    ctx.fillText(`High-Score : ${hiscore}` , canvas.width-230,40);
    
    //for health bar 
    ctx.font="20px serif"
    ctx.fillText("Home : ",10,30)
    if(width_home>60){
    ctx.fillStyle='yellowgreen';}else if(width_home>30){
        ctx.fillStyle='yellow';
    }else{
        ctx.fillStyle='red'
    }
    ctx.fillRect(120,20,width_home,10);
    
    ctx.font="20px serif";
    ctx.fillStyle='white';
    ctx.fillText("Your Flight : ",10,60);
    if(!(width_player<=80)){
    ctx.fillStyle='yellowgreen';}else if(width_player>30){
        ctx.fillStyle='yellow';
    }else{
        ctx.fillStyle='red';
    }
    if(!(width_player==0)){
    ctx.fillRect(120,50,width_player,10);}else if(width_player==0){
        ctx.fillRect(120,50,1,10);
        playerHit.play();
    }

    

    rotate(pl,player.x,player.y,angle);
    drawHome();
    updatePos();
    if(entime-lentime>2.75){
        lentime=entime;
    createEnemies();
}
    if(!(bullets==[])){
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].update();
        bullets[i].create();
        bullets[i].check(i);
        
      }
    }
    
    if(!(enemies==[])){
        for(let i=0;i<enemies.length;i++){
            enemies[i].update();
            enemies[i].create();
            enemies[i].check(i);
            if(i<enemies.length){
                enemies[i].hitPlayer(i)}
                console.log(i,enemies.length)
                if(i<enemies.length){
                enemies[i].hitHome(i);
                }
            
            if(!(bullets.length==0)){
            bullets.forEach(b=>{
                
                if(i<enemies.length)
                    enemies[i].hit(b,i);
                
            })}
        }
    }
    updateBlasts(); // Update the blasts' durations
  if (!(blasts == [])) {
    for (let i = 0; i < blasts.length; i++) {
      blasts[i].create(); // Draw the blasts
    }
  }

} 
    requestAnimationFrame(update);
}

update();


document.addEventListener('keyup',e=>{
    if(e.key=='Enter'){
        
        if(gameStatus==0){
            gameStatus=1;
            bg.play();
            
        }
        
    }
})

document.addEventListener('keyup',e=>{
    if(e.key=='Escape'){
        
        if(gameStatus==1){
            gameStatus=0
        bg.pause();}
    }
})



//home 

function drawHome(){
ctx.drawImage(hm,home.x,home.y,home.w,home.h);


}


//For Shooting

// press space for shooting
// creating a function which stores bullet

class bullet{
    constructor(x,y,a){
    this.x=x;
    this.y=y;
this.a=a;}
    create(){
        ctx.drawImage(bu,this.x-5,this.y-15,30,30);
    }
    update(){
        if(this.a>Math.PI/2+0.25 && this.a<Math.PI*1.5-0.25){
            this.y+=bullet_speed;
            this.x-=(bullet_speed*Math.tan(this.a));}
            else if(this.a>=Math.PI/2-0.25 && this.a<=Math.PI/2+0.25){
                this.x+=35
            }else if(this.a>=Math.PI*1.5-0.25 && this.a<=Math.PI*1.5+0.25){
                this.x-=35;
            }
            else{
                this.y-=bullet_speed;
                this.x+=(bullet_speed*Math.tan(this.a));
            }
        
    }
    check(i){
        if(this.y<0){
            bullets.splice(i,1);
        }
    }    
}


document.addEventListener('keydown',function(e){
    if(e.key==' '){
        keys[' ']=true;
    }
    if(e.key=='a'){
        keys['a']=true;
    }
    if(e.key=='d'){
        keys['d']=true;
    }
})
document.addEventListener('keyup',function(e){
    if(e.key==' '){
        keys[' ']=false;
    }
    if(e.key=='a'){
        keys['a']=false;
    }
    if(e.key=='d'){
        keys['d']=false;
    }
    if(e.key=='a'){
        keys['a']=false;
    }
    if(e.key=='d'){
        keys['d']=false;
    }

})

function createEnemies(){
    for(let i=0;i<8;i++){
        let x=generateX()
        let y=Math.floor(Math.random()*50)
        let enem=new Enemy(x,y);
        enem.create();
        enemies.push(enem);
    }
}

function generateX(){
    let x=Math.floor(80+Math.random()*(canvas.width/2 + 180));
    if(x in xx){
        generateX()
    }else{
        return x;
    }
}
function generateY(){
    let y=Math.floor(40+Math.floor(Math.random()*250));
    if(y in yy){
        generateY()
    }else{
        return y;
    }
}

//rotation

function rotate(img,x,y,angle){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.drawImage(img,-(25),-(30),50,60)
    ctx.restore();
}
//for blast duration

function updateBlasts() {
    for (let i = blasts.length - 1; i >= 0; i--) {
      let blast = blasts[i];
      let elapsedTime = Date.now() - blast.startTime;
      if (elapsedTime >= blast.duration) {
        blasts.splice(i, 1);
      }
    }
  }
  function calAngle(x,y,x1,y1){
    let angle=(Math.atan2(y-y1,x-x1)*180/Math.PI)+90;
    return angle;
}
 
function Checkexit(){
    if(exit==1){
        bg.pause();
        gameStatus=0;
        
        let popup=document.querySelector('.gopopup');
        if(hiscore==score){
            document.querySelector('.text').innerHTML=`Good job !! You have created a record !! \nYour score is ${score}`;
        }else{
        document.querySelector('.text').innerHTML=`Your score is ${score}`}
        popup.classList.add('activ');
        
        

    }
}
