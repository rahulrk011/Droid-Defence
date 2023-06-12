const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth*0.9;
canvas.height=window.innerHeight*0.9;
var bullets=[];
var enemy_bul=[];
var powerups=[];
var keys={};
var bullet_speed=25;
var en_speed=10;
var enemy_speed=0.5;
var enemies=[];
var ltime=0
var ctime=0;
var bulletactiv=0;
var xx=[];
var mouseX,mouseY;
var yy=[];
var gameStatus=0;
var blasts=[];
var entime=0;
var lentime=0;
var ptime=0;
var shieldOn=0;
var lptime=0;
var angle=0;
var lentime=0;
var choice;
var powerupOn=0;
var destroy=0;
var en_count=3;
var score=0;
var pwidth=40;
var pheight=40;
var width_player=120;
var width_home=120;
var playerHit=new Audio('player_hit.mp3');
var playerimp=new Audio('player_impact.mp3')
var bullethit=new Audio('bullethit.mp3');
var enemyhit=new Audio('enemyhit.mp3');
var bullet_sound=new Audio('bullet.mp3');
var bg=new Audio('bgm.mp3');
var gameover=new Audio('gameover.mp3');
var time=0;
var exit=0;
var hiscore;
if(!(localStorage.getItem('Hiscore'))){
    localStorage.setItem('Hiscore',0)
}
hiscore=localStorage.getItem('Hiscore');

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

setInterval(()=>{
    if(gameStatus==1){
        time++;
        ptime++;
        if(time%60==0){
            score+=30
        }
        else if(time%30==0){
            score+=10;
        }
        
    }
},1000)
setInterval(()=>{
    if(gameStatus==1)
        ctime++;
},300)

setInterval(()=>{
    if(gameStatus==1){
        entime++;
        enemy_speed+=0.005
        for(let i=0;i<enemies.length;i++){
            let eb=new enemy_bullet(enemies[i].x,enemies[i].y);
            eb.create();
            enemy_bul.push(eb);
        }
    }
   },1500)

setInterval(()=>{
    if(en_count<=12){
    en_count+=1}
},20000)

setInterval(()=>{
    if(bulletactiv==1){
        
        let b = new bullet(player.x, player.y,angle);
        b.create();
        bullet_sound.play();
        bullets.push(b);
    }
},200)



document.addEventListener('mousemove',(e)=>{
    angle=calAngle(e.clientX,e.clientY,player.x+80,player.y)*Math.PI/180;
})

const pl=document.querySelector('#player');
const hm=document.querySelector('#home');   
const bu=document.querySelector('#bullet');
const en=document.querySelector('#enemy');
const blast=document.querySelector('#blast');
const en_bullet=document.querySelector('#en_bullet');
const shield_img=document.querySelector('#shield');
const destroy_img=document.querySelector('#destroy');

const player={
    w:50,
    h:60,
    x:canvas.width/2,
    y:canvas.height-80,
    size:20,
    speed:12,
    speed1:5,
    dx:0,
    dy:0
}

const home={
    x:canvas.width/2-250,
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
        let angle=calAngle(this.x,this.y,home.x+250,home.y+150)*Math.PI/180;
        rotate(en,this.x,this.y,angle,30,40);
        //ctx.drawImage(en,this.x,this.y,30,40);
    }
    update(){
        let angle=calAngle(this.x,this.y,home.x+250,home.y+150)*Math.PI/180;
        this.y+=enemy_speed;
        this.x-=enemy_speed*Math.tan(angle)
    }
    check(i){
        if(this.y>canvas.height){
            enemies.splice(i,1);
            score-=2;
        }
    }
    blast(i){
        enemies.splice(i,1);
        let blast = new Blast(this.x, this.y, 500);  
        blasts.push(blast);
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
            if(shieldOn==0){
            if (this.x + 20 >630 && this.x + 20 < 790 && this.y + 50 < 500 && this.y - 20 >320){
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
            }}else{
                
                    if (this.x + 20 >655 && this.x + 20 < 880 && this.y + 50 < 515 && this.y - 20 >295){
                        enemies.splice(i,1);
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
                    exit=1;
            }

        }
    }



}






//updating Player position
function updatePos(){
    
    if(keys['d']){

        if(!(player.x+player.w-20 > canvas.width)){
            if(!(player.y<500 && player.y>320 && player.x+player.w-20>600 && player.x+player.w-20<700 ))
            player.x+=player.speed;
        }
    }
    if(keys['a']){
            if(!(player.x-25 <0)){
                if(!(player.y<500 && player.y>320 && player.x-25<800 && player.x-25>700))
                player.x-=player.speed;
            }
}
if(keys['w']){
    if(!(player.y-25 <0)){
        if(!(player.x<800 && player.x>600 && player.y-20<500 && player.y-20>400))
        player.y-=player.speed1;
    }
}
if(keys['s']){
    if(!(player.y+player.h-20 > canvas.height)){
        if(!(player.x<800 && player.x>600 && player.y+player.h-20>280 && player.y+player.h-20<400))
        player.y+=player.speed1;
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
    Checkexit();
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

    rotate(pl,player.x,player.y,angle,50,60);
    drawHome();
    updatePos();
    if(entime-lentime>4){
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
    if(!(enemy_bul==[])){
        for (let i = 0; i < enemy_bul.length; i++) {
            enemy_bul[i].update();
            enemy_bul[i].create();
            bulletHome(enemy_bul[i].x,enemy_bul[i].y,i);
            if(i<enemy_bul.length){
            enemy_bul[i].check(i);}
            
          }
        }
    
    if(!(enemies==[])){
        for(let i=0;i<enemies.length;i++){
            enemies[i].update();
            enemies[i].create();
            enemies[i].check(i);
            if(i<enemies.length){
                enemies[i].hitPlayer(i)}
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
  //Powerup
 
  if(ptime-lptime>20 && powerupOn==0){
    powerupOn=1;
    lptime=ptime;
    let p=new powerup(Math.floor(Math.random()*2),generateX(canvas.width-100,100),generateY(canvas.height-100,10));
    powerups.push(p);
  }
  if(powerupOn==1){
    powerups.forEach(s=>{
        s.create();
        s.detectcol();
    })

    
  }
  if(shieldOn==1){
    if(!(ptime-lptime >15)){
        ctx.beginPath();
        ctx.strokeStyle='white';
        ctx.arc(home.x+252,home.y+147,110,0,Math.PI*2);
        ctx.stroke();
        ctx.closePath();

    }else{
        console.log('shield off');
        shieldOn=0;
        powerupOn=0;
    }
  }
if(destroy==1){
    console.log(enemies.length);
    
        enemies.forEach(s=>{
            let i=enemies.indexOf(s);
            s.blast(i);
        })
        enemies.length=0;
        enemyhit.play();
        console.log(enemies.length);
        destroy=0;
    powerupOn=0;
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

//orbit around earth


}

//For Shooting

class bullet{
    constructor(x,y,a){
    this.x=x;
    this.y=y;
this.a=a;}
    create(){
        ctx.drawImage(bu,this.x-5,this.y-15,30,30);
    }
    update(){
        if(this.a>Math.PI/2+0.15 && this.a<Math.PI*1.5-0.15){
        this.y+=bullet_speed;
        this.x-=(bullet_speed*Math.tan(this.a));}
        else if(this.a>=Math.PI/2-0.15 && this.a<=Math.PI/2+0.15){
            this.x+=35
        }else if(this.a>=Math.PI*1.5-0.15 && this.a<=Math.PI*1.5+0.15){
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
class enemy_bullet{
    constructor(x,y){
    this.x=x;
    this.y=y;
    }
    create(){
        ctx.drawImage(en_bullet,this.x-5,this.y-15,25,25);
    }
    update(){
        this.y+=en_speed;
        let angle=calAngle(this.x,this.y,home.x+250,home.y+150)*Math.PI/180;
        this.x-=(en_speed*Math.tan(angle));
    }
    check(i){
        if(this.y<0 && this.x<0 && this.x>canvas.width){
            en_bullet.splice(i,1);
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

    if(e.key=='w'){
        keys['w']=true;
    }
    if(e.key=='s'){
        keys['s']=true;
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
    if(e.key=='w'){
        keys['w']=false;
    }
    if(e.key=='s'){
        keys['s']=false;
    }
})

function createEnemies(){
    for(let i=0;i<en_count;i++){
        let x=generateX(canvas.width,0)
        let y=generateY(50,0);
        let enem=new Enemy(x,y);
        enem.create();
        enemies.push(enem);
    }
}

function generateX(x1,x2){
    let x=Math.floor(x2+Math.random()*(x1));
    if(x in xx){
        generateX(x1,x2)
    }else{
        return x;
    }
}
function generateY(y1,y2){
    let y=Math.floor(y2+Math.floor(Math.random()*y1));
    if(y in yy){
        generateY(y1,y2)
    }else{
        return y;
    }
}

//rotation

function rotate(img,x,y,angle,width,height){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.drawImage(img,-(width/2),-(height/2),width,height)
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

function bulletHome(x,y,i){
    if(shieldOn==0){
    if(!(enemy_bul.length==0)){

        if (x + 20 >630 && x + 20 < 790 && y + 50 < 500 && y - 20 >320){
            bullet_sound.play();
            enemy_bul.splice(i,1);
            let blast = new Blast(x, y, 500);  
            blasts.push(blast);
            width_home-=0.5;
            if(width_home<=0){
                // make a popup appear that game over then a play again button
                if(score>hiscore){
                    hiscore=score;
                    localStorage.setItem('Hiscore',hiscore);
                }
                gameover.play();
                    exit=1;
            }
}}}else{
    if(!(enemy_bul.length==0)){
    if (x + 20 >655 && x + 20 < 880 && y + 50 < 515 && y - 20 >295){
        enemy_bul.splice(i,1);
    }}
}
if(x+20>player.x-player.w+20 && x+20<player.x+player.w && y+50<player.y+player.h && y-20 > player.y-player.h){
    playerimp.play();
    playerHit.play();
    enemy_bul.splice(i,1);
    let blast = new Blast(x,y, 500);  
    blasts.push(blast);
    
    width_player-=1
    if(width_player<0){
        // make a popup appear that game over then a play again button
        if(score>hiscore){
            hiscore=score;
            localStorage.setItem('Hiscore',hiscore);
        }
        gameover.play();
                    exit=1;
            }

        }

}

class powerup{
    constructor(k,x,y){
        this.x=x;
        this.y=y;
        this.choice=k;
    }
    create(){
        if(this.choice==0){
        ctx.drawImage(shield_img,this.x,this.y,pwidth,pheight);}
        else{
            ctx.drawImage(destroy_img,this.x,this.y,pwidth,pheight);
        }
    }
    detectcol(){
        
        if(this.x+pwidth+20>player.x-player.w+20 && this.x-pwidth+20<player.x+player.w && this.y-pheight+50<player.y+player.h && this.y+pheight-20 > player.y-player.h){
            console.log('collision detected')
            powerups.splice(0,1);
            if(this.choice==0){
                console.log('yes')
                shieldOn=1;
            }
            else{
                destroy=1;
            }
    }

}
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
