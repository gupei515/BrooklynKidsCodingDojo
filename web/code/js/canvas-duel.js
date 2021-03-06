//Step 1:set up the canvas and contest in javascript
var myCanvas=document.getElementById("gameCanvas");
var myContext=myCanvas.getContext("2d");

//Step 2: Create a constructor function and array for players.
var players=[];
function Player(initX,initY,width,height,color,name){
  this.x=initX;
  this.y=initY;
  this.w=width;
  this.h=height;
  this.c=color;
  players.push(this);
  this.airborne=true;
  this.name=name;
  
  //Step 7: Make your characters jump whenever a key is pressed, but only if they aren't currently 
  this.jump = function(){
    if(!this.airborne){
      this.yAccel=10;
      this.airborne=true;
    }
  }
  
  //Step 6: Make your characters constantly fall until they hit the ground
  this.yAccel=0;
  this.gravity=function(){
    if(this.airborne){
      this.yAccel-=1;
    }
    this.y-=this.yAccel;
    if(this.y>myCanvas.height){
      this.yAccel=0;
      this.airborne=false;
      this.y=myCanvas.height-this.h;
    }
  }
  
  //Additional Challenges: Make your characters accelerate instead of moving at a constant speed
  this.xAccel=0;
  this.move=function(){
    this.x+=this.xAccel;
    if(!(this.airborne)){
      if(this.xAccel>0){
        this.xAccel-=1;
      }
      if(this.xAccel<0){
        this.xAccel+=1;
      }
    }
    if(this.x>=myCanvas.width-this.w){
      this.x=myCanvas.width-this.w;
    }
    else if(this.x<=0){
      this.x=0;
    }
  }
}

//Step 3: Create two Players
var playerOne=new Player(10,10,10,10,"red","Player One");
var playerTwo=new Player(380,10,10,10,"blue","Player Two");

//Step 4:Create a function that loops ~30 times a second
function cycle(){
  myContext.clearRect(0,0,myCanvas.width,myCanvas.height);
  resolveKeys();
  players.forEach(function(player){
    player.gravity();
    player.move();
    myContext.fillStyle=player.c;
    myContext.fillRect(player.x,player.y,player.w,player.h);
  })
  
  //Step 10: Make your looping function also draw the attacks
  attacks.forEach(function(attack){
    attack.display();
    myContext.fillStyle="green";
    myContext.strokeStyle="green";
    if(attack.fill){
      myContext.fillRect(attack.x,attack.y,attack.w,attack.h);
    } else {
      myContext.strokeRect(attack.x,attack.y,attack.w,attack.h);
    }
    attack.nextFrame();
    
    //Additional Challenges: Make it so if two attacks collide, both players get knocked away.
    attacks.forEach(function(otherAttack){
      if(attack.player !== otherAttack.player){
      if(hitDetect(attack,otherAttack)!==0){
        
        players.forEach(function(player){
          player.xAccel=player.xAccel*-1;
          player.move();
        })
      }
      }
    })
    
    //Step 12: Make your looping function detect if an Attack is colliding with a Player, and if so, stop the loop and show an alert.
    players.forEach(function(enemy){
      if(enemy !== attack.player){
        if(hitDetect(attack,enemy)!==0 || hitDetect(enemy,attack)!==0){
          clearInterval(loop);
          alert(attack.player.name + " wins!");
        }
      }
    })
  })
}

//Step 4: make it loop
var loop=setInterval(cycle,33);

//Step 5: Make your characters move whenever a key is pressed
var keys=[];
onkeydown=onkeyup=function(e){
  keys[e.keyCode]=e.type=='keydown';
}
function resolveKeys(){
  if(keys[37]){
    if(!playerTwo.airborne){
       playerTwo.xAccel-=2;
    }
  }
  if(keys[39]){
    if(!playerTwo.airborne){
       playerTwo.xAccel+=2;
    }
  }
  if(keys[65]){
    if(!playerOne.airborne){
       playerOne.xAccel-=2;
    }
  }
  if(keys[68]){
    if(!playerOne.airborne){
       playerOne.xAccel+=2;
    }
  }
  
  //Step 7: Make your characters jump whenever a specific key is pressed
  if(keys[38]){
    playerTwo.jump();
  }
  if(keys[87]){
    playerOne.jump();
  }
  
  //Step 10: Make the attacks only show up when a specific key is pressed
  if(keys[69]){
    if(attackOne.frames === 0){
    attackOne.frames=20;
    }
  }
  if(keys[191]){
    if(attackTwo.frames === 0){
    attackTwo.frames=20;
    }
  }
}

//Step 8: Make another constructor function for "Attack" variables
var attacks=[];
function Attack(controller, neutralX, neutralY){
  this.player=controller;
  this.neutralX=neutralX;
  this.neutralY=neutralY;
  this.x=neutralX;
  this.y=neutralY;
  this.w=0;
  this.h=0;
  this.fill=true;
  attacks.push(this);
  
  //Step 10: Make the attacks show up only when a specific key is pressed and at the correct location.
  this.frames=0;
  this.nextFrame= function(){
    if(this.frames>0){
      this.frames--;
    }
  }
  this.display= function(){
    if(this.frames>10){
      if(this.player.xAccel>0){
        this.w=15;
        this.h=5;
        this.x=this.player.x+this.player.w;
        this.y=this.player.y+3;
        this.fill=true;
      }
      else if(this.player.xAccel<0){
        this.w=15;
        this.h=5;
        this.x=this.player.x-this.w;
        this.y=this.player.y+3;
        this.fill=true;
      }
      else{
        this.w=40;
        this.h=32;
        this.x=this.player.x-15;
        this.y=this.player.y-11;
        this.fill=false;
      }
    } else {
      this.w=0;
      this.h=0;
      this.x=this.neutralX;
      this.y=this.neutralY;
    }
  }
}

//Step 9: Create two of these "Attack" variables
var attackOne=new Attack(playerOne,0,0);
var attackTwo=new Attack(playerTwo,0,100);
//Step 11: Create a function to detect if two rectangles are colliding
function hitDetect(a,b){
  if(a.x>=b.x && a.x<=b.x+b.w && a.y>=b.y && a.y<=b.y+b.h){
    return 1;
  }
  if(a.x+a.w>=b.x && a.x+a.w<=b.x+b.w && a.y>=b.y && a.y<=b.y+b.h){
    return 2;
  }
  if(a.x>=b.x && a.x<=b.x+b.w && a.y+a.h>=b.y && a.y+a.h<=b.y+b.h){
    return 3;
  }
  if(a.x+a.w>=b.x && a.x+a.w<=b.x+b.w && a.y+a.h>=b.y && a.y+a.h<=b.y+b.h){
    return 4;
  }
  return 0;
}