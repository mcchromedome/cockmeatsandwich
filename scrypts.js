
(function (window){

    var Sakri = window.Sakri || {};
    window.Sakri = window.Sakri || Sakri;

    Sakri.Geom = {};

    //==================================================
    //=====================::POINT::====================
    //==================================================

    Sakri.Geom.Point = function (x,y){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
    };

    Sakri.Geom.Point.prototype.clone = function(){
        return new Sakri.Geom.Point(this.x,this.y);
    };

    Sakri.Geom.Point.prototype.update = function(x, y){
        this.x = isNaN(x) ? this.x : x;
        this.y = isNaN(y) ? this.y : y;
    };

    Sakri.Geom.Point.prototype.equals = function(point){
        return this.x==point.x && this.y==point.y;
    };

    Sakri.Geom.Point.prototype.toString = function(){
        return "{x:"+this.x+" , y:"+this.y+"}";
    };



    //==================================================
    //===================::RECTANGLE::==================
    //==================================================

    Sakri.Geom.Rectangle = function (x, y, width, height){
        this.update(x, y, width, height);
    };

    Sakri.Geom.Rectangle.prototype.update = function(x, y, width, height){
        this.x = isNaN(x) ? 0 : x;
        this.y = isNaN(y) ? 0 : y;
        this.width = isNaN(width) ? 0 : width;
        this.height = isNaN(height) ? 0 : height;
    };


    Sakri.Geom.Rectangle.prototype.getRight = function(){
        return this.x + this.width;
    };

    Sakri.Geom.Rectangle.prototype.getBottom = function(){
        return this.y + this.height;
    };

    Sakri.Geom.Rectangle.prototype.getCenterX = function(){
        return this.x + this.width/2;
    };

    Sakri.Geom.Rectangle.prototype.getCenterY = function(){
        return this.y + this.height/2;
    };

    Sakri.Geom.Rectangle.prototype.containsPoint = function(x, y){
        return x >= this.x && y >= this.y && x <= this.getRight() && y <= this.getBottom();
    };


    Sakri.Geom.Rectangle.prototype.clone = function(){
        return new Sakri.Geom.Rectangle(this.x, this.y, this.width, this.height);
    };

    Sakri.Geom.Rectangle.prototype.toString = function(){
        return "Rectangle{x:"+this.x+" , y:"+this.y+" , width:"+this.width+" , height:"+this.height+"}";
    };

}(window));

(function (window){

    var Sakri = window.Sakri || {};
    window.Sakri = window.Sakri || Sakri;

    Sakri.CanvasTextUtil = {};

    //returns the biggest font size that best fits into rect
    Sakri.CanvasTextUtil.getFontSizeForWidth = function(string, fontProps, width, canvas, fillStyle, maxFontSize){
        if(!canvas){
            var canvas = document.createElement("canvas");
        }
        if(!fillStyle){
            fillStyle = "#000000";
        }
        if(isNaN(maxFontSize)){
            maxFontSize = 500;
        }
        var context = canvas.getContext('2d');
        context.font = fontProps.getFontString();
        context.textBaseline = "top";

        var copy = fontProps.clone();
        //console.log("getFontSizeForWidth() 1  : ", copy.fontSize);
        context.font = copy.getFontString();
        var textWidth = context.measureText(string).width;

        //SOME DISAGREEMENT WHETHER THIS SHOOULD BE WITH && or ||
        if(textWidth < width){
            while(context.measureText(string).width < width){
                copy.fontSize++;
                context.font = copy.getFontString();
                if(copy.fontSize > maxFontSize){
                    console.log("getFontSizeForWidth() max fontsize reached");
                    return null;
                }
            }
        }else if(textWidth > width){
            while(context.measureText(string).width > width){
                copy.fontSize--;
                context.font = copy.getFontString();
                if(copy.fontSize < 0){
                    console.log("getFontSizeForWidth() min fontsize reached");
                    return null;
                }
            }
        }
        //console.log("getFontSizeForWidth() 2  : ", copy.fontSize);
        return copy.fontSize;
    }



    //====================
    //======::CANVAS TEXT PROPERTIES::====
    //=======================

    Sakri.CanvasTextProperties = function(fontWeight, fontStyle, fontSize, fontFace){
        this.setFontWeight(fontWeight);
        this.setFontStyle(fontStyle);
        this.setFontSize(fontSize);
        this.fontFace = fontFace ? fontFace : "sans-serif";
    };

    Sakri.CanvasTextProperties.NORMAL = "normal";
    Sakri.CanvasTextProperties.BOLD = "bold";
    Sakri.CanvasTextProperties.BOLDER = "bolder";
    Sakri.CanvasTextProperties.LIGHTER = "lighter";

    Sakri.CanvasTextProperties.ITALIC = "italic";
    Sakri.CanvasTextProperties.OBLIQUE = "oblique";


    Sakri.CanvasTextProperties.prototype.setFontWeight = function(fontWeight){
        switch (fontWeight){
            case Sakri.CanvasTextProperties.NORMAL:
            case Sakri.CanvasTextProperties.BOLD:
            case Sakri.CanvasTextProperties.BOLDER:
            case Sakri.CanvasTextProperties.LIGHTER:
                this.fontWeight = fontWeight;
                break;
            default:
                this.fontWeight = Sakri.CanvasTextProperties.NORMAL;
        }
    };

    Sakri.CanvasTextProperties.prototype.setFontStyle = function(fontStyle){
        switch (fontStyle){
            case Sakri.CanvasTextProperties.NORMAL:
            case Sakri.CanvasTextProperties.ITALIC:
            case Sakri.CanvasTextProperties.OBLIQUE:
                this.fontStyle = fontStyle;
                break;
            default:
                this.fontStyle = Sakri.CanvasTextProperties.NORMAL;
        }
    };

    Sakri.CanvasTextProperties.prototype.setFontSize = function(fontSize){
        if(fontSize && fontSize.indexOf && fontSize.indexOf("px")>-1){
            var size = fontSize.split("px")[0];
            fontProperites.fontSize = isNaN(size) ? 24 : size;//24 is just an arbitrary number
            return;
        }
        this.fontSize = isNaN(fontSize) ? 24 : fontSize;//24 is just an arbitrary number
    };

    Sakri.CanvasTextProperties.prototype.clone = function(){
        return new Sakri.CanvasTextProperties(this.fontWeight, this.fontStyle, this.fontSize, this.fontFace);
    };

    Sakri.CanvasTextProperties.prototype.getFontString = function(){
        return this.fontWeight + " " + this.fontStyle + " " + this.fontSize + "px " + this.fontFace;
    };

}(window));


var spriteSheetSource = "";
var spriteSheetImage = new Image();
spriteSheetImage.src = "grantfinal2.png";
var sprite = new Image();
sprite.src = "pinky.png";
var persiesLoc = [];
persiesLoc[0] = {x:0, y:0, width:317, height:spriteSheetImage.height-50, offsetX:-100, offsetY:-25};
persiesLoc[1] = {x:0, y:0, width:317, height:spriteSheetImage.height-50, offsetX:-100, offsetY:-25};
persiesLoc[2] = {x:0, y:0, width:317, height:spriteSheetImage.height-50, offsetX:-100, offsetY:-25};
var ballLoc = {x:800, y:0, width:150, height:100, offsetX:-15, offsetY:-15};

window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (function () {
    return function (callback, element) {
        var lastTime = element.__lastTime;
        if (lastTime === undefined) {
            lastTime = 0;
        }
        var currTime = Date.now();
        var timeToCall = Math.max(1, 33 - (currTime - lastTime));
        window.setTimeout(callback, timeToCall);
        element.__lastTime = currTime + timeToCall;
    };
})();

var readyStateCheckInterval = setInterval( function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);

//========================
//general properties for demo set up
//========================

var canvas, context, canvasContainer, htmlBounds, bounds;
var minimumStageWidth = 300;
var minimumStageHeight = 300;
var maxStageWidth = 800;
var maxStageHeight = 1000;
var resizeTimeoutId = -1;
//var stats;
var persieImageDatas = [];
var ballImageData;


function updateImageDatas(){
    var ssCanvas = document.createElement("canvas");
    ssCanvas.width = spriteSheetImage.width;
    ssCanvas.height = spriteSheetImage.height;
    //console.log(spriteSheetImage.width, spriteSheetImage.height);
    var ssContext = ssCanvas.getContext("2d");
    var w = Math.floor(spriteSheetImage.width * gameScale);
    var h = Math.floor(spriteSheetImage.height * gameScale);
    ssContext.drawImage(spriteSheetImage, 0, 0, spriteSheetImage.width, spriteSheetImage.height, 0, 0, w, h);

    var i, loc;
    for(var i=0; i<3; i++){
        loc = persiesLoc[i];
        persieImageDatas[i] = ssContext.getImageData(loc.x * gameScale, loc.y * gameScale, loc.width * gameScale, loc.height * gameScale);
    }
    ballImageData = ssContext.getImageData(ballLoc.x * gameScale, ballLoc.y * gameScale, ballLoc.width * gameScale, ballLoc.height * gameScale);
    headRadius = 24 * gameScale;
    collisionDistance = 25 * gameScale;
    persieX  = 250 * gameScale;
    maxPerieX = 260 * gameScale;
    minPerieX = 230 * gameScale;
}

function getImageDataFromSpriteSheet(context, locRect, x, y){
    context.drawImage(spriteSheetImage, locRect.x, locRect.y, locRect.width, locRect.height, x, y, locRect.width, locRect.height);
}

function createImageDataFromSpriteSheet(locRect){
    context.drawImage(spriteSheetImage, locRect.x, locRect.y, locRect.width, locRect.height, 0, 0, locRect.width, locRect.height)
    return context.getImageData(0,0,locRect.width, locRect.height);
}

function init(){

    canvasContainer = document.getElementById("canvasContainer");
    window.onresize = resizeHandler;
    //stats = new Stats();
    //canvasContainer.appendChild( stats.getDisplayElement() );
    window.addEventListener( "keydown", keyUpEventHandler, false );
    commitResize();
}

function getWidth( element ){return Math.max(element.scrollWidth,element.offsetWidth,element.clientWidth );}
function getHeight( element ){return Math.max(element.scrollHeight,element.offsetHeight,element.clientHeight );}

//avoid running resize scripts repeatedly if a browser window is being resized by dragging
function resizeHandler(){
    context.clearRect(0,0,canvas.width, canvas.height);
    clearTimeout(resizeTimeoutId);
    clearTimeoutsAndIntervals();
    resizeTimeoutId = setTimeout(commitResize, 300 );
}

function commitResize(){
    if(canvas){
        canvasContainer.removeChild(canvas);
    }
    canvas = document.createElement('canvas');
    canvas.style.position = "absolute";
    context = canvas.getContext("2d");
    canvasContainer.appendChild(canvas);

    htmlBounds = new Sakri.Geom.Rectangle(0,0, getWidth(canvasContainer) , getHeight(canvasContainer));
    if(htmlBounds.width >= maxStageWidth){
        canvas.width = maxStageWidth;
        canvas.style.left = htmlBounds.getCenterX() - (maxStageWidth/2)+"px";
    }else{
        canvas.width = htmlBounds.width;
        canvas.style.left ="0px";
    }
    if(htmlBounds.height > maxStageHeight){
        canvas.height = maxStageHeight;
        canvas.style.top = htmlBounds.getCenterY() - (maxStageHeight/2)+"px";
    }else{
        canvas.height = htmlBounds.height;
        canvas.style.top ="0px";
    }
    bounds = new Sakri.Geom.Rectangle(0,0, canvas.width, canvas.height);
    context.clearRect(0,0,canvas.width, canvas.height);

    if(bounds.width<minimumStageWidth || bounds.height<minimumStageHeight){
        stageTooSmallHandler();
        return;
    }

    gameScale = 1;
    if(bounds.width < maxStageWidth){
        gameScale = bounds.width / maxStageWidth;
    }

    updateImageDatas();

    startDemo();
}

function stageTooSmallHandler(){
    var warning = "Sorry, bigger screen required :(";
    context.font = "bold normal 24px sans-serif";
    context.fillText(warning, bounds.getCenterX() - context.measureText(warning).width/2, bounds.getCenterY()-12);
}




//========================
//Demo specific properties
//========================


var HOME = 0;
var GAME = 1;
var GAME_OVER = 2;
var gameState;
var scrollSpeed = 3;
var score;
var fontProperties = new Sakri.CanvasTextProperties(Sakri.CanvasTextProperties.BOLD, null, 100);
var gameScale = 1;

var word = "SAKRI";

function startDemo(){

    canvas.addEventListener('touchstart', handleUserTap, false);
    canvas.addEventListener('mousedown', handleUserTap, false);

    var logoText = "Fappy Bird";
    if(!logoCanvas){
        logoCanvas = document.createElement("canvas");
        logoCanvasBG = document.createElement("canvas");
    }
    createLogo("Fappy Bird", logoCanvas, logoCanvasBG);
    if(!gameOverCanvas){
        gameOverCanvas = document.createElement("canvas");
        gameOverCanvasBG = document.createElement("canvas");
    }
    createLogo("YOU SUCK BITCH", gameOverCanvas, gameOverCanvasBG);

    createGroundPattern();
    createTubes();
    createCityGraphic();
    persieY  = 220;
    score = 0;
    gameState = HOME;
    loop();
}

function loop(){
    switch(gameState){
        case HOME:
            renderHome();
            break;
        case GAME :
            renderGame();
            break;
        case GAME_OVER:
            renderGameOver();
            break;
    }
    //stats.tick();
}

function handleUserTap(event){
    switch(gameState){
        case HOME:
            persieIndex = 0;
            gameState = GAME;
            break;
        case GAME :
            birdYSpeed = -tapBoost;
            break;
        case GAME_OVER:
            commitResize();
            break;
    }
    if(event){
        event.preventDefault();
    }
}

function keyUpEventHandler(event){
    //event.keyCode == 32 -> Space
    if(event.keyCode == 38){
        handleUserTap(event);
    }
}

function renderHome(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderGroundPattern();
    renderLogo();
    renderInstructions();
    renderBirdHome();
    window.requestAnimationFrame(loop, canvas);
}

function renderGame(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    updateBird();
    renderBird();
    updateTubes();
    renderTubes();
    renderBall();
    renderGroundPattern();
    renderScore();
    window.requestAnimationFrame(loop, canvas);
}

function gameOverHandler(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    gameState = GAME_OVER;
    renderGameOver();
}

function renderGameOver(){

    //game over logo
    context.drawImage(gameOverCanvas, bounds.getCenterX() - logoCanvas.width/2, canvas.height *.2);

    var instruction = "Click, tap or press up key to flap again.";
    context.font = "bold normal 24px sans-serif";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width/2, canvas.height *.25 + gameOverCanvas.height);
    renderScore();

    //window.requestAnimationFrame(loop, canvas);
}

function renderLogo(){
    logoCurrentY += logoDirection;
    context.drawImage(logoCanvas, bounds.getCenterX() - logoCanvas.width/2, logoCurrentY);
    if(logoCurrentY <= logoY || logoCurrentY >= logoMaxY){
        logoDirection *= -1;
    }
}

function renderInstructions(){
    var instruction = "Click, tap or press up key to flap :)";
    context.font = "bold normal 24px sans-serif";
    context.fillStyle = "#FFFFFF";
    context.fillText(instruction, bounds.getCenterX() - context.measureText(instruction).width/2, canvas.height *.2);
}

function renderScore(){
    context.font = fontProperties.getFontString();
    context.fillStyle = "#FFFFFF";
    context.strokeStyle = "#000000";
    context.lineWidth = 3;
    var x = bounds.getCenterX() - context.measureText(score).width/2;
    var y = bounds.height*.1;
    context.fillText(score, x, y);
    context.strokeText(score, x, y);
}

//========================================================================
//========================:: LOGO ::======================================
//========================================================================

var logoCanvas;
var logoCanvasBG;

var gameOverCanvas;
var gameOverCanvasBG;

var logoY;
var logoCurrentY;
var logoMaxY;
var logoDirection;

function createLogo(logoText, logoCanvas, logoCanvassBG){
    logoCanvas.width = logoCanvasBG.width = canvas.width;
    logoCanvas.height = logoCanvasBG.height = canvas.height / 4;
    logoCurrentY = logoY = canvas.height * .25;
    logoMaxY = canvas.height * .35;
    logoDirection = 1;
    var logoContext = logoCanvas.getContext("2d");
    logoContext.textBaseline = "top";
    var textRect = new Sakri.Geom.Rectangle(0, 0, logoCanvas.width * .8, logoCanvas.height);
    var logoFontProps = fontProperties.clone();
    logoFontProps.fontSize = Sakri.CanvasTextUtil.getFontSizeForWidth(logoText, fontProperties, logoCanvas.width * .8, canvas);

    var logoBGContext = logoCanvasBG.getContext("2d");
    logoBGContext.fillStyle = "#f5eea5";
    logoBGContext.fillRect(0, 0, logoCanvasBG.width, logoCanvasBG.height);
    logoBGContext.fillStyle = "#9ce358";
    logoBGContext.fillRect(0, logoFontProps.fontSize/2, logoCanvasBG.width, logoCanvasBG.height);

    logoContext.font = logoFontProps.getFontString();
    logoContext.fillStyle = logoContext.createPattern(logoCanvasBG, "repeat-x");
    logoContext.strokeStyle = "#000000";
    logoContext.lineWidth = 3;
    var x = logoCanvas.width/2 - logoContext.measureText(logoText).width/2;
    var y = logoFontProps.fontSize/2;
    logoContext.fillText(logoText, x, 0);
    logoContext.strokeText(logoText, x, 0);
}

//========================================================================
//========================:: BIRD ::==================================
//========================================================================

var birdYSpeed = 0;
var gravity = 1;
var tapBoost = 12;

function updateBird(){
    persieY += birdYSpeed;
    birdYSpeed += gravity;

    //floor
    if(persieY >= groundGraphicRect.y - headRadius*2){
        persieY = groundGraphicRect.y - headRadius*2;
        birdYSpeed = 0;
    }
    //celing
    if(persieY<=0){
        persieY = 1;
        birdYSpeed = 0;
    }


    if(checkCollision()){
        context.fillStyle = "#FFFFFF";
        context.fillRect(0,0,canvas.width, canvas.height);
    }
}

var currentTube;
var persieIndex = 0;

var headRadius = 24;
var persieX  = 250;
var maxPerieX = 260;
var minPerieX = 230;
var persieY  = 220;
var collisionDistance = 25;

function renderBird(){
    var index = 0;
    if(birdYSpeed<1){
        persieIndex++;
        persieIndex %= 12;
        index = Math.floor(persieIndex / 4);
    }

    persieX += (-1 + Math.random()*2);
    persieX = Math.min(maxPerieX, persieX);
    persieX = Math.max(minPerieX, persieX);

    var loc = persiesLoc[index];
    var img = persieImageDatas[index];
    context.putImageData(img, Math.round(persieX) + loc.offsetX*gameScale, persieY + loc.offsetY*gameScale );

}

function renderBirdHome(){
    var index = 0;
    persieIndex++;
    persieIndex %= 21;
    index = Math.floor(persieIndex / 7);

    persieX += (-1 + Math.random()*2);
    persieX = Math.min(maxPerieX, persieX);
    persieX = Math.max(minPerieX, persieX);

    var loc = persiesLoc[index];
    var img = persieImageDatas[index];
    context.putImageData(img, bounds.width/3, logoCurrentY + logoCanvas.height );

}

function distanceBetweenBallAndHead(){
    return Math.sqrt( Math.pow(ballX - persieX, 2) + Math.pow(ballY - persieY, 2) );
}

function checkCollision(){
    //console.log(distanceBetweenBallAndHead());
    if(distanceBetweenBallAndHead() < collisionDistance){
        ballSwitch = true;
        score++;
        for(var i=0;i<tubes.length;i++){
            if(tubes[i].topRect.x > currentTube.topRect.x){
                currentTube = tubes[i];
                return;
            }
        }
    }
}

//========================================================================
//========================:: BALL ::==================================
//========================================================================

var ballSwitch = false;
var ballX = 0, ballY = 0;

function renderBall(){
    var x = currentTube.topRect.x + currentTube.topRect.width/2;
    var y = currentTube.bottomRect.y - tubeGapHeight/2;
    if(ballSwitch){
        ballX += (x - ballX)/2;
        ballY += (y - ballY)/2;
        if(Math.abs(x-ballX)< 1 && Math.abs(y-ballY)< 1){
            ballSwitch = false;
        }
    }else{
        ballX =  x;
        ballY = y;
    }
    context.putImageData(ballImageData, ballX+ ballLoc.offsetX*gameScale , ballY + ballLoc.offsetY*gameScale);
    if(ballX < persieX){
        gameOverHandler();
    }
}

//========================================================================
//========================:: TUBES ::==================================
//========================================================================

var tubeGapHeight = 230;//needs some logic
var tubesGapWidth;
var tubes;
var tubeWidth = 100;//needs some logic
var minTubeHeight = 50;//needs some logic

function updateTubes(){
    for(var i= 0; i<tubes.length;i++){
        updateTube(tubes[i]);
    }
}

function updateTube(tube){
    tube.topRect.x -= scrollSpeed;
    tube.bottomRect.x = tube.topRect.x;
    if(tube.topRect.x <= -tubeWidth ){
        tube.topRect.x = tube.bottomRect.x = canvas.width;
        renderTube(tube);
    }
}


function renderTubes(){
    for(var i= 0; i<tubes.length;i++){
        context.drawImage(tubes[i].canvas, tubes[i].bottomRect.x, 0);
    }
}

function createTubes(){
    tubes = [];
    var totalTubes = 2;
    tubesGapWidth = Math.floor(canvas.width/totalTubes);

    for(var i = 0; i < totalTubes; i++){
        tubes[i] = {};
        tubes[i].canvas = document.createElement("canvas");
        tubes[i].topRect = new Sakri.Geom.Rectangle(canvas.width+(i * tubesGapWidth));
        tubes[i].bottomRect = new Sakri.Geom.Rectangle(canvas.width+(i * tubesGapWidth));
        renderTube(tubes[i]);
    }
    currentTube = tubes[0];
}

var tubeOutlineColor = "#534130";
var tubeMainColor = "#75be2f";
var tubeCapHeight = 40;

function renderTube(tube){
    tube.canvas.width = tubeWidth;
    tube.canvas.height = groundGraphicRect.y;

    tube.bottomRect.width = tube.topRect.width = tubeWidth;
    tube.topRect.y = 0;
    tube.topRect.height = minTubeHeight + Math.round(Math.random()*(groundGraphicRect.y-tubeGapHeight-minTubeHeight*2));

    tube.bottomRect.y = tube.topRect.getBottom() + tubeGapHeight;
    tube.bottomRect.height = groundGraphicRect.y - tube.bottomRect.y - 1;//minus one for stroke

    var tubeContext = tube.canvas.getContext("2d");
    tubeContext.lineWidth = 2;
    //top tube
    renderTubeElement(tubeContext , 3, 0, tubeWidth-6, tube.topRect.height);
    renderTubeElement(tubeContext , 1, tube.topRect.getBottom() - tubeCapHeight, tubeWidth-2, tubeCapHeight);

    //bottom tube
    renderTubeElement(tubeContext , 3, tube.bottomRect.y, tubeWidth-6, tube.bottomRect.height);
    renderTubeElement(tubeContext , 1, tube.bottomRect.y, tubeWidth-2, tubeCapHeight);
}

function renderTubeElement(ctx, x, y, width, height){
    ctx.fillStyle = tubeMainColor;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "#9de85a";
    ctx.fillRect(x, y, width*.25, height);

    ctx.fillStyle = "#d9f881";
    ctx.fillRect(x+width *.05, y, width *.05, height);

    ctx.fillStyle = "#547e25";
    ctx.fillRect(x+width- width * .1, y, width *.1, height);
    ctx.fillRect(x+width- width * .2, y, width *.05, height);

    ctx.strokeRect(x, y, width, height);
}


//========================================================================
//========================:: CITY BG ::==================================
//========================================================================

var cityGraphicCanvas;

function getRandomNumberInRange(min, max){
    return min + Math.random() * (max - min);
};

function createCityGraphic(){

    if(cityGraphicCanvas){
        canvasContainer.removeChild(cityGraphicCanvas);
    }
    cityGraphicCanvas = document.createElement("canvas");
    cityGraphicCanvas.style.position = "absolute";
    cityGraphicCanvas.style.left = canvas.style.left;
    cityGraphicCanvas.style.top = canvas.style.top;
    cityGraphicCanvas.width = canvas.width;
    cityGraphicCanvas.height = canvas.height;
    var cgContext = cityGraphicCanvas.getContext("2d");
    var cityGraphicHeight = canvas.height * .25;

    //fill with blue sky
    cgContext.fillStyle = "#71c5cf";
    cgContext.fillRect(0, 0, canvas.width, canvas.height);

    cgContext.fillStyle = "#e9fad8";

    cgContext.save();
    cgContext.translate(0, groundGraphicRect.y - cityGraphicHeight);

    //CLOUDS
    var maxCloudRadius = cityGraphicHeight * .4;
    var minCloudRadius = maxCloudRadius * .5;

    for(iterator=0; iterator<canvas.width; iterator+=minCloudRadius){
        cgContext.beginPath();
        cgContext.arc( iterator , maxCloudRadius, getRandomNumberInRange(minCloudRadius, maxCloudRadius), 0, Math.PI*2);
        cgContext.closePath();
        cgContext.fill();
    }

    cgContext.fillRect(0,maxCloudRadius, canvas.width, cityGraphicHeight );

    //HOUSES
    var houseWidth;
    var houseHeight;
    cgContext.fillStyle = "#deefcb";
    for(iterator=0; iterator<canvas.width; iterator+=(houseWidth+8)){
        houseWidth = 20 + Math.floor(Math.random()*30);
        houseHeight = getRandomNumberInRange(cityGraphicHeight *.5 , cityGraphicHeight - maxCloudRadius *.8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    cgContext.fillStyle = "#dff1c4";
    cgContext.strokeStyle = "#9fd5d5";
    cgContext.lineWidth = 3;
    for(iterator=0; iterator<canvas.width; iterator+=(houseWidth+8)){
        houseWidth = 20 + Math.floor(Math.random()*30);
        houseHeight = getRandomNumberInRange(cityGraphicHeight *.5 , cityGraphicHeight - maxCloudRadius *.8);
        cgContext.fillRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
        cgContext.strokeRect(iterator, cityGraphicHeight - houseHeight, houseWidth, houseHeight);
    }

    //TREES
    var maxTreeRadius = cityGraphicHeight * .3;
    var minTreeRadius = maxTreeRadius * .5;
    var radius;
    var strokeStartRadian = Math.PI + Math.PI/4;
    var strokeEndRadian = Math.PI + Math.PI/4;
    cgContext.fillStyle = "#81e18b";
    cgContext.strokeStyle = "#72c887";
    for(iterator=0; iterator<canvas.width; iterator+=minTreeRadius){
        cgContext.beginPath();
        radius = getRandomNumberInRange(minCloudRadius, maxCloudRadius)
        cgContext.arc( iterator , cityGraphicHeight, radius, 0, Math.PI*2);
        cgContext.closePath();
        cgContext.fill();

        cgContext.beginPath();
        cgContext.arc( iterator , cityGraphicHeight, radius, strokeStartRadian, strokeEndRadian);
        cgContext.closePath();
        cgContext.stroke();
    }

    cgContext.restore();
    //sand
    cgContext.fillStyle = sand;
    cgContext.fillRect(0,groundGraphicRect.y, canvas.width, canvas.height);

    canvasContainer.insertBefore(cityGraphicCanvas, canvasContainer.firstChild);
}


//========================================================================
//========================:: GROUND ::==================================
//========================================================================

var groundX = 0;
function renderGroundPattern(){
    context.drawImage(groundPatternCanvas, groundX, groundGraphicRect.y);
    groundX -= scrollSpeed;
    groundX %= 16;
}


//colors
var groundLightGreen = "#97e556";
var groundDarkGreen = "#73be29";
var groundDarkerGreen = "#4b7e19";
var groundShadow = "#d1a649";
var groundBorder = "#4c3f48";
var sand = "#dcd795";
var groundGraphicRect = new Sakri.Geom.Rectangle();
var groundPatternCanvas;

function createGroundPattern(){
    groundGraphicRect.y = canvas.height*.85;
    if(!groundPatternCanvas){
        groundPatternCanvas = document.createElement("canvas");
    }
    groundPatternCanvas.width = 16;
    groundPatternCanvas.height = 16;
    var groundContext = groundPatternCanvas.getContext("2d");
    groundContext.fillStyle = groundLightGreen;
    groundContext.fillRect(0,0,16,16);

    //diagonal graphic
    groundContext.fillStyle = groundDarkGreen;
    groundContext.beginPath();
    groundContext.moveTo(8,3);
    groundContext.lineTo(16,3);
    groundContext.lineTo(8,13);
    groundContext.lineTo(0,13);
    groundContext.closePath();
    groundContext.fill();

    //top border
    groundContext.fillStyle = groundBorder;
    groundContext.globalAlpha = .2;
    groundContext.fillRect(0,0,16,1);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0,1,16,1);
    groundContext.globalAlpha = .6;
    groundContext.fillRect(0,2,16,1);

    //hilite
    groundContext.fillStyle = "#FFFFFF";
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0,3,16,2);

    //bottom border
    groundContext.fillStyle = groundDarkerGreen;
    groundContext.globalAlpha = .3;
    groundContext.fillRect(0,10,16,3);
    groundContext.globalAlpha = 1;
    groundContext.fillRect(0,11,16,1);

    //shadow
    groundContext.fillStyle = groundShadow;
    groundContext.fillRect(0,13,16,3);

    var groundPattern = context.createPattern(groundPatternCanvas, "repeat-x");

    groundPatternCanvas.width = canvas.width + 16;
    groundPatternCanvas.height = 16;

    groundContext.fillStyle = groundPattern;
    groundContext.fillRect(0, 0, groundPatternCanvas.width, 16);

}

function clearTimeoutsAndIntervals(){
    gameState = -1;
}


function showInfo(){
    document.getElementById("infoScreen").style.display = "block";
}
function hideInfo(){
    document.getElementById("infoScreen").style.display = "none";
}