var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var bgcanvas = document.getElementById('backCanvas');
var bgctx = bgcanvas.getContext('2d');

var imageObj = new Image();
//var localStorage = unsafeWindow.localStorage;

imageObj.onload = function() {
bgctx.drawImage(imageObj, 0, 0);
};


if(localStorage.getItem("ImageUrl")!=null)
{
    imageObj.src = localStorage.getItem('ImageUrl');
}
ctx.globalAlpha = 0.55;
rect = {},
drag = false;
resize = false;
resize_drag = false;
var curr_rec = 0;
var rectStartXArray = new Array() ;
var rectStartYArray = new Array() ;
var rectWArray = new Array() ;
var rectHArray = new Array() ;

function init() {
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    canvas.addEventListener('mousemove', mouseMove, false);

    if(localStorage.getItem("X")!=null)
    {
        rectStartXArray = JSON.parse(localStorage.getItem("X"));
        rectStartYArray = JSON.parse(localStorage.getItem("Y"));
        rectWArray = JSON.parse(localStorage.getItem("W"));
        rectHArray = JSON.parse(localStorage.getItem("H"));
        drawOldShapes();
    }

}

function mouseDown(e) {
    rect.startX = e.pageX - this.offsetLeft;
    rect.startY = e.pageY - this.offsetTop;

    if(!resize)
    {
        for(var i=0; i<rectHArray.length;i++)
        {
            if(
                rect.startX> rectStartXArray[i]&&
                rect.startX<rectStartXArray[i]+rectWArray[i] &&
                rect.startY> rectStartYArray[i]&&
                rect.startY<rectStartYArray[i]+rectHArray[i]
                ){
                rectStartXArray.splice(i,1);
                rectStartYArray.splice(i,1);
                rectHArray.splice(i,1);
                rectWArray.splice(i,1);
                ctx.clearRect(0,0,canvas.width,canvas.height);
                drawOldShapes();
                
                return;
            }               
        }
    }
    
    if(!resize)
     drag = true;
    else
     resize_drag= true;
}
function dist(p1, p2) {
    return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
}

function updateStorage()
{
    localStorage.setItem('X',JSON.stringify(rectStartXArray));
    localStorage.setItem('Y',JSON.stringify(rectStartYArray));
    localStorage.setItem('W',JSON.stringify(rectWArray));
    localStorage.setItem('H',JSON.stringify(rectHArray));
}
function mouseUp() {
    if(drag==true && rect.w>2&& rect.h>2)
    {
        rectStartXArray[rectStartXArray.length] = rect.startX;
        rectStartYArray[rectStartYArray.length] = rect.startY;
        rectWArray[rectWArray.length] = rect.w;
        rectHArray[rectHArray.length] = rect.h;
        rect.w=0;
        rect.h=0;
        drawOldShapes();
    }
    drag = false;
    resize_drag = false;
    resize = false;
}
function point(x, y) {
    return {
        x: x,
        y: y
    };
}
function mouseMove(e) {
    var p = point(e.pageX - this.offsetLeft,e.pageY - this.offsetTop);
    if(resize_drag)
    {
        if(p.x - rectStartXArray[curr_rec]>2&&p.y - rectStartYArray[curr_rec]>2)
        {
            rectWArray[curr_rec] = p.x - rectStartXArray[curr_rec];
            rectHArray[curr_rec] = p.y - rectStartYArray[curr_rec];
            drawOldShapes();
        }
    }else if (drag) {
        rect.w = (e.pageX - this.offsetLeft) - rect.startX;
        rect.h = (e.pageY - this.offsetTop) - rect.startY;
        if(rect.w>0&& rect.h>0)
         draw();
         //drawOldShapes();
    }else {
        resize = false;
        for(var i=0; i<rectHArray.length;i++)
        {
            var pi = point(rectStartXArray[i]+rectWArray[i],rectStartYArray[i]+rectHArray[i]);
            if(dist(p,pi) <8){
                resize = true;
                curr_rec = i;
            }               
        }
        drawOldShapes();
    }
}
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawOldShapes();
    ctx.setLineDash([6]);
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
}
function drawOldShapes(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(resize)
    {
        var posHandle = point(0, 0);
        posHandle.x = rectStartXArray[curr_rec] + rectWArray[curr_rec];
        posHandle.y = rectStartYArray[curr_rec] + rectHArray[curr_rec];
        
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(posHandle.x, posHandle.y, 6, 0, 2 * Math.PI);
        ctx.fillStyle ="#000000";
        ctx.fill();
        ctx.globalAlpha = 0.55;
        
    }
   // console.log("Hleoo");
    for(var i=0;i<rectStartXArray.length;i++)
    {
        ctx.beginPath();
        ctx.fillStyle="#FF0000";
        ctx.fillRect(rectStartXArray[i], rectStartYArray[i], rectWArray[i], rectHArray[i]);
        
        ctx.stroke();
    }
}

function clearall()
{
    rectStartXArray = new Array() ;
    rectStartYArray = new Array() ;
    rectWArray = new Array() ;
    rectHArray = new Array() ;
    localStorage.setItem('ImageUrl',null);
    updateStorage();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    bgctx.clearRect(0,0,canvas.width,canvas.height);  
}
init();