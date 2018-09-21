 var greenToRed = function(pos){
    var max = 255
    var r = pos >=0.5 ? max : 2 * pos * max
    var g = pos <=0.5 ? max : (max - ((pos-0.5)*2 * max))
    var b = 0 
    return "rgb(" + r +"," +g+"," + b + ")"
  }
  
  var bft_to_kmh = function(bft){
    return Math.pow(bft, 1.5) * 3.010
  }
  
  

  ctx = document.getElementById('canvasInAPerfectWorld').getContext("2d");
  // ***** data begin
  var bftMax = 13
  var kmhMax = 140
  // ***** data end
  
  class Area {
    constructor(left, top, right, bottom) {
      this.left = left;
      this.top = top;
      this.right = right;
      this.bottom = bottom;
      this.width = right - left;
      this.height = bottom - top;
    }
    
    newInnerArea(deltaLeft, deltaTop, deltaRight, deltaBottom){
      return new Area(this.left + deltaLeft, this.top + deltaTop, this.right - deltaRight, this.bottom - deltaBottom)
    }
    
    fill(color) {
      ctx.fillStyle = color;
      ctx.fillRect(this.left, this.top, this.width, this.height);
    }
    
    drawLine(color, left, top, right, bottom){
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(this.left + left, this.top + top);
      ctx.lineTo(this.left + right, this.top + bottom);
      ctx.stroke()
    }
    
    printText(text, x, y, color, font, align){
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.font = font;
      ctx.fillText(text, this.left + x, this.top + y);
    }
    
    forEachX(applier){ // applier -> function(x, xPercent), wobei x relativ zum aktuellen frame, percent --> Wer zwischen 0 und 1
      for (var x = 0; x < this.width; x++) {
        applier(x, (1+x) / this.width )
      }
    }
  }
  
  // ***** fill background
  var total = new Area(0, 0, ctx.canvas.width, ctx.canvas.height)
  total.fill("lightblue")
  
  // ***** start drawing
  var chartArea = total.newInnerArea(70, 50, 70, 50)
  
  // ***** background
  chartArea.fill("white")
  
  // ***** area
  var currentI = 0
  var before = -1 
  var h = chartArea.height
  chartArea.forEachX(function(x, xPercent){
    var bft = bftMax * Math.pow(xPercent, 1.0)
    var kmh = Math.min(bft_to_kmh(bft), kmhMax)
    var yPercent = kmh / kmhMax
    
    chartArea.drawLine(greenToRed(xPercent), x, h - yPercent * h, x, h) 
    chartArea.drawLine("black", x, h - yPercent * h, x, h - yPercent * h -1)
    
    if(before <= currentI && bft >= currentI){
      chartArea.drawLine("grey" , x  , h - yPercent * h, x  , h + 7) 
      chartArea.drawLine("white", x-1, h - yPercent * h, x-1, h + 7)
      chartArea.printText(currentI, x, h + 20, "black", "14px Arial", "center")
      
      currentI++
    }
  });
  
  chartArea.printText("Bft", chartArea.width / 2, chartArea.height + 30, "black", "14px Arial", "center")
  
  // ***** kmh lines
  for(var i=0;i<=kmhMax;i+=5){
    var h = chartArea.height / kmhMax * i
    if(i % 10 === 0){
      chartArea.drawLine("grey" , -5, h  , chartArea.width, h)
      chartArea.drawLine("white", -5, h+1, chartArea.width, h+1) 
      
      chartArea.printText(kmhMax - i, -20, h+4 , "black", "14px Arial", "center")
    }else{
      chartArea.drawLine("lightgrey" , -5, h  , chartArea.width, h)
    }
  }
  chartArea.printText("Km/h", -50, chartArea.height/2, "black", "14px Arial", "center")
  

  // ***** Kante nochmal schwarz nachzeichnen
  chartArea.forEachX(function(x, xPercent){
    var bft = bftMax * Math.pow(xPercent, 1.0)
    var kmh = Math.min(bft_to_kmh(bft), kmhMax)
    var yPercent = kmh / kmhMax
    
    chartArea.drawLine("black", x, h - yPercent * h, x, h - yPercent * h -1)
  });
  
  // ***** title
  total.printText("Windgeschwindigkeiten", total.width / 2, 30, "black", "24px Arial", "center")
    
  // ***** outer square
  var c = "black"
  chartArea.drawLine(c, 0, 0, 0, chartArea.height)
  chartArea.drawLine(c, 0, 0, chartArea.width, 0)
  chartArea.drawLine(c, chartArea.width, 0, chartArea.width, chartArea.height)
  chartArea.drawLine(c, 0, chartArea.height, chartArea.width, chartArea.height)
   
  
  
  
  ctx.stroke()
  
