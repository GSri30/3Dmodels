function downloadCanvas(doc, canvasId){    
    var canvas = doc.getElementById(canvasId);
    var image = canvas.toDataURL();  
    
    var tmpLink = doc.createElement( 'a' );  
    tmpLink.download = '3Dmodels.png';
    tmpLink.href = image;  
  
    doc.body.appendChild( tmpLink );  
    tmpLink.click();  
    doc.body.removeChild( tmpLink );  
}

export {
    downloadCanvas,
}