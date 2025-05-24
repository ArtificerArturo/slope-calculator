function calculateSlope() {
   let x1 = document.querySelector("#slopeCalculator #x1Input").value
   let y1 = document.querySelector("#slopeCalculator #y1Input").value
   let x2 = document.querySelector("#slopeCalculator #x2Input").value
   let y2 = document.querySelector("#slopeCalculator #y2Input").value

   let leftXBound = 0
   let rightXBound = 0
   let topYBound = 0
   let bottomYBound = 0

   const zoomPercent = 1.5

   if (x1 <= x2) {
      leftXBound = x1 * zoomPercent
      rightXBound = x2 * zoomPercent
   } else {
      leftXBound = x2 * zoomPercent
      rightXBound = x1 * zoomPercent
   }
   if (y1 <= y2) {
      bottomYBound = y1 * zoomPercent
      topYBound = y2 * zoomPercent
   } else {
      bottomYBound = y2 * zoomPercent
      topYBound = y1 * zoomPercent
   }

   var b = JXG.JSXGraph.initBoard("jxgbox", {
      boundingbox: [leftXBound, topYBound, rightXBound, bottomYBound],
      axis: true,
   })
   var p1 = b.create("point", [x1, y1], { name: "A", size: 4 })
   var p2 = b.create("point", [x2, y2], { name: "B", size: 4 })
   var li = b.create("line", ["A", "B"], { strokeColor: "#000000", strokeWidth: 1 })
}
