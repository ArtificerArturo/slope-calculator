document.addEventListener("DOMContentLoaded", function () {
   let board = JXG.JSXGraph.initBoard("jxgbox", { boundingbox: [-7, 10, 10, -7], axis: true, showCopyright: false })
   let p1 = board.create("point", [-5, 5], { name: "A", size: 3, strokeColor: "#fc0", fillColor: "#fc0" })
   let p2 = board.create("point", [7, -3], { name: "B", size: 3, strokeColor: "#fc0", fillColor: "#fc0" })
   let li = board.create("line", ["A", "B"], { strokeColor: "#000000", strokeWidth: 1 })
})

function calculateSlope() {
   let x1 = document.querySelector("#slopeCalculator #x1Input").value
   let y1 = document.querySelector("#slopeCalculator #y1Input").value
   let x2 = document.querySelector("#slopeCalculator #x2Input").value
   let y2 = document.querySelector("#slopeCalculator #y2Input").value
   let topResultDiv = document.querySelector("#slopeCalculator .topResult")
   let resultDiv = document.querySelector("#slopeCalculator .result")

   //exit if any values not filled in
   if (x1 == "" || y1 == "" || x2 == "" || y2 == "") {
      return
   }

   //remove previous results
   if (document.querySelector("#slopeCalculator .topResult")) {
      topResultDiv.innerHTML = ""
   }
   if (document.querySelector("#slopeCalculator .topDecimalResult")) {
      document.querySelector("#slopeCalculator .topDecimalResult").remove()
   }
   if (document.querySelector("#slopeCalculator .result")) {
      resultDiv.innerHTML = ""
   }

   //determine best graph bounds
   let xMin = Math.min(x1, x2)
   let xMax = Math.max(x1, x2)
   let yMin = Math.min(y1, y2)
   let yMax = Math.max(y1, y2)

   let width = xMax - xMin
   let height = yMax - yMin

   const margin = 0.7
   let xMargin = margin * width + 1
   let yMargin = margin * height + 1

   let leftXBound = xMin - xMargin
   let rightXBound = xMax + xMargin
   let bottomYBound = yMin - yMargin
   let topYBound = yMax + yMargin

   if (leftXBound > 0) leftXBound = xMargin * -1
   if (rightXBound < 0) rightXBound = xMargin
   if (bottomYBound > 0) bottomYBound = yMargin * -1
   if (topYBound < 0) topYBound = yMargin

   //draw graph
   let board = JXG.JSXGraph.initBoard("jxgbox", {
      boundingbox: [leftXBound, topYBound, rightXBound, bottomYBound],
      axis: true,
      showCopyright: false,
   })
   let p1 = board.create("point", [x1, y1], { name: "A", size: 3, strokeColor: "#fc0", fillColor: "#fc0" })
   let p2 = board.create("point", [x2, y2], { name: "B", size: 3, strokeColor: "#fc0", fillColor: "#fc0" })
   let li = board.create("line", ["A", "B"], { strokeColor: "#000000", strokeWidth: 1 })

   let xDiff = x2 - x1
   let yDiff = y2 - y1
   let slope = yDiff / xDiff
   let finalSimplification = ""
   let topDecimalResult = document.createElement("div")
   topDecimalResult.setAttribute("class", "topDecimal")

   //take care of infinity edge case
   if (slope == Infinity) {
      topResultDiv.innerHTML = `<math><mi mathvariant="normal">Slope</mi><mo>&#xA0;</mo><mi>m</mi><mo>=</mo><mi mathvariant="normal">infinity</mi></math>`
      resultDiv.innerHTML = `<math><mi mathvariant="normal">Slope</mi><mo>=</mo><mfrac><mrow><msub><mi>y</mi><mn>2</mn></msub><mo>-</mo><msub><mi>y</mi><mn>1</mn></msub></mrow><mrow><msub><mi>x</mi><mn>2</mn></msub><mo>-</mo><msub><mi>x</mi><mn>1</mn></msub></mrow></mfrac><mo>=</mo><mfrac><mrow><mn>${y2}</mn><mo>-</mo><mn>${y1}</mn></mrow><mrow><mn>${x2}</mn><mo>-</mo><mn>${x1}</mn></mrow></mfrac><mo>=</mo><mfrac><mn>${resultConditioner(
         yDiff
      )}</mn><mn>${resultConditioner(xDiff)}</mn></mfrac><mo>=</mo><mi mathvariant="normal">infinity</mi></math>`
      MathJax.typesetPromise()
      return
   }

   //if there are no decimal inputs, calculate fractional slope
   if (Number.isInteger(xDiff) && Number.isInteger(yDiff)) {
      slope = math.fraction(yDiff, xDiff)

      if (slope.s == -1) slopeSign = `<mo>-</mo>`
      else slopeSign = ``

      //special case where the fraction result is a whole number
      if (slope.d == 1) {
         slopeFraction = `${slopeSign}<mn>${slope.n}</mn>`
         topResultDiv.innerHTML = `<math><mi mathvariant="normal">Slope</mi><mo>&#xA0;</mo><mi>m</mi><mo>=</mo>${slopeFraction}</math>`
         finalSimplification = `<mo>=</mo>${slopeFraction}`

         //main case where we want both fraction and decimal slope
      } else {
         slopeFraction = `<mfrac><mrow>${slopeSign}<mn>${slope.n}</mn></mrow><mn>${slope.d}</mn></mfrac>`
         topResultDiv.innerHTML = `<math><mi mathvariant="normal">Slope</mi><mo>&#xA0;</mo><mi>m</mi><mo>=</mo>${slopeFraction}</math>`
         topDecimalResult.innerHTML = `<math><mi>m</mi><mo>=</mo><mn>${resultConditioner(
            math.number(slope)
         )}</mn></math>`
         topResultDiv.appendChild(topDecimalResult)
         if (slope.n == yDiff && slope.d == xDiff) {
         } else {
            finalSimplification = `<mo>=</mo>${slopeFraction}`
         }
      }
      //case where we just want a decimal slope
   } else {
      topDecimalResult.innerHTML = `<math><mi mathvariant="normal">Slope</mi><mo>&#xA0;</mo><mi>m</mi><mo>=</mo><mn>${resultConditioner(
         math.number(slope)
      )}</mn></math>`
      topResultDiv.appendChild(topDecimalResult)
      finalSimplification = `<mo>=</mo><mn>${resultConditioner(math.number(slope))}</mn>`
   }

   resultDiv.innerHTML = `<math><mi mathvariant="normal">Slope</mi><mo>=</mo><mfrac><mrow><msub><mi>y</mi><mn>2</mn></msub><mo>-</mo><msub><mi>y</mi><mn>1</mn></msub></mrow><mrow><msub><mi>x</mi><mn>2</mn></msub><mo>-</mo><msub><mi>x</mi><mn>1</mn></msub></mrow></mfrac><mo>=</mo><mfrac><mrow><mn>${y2}</mn><mo>-</mo><mn>${y1}</mn></mrow><mrow><mn>${x2}</mn><mo>-</mo><mn>${x1}</mn></mrow></mfrac><mo>=</mo><mfrac><mn>${resultConditioner(
      yDiff
   )}</mn><mn>${resultConditioner(xDiff)}</mn></mfrac>${finalSimplification}</math>`
   MathJax.typesetPromise()
}

function resultConditioner(result) {
   //Intelligent rounding. Results with only decimal component need sig figs,
   //results greater than 1 do not
   if (result < 1 && result > -1) {
      result = numberWithCommas(+result.toPrecision(2))
   } else {
      result = numberWithCommas(+result.toFixed(2))
   }
   return result
}

function numberWithCommas(number) {
   //taken from SO. Worked better than .toLocaleString()
   return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
}
