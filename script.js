/**
 * Start of variables
 */

const gridContainer     = document.getElementById("grid");

const type_pen          = "pen";
const type_colorfill    = "colorfill";
const type_eraser       = "eraser";
const type_colorpicker  = "colorpicker";
const type_rainbow      = "rainbow";
const type_lighten      = "lighten";
const type_darken       = "darken";

const adjustColorAmount = 0.25;

var slider = document.getElementById("slider");
var sliderText = document.getElementById("sliderText");

var showGridBtn = document.getElementById("showgridBtn");
var resetBtn = document.getElementById("resetBtn");
var isShowGrid = true;
var isResetGrid = false;

var penColorInput = document.getElementById("penColor");
var bgColorInput = document.getElementById("bgColor");

// Initial value of grid squares.
var resetSquares = 8;
var squares = 8;
var currentPenColor = "#1d72df";
var currentBGColor = "#2a194a";


var buttonObj = [
  {
    name: "penBtn",
    state: true,
    type: type_pen,
  },
  {
    name: "colorfillBtn",
    state: false,
    type: type_colorfill,
  },
  {
    name: "eraserBtn",
    state: false,
    type: type_eraser,
  },
  {
    name: "colorpickBtn",
    state: false,
    type: type_colorpicker,
  },
  {
    name: "rainbowBtn",
    state: false,
    type: type_rainbow,
  },
  {
    name: "lightenBtn",
    state: false,
    type: type_lighten,
  },
  {
    name: "darkenBtn",
    state: false,
    type: type_darken,
  },
]

/**
 * End of variables
 * ------------------------------------------------------------------------------------------------------------
 */

// On first page load create initial grids
window.addEventListener("load", () => {
  CreateGrids();
  ButtonEventListeners();
  penColorInput.value = currentPenColor;
  bgColorInput.value = currentBGColor;
  gridContainer.style.backgroundColor = currentBGColor;
});

/**
 * ----------------------------------------------------------------------------------------------------
 * BUTTON EVENT 
 * ----------------------------------------------------------------------------------------------------
 */

function ButtonEventListeners(){
  buttonObj.forEach(obj => {
    var button = document.getElementById(obj.name);
    button.addEventListener("click", ButtonHandler, false);
  })

  showGridBtn.addEventListener("click", ShowGrid, false);
  resetBtn.addEventListener("click", ResetGrid, false);

  penColorInput.addEventListener("input", PenColorHandler, false);
  bgColorInput.addEventListener("input", bgColorHandler, false);
}

function ButtonHandler(event){
  if(event.target.id !== undefined || event.target.id !== null){
    var currentButton = GetActiveButton(event.target.id);
    var otherButtons = GetInActiveButtons(event.target.id);

    currentButton.state = !currentButton.state;
    otherButtons.forEach(button => { if(button.state) button.state = !button.state; });

    if(currentButton.state === false){
      buttonObj[0].state = true;
    }

    ToggleButtons(currentButton.name);
  }
}

function ToggleButtons(buttonName){
  var activeButton = GetActiveButton(buttonName);
  var inactiveButton = GetInActiveButtons(buttonName);

  ToggleButtonClass(activeButton.name, activeButton.state);

  inactiveButton.forEach(button => {
    ToggleButtonClass(button.name, button.state);
  });
}

function ToggleButtonClass(buttonName, buttonState){
  var button = document.getElementById(buttonName);
  if(buttonState){
    button.classList.add("icon-button-on");
  }
  else{
    button.classList.remove("icon-button-on");
  }
}

function GetActiveButton(buttonName){
  return buttonObj.filter(element => element.name === buttonName).pop();
}

function GetInActiveButtons(buttonName){
  return buttonObj.filter(element => element.name !== buttonName);
}

function GetCurrentButton(){
  return buttonObj.filter(element => element.state === true).pop();
}
/**
 * ----------------------------------------------------------------------------------------------------
 * DRAW EVENT 
 * ----------------------------------------------------------------------------------------------------
 */

function CreateGrids(){
  // Reset grids 
  // gridContainer.innerHTML = "";  // Old version
  gridContainer.replaceChildren();   // New version

  gridContainer.style.gridTemplateRows = `repeat(${squares}, 10fr)`;
  gridContainer.style.gridTemplateColumns = `repeat(${squares}, 10fr)`;

  for (let i = 0; i < squares * squares; i++) {
    let square = document.createElement('div');
    square.classList.add('square');
    square.id = i;
    gridContainer.appendChild(square);

    // Click event for individual pixel placement
    square.addEventListener("mousedown", DrawHandler, false);
    // Mouse move and click event to keep drawing while clicking and moving    
    square.addEventListener("mouseenter", DrawHandler, false);
  }
}

/**
 * Handles mouse events for drawing on grid
 */
function DrawHandler(event){
  // console.log("Event : " + event.which + " " + event.type + " " + event.target.id)
  var currentButton = GetCurrentButton();
  if(currentButton.type === type_pen){
    // if(event.type === 'mouseenter' && event.which === 1) -- event.which deprecated // not working in firefox
    if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 0)){
      Draw(event.target.id);
    }
    else if(event.type === 'mousedown'){
      Draw(event.target.id);
    }
  }
  else if(currentButton.type === type_colorfill){
    if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 0)){
      ColorFill(event);
    }
    else if(event.type === 'mousedown'){
      ColorFill(event);
    }
  }
  else if(currentButton.type === type_eraser){
    if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 0)){
      Erase(event.target.id);
    }
    else if(event.type === 'mousedown'){
      Erase(event.target.id);
    }
  }
  else if(currentButton.type === type_colorpicker){
   if(event.type === 'mousedown'){
      ColorPicker(event.target.id);
    }
  }
  else if(currentButton.type === type_rainbow){
    if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 0)){
      RainbowDraw(event.target.id);
    }
    else if(event.type === 'mousedown'){
      RainbowDraw(event.target.id);
    }
  }
  else if(currentButton.type === type_lighten){
    if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 0)){
      LightenSquare(event.target.id);
    }
    else if(event.type === 'mousedown'){
      LightenSquare(event.target.id);
    }
  }
  else if(currentButton.type === type_darken){
    if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 0)){
      DarkenSquare(event.target.id);
    }
    else if(event.type === 'mousedown'){
      DarkenSquare(event.target.id);
    }
  }
  // else if(currentButton.type === type_darklight){
  //   /**
  //    * If mouse enter or mouse down and left click = lighten square
  //    * If mouse enter or mouse down and right click = darken square
  //    */
  //   if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 0)){
  //     LightenSquare(event.target.id);
  //   }
  //   else if(event.type === 'mousedown' && (event.buttons == 1 && event.button == 0)){
  //     LightenSquare(event.target.id);
  //   }
  //   else if(event.type === 'mouseenter' && (event.buttons == 1 && event.button == 2)){
  //     DarkenSquare(event.target.id);
  //   }
  //   else if(event.type === 'mousedown' && (event.buttons == 1 && event.button == 2)){
  //     DarkenSquare(event.target.id);
  //   }
  // }
  else{
    return;
  }
}

/**
 * Handle pen color based on color change
 */

function PenColorHandler(event){
  currentPenColor = penColorInput.value;
}

function bgColorHandler(event){
  currentBGColor = bgColorInput.value;
  gridContainer.style.backgroundColor = currentBGColor;
}

function Draw(squareId){
  var square = document.getElementById(squareId);
  square.style.backgroundColor = currentPenColor;
}

/**
 * ----------------------------------------------------------------------------------------------------
 * COLOR FILL EVENT 
 * ----------------------------------------------------------------------------------------------------
 */

function ColorFill(event){

  var children = gridContainer.childNodes;
  
  var array2D = Populate2DArray(children);
  var selectedBGColor = RGBtoHEX(document.getElementById(event.target.id).style.backgroundColor);

  var values = GetRowAndCol(children, event.target.id);
  var row = values.row;
  var col = values.col;

  FillSquares(array2D, row, col, currentPenColor, selectedBGColor);
  // console.log(currentPenColor + " " + selectedBGColor)

  console.log(array2D)
  // console.log("Pen :" + currentPenColor + " " + " bg : " + selectedBGColor )
  var nodes = Array.from(children);
  var flattendArray = [].concat(...array2D);
  for(let i = 0; i < flattendArray.length; i++){
    nodes[i].style.backgroundColor = flattendArray[i];
  }
}

/**
 * populates array with fill 
 * https://www.wikiwand.com/en/Flood_fill
 */
function FillSquares(array2D, row, col, newColor, currentColor)
{
    if (!IsValidSquares(array2D, row, col, currentColor))
        return;
        
    if (array2D[row][col] == newColor)
        return;
    
    array2D[row][col] = newColor;
    FillSquares(array2D, row + 1, col, newColor, currentColor);
    FillSquares(array2D, row - 1, col, newColor, currentColor);
    FillSquares(array2D, row, col + 1, newColor, currentColor );
    FillSquares(array2D, row, col -1, newColor, currentColor );
}

function IsValidSquares(array2D, row, col, currentColor)
{
  return (row >= 0 && row < array2D.length && col >= 0 && col < array2D[row].length && array2D[row][col] == currentColor);
}

/**
 * converts color to hex format
 */
function RGBtoHEX(color) {  
  if(color == "" || color === undefined) return "";
  return (
    '#' +
    color
      .match(/\b(\d+)\b/g)
      .map(function (digit) {
        return ('0' + parseInt(digit).toString(16)).slice(-2)
      })
      .join('')
  )
};

/**
 * converts 1D array to 2D array
 */
function Create2DArray(nodes){
  var array1D = Array.from(nodes)
  var newArray = [];
  while(array1D.length) newArray.push(array1D.splice(0,squares));
  return newArray;
}

/**
 * gets the row and column index of click event based on grid square
 */
function GetRowAndCol(nodes, indexToFind){
  newArray = Create2DArray(nodes);
  var row = -1;
  var col = -1;
  for(let i = 0; i < newArray.length; i++){
    col = newArray[i].findIndex(item => item.id == indexToFind);
    if(col !== -1){
      row = i;
      break;
    }
  }
  return {"row": row, "col": col};
}

/**
 * populates array based with colors to later fill the main grid
 */
function Populate2DArray(nodes){
  newArray = Create2DArray(nodes);
  for(let i = 0; i < newArray.length; i++){
    for(let j = 0; j < newArray.length; j++){
      if(newArray[i][j].style.backgroundColor !== "") {
        newArray[i][j] = RGBtoHEX(newArray[i][j].style.backgroundColor);
      }
      else{
        newArray[i][j] = "";
      }
    }
  }
  return newArray;
}

/**
 * ----------------------------------------------------------------------------------------------------
 * ERASE EVENT 
 * ----------------------------------------------------------------------------------------------------
 */

function Erase(squareId){
  var square = document.getElementById(squareId);
  square.style.backgroundColor = "";
}

/**
 * ----------------------------------------------------------------------------------------------------
 * COLOR PICK EVENT 
 * ----------------------------------------------------------------------------------------------------
 */

function ColorPicker(squareId){
  var square = document.getElementById(squareId);
  currentPenColor = window.getComputedStyle(square).backgroundColor;
  penColorInput.value = RGBtoHEX(currentPenColor);
}

/**
 * ----------------------------------------------------------------------------------------------------
 * RAINBOW MODE EVENT 
 * ----------------------------------------------------------------------------------------------------
 */

function RainbowDraw(squareId){
  var square = document.getElementById(squareId);
  var color = '#' + Math.floor(Math.random() * (256 * 256 * 256)).toString(16).padStart(6, '0');
  square.style.backgroundColor = color;
}

/**
 * ----------------------------------------------------------------------------------------------------
 * DARKEN / LIGHTEN EVENT 
 * ----------------------------------------------------------------------------------------------------
 */

function LightenSquare(squareId){
  var square = document.getElementById(squareId);
  var color = window.getComputedStyle(square).backgroundColor;
  square.style.backgroundColor = ShadeColor(color, adjustColorAmount);
}

function DarkenSquare(squareId){
  var square = document.getElementById(squareId);
  var color = window.getComputedStyle(square).backgroundColor;
  square.style.backgroundColor = ShadeColor(color, -adjustColorAmount);
}

function ShadeColor(color, percent){
  if (color.length > 7 ) return shadeRGBColor(color,percent);
  else return shadeHexColor(color,percent);
}

function shadeRGBColor(color, percent) {
  var f=color.split(","),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=parseInt(f[0].slice(4)),G=parseInt(f[1]),B=parseInt(f[2]);
  return "rgb("+(Math.round((t-R)*p)+R)+","+(Math.round((t-G)*p)+G)+","+(Math.round((t-B)*p)+B)+")";
}

function shadeHexColor(color, percent) {
  var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

/**
 * ----------------------------------------------------------------------------------------------------
 * GRID UPDATE  
 * ----------------------------------------------------------------------------------------------------
 */

/**
 * If slider value changed then set squares to new value and update span text for user
 * call RedrawSquares()
 */
function GridUpdate(){
  squares = slider.value;
  sliderText.innerHTML = squares + " x " + squares + " Grid";
  CreateGrids();
  isShowGrid = true;
}

/**
 * ----------------------------------------------------------------------------------------------------
 * SHOW GRID  
 * ----------------------------------------------------------------------------------------------------
 */

/**
 * Toggles grid lines on and off
 */
function ShowGrid(){ 
  isShowGrid = !isShowGrid;

  var childern = gridContainer.childNodes;
  
  childern.forEach(square => {
    if(isShowGrid){
      square.style.border = "1px solid rgb(66, 66, 66)";
    }
    else{
      square.style.border = 'none';
    }
  });
}

/**
 * ----------------------------------------------------------------------------------------------------
 * RESET GRID  
 * ----------------------------------------------------------------------------------------------------
 */

/**
 * When reset button clicked remove all active css
 * using a fade out - reducing opacity from 1 to 0 then removing opacity class
 */
function ResetGrid(){
  var childern = gridContainer.childNodes;
  if(!isResetGrid){
    isResetGrid = true;
    opacityRate = FadeoutOpacityRate();
    childern.forEach(square => {
      FadeOut(square, opacityRate);
    });
  }
}

function FadeoutOpacityRate(){
  if(squares * squares <= 100){
    return 0.25;
  }
  else if(squares * squares <= 400){
    return 0.35;
  }
  else if(squares * squares <= 900){
    return 0.45;
  }
  else if(squares * squares <= 1600){
    return 0.65;
  }
  else if(squares * squares <= 2500){
    return 0.90;
  }
  else if(squares * squares <= 6400){
    return 0.95;
  }
}

function FadeOut(element, opacityRate) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
      if (op <= 0.1){
          clearInterval(timer);
          element.style.backgroundColor = ""
          if(parseInt(element.id) === squares * squares - 1){
            isResetGrid = false;
          }
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      // op -= op * .90;
      op -= op * opacityRate;
      if(element.style.backgroundColor === ""){
        element.style.removeProperty("opacity")
      }
  }, 25);
}

/**
 * Help Modal
 */

const modal = document.getElementById("modal-help");
const trigger = document.querySelector(".trigger-help");
const closeButton = document.getElementById("modal-help-close");

function toggleModal() {
    modal.classList.toggle("show-modal");
}

function windowOnClick(event) {
    if (event.target === modal) {
        toggleModal();
    }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

