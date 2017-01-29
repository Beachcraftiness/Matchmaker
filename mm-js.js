/*

Global variables

*/

/* Indicates which image index corresponds to each tile. 
Undefined values indicate that the tile has not yet been
assigned an image/matching tile. */
var g_TileMatches = new ArrayPartialFill(); 

/* Indicates which images have been assigned to tile pairs */
var g_ImagesUsed = new ArrayPartialFill();

// The total number of tiles on the game board
var g_NumTotalTiles = 0;
var g_NumTilesRevealed = 0;
var g_TileShown1 = -1;
var g_TileShown2 = -1;
var g_TileEnabled = true;

// Initial counts of how many times the user chose incorrectly
var g_NumFailedMatches = 0;


/* 

Initialization

*/
// Set the initial game board based on default selected size
(function initializeTable() { 
	try {
		clearStatusMessage();
		changeBoardSize();
	}
	catch(e)  {
		displayError("Oops! Something went wrong and the game board couldn't be initialized.");
	}
})();


/*

Event handlers

*/

/* Creates the board from scratch based on the board size selected */
function changeBoardSize() {
	try {
		clearStatusMessage();
		var selectedBoardSize = parseInt(document.getElementById(ELEMENT_ID_SIZE_SELECT).value);
		buildGameboard(Math.floor(selectedBoardSize/10), (selectedBoardSize % 10));
		g_TileEnabled = true;
	}
	catch(e)  {
		displayError("Oops! Something went wrong and the board couldn't be resized.");
		console.log("ERROR in changeBoardSize: " + e);
		// If we couldn't build the board properly, clear it completely
		try { clearBoard(); }
		catch (e) { }
	}
}

/* Handles user revealing tile with number tileNum */
function onClickHiddenImage(tileNum) {
	try {
		clearStatusMessage();
		if (g_TileEnabled) {
			console.log("Showing image", tileNum);
			
			setTileDisplay(tileNum, TILE_DISPLAY_MODE.SHOWN);
			
			if (g_TileShown1 >= 0) {
				g_TileShown2 = tileNum;
				console.log("The tile " + g_TileShown1 + " was already showing and now we're showing " + g_TileShown2);
				/* This is the second tile to be revealed. 
				Does it match the other one that is revealed? */
				var thisItemImg = g_TileMatches.getItem(g_TileShown2);
				var otherItemImg = g_TileMatches.getItem(g_TileShown1);
				if (thisItemImg == otherItemImg) {
					// Match! Success!
					handleMatchSuccess();
				}
				else {
					// No match. Fail :(
					handleMatchFail();
				}
			}
			else {
				/* This is the first tile to be revealed.
				Remember it for later. */
				console.log("A tile was NOT already showing");
				g_TileShown1 = tileNum;
			}
		}
	}
	catch (e) {
		console.log("ERROR in onClickHiddenImage: " + e);
		displayError("Oops! An error occurred trying to show that tile");
	}
}

/* Hides the game over modal */
function hideGameOverModal() {
	var modal = document.getElementById(ELEMENT_ID_GAME_OVER_MODAL);
	if (modal != null) {
		modal.style.display = "none";
	}
}

/* 

Helper functions 

*/

/* Gets a random number between min and max inclusive.
Throws exception if max < min */
function getRandomIntInclusive(min, max) {
	if (max < min) {
		throw "Issue getting random int: max was less than min";
	}
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Gets the index for a random tile image that hasn't been 
matched with another tile yet */
function getRandomUnusedImageInd() {
	try {
		var relativeInd = getRandomIntInclusive(
			0, TILE_IMAGE_PATHS.length - g_ImagesUsed.getNumberOfValuesSet() - 1);
		var realInd = -1;
		while (relativeInd >= 0) {
			realInd++;
			// Decrement relativeInd when we find an unused image
			if (!g_ImagesUsed.hasValue(realInd)) {
				relativeInd--;
			}
		}
		g_ImagesUsed.setItem(realInd, true);
		return realInd;
	}
	catch (e) {
		console.log("ERROR getting unused image:", e);
		throw e;
	}
}

/* Finds an unset tile and gives it the given image index */ 
function findAndSetTileMatch(imgIdInd) {
	try {
		// Get a random tile to match with this tile and assign that tile the same image
		var relativeInd = getRandomIntInclusive(
			0, g_NumTotalTiles - g_TileMatches.getNumberOfValuesSet() - 1);
		var realInd = -1;
		var foundMatch = true;
		while (relativeInd >= 0 && realInd < g_NumTotalTiles) {
			realInd++;
			if (realInd == g_NumTotalTiles) {
				foundMatch = false;
				break;
			}
			// Decrement relativeInd when we find an unused image
			if (!g_TileMatches.hasValue(realInd)) {
				relativeInd--;
			}
		}
		
		if (foundMatch){
			g_TileMatches.setItem(realInd, imgIdInd);
			console.log("Assigned tile", realInd, "the image id", imgIdInd, 
						". Total matched =", g_TileMatches.getNumberOfValuesSet());
		}
		else {
			// This should not happen
			throw ("ERROR: Could not find match for tile" + tileNum);
		}
	}
	catch (e) {
		console.log("ERROR creating tile match:", e);
		throw e;
	}
}

/* Builds the gameboard anew based on what board size is selected */
function buildGameboard(tableWidth, tableHeight) {
	try {
		// Clear our previous game board
		clearBoard();
		
		if (tableWidth == null || tableHeight == null) {
			displayError("Hmm...could not figure out what the table width and height should have been. Set game board to default size.");
			tableWidth = DEFAULT_TABLE_WIDTH;
			tableHeight = DEFAULT_TABLE_HEIGHT;
		}
		
		/* Tile size is based on number of tiles. 
		Size adjusts based on width of window */
		var tileSize = ((100-(tableWidth+1)) / tableWidth) + "%";	
		var imgIdInd;
		
		var gameBoard = document.getElementById(ELEMENT_ID_GAME_BOARD);
		if (gameBoard == null) {
			throw "Could not find game board";
		}
		else {
			g_NumTotalTiles = tableWidth * tableHeight;
			
			// Create each tile, setting the image of one of the other tiles to match
			for (let tileNum = 0; tileNum < g_NumTotalTiles; tileNum++){
				
				// Figure out which image to use for the tile
				if (g_TileMatches.hasValue(tileNum)) {
					// This tile already has a match. Use the image ID already IDed for it
					imgIdInd = g_TileMatches.getItem(tileNum);
				}
				else {
					// Need to assign the matching tile and determine the image ID for both
					imgIdInd = getRandomUnusedImageInd();
					
					// Remember which image this tile has
					g_TileMatches.setItem(tileNum, imgIdInd);
					console.log("Assigned tile", tileNum, "the image id", imgIdInd, 
						". Total matched =", g_TileMatches.getNumberOfValuesSet());
		
					// Assign another tile the same image
					findAndSetTileMatch(imgIdInd);
				}
				
				var tile = createTile(tileNum, tileSize, TILE_IMAGE_PATHS[imgIdInd]);
				if (tile == null)  {
					throw "Failed to create tile";
				}
				else {
					gameBoard.appendChild(tile);
				}
			}
			
			console.log("-------FINAL MATCHES-------");
			g_TileMatches.printValues();
		}
	}
	catch(e) {
		console.log("ERROR caught in buildGameboard:", e);
		displayError("Oops! Something went wrong trying to put together the game board!");
	}
}

/* Clears the gameboard and all variables keeping track of the game status */
function clearBoard() {
	console.log("Clearing the board");
	try {
		// Reset all status values
		g_TileShown1 = -1;
		g_TileShown2 = -1;
		g_NumTotalTiles = 0;
		g_NumTilesRevealed = 0;
		g_NumFailedMatches = 0;
		g_TileMatches.clearList();
		g_ImagesUsed.clearList();
		
		// Clear the tiles from the board
		var gameBoard = document.getElementById(ELEMENT_ID_GAME_BOARD);
		while (gameBoard.firstChild) {
			gameBoard.removeChild(gameBoard.firstChild);
		}
				
		// Clear the guess results from the status area
		var failureIconsArea = document.getElementById(ELEMENT_ID_FAILURE_ICONS_AREA);
		while (failureIconsArea.firstChild) {
			failureIconsArea.removeChild(failureIconsArea.firstChild);
		}
	}
	catch (e) {
		throw ("ERROR in clearBoard: " + e);
	}
}

/* Creates and returns the element that represents the entire game tile 
tileNum: the unique number of the tile
tileSize: the width and height of the tile (string, includes units)
tileImgPath: the path of the image file to use for the "front" of this tile */ 
function createTile(tileNum, tileSize, tileImgPath) {
	try {
		// Create all elements of the tile
		var tileDiv = document.createElement("div");
		var tileContents = document.createElement("div");
		var tileForm = document.createElement("div");
		var tileImgContainer = document.createElement("div");
		var tileFrontImg = document.createElement("img");
		var tileBackImg = document.createElement("img");
		
		// Set the outer square properties based on size parameters
		tileDiv.className = CLASS_NAME_TILE_CONTAINER;
		tileDiv.style.width = tileSize;
		tileDiv.style.paddingBottom = tileSize;
		tileDiv.style.margin = TILE_MARGIN;
		
		// Set the classes of the other divs within the outer square
		tileContents.className = CLASS_NAME_TILE_CONTENTS;
		tileForm.className = CLASS_NAME_TILE_FORM;
		tileImgContainer.className = CLASS_NAME_TILE_IMG_CONTAINER;
		
		// Set the properties of the image for the revealed item on the tile
		tileFrontImg.src = tileImgPath;
		tileFrontImg.className = CLASS_NAME_TILE_IMAGE;
		tileFrontImg.id = getTileImgID(tileNum, TILE_DISPLAY_MODE.SHOWN);
		tileFrontImg.style.display = "none";
		
		// Set the properties of the image for the back of the tile
		tileBackImg.src = IMG_PATH_TILE_BACK;
		tileBackImg.className = CLASS_NAME_TILE_IMAGE;
		tileBackImg.style.display = "block";
		tileBackImg.id = getTileImgID(tileNum, TILE_DISPLAY_MODE.HIDDEN);
		tileBackImg.onclick = function () { onClickHiddenImage(tileNum); };
		
		// Nest all the elements
		tileImgContainer.appendChild(tileFrontImg);
		tileImgContainer.appendChild(tileBackImg);
		tileForm.appendChild(tileImgContainer);
		tileContents.appendChild(tileForm);
		tileDiv.appendChild(tileContents);
		return tileDiv;
	}
	catch (e) {
		console.log("ERROR in createTile: " + e);
		throw e;
	}
}

/* Gets the ID for the image of the tile with the given number 
tileNum: the unique number of the tile
tileDisplayMode: the current display mode of the tile 
	(determines whether to return the front or back image for the tile) */
function getTileImgID(tileNum, tileDisplayMode) {
	switch (tileDisplayMode) {
		case TILE_DISPLAY_MODE.SHOWN: 
		case TILE_DISPLAY_MODE.MATCHED: return IMG_ID_SHOWN + tileNum;
		case TILE_DISPLAY_MODE.HIDDEN: 
		default: 
			return IMG_ID_HIDDEN + tileNum;
	}
}

/* Clears any status or error messages from previous actions */
function clearStatusMessage() {
	var errArea = document.getElementById(ELEMENT_ID_STATUS_MSG);
	if (errArea != null) {
		errArea.innerHTML = "&nbsp;";
	}
	else { 
		console.log("Problem in clearStatusMessage: could not find errArea");
	}
}

/* Displays the given error message in the status area */
function displayError(msg) {
	displayMessageOrErr(msg, true);
}

/* Displays the given (non-error) message in the status area */
function displayMessage(msg) {
	displayMessageOrErr(msg, false);
}

/* Sets the message in the status area to the given message with 
either the error style or the status style depending on param isErr */
function displayMessageOrErr(msg, isErr){
	var msgArea = document.getElementById(ELEMENT_ID_STATUS_MSG);
	if (msgArea != null) {
		msgArea.innerHTML = msg;
		//msgArea.style.display = "block";
		if (isErr) {
			msgArea.className = "errText";
			console.log("Setting message class to errText");
		}
		else {
			msgArea.className = "statusText";
			console.log("Setting message class to statusText");
		}
	}
	else { 
		console.log("Problem in displayMessageOrErr: Could not find msgArea");
	}
}

/* Update the display of the current count of mismatches */
function updateFailureCountDisplay() {
	var failureImg = document.createElement("img");
	if (failureImg == null) {
		console.log("ERROR: There was a problem creating the successful guess icon");
	}
	else {
		var failureIconArea = document.getElementById(ELEMENT_ID_FAILURE_ICONS_AREA);
		if (failureIconArea == null) {
			console.log("ERROR: Could not find the failureIcons area");
		}
		else {
			failureIconArea.innerHTML = "";
			for (let i = 0; i < g_NumFailedMatches; i++) {
				failureIconArea.innerHTML += "X ";
			}
		}
	}
}

/* Handle when the user guessed right and found a match */
function handleMatchSuccess() {
	console.log("Success! Tiles " + g_TileShown1 + " and " + g_TileShown2 + " are a match!");
	// Display success message
	displayMessage("It's a match!");
	
	// These two tile will add to the total revealed
	g_NumTilesRevealed += 2;
	if (g_NumTilesRevealed == g_NumTotalTiles) {
		gameOver();
	}
	else {
		// Delay a second or two then change both tiles to show 'already matched' image
		disableTilesForTime(1000, g_TileShown1, g_TileShown2, TILE_DISPLAY_MODE.MATCHED);
	}
}

/* Handle when the user just guessed wrong */
function handleMatchFail() {
	console.log("Fail :( Tiles " + g_TileShown1 + " and " + g_TileShown2 + " are not a match!");
	// Display fail message
	displayMessage("Not a match");
	
	// Increase number of flame-outs
	g_NumFailedMatches++;
	updateFailureCountDisplay();
	
	// Delay a second or two then flip both tiles back to covered
	disableTilesForTime(1000, g_TileShown1, g_TileShown2, TILE_DISPLAY_MODE.HIDDEN);
}

/* Make tiles unclickable for the given delay (ms), then set the 
tiles tileNum1 and tileNum2 to the given display mode 
(and make the unmatched tiles clickable again) */
function disableTilesForTime(delay, tileNum1, tileNum2, tileDisplayModeAfter) {
	g_TileEnabled = false;
	console.log("Starting time delay");
	setTimeout(function () { resetTiles(tileNum1, tileNum2, tileDisplayModeAfter); }, delay);
}

/* Updates the tile with number tileNum to display the appropriate image 
for a hidden, matched, or unmatched tile (as specificed by tileDisplayMode) */
function setTileDisplay(tileNum, tileDisplayMode) {
	var shownImg = document.getElementById(getTileImgID(tileNum, TILE_DISPLAY_MODE.SHOWN));
	var hiddenImg = document.getElementById(getTileImgID(tileNum, TILE_DISPLAY_MODE.HIDDEN));
	
	if (hiddenImg == null || shownImg == null) {
		if (hiddenImg == null) { console.log("Couldn't find hiddenImg"); }
		if (shownImg == null) { console.log("Couldn't find shownImg"); }
		console.log("Couldn't find one of the tile images in setTileDisplay");
		throw "Could not find one of the tile images";
	}
	else {
		switch (tileDisplayMode) {
			case TILE_DISPLAY_MODE.SHOWN: 
				shownImg.style.display = "block";
				shownImg.className = CLASS_NAME_TILE_IMAGE;
				hiddenImg.style.display = "none";
				break;
			case TILE_DISPLAY_MODE.MATCHED: 
				shownImg.style.display = "block";
				shownImg.className = CLASS_NAME_TILE_IMAGE_MATCHED;
				hiddenImg.style.display = "none";
				break;
			case TILE_DISPLAY_MODE.HIDDEN: 
			default: 
				shownImg.style.display = "none";
				hiddenImg.style.display = "block";
		}
	}
}

/* Reset the two tiles (numbers tileNum1 and tileNum2) to the given display mode */
function resetTiles(tileNum1, tileNum2, tileDisplayMode) {
	try {
		console.log("Reseting tiles " + tileNum1 + " and " + tileNum2);
		setTileDisplay(tileNum1, tileDisplayMode);
		setTileDisplay(tileNum2, tileDisplayMode);
		g_TileShown1 = -1;
		g_TileShown2 = -1;
		g_TileEnabled = true;
	}
	catch (e) {
		displayError("Uh-oh, an error occurred! Please start over.");
		console.log("ERROR in resetTiles: " + e);
	}
}

/* Handle game over */
function gameOver() {
	displayGameOverModal();
	displayMessage("Game over - you win!");
	g_TileEnabled = false;
	for (let i = 0; i < g_NumTotalTiles; i++) {
		setTileDisplay(i, TILE_DISPLAY_MODE.SHOWN);
	}
}

/* Display the modal to announce game over */
function displayGameOverModal() {
	var misses = document.getElementById("resultsNumMisses");
	if (misses != null) {
		misses.innerHTML = g_NumFailedMatches;
	}
	else {
		console.log("ERROR: Couldn't find the number of mismatches span for game over modal");
	}
	
	var modal = document.getElementById(ELEMENT_ID_GAME_OVER_MODAL);
	if (modal != null) {
		modal.style.display = "block";
	}
	else {
		console.log("ERROR: Couldn't find the game over modal element");
	}
}
