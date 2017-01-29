
/* Class Names */
const CLASS_NAME_ERROR_TEXT = "errText";
const CLASS_NAME_MESSAGE_TEXT = "statusText";
const CLASS_NAME_TILE_CONTAINER = "tile";
const CLASS_NAME_TILE_CONTENTS = "tileContents";
const CLASS_NAME_TILE_FORM = "tileForm";
const CLASS_NAME_TILE_IMG_CONTAINER = "tileImageContainer";
const CLASS_NAME_TILE_IMAGE = "tileImage";
const CLASS_NAME_TILE_IMAGE_MATCHED = "tileImageMatched"; 

/* Element IDs */
const ELEMENT_ID_ERR_MSG = "errMsgDiv";
const ELEMENT_ID_STATUS_MSG = "divStatusMsg";
const ELEMENT_ID_SIZE_SELECT = "selBoardSize";
const ELEMENT_ID_GAME_BOARD = "gameBoard";
const ELEMENT_ID_SUCCESS_ICONS_AREA = "successIcons";
const ELEMENT_ID_FAILURE_ICONS_AREA = "failureIcons";
const ELEMENT_ID_GAME_OVER_MODAL = "gameOverModal";

/* Image File Paths */
//const IMG_PATH_TILE_BACK = "images\\flame-tile.png";
const IMG_PATH_TILE_BACK = "images\\gray-flame-square.png";
const IMG_PATH_TILE_MATCHED = "images\\metal-tile-purple-flame.png";
const IMG_PATH_CORRECT_GUESS = "images\\lit-match-icon.png";
const IMG_PATH_WRONG_GUESS = "images\\burnt-match-icon.png";
const TILE_IMAGE_PATHS = [
	"images\\tiles\\apple.png",
	"images\\tiles\\blue-fish.png",
	"images\\tiles\\book.png",
	"images\\tiles\\car.png",
	"images\\tiles\\cat.png",
	"images\\tiles\\flower.png",
	"images\\tiles\\hamburger.png",
	"images\\tiles\\paint.png",
	"images\\tiles\\scissors.png",
	"images\\tiles\\turkey.png",
	"images\\tiles\\tv.png",
	"images\\tiles\\soccer-ball.png",
];

/* Image IDs */
const IMG_ID_SHOWN = "imgShown";
const IMG_ID_HIDDEN = "imgHidden";
const IMG_ID_MATCHED = "imgMatched";

/* Other Values */
const TILE_MARGIN = "0.5%";

const DEFAULT_TABLE_WIDTH = 4;
const DEFAULT_TABLE_HEIGHT = 4;

const TILE_DISPLAY_MODE = { 
	"SHOWN": "0", 
	"HIDDEN": "1",
	"MATCHED": "2"
};