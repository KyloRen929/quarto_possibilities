
////////////////////////////
//  Oliver Kovacs 2019    //
//  quarto_possibilities  //
//  app.js                //
//  CC-BY-NC-SA-3.0       //
////////////////////////////

///////////////
// variables //
///////////////

var i;
var j;
var k;
var l;

var fs = require("fs");

var settings = require("./settings.json");
var input = require("./input.json");

var no_rowJSON = [];

/////////////
// classes //
/////////////

class Table {
    constructor() {
        this.ROW_ARR = [];
        this.TILE_ARR = [];
        this.PIECE_ARR = [];
        this.ORDER_ARR = [];
        this.width;
        this.height;
    }

    resize(width, height) {
        this.TILE_ARR = [];
        this.width = width;
        this.height = height;
        for (i = 0; i < this.height; i++) {
            this.TILE_ARR[i] = [];
        }
    }

    definePieces() {
        for (i = 0; i < input.length; i++) {
            this.PIECE_ARR[i] = new Piece(input[i]);
        }
    }

    orderToTile() {
        this.x = -1;
        this.y = 0;
        for (j = 0; j < this.ORDER_ARR.length; j++) {
            //all pieces in order_arr
            this.x++;
            if (this.x >= this.width) {
                //hop to next line
                this.x = 0;
                this.y++;
            }
            //console.log(this.x + " " + this.y + " " + j);
            this.TILE_ARR[this.y][this.x] = this.ORDER_ARR[j];
        }
    }

    noRow() {
        this.noRowVar = true;
        if (settings.vertical != true) {   
        }
        else if (this.isRowVertical() == true) {
            this.noRowVar = false;
        }
        if (settings.horizontal != true) { 
        }
        else if (this.isRowHorizontal() == true) {
            this.noRowVar = false;
        }
        if (settings.diagonal != true) {
        }
        else if (this.isRowDiagonal() == true) {
            this.noRowVar = false;
        }
        return this.noRowVar;
    }

    isRowVertical() {
        this.row = false;
        for (j = 0; j < this.width; j++) {
            //all collums
            this.ROW_ARR = [];
            for (k = 0; k < this.height; k++) {
                //all lines
                this.ROW_ARR[k] = this.TILE_ARR[k][j];
            }
            //console.log("verticalfun");
            if (this.isSameInRow(this.ROW_ARR) == true) {
                this.row = true;
            }
        }
        return this.row;
    }

    isRowHorizontal() {
        this.row = false;
        for (j = 0; j < this.height; j++) {
            //all lines
            this.ROW_ARR = [];
            for (k = 0; k < this.width; k++) {
                //all collums
                this.ROW_ARR[k] = this.TILE_ARR[j][k];
            }
            //console.log("horizontalfun");
            if (this.isSameInRow(this.ROW_ARR) == true) {
                this.row = true;
            }
        }
        return this.row;
    }

    isRowDiagonal() {
        if (this.width != this.height) {
            stop("ERR width and height must be the same in order to check diagonal rows");
        }
        this.row = false;
        this.ROW_ARR = [];
        for (j = 0; j < this.width; j++) {
            this.ROW_ARR[j] = this.TILE_ARR[j][j];
        }
        //console.log("diagonalfun1");
        if (this.isSameInRow(this.ROW_ARR) == true) {
            this.row = true;
        }
        for (j = 0; j < this.width; j++) {
            this.ROW_ARR[j] = this.TILE_ARR[j][this.width - 1 - j];
        }
        //console.log("diagonalfun2");
        if (this.isSameInRow(this.ROW_ARR) == true) {
            this.row = true;
        }
        return this.row;
    }

    isSameInRow(row) {
        //console.log("row: " + JSON.stringify(row));
        this.isRow = false;
        for (k = 0; k < row[0].properties.length; k++) {
            //all properties
            this.allSame = true;
            for (l = 1; l < row.length; l++) {
                //all tiles except for base in row
                if (row[l].properties[k] != row[0].properties[k]) {
                    this.allSame = false;
                }
            }
            if (this.allSame == true) {
                this.isRow = true;
            }
        }
        //console.log(this.allSame);
        return this.isRow;
    }

    isMultipleUse() {
        for (k = 0; k < this.ORDER_ARR.length; k++) {
            //all pieces
            for (j = 0; j < this.ORDER_ARR.length; j++) {
                //all other pieces
                if (this.ORDER_ARR[j] === this.ORDER_ARR[k] && j != k) {
                    return true;
                }
            }
        }
        return false;
    }

    checkAllPossibilities(mode) {
        console.log("possibilities: " + Math.pow(this.PIECE_ARR.length, this.width * this.height));
        this.iIntArr = [];
        this.possibilities = 0;
        this.cmdNoRow = 0;
        this.cmdNoRowMUse = 0;
        for (i = 0; i < Math.pow(this.PIECE_ARR.length, this.width * this.height); i++) {
            //all possibilities
            this.possibilities++;
            for (j = 0; j < this.width * this.height; j++) {
                //all tiles
                this.i = i;
                for (k = 0; k < j + 1; k++) {
                    this.iR = this.i % this.PIECE_ARR.length;
                    this.i = Math.floor(this.i / this.PIECE_ARR.length);
                }
                this.ORDER_ARR[j] = this.PIECE_ARR[this.iR];
                this.iIntArr[j] = this.iR;
            }
            this.orderToTile();
            if (table.noRow() == true && mode == "noRow" && settings.multipleUse == false && this.isMultipleUse() == false) {
                console.log("no row: false");
                this.cmdNoRow++;

                ////////////
                // no row //
                ////////////

                no_rowJSON.push(JSON.stringify(this.TILE_ARR));
            }
            else if (table.noRow() == true && mode == "noRow") {
                //console.log("no row: false   ERR ms");
                this.cmdNoRowMUse++;

                /////////////////////////
                // no row multiple use //
                /////////////////////////

            }
            if (i % 10 == 0) {
                console.log((this.possibilities * (100 / Math.pow(this.PIECE_ARR.length, this.width * this.height))).toFixed(2) + "% " + JSON.stringify(this.iIntArr));
            }
        }
        fs.writeFileSync("./files/no_row.json", JSON.stringify(no_rowJSON), "utf8");
        console.log("possibilities: " + this.possibilities);
        console.log("no row:        " + this.cmdNoRow);
        console.log("no row m use:  " + this.cmdNoRowMUse);
    }
}

class Piece {
    constructor(data) {
        this.name = data.name;
        this.properties = data.properties;
    }
}

function stop(error) {
    if (error != undefined) {
        console.log(error);
    }
    process.exit();
}

let table = new Table();
table.resize(3, 3);
table.definePieces();
table.checkAllPossibilities("noRow");