var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
//key controls
var keys = '';
//compatibility
var isMobile;       //mobile support check
var scale;          //resizing
//fps
var lastLoop = new Date();
var fps;
//gfx
var globalCount = 0;    //use for gfx
var fadeDuration = 10;
var fadeToBlack = -fadeDuration;
var render = true;

var plyr = {
    x:          undefined,
    y:          undefined,
    dx:         undefined,
    dy:         undefined,
    width:      undefined,
    height:     undefined,
    checkptX:   undefined,
    checkptY:   undefined,
    level:      undefined,
    prevLevel:  undefined,
    dir:        undefined,
    prevDir:    undefined,
    jump:       undefined,
    color:      undefined
};
//events
var death = false;
var newCheckpoint = false;