/**
 * An adopted version of pmario's version to create
 * uuids of type RFC4122, version 4 ID.
 *
 * Shortened version:
 * pmario (1.0 - 2011.05.22):
 * http://chat-plugins.tiddlyspace.com/#UUIDPlugin
 *
 * Original version:
 * Math.uuid.js (v1.4)
 * http://www.broofa.com
 * mailto:robert@broofa.com
 *
 * Copyright (c) 2010 Robert Kieffer
 * Dual licensed under the MIT and GPL licenses.
 *
 * ---
 * @see https://github.com/almende/vis/issues/432
*/
const genUUID = (function() {

  // Private array of chars to use
  var CHARS = '0123456789abcdefghijklmnopqrstuvwxyz'.split('');

  return function () {
    var chars = CHARS, uuid = new Array(36);

    var rnd=0, r;
    for (var i = 0; i < 36; i++) {
      if (i==8 || i==13 ||  i==18 || i==23) {
        uuid[i] = '-';
      } else if (i==14) {
        uuid[i] = '4';
      } else {
        if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }

    return uuid.join('');
  };

})();

logText = function(text) {
    return Function.prototype.bind.call(console.log, console, text);
}();

function createNode(html) {
  let div = document.createElement('div');
  div.innerHTML = html;
  return div.firstChild;
}

function writeToConsole() {
  //Add locations for each of the locations
  const characters = JSON.parse(json_cast);

  for (let i = 0; i < characters.length; i++){ 
   writeCharacter(i, characters);
  }
}

function writeCharacter (i, characters) {

  var characterTag = characters[i].tag;
  var characterName = characters[i].fields.name;
  var info = Sim.getCharacterInfoByTag(characterTag);
  var infoArr = info.toString().split(',');
  
  // Check if character has any info
  if (infoArr[0] == ""){
  } else {
    for (let k = 0; k < infoArr.length; k++){
      var infoPiece = infoArr[k]
      writeIdea(infoPiece, characterTag, characterName);
    }
  }
}

function writeIdea (infoTag, characterTag, characterName) {
  var infoText = Sim.getInfoTextByTag(infoTag);
  var nodeID = genUUID();
  var log = "<div created=\"20200721005138241\" modified=\"20200721005811293\" name=\"" + infoTag + "\" tags= \"" + Sim.getStorylineByInfoTag(infoTag) + "\" " + "title= \"(" + characterName + ") " + infoText + "\" ";
  
  var nextNodes = Sim.getNextNodesByTag(infoTag); 
  var nextNodeArray = nextNodes.toString().split(',');

  // Check if info has anything it connects with for adding it to the "pre" of the log
  if (nextNodeArray[0] == ""){
  } else {
    for (let x = 0; x < nextNodeArray.length; x++){
      var node = nextNodeArray[x];
      writeSecondaryInfo(node, nodeID);
    }
  }
  log = log + "tmap.id=\"" + nodeID + "\" type=\"text/vnd.tiddlywiki\"><pre></pre></div>"
  setTimeout (console.log.bind (console, log));
}


function writeSecondaryInfo(infoTag, oldNodeID) {
  var infoText = Sim.getInfoTextByTag(infoTag); 
  var nodeID2 = genUUID();
  var log2 = "<div created=\"20200721005138241\" modified=\"20200721005811293\" name=\"" + infoTag + "\" tags= \"" + Sim.getStorylineByInfoTag(infoTag) + "\" " + "title= \"" + infoText + "\" "; 
  
  var nextNodes = Sim.getNextNodesByTag(infoTag); 
  var nextNodeArray = nextNodes.toString().split(',');

  // Check if info has anything it connects with for adding it to the "pre" of the log
  if (nextNodeArray[0] == ""){
  } else {
    for (let x = 0; x < nextNodeArray.length; x++){
      var node = nextNodeArray[x];
      writeTertiaryInfo(node, nodeID2);
    }
  }

  var edgeID = genUUID();
  log2 = log2 + "tmap.edges = \"\{&quot;" + edgeID + "&quot;\:\{&quot;to&quot;\:&quot;" + oldNodeID + "&quot;,&quot;type&quot;: &quot;leads to&quot;}}\" "
  log2 = log2 + "tmap.id=\"" + nodeID2 + "\" type=\"text/vnd.tiddlywiki\"><pre></pre></div>"
  setTimeout (console.log.bind (console, log2));
}


function writeTertiaryInfo(infoTag, oldNodeID2) {
  var infoText = Sim.getInfoTextByTag(infoTag); 
  var nodeID3 = genUUID();
  var log3 = "<div created=\"20200721005138241\" modified=\"20200721005811293\" name=\"" + infoTag + "\" tags= \"" + Sim.getStorylineByInfoTag(infoTag) + "\" " + "title= \"" + infoText + "\" "; 
  
  var edgeID3 = genUUID();
  log3 = log3 + "tmap.edges = \"\{&quot;" + edgeID3 + "&quot;\:\{&quot;to&quot;\:&quot;" + oldNodeID2 + "&quot;,&quot;type&quot;: &quot;leads to&quot;}}\" "
  log3 = log3 + "tmap.id=\"" + nodeID3 + "\" type=\"text/vnd.tiddlywiki\"><pre></pre></div>"
  setTimeout (console.log.bind (console, log3));
}

writeToConsole();


//Set it so that each node has line breaks after certain # of words
$("p").each(function() {
  var html = $(this).html().split(" ");
  var slicedHTML = "";
  var i;
  for (i = 0; i <= html.length - 3; i = i + 3) {
    slicedHTML = slicedHTML + html.slice(i, i+3).join(" ") + "<br />";
  }
  slicedHTML = slicedHTML + html.slice(i).join(" ");
  $(this).html(slicedHTML);
});

