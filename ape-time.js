/**
 * APE TIME
 * a.k.a. idonate engineering joke lottery v2
 * Created by bguthrie@idonate.com
 */

/**
 * RUNTIME
 */
document.addEventListener('DOMContentLoaded', ()=>{
    // static variable for localStorage key
    // probably won't ever change but if it does,
    // you only have to do it once.
    var CONTESTANTS = "contestants";

    //set the tagline
    document.getElementById('tagline').innerHTML=chooseTagline();
    //set the session
    setSessionBegin();
    //shuffle contestants
    contestants = shuffle(contestants);
    //load the contestants
    populateContestantDiv();
    //load the items div
    buildItemTable();

    //defining the timers here for easy adjustment
    var curtainDelay = 750;
    var suspenseDelayForMarquee = 75;
    var spotlightDelay1 = 450;
    var dimLightsDelay = 200;
    var spotlightChase1Duration = 4000;
    var suspense2 = 240;
    var suspense3 = 418;
    var itemDelay = 250;
    var itemRebuildDelay = 250;
    var defaultMarqueeInterval = 350;

    //when the consult text is clicked:
    document.getElementById('consult-text').addEventListener('click',()=>{
        //add animation class to log
        document.getElementById('button').classList.add('log-ascend');

        //close curtain after the thing ascends
        window.setTimeout(()=>{
            //close the curtain
            closeCurtain();

            window.setTimeout(()=>{
                //dim the lights
                dimLights();
                
                //increase interval for drumroll chase
                chaserInterval = window.setInterval(()=>{
                    marqueeChase(1)
                },suspenseDelayForMarquee);

                //holy shit what
                window.setTimeout(()=>{
                    //spotlights on, chase sequence 1 on.
                    spotlightsOn();

                    //while theyre going, decide the winner
                    document.getElementById('consult-text').innerHTML=decideWinner();
                    document.getElementById('consult-text').classList.add('winner-text');

                    //wait for the end of the chase
                    window.setTimeout(()=>{
                        //open curtain
                        openCurtain();

                        //descend the log
                        descendLog();

                        //after brief delay, center lights.
                        window.setTimeout(()=>{
                            //spotlights center
                            centerSpotlights();

                            //clear marquee interval
                            window.clearInterval(chaserInterval);

                            //add items
                            window.setTimeout(()=>{
                                //distribute items
                                distributeItems(decideItems());

                                window.setTimeout(()=>{
                                    //update item table
                                    buildItemTable();
                                    //record gamestate
                                    setSessionEnd();
                                },itemRebuildDelay);
                            },itemDelay);
                        },suspense3);
                    },(spotlightChase1Duration + suspense2));
                },spotlightDelay1);
            },dimLightsDelay);
        },curtainDelay);

        
    });


    //test for marquee chaser
    var chaserInterval = setInterval(()=>{marqueeChase(1)},defaultMarqueeInterval); //commenting out for now
    // window.setInterval(()=>{marqueeChase(1)},10); //use this for drum roll

});

/**
 * GLOBALS
 */

const contestantsInitial = [
    {
        name:'Swainson',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Shawn',
        silverCoins:1,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Matt',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Allie',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'MD',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Lindsay',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Cory',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Arthur',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Patrick',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Rasagna',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Ben',
        silverCoins:0,
        goldBananas:0,
        hasGone:false,
    },
    {
        name:'Jerry',
        silverCoins:1,
        goldBananas:0,
        hasGone:false,
    },
];

var contestants = [];

/** The Classic Taglines : ) */
let taglines = [
    'Now with extra mirth!',
    'This could have been an email!',
    '//TODO: Write funny tag-line',
    'While(true){computer();}',
    'npm install funny',
    'From the mean back alleys of GitHub!',
    "Here we are now, entertainers!",
    "os.rmdir(C:/Windows/System32);",
    "gnu/jokes daily!",
    "Stand-up at the stand-up!",
    "Now with Blast Processing!",
    "01110000 01101111 01101111 01110000",
    "Punchlines about the octal system ahoy!",
    "Finally, a chance to use your degree!",
    "Wackity shmackity doo!",
    '<img src="img/javascript.png">',
    "A Hideo Kojima Production",
    "Sales said this has to be funny or else",
    '<img src="img/monday-again.png">',
];

/**
 * Sound Effects
 * name: used for div id
 * location: relative location in document space
 * duration: time in milliseconds.  useful for setting timeouts to remove audio object
 * tah-dahs are stored as an array because these sounds are randomly selected
 */
let soundEffects = {
    tahDahs:[
        {
            //ta-da 1
            name:"tah-dah-1",
            location:"aud/tah-dah-1.mp3",
            duration:"1533",
        },
        {
            //ta-da 2
            name:"tah-dah-2",
            location:"aud/tah-dah-2",
            duration:"2298",
        },
        {
            //ta-da 3
            name:"tah-dah-3",
            location:"aud/tah-dah-3",
            duration:"1807",
        },
    ],
    regular:{
        logPull:{
            //log pull
            name:"log-pull",
            location:"aud/log-pull.mp3",
            duration:"1552",
        },
        coinGet:{
            //coin get
            name:"coin-get",
            location:"aud/coin-get.mp3",
            duration:"3034",
        },
        coinUse:{
            //coin use
            name:"coin-use",
            location:"aud/coin-use.mp3",
            duration:"3024",
        },
        drumRoll:{
            //drum roll
            name:"drum-roll",
            location:"aud/drum-roll.mp3",
            duration:"4979",
        },
        drumStab:{
            //drum stab
            name:"drum-roll-end-stab",
            location:"aud/drum-roll-end-stab.mp3",
            duration:"1199",
        },
        goldBananaGet:{
            //gold banana get
            name:"gold-banana-get",
            location:"aud/gold-banana-get.mp3",
            duration:"13769",
        },
        goldBananaUse:{
            //gold banana use
            name:"gold-banana-use",
            location:"aud/gold-banana-use.mp3",
            duration:"1572",
        },
    },
}

/**
 * FUNCTIONS
 */

 function chooseTagline(){
    return taglines[Math.floor(Math.random()*taglines.length)];
}

function decideItems(){
    //determine if an item occurs.
    //returns an array(2) of booleans: coinGet, bananaGet.
    var randomSeed = Math.random().toFixed(2);
    var coinChance = 0.3; //chance occurs each round
    var bananaChance = 0.5; //chance occurs on the first round & last round
    //is it the first or last round?
    var firstRound = false;
    var lastRound = false;
    var goneCount = 0;
    //the results
    var results = [false,false];

    //determine coin
    if(randomSeed < coinChance){
        results[0] = true;
    }

    //figure out if it is the first or last round
    for(var i = 0; i < contestants.length; i++){
        if(contestants[i].hasGone == true){
            goneCount++;
        }
    }
    if(goneCount == contestants.length){
        lastRound = true;
    }else if(goneCount == 1){
        firstRound = true;
    }

    //determine banana
    if(lastRound == true || firstRound == true){
        //console.log('first round or last round');
        if(randomSeed < bananaChance){
            //console.log('banana activated');
            results[1] = true;
        }
    }

    //return results
    return results;
}

function deductItem(playerName,itemType){
    //playerName: 'Jeff'
    //itemType: 'silverCoins' || 'goldBananas'
    var playerIndex;
    for(var i = 0; i < contestants.length; i++){
        if(contestants[i].name==playerName){
            playerIndex = i;
        }
    }
    contestants[playerIndex][itemType] -= 1;
    
    //TODO: AUDIO
    if(itemType=='silverCoins'){
        //play silver coin use sfx
    }else if(itemType=='goldBananas'){
        //play gold banana use sfx
    }

    buildItemTable(); //refresh table
    setSessionEnd(); //save state
}

function distributeItems(decideItemsIn){
    var winnerIndex;
    var winnerString;
    var winnerFound = false;
    var debug = 0;
    
    winnerString = document.getElementById('consult-text').innerHTML;

    do{
        for(var i = 0; i < contestants.length; i++){
            if(winnerString == contestants[i].name){
                winnerIndex = i;
                winnerFound = true;
            }else{
                debug++;
                if(debug > 50){
                    console.log('error!');
                    winnerFound = true;
                }
            }
        }
    }while(winnerFound == false);

    if(decideItemsIn[0]==true && decideItemsIn[1]==false){
        //coin get
        contestants[winnerIndex].silverCoins += 1;
        silverCoinAnim();
    }else if(decideItemsIn[1]==true && decideItemsIn[0]==false){
        //banana get
        contestants[winnerIndex].goldBananas += 1;
        goldBananaAnim();
    }else if(decideItemsIn[0] == true && decideItemsIn[1] == true){
        //both
        //coin get
        contestants[winnerIndex].silverCoins += 1;
        silverCoinAnim();
        //banana get
        contestants[winnerIndex].goldBananas += 1;
        window.setTimeout(()=>{
            goldBananaAnim();
        },1000);
    }else{

    }
}

function silverCoinAnim(){
    //create a div
    var sc = document.createElement('div');
    //set id to silver-coin
    sc.id="silver-coin";
    //set class to anim-coin
    sc.classList.add('silver-coin-anim');
    //append
    document.body.appendChild(sc);

    //TODO: AUDIO
}

function goldBananaAnim(){
    //console.log('banana descending');
    //create a div
    var bc = document.createElement('div');
    //set id to gold-banana
    bc.id="gold-banana";
    //set class to gold-banana-anim
    bc.classList.add('gold-banana-anim');
    //append
    document.body.appendChild(bc);

    //TODO: AUDIO
}

function decideWinner(){
    var selected = false;
    var winner = "";

    var debug = 0;
    
    do{
        var randomContestantIndex = Math.floor(Math.random()*contestants.length);
        var randomContestant = contestants[randomContestantIndex];
        //console.log(randomContestant);
        if(randomContestant.hasGone==false){
            winner = randomContestant.name;
            //set contestant's hasGone property to true
            contestants[randomContestantIndex].hasGone = true;
            selected = true;
        }else{
            //iterate again
            debug+=1;
            if(debug>50){
                console.log('eek');
                selected=true;
            }
        }
    }while(selected==false);

    return winner;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function dimLights(){
    document.getElementById('darkness').classList.remove('lights-on');
    document.getElementById('darkness').classList.add('lights-dimmed');
}

function closeCurtain(){
    document.getElementById('curtain-left').classList.add('curtain-left-closed');
    document.getElementById('curtain-right').classList.add('curtain-right-closed');
}

function openCurtain(){
    document.getElementById('curtain-left').classList.remove('curtain-left-closed');
    document.getElementById('curtain-right').classList.remove('curtain-right-closed');
}

function spotlightsOn(){
    var spotlight1 = document.createElement('circle');
    var spotlight2 = document.createElement('circle');


    spotlight1.id="spotlight-1";
    spotlight2.id="spotlight-2";
    spotlight1.classList.add('spotlight');
    spotlight2.classList.add('spotlight');
    spotlight1.classList.add("spotlight-1");
    spotlight2.classList.add("spotlight-2");
    

    document.body.appendChild(spotlight1);
    document.body.appendChild(spotlight2);
}

function centerSpotlights(){
    document.getElementById('spotlight-1').classList.replace('spotlight-1','spotlight-1-centered');
    document.getElementById('spotlight-2').classList.replace('spotlight-2','spotlight-2-centered');
}

function descendLog(){
    document.getElementById('button').classList.replace('log-ascend','log-descend');
}

/**
 * Set Session From Local Storage
 */
function setSessionBegin(){
  // check for existing contestants data
  // if data exists, load to current session.
  contestants = JSON.parse(localStorage.getItem(CONTESTANTS));
  
  // if it doesn't, load initial.
  if (!contestants) {
    contestants = contestantsInitial;
  }
  
  // if all have gone, reset all hasGone's.
  if (!contestants.find(c => !c.hasGone)) {
    contestants.forEach(c => c.hasGone = false);
  }
}

/**
 * Set session at end.
 */
function setSessionEnd(){
    localStorage.setItem(CONTESTANTS, JSON.stringify(contestants));
}

/**
 * Marquee Chaser
 * Change the color and stroke of the main header text on an interval.
 */
function marqueeChase(startingPoint){
    //called on an interval.
    //startingPoint 1-7.
    
    //we have some span id's, msc-1 thru msc-7.
    //if i change out one of the span's (or spans) classes.

    //if class not present on any, apply class to msc-1.
    //if the class is present, remove from msc-n, apply to msc-n+1.
    //if n+1 > 7, remove class from msc-n, apply to msc-1.

    //so first we need an array of the spans.
    var elements = document.getElementsByClassName('ms1');

    //and the class name we need to find to apply the 'highlight' style.
    var className = 'highlighted';

    //then, we need to check if any of the elements has the class. at initial state, it is expected to not.
    var highlighted = document.getElementsByClassName(className);
    var classNamePresent = highlighted.length == 0 ? false : true;

    //based on that result, add or do not add the class to the starting point.
    if(classNamePresent == false){
        //not present.  add to msc-startingPoint.
        document.getElementById('msc-' + startingPoint).classList.add('highlighted');
    }else{
        //present.  iterate.
        //which msc has the highlighted class?
        var mscHighlighted = [];
        for(var i = 0; i < highlighted.length; i++){
            mscHighlighted.push(
                highlighted[i].id.split('msc-')[1]
            );
        }

        //now that we know that...
        //remove from msc-highlighted
        //add to msc-highlighted + 1, within limit
        for(var i = 0; i < mscHighlighted.length; i++){
            document.getElementById('msc-' + mscHighlighted[i]).classList.remove('highlighted');
            if(mscHighlighted[i] < 7){
                //normal range, 1-6.
                document.getElementById('msc-' +  (parseInt(mscHighlighted[i]) + 1)).classList.add('highlighted');
            }else{
                //equal to 7. 
                document.getElementById('msc-1').classList.add('highlighted');
            }
        }
    }
}

function populateContestantDiv(){
    // take all contestants
    // filter to just ones that haven't gone yet
    // map over and return just names
    // and then join everyone left with a line break.
    var output = contestants
        .filter(c => !c.hasGone)
        .map(c => c.name)
        .join("<br>");

    document.getElementById('contestants-list').innerHTML = output;
}

function buildItemTable(){
    //a table with these headers: Name, Silver Coins, Golden Bananas
    var targetDiv = document.getElementById('items-list');
    
    var tbl = document.createElement('table');
    tbl.id = 'items-table'; //css hookup
    var tableBody = document.createElement('tbody');

    //make the header
    var headerRow = document.createElement('tr');
    headerRow.id="header-row";
    var bananaIcon = document.createElement('td');
    bananaIcon.id="silver-coin-icon";
    var coinIcon = document.createElement('td');
    coinIcon.id="banana-icon";
    //empty thing for name
    var blanko = document.createElement('td');
    //wait no
    blanko.innerHTML = 'PLAYER';
    blanko.id="player-name";

    headerRow.appendChild(blanko);
    headerRow.appendChild(bananaIcon);
    headerRow.appendChild(coinIcon);

    tableBody.appendChild(headerRow);


    for(var i = 0; i < contestants.length; i++){
        var tableRow = document.createElement('tr');
        var keys = Object.values(contestants[i]);
        for(var j = 0; j < 3; j++){
            var tableDiv = document.createElement('td');
            if(j!==0){tableDiv.classList.add('item-cell');}else{tableDiv.classList.add('name-cell')}
            
            tableDiv.appendChild(document.createTextNode(keys[j]));
            tableRow.appendChild(tableDiv);
        }
        tableBody.appendChild(tableRow);
    }
    tbl.appendChild(tableBody);
    targetDiv.innerHTML = "";
    targetDiv.appendChild(tbl);
}

//end program

/**
 * MISC. NOTES
 */
/** Thoughts on data structure.
 * 
 * I want to have each contestant be their own object.
 * When they are selected, their name is then moved to the array of the has-gones.
 * When there are no more names to move, they are then all moved back.
 * 
 * So, at the beginning of the program, if there is no localstorage object for the contestant or the has-gone array, create them with the initial states.
 * If the lolalstorage objects exist, set contestants and hasGone to those values.
 * 
 * REMEMBER:
 *  To Store in localstorage:
 *      localStorage.setItem("destinationName",JSON.Stringify(value));
 *  To Retrieve from localstorage:
 *      item = JSON.parse(localStorage.getItem("destinationName"));
 */
