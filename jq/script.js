var version = "0.2";
var savefile_name = "primordial incremental "+version;

var debug_nosave=0;

var audio_initiated=0;

var diff = 0;
var date = Date.now();
var player = {};

//values preserved between prestige cycles
var prestige = {
  time:0,
  multiplier:1
};
var estate1 = {};
var settings = {
  scientific:0,
  audio_mute:0,
  audio_volume:0.5,
  offline:1,
  limit:1
}


//variables that are constants, unsaved defaults or are derived from saved variables
const EUROS_BASE_COST=1e6;
var nextEuroCost=0;
var current_rate;
var misc_settings={
  settings_toggle:0
}
var frames1=0;

//CACHE

var settings_block;
var button_settings;
var button_save;
var button_delsave;
var button_scientific;
var button_copysave;
var button_importsave;
var import_save_dump;
var button_audio;
var audio_control_volume;
var button_limit;
var button_offline;

var estate1_double_rate;
var estate1_num_label;
var estate1_rate_label;
var estate1_limit_label;


$(document).ready(function(){

  //CACHE

  estate1_double_rate=$("#estate1_double_rate");
  estate1_num_label=$("#estate1_num_label");
  estate1_rate_label=$("#estate1_rate_label");
  estate1_limit_label=$("#estate1_limit_label");

  import_save_dump=$("#import_save_dump");
  button_importsave=$("#button_importsave");
  button_copysave=$("#button_copysave");
  button_scientific=$("#button_scientific");
  settings_block=$("#settings_block");
  button_settings=$("#button_settings");
  button_save=$("#button_save");
  button_delsave=$("#button_delsave");
  button_audio=$("#button_audio");
  audio_control_volume=$("#audio_control_volume");
  button_limit=$("#button_limit");
  button_offline=$("#button_offline");




  document.title = "primordial incremental v"+version;
    console.log("primordial incremental v"+version);
    console.log("created by Louigi Verona");
    console.log("https://louigiverona.com/?page=about");


  //init functions

  if(localStorage.getItem(savefile_name)){
    loadGame();
  }else{
    init();
  }

  commonInit();
  refreshUI();

  setInterval(loop, 50);

  ////////////////

  $("html").keydown(function( event ) {
    switch (event.key){
      case "q":

      break;
      case "w":
        //for testing






      break;
      case "s":
        saveGame();
      break;
      case "d":
        delSave();
    }

  });

  button_settings.click(function(){
    PlayAudio(1);

    if(misc_settings.settings_toggle==0){
      misc_settings.settings_toggle=1;
    }else{misc_settings.settings_toggle=0;}

    refreshUI();
  });
  button_scientific.click(function(){
    PlayAudio(1);

    if(settings.scientific==0){
      settings.scientific=1;
    }else{settings.scientific=0;}

    refreshUI();
  });
  button_save.click(function(){
    PlayAudio(1);

    button_save.text("Saved").prop("disabled",true);

    saveGame();

    setTimeout(function() { button_save.text("Save Game").prop("disabled",false); }, 1000);

  });
  button_delsave.click(function(){

    delSave();
    location.reload();

  });
  button_copysave.click(function(){
    PlayAudio(1);

    let gameData=localStorage.getItem(savefile_name);
    navigator.clipboard.writeText(gameData);

    button_copysave.text("Copied").prop("disabled",true);

    setTimeout(function() { button_copysave.text("Copy").prop("disabled",false); }, 1000);

  });
  button_importsave.click(function(){

    if(import_save_dump.text().length<=0){return;}


    PlayAudio(1);

    localStorage.setItem(savefile_name, import_save_dump.text());
    import_save_dump.text('');

    misc_settings.settings_toggle=0;

    loadGame();
    refreshUI();

  });
  button_audio.click(function(){

    PlayAudio(1);

    if(settings.audio_mute==0){
      settings.audio_mute=1;
    }else{
      settings.audio_mute=0;
      PlayAudio(1);
    }

    refreshUI();

  });
  audio_control_volume.mousemove(function(){
        settings.audio_volume=audio_control_volume.val();
        Howler.volume(settings.audio_volume);
  });
  button_limit.click(function(){
    PlayAudio(1);

    if(settings.limit==0){
      settings.limit=1;
    }else{settings.limit=0;}

    refreshUI();
  });
  button_offline.click(function(){
    PlayAudio(1);

    if(settings.offline==0){
      settings.offline=1;
    }else{settings.offline=0;}

    refreshUI();
  });


  estate1_double_rate.click(function(){

    PlayAudio(1);

    estate1.multiplier*=2;
    estate1.num=0;

    saveGame();

    storeState();
    refreshUI();

  });

});//document.ready


function init(){


  estate1 = {
    num:0,
    rate:1,
    multiplier:1,
    limit:1000000
  };




}
function commonInit(){
  //inits that are relevant to both init() and loadGame()
  Howler.volume(settings.audio_volume);//default volume
}

//main loop
function loop() {
    diff = Date.now()-date;
    calc(diff/1000);
    date = Date.now();
}
function calc(dt){

  current_rate = estate1.rate * estate1.multiplier;

  estate1.num+=dt*current_rate;

  if(estate1.num>estate1.limit && settings.limit==0){estate1.num=estate1.limit;}

  frames1++;

  if(frames1%100==0){
    frames1=0;
    saveGame();
  }

  updateCounter(current_rate);

}
function updateCounter(current_rate){

  storeState();

  if(estate1.num<1000000){
    estate1_num_label.text(numT(parseInt(estate1.num)));
  }else{estate1_num_label.text(numT(estate1.num));}

  //estate1_num_label.text(numT(estate1.num)+'/'+estate1.limit);

  estate1_rate_label.text('Rate: '+numT(current_rate)+'/s');

}

function storeState(){

  //nE();

  if(estate1.num<estate1.limit){estate1_double_rate.prop('disabled', true);}else{estate1_double_rate.prop('disabled', false);}

}
function refreshUI(){

  //if(estate1.multiplier>=estate1.limit*10){estate1_double_rate.hide();}else{estate1_double_rate.show();}

  estate1_limit_label.text('Target: '+numT(estate1.limit));


  //footer

  if(misc_settings.settings_toggle==1){
    settings_block.show();
  }else{
    settings_block.hide();
  }

  if(settings.audio_mute==1){
    button_audio.text("Turn it back on");
  }else{
    button_audio.text("Turn it off");
  }

  audio_control_volume.val(settings.audio_volume);

  if(settings.offline==0){
    button_offline.text("Turn it back on");
  }else{
    button_offline.text("Turn it off");
  }
  if(settings.limit==0){
    button_limit.text("Turn it back on");
  }else{
    button_limit.text("Turn it off");
  }


}




function saveGame(){

  prestige.time=Date.now();

  let gameData = {
      universal:[estate1,prestige,settings]
    };

    gameData=LZString.compressToBase64(JSON.stringify(gameData));
    localStorage.setItem(savefile_name, gameData);
}
function loadGame(){

  let gameData=localStorage.getItem(savefile_name);
  gameData = JSON.parse(LZString.decompressFromBase64(gameData));

    estate1=gameData.universal[0];
    prestige=gameData.universal[1];
    settings=gameData.universal[2];

    if(!prestige.time){prestige.time=0;}

    if(prestige.time>0 && settings.offline==1){
        diff = Date.now()-prestige.time;
        calc(diff/1000);
    }

}
function delSave(){
  localStorage.removeItem(savefile_name);
}


function getPrices(base_price,growth_rate,current_amount){

  let all_prices=[0,0,0];

  all_prices[0]=base_price * Math.pow(growth_rate,current_amount) * (Math.pow(growth_rate,1)-1) / (growth_rate-1);
  all_prices[1]=base_price * Math.pow(growth_rate,current_amount) * (Math.pow(growth_rate,10)-1) / (growth_rate-1);
  all_prices[2]=base_price * Math.pow(growth_rate,current_amount) * (Math.pow(growth_rate,100)-1) / (growth_rate-1);

  //let result=base_price*Math.pow(growth_rate,9);
  return all_prices;

}
function getPrices2(base_price,growth_rate,current_amount,desired_amount){

  return base_price * Math.pow(growth_rate,current_amount) * (Math.pow(growth_rate,desired_amount)-1) / (growth_rate-1);

}

function numT(number, decPlaces=2) {

  //numTransform

  //my optimization: it used to do abbrev.length in two places, since the length here is not variable, I cache it. Performance boost is likely to be very small, but as this is one of the most used functions in the game, I want to make sure it is ultra-optimized

  if(settings.scientific==0){

  var abbrev_length=64;

          number = Math.round(number*100)/100;//my addition: round any incoming floats first

          // 2 decimal places => 100, 3 => 1000, etc
          decPlaces = Math.pow(10,decPlaces);
          // Enumerate number abbreviations
          var abbrev = [ "M", "B", "T", "Q", "kQ", "S", "kS", "c", "kc", "d", "kd", "e", "ke", "f", "kf", "F", "kF", "h", "kh", "j", "kj", "L", "kL", "Na", "kNa", "Nb", "kNb", "Nc", "kNc", "Nd", "kNd", "Ne", "kNe", "Nf", "kNf", "Ng", "kNg", "Nh", "kNh", "Ni", "kNi", "Nj", "kNj", "Nk", "kNk", "Nl", "kNl", "Nm", "kNm", "Np", "kNp", "Nq", "kNq", "Nr", "kNr", "Ns", "kNs", "Nt", "kNt", "Nu", "kNu", "Nv", "inf" ];

          // Go through the array backwards, so we do the largest first
          for (var i=abbrev_length-1; i>=0; i--) {
              // Convert array index to "1000", "1000000", etc
              var size = Math.pow(10,(i+1)*6);
              // If the number is bigger or equal do the abbreviation
              if(size <= number) {
                   // Here, we multiply by decPlaces, round, and then divide by decPlaces.
                   // This gives us nice rounding to a particular decimal place.
                   number = Math.round(number*decPlaces/size)/decPlaces;
                   // Handle special case where we round up to the next abbreviation
                   if((number == 1000) && (i < abbrev_length - 1)) {
                       number = 1;
                       i++;
                   }
                   // Add the letter for the abbreviation
                   number += ""+abbrev[i];
                   // We are done... stop
                   break;
              }
          }

        }else{
          if(number>1000){return Number(number).toExponential(2).replace(/\+/g, "");}
          else{number = Math.round(number*100)/100;}
        }

          return number;
}
function numT2(number){
  if(number>1000){return Number(number).toExponential(3);}
  else{number = Math.round(number*1000)/1000;}
  return number;
}


function choose(arr) {
  return arr[Math.floor(Math.random()*arr.length)];
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum and the minimum are inclusive
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function nE(){//euros

  if(bliss.all_time_num>=nextEuroCost){

    bliss.all_time_dollars=Math.floor( Math.cbrt( bliss.all_time_num/EUROS_BASE_COST ) );//recalculating all-time dollars

    let dollars=bliss.all_time_dollars-bliss.spent_dollars;
    dollars_label.text('€'+numT(dollars));
    jobcenter_recruiter_metrics.html('current multiplier: <b>x' + numT(bliss.cmultiplier) + '</b><br>multipler after reset: <b>x' + numT(bliss.all_time_dollars) + '</b>' );
    jobcenter_ateuros.text(numT(bliss.all_time_dollars));
    //prevEuroCost=EUROS_BASE_COST * Math.pow((bliss.all_time_dollars),3);
  }
  nextEuroCost=EUROS_BASE_COST * Math.pow((bliss.all_time_dollars+1),3);

  if(frames1%10==0){
    jobcenter_nexteuro.text(numT(nextEuroCost - bliss.all_time_num));
  }


}

function setupAudio(){

  click1 = new Howl({
    src: ['snd/tab_click.wav']
  });

  click2 = new Howl({
    src: ['snd/click5.wav']
  });

  click3 = new Howl({
    src: ['snd/rlab_item2.wav']
  });

}
function PlayAudio(snd){

  if(audio_initiated==0){
    audio_initiated=1;
    setupAudio();
  }

  if(settings.audio_mute==0){
		switch(snd){
			case 1: click1.play(); break;
			case 2: click2.play(); break;
			case 3: click3.play(); break;
			}
	}
}
