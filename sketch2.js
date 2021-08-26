//the capture of camera using getUserMedia 
let capture;
let trainButton;
let closed;
let opened;
let allowed = true;
let label = "unknown";
let featureExtractor;
let classifier;
let saveButton;
let loadButton
// When the model is loaded
function modelLoaded() {
  console.log('feature extraction Model is Loaded!');
}
// call back for whe, the custom model is loaded
function customModelLoaded(){
    if(error){
        console.error('model not loaded!');
    }
    console.log('custom Model is loaded!');
    classifier.classify(gotResults);
}
//call back for when the training is done 
function whileTraining(loss) {
    if (loss == null) {
      console.log('Training Complete');
      classifier.classify(gotResults);
    } else {
      console.log(loss);
    }
  }
  
  function gotResults(error, results) {
    if (error) {
      console.error(error);
    } else {
    //only print when the model is trained and working
      label = results[0].label;
      if(label == "closed"){
         allowed = false;
      }else{
          allowed = true;
      }
      classifier.classify(gotResults);
    }
  }
function setup(){
    createCanvas(640,500);
    capture = createCapture(VIDEO);//capture the camera using the p5 method
    // Initialize the Image Classifier method with MobileNet
featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded);

// Create a new classifier using those features and with a video element
classifier = featureExtractor.classification(capture);
    capture.hide();//hide the camera stream 

    opened = createButton("opened");
    opened.mousePressed(function (){
        classifier.addImage(capture, 'opened');
    });

    closed = createButton("closed");
    closed.mousePressed(function (){
        classifier.addImage(capture, 'closed');
    });

    trainButton = createButton("train");
    trainButton.mousePressed(function(){
        //Retrain the network
        classifier.train(whileTraining);
    });

    saveButton = createButton("save");
    saveButton.mousePressed(function(){
      classifier.save();
    });

    loadButton = createButton("load");
    loadButton.mousePressed(function(){
        console.log('loading custom model');
        classifier.load(select("#load").elt.files,customModelLoaded);
    })

    createFileInput(handlefile, true);
}
function handlefile(file){
    classifier.load(file,customModelLoaded);
}
     // Load model
     function load() {
        classifier.load(loadBtn.elt.files, function() {
          select("#modelStatus").html("Custom Model Loaded!");
        });
      }
function draw(){
    background(0);
    //use the captured camera as a image that fills the entire canvas
    image(capture, 0, 0, width, width * capture.height / capture.width - 20);
    //captureBtn.mousePressed(shoot);
    fill(255, 255, 255);
    textSize(25);
    text(label, 0, height - 15);
    if(allowed == true){
    rect(width / 2 , height /2 , 20 , 20 );}
}