var express = require('express');
var router = express.Router();
var Clarifai = require('clarifai');

var app = new Clarifai.App(
  'NO18sIhXk9nZDkAdVXNPSThzPXPI8wHn78vAncxe',
  'c2vHENnTnNj6XdFkXCEWbG1g1oSdBmTqOTO44eP9'
);

/* GET home page. */
router.get('/',(req, res, next)=>{
  res.render('index', { title: 'Find A Business' });
});

/*POST home page.*/
router.post('/',(req, res, next)=>{
  try{
    /*Insert object field validation*/
    let imgURL = 'http://lorempixel.com/100/190/nature/6';

    /*Promise to build a response based on valid fields and Clarifai results*/
    Promise.all([validateFields(req.body),app.models.predict(Clarifai.GENERAL_MODEL, imgURL)]).
    then(buildResult(values),
    function(err) {
      console.log(err);
    });
  }
  catch(err){
    console.log(err);
  }
});

/* TODO: Move this to a controller module*/
function validateFields(place){
  console.log(place.name);
  console.log(place.formatted_address);
  console.log(place.formatted_phone_number);
  console.log(place.website);
  console.log(place.types);
  return place;
}

function buildResult(values){
  console.log(values);
  let place = values[0];
  let imgData = values[1];
  let tags = imgData.outputs[0].data.concepts;

  place.photos = {
    'imgURL':'http://lorempixel.com/100/190/nature/6',
    'tags':tags
  };
  console.log(place);
  res.send(place);
}

module.exports = router;
