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
    let place = req.body

    /*create promise array to get all promises*/
    let promiseFunctions =[validateFields];
    for(let i = 0; i<place.photos.length; i++){
      promiseFunctions[i+1]=app.models.predict;
    }

    /*Promise to build a response based on valid fields and Clarifai results*/
    Promise.all([validateFields(place),app.models.predict(Clarifai.GENERAL_MODEL,place.photos[0])])
    .then(buildResult)
    .then((value)=>{
      res.send(value);
    },
    function(err) {
      console.log(err);
    });
    // Promise.all(promiseFunctions)
    // .then(responses=>{
    //   console.log(responses);
    //   buildResult(responses);
    // })
    // .then(value=>{
    //   res.send(value);
    // },
    // function(err) {
    //   console.log(err);
    // });

    // promiseFunctions[0](place);
    // for(let i = 1; i<promiseFunctions.length; i++){
    //   promiseFunctions[i](Clarifai.GENERAL_MODEL,place.photos[i-1]);
    // }
  }
  catch(err){
    console.log(err);
  }
});

/* TODO: Move these functions to a controller module*/
/* TODO: Add validatefor post requests*/
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

  console.log(place);
  let tags = imgData.outputs[0].data.concepts;

  for(let i = 0; i<place.photos.length;i++){
    place.photos[i] = {
      'imgURL':place.photos[i],
      'tags':tags
    };
  }
  console.log(place);
  return place;
}

module.exports = router;
