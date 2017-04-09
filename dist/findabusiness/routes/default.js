var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/',(req, res, next)=>{
  res.render('index', { title: 'Find A Business' });
});

/*POST home page.*/
router.post('/',(req, res, next)=>{
  try{
    /*Insert object field validation*/

    /*Log client object fields*/
    let place = req.body;
    console.log(place.name);
    console.log(place.formatted_address);
    console.log(place.formatted_phone_number);
    console.log(place.website);
    console.log(place.types);

    /*If there are photos returned, log them as well*/
    if(place.photos){
      console.log(place.photos);
      /*insert calls for image processing*/
    }

    //send response object;
    res.send(place);
  }
  catch(err){
    console.log(err);
  }
});

module.exports = router;
