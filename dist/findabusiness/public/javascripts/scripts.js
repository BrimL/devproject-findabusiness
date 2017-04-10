/*********************************************************/
/* TODO: Move these scripts to an external scripts files */
/*********************************************************/
/*Assign form fields as constants*/
const FORM = document.getElementById('searchQueryForm');
const BUSINESS = document.getElementById('businessField');
const POSTALCODE = document.getElementById('postalCodeField');

/*Assign Google API Constants*/
const MAPDIV = document.createElement('div');
const MAP = new google.maps.Map(MAPDIV);
const SERVICE = new google.maps.places.PlacesService(MAP);

/*Assign HTTP Request Object for POST requests as constant*/
const XHR = new XMLHttpRequest();

/*Assign interface card constanr for update on successful response*/
const INTERFACECARD = document.getElementById('interface');

/*Event Listener for Client Side Form Processing, 'submit' form data to Google Places Text Search*/
FORM.addEventListener('submit',(e)=>{
  e.preventDefault();
  let searchQuery = POSTALCODE.value+' '+BUSINESS.value;
  SERVICE.textSearch({query: searchQuery}, getBusinessDetails);
});

/*Query the Google Places Library for Business Details*/
function getBusinessDetails(places,status){
  if (status === google.maps.places.PlacesServiceStatus.OK){
    for(let i=0; i<places.length; i++){
      let place = places[i];
      SERVICE.getDetails({
        placeId: place.place_id
      }, postBusinessDetails);
    }
  }
}

/*Post business details to the server for further processing*/
function postBusinessDetails(place,status){
  if(status === google.maps.places.PlacesServiceStatus.OK){
    let photos = [];
    /*fill array with photo links returned from google photo request*/
    if(place.photos !== undefined){
      for(let i =0; i<place.photos.length && i<5 ; i++){
        if(place.photos[i].getURL !== undefined){
          photos.push(place.photos[i].getURL({'maxHeight': 400}));
        }
        else{
          photos.push('http://lorempixel.com/1000/1000/business');
        }
      }
    }
    else{
      photos.push('http://lorempixel.com/1000/1000/business/No-Photo-Array-Returned');
    }

    /*Open a request to POST to 'index'*/
    XHR.open('POST','/', true);
    /*Request header must be set to application/JSON*/
    XHR.setRequestHeader('Content-Type','application/json');
    /*Stringify and Send the processed Business details and Photos*/
    XHR.send(JSON.stringify({
      'name':place.name,
      'formatted_address':place.formatted_address,
      'website':place.website,
      'formatted_phone_number':place.formatted_phone_number,
      'types':place.types,
      'photos':photos
    }));
    XHR.onreadystatechange = ()=>{
      if (XHR.readyState === 4 && XHR.status === 200) {
        INTERFACECARD.outerHTML=buildResultCard(XHR.responseText);
      }
    }
  }
}

function buildResultCard(place){
  place = JSON.parse(place);
  let resultCard = '<div class="col s12 m6" id="interface scale-transition">';
  resultCard+='<div class="card large hoverable">';
  if(place.photos[0].imgURL){
    /* TODO: Impliment image car on card, tabs will be dynamically created. Need images first. :'( */
    resultCard+='<div class="card-image"><img src="'+place.photos[0].imgURL+'"></div>';
  }
  resultCard+='<div class="card-content">';
  resultCard+='<span class="card-title activator grey-text text-darken-4">'+place.name+'<i class="material-icons right">more_vert</i></span>';
  resultCard+='</div>';
  resultCard+='<div class="card-reveal">';
  resultCard+='<span class="card-title grey-text text-darken-4">'+place.name+'<i class="material-icons right">close</i></span>';
  resultCard+='<h5>Business Details</h5>'
  resultCard+='<p><i class="tiny material-icons">business</i>\t'+place.formatted_address+'</br>';
  resultCard+='<i class="tiny material-icons">phone</i>\t'+place.formatted_phone_number+'</br>';
  resultCard+='<a href="'+place.website+'" target="_blank"><i class="tiny material-icons">web</i>\t'+place.website+'</a></br></p>';
  resultCard+='<h5>Image Tags</h5>'
  for(let x = 0; x<place.photos[0].tags.length; x++){
    resultCard+= '<div class="chip">'+place.photos[0].tags[x].name+'</div>';
  }
  resultCard+='</div>';
  resultCard+='<div class="card-action"><a href="/">Start Over?</a>';
  for(var i = 0; i<place.types.length;i++){
    resultCard+= '<div class="chip">'+place.types[i]+'</div>';
  }
  resultCard+='</div>';
  resultCard+='</div>';
  resultCard+='</div>';
  return resultCard;
}