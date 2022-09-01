$(document).ready(function(){
  new Template('content.json');
});

function initZoom() {
  $('.zoom').zoom({ on:'grab' });
}


class Template {
  constructor(contentFile) {
    this.init(contentFile);
  }

  init(contentFile) {
    this.#loadContent(contentFile, getUrlParameter('page')).then((pageContent) => {
      this.#setPageContent(pageContent)
    }).catch(error => console.error(`Error. ${error}`));
  }

  #loadContent(file, pageId) {
    return new Promise((resolve, reject) => {
      if (!pageId) {
        reject('Invalid URL parameter. Page is not defined.');
        return;
      }

      $.get( file, function( content ) {
        if (!content) {
          reject('Content file not is not found.');
          return;
        }

        let pageContent = content.find(page => page.id === pageId);
        if(!pageContent) {
          reject( `Page content is not found for id ${pageId}`);
          return;
        }

        resolve(pageContent);
      });
    })
  }

  #setPageContent(page) {
    this.#setImage(page.imgUrl);
    $( "#titleContent" ).html( page.title );
    $( "#copyrightContent" ).html( page.copyright );
    $( "#mainContent" ).html( page.content );
  }

  #setImage(imgUrl) {
    const img = new Image();
    img.onload = function() {
      // console.log('onload', this.width + ', ' + this.height);
      initZoom();
    }
    img.src = imgUrl;
    img.className = 'locsize';

    $('#mainImageWrapper').append(img);
  }
}

function getUrlParameter(sParam) {
  let sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
  return false;
}
