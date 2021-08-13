var size = 0;
async function fades(id) {
  var e = document.getElementById(`${id}`);
  setInterval(function () {
    if (!e.style.opacity) {
      e.style.opacity = 1;
    }
    if (e.style.opacity > 0) {
      e.style.opacity -= 0.77;
    } else {
      clearInterval(e);
      remove(`${id}`);
      header(--size);
    }
  }, 100);
}

function remove(id) {
    var removediv = document.getElementById(`${id}`);
    removediv.parentNode.removeChild(removediv);
  }

function addCode(title, image, id) { 
    document.getElementById("pic_API").insertAdjacentHTML("afterbegin", 

    `
    <div id = "id${id}" class = "images_Meh" onclick = "fades('id${id}')">
        <div class = "cardImg">
            <img id = "image" src = "${image}.png"/>
        </div>

        <div class = "Post_Req">
            <h3 id = "get_title"> ${title}</h3>
            <h5 id = "get_date"> size: 08/07/1997</h5>
            <h5 id = "get_author"> Author: Author</h5
            <h4 id = "description"> Man idk.
            <h5
    </div>
    `
    );

}

function header(size) {
    document.getElementById(
      "head"
    ).innerHTML = `<a id="author">Size: ${size}</a>`;
  }


async function main(){
    try{

        let response = await axios.get('https://jsonplaceholder.typicode.com/albums/2/photos')
        
        .then(x =>{
            x.data.forEach(element => {
                addCode(element.title,element.url,element.id);
            }); 
        })
    }
    catch(e){
        console.log("Error",e)
    }

   
}

main()