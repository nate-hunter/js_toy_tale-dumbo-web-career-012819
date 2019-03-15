const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    toyForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const toyName = event.target.name.value;
      const toyImage = event.target.image.value;

      if (toyName.trim() === '' && toyImage.trim() === '') {
        alert("You suck. Fill out the boxes.");
      } else {
        createToy(toyName, toyImage);
      }

    })
  } else {
    toyForm.style.display = 'none'
  }
})


// OR HERE!
const baseURL = "http://localhost:3000"
const toysURL = `${baseURL}/toys`

const toysDiv = document.querySelector('#toy-collection');


const makeToyElement = (toyObj) => {
  const eachToyDiv = document.createElement('div');
  eachToyDiv.className = 'card';

  const h2Tag = document.createElement('H2');
  h2Tag.innerText = toyObj.name;

  const imageTag = document.createElement('img');
  imageTag.src = toyObj.image;
  imageTag.className = 'toy-avatar';

  const pTag = document.createElement('p');
  pTag.innerText = `${toyObj.likes} Likes`;

  const btnTag = document.createElement('button');
  btnTag.innerText = 'Like <3';
  btnTag.className = 'like-btn';
  btnTag.id = toyObj.id;
  btnTag.dataset.likes = toyObj.likes;

  eachToyDiv.append(h2Tag, imageTag, pTag, btnTag);

  toysDiv.prepend(eachToyDiv);
};

const updateLikeTag = (toyObj) => {
  const btnTag = document.getElementById(toyObj.id);
  btnTag.dataset.likes = toyObj.likes;
  btnTag.parentElement.querySelector('p').innerText  = `${toyObj.likes} Likes`;
};

const getToys = () => {
  fetch(toysURL)
    .then(response => response.json())
    .then(renderedResp =>
      renderedResp.forEach(toyObj => makeToyElement(toyObj))
    )
};

const postObj = (name, image) => {
  return {  method: "POST",
  headers: {
    'Content-Type': "application/json",
    'Accept': "application/json"
  },
  body: JSON.stringify({
    "name": name,
    "image": image,
    "likes": 0
  })}
};

const updateLikeObj = (likeNum) => {
  return {  method: "PATCH",
  headers: {
    'Content-Type': "application/json",
    'Accept': "application/json"
  },
  body: JSON.stringify({
    "likes": parseInt(likeNum)+1
  })}
};

const createToy = (name, image) => {
  fetch(toysURL, postObj(name, image))
    .then(response => response.json())
    .then(data => makeToyElement(data));
};

const createLike = (id, likes) => {
  fetch(toysURL + `/${id}`, updateLikeObj(likes))
    .then(response => response.json())
    .then(data => updateLikeTag(data));
};

document.addEventListener('DOMContentLoaded', getToys);

toysDiv.addEventListener('click', (event) => {
  const target = event.target;
  if (target.className == 'like-btn') {
    createLike(target.id, target.dataset.likes);
  }
});
