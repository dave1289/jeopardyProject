const gameBoard = [
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
[[],[],[],[],[],[]],
]




let cats = []
let clues = [[],[],[],[],[],[]]

async function getCategories() {
    cats = []
    const res = await axios.get(`https://jservice.io/api/categories?count=6&offset=${Math.floor(Math.random() * 123 +100)}`);
    const categories = res.data
    for (item of categories) {
        let title = item.title;
        let id = item.id;
        cats.push({title, id});
    }
}

function populateCats(){
    for (let i = 0; i < 6; i++) {
        $(`#column${i}`).text(cats[i].title)
    }
}

async function pullClues(arr){
    clues = [[],[],[],[],[],[]]
    for (let i = 0; i< 6; i++) {
        const res = await axios.get(`https://jservice.io/api/category?id=${arr[i].id}`)
        const clueData = res.data.clues
        clues[i].push(clueData)
    }
}

function clearBoard() {
    const divs = document.querySelectorAll('.card-body');
    for (div of divs) {
        div.textContent = ''
        div.classList.remove('answer')
        div.classList.remove('question')
    }
}

$('#start').on('click',async function(e){
    $('.loader').css('display', 'block')
    getCategories();
    setTimeout(function(){
        pullClues(cats);
        populateCats();
        $('.loader').css('display', 'none')
    $('#game-board').css('display', 'inline-block')
    },500)
})

$('#refresh').on('click', function(){
    $('.loader').css('display', 'block')
    setTimeout(function(){
        $('.loader').css('display', 'none')
    $('#game-board').css('display', 'none')
    clearBoard();
    },200)
})

$('.card').on('click', function(e){
    const focus = e.target;
   const column = e.target.dataset.col;
   const row = e.target.dataset.row;
   if (!focus.classList.contains('question')){
   try {
       focus.textContent = clues[column][0][row].question;
       focus.classList.toggle('question')
   }
   catch {
    focus.textContent = 'Question error - category too short.'
   }
}
   else {
    focus.textContent = clues[column][0][row].answer
    focus.classList.add('answer');
   }
})