//Pulls random question from API based on value and category **MUST IMPLEMENT THIS**
let catQuestions = []
let gameCats = []
let catIds = []
let guesses = [[],[],[],[],[],[]]
function randQuestion(clues, column) {
    let x = Math.floor(Math.random()*clues.length)
    guesses[column].push(x)
    return clues[x].question
}


//pulls starting categories for game
async function getCategories(){
    const res = await axios.get('https://jservice.io/api/categories?count=100&offset=1262')
    gameCats = []
    const dupeChk = []
    const catsFinal = []
    const catsRaw = res.data;
    for (item of catsRaw) {
        let title = item.title;
        let id = item.id;
        catsFinal.push({title, id});
    }
    for (let i = 0; i < 6; i++) {
        let item = Math.floor(Math.random()*101);
        dupeChk.push(item);
        if (dupeChk.indexOf(item) !== -1) {
            Math.floor(Math.random() * 101)
        }
        newCat = catsFinal[item];
        gameCats.push(newCat);
    }
    //extractCatId pulls ID info from gameCategories array, may streamline this into one function later
    extractCatId(gameCats)
    populateCats();
    //adds category questions into arrays(indexes match column values which return on click)
    Promise.all(categoryQuestionPull())
    newCat = ''
}

async function categoryQuestionPull() {
    catQuestions = []
    for (id of catIds) {
    const res = await axios.get(`https://jservice.io/api/category?id=${id}`)
    const clues = [res.data];
    catQuestions.push(clues)}
}

function populateCats(){
    for (let i = 0; i < 6; i++) {
        $(`#column${i}`).text(gameCats[i].title)
    }
}

function extractCatId(array){
    catIds = []
    for (cats of array) {
        catIds.push(cats.id);   
    }
    return catIds
}

//start handler
$('#start').on('click',async function(e){
    $('.loader').css('display', 'block')
    e.preventDefault();
    getCategories();
    setTimeout(function(){
        $('.loader').css('display', 'none')
    $('#game-board').css('display', 'inline-block')
    },500)
})

$('#refresh').on('click', function(){
    $('.loader').css('display', 'block')
    setTimeout(function(){
        $('.loader').css('display', 'none')
    $('#game-board').css('display', 'none')
    },200)
})

//question click handler
//currently pulls a random question without cateogry (IMPLEMENT) and does nothing else.
//must implement further changes
$(".card").on('click', function(e){
    //pulls column number from clicked card for category, col # is id index of catIds
    let focus = e.target;
    let column = e.target.dataset.col;
    let category = catQuestions[column];
    let clues = category[0].clues
    focus.textContent = randQuestion(clues, column)
})